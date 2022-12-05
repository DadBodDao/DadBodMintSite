import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { mintDiscountedBod, mintFreeBod, mintNormalBod } from '../../store/dadbodSlice';
import CustomButton from '../layout/CustomButton'
import FlexColumn from '../Layout/FlexColumn';

function MintRender() {
  const chainId = import.meta.env.VITE_CHAIN_ID

  const dispatch = useDispatch();
  const account = useSelector(state => state.kadenaInfo.account);
  const dadbodCollectionData = useSelector(state => state.dadbodInfo.collectionDataPublic);
  const availFree = useSelector(state => state.whitelistInfo.availableFree);
  const availDiscounts = useSelector(state => state.whitelistInfo.availableDiscounts);
  const discount = useSelector(state => state.whitelistInfo.discount);

  const [supply, setSupply] = useState(9001);
  const [price, setPrice] = useState(0.0);
  const [bodsLeft, setBodsLeft] = useState(1000);
  const [nextPrice, setNextPrice] = useState(0.0);

  useEffect(() => {
    if (Object.keys(dadbodCollectionData).length === 0) {
      return;
    }

    console.log(dadbodCollectionData);
    let tranches = dadbodCollectionData['tranches'];
    let supplyMinted = dadbodCollectionData['supply-minted'];

    for (var i = 0; i < tranches.length; i++) {
      if (supplyMinted < tranches[i]['min-supply']) {
        if (i === 0) {
          setPrice(tranches[i]['price']);
          setBodsLeft(tranches[i + 1]['min-supply'] - supplyMinted);
          setNextPrice(tranches[i + 1]['price'])
        }
        else {
          setPrice(tranches[i - 1]['price']);
          setBodsLeft(tranches[i]['min-supply'] - supplyMinted);
          setNextPrice(tranches[i]['price'])
        }
        break;
      }
    }

    console.log(tranches, supplyMinted);
  }, [dadbodCollectionData]);

  useEffect(() => {
    console.log(availFree, availDiscounts);
  }, [availFree, availDiscounts]);

  const mintNormal = () => {
    dispatch(mintNormalBod(chainId, account, price));
  }

  const mintDiscount = () => {
    dispatch(mintDiscountedBod(chainId, account, price));
  }

  const mintFree = () => {
    dispatch(mintFreeBod(chainId, account, price));
  }

  return (
    <div className="w-full flex flex-row gap-2 justify-between place-items-center">
      <FlexColumn className="flex-1 gap-4">
        {availDiscounts === 0 ? 
          <CustomButton
            text="Mint"
            onClick={mintNormal}/>
        :
          <CustomButton
            text={`Mint (${discount}% Discount, ${availDiscounts} available)`}
            onClick={mintDiscount}/>
        }
        {availFree > 0 ? 
          <CustomButton
            text={`Claim Free (${availFree} available)`}
            onClick={mintFree}/> : <></>}
      </FlexColumn>
      
    </div>
  )
}

export default MintRender;
