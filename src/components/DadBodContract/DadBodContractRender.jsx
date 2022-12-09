import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FlexColumn from '../Layout/FlexColumn';
import FlexRow from '../Layout/FlexRow';

function DadBodContractRender() {
  const dispatch = useDispatch();
  const account = useSelector(state => state.kadenaInfo.account);
  const dadbodCollectionData = useSelector(state => state.dadbodInfo.collectionDataPublic);

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

  return (
    <div className="w-full flex flex-row gap-2 justify-between place-items-center">
      <div className="h-28"/>
      <FlexRow className="w-full gap-10">
        <FlexColumn className="flex-auto w-64">
          {/* <p className='flex-1 text-5xl'>{price} $KDA</p> */}
          <h1 className='text-purple-500 font-extrabold'>{price} $KDA</h1>
          <p className='text-xl'>Current Price</p>
        </FlexColumn>
        <FlexColumn className="flex-auto w-64">
          {/* <p className='flex-1 text-5xl'>{bodsLeft}</p> */}
          <h1 className='text-red-500 font-extrabold'>{bodsLeft}</h1>
          <p className='text-xl'>Bods Left in Tranche</p>
        </FlexColumn>
      </FlexRow>
      
    </div>
  )
}

export default DadBodContractRender
