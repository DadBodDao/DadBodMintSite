import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { SuperBod } from '../../assets';
import FlexColumn from '../Layout/FlexColumn';

// https://test-dadbod-nfts.s3.us-west-2.amazonaws.com/dadbod-wl/0.png

function DadBodRender(props) {
  const { bod, uri, reservation } = props;
  const collections = useSelector(state => state.dadbodInfo.collections);
  const items = useSelector(state => state.dadbodInfo.items);

  const [rarities, setRarities] = useState([]);

  const createRarityRender = (item) => {
    let collection = item.collection;
    let percent = collections[collection]['total-supply'] / 10000.0;
    console.log(collection, collections[collection]['total-supply'], percent);
    return <span className='font-bold' key={item['ledger-id']}>{collection}: {(percent * 100).toFixed(2)}%<br/></span>;
  }

  useEffect(() => {
    console.log(collections);
    console.log(items);
    if (!bod || Object.entries(items).length === 0 || Object.entries(collections).length === 0) {
      return;
    }

    var itemList = ['item-head', 'item-eyes', 'item-body', 'item-hand-left', 'item-hand-right']
    var rars = [];
    console.log(bod);
    for (var i = 0; i < itemList.length; i++) {
      if (bod[itemList[i]] !== '') {
        rars.push(createRarityRender(items[bod[itemList[i]]]));
      }
    }

    setRarities(rars);
  }, [collections, items]);


  // If reservation, show the super bod
  if (reservation) {
    return (
      <div className='w-64'>
        <SuperBod width='100%' height='100%'/>
      </div>
    )
  }
  else if (bod) { // Otherwise, use the bod and uri to load in the actual bod
    // console.log('dadbod render uri', uri);
    return (
      <a href={`${uri}.png`} download={`dadbod.png`}>
        <div className='relative group w-64 h-64 rounded-md overflow-clip'>
          <img
            src={`${uri}.png`}
          />
          <div className='absolute inset-0 w-64 h-64 bg-black bg-opacity-80 opacity-0 group-hover:opacity-100 duration-300 p-2'>
            <span className=' text-xl font-bold mb-10'>{bod['ledger-id']}</span>
            <FlexColumn className=''>
              {rarities}
            </FlexColumn>
          </div>
        </div>
      </a>
      
    )
  }

  return (
    <FlexColumn className='flex-1'>
        
    </FlexColumn>
  )
}

export default DadBodRender
