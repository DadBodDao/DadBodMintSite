import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FlexColumn from '../Layout/FlexColumn';
import FlexRow from '../Layout/FlexRow';
import DadBodRender from './DadBodRender';

function DadBodList() {
  const reservations = useSelector(state => state.dadbodInfo.reservations);
  const userBods = useSelector(state => state.dadbodInfo.bods);
  const userBodUris = useSelector(state => state.dadbodInfo.bodUris);

  const [dadbodRenders, setDadbodRenders] = useState([]);

  useEffect(() => {
    var l = [];
    if (userBods.length === userBodUris.length) {
      for (var i = 0; i < userBods.length; i++) {
        // console.log(userBods[i].id);
        l.push(<DadBodRender key={`bod-${userBods[i].id}`} bod={userBods[i]} uri={userBodUris[i]}/>);
      }
    }

    // Add our reservations as super bods
    for (var i = 0; i < reservations.length; i++) {
      if (!reservations[i].minted) {
        // console.log(reservations[i].id);
        l.push(<DadBodRender key={`reservation-${reservations[i].id}`} reservation={reservations[i]}/>);
      }
    }

    setDadbodRenders(l);
    
  }, [reservations, userBods, userBodUris]);

  if (dadbodRenders.length > 0) {
    return (
      <FlexColumn className='gap-2'>
        <span className='text-xl font-bold'>Click on a DadBod to view the image and download it</span>
        <FlexRow className='w-full flex-1 gap-2 justify-around place-items-center '>
          {dadbodRenders}
        </FlexRow>
      </FlexColumn>
    );
  }
  else {
    return (
      <span className='text-xl font-bold'>You don't own any DadBods. Mint one! He will show up here!</span>
    );
  }
}

export default DadBodList
