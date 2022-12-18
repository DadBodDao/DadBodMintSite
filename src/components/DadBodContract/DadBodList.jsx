import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
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

  return (
    <FlexRow className='w-full flex-1 gap-2 justify-around place-items-center '>
      {dadbodRenders.length >= 0 ? dadbodRenders 
      :
      <span>You don't own any dadbods</span>}
      
    </FlexRow>
  )
}

export default DadBodList
