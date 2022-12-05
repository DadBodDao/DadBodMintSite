import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import FlexColumn from '../Layout/FlexColumn';

function ReservedBods() {
  const reservations = useSelector(state => state.dadbodInfo.reservations);

  return (
    <div className="w-full flex flex-row space-x-2 justify-between place-items-center h-40">
      <FlexColumn className='flex-1'>
        <h1 className='text-purple-600 font-extrabold'>{reservations.length}</h1>
        <p className='text-xl'>Minted Bods</p>
      </FlexColumn>
    </div>
  )
}

export default ReservedBods
