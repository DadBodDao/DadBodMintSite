import { createSlice } from '@reduxjs/toolkit'
import { local } from '../components/KDAWallet/store/kadenaSlice';

export const whitelistSlice = createSlice({
  name: 'whitelistInfo',
  initialState: {
    contract: import.meta.env.VITE_CONTRACT_WHITELIST,
    collectionWhitelistFree: import.meta.env.VITE_COLLECTION_WHITELIST_FREE,
    collectionPublic: import.meta.env.VITE_COLLECTION_PUBLIC,
    availableFree: 0,
    availableDiscounts: 0,
    discount: 0.0
  },
  reducers: {
    setAvailableFree: (state, action) => {
      state.availableFree = action.payload;
    },
    setAvailableDiscounts: (state, action) => {
      state.availableDiscounts = action.payload;
    },
    setDiscount: (state, action) => {
      state.discount = action.payload;
    },
  },
})

export const { 
  setAvailableFree, setAvailableDiscounts, setDiscount
} = whitelistSlice.actions;

export default whitelistSlice.reducer;

export const initWhitelistAccountData = (chainId, account) => {
  return async function(dispatch, getState) {
    let contract = getState().whitelistInfo.contract;
    let collectionWhitelistFree = getState().whitelistInfo.collectionWhitelistFree;
    let collectionPublic = getState().whitelistInfo.collectionPublic;
    // Get the available free and discount for the user
    var pactCode = `[
      (${contract}.get-available-free "${collectionWhitelistFree}" "${account}")
      (${contract}.get-available-discounts "${collectionPublic}" "${account}")
      (${contract}.get-discount "${collectionPublic}" "${account}")
    ]`
    var result = await dispatch(local(chainId, pactCode, {}, [], 150000, 1e-8, true));
    // console.log(result);

    if (result.result.status = 'success') {
      // console.log(result.result.data);
      dispatch(whitelistSlice.actions.setAvailableFree(result.result.data[0]));
      dispatch(whitelistSlice.actions.setAvailableDiscounts(result.result.data[1]));
      dispatch(whitelistSlice.actions.setDiscount(result.result.data[2] * 100.0));
    }
    else {

    }
  }
}