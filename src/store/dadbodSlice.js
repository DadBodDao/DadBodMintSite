import { createSlice } from '@reduxjs/toolkit'
import { local, signAndSend } from '../components/KDAWallet/store/kadenaSlice';
import { createCap } from '../components/KDAWallet/utils/utils';

export const dadbodSlice = createSlice({
  name: 'dadbodInfo',
  initialState: {
    contract: import.meta.env.VITE_CONTRACT_DADBOD,
    collectionWhitelistFree: import.meta.env.VITE_COLLECTION_WHITELIST_FREE,
    collectionPublic: import.meta.env.VITE_COLLECTION_PUBLIC,
    bank: '',
    collectionDataWhitelistFree: {},
    collectionDataPublic: {},
    collections: {},
    reservations: [],
    bods: [],
    bodUris: [],
    items: {}
  },
  reducers: {
    setCollectionDataWhitelistFree: (state, action) => {
      state.collectionDataWhitelistFree = action.payload;
    },
    setCollectionDataPublic: (state, action) => {
      state.collectionDataPublic = action.payload;
    },
    setCollection: (state, action) => {
      state.collections[action.payload.name] = action.payload;
    },
    setBank: (state, action) => {
      state.bank = action.payload;
    },
    setReservations: (state, action) => {
      state.reservations = action.payload;
    },
    addReservation: (state, action) => {
      state.reservations.push(action.payload);
    },
    setBods: (state, action) => {
      state.bods = action.payload;
    },
    addBod: (state, action) => {
      state.bods.push(action.payload);
    },
    setBodUris: (state, action) => {
      state.bodUris = action.payload;
    },
    setItems: (state, action) => {
      state.items = action.payload;
    },
    setItem: (state, action) => {
      state.items[action.payload['ledger-id']] = action.payload;
    },
  },
})

export const { 
  setCollectionDataWhitelistFree, setCollectionDataPublic, setBods, addBod, setBodUris, setItems, addItem
} = dadbodSlice.actions;

export default dadbodSlice.reducer;

export const initDadbodContractData = (chainId) => {
  return async function(dispatch, getState) {
    let contract = getState().dadbodInfo.contract;
    let collectionWhitelistFree = getState().dadbodInfo.collectionWhitelistFree;
    let collectionPublic = getState().dadbodInfo.collectionPublic;
    // Get the available free and discount for the user
    var pactCode = `[
      (${contract}.get-all-collections)
      (${contract}.get-bank)
    ]`
    // console.log(pactCode);
    var result = await dispatch(local(chainId, pactCode, {}, [], 150000, 1e-8, true));
    // console.log(result);

    if (result.result.status = 'success') {
      let collections = result.result.data[0];
      // console.log('Collections', collections);
      for (var i = 0; i < collections.length; i++) {
        if (collections[i].name === collectionWhitelistFree) {
          // console.log('init dadbod, whitelist collection: ', collections[i]);
          dispatch(dadbodSlice.actions.setCollectionDataWhitelistFree(collections[i]));
        }
        else if (collections[i].name === collectionPublic) {
          // console.log('init dadbod, public collection: ', collections[i]);
          dispatch(dadbodSlice.actions.setCollectionDataPublic(collections[i]));
        }
        else {
          dispatch(dadbodSlice.actions.setCollection(collections[i]));
        }
      }
      dispatch(dadbodSlice.actions.setBank(result.result.data[1]));
    }
    else {
      toast.error(`Failed to load contract data, error: ${result.message}.`);
    }
  }
}

export const initDadbodAccountData = (chainId, account) => {
  return async function(dispatch, getState) {
    let contract = getState().dadbodInfo.contract;

    // Get the bods and items for the account
    var pactCode = `
      (let
        (
          (bods (${contract}.get-all-bods-for-account "${account}"))
          (get-uri 
            (lambda (in:object)
              (free.dadbod.get-uri-for-bod (at "collection" in) (at "id" in))
            )
          )
        )  
        [
          (${contract}.get-reservations-for-account "${account}")
          bods
          (${contract}.get-all-items-for-account "${account}")
          (map (get-uri) bods)
        ]
      )
    `
    var result = await dispatch(local(chainId, pactCode, {}, [], 150000, 1e-8, true));
    // console.log(result);

    if (result.result.status = 'success') {
      // console.log(result.result.data);
      dispatch(dadbodSlice.actions.setReservations(result.result.data[0]));
      dispatch(dadbodSlice.actions.setBods(result.result.data[1]));
      let items = result.result.data[2];
      for (var i = 0; i < items.length; i++) {
        console.log(items[i]['ledger-id']);
        dispatch(dadbodSlice.actions.setItem(items[i]));
      }
      dispatch(dadbodSlice.actions.setBodUris(result.result.data[3]));
    }
    else {
      toast.error(`Failed to load user data, error: ${result.message}.`);
    }
  }
}

export const mintNormalBod = (chainId, account, price) => {
  return async function(dispatch, getState) {
    let contract = getState().dadbodInfo.contract;
    let collectionPublic = getState().dadbodInfo.collectionPublic;
    let bank = getState().dadbodInfo.bank;

    // Get the bods and items for the account
    var pactCode = `(${contract}.reserve "${collectionPublic}" "${account}")`;
    var caps = [
      createCap("Gas", "Allows paying for gas", "coin.GAS", []),
      createCap("Transfer", "Allows sending KDA to the specified address", "coin.TRANSFER", [account, bank, price])
    ]
    // var result = await dispatch(local(chainId, pactCode, {}, caps, 3500, 1e-8, false, true));
    var result = await dispatch(signAndSend(chainId, pactCode, {}, caps, 3500, 1e-5));
    // console.log('Normal', result);

    // if (result.result.status = 'success') {
    //   console.log(result.result.data);
    // }
    // else {
    //   toast.error(`Failed to mint normal bod, error: ${result.message}.`);
    // }
  }
}

export const mintDiscountedBod = (chainId, account, price) => {
  return async function(dispatch, getState) {
    let contract = getState().dadbodInfo.contract;
    let collectionPublic = getState().dadbodInfo.collectionPublic;
    let bank = getState().dadbodInfo.bank;

    // Get the bods and items for the account
    var pactCode = `(${contract}.reserve-discount "${collectionPublic}" "${account}")`;
    var caps = [
      createCap("Gas", "Allows paying for gas", "coin.GAS", []),
      createCap("Transfer", "Allows sending KDA to the specified address", "coin.TRANSFER", [account, bank, price]),
      createCap("WL", "Allows decrementing your discounted mints", "free.dadbod-whitelist.OWNER", [account]),
    ]
    // var result = await dispatch(local(chainId, pactCode, {}, caps, 3500, 1e-8, false, true));
    var result = await dispatch(signAndSend(chainId, pactCode, {}, caps, 3500, 1e-5));
    // console.log('Discounted', result);

    // if (result.result.status = 'success') {
    //   console.log(result.result.data);
    // }
    // else {
    //   toast.error(`Failed to mint discount bod, error: ${result.message}.`);
    // }
  }
}

export const mintFreeBod = (chainId, account) => {
  return async function(dispatch, getState) {
    let contract = getState().dadbodInfo.contract;
    let collectionWhitelistFree = getState().dadbodInfo.collectionWhitelistFree;
    // console.log(collectionWhitelistFree);
    // let bank = getState().dadbodInfo.bank;

    // Get the bods and items for the account
    var pactCode = `(${contract}.reserve-free "${collectionWhitelistFree}" "${account}")`;
    // console.log(pactCode);
    var caps = [
      createCap("Gas", "Allows paying for gas", "coin.GAS", []),
      createCap("WL", "Allows decrementing your free mints", "free.dadbod-whitelist.OWNER", [account]),
      // createCap("Transfer", "Allows sending KDA to the specified address", "coin.TRANSFER", [account, "bank", price])
    ]
    // var result = await dispatch(local(chainId, pactCode, {}, caps, 3500, 1e-8, false, true));
    var result = await dispatch(signAndSend(chainId, pactCode, {}, caps, 3500, 1e-5));
    // console.log('Free', result);

    // if (result.result.status = 'success') {
    //   console.log(result.result.data);
    // }
    // else {
    //   toast.error(`Failed to mint free bod, error: ${result.message}.`);
    // }
  }
}

