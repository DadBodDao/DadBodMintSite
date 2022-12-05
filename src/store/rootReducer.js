import { combineReducers } from "redux";
import connectWalletModalSlice from "../components/KDAWallet/store/connectWalletModalSlice";
import kadenaSlice from "../components/KDAWallet/store/kadenaSlice";
import dadbodSlice from "./dadbodSlice";
import whitelistSlice from "./whitelistSlice";

const rootReducer = combineReducers({
  kadenaInfo: kadenaSlice,
  connectWalletModal: connectWalletModalSlice,
  dadbodInfo: dadbodSlice,
  whitelistInfo: whitelistSlice,
});

export default rootReducer;