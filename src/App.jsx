import './App.css'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import KadenaEventListener from './components/KDAWallet/components/KadenaEventListener';
import { messageToastManager, txToastManager, walletConnectedToastManager } from './components/TxToast/TxToastManager';
import { useEffect } from 'react';
import dadbodSlice, { initDadbodAccountData, initDadbodContractData } from './store/dadbodSlice';
import { useDispatch, useSelector } from 'react-redux';
import whitelistSlice, { initWhitelistAccountData } from './store/whitelistSlice';
import CustomButton from './components/Layout/CustomButton';
import { showConnectWalletModal } from './components/KDAWallet/store/connectWalletModalSlice';
import { disconnectProvider } from './components/KDAWallet/store/kadenaSlice';
import ConnectWalletModal from './components/KDAWallet/components/ConnectWalletModal';
import { DadBodLogo } from './assets';
import FlexColumn from './components/Layout/FlexColumn';
import DadBodContractRender from './components/DadBodContract/DadBodContractRender';
import MintRender from './components/DadBodContract/MintRender';
import ReservedBods from './components/DadBodContract/DadBodList';
import reduceToken from './components/KDAWallet/utils/reduceToken';
import DadBodList from './components/DadBodContract/DadBodList';

function App() {
  const chainId = import.meta.env.VITE_CHAIN_ID

  const dispatch = useDispatch();
  const account = useSelector(state => state.kadenaInfo.account);

  const initData = async () => {
    await dispatch(initDadbodContractData(chainId))
  }

  useEffect(() => {
    initData();
  }, []);

  const initAccount = async () => {
    dispatch(initDadbodAccountData(chainId, account));
    dispatch(initWhitelistAccountData(chainId, account));
  }

  useEffect(() => {
    if (account !== '') {
      initAccount()
    }
  }, [account]);

  const openModal = () => {
    dispatch(showConnectWalletModal());
  }

  const disconnect = () => {
    dispatch(disconnectProvider());
  }

  return (
    <FlexColumn className="gap-4">
      <div className="fixed left-2 bottom-2 rounded-md bg-slate-600 py-1 px-2">
        <span className="text-sm">Chain 1</span>
      </div>
      <ToastContainer />
      <KadenaEventListener
        onNewTransaction={txToastManager}
        onNewMessage={messageToastManager}
        onWalletConnected={walletConnectedToastManager}/>
      <ConnectWalletModal 
        modalStyle="border-white border-2 rounded-md py-4 px-8 shadow-lg min-w-max max-w-xl flex flex-col space-y-4 bg-slate-800"
        buttonStyle="border-white border-2 rounded-md h-auto px-10 py-2 hover:border-purple-300 active:border-purple-700 focus:border-purple-500 transition duration-150 ease-out"
      />
      <DadBodLogo width='100%' height='100%'/>
      <h1 className='mb-10 font-extrabold'>CLAIM YOUR BOD</h1>
      <DadBodContractRender/>

      {account === '' ? 
        <span className='text-xl font-bold'>Connect your wallet to see your DadBods</span> 
        : 
        <DadBodList/> }
      {account === '' ? <></> : <MintRender/>}

      <CustomButton
        className='flex-1'
        text={account === '' ? "Connect Wallet" : "Disconnect"}
        onClick={account === '' ? openModal : disconnect} />
      {account === '' ? <></> : <p>{reduceToken(account)}</p>}
      
    </FlexColumn>
  )
}

export default App
