import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useEffect, useState} from 'react'
import {Web3Auth} from '@web3auth/web3auth';
import { WALLET_ADAPTERS, CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { cosmos, InstallError } from "@cosmostation/extension-client";
import { SEND_TRANSACTION_MODE } from "@cosmostation/extension-client/cosmos";


const clientID ="BE8Aj_uSDOMsjzWj58KzVoDavC3yghwWIR4iFl7hv7IXgiGDBnBZypdveGq_OVP24Zt2S3n0iQkm5Y3y2ZV9SRg";

function App() {
 const [web3auth, setWeb3auth] = useState<Web3Auth |  null>(null)
 const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);


  useEffect(()=>{
    const init = async ()=>{
      try{

        const web3auth = new Web3Auth({
          clientId: clientID,
          chainConfig:{
            chainNamespace: CHAIN_NAMESPACES.OTHER,
            chainId:"autonomy",
            rpcTarget:"https://v2.rpc.wouo.autonomy.network/"
          }
        })

        const openLoginAdapter = new OpenloginAdapter({
          adapterSettings:{
            clientId: clientID,
            network:"testnet",
            uxMode: 'popup',
            loginConfig:{
              discord:{
                name:'Custom Auth Discord login',
                verifier: 'prithvidevs-discord',
                typeOfLogin: 'discord',
                clientId: '814419680500252682'
              }
            }
          }
        })

      web3auth.configureAdapter(openLoginAdapter)
      setWeb3auth(web3auth);
       await web3auth.initModal();


      }catch(error){
        console.error(error);
      }

    }
     
     init();
  },[])

const networkInfo = {
  name:"assetmantle",
  denom:"umntl",
  chainId: "mantle-1",
  decimal: 6,
}


  const login = async() =>{
    if(!web3auth){
      console.log("web3auth not initalized yet");
      return
    }

    const web3authProvider = await web3auth.connect()
    console.log("web3AuthProvider", web3authProvider);
    
  }

  const getPrivateKey = async() =>{
    if (!web3auth) {
      console.log("web3auth not initialized yet"); 
      return 
    }

    const privateKey = await web3auth.provider!.request({
      method: "private_key"
  });
    console.log("user privatekey",privateKey)
  }

  const getUserInfo = async() =>{
    if (!web3auth) {
      console.log("web3auth not initialized yet"); 
      return 
    }

    const user = await web3auth.getUserInfo();
    console.log(user);
  }

  const logout = async()=>{
    if (!web3auth) {
      console.log("web3auth not initialized yet"); 
      return 
    }

    await web3auth.logout()
  }


  const handleWalletExtension = async() =>{
    console.log("handle cosmostaion wallet extension")

    try{
      const provider = await cosmos()
      

      provider.onAccountChanged(() => console.log("changed"));

      const chains = await provider.getSupportedChains()
      console.log(chains)

    


      // Request Account 
      const account = await provider.requestAccount(networkInfo.chainId);
      console.log(account)
    
      const activatedChains = await provider.getSupportedChainIds();
      console.log(activatedChains)

      // Sign Message
      const response = await provider.signAmino(
        networkInfo.name,
        {
          chain_id: networkInfo.chainId,
          fee: { amount: [{ denom: networkInfo.denom, amount: "5000" }], gas: "200000" },
          memo: "test account",
          msgs: [
            {
              type: "cosmos-sdk/MsgSend",
              value: {
                from_address: account.address,
                to_address: account.address,
                amount: [{ denom: networkInfo.denom, amount: "5000" }],
              },
            },
          ],
          sequence: "1",
          account_number: "12",
        },
        { memo: true, fee: true } // edit | optional (default: { memo: false, fee: false }),
      );
      
      console.log(response)

      

      const txResponse = await provider.sendTransaction(
        networkInfo.name,
        response.toString(), // base64 string or Uint8Array
        SEND_TRANSACTION_MODE.BLOCK /* SEND_TRANSACTION_MODE or one of [0, 1, 2, 3] */
      );

      console.log(txResponse)


    }catch(e:any){
      if (e instanceof InstallError){
        console.log("not Installed")
      }
      if (e.code === 4001){
        console.log("user rejected request");
      }
      console.log(e)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        <button onClick={login} className="card">
      Login
    </button>

        <button onClick={getPrivateKey}>
        getPrivateKey
      </button>

      <button onClick={getUserInfo}>
        getUserInfo
      </button>

      <button onClick={logout} className="card">
        Log Out
      </button>

      <button onClick={handleWalletExtension} className="card">
        Connect CosmostationWallet
      </button>


      </header>
    </div>
  );
}

export default App;
