import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useEffect, useState} from 'react'
import {Web3Auth} from '@web3auth/web3auth';
import { WALLET_ADAPTERS, CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";



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
      </header>
    </div>
  );
}

export default App;
