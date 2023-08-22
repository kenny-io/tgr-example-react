import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {
  //1. Collect users wallet address
  //2. Define token gating rules
  //3. Check if user wallet has required tokens
  //4. If user has required tokens, allow access to content

  const [isGranted, setIsGranted] = useState(false);

  const walletAddress = localStorage.getItem('walletAddress');

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        console.log(accounts[0]);
        localStorage.setItem('walletAddress', accounts[0]);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const tokenGatingRule = [
    {
      chainId: 137,
      minToken: '1',
      contractAddress: '0x2953399124f0cbb46d2cbacd8a89cf0599974963',
      roleId: 'MEMBER_ROLE',
      type: 'ERC1155',
    },
  ];

  const checkRoles = async () => {
    const res = await fetch(
      `https://api.collab.land/access-control/check-roles`,
      {
        method: 'POST',
        headers: new Headers({
          Accept: 'application/json',
          'X-API-KEY': process.env.REACT_APP_COLLAB_KEY,
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          account: walletAddress,
          rules: tokenGatingRule,
        }),
      }
    );
    const data = await res.json();
    setIsGranted(data.roles[0].granted);
    console.log(data);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={connectWallet}> Connect Wallet </button>
        <button onClick={checkRoles}> Access Site </button>
        {isGranted ? <div> Access Granted </div> : <div> Access Denied </div>}
      </header>
    </div>
  );
}

export default App;
