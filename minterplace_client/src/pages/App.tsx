//React imports
import {useEffect, useMemo, useState} from 'react'
import {screen, fireEvent } from '@testing-library/react';
//CSS imports
import styles from '../assets/styles/App.module.css'
import '../assets/styles/walletButton.css';
//Solana imports
import {useAnchorWallet, useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
//Custom imports
import {getProgram, getProvider, getMetaplex} from "../modules/utils.js"
//Components imports
import Home from './Home.tsx';
import CreatingForm from './CreatingForm.tsx';
import MyNFTs from './MyNFTs.tsx';
const App = () => {
  const anchorWallet = useAnchorWallet();
  const solanaWallet = useWallet();

  const provider = useMemo(() => getProvider(anchorWallet), [anchorWallet]);
  const program = useMemo(() => getProgram(provider), [provider]);
  const METAPLEX = useMemo(() => getMetaplex(provider, solanaWallet), [provider, solanaWallet]);
  const [content, setContent] = useState<JSX.Element>(<Home/>);
  useEffect(()=>{
    setContent(<Home/>)
  }, [provider])
  
  //Navigation function
  const handleContentChange = (type: string) => {
    let walletButton;
    switch (type){
      case "home":
        setContent(<Home/>);
        break;
      case "create":
        if (provider && solanaWallet && program && METAPLEX) {
          setContent(<CreatingForm provider = {provider} program={program} metaplex={METAPLEX} handleContentChange={handleContentChange}/>);
          return;
        }
        setContent(<Home/>);
        walletButton = screen.getByText('Select Wallet');
        fireEvent.click(walletButton);
        break;
      case "show":
        if (provider && solanaWallet && program && METAPLEX) {
          setContent(<MyNFTs provider = {provider} program={program} metaplex={METAPLEX} handleContentChange={handleContentChange}/>);
          return;
        }
        setContent(<Home/>);
        walletButton = screen.getByText('Select Wallet');
        fireEvent.click(walletButton);
        break;
    }
  }
  
 
  return (
  <div>
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.logoDiv}>
          <img className={styles.logoImg} src="/logo.svg" onClick={() => handleContentChange("home")}/>
        </div>
        <div className={styles.headerButtonDiv}>
          <button className={styles.button} onClick={() => handleContentChange("home")}>Home</button>
          <button className={styles.button} onClick={() => handleContentChange("create")}>Create NFT</button>
          <button className={styles.button} onClick={() => handleContentChange("show")}>My NFTs</button>
          <button className={styles.button} onClick={() => alert("In development!")}>Market</button>
        </div>
        <div className={styles.walletButtonDiv}>
          <WalletMultiButton/>
        </div>
      </div>
    </header>
    {content}
    <footer className={styles.footerButtonDiv}>
        <button className={styles.button}>Community guidlines</button>
        <button className={styles.button}>Terms</button>
        <button className={styles.button}>Privacy Policy</button>
    </footer>
  </div>
);
}

export default App