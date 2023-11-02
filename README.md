# Minterplace - README
Welcome to Minterplace repository! This DApp uses Solana blockchain and Metaplex token standard for minting NFTs. 
Minterplace consists of two parts: a UI part and a program on the Solana blockchain with which the UI interacts.
This project simplifies the NFT mining process and brings the world of NFTs to the masses.

Features:
- Mint NFT with metadata.
- Metaplex token standard using.
- Arweave storage for storing metadata.
- Phantom wallet integration: use your phantom wallet to mint NFTs to it.
- View NFTs stored on your wallet (with further viewing on Solana Explorer).

Used thechnologies:
 - On-Chain:
   - Solana blockhain: handling transactions;
   - Anchor framework: simplyfies smart contracts developing; 
   - Solana token program: tokens creating;
   - Solana associated token program: associated token accounts creating;
   - Metaplex token metadata program: adding metadata to tokens.
 - Off-Chain:
   - React + TS: UI part;
   - Vite: building and running development server for website; 
   - Solana web3.js: interacting with solana blockchain;
   - Solana wallet adapter react: provides wallets integration (Phantom in this case);
   - Anchor framework: interacting with anchor smart contract;
   - Metaplex foundation: creating and uploading metadata;
   - Solana SPL token library: creating tokens.

Using:
If you want to setup project locally, then follow steps from Installation module.

Installation:
 - Prerequisites: Node.js, Phantom Wallet. 
 1. Clone the repository:
    - git clone https://github.com/Vondert/Minterplace.git
 2. Navigate to the project directory:
    - cd Minterplace
 3. Go to client directory:
    - cd competition/minterplace_client
 4. Install node packages:
    - npm install
 5. Run local server:
    - npm run dev
 
 Now using http://localhost:5173 link you can interact with your local version of Minterplace website. The last thing you need to do is to connect your Phantom wallet and enjoy NFT minting experience.

 Testing smart contract:
 - Attention: in the test all values and metadata are hardcoded, if you want to provide metadata use UI part.
 - Prerequisites: Anchor (coral-xyz), Solana cli, Local keypair with SOLs in devnet.
 - If you want manually to deploy your version of smart contract and test it, follow next steps:
 1. Move to progarm directory:
    - cd competition/minterplace_program
 2. Change wallet pass in Anchor.toml to your local keypair file:
    - ![image](https://github.com/Vondert/Minterplace/assets/95308300/e89d2273-4919-4db8-a9b0-0bbb935b154a)
 3.Set solana config to devnet:
    - solana config set devnet
 4. Build a program:
    - anchor build
 5. Deploy a program and copy program address from cli after deploying:
    - anchor deploy
 6. Change program address for new in lib.rs and Anchor.Toml.
    ![image](https://github.com/Vondert/Minterplace/assets/95308300/a8f7992c-9b0f-4830-b974-5f4d4e501fce)
    ![image](https://github.com/Vondert/Minterplace/assets/95308300/a9b25060-e12f-4cd5-8f2a-d87f648f52e4)
 7. Repeat steps 4 and 5.
 8. Run testing script:
    - anchor test
    ![image](https://github.com/Vondert/Minterplace/assets/95308300/f0c75a9f-e5f9-4c28-b7a0-c500e675600b)
 9. To connect your version of smart contract to your website change minterplace_program.json from client version to newly generated minterplace_program.json in program 




 
