//Custom imports
import { MetadataNFT, createMetaUri } from '../modules/metadata';
import {FormsProps, getUmi } from "../modules/utils"
//Solana imports
import {SystemProgram, SYSVAR_RENT_PUBKEY, Keypair} from '@solana/web3.js'
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
//Metaplex imports
import { findMasterEditionPda, findMetadataPda, MPL_TOKEN_METADATA_PROGRAM_ID} from '@metaplex-foundation/mpl-token-metadata';
import { publicKey } from '@metaplex-foundation/umi';
//CSS imports
import styles from "../assets/styles/CreatingForm.module.css";

//Components props
interface MintingForm extends FormsProps{
    meta: MetadataNFT,
}

const MintingForm: React.FC<MintingForm> = ({provider, program, metaplex, meta, handleContentChange}) => {
    //Mint function
    const mintNft = async () =>{
        try{
            //Mint keypair generate
            const mint = Keypair.generate();
            //Get umi
            const umi = getUmi(provider.wallet);
            //PDAs
            const userAta = await getAssociatedTokenAddress(mint.publicKey, provider.wallet.publicKey);
            const metadataAccount = findMetadataPda(umi, {mint: publicKey(mint.publicKey)})[0];
            const masterEditionAccount = findMasterEditionPda(umi, {mint: publicKey(mint.publicKey)})[0];
            //Metadata
            const uri = await createMetaUri(metaplex, meta);

            const metadata = {name: meta.name, symbol: meta.symbol, uri: uri};
            //Sending transaction
            const tx = await program.methods.mintNft(metadata.name, metadata.symbol, metadata.uri, 200).accounts({
                signer: provider.wallet.publicKey,
                mint: mint.publicKey,
                signerAta: userAta,
                metadata: metadataAccount,
                masterEdition: masterEditionAccount,
                tokenMetadataProgram: MPL_TOKEN_METADATA_PROGRAM_ID,
                tokenProgram: TOKEN_PROGRAM_ID,
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
                rent: SYSVAR_RENT_PUBKEY,
            }).signers([mint]).rpc();
            console.log(
                `mint nft tx: https://explorer.solana.com/tx/${tx}?cluster=devnet`
            );
            console.log(
                `minted nft: https://explorer.solana.com/address/${mint.publicKey}?cluster=devnet`
            );
            handleContentChange("show");
        }
        catch (error){
            alert(error);
        }
    }
    return(
        <div>
            <button className={styles.mint} onClick={mintNft}>Mint</button>
        </div>
    )
}
export default MintingForm