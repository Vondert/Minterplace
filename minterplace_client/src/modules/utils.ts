//Anchor imports
import { AnchorProvider, Program } from "@coral-xyz/anchor";
//Solana imports
import { AnchorWallet, WalletContextState } from "@solana/wallet-adapter-react";
import {Connection} from '@solana/web3.js'
//Metaplex imports
import {Metaplex, bundlrStorage, walletAdapterIdentity as walletAdapterIdentityMeta} from "@metaplex-foundation/js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { walletAdapterIdentity} from "@metaplex-foundation/umi-signer-wallet-adapters";
//Custom imports
import idl from './minterplace_program.json'

export interface FormsProps {
    provider: AnchorProvider,
    program: Program,
    metaplex: Metaplex,
    handleContentChange: (type: string) => void
}


export const getProvider = (wallet: AnchorWallet | undefined) => {
    if (!wallet){
        return undefined;
    }
    const network = "https://api.devnet.solana.com";
    const connection = new Connection(network, "processed");
    const prov = new AnchorProvider(connection, wallet, {"preflightCommitment": "processed"});
    return prov;
}

export const getProgram = (provider: AnchorProvider | undefined) =>{
    if (!provider){
        return undefined;
    }
    const prog = new Program(JSON.parse(JSON.stringify(idl)), idl.metadata.address, provider);
    return prog;
}

export const getMetaplex = (provider: AnchorProvider | undefined, wallet: WalletContextState) =>{
    if (!provider){
        return undefined;
    }
    return Metaplex.make(provider.connection)
    .use(walletAdapterIdentityMeta(wallet))
    .use(bundlrStorage({
          address: 'https://devnet.bundlr.network',
          providerUrl: "https://api.devnet.solana.com",
          timeout: 60000,
    }));
}

export const getUmi = (wallet: AnchorWallet) => {
    return createUmi("https://api.devnet.solana.com").use(walletAdapterIdentity(wallet)).use(mplTokenMetadata())
}