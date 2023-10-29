//Anchor imports
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MinterplaceProgram } from "../target/types/minterplace_program";
//Metaplex imports
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import {findMasterEditionPda, findMetadataPda, mplTokenMetadata, MPL_TOKEN_METADATA_PROGRAM_ID} from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {publicKey } from "@metaplex-foundation/umi";
import { Metaplex, bundlrStorage, keypairIdentity, toMetaplexFile} from "@metaplex-foundation/js";
//Solana imports
import { getAssociatedTokenAddress } from "@solana/spl-token";
import {TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID} from "@solana/spl-token";
//Node imports
import * as fs from 'fs';
import { assert } from "chai";

describe("minterplace", async () => {
  //Setting up provider
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  //Creating wallet and 
  const program = anchor.workspace.MinterplaceProgram as Program<MinterplaceProgram>;
  const user = provider.wallet as anchor.Wallet;

  const umi = createUmi("https://api.devnet.solana.com")
	.use(walletAdapterIdentity(user))
	.use(mplTokenMetadata());

  const METAPLEX = Metaplex.make(provider.connection)
  .use(keypairIdentity(user.payer))
  .use(bundlrStorage({
      address: 'https://devnet.bundlr.network',
      providerUrl: "https://api.devnet.solana.com",
      timeout: 60000
  }));
  
  //Mint generate
  const mint = anchor.web3.Keypair.generate();
  
  //Creating pdas
  const userAta = await getAssociatedTokenAddress(
    mint.publicKey,
    user.publicKey
  );
  let metadataAccount = findMetadataPda(umi, {
    mint: publicKey(mint.publicKey),
  })[0];
  let masterEditionAccount = findMasterEditionPda(umi, {
    mint: publicKey(mint.publicKey),
  })[0];

  it("Minted!", async () => {
    //Reading image
    const imgBuffer = fs.readFileSync("meta/test.png");
    const imgMetaplexFile = toMetaplexFile(imgBuffer, "test.png");
    //Uploading image and metadata to arweave
    const imgUri = await METAPLEX.storage().upload(imgMetaplexFile);
    const { uri } = await METAPLEX
    .nfts()
    .uploadMetadata({
        name: "Tester",
        symbol: "TST",
        description: "Testing",
        image: imgUri,
        properties: {
          files: [
            {
              uri: "image.png",
              type: "image/png"
            }
          ],
          category: "image",
          creators: [
            {
              address: "FBKiKFe3x71qtZ9TMZvA7Qt9Vc7WBAaQS7LsePpbxGbG",
              share:100
            }
          ]
        }
    });
    //Creating metadata object
    const metadata = {
      name: "Tester",
      symbol: "TST",
      uri: uri,
    };
    //Sending transction to our program
    const tx = await program.methods.mintNft(metadata.name, metadata.symbol, metadata.uri, 100).accounts({
      signer: user.publicKey,
      mint: mint.publicKey,
      signerAta: userAta,
      metadata: metadataAccount,
      masterEdition: masterEditionAccount,
      tokenMetadataProgram: MPL_TOKEN_METADATA_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    }).signers([mint]).rpc();
    //Printing links on explorer
    console.log(`mint nft tx: https://explorer.solana.com/tx/${tx}?cluster=devnet`);
		console.log(`minted nft: https://explorer.solana.com/address/${mint.publicKey}?cluster=devnet`);
    //Getting balance
    const userBalance = (await program.provider.connection.getTokenAccountBalance(userAta)).value.amount;
    console.log(user.publicKey.toBase58() + " balance " + userBalance);
    assert(parseInt(userBalance) == 1);
  });
});
