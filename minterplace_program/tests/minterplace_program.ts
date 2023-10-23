import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MinterplaceProgram } from "../target/types/minterplace_program";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import {
	findMasterEditionPda,
	findMetadataPda,
	mplTokenMetadata,
	MPL_TOKEN_METADATA_PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { publicKey } from "@metaplex-foundation/umi";

import {
	TOKEN_PROGRAM_ID,
	ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
describe("minterplace", async () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.MinterplaceProgram as Program<MinterplaceProgram>;
  const user = provider.wallet;

  const umi = createUmi("https://api.devnet.solana.com")
	.use(walletAdapterIdentity(user))
	.use(mplTokenMetadata());

  const mint = anchor.web3.Keypair.generate();
  
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

  const metadata = {
    name: "Tester",
    symbol: "TST",
    uri: "https://github.com/Vondert/Minterplace/blob/main/minterplace_program/meta/test_meta.json",
  };

  it("Minted!", async () => {


    const tx = await program.methods.mintNft(metadata.name, metadata.symbol, metadata.uri).accounts({
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
    console.log(
			`mint nft tx: https://explorer.solana.com/tx/${tx}?cluster=devnet`
		);
		console.log(
			`minted nft: https://explorer.solana.com/address/${mint.publicKey}?cluster=devnet`
		);
  });
});
