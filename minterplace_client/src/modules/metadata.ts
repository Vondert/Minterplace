import { Metaplex, UploadMetadataInput, toMetaplexFileFromBrowser } from "@metaplex-foundation/js"
import {PublicKey} from '@solana/web3.js'

//Custom metadata type
export interface MetadataNFT{
    name: string
    symbol: string,
    description: string,
    image: File,
    attributes: { trait_type: string; value: string }[],
    creator: PublicKey
}

//Uploading image to arweave 
const createImageUri = async (metaplex: Metaplex, image: File) => {
    const imgMetaplexFile = await toMetaplexFileFromBrowser(image);
    const imgUri = await metaplex.storage().upload(imgMetaplexFile);
    return imgUri;
}

//Uploading metadata to arweave
export const createMetaUri = async (metaplex: Metaplex, meta: MetadataNFT) =>{
    const imageUri = await createImageUri(metaplex, meta.image);
    const metadata: UploadMetadataInput = {
        name: meta.name,
        symbol: meta.symbol,
        description: meta.description,
        image: imageUri,
        attributes: meta.attributes,
        properties: {
        files: [
            {
                uri: imageUri,
                type: meta.image.type
            },
        ],
        category: "image",
        creators: [
            {
                address: meta.creator.toBase58(),
                share:100
            }
        ]
        }
    }
    const { uri } = await metaplex.nfts().uploadMetadata(metadata);
    return uri;
}