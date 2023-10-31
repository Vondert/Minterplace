//React imports
import { useEffect, useState } from "react"
//Metaplex imports
import { PublicKey} from "@metaplex-foundation/js";
//Custom imports
import { FormsProps } from "../modules/utils"
//CSS imports
import styles from "../assets/styles/MyNFTs.module.css"

const MyNFTs: React.FC<FormsProps> = ({provider, metaplex, handleContentChange}) =>{
    const [tokens, setTokens] = useState([]);

    //Fetching tokens by owner
    useEffect(() => {
        const fetchData = async () => {
            /*@ts-ignore*/
            const tokenData = [];
            try {
                const t = await metaplex.nfts().findAllByOwner({
                    owner: metaplex.identity().publicKey,
                });
                const loadImages = async () => {
                    const tokenData = [];
                    for (const nft of t){
                        const metadata = await (await fetch(nft.uri as string)).json();
                        tokenData.push({
                            ...nft,
                            image: metadata.image,
                        });
                        //@ts-ignore
                        setTokens(tokenData);
                    }
                }
                loadImages();
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
            }
        };
      
        fetchData();
    }, [provider]);

    //Explorer window openning function
    const openExplorer = (mintAddress: PublicKey) => {
        const explorerUrl = `https://explorer.solana.com/address/${/*@ts-ignore*/mintAddress.toBase58()}?cluster=devnet`
        window.open(explorerUrl, "_blank", "noopener noreferrer");
    };

    return(
        <div style={{marginTop: "85px", marginBottom: "67px"}}>
            <label className={styles.tokensLabel}>My tokens</label>
            {tokens.length > 0 ? (
            <div className={styles.cardsBody}>
            {tokens.map(nft => (
                //@ts-ignore
                <div className={styles.card} key={/*@ts-ignore*/nft.address.toBase58()}>
                    <img className={styles.img} src= {/*@ts-ignore*/nft.image as string}/>
                    <label className={styles.nameLabel}>{/*@ts-ignore*/nft.name as string}</label>
                    <label className={styles.symbolLabel}>{/*@ts-ignore*/nft.symbol as string}</label>
                    <button className={styles.viewButton} onClick={() => {openExplorer(nft.mintAddress)}}>View on Explorer</button>
                </div>
            ))}
            </div>
            ) : (
                <div className={styles.messageBody}>
                    <div className={styles.labelsDiv}>
                        <label className={styles.messageLabel}>There are currently no NFTs</label>
                        <label style={{justifyContent: "flex-end"}} className={styles.messageLabel}>in your wallet</label>
                        <div className={styles.smallLabelDiv}>
                            <label className={styles.smallLabel}>You can create them right now</label>
                            <button className={styles.createNFT} onClick={() => handleContentChange("create")}>Create NFT</button>
                        </div>
                        
                    </div>
                </div>
            )}
        </div>
        
    )
}
export default MyNFTs