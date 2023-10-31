import React, { ChangeEvent } from "react";
import styles from '../assets/styles/CreatingForm.module.css'

//Component's props
interface InfoForm{
    setName: React.Dispatch<React.SetStateAction<string>>,
    setSymbol: React.Dispatch<React.SetStateAction<string>>,
    setDescription: React.Dispatch<React.SetStateAction<string>>,
    name?: string,
    symbol: string,
    description: string
}

const InfoForm: React.FC<InfoForm> = ({name, setName, symbol, setSymbol, description, setDescription}) =>{
    //Handle name, symbol and description textboxes changing
    const handleTextBoxChange = (e: ChangeEvent<HTMLInputElement>, type: string) => {
        const text = e.target.value;
        const allowedCharacters = /^[a-zA-Z0-9№#$\s]*$/;
    
        if (allowedCharacters.test(text)) {
        switch (type){
            case "name":
              setName(text);
              break;
            case "symbol": 
              setSymbol(text);
              break;
            case "description":
              setDescription(text);
              break; 
          }
        }
       
    };
    return(
        <div>
            <label className={styles.bigLabel}>Info</label>
            <div>

                <label className={styles.smallLabel}>Name*</label>
                <input className={styles.inputR} maxLength={32} type="text" name="name" placeholder="'CryptoRex'" autoComplete='off' value={name} onChange={(e) => handleTextBoxChange(e, "name")}/>
                <label className={styles.smallLabel}>Symbol*</label>
                <input className={styles.inputR} maxLength={10} type="text" name="symbol" placeholder="'CRX'" autoComplete='off' value={symbol} onChange={(e) => handleTextBoxChange(e, "symbol")}/>
                <label className={styles.smallLabel}>Description</label>
                <input className={styles.input} maxLength={100} type="text" name="description" placeholder="'Solarex in front of the Lavender Field'" autoComplete='off' value={description} onChange={(e) => handleTextBoxChange(e, "description")}/>
            </div>
        </div>
    )
}
export default InfoForm;