//React imports
import React, {useEffect, useState } from 'react';
//Custom imports
import { MetadataNFT } from '../modules/metadata';
import { FormsProps } from "../modules/utils"
//Components imports
import MintingForm from '../components/MintingForm';
import ImageUpload from '../components/ImageUpload';
import PreviewCard from '../components/PreviewCard';
import InfoForm from '../components/InfoForm';
import AttributesForm from '../components/AttributesForm';
//CSS imports
import styles from '../assets/styles/CreatingForm.module.css'

const CreatingForm: React.FC<FormsProps> = ({provider, program, metaplex, handleContentChange}) => {

  const [name, setName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<File | undefined>(undefined);
  const [attributes, setAttributes] = useState<{ trait_type: string; value: string }[]>([]);
 

  const [meta, setMeta] = useState<MetadataNFT | null>(null);
  const [content, setContent] = useState<JSX.Element>( <div></div>);
  
  const handleFileChange = (file: File | undefined) => {
    setImage(file);
  };

  //Creating metadata function
  const createMeta = () => {
    if (name && symbol && image && provider) {
      const metadata: MetadataNFT = {
        name,
        symbol,
        description,
        image,
        attributes,
        creator: provider.wallet.publicKey
      }
      setMeta(metadata);
    } else {
      alert("Fill all fields marked with *");
    }
  }

  
  useEffect(() => {
    if (meta?.name != name || meta?.description != description || meta?.symbol != symbol || meta?.attributes != attributes){
      setMeta(null);
    }
    setContent(
    <div style={{display: "flex", marginTop: "40px"}}>
        <button className={styles.createPreview} onClick={createMeta}>Create preview</button>
        {meta && (
          <MintingForm program={program} provider={provider} metaplex={metaplex} meta={meta} handleContentChange={handleContentChange}/>
        )}
    </div>)
  }, [meta, name, symbol, description, image, attributes]);


  return (
    <div className={styles.body}>
      <div>
        <InfoForm name={name} setName={setName} symbol={symbol} setSymbol={setSymbol} description={description} setDescription={setDescription}/>
        <ImageUpload handleImageSelect={handleFileChange}/>
        <AttributesForm setAttributes={setAttributes}/>
        {content}
      </div>
      <div className={styles.verticalLine}></div>
      <PreviewCard meta = {meta}/>
    </div>
  );
};
export default CreatingForm;