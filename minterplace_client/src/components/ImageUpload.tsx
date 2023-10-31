import { ChangeEvent, useState } from "react";
import styles from "../assets/styles/ImageUpload.module.css"

//Component's props
interface ImageUpload{
    handleImageSelect: (file: File | undefined) => void;
}
const ImageUpload: React.FC<ImageUpload> = ({handleImageSelect}) =>{
    const [imageUrl, setSelectedImage] = useState<string>("");
    const [imageName, setName] = useState<string>("");

    //Handle image uploading or deleting
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
    
          reader.onload = (event) => {
            const imageDataURL = event.target?.result as string;
            setSelectedImage(imageDataURL);
            setName(file.name);
          };
          reader.readAsDataURL(file);
        }
        handleImageSelect(file);
      };
    return(
    <div>
      <label className={styles.bigLabel}>Upload artwork*</label>
      {!imageUrl ? (
        <div className={styles.imageUpload}>
          <input type="file" id="upload-input" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }}/>
          <div>
            <label style={{cursor: "pointer"}} htmlFor="upload-input">
            <div className={styles.iconContainer}>
              <img className={styles.uploadIcon} src="/upload.svg"/>
              <label className={styles.smallLabel}>Upload Artwork</label>
              <label className={styles.formatLabel}>Supported file formats: ..png, .jpeg, .jpg</label>
            </div>
            </label>
          </div>
        </div>
      ) : (
        <div className={styles.imageView}>
          <div className={styles.imageContainer}>
            <img className={styles.image} id="image-preview" src={imageUrl} alt="Image Preview" />
          </div>
          <label className={styles.smallLabel}>{imageName}</label>
        </div>
      )
      }

    </div>
    )
}

export default ImageUpload