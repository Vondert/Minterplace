import { MetadataNFT } from "../modules/metadata";
import "../assets/styles/previewCard.css";

//Components props
interface PreviewCard{
    meta: MetadataNFT | null
}

const PreviewCard: React.FC<PreviewCard>= ({meta}) =>{
    return(
    <div>
        <label className="previewLabel">Preview</label>
        {meta ? (
          <div className="card">
              <div className="container">
                <img className="img" src={URL.createObjectURL(meta.image)}></img>
              </div>
              <label className="nameLabel">{meta.name}</label>
              <label className="symbolLabel">{meta.symbol}</label>
          </div>
          ) :(<div style={{backgroundColor: "#222222", width: "450px", height: "546px", borderRadius: "7px", marginTop: "40px", marginBottom: "40px"}}> </div>)
        }
    </div>
    )
}
export default PreviewCard;