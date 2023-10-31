import { useEffect, useState } from 'react';
import styles from '../assets/styles/CreatingForm.module.css'

//Component's props
interface AttributesForm{
    setAttributes: React.Dispatch<React.SetStateAction<{
      trait_type: string;
      value: string;
  }[]>>
}

const AttributesForm: React.FC<AttributesForm> = ({setAttributes}) =>{

  const [currentAttributes, setCurrentAttributes] = useState<{ trait_type: string; value: string }[]>([
    { trait_type: '', value: '' },
  ]);

  //Add attribute fields
  const addAttribute = () => {
    setCurrentAttributes([...currentAttributes, { trait_type: '', value: '' }]);
  };

  //Validate attributes
  const createAttribute = (currentAttributes: { trait_type: string; value: string }[]) => {
    const filteredAttributes = currentAttributes.map((attr) => {
      if((attr.trait_type !== ""))
      {
        return attr;
      }
      return undefined;
    });
    return [...filteredAttributes.filter((attr) => attr !== undefined)] as { trait_type: string; value: string }[];
  };

  //Remove attribute field
  const removeAttribute = (index: number) => {
    const updatedAttributes = [...currentAttributes];
    updatedAttributes.splice(index, 1);
    setCurrentAttributes(updatedAttributes);
  };

  //Handle attributes fields changing
  const handleAttributesChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, fieldName: string) => {
    const { value } = e.target;
    const allowedCharacters = /^[a-zA-Z0-9№#$\s]*$/;
    if (allowedCharacters.test(value)) {
      const updatedAttributes = [...currentAttributes];
      updatedAttributes[index] = { ...updatedAttributes[index], [fieldName]: value };
      setCurrentAttributes(updatedAttributes);
    }
  };

  useEffect(() => {
    setAttributes(createAttribute(currentAttributes));
  }, [currentAttributes]);  

  return(
      <div>
        <label className={styles.bigLabel}>Attributes</label>
        {currentAttributes.map((attr, index) => (
          <div key={index} style={{display: "flex"}}>
            {index == 0 ? (
              <div style={{display: "flex"}}>
                <div>
                  <label className={styles.smallLabel}>Trait type</label>
                  <input className={styles.modularInput} maxLength={40} autoComplete='off' type="text" name="trait_type" value={attr.trait_type} placeholder="'Type'"onChange={(e) => handleAttributesChange(e, index, 'trait_type')}/>
                </div>
                <div>
                  <label className={styles.smallLabel}>Value</label>
                  <input className={styles.modularInput} maxLength={40} type="text" name="value" placeholder="'Solarex'"  value={attr.value} onChange={(e) => handleAttributesChange(e, index, 'value')}/>
                </div>
                <img src="/remove.svg" style={{marginTop: "22px"}}className={styles.remove} onClick={() => removeAttribute(index)}/>
              </div>
            ) :(
              <div style={{display: "flex"}}>
                <div>
                  <input className={styles.modularInput} maxLength={40} autoComplete='off' type="text" name="trait_type" value={attr.trait_type} placeholder="'Type'"  onChange={(e) => handleAttributesChange(e, index, 'trait_type')}/>
                  <input className={styles.modularInput} maxLength={40} type="text" name="value" placeholder="'Solarex'" value={attr.value} onChange={(e) => handleAttributesChange(e, index, 'value')}/>
                </div>
                <div>
                  <img src="/remove.svg" className={styles.remove} onClick={() => removeAttribute(index)}/>
                </div>
              </div>
            )
            }
           
          </div>
        ))}
        <div style={{ textAlign: "right"}}>
          <button className={styles.add} onClick={addAttribute}>+ Add attribute</button>
        </div>
      </div>
    )
}

export default AttributesForm 

