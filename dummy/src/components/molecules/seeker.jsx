import React, { useState, useEffect } from "react";
import Input from "../atoms/input";
import Button from "../atoms/button";
import CustomSelect from "../atoms/select";

function Seeker({ 
  inputName,
  inputPlaceholder, 
  btnName, 
  valueText,
  valueFeature,
  onChangeText,
  onChangeFeature,
  onClick,
  selectName,
  fields,
}) {
  const [type, setType] = useState("");
  const [options, setOptions] = useState([]);

  // Actualiza type y options cada vez que cambia valueFeature
  useEffect(() => {
    const selectedField = fields.find(f => f.name === valueFeature);
    if (selectedField) {
      setType(selectedField.type || "");
      setOptions(selectedField.options || []);
    // if (selectedField.type === "select") onChangeText("");

      console.log("Selected field options:", selectedField.options);
      console.log("campos:", fields);
      console.log("valueValueText:", valueText);
    }
  }, [valueFeature, fields]);

  return (
    <div className="flex flex-wrap items-center gap-3 bg-white shadow-md rounded-2xl px-4 py-3 w-full max-w-3xl mx-auto">
      
      {/* Primer Select */}
      <div className="flex-1 min-w-[150px]">
        <CustomSelect 
          selectLabel={selectName}
          fields={fields}
          value={valueFeature}
          onChange={(e) => onChangeFeature(e.target.value)}
        />
      </div>

      {/* Segundo Select dinámico o Input */}
      {type === "select" ? (
        <div className="flex-1 min-w-[200px]">
          <CustomSelect
            selectLabel={inputPlaceholder}
            fields={options}
            value={valueText}
            onChange={(e) => onChangeText(e.target.value)}
          />
        </div>
      ) : (
        <div className="flex-1 min-w-[200px]">
          <Input 
            name={inputName}
            value={valueText}
            onChange={(e) => onChangeText(e.target.value)}
            placeholder={inputPlaceholder}    
          />
        </div>
      )}

      {/* Botón */}
      <div>
        <Button 
          text={btnName}
          onClick={() => onClick(valueFeature, valueText)}
        />
      </div>
    </div>
  );
}

export default Seeker;
