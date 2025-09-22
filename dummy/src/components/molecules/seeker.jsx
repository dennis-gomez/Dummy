import Input from "../atoms/input";
import Button from "../atoms/button";
import CustomSelect from "../atoms/select";

function Seeker ({ 
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
    return (
        <div 
            className="flex flex-wrap items-center gap-3 bg-white shadow-md rounded-2xl px-4 py-3 w-full max-w-3xl mx-auto"
        >
            {/* Select */}
            <div className="flex-1 min-w-[150px]">
                <CustomSelect 
                    selectLabel={selectName}
                    fields={fields}
                    value={valueFeature}
                    onChange={(e) => onChangeFeature(e.target.value)}
                />
            </div>

            {/* Input */}
            <div className="flex-1 min-w-[200px]">
                <Input 
                    name={inputName}
                    value={valueText}
                    onChange={(e) => onChangeText(e.target.value)}
                    placeholder={inputPlaceholder}    
                />
            </div>

            {/* Botón */}
            <div>
                <Button 
                    text={btnName}
                    onClick={() => onClick(valueFeature, valueText)}
                />
            </div>
        </div>
    );
};

export default Seeker;
