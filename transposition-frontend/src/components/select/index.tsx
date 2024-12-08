import React from 'react';
import Select, { SingleValue } from 'react-select';

// General option type with a label and value
export interface OptionType {
    label: string;
    value: string;
}

// Props interface
interface SelectComponentProps {
    options: OptionType[];
    onChange: (option: SingleValue<OptionType>) => void;
    value: SingleValue<OptionType>;
    placeHolder?: string;
}

const SelectComponent: React.FC<SelectComponentProps> = ({
    options,
    onChange,
    value,
    placeHolder,
}) => {
    function handleChange(selectedOption: SingleValue<OptionType>) {
        onChange(selectedOption);
    }
    return (
        <div className="w-full">
            <Select
                options={options}
                value={value}
                onChange={handleChange}
                isSearchable={true}
                placeholder={placeHolder ?? 'Select an option'}
            />
        </div>
    );
};

export default SelectComponent;
