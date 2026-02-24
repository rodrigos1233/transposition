import React from 'react';
import Select, { SingleValue, StylesConfig } from 'react-select';

export interface OptionType {
  label: string;
  value: string;
}

interface SelectComponentProps {
  options: OptionType[];
  onChange: (option: SingleValue<OptionType>) => void;
  value: SingleValue<OptionType>;
  placeHolder?: string;
  compact?: boolean;
}

const compactStyles: StylesConfig<OptionType, false> = {
  control: (base) => ({
    ...base,
    minHeight: '28px',
    fontSize: '0.875rem',
    borderColor: '#e5e5e5',
    boxShadow: 'none',
    '&:hover': { borderColor: '#d4d4d4' },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '0 4px',
  }),
  input: (base) => ({
    ...base,
    margin: '0',
    padding: '0',
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: '2px',
  }),
  option: (base) => ({
    ...base,
    fontSize: '0.875rem',
    padding: '4px 8px',
  }),
  menu: (base) => ({
    ...base,
    zIndex: 20,
  }),
};

const SelectComponent: React.FC<SelectComponentProps> = ({
  options,
  onChange,
  value,
  placeHolder,
  compact = false,
}) => {
  function handleChange(selectedOption: SingleValue<OptionType>) {
    onChange(selectedOption);
  }
  return (
    <div className={compact ? 'min-w-[100px]' : 'w-full'}>
      <Select
        options={options}
        value={value}
        onChange={handleChange}
        isSearchable={!compact}
        placeholder={placeHolder ?? 'Select an option'}
        styles={compact ? compactStyles : undefined}
        menuPortalTarget={compact ? document.body : undefined}
      />
    </div>
  );
};

export default SelectComponent;
