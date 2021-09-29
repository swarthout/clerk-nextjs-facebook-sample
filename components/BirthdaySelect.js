import React from "react";
import Select from "react-select";
import { Controller } from "react-hook-form";

export const BirthdaySelect = ({ name, options, control, className }) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value, name, ref } }) => (
        <Select
          inputRef={ref}
          options={options}
          value={options.find((c) => c.value === value)}
          className={className}
          onChange={(val) => onChange(val.value)} />
      )} />
  );
};
