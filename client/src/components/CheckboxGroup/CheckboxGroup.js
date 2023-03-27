import React from "react";
import { Field } from "formik";

const CheckboxGroup = ({ name, options }) => {
  return (
    <>
      {options.map((option) => (
        <div key={option}>
          <label>
            <Field type="checkbox" name={name} value={option} />
            {option}
          </label>
        </div>
      ))}
    </>
  );
};

export default CheckboxGroup;
