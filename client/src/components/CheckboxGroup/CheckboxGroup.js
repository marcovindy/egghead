import React from "react";
import { Field } from "formik";

const CheckboxGroup = ({ name, options }) => {
  return (
    <>
      {options.map((option) => (
        <div key={option}>
          <label for={option}>
            {option}
          </label>
          <Field type="checkbox" id={option} name={name} value={option} />
        </div>
      ))}
    </>
  );
};

export default CheckboxGroup;
