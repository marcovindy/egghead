import React, { useContext, useEffect, useState } from "react";
import t from "../../../i18nProvider/translate";
import { Formik, Field } from "formik";
import AnimatedRadioCircle from "../../AnimatedRadioCircle/AnimatedRadioCircle";
import { toast } from "react-toastify";

const AnswerField = ({
  index,
  answerIndex,
  name,
  label,
  disabled,
  values,
  setFieldValue,
}) => (
  <div>
    <label htmlFor={name}>{label}</label>
    <Field
      type="text"
      name={name}
      id={`${name}-${index}`}
      disabled={disabled}
    />
    <label
      className={values[name] && !disabled ? "checkbox" : "checkbox disabled"}
    >
      <span>{t("correctAnswerLabel")}</span>
      <Field
        type="checkbox"
        name={`isCorrect_${name}`}
        onChange={() =>
          setFieldValue(`isCorrect_${name}`, !values[`isCorrect_${name}`])
        }
        checked={values[`isCorrect_${name}`]}
        disabled={!values[name] || disabled}
      />
      <AnimatedRadioCircle />
    </label>
  </div>
);

export default AnswerField;
