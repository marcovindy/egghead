import React, { useContext, useEffect, useState } from "react";
import t from "../../../i18nProvider/translate";
import { Formik, Field } from "formik";
import AnimatedRadioCircle from "../../AnimatedRadioCircle/AnimatedRadioCircle";


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
    <label className={values[name] && !disabled ? "radio" : "radio disabled"}>
      <span>{t("correctAnswerLabel")}</span>
      <Field
        type="radio"
        name="correctAnswer"
        value={name}
        onChange={() => setFieldValue("correctAnswer", name)}
        checked={values.correctAnswer === name}
        disabled={!values[name] || disabled}
      />
      <AnimatedRadioCircle />
    </label>
  </div>
);

export default AnswerField;
