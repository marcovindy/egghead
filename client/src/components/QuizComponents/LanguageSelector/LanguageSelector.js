import React, { useState } from "react";
import Select from "react-select";
import { updateQuizLanguage } from "../../../services/api";
import { toast } from "react-toastify";
import t from "../../../i18nProvider/translate";

const LanguageSelector = ({ quizInfo, setQuizInfo, languageOptions }) => {
  const getLanguageByValue = (value) => {
    return languageOptions.find((option) => option.value === value);
  };

  const [selectedLanguage, setSelectedLanguage] = useState(getLanguageByValue(quizInfo.language));

  const saveSelectedLanguage = async () => {
    updateQuizLanguage(
      quizInfo.id,
      selectedLanguage,
      localStorage.getItem("accessToken")
    )
      .then((response) => {
        if (response.message) {
          toast.success("Language updated successfully");
          setQuizInfo({ ...quizInfo, language: selectedLanguage });
        } else {
          toast.error("Failure updating language");
        }
      })
      .catch((error) => {
        console.error("Error updating language:", error);
      });
  };

  return (
    <>
      <Select
        value={getLanguageByValue(selectedLanguage)}
        options={languageOptions}
        onChange={(e) => setSelectedLanguage(e.value)}
      />
      <button className="a-button" onClick={saveSelectedLanguage}>
        {t("saveButton")}
      </button>
    </>
  );
};

export default LanguageSelector;
