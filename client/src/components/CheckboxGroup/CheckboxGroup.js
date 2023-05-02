import React from "react";
import { Field } from "formik";
import "../../assets/styles/CheckBox/CheckBox.css";

const CheckboxGroup = ({ name, options }) => {
  const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const optionsChunks = chunkArray(options, 3);

  return (
    <>
      {optionsChunks.map((chunk, chunkIndex) => (
        <div key={`chunk-${chunkIndex}`} className="row w-100 pt-1 pb-1">
          {chunk.map((option) => (
            <div className="col-md-4 p-2" key={option}>
              <label className="d-flex justify-content-between p-2 ">
                <span className="p-2 cursor-pointer">{option}</span>
                <div>
                  <Field
                    type="checkbox"
                    id={option}
                    name={name}
                    value={option}
                  />
                  <div className="square wh-0 w-40px mt-0">
                    <div className="square--inner square--inner__1"></div>
                    <div className="square--inner square--inner__2"></div>
                    <div className="square--inner square--inner__3"></div>
                    <div className="square--inner square--inner__4"></div>
                    <div className="square--inner square--inner__5"></div>
                    <div className="square--outer"></div>
                  </div>
                  <svg className="wh-0 w-40px mt-0">
                    <defs>
                      <filter id="eggFil">
                        <feGaussianBlur
                          in="SourceGraphic"
                          result="blur"
                          stdDeviation="3"
                        />
                        <feColorMatrix
                          in="blur"
                          mode="matrix"
                          values="
            1 0 0 0 0
            0 1 0 0 0
            0 0 1 0 0
            0 0 0 18 -7
          "
                          result="eggFil"
                        />
                        <feBlend in2="eggFil" in="SourceGraphic" result="mix" />
                      </filter>
                    </defs>
                  </svg>
                </div>
              </label>
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

export default CheckboxGroup;
