import React from "react";
import { Field } from "formik";
import './CheckBoxGroup.css';

const CheckboxGroup = ({ name, options }) => {
  return (
    <>
      {options.map((option) => (
        <div className="p-2" key={option}>
          <label>
            {option}

            <Field type="checkbox" id={option} name={name} value={option} />
            <div className="square">
                <div className="square--inner square--inner__1" ></div>
                <div className="square--inner square--inner__2" ></div>
                <div className="square--inner square--inner__3" ></div>
                <div className="square--inner square--inner__4" ></div>
                <div className="square--inner square--inner__5" ></div>
                <div className="square--outer" ></div>
            </div>
            <svg className="h-0">
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
                        <feBlend
                            in2="eggFil"
                            in="SourceGraphic"
                            result="mix"
                        />
                    </filter>
                </defs>
            </svg>
          </label>
        </div>
      ))}
    </>
  );
};

export default CheckboxGroup;
