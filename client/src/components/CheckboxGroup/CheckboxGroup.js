import React from "react";
import { Field } from "formik";
import "../../assets/styles/CheckBox/CheckBox.css";
import { Col } from "react-bootstrap";

const CheckboxGroup = ({ name, options }) => {
  return (
    <>
      <div className="row w-100 p-2">
        {options.map((option, index) => (
          <Col md={4} lg={6} xxl={4} sm={12} className="p-2" key={option}>
            <label className="cursor-pointer d-flex justify-content-between p-2 border-green background-green">
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
          </Col>
        ))}
      </div>
    </>
  );
};

export default CheckboxGroup;
