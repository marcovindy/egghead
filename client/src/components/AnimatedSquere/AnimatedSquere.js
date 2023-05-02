import React from "react";
import "./AnimatedSquere.css";
import "../../assets/styles/CheckBox/CheckBox.css";

const AnimatedSquere = () => {
  return (
    <>
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
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="3" />
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
    </>
  );
};

export default AnimatedSquere;
