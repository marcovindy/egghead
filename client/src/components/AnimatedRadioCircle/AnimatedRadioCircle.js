import React from "react";
import './AnimatedRadioCircle.css';

const AnimatedRadioCircle = () => {

    return (
        <>
            <div className="circle">
                <div className="circle--inner circle--inner__1" ></div>
                <div className="circle--inner circle--inner__2" ></div>
                <div className="circle--inner circle--inner__3" ></div>
                <div className="circle--inner circle--inner__4" ></div>
                <div className="circle--inner circle--inner__5" ></div>
                <div className="circle--outer" ></div>
            </div>
            <svg>
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
        </>
    );
}

export default AnimatedRadioCircle;
