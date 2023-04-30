import React from "react";
import './AnimatedRadiosquere.css';

const AnimatedSquere = () => {

    return (
        <>
            <div className="squere">
                <div className="squere--inner squere--inner__1" ></div>
                <div className="squere--inner squere--inner__2" ></div>
                <div className="squere--inner squere--inner__3" ></div>
                <div className="squere--inner squere--inner__4" ></div>
                <div className="squere--inner squere--inner__5" ></div>
                <div className="squere--outer" ></div>
            </div>
            <svg className="svg-radio">
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

export default AnimatedSquere;
