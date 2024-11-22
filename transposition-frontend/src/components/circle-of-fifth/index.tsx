import React, { useEffect, useState } from 'react';

import './circleOfFifth.css';
import Staff from '../staff';
import { scaleBuilder } from '../../utils/scaleBuilder';

const MAX_ORIGIN_KEY = 11;
const MAX_NOTE = 16;
const MAX_TARGET_KEY = 11;
const MAX_MODE = 6;

function CircleOfFifth() {
    const circlePositions = [
        { angle: 0, majorScales: [scaleBuilder(0, 0)] },
        { angle: 30, majorScales: [scaleBuilder(10, 0)] },
        { angle: 60, majorScales: [scaleBuilder(3, 0)] },
        { angle: 90, majorScales: [scaleBuilder(13, 0)] },
        { angle: 120, majorScales: [scaleBuilder(6, 0)] },
        { angle: 150, majorScales: [scaleBuilder(16, 0)] },
        { angle: 180, majorScales: [scaleBuilder(8, 0), scaleBuilder(9, 0)] },
        { angle: 210, majorScales: [scaleBuilder(1, 0), scaleBuilder(2, 0)] },
        { angle: 240, majorScales: [scaleBuilder(11, 0), scaleBuilder(12, 0)] },
        { angle: 270, majorScales: [scaleBuilder(4, 0), scaleBuilder(5, 0)] },
        { angle: 300, majorScales: [scaleBuilder(14, 0), scaleBuilder(15, 0)] },
        { angle: 330, majorScales: [scaleBuilder(7, 0)] },
    ];
    return (
        <div className="circle-of-fifth">
            {circlePositions.map(({ angle }, i) => (
                <>
                    <div
                        className="circle-outer"
                        style={{
                            transform: `rotate(${angle}deg)`,
                            filter: `${i % 2 === 0 ? 'brightness(1.07)' : ''}`,
                        }}
                    ></div>
                    <div
                        className="circle-outer__content-container"
                        style={{ transform: `rotate(${angle}deg)` }}
                    >
                        <div
                            className="circle-outer__content"
                            style={{ transform: `rotate(-${angle}deg)` }}
                        >
                            {circlePositions[i].majorScales.map((scale, k) => (
                                <Staff
                                    key={k}
                                    displayedNotes={[]}
                                    musicalKey={scale.key}
                                />
                            ))}
                        </div>
                    </div>
                </>
            ))}
            {circlePositions.map(({ angle }, i) => (
                <>
                    {/*<div*/}
                    {/*    className="circle-inner"*/}
                    {/*    style={{*/}
                    {/*        transform: `rotate(${angle}deg)`,*/}
                    {/*        filter: `hue-rotate(-${angle}deg)`,*/}
                    {/*    }}*/}
                    {/*></div>*/}
                    <div
                        className="circle-inner__content-container"
                        style={{ transform: `rotate(${angle}deg)` }}
                    >
                        <div
                            className="circle-inner__content"
                            style={{ transform: `rotate(-${angle}deg)` }}
                        >
                            <p>{i}</p>
                        </div>
                    </div>
                </>
            ))}
            <div className="circle-center"></div>
        </div>
    );
}

export default CircleOfFifth;
