import React from 'react';
import { Note, NOTES } from '../../utils/notes';
import Button from '../button';
import './../../styles/output.css';
import { useIsMobile } from '../../hooks/useIsMobile';
import './staff.css';
import TrebleClef from './../../assets/images/treble_clef.png';

type StaffProps = {
    displayedNotes: number[];
};

function Staff({ displayedNotes }: StaffProps) {
    return (
        <div className="staff">
            <div className="staff__lines">
                {new Array(5).fill(0).map((_, i) => (
                    <div key={i} className="staff__line" />
                ))}
            </div>
            <div className="staff__content">
                <div className="staff__content__clef">
                    <img
                        src={TrebleClef}
                        alt="treble clef"
                        className="staff__content__clef__png"
                    />
                </div>
                <div className="staff__content__signature"></div>
                <div className="staff__content__notes"></div>
            </div>
        </div>
    );
}

export default Staff;
