import React from "react";
import './Badge.css';

const Badge = ({ level }) => {

    const badgeColors = [
        'red', '#548CFF', '#FFC947', '#7C96AB', '#3C486B', '#9A208C', '#2D2727', '#5D3891', '#FF8B13', 
    ];

    const getBadgeColor = (level) => {
        return badgeColors[level % badgeColors.length];
    };

    const badgeColor = getBadgeColor(level);

    const badgeStyle = {
        backgroundColor: badgeColor,
    };

    return (
        <span className="player-box-avatar-level" style={badgeStyle}>{level}</span>
    );
};

export default Badge;
