
import React from 'react';

type IconType = 'snowflake' | 'fire' | 'projector' | 'board' | 'lock' | 'yoga' | 'bed' | 'music' | 'tools' | 'firstaid' | 'check' | 'star';

interface GenericIconProps {
    type: IconType;
}

export const GenericIcon: React.FC<GenericIconProps> = ({ type }) => {
    const iconPaths: { [key in IconType]: string } = {
        snowflake: "M13 22l-1-1-1 1H9l1-1-1-1-1 1-1-1-1 1H3l1-1-1-1-1 1V9l1-1-1-1-1 1V5l1-1-1-1-1 1V2h1l1 1 1-1h2l-1 1 1 1 1-1h2l-1 1 1 1 1-1h2l-1 1 1 1 1-1h2v1l-1 1 1 1-1 1v4l-1 1 1 1 1-1v4l-1 1 1 1 1-1h-1l-1-1-1 1h-2l1-1-1-1-1 1h-2z",
        fire: "M17.66 10.5C17.66 7.27 15.68 5.61 13 4.5C13 4.5 13.5 2 12 2C10.5 2 11 4.5 11 4.5C8.32 5.61 6.34 7.27 6.34 10.5C6.34 14.34 9.17 17.5 12 22C14.83 17.5 17.66 14.34 17.66 10.5Z",
        projector: "M4 4h16v12H4z M4 18h16v2H4z m4 -9h8v2H8z",
        board: "M4 4h16v12H4z M6 6h12v8H6z",
        lock: "M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z",
        yoga: "M12 2c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-7-6c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3-3 1.34-3 3z",
        bed: "M20 9H4v6h2v-4h12v4h2V9z m0-2H4c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2z M7 8h10v1H7z",
        music: "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z",
        tools: "M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6.1 6.1 9 1.3 4.2C.2 6.6-.2 9.6 1.8 11.6c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l3.5-3.5c.4-.4.4-1 0-1.4z",
        firstaid: "M18 4H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H7v-2h4V7h2v4h4v2z",
        check: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
        star: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
    };

    const className = type === 'star' ? 'w-5 h-5 text-yellow-500' : 'w-4 h-4 text-gray-500';

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d={iconPaths[type]}></path>
        </svg>
    );
};
