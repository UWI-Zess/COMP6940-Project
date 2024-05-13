import React from 'react';

interface IframeComponentProps {
    src: string;
    title: string;
}

const IframeComponent: React.FC<IframeComponentProps> = ({ src, title }) => {
    return (
        <iframe
            src={src}
            title={title}
            style={{
                width: '100%',       // Takes full width of the container
                height: '80vh',      // Set to 80% of the viewport height, adjust as needed
                border: 'none',      // No border for a cleaner look
                backgroundColor: '#121212', // Dark background color
            }}
        />
    );
};

export default IframeComponent;
