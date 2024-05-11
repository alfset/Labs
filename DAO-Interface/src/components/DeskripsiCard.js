import React from 'react';

const DescriptionCard = ({ title, content }) => (
    <div className="bg-[#1e293b] text-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg text-white font-semibold mb-2">{title}</h3>
        <p className="text-white">{content}</p>
    </div>
);

export default DescriptionCard;
