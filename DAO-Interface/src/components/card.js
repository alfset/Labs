import React from 'react';

const Card = ({ title, value }) => (
    <div className="card bg-[#1e293b] text-white p-4 rounded-lg shadow-md">
        <h4 className="card-title text-xl font-semibold">{title}</h4>
        <p className="card-value text-3xl align-center">{value}</p>
    </div>
);

export default Card;
