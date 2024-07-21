import React from 'react';
import './Card.css';

interface CardProps {
  title: string;
  description: string;
}

const Card: React.FC<CardProps> = ({ title, description }) => {
  return (
    <div className="Card">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
};

export default Card;
