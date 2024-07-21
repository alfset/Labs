/* eslint-disable react/prop-types */
import React from 'react';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

const Typography: React.FC<TypographyProps> = ({ children, className = '', icon }) => {
  return (
    <div className={`prose ${className}`}>
      {children} {icon}
    </div>
  );
};

export default Typography;
