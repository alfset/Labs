import React from 'react';

interface ButtonProps {
  url?: string;
  btnType?: string;
  target?: string;
  other?: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ url = '#', btnType = 'btn-md', target = '_self', other = '', children }) => {
  return (
    <a href={url} target={target} className={`btn ${btnType} ${other}`}>
      {children}
    </a>
  );
};

export default Button;
