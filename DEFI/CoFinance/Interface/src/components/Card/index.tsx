import React from 'react';

interface CustomCardProps {
  imgUrl: string;
  isBorder: boolean;
  url?: string;
  title: string;
  titleClass: string;
  subtitle: string;
  component: React.ReactNode;
  align: string;
  borderColor: string;
  other?: string;
  spaceY?: string;
  classCard?: string;
  subtitleClass: string;
  titleSize: string;
}

const CustomCard: React.FC<CustomCardProps> = ({
  imgUrl,
  isBorder,
  url,
  title,
  titleClass,
  subtitle,
  component,
  align,
  borderColor,
  other,
  spaceY,
  classCard,
  subtitleClass,
  titleSize,
}) => {
  return (
    <div className={`card ${classCard} ${borderColor} ${other} ${spaceY} ${align}`}>
      {isBorder && <div className="border border-opacity-50"></div>}
      <img src={imgUrl} alt={title} className="w-full" />
      <div className="p-4">
        <h2 className={`text-2xl ${titleClass} ${titleSize}`}>{title}</h2>
        <p className={`${subtitleClass}`}>{subtitle}</p>
        {component}
      </div>
    </div>
  );
};

export default CustomCard;
