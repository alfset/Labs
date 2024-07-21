import { Link } from 'react-router-dom';

/* eslint-disable react/prop-types */
const Button = (props) => {
  const {
    children = 'Default',
    bgColor = 'btn-neutral',
    type,
    rounded = 'rounded-full',
    size,
    padding,
    btnType,
    gradient,
    textColor,
    textTransform = 'capitalize',
    other,
    isButton,
    url,
    target,
    onClick,
  } = props;

  return isButton === true ? (
    <button
      type={`${type}`}
      className={`btn ${btnType} ${bgColor} ${rounded} ${size} ${padding} ${gradient} ${textColor}
      ${textTransform} ${other}`}
      onClick={onClick}
    >
      {children}
    </button>
  ) : (
    <Link
      to={url}
      target={target}
      className={`btn ${btnType} ${bgColor} ${rounded} ${size} ${padding} ${gradient} ${textColor}
      ${textTransform} ${other}`}
    >
      {children}
    </Link>
  );
};

export default Button;