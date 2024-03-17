import React from 'react';
import styles from './Button.module.scss';

type Props = {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
};

const Button = ({ text, onClick, disabled, icon }: Props) => {
  return (
    <button disabled={disabled} className={styles.button} onClick={onClick}>
      {text}
      {icon && icon}
    </button>
  );
};

export default Button;
