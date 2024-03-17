import React from 'react';
import styles from './Button.module.scss';

type Props = {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  hidden?: boolean;
  icon?: React.ReactNode;
};

const Button = ({ text, onClick, disabled, hidden, icon }: Props) => {
  const buttonClasses = `${styles.button} ${disabled ? styles.buttonDisabled : ''} ${hidden ? styles.hidden : ''}`;
  return (
    <button disabled={disabled} className={buttonClasses} onClick={onClick}>
      {text}
      {icon && icon}
    </button>
  );
};

export default Button;
