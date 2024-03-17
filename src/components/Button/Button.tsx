import React from 'react';
import styles from './Button.module.scss';

type Props = {
  text: string;
  onClick?: () => void;
  disabled?: boolean
};

const Button = ({ text, onClick, disabled }: Props) => {
  return (
    <button disabled={disabled} className={styles.button} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
