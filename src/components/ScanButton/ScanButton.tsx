import React, { FC } from 'react';
import styles from './ScanButton.module.scss';

interface ScanButtonProps {
  onClick: () => void;
  text: string;
  disabled?: boolean;
}

const ScanButton: FC<ScanButtonProps> = ({
  onClick,
  text,
  disabled = false,
}) => {
  return (
    <div>
      <button className={styles.button} onClick={onClick} disabled={disabled}>
        {text}
      </button>
    </div>
  );
};

export default ScanButton;
