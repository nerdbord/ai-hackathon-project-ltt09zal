import React from 'react';
import styles from './LoaderSpinner.module.scss';

interface Props {
  show: boolean;
  onImage?: boolean;
}

const LoaderSpinner: React.FC<Props> = ({ show = false, onImage }) => {
  return (
    <div className={show ? styles.show : styles.hide}>
      <div className={onImage ? styles.onImage : ''}>
        <span className={styles.loader}></span>
      </div>
    </div>
  );
};

export default LoaderSpinner;
