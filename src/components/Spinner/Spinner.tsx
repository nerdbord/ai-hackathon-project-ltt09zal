import React from 'react';
import styles from './Spinner.module.scss';

type Props = {};

const Spinner = (props: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default Spinner;
