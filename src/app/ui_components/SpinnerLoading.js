import React from 'react';
import * as styles from './SpinnerLoading.module.css';

const SpinnerLoading = () => {
  const {
    spinnerContainer,
    spinner,
    spinnerInner,
  } = styles;

  return (
    <div className={spinnerContainer}>
      <div className={spinner}>
        <div className={spinnerInner}></div>
      </div>
    </div>
  );
};

export { SpinnerLoading };
