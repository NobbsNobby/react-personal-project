import React from 'react';
import Styles from './styles.m.css';

const Spinner = ({ isSpinning }) =>
    isSpinning && <div className = { Styles.spinner } />;

export default Spinner;
