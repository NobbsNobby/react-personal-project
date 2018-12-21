// Core
import React from 'react';
import PropTypes from 'prop-types';
// Instruments
import Styles from './styles.m.css';

const Spinner = ({ isSpinning }) =>
    isSpinning && <div className = { Styles.spinner } />;

Spinner.propTypes = {
    isSpinning: PropTypes.bool.isRequired,
};

export default Spinner;
