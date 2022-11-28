import React from 'react';
import './Divider.css';

const Divider = ({ children }) => {
  return (
    <div className="divider-container">
      <div className="divider-border" />
      <span className="divider-content">
        {children}
      </span>
      <div className="divider-border" />
    </div>
  );
};

export default Divider;
