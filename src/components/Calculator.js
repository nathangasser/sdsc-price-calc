import React, { useState, useEffect } from 'react';
import '../css/bootstrap.min.css';

const Calculator = () => {
  // State variables for user inputs
  const [windowType, setWindowType] = useState('Double Hung');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [glass, setGlass] = useState('1/8 annealed');
  const [upperLites, setUpperLites] = useState('');
  const [lowerLites, setLowerLites] = useState('');
  const [sashLites, setSashLites] = useState('');
  // State variable for price
  const [price, setPrice] = useState(null);
  // State variable for retail price checkbox
  const [isRetailPrice, setIsRetailPrice] = useState(false);

  // Function to handle price calculation
  const calculatePrice = () => {
    let calculatedPrice = 0;

    const w = parseInt(width);
    const h = parseInt(height);

    // Determine window size
    let windowSize = '';
    if (w < 30 && h < 36) {
      windowSize = 'small';
    } else if (w <= 42 && h <= 54) {
      windowSize = 'medium';
    } else if (w >= 48 && h >= 48) {
      windowSize = 'oversize';
    } else if (w > 42 || h > 54) {
      windowSize = 'large';
    } else {
      windowSize = 'error';
    }

    // Calculate base price based on window type and size
    if (windowType === 'Double Hung') {
      calculatedPrice = getDoubleHungPrice(windowSize);
      calculatedPrice += (upperLitesValue() > 1 ? (upperLitesValue()) * 55.0 : 0);
      calculatedPrice += (lowerLitesValue() > 1 ? (lowerLitesValue()) * 55.0 : 0);
    } else if (windowType === 'Casement') {
      calculatedPrice = getCasementPrice(windowSize);
      calculatedPrice += (sashLitesValue() > 1 ? (sashLitesValue()) * 55.0 : 0);
    }
      
    // Adjust price based on glass type
    if (glass === '3mm Restoration') {
      const glassCost = calculateGlassCost(w, h);
      calculatedPrice += glassCost;
    }

    // Apply retail price adjustment if checkbox is checked
    if (isRetailPrice) {
      calculatedPrice *= 1.25; // Increase price by 25%
    }

    // Set the calculated price
    setPrice(calculatedPrice);
  };

  // Function to handle input changes
  const handleInputChange = () => {
    // Reset the price to null to indicate awaiting input
    setPrice(null);
  };

  // Function to handle checkbox change
  const handleCheckboxChange = () => {
    setIsRetailPrice(!isRetailPrice); // Toggle checkbox state
  };

  // Helper function to get additional lites values
  const upperLitesValue = () => upperLites === '' ? 1 : parseInt(upperLites);
  const lowerLitesValue = () => lowerLites === '' ? 1 : parseInt(lowerLites);
  const sashLitesValue = () => sashLites === '' ? 1 : parseInt(sashLites);

  // Helper function to calculate glass cost
  const calculateGlassCost = (w, h) => (w * h) / 144 * 18.0; // Convert square inches to square feet and multiply by $18.00

  // Helper functions to calculate base prices
  const getDoubleHungPrice = (windowSize) => {
    switch (windowSize) {
      case 'small':
        return 615.0;
      case 'medium':
        return 655.0;
      case 'large':
        return 700.0;
      case 'oversize':
        return 965.0;
      default:
        return 0;
    }
  };

  const getCasementPrice = (windowSize) => {
    switch (windowSize) {
      case 'small':
        return 420.0;
      case 'medium':
        return 460.0;
      case 'large':
        return 500.0;
      case 'oversize':
        return 680.0;
      default:
        return 0;
    }
  };

  // Effect to automatically update the output when inputs change
  useEffect(() => {
    calculatePrice();
  }, [windowType, width, height, glass, upperLites, lowerLites, sashLites, isRetailPrice]);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">SDSC Price Calc</h1>
      <div className="row mb-3">
        <div className="col-md-6">
          {/* Window type selection */}
          <div className="mb-3">
            <label htmlFor="windowType" className="form-label">Window Type:</label>
            <select id="windowType" className="form-select" value={windowType} onChange={(e) => { setWindowType(e.target.value); handleInputChange(); }}>
              <option value="Double Hung">Double Hung</option>
              <option value="Casement">Casement</option>
            </select>
          </div>
          {/* Width and Height inputs */}
          <div className="mb-3 row">
            <div className="col">
              <label htmlFor="width" className="form-label">Width (in inches):</label>
              <input type="number" id="width" className="form-control" value={width} onChange={(e) => { setWidth(e.target.value); handleInputChange(); }} />
            </div>
            <div className="col">
              <label htmlFor="height" className="form-label">Height (in inches):</label>
              <input type="number" id="height" className="form-control" value={height} onChange={(e) => { setHeight(e.target.value); handleInputChange(); }} />
            </div>
          </div>
          {/* Glass type dropdown */}
          <div className="mb-3">
            <label htmlFor="glass" className="form-label">Glass Type:</label>
            <select id="glass" className="form-select" value={glass} onChange={(e) => { setGlass(e.target.value); handleInputChange(); }}>
              <option value="1/8 annealed">1/8 annealed</option>
              <option value="3mm Restoration">3mm Restoration</option>
            </select>
          </div>
          {/* Additional inputs based on window type */}
          {windowType === 'Double Hung' && (
            <div className="mb-3 row">
              <div className="col">
                <label htmlFor="upperLites" className="form-label">Upper Lites:</label>
                <input type="number" id="upperLites" className="form-control" value={upperLites} onChange={(e) => { setUpperLites(e.target.value); handleInputChange(); }} />
              </div>
              <div className="col">
                <label htmlFor="lowerLites" className="form-label">Lower Lites:</label>
                <input type="number" id="lowerLites" className="form-control" value={lowerLites} onChange={(e) => { setLowerLites(e.target.value); handleInputChange(); }} />
              </div>
            </div>
          )}
          {windowType === 'Casement' && (
            <div className="mb-3">
              <label htmlFor="sashLites" className="form-label">Sash Lites:</label>
              <input type="number" id="sashLites" className="form-control" value={sashLites} onChange={(e) => { setSashLites(e.target.value); handleInputChange(); }} />
            </div>
          )}
          {/* Display calculated price */}
          <div className="mt-3">
            <h4>Price: {price !== null ? `$${price.toFixed(2)}` : 'Awaiting Input'}</h4>
          </div>
          {/* Retail price checkbox */}
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="retailPriceCheckbox" checked={isRetailPrice} onChange={handleCheckboxChange} />
            <label className="form-check-label" htmlFor="retailPriceCheckbox">
              Retail Price
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
