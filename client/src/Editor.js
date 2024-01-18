import React, { useState, useEffect } from "react";
import "./Editor.css";
import axios from "axios";
import { useUser } from './UserContext';

const LoanApplicationForm = () => {
  // State variables for form fields
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [panCardNumber, setPanCardNumber] = useState("");
  const [aadharCardNumber, setAadhaarCardNumber] = useState("");
  const [propertyValue, setPropertyValue] = useState("");
  const [equipValue, setEquipValue] = useState("");
  const [inventoryValue, setInventoryValue] = useState("");
  const [landValue, setLandValue] = useState("");
  const [aadhaarData, setAadhaarData] = useState({});
  const [panData, setPanData] = useState({});
  const [cropyieldscore, setcropyieldscore] = useState("");
  const [assessmentscore, setassessmentscore] = useState("");
  const [creditWorthinessScore, setCreditWorthinessScore] = useState(null);

  

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create an object with form data
      const formData = {
        name,
        age,
        panCardNumber,
        aadharCardNumber,
        propertyValue,
        equipValue,
        inventoryValue,
        landValue,
        cropyieldscore,
        assessmentscore,
      };

      // Send the form data to your backend for database storage
      const response = await axios.post("http://localhost:4000/", formData);

      // Handle the response if needed
      console.log(response.data.message);

      // Clear form fields after submission
      setName("");
      setAge("");
      setPanCardNumber("");
      setAadhaarCardNumber("");
      //setLivestockValue("");
      setLandValue("");
      setPropertyValue("");
      setEquipValue("");
      setInventoryValue("");
      setassessmentscore("");
      setcropyieldscore("");

      // Fetch data after submitting the form
      const calculateCreditWorthiness = () => {
        const x =
          0.35 * panData.annualIncome +
          0.5 *
            (aadhaarData.livestockValue +
              Number(inventoryValue) +
              Number(propertyValue) +
              Number(equipValue) +
              Number(landValue)) +
          0.15 * panData.investments;
      
        const RC = ((x - 110112) * 100) / (489558 - 110112);
      
        const calculatedScore =
          300 +
          (0.6 *
            (0.15 * Number(assessmentscore) +
              0.3 * Number(cropyieldscore) +
              0.3 * RC +
              0.2 * Number(panData.netCashFlow) -
              0.05 * Number(panData.taxPaymentViolations)) *
            0.05);
      
        // Set the calculated score to the state
        setCreditWorthinessScore(calculatedScore);
      };
      calculateCreditWorthiness();
      fetchData();
    } catch (error) {
      console.error("Error submitting form:", error.message);
    }
  };

  const fetchData = async () => {
    let aadhaarData, panData; // Declare at the beginning

    try {
      const aadhaarResponse = await axios.get(
        `http://localhost:4000/get-aadhaar-data/${aadharCardNumber}`
      );
      console.log("Fetched aadhaar data successfully");
      aadhaarData = aadhaarResponse.data;
      console.log(`live stock value us ${aadhaarData.livestockValue}`);
    } catch (error) {
      console.log(error);
      console.log("Aadhaar data not fetched");
    }

    try {
      const panResponse = await axios.get(
        `http://localhost:4000/get-pan-data/${panCardNumber}`
      );
      console.log("Fetched pan data successfully");
      panData = panResponse.data;
    } catch (error) {
      console.log(error);
      console.log("Pan data not found");
    }

    // Set state with retrieved data
    setAadhaarData(aadhaarData);
    setPanData(panData);
    setName(aadhaarData?.name || panData?.name || "");
    setAge(aadhaarData?.age || panData?.age || "");
    // ... Set other fields based on retrieved data
  };

  useEffect(() => {
    if (aadharCardNumber && panCardNumber) {
      fetchData();
    }
  }, [aadharCardNumber, panCardNumber, fetch]);

  return (
    <div className="container">
      <h2>Loan Application Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="field-group">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="field-group">
          <label htmlFor="age">Age:</label>
          <input
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>

        <div className="field-group">
          <label htmlFor="panCardNumber">PAN Card Number:</label>
          <input
            id="panCardNumber"
            type="text"
            value={panCardNumber}
            onChange={(e) => setPanCardNumber(e.target.value)}
            required
          />
        </div>

        <div className="field-group">
          <label htmlFor="aadharCardNumber">Aadhaar Card Number:</label>
          <input
            id="aadharCardNumber"
            type="text"
            value={aadharCardNumber}
            onChange={(e) => setAadhaarCardNumber(e.target.value)}
            required
          />
        </div>

        <h2>Collateral</h2>
        <div className="collateral-section">
          <div className="field-group">
            <label htmlFor="landValue">Land Value:</label>
            <input
              id="landValue"
              type="number"
              value={landValue}
              onChange={(e) => setLandValue(e.target.value)}
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="propertyValue">Property Value:</label>
            <input
              id="propertyValue"
              type="number"
              value={propertyValue}
              onChange={(e) => setPropertyValue(e.target.value)}
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="inventoryValue">Inventory Value:</label>
            <input
              id="inventoryValue"
              type="number"
              value={inventoryValue}
              onChange={(e) => setInventoryValue(e.target.value)}
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="equipValue">Equipment Value:</label>
            <input
              id="equipValue"
              type="number"
              value={equipValue}
              onChange={(e) => setEquipValue(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="field-group">
          <label htmlFor="cropyieldscore">
            Crop Yield Prediction Score Achieved:
          </label>
          <input
            id="cropyieldscore"
            type="number"
            value={cropyieldscore}
            onChange={(e) => setcropyieldscore(e.target.value)}
            required
          />
        </div>

        <div className="field-group">
          <label htmlFor="assesmentscore">Assesment Score Achieved:</label>
          <input
            id="assesmentscore"
            type="number"
            value={assessmentscore}
            onChange={(e) => setassessmentscore(e.target.value)}
            required
          />
        </div>

        <div>
          <h3>Aadhaar Data:</h3>
          <p>Live Stock Value: {aadhaarData?.livestockValue || "N/A"}</p>
        </div>

        <div>
          <h3>Pan Data:</h3>
          <p>Annual Income: {panData.annualIncome}</p>
          <p>Annual Expenditure: {panData.annualExpenditure}</p>
          <p>Net Cash Flow: {panData.netCashFlow}</p>
          <p>Tax Payments Due: {panData.taxPaymentsDue}</p>
          <p>Late Tax Payments: {panData.lateTaxPayments}</p>
          <p>
            Tax Payment Violations: {panData.taxPaymentViolations}
          </p>
          <p>Investments: {panData.investments}</p>
        </div>

        {/* <div className="credit-worthiness-section">
        <h3>Creditworthiness Score:</h3>
        {creditWorthinessScore !== null ? (
          <p>{creditWorthinessScore}</p>
        ) : (
          <p>Your Score: {creditWorthinessScore}</p>
        )}
      </div> */}
      <div className="button-container">
      <button type="submit" className="submit-button">
          Submit
        </button>
      </div>
        
        <div className="field-group">
        <label htmlFor="creditWorthinessScore">Calculated Credit Worthiness Score:</label>
        <input
          id="creditWorthinessScore"
          type="text"
          value={creditWorthinessScore}
          readOnly // Make it read-only as it's a calculated field
          className="calculated-field"
        />
      </div>
      </form>
    </div>
  );
};


export default LoanApplicationForm;


