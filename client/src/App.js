import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserContextProvider } from "./UserContext";
import LoginPage from "./LoginPage";
import "./LoginPage.css"
import LoanApplicationForm from "./Editor";

const App = () => {
  return (
    <UserContextProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/editor" element={<LoanApplicationForm />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </UserContextProvider>
  );
};

export default App;
