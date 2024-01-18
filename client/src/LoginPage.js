import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import "./LoginPage.css";
//import { useHistory } from 'react-router-dom';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(null);
  const { setUserInfo } = useContext(UserContext);
  

  async function login(ev) {
    ev.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        const userInfo = await response.json();
        setUserInfo(userInfo);
        setRedirect(true);
      } else {
        const errorMessage = await response.json();
        setError(errorMessage.message || 'Wrong credentials');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred during login.');
    }
  }

  if (redirect) {
    return <Navigate to={'/editor'} />;
  }

  return (
    <form className="login" onSubmit={login}>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <button>Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
