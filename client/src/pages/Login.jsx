import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to landing page with login modal
    navigate('/?modal=login', { replace: true });
  }, [navigate]);

  return null; // This component will never render
};

export default Login;