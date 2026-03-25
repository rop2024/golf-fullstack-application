import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to landing page with signup modal
    navigate('/?modal=signup', { replace: true });
  }, [navigate]);

  return null; // This component will never render
};

export default Signup;