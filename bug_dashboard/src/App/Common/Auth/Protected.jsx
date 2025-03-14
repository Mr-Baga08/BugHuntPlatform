import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Protected = ({ children }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const user = localStorage.getItem("userName");
    if (!user || user === "") {
      navigate('/signin');
    }
  }, [navigate]);

  return <>{children}</>;
};

export default Protected;
