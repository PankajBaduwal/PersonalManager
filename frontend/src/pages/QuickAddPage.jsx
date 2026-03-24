import React from 'react';
import { useNavigate } from 'react-router-dom';
import QuickAdd from '../components/QuickAdd';

const QuickAddPage = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/dashboard');
  };

  const handleSuccess = () => {
    navigate('/dashboard');
  };

  return <QuickAdd onClose={handleClose} onSuccess={handleSuccess} />;
};

export default QuickAddPage;
