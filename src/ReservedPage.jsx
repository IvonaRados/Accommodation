import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const ReservedPage = () => {
  console.log("Hello");
  const location = useLocation();
  const { startDate, endDate, title, capacity, totalPrice } = location.state;
  
  return (
    <div>
      <h2>Uspiješno ste rezervirali smještaj {title}. Od {startDate} do {endDate}. Za do {capacity} osoba.
      !</h2>
      <h3>Ukupna cijena: {totalPrice}</h3>
      <Link to={`/`}>
          <button type="button">Natrag na početnu</button>
          <hr />
      </Link>
      
    </div>
  );
};

export default ReservedPage;
