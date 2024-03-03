import { useState } from 'react'
import ReactDOM from "react-dom";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css'
import Homepage from './Homepage';
import ReservedPage from './ReservedPage';

const App = () => {
  const [count, setCount] = useState(0)

  return (
    <Router>
    <div >
      
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/rezervirano" element={<ReservedPage/>} />
      </Routes>
      
      
    </div>
    </Router>
  )
}

export default App
