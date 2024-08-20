import React from 'react'
import Home from './Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ChartData from './components/Charts/ChartData'
const App = () => {
  return (
    <>  
      <Routes>
        <Route path="/" element={<Home />}>
        </Route>
        <Route path="charts" element={<ChartData />} />

      </Routes>
    </>
  )
}

export default App
