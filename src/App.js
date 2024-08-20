import React from 'react'
import Home from './Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ChartData from './components/Charts/ChartData'
const App = () => {
  return (
    <>  
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          {/* <Route path="*" element={<NoPage />} /> */}
        </Route>
        <Route path="charts" element={<ChartData />} />

      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
