import React from 'react'
import Home from './Home'
import { Route, Routes } from 'react-router-dom'
import ChartData from './components/Charts/ChartData'
import AdminComponent from './components/AdminPage/AdminComponent'
const App = () => {
  return (
    <>  
      <Routes>
      <Route path="/" element={<ChartData />}>
        </Route>
        <Route  path="/accounts" element={<Home />} />
       
        <Route path="admin" element={<AdminComponent />} />


      </Routes>
    </>
  )
}

export default App
