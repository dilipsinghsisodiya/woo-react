import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Contact from './pages/Contact'
import PageNotFound from './pages/PageNotFound';
import ProductDetails from './pages/ProductDetails';


const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path='*' element={<PageNotFound />} />
        <Route path='/' element={<Home />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/shop' element={<Shop />} />
        <Route path='/product/:id' element={<ProductDetails />} />
      </Routes>
    </>
  )
}

export default App