import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Contact from "./pages/Contact";
import PageNotFound from "./pages/PageNotFound";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import { CartProvider } from "./Context/CartContext";
import Checkout from "./pages/Checkout";

const App = () => {
  return (
    <>
      <CartProvider>
        <Header />
        <Routes>
          <Route path="*" element={<PageNotFound />} />
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </CartProvider>
    </>
  );
};

export default App;
