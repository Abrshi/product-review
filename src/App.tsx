import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import Header from './components/Header';
import ProductDetail from './pages/ProductDetail';
import ProductForm from './components/AddEditProduct/AddProductForm';  // Keep only this import
import UpdateProductForm from './components/AddEditProduct/UpdateProductForm';
const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/products/add" element={<ProductForm />} />
        <Route path="/products/:id" element={<UpdateProductForm />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
