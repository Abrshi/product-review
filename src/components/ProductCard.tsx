import React from 'react';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  tags: string[];
  use: string;
  minimumQuantity: number;
  sellingPrice: string;
  addedBy: string;
  expiresAt: string;
  quantityOnHand: string;
  reservedQuantity: string;
  discount: string;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="product-card">
      {/* Display the product's main image */}
      <img src={product.imageUrls[0]} alt={product.name} className="product-image" />
      
      {/* Product details */}
      <h3>{product.name}</h3>
      <p>Description: {product.description}</p>
      <p>Price: ${parseFloat(product.price).toFixed(2)}</p>
      <p>Category: {product.category}</p>
      <p>Discount: {product.discount}%</p>
      
      {/* Tags */}
      <div className="product-tags">
        {product.tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag}
          </span>
        ))}
      </div>
      
      {/* Expiry date */}
      <p>Expires At: {new Date(product.expiresAt).toLocaleDateString()}</p>
      
      {/* Link to product details */}
      <Link to={`/product/${product.id}`}>View Details</Link>
    </div>
  );
};

export default ProductCard;
