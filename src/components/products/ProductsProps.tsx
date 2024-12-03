import React from 'react';

// Define the structure of the product data
interface ProductData {
  id: number; // Unique identifier for the product
  name: string; // Name of the product
  price: number; // Price of the product
  image: string; // URL of the product image
  rating: number; // Product rating
}

// Define the props for the `ProductsProps` component
interface ProductsProps {
  data: ProductData; // The product information
}

const ProductsProps: React.FC<ProductsProps> = ({ data }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
      <img 
        src={data.image} 
        alt={data.name} 
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{data.name}</h3>
      <p className="text-green-600 font-bold text-lg mb-2">${data.price.toFixed(2)}</p>
      <p className="text-yellow-500 text-sm">Rating: {data.rating} / 5</p>
    </div>
  );
};

export default ProductsProps;
