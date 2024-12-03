import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/endPoint';

type Product = {
  id?: string;
  name: string;
  description: string;
  price: string;
  category: string;
  minimumQuantity?: string;
  sellingPrice?: string;
  tags: string[];
  use?: string;
  addedBy?: string;
  expiresAt?: string;
  quantityOnHand?: string;
  reservedQuantity?: string;
  discount?: string;
  imageUrls: string[];
};


const UpdateProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [tagInput, setTagInput] = useState<string>('');
  const [imageInput, setImageInput] = useState<string>('');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null); // Reset error state
      axiosInstance
        .get(`/products/${id}`)
        .then((response) => {
          if (response.data) {
            setProduct(response.data);
          } else {
            setError('Product not found.');
          }
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to load product data.');
          setLoading(false);
        });
    }
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'expiresAt') {
      const isoDate = new Date(value).toISOString();
      setProduct((prevProduct) =>
        prevProduct ? { ...prevProduct, [name]: isoDate } : prevProduct
      );
    } else {
      setProduct((prevProduct) =>
        prevProduct ? { ...prevProduct, [name]: value } : prevProduct
      );
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setProduct((prev) => {
        if (!prev) return null; // Handle null case explicitly
        return {
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        };
      });
      setTagInput('');
    }
  };
  
  const handleAddImage = () => {
    if (imageInput.trim()) {
      setProduct((prev) => {
        if (!prev) return null; // Handle null case explicitly
        return {
          ...prev,
          imageUrls: [...prev.imageUrls, imageInput.trim()],
        };
      });
      setImageInput('');
    }
  };
  
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !product) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.patch(`/products/${id}`, product, {
        headers: { 'Content-Type': 'application/json' },
      });

      setLoading(false);
      if (response.data.product) {
        navigate(`/product/${response.data.product.id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error updating product');
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return product ? (
    <form
    onSubmit={handleSubmit}
    className="space-y-6 bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto"
  >
    {/* Form Title */}
    <h2 className="text-2xl font-bold text-gray-800 text-center">
      Update Product
    </h2>
  
    {/* Name */}
    <div className="flex flex-col">
      <label className="font-medium text-gray-700 mb-2">Name</label>
      <input
        type="text"
        name="name"
        value={product.name}
        onChange={handleInputChange}
        className="border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300"
        required
      />
    </div>
  
    {/* Description */}
    <div className="flex flex-col">
      <label className="font-medium text-gray-700 mb-2">Description</label>
      <textarea
        name="description"
        value={product.description}
        onChange={handleInputChange}
        className="border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300"
        rows={4}
        required
      ></textarea>
    </div>
  
    {/* Grid Layout for Price and Category */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Price */}
      <div className="flex flex-col">
        <label className="font-medium text-gray-700 mb-2">Price</label>
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300"
          required
        />
      </div>
  
      {/* Category */}
      <div className="flex flex-col">
        <label className="font-medium text-gray-700 mb-2">Category</label>
        <input
          type="text"
          name="category"
          value={product.category}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300"
          required
        />
      </div>
    </div>
  
    {/* Tags */}
    <div className="flex flex-col">
      <label className="font-medium text-gray-700 mb-2">Tags</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 flex-grow focus:ring focus:ring-blue-300"
          placeholder="Add a tag"
        />
        <button
          type="button"
          onClick={handleAddTag}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add Tag
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {product.tags.map((tag, index) => (
          <span
            key={index}
            className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  
    {/* Expires At */}
    <div className="flex flex-col">
      <label className="font-medium text-gray-700 mb-2">Expires At</label>
      <input
        type="datetime-local"
        name="expiresAt"
        value={
          product.expiresAt
            ? new Date(product.expiresAt).toISOString().slice(0, 16)
            : ""
        }
        
        onChange={handleInputChange}
        className="border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300"
        required
      />
    </div>
  
    {/* Quantity Fields (Responsive Grid) */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Quantity On Hand */}
      <div className="flex flex-col">
        <label className="font-medium text-gray-700 mb-2">Quantity On Hand</label>
        <input
          type="number"
          name="quantityOnHand"
          value={product.quantityOnHand}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300"
          required
        />
      </div>
  
      {/* Reserved Quantity */}
      <div className="flex flex-col">
        <label className="font-medium text-gray-700 mb-2">Reserved Quantity</label>
        <input
          type="number"
          name="reservedQuantity"
          value={product.reservedQuantity}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300"
          required
        />
      </div>
    </div>
    {/* Discount */}
    <div>
        <label className="block font-bold">Discount:</label>
        <input
          type="number"
          name="discount"
          value={product.discount}
          onChange={handleInputChange}
          className="w-full border rounded p-2"
          required
        />
      </div>


      {/* Image URLs */}
      <div>
        <label className="block font-bold">Image URLs:</label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            className="border rounded p-2 flex-grow"
            placeholder="Add an image URL"
          />
          <button
            type="button"
            onClick={handleAddImage}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Add Image
          </button>
        </div>
        <div className="mt-2 space-x-2">
          {product.imageUrls.map((url, index) => (
            <span
              key={index}
              className="inline-block bg-gray-200 px-2 py-1 rounded text-sm"
            >
              {url}
            </span>
          ))}
        </div>
      </div>
  
    {/* Submit Button */}
    <div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
      >
        Update Product
      </button>
    </div>
  </form>
  
  ) : (
    <div>Product not found.</div>
  );
};

export default UpdateProductForm;
