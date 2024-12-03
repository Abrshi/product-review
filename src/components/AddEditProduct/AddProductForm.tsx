import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/endPoint';

const AddProductForm: React.FC = () => {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    tags: [] as string[],
    use: '',
    minimumQuantity: '',
    sellingPrice: '',
    addedBy: '',
    expiresAt: '',
    quantityOnHand: '',
    reservedQuantity: '',
    discount: '',
    imageUrls: [] as string[],
  });

  const [tagInput, setTagInput] = useState<string>('');
  const [imageInput, setImageInput] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setProduct((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setProduct((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, imageInput.trim()],
      }));
      setImageInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Transform form data into the required backend format
    const payload = {
      name: product.name,
      description: product.description,
      price: parseFloat(product.price), // Ensuring price is a number
      category: product.category,
      tags: product.tags,
      use: product.use,
      minimumQuantity: parseInt(product.minimumQuantity, 10),
      sellingPrice: parseFloat(product.sellingPrice), // Ensuring sellingPrice is a number
      addedBy: product.addedBy,
      expiresAt: product.expiresAt, // Ensure this is in datetime format
      quantityOnHand: parseInt(product.quantityOnHand, 10),
      reservedQuantity: parseInt(product.reservedQuantity, 10),
      discount: parseInt(product.discount, 10),
      imageUrls: product.imageUrls,
    };

    try {
      const response = await axiosInstance.post('/products', payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      setLoading(false);
      if (response.data.product) {
        navigate(`/product/${response.data.product.id}`);
      }
    }catch (err) {
      const errorMessage =
        typeof err === 'object' && err !== null && 'message' in err
          ? (err as any).message
          : 'Error adding product';
      setError(errorMessage);
      setLoading(false);
    }
    
  };

  if (loading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
      {error && <p className="text-red-500">{error}</p>}

      {/* Name */}
      <div>
        <label className="block font-bold">Name:</label>
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleInputChange}
          className="w-full border rounded p-2"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block font-bold">Description:</label>
        <textarea
          name="description"
          value={product.description}
          onChange={handleInputChange}
          className="w-full border rounded p-2"
          rows={3}
          required
        ></textarea>
      </div>

      {/* Price */}
      <div>
        <label className="block font-bold">Price:</label>
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleInputChange}
          className="w-full border rounded p-2"
          required
        />
      </div>

      {/* Category */}
      <div>
        <label className="block font-bold">Category:</label>
        <input
          type="text"
          name="category"
          value={product.category}
          onChange={handleInputChange}
          className="w-full border rounded p-2"
          required
        />
      </div>

      {/* Selling Price */}
      <div>
        <label className="block font-bold">Selling Price:</label>
        <input
          type="number"
          name="sellingPrice"
          value={product.sellingPrice}
          onChange={handleInputChange}
          className="w-full border rounded p-2"
          required
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block font-bold">Tags:</label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="border rounded p-2 flex-grow"
            placeholder="Add a tag"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Add Tag
          </button>
        </div>
        <div className="mt-2 space-x-2">
          {product.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-block bg-gray-200 px-2 py-1 rounded text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Expires At */}
      <div>
        <label className="block font-bold">Expires At:</label>
        <input
          type="datetime-local"
          name="expiresAt"
          value={product.expiresAt}
          onChange={handleInputChange}
          className="w-full border rounded p-2"
          required
        />
      </div>
         {/* use */}
         <div>
        <label className="block font-bold">use:</label>
        <input
          type="use"
          name="use"
          value={product.use}
          onChange={handleInputChange}
          className="w-full border rounded p-2"
          required
        />
      </div>
         {/* use */}
         <div>
        <label className="block font-bold">Added by:</label>
        <input
          type="addedBy"
          name="addedBy"
          value={product.addedBy}
          onChange={handleInputChange}
          className="w-full border rounded p-2"
          required
        />
      </div>

      {/* Quantity On Hand */}
      <div>
        <label className="block font-bold">Quantity On Hand:</label>
        <input
          type="number"
          name="quantityOnHand"
          value={product.quantityOnHand}
          onChange={handleInputChange}
          className="w-full border rounded p-2"
          required
        />
      </div>
      {/* minimum Quantity */}
      <div>
        <label className="block font-bold">minimum Quantity:</label>
        <input
          type="number"
          name="minimumQuantity"
          value={product.minimumQuantity}
          onChange={handleInputChange}
          className="w-full border rounded p-2"
          required
        />
      </div>

      {/* Reserved Quantity */}
      <div>
        <label className="block font-bold">Reserved Quantity:</label>
        <input
          type="number"
          name="reservedQuantity"
          value={product.reservedQuantity}
          onChange={handleInputChange}
          className="w-full border rounded p-2"
          required
        />
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
      <button
        type="submit"
        className="w-full bg-blue-500 text-white rounded p-3 hover:bg-blue-600"
      >
        Add Product
      </button>
    </form>
  );
};

export default AddProductForm;
