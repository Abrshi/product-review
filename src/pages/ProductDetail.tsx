import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/endPoint";
import AddCommentForm from "../components/review/AddCommentForm";
import DisplayComments from "../components/review/DisplayComments";

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

interface Comment {
  id: string;
  productId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const Tags = ({ tags }: { tags: string[] }) => (
  <div className="flex gap-2 flex-wrap mt-4">
    {tags.map((tag) => (
      <span
        key={tag}
        className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded"
      >
        {tag}
      </span>
    ))}
  </div>
);

function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const [productResponse, commentsResponse] = await Promise.all([
          axiosInstance.get(`/products/${id}`),
          axiosInstance.get(`/reviews/${id}`),
        ]);
        setProduct(productResponse.data);
        setComments(commentsResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load product details or comments.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    setDeleting(true);
    try {
      await axiosInstance.delete(`/products/${id}`);
      navigate("/");
    } catch (err) {
      console.error("Error deleting product:", err.response?.data || err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleCommentAdded = (newComment: Comment) => {
    setComments((prevComments) => [...prevComments, newComment]);
  };

  if (loading) return <div className="text-center py-10">Loading product details...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {product && (
        <>
          <div className="flex gap-8 flex-col sm:flex-row">
            <div className="w-full sm:w-1/2">
              <img
                src={product.imageUrls[0]}
                alt={product.name}
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>

            <div className="w-full sm:w-1/2">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">{product.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{product.description}</p>
              <p className="text-xl text-green-600 font-semibold mb-4">
                Price: {product.price} Birr
              </p>
              <p className="text-gray-700 mb-1">Category: {product.category}</p>
              <p className="text-gray-700 mb-1">Use: {product.use}</p>
              <p className="text-gray-700 mb-1">Minimum Quantity: {product.minimumQuantity}</p>
              <p className="text-gray-700 mb-1">Selling Price: {product.sellingPrice}</p>
              <p className="text-gray-700 mb-1">Discount: {product.discount}%</p>
              <p className="text-gray-700 mb-1">Quantity on Hand: {product.quantityOnHand}</p>
              <p className="text-gray-700 mb-1">Reserved Quantity: {product.reservedQuantity}</p>
              <p className="text-gray-700 mb-1">Added By: {product.addedBy}</p>
              <p className="text-gray-700 mb-1 text-xs">
                Expires At: {new Date(product.expiresAt).toLocaleDateString()}
              </p>
              <p className="text-gray-700 mb-1 text-xs">
                Created At: {new Date(product.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-700 mb-1 text-xs">
                Updated At: {new Date(product.updatedAt).toLocaleDateString()}
              </p>
              <div className="flex m-1 p-10 gap-10">
                <Link
                  to={`/products/${id}`}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Edit Product
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ${
                    deleting ? "opacity-50" : ""
                  }`}
                >
                  {deleting ? "Deleting..." : "Delete Product"}
                </button>
              </div>
              <Tags tags={product.tags} />
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Add a Comment</h2>
            <AddCommentForm productId={product.id} onCommentAdded={handleCommentAdded} />
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Comments</h2>
            <DisplayComments reviews={comments} setReviews={setComments} />
          </div>
        </>
      )}
    </div>
  );
}

export default ProductDetail;
