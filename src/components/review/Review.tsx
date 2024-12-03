import React, { useEffect, useState } from "react";
import axiosInstance from '../../api/endPoint';

interface Review {
  id: string;
  reviewerName?: string;
  rating: number;
  comment: string;
}

interface ReviewForm {
  rating: number | "";
  comment: string;
  reviewerName: string;
}

const Reviews = ({ productId }: { productId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState<ReviewForm>({
    rating: "",
    comment: "",
    reviewerName: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch reviews
  useEffect(() => {
    axiosInstance
      .get(`/reviews/${productId}`)
      .then((res) => {
        setReviews(res.data);
      })
      .catch((err) => {
        console.error("Error fetching reviews:", err);
      });
  }, [productId]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (Number(newReview.rating) <= 0 || Number(newReview.rating) > 5) {
      setError("Rating must be a number between 1 and 5.");
      return;
    }
    if (!newReview.comment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    const reviewData = {
      productId,
      rating: Number(newReview.rating),
      reviewerName: newReview.reviewerName.trim() || "Anonymous",
      comment: newReview.comment.trim(),
    };

    axiosInstance
      .post("/reviews", reviewData)
      .then((response) => {
        setReviews((prev) => [...prev, response.data]);
        setNewReview({ rating: "", comment: "", reviewerName: "" });
        setSuccess("Review submitted successfully!");
      })
      .catch((err) => {
        console.error("Error submitting review:", err.response?.data || err.message);
        setError("Failed to submit review. Please try again.");
      });
  };

  // Handle delete review
  const handleDelete = (reviewId: string) => {
    axiosInstance
      .delete(`/reviews/${reviewId}`)
      .then(() => {
        setReviews((prev) => prev.filter((review) => review.id !== reviewId));
        setSuccess("Review deleted successfully!");
      })
      .catch((err) => {
        console.error("Error deleting review:", err.response?.data || err.message);
        setError("Failed to delete review. Please try again.");
      });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Reviews</h2>

      {/* Display Reviews */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="border p-4 rounded shadow">
              <p>
                <strong>{review.reviewerName || "Anonymous"}</strong>
              </p>
              <p>Rating: {review.rating} / 5</p>
              <p>{review.comment}</p>
              <button
                onClick={() => handleDelete(review.id)}
                className="text-red-500 underline mt-2"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>

      {/* Review Form */}
      <div className="mt-8">
        <h3 className="text-lg font-bold mb-4">Leave a Review</h3>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 font-bold">Rating (1-5):</label>
            <input
              type="number"
              name="rating"
              value={newReview.rating}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              min="1"
              max="5"
            />
          </div>
          <div>
            <label className="block mb-2 font-bold">Name:</label>
            <input
              type="text"
              name="reviewerName"
              value={newReview.reviewerName}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block mb-2 font-bold">Comment:</label>
            <textarea
              name="comment"
              value={newReview.comment}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              rows={4}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reviews;
