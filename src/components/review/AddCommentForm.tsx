import React, { useState } from "react";
import axiosInstance from "../../api/endPoint";

interface ReviewForm {
  rating: number | "";
  comment: string;
  reviewerName: string;
}

interface AddCommentFormProps {
  productId: string;
  onCommentAdded: (newComment: any) => void;
}

const AddCommentForm: React.FC<AddCommentFormProps> = ({ productId, onCommentAdded }) => {
  const [newReview, setNewReview] = useState<ReviewForm>({
    rating: "",
    comment: "",
    reviewerName: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

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
        onCommentAdded(response.data);
        setNewReview({ rating: "", comment: "", reviewerName: "" });
      })
      .catch((err) => {
        console.error("Error submitting review:", err.response?.data || err.message);
        setError("Failed to submit review. Please try again.");
      });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
  {error && <p className="text-red-500">{error}</p>}
  <div className="flex space-x-4">
    
    <div className="flex-1">
      <label className="block font-bold">Name:</label>
      <input
        type="text"
        name="reviewerName"
        value={newReview.reviewerName}
        onChange={handleInputChange}
        className="w-full border rounded p-2"
      />
    </div>
    <div className="flex-1">
      <label className="block font-bold">Rating (1-5):</label>
      <input
        type="number"
        name="rating"
        value={newReview.rating}
        onChange={handleInputChange}
        className="w-full border rounded p-2"
      />
    </div>
  </div>
  <div>
    <label className="block font-bold">Comment:</label>
    <textarea
      name="comment"
      value={newReview.comment}
      onChange={handleInputChange}
      className="w-full border rounded p-2"
    />
  </div>
  <button
    type="submit"
    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
  >
    Submit
  </button>
</form>

  );
};

export default AddCommentForm;
