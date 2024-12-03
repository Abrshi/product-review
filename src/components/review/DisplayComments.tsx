import React from "react";
import axiosInstance from "../../api/endPoint";

interface Review {
  id: string;
  productId: string;
  reviewerName?: string | undefined; // Ensure this matches the definition of Comment
  rating: number;
  comment: string;
  createdAt: string;
}

interface DisplayCommentsProps {
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
}

const DisplayComments: React.FC<DisplayCommentsProps> = ({ reviews, setReviews }) => {
  const handleDelete = (reviewId: string) => {
    axiosInstance.delete(`/reviews/${reviewId}`)
      .then(() => {
        setReviews((prev) => prev.filter((review) => review.id !== reviewId));
      })
      .catch((err) => {
        console.error("Error deleting review:", err.response?.data || err.message);
      });
  };

  return (
    <div className="space-y-4">
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className="border p-4 rounded shadow">
            <p>
              <strong>{review.reviewerName || ""}</strong>
            </p>
            <p>Rating: {review.rating} / 5</p>
            <p>{review.comment}</p>
            <button
              onClick={() => handleDelete(review.id)}
              className="text-red-500 underline"
            >
              Delete
            </button>
          </div>
        ))
      ) : (
        <p>No reviews yet.</p>
      )}
    </div>
  );
};

export default DisplayComments;
