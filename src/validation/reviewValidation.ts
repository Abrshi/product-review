import * as yup from 'yup';

export const reviewSchema = yup.object().shape({
  rating: yup.number().min(1).max(5).required('Rating is required'),
  comment: yup.string().required('Comment cannot be empty'),
});
