import { apiClient } from './axiosClient';

const apiFeedback = '/api/feedback';

export const requestCreateFeedback = async (data) => {
    const res = await apiClient.post(`${apiFeedback}/create`, data);
    return res.data;
};

export const requestGetAllFeedback = async () => {
    const res = await apiClient.get(`${apiFeedback}/get-all-feedback`);
    return res.data;
};

export const requestGetFeedbackByProductId = async (productId) => {
    const res = await apiClient.get(`${apiFeedback}/product/${productId}`);
    return res.data;
};

export const requestCheckUserReview = async (paymentId) => {
    const res = await apiClient.get(`${apiFeedback}/check-review/${paymentId}`);
    return res.data;
};

// Trang đánh giá công khai — params: page, limit, star, sort
export const requestGetReviewsPage = async (params = {}) => {
    const res = await apiClient.get(`${apiFeedback}/reviews`, { params });
    return res.data;
};

// Đánh giá của user hiện tại
export const requestGetUserReviews = async () => {
    const res = await apiClient.get(`${apiFeedback}/my-reviews`);
    return res.data;
};

// Xóa đánh giá
export const requestDeleteReview = async (reviewId) => {
    const res = await apiClient.delete(`${apiFeedback}/${reviewId}`);
    return res.data;
};
