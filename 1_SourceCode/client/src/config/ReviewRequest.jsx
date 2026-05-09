import { apiClient } from './axiosClient';

const apiReview = '/api/review';

export const requestCreateReview = async (data) => {
    const res = await apiClient.post(`${apiReview}/create`, data);
    return res.data;
};

export const requestGetReviewsByTour = async (tourId) => {
    const res = await apiClient.get(`${apiReview}/tour/${tourId}`);
    return res.data;
};

export const requestGetReviewsByUser = async () => {
    const res = await apiClient.get(`${apiReview}/user`);
    return res.data;
};

export const requestUpdateReview = async (reviewId, data) => {
    const res = await apiClient.put(`${apiReview}/update/${reviewId}`, data);
    return res.data;
};

export const requestDeleteReview = async (reviewId) => {
    const res = await apiClient.delete(`${apiReview}/delete/${reviewId}`);
    return res.data;
};
