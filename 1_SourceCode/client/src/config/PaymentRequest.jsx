import { request } from './request';
import { apiClient } from './axiosClient';

const apiPayment = '/api/payment';

export const requestCreatePayment = async (data) => {
    const res = await apiClient.post(`${apiPayment}/create`, data);
    return res.data;
};

export const requestGetPaymentById = async (id) => {
    const res = await apiClient.get(`${apiPayment}/payment/${id}`);
    return res.data;
};

export const requestGetPaymentByUserId = async () => {
    const res = await apiClient.get(`${apiPayment}/get-payment-by-user-id`);
    return res.data;
};

export const requestGetPaymentByAdmin = async () => {
    const res = await apiClient.get(`${apiPayment}/get-payment-by-admin`);
    return res.data;
};

export const requestUpdatePaymentStatus = async (id, status) => {
    const res = await apiClient.put(`${apiPayment}/update-payment-status/${id}`, { status });
    return res.data;
};
