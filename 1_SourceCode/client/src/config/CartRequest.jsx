import { request } from './request';
import { apiClient } from './axiosClient';

const apiCart = '/api/cart';

export const requestCreateCart = async (data) => {
    const res = await apiClient.post(`${apiCart}/create`, data);
    return res.data;
};

export const requestGetCartByUserId = async () => {
    const res = await apiClient.get(`${apiCart}/get-cart`);
    return res.data;
};

export const requestUpdateCartItem = async (data) => {
    const res = await apiClient.put(`${apiCart}/update-item`, data);
    return res.data;
};

export const requestDeleteCartItem = async (itemId) => {
    const res = await apiClient.delete(`${apiCart}/delete-item/${itemId}`);
    return res.data;
};

export const requestClearCart = async () => {
    const res = await apiClient.delete(`${apiCart}/clear`);
    return res.data;
};

export const requestApplyCoupon = async (data) => {
    const res = await apiClient.post(`${apiCart}/apply-coupon`, data);
    return res.data;
};

export const requestUpdateCartInfo = async (data) => {
    const res = await apiClient.put(`${apiCart}/update-cart-info`, data);
    return res.data;
};
