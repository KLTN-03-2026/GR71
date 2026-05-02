import { request } from './request';

const apiUser = '/api/user';

export const requestGetDashboard = async (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const queryString = params.toString();
    const url = `${apiUser}/admin/dashboard${queryString ? `?${queryString}` : ''}`;

    const res = await request.get(url);
    return res.data;
};
