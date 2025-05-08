import axiosInstance from "./axiosInstance";

export type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
};

export type UserResponse = {
  users: User[];
  total: number;
  page: number;
  pages: number;
};

export const getUsers = async (page = 1, limit = 10, search = ''): Promise<UserResponse> => {
  const response = await axiosInstance.get(`/users?page=${page}&limit=${limit}&search=${search}`);
  return response.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await axiosInstance.get(`/users/${id}`);
  return response.data;
};

export const searchUsers = async (keyword: string): Promise<User[]> => {
  const response = await axiosInstance.get(`/users/search?keyword=${keyword}`);
  return response.data;
};

export const addUser = async (user: Omit<User, '_id'>) => {
  const response = await axiosInstance.post('/users/add', user);
  return response.data;
};

export const updateUser = async (id: string, user: Partial<User>) => {
  const response = await axiosInstance.put(`/users/${id}`, user);
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await axiosInstance.delete(`/users/${id}`);
  return response.data;
};
