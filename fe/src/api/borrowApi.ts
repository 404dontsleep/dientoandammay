import axiosInstance from './axiosInstance';

export type Borrow = {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  book: {
    _id: string;
    title: string;
    author: string;
  };
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'borrowed' | 'returned';
  bookCondition?: 'normal' | 'damaged' | 'lost';
};

export type BorrowResponse = {
  borrows: Borrow[];
  total: number;
  page: number;
  pages: number;
};

export const getBorrows = async (page = 1, limit = 10, search = '', borrowDate = ''): Promise<BorrowResponse> => {
  const response = await axiosInstance.get(
    `/borrows/?page=${page}&limit=${limit}&search=${search}${borrowDate ? `&borrowDate=${borrowDate}` : ''}`,
  );
  return response.data;
};

export const getBorrowById = async (id: string): Promise<Borrow> => {
  const response = await axiosInstance.get(`/borrows/${id}`);
  return response.data;
};

export const getUserBorrows = async (userId: string): Promise<Borrow[]> => {
  const response = await axiosInstance.get(`/borrows/user/${userId}`);
  return response.data;
};

export const createBorrow = async (data: { userId: string; bookId: string; dueDate: string }) => {
  const response = await axiosInstance.post('/borrows/borrow', data);
  return response.data;
};

export const returnBook = async (id: string, bookCondition: 'normal' | 'damaged' | 'lost') => {
  const response = await axiosInstance.put(`/borrows/return/${id}`, { bookCondition });
  return response.data;
};

const borrowApi = {
  getBorrows,
  getBorrowById,
  getUserBorrows,
  createBorrow,
  returnBook,
};

export default borrowApi;
