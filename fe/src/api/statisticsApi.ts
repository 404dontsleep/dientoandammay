import axiosInstance from './axiosInstance';

export type BorrowStats = {
  borrowStats: Array<{
    _id: string;
    count: number;
  }>;
  returnStats: number;
  currentlyBorrowed: number;
  overdue: number;
};

export type BookStats = {
  mostBorrowed: {
    title: string;
    author: string;
    borrowCount: number;
  } | null;
  leastBorrowed: {
    title: string;
    author: string;
    borrowCount: number;
  } | null;
  neverBorrowed: Array<{
    title: string;
    author: string;
  }>;
  conditionStats: Array<{
    title: string;
    author: string;
    condition: 'lost' | 'damaged';
    count: number;
  }>;
};

export type UserStats = {
  mostActiveUser: {
    name: string;
    email: string;
    borrowCount: number;
  } | null;
  overdueUsers: Array<{
    name: string;
    email: string;
    overdueCount: number;
  }>;
};

export const getBorrowStats = async (
  startDate?: string,
  endDate?: string,
  groupBy: 'day' | 'month' | 'year' = 'day',
): Promise<BorrowStats> => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  params.append('groupBy', groupBy);

  const response = await axiosInstance.get(`/borrows?${params.toString()}`);
  return response.data;
};

export const getBookStats = async (startDate?: string, endDate?: string): Promise<BookStats> => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const response = await axiosInstance.get(`/books?${params.toString()}`);
  return response.data;
};

export const getUserStats = async (startDate?: string, endDate?: string): Promise<UserStats> => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const response = await axiosInstance.get(`/users?${params.toString()}`);
  return response.data;
};

const statisticsApi = {
  getBorrowStats,
  getBookStats,
  getUserStats,
};

export default statisticsApi;
