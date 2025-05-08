import axiosInstance from "./axiosInstance";

export type Book = {
  _id: string;
  title: string;
  author: string;
  description?: string;
  publishedYear: number;
  quantity: number;
  available: number;
};

export type BookResponse = {
  books: Book[];
  total: number;
  page: number;
  pages: number;
};

export const getBooks = async (page = 1, limit = 10, search = ''): Promise<BookResponse> => {
  const response = await axiosInstance.get(`/?page=${page}&limit=${limit}&search=${search}`);
  return response.data;
};

export const getBookById = async (id: string): Promise<Book> => {
  const response = await axiosInstance.get(`/${id}`);
  return response.data;
};

export const searchBooks = async (keyword: string): Promise<Book[]> => {
  const response = await axiosInstance.get(`/search?title=${keyword}`);
  return response.data;
};

export const addBook = async (book: Omit<Book, '_id'>) => {
  const response = await axiosInstance.post('/', book);
  return response.data;
};

export const updateBook = async (id: string, book: Partial<Book>) => {
  const response = await axiosInstance.put(`/${id}`, book);
  return response.data;
};

export const deleteBook = async (id: string) => {
  const response = await axiosInstance.delete(`/${id}`);
  return response.data;
};

const bookApi = {
  getBooks,
  getBookById,
  searchBooks,
  addBook,
  updateBook,
  deleteBook,
};

export default bookApi;
