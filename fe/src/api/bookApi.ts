import axiosInstance from "./axiosInstance";
export type Book = {
  _id: string;
  title: string;
  author: string;
  description?: string;
  publishedYear: number;
};

export const getBooks = async (): Promise<Book[]> => {
  const response = await axiosInstance.get("/");
  return response.data;
};

export const deleteBook = async (id: string) => {
  const response = await axiosInstance.delete(`/${id}`);
  return response.data;
};

export const searchBooks = async (keyword: string): Promise<Book[]> => {
  const response = await axiosInstance.get(`/search?title=${keyword}`);
  return response.data;
};

export const updateBook = async (id: string, book: Book) => {
  const response = await axiosInstance.put(`/${id}`, book);
  return response.data;
};

export const addBook = async (book: Book) => {
  const response = await axiosInstance.post("/add", book);
  return response.data;
};

export const getBookById = async (id: string) => {
  const response = await axiosInstance.get(`/${id}`);
  return response.data;
};
