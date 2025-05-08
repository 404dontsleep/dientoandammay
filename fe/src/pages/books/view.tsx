import useSWR from 'swr';
import bookApi from '../../api/bookApi';
import { useParams, useNavigate } from 'react-router-dom';

export default function ViewBook() {
  const { id } = useParams();
  const { data: book } = useSWR(`/books/${id}`, () => bookApi.getBookById(id as string));
  const navigate = useNavigate();
  return (
    <div className="container mx-auto py-4">
      {book && (
        <div className="bg-white shadow-md rounded-lg p-6 relative">
          <h1 className="text-2xl font-bold mb-4">{book.title}</h1>
          <button
            className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            onClick={() => navigate(`/books/edit/${book._id}`)}
          >
            Chỉnh sửa
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <p className="text-gray-600 font-semibold">Tác giả:</p>
              <p>{book.author}</p>
            </div>
            <div className="mb-4">
              <p className="text-gray-600 font-semibold">Năm xuất bản:</p>
              <p>{book.publishedYear}</p>
            </div>
            <div className="mb-4">
              <p className="text-gray-600 font-semibold">Số lượng:</p>
              <p>{book.quantity}</p>
            </div>
            <div className="mb-4">
              <p className="text-gray-600 font-semibold">Còn lại:</p>
              <p>{book.available}</p>
            </div>
          </div>
          {book.description && (
            <div className="mt-4">
              <p className="text-gray-600 font-semibold">Mô tả:</p>
              <p className="mt-2">{book.description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
