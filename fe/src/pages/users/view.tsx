import useSWR from 'swr';
import * as userApi from '../../api/userApi';
import { useParams, useNavigate } from 'react-router-dom';

export default function ViewUser() {
  const { id } = useParams();
  const { data: user } = useSWR(`/users/${id}`, () => userApi.getUserById(id as string));
  const navigate = useNavigate();
  return (
    <div className="container mx-auto py-4">
      {user && (
        <div className="bg-white shadow-md rounded-lg p-6 relative">
          <h1 className="text-2xl font-bold mb-4">{user.name}</h1>
          <button
            className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            onClick={() => navigate(`/users/edit/${user._id}`)}
          >
            Chỉnh sửa
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <p className="text-gray-600 font-semibold">Email:</p>
              <p>{user.email}</p>
            </div>
            <div className="mb-4">
              <p className="text-gray-600 font-semibold">Số điện thoại:</p>
              <p>{user.phone || 'Chưa cập nhật'}</p>
            </div>
            <div className="mb-4">
              <p className="text-gray-600 font-semibold">Địa chỉ:</p>
              <p>{user.address || 'Chưa cập nhật'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
