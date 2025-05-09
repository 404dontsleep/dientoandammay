import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Card } from 'antd';
import { ArrowLeft } from 'lucide-react';
import { useNavStore } from '../hooks/useNavStore';
import { useEffect } from 'react';
export default function MainLayout() {
  const location = useLocation();
  console.log(location);
  const canGoBack = location.pathname !== '/';
  const navigate = useNavigate();
  const { name, setName } = useNavStore();
  useEffect(() => {
    setName('Quản lý thư viện');
  }, []);
  return (
    <>
      <section className="mx-auto container mb-10">
        <Card
          bodyStyle={{
            padding: '1rem',
          }}
        >
          <div className="flex flex-row items-center gap-2">
            {canGoBack && (
              <div
                className="w-8 h-8 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300 shadow-sm"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-5 h-5 text-blue-600" />
              </div>
            )}
            <div className="flex-1 flex items-center justify-center">
              <span className="text-4xl font-bold">{name}</span>
            </div>
          </div>
        </Card>
      </section>
      <Outlet />
    </>
  );
}
