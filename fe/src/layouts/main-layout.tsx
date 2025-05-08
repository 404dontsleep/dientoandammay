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
                className="w-8 h-8 bg-blue-100 rounded-sm cursor-pointer"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-8 h-8" />
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
