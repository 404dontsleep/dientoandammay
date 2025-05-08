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
    setName('Library Management');
  }, []);
  return (
    <>
      <section className="mx-auto container py-10">
        <Card
          bodyStyle={{
            padding: '0.5rem',
          }}
        >
          <div className="flex flex-row items-center gap-2">
            {canGoBack && (
              <div
                className="w-10 h-10 bg-blue-100 rounded-sm cursor-pointer"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-10 h-10" />
              </div>
            )}
            <span className="text-2xl font-bold">{name}</span>
          </div>
        </Card>
      </section>
      <Outlet />
    </>
  );
}
