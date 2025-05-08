import { Form, Input, Button, Card, App } from 'antd';
import { useNavigate } from 'react-router-dom';
import { addUser } from '../../api/userApi';
import type { User } from '../../api/userApi';
import { AxiosError } from 'axios';

export default function AddUser() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const onFinish = async (values: Omit<User, '_id'>) => {
    try {
      await addUser(values);
      message.success('Thêm người dùng thành công');
      navigate('/users');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        message.error('Lỗi: ' + error.response?.data.message);
      } else {
        message.error('Lỗi: ' + error);
      }
    }
  };

  return (
    <div className="container mx-auto py-4">
      <Card title="Thêm người dùng">
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Tên người dùng"
            rules={[{ required: true, message: 'Vui lòng nhập tên người dùng' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Địa chỉ"
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
            >
              Thêm người dùng
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
