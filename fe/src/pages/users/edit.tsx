import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import * as userApi from '../../api/userApi';
import { App, Button, Form, Input, Card } from 'antd';
import { useEffect } from 'react';

export default function EditUser() {
  const { id } = useParams();
  const { data: user, isLoading } = useSWR(`/users/${id}`, () => userApi.getUserById(id as string));
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { message } = App.useApp();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      });
    }
  }, [user, form]);

  const handleSubmit = async (values: { name: string; email: string; phone?: string; address?: string }) => {
    try {
      await userApi.updateUser(id as string, values);
      message.success('Cập nhật người dùng thành công');
      navigate(`/users/list`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error('Lỗi: ' + error.message);
      } else {
        message.error('Đã xảy ra lỗi không xác định');
      }
    }
  };

  if (isLoading) {
    return <div className="container mx-auto py-4">Loading...</div>;
  }

  return (
    <section className="flex flex-col mx-auto container">
      <Card>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          form={form}
          onFinish={handleSubmit}
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
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
            >
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </section>
  );
}
