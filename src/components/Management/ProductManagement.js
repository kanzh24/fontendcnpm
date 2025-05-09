import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select } from 'antd';
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import CSS của react-toastify
import { getDrinks, createDrink, updateDrink, deleteDrink, getIngredients, deleted, restore } from '../../api/api';

const { Option } = Select;

const ProductManagement = () => {
  const [drinks, setDrinks] = useState([]);
  const [deletedDrinks, setDeletedDrinks] = useState([]); // Danh sách đồ uống đã xóa
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeletedModalOpen, setIsDeletedModalOpen] = useState(false); // Trạng thái modal đồ uống đã xóa
  const [editingDrink, setEditingDrink] = useState(null);
  const [form] = Form.useForm();

  // Lấy danh sách đồ uống và nguyên liệu khi component mount
  useEffect(() => {
    fetchDrinks();
    fetchIngredients();
  }, []);

  const fetchDrinks = async () => {
    setLoading(true);
    try {
      const response = await getDrinks();
      setDrinks(response || []);
      console.log(response);
    } catch (error) {
      toast.error('Không thể tải danh sách đồ uống');
    } finally {
      setLoading(false);
    }
  };

  const fetchIngredients = async () => {
    try {
      const response = await getIngredients();
      setIngredients(response || []);
    } catch (error) {
      toast.error('Không thể tải danh sách nguyên liệu');
    }
  };

  // Lấy danh sách đồ uống đã xóa
  const fetchDeletedDrinks = async () => {
    try {
      const response = await deleted();
      setDeletedDrinks(response || []);
      setIsDeletedModalOpen(true);
    } catch (error) {
      toast.error('Không thể tải danh sách đồ uống đã xóa');
    }
  };

  // Khôi phục đồ uống
  const handleRestore = async (id) => {
    try {
      console.log(id);
      await restore(id);
      toast.success('Khôi phục đồ uống thành công');
      fetchDeletedDrinks(); // Cập nhật danh sách đồ uống đã xóa
      fetchDrinks(); // Cập nhật danh sách đồ uống chính
    } catch (error) {
      toast.error('Không thể khôi phục đồ uống');
    }
  };

  // Mở modal để thêm hoặc sửa đồ uống
  const showModal = (drink = null) => {
    setEditingDrink(drink);
    console.log(drink);
    if (drink) {
      form.setFieldsValue({
        name: drink.name,
        image_url: drink.image_url,
        price: parseFloat(drink.price),
        recipe: drink.recipes?.map((r) => ({
          id: r.ingredient.id || '', // Ánh xạ ID sang name
          quantity: parseInt(r.quantity),
        })) || [],
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  // Xử lý submit form (thêm hoặc sửa)
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const drinkData = {
        name: values.name,
        image_url: values.image_url,
        price: values.price,
        recipe: values.recipe?.map((item) => ({
          id: parseInt(item.id),
          quantity: item.quantity,
        })) || [],
      };

      if (editingDrink) {
        console.log(drinkData);
        await updateDrink(editingDrink.id, drinkData);
        toast.success('Cập nhật đồ uống thành công');
      } else {
        console.log(drinkData);
        await createDrink(drinkData);
        toast.success('Thêm đồ uống thành công');
      }
      setIsModalOpen(false);
      fetchDrinks();
    } catch (error) {
      console.error('Error:', error.response.data.message);
      toast.error(error.response.data.message);
    }
  };

  // Xử lý xóa đồ uống
  const handleDelete = async (id) => {
    try {
      await deleteDrink(id);
      toast.success('Xóa đồ uống thành công');
      fetchDrinks();
    } catch (error) {
      toast.error('Không thể xóa đồ uống');
    }
  };

  // Cột của bảng đồ uống chính
  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'ID sản phẩm',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Số lượng đã bán',
      dataIndex: 'soldCount',
      key: 'soldCount',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${parseFloat(price).toLocaleString()} VND`,
    },
    {
      title: 'Danh sách nguyên liệu',
      key: 'ingredients',
      render: (_, record) => {
        return record.recipes?.map((r, index) => {
          const ingredient = r.ingredient;
          return (
            <div key={`${r.ingredientId}-${index}`}>
              {r.ingredient?.name || 'N/A'}: {r.quantity} {ingredient?.unit || ''}
            </div>
          );
        }) || 'N/A';
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <div>
          <Button type="primary" onClick={() => showModal(record)} style={{ marginRight: 8 }}>
            Sửa
          </Button>
          <Button type="primary" danger onClick={() => handleDelete(record.id)}>
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  // Cột của bảng đồ uống đã xóa
  const deletedColumns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'ID sản phẩm',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Số lượng đã bán',
      dataIndex: 'soldCount',
      key: 'soldCount',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${parseFloat(price).toLocaleString()} VND`,
    },
    {
      title: 'Danh sách nguyên liệu',
      key: 'ingredients',
      render: (_, record) => {
        return record.recipes?.map((r, index) => {
          const ingredient = r.ingredient;
          return (
            <div key={`${r.ingredientId}-${index}`}>
              {ingredient?.name || 'N/A'}: {r.quantity} {ingredient?.unit || ''}
            </div>
          );
        }) || 'N/A';
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button type="primary" onClick={() => handleRestore(record.id)}>
          Khôi phục
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2>Quản lý sản phẩm</h2>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => showModal()} style={{ marginRight: 8 }}>
          Thêm đồ uống mới
        </Button>
        <Button type="default" onClick={fetchDeletedDrinks}>
          Xem đồ uống đã xóa
        </Button>
      </div>

      <Table columns={columns} dataSource={drinks} rowKey="id" loading={loading} />

      {/* Modal để thêm/sửa đồ uống */}
      <Modal
        title={editingDrink ? 'Sửa đồ uống' : 'Thêm đồ uống mới'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên đồ uống"
            rules={[{ required: true, message: 'Vui lòng nhập tên đồ uống' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="image_url"
            label="URL hình ảnh"
            rules={[{ required: true, message: 'Vui lòng nhập URL hình ảnh' }]}
            initialValue="https://example.com/images/drink.jpg"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá"
            rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.List name="recipe">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} style={{ display: 'flex', marginBottom: 8 }}>
                    <Form.Item
                      {...restField}
                      name={[name, 'id']}
                      rules={[{ required: true, message: 'Chọn nguyên liệu' }]}
                      style={{ width: '50%', marginRight: 8 }}
                    >
                      <Select placeholder="Chọn nguyên liệu">
                        {ingredients.map((ing) => (
                          <Option key={ing.id} value={ing.id}>
                            {ing.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'quantity']}
                      rules={[{ required: true, message: 'Nhập số lượng' }]}
                      style={{ width: '40%', marginRight: 8 }}
                    >
                      <InputNumber min={0} placeholder="Số lượng" />
                    </Form.Item>
                    <Button type="link" onClick={() => remove(name)}>
                      Xóa
                    </Button>
                  </div>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block>
                    Thêm nguyên liệu
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      {/* Modal để hiển thị danh sách đồ uống đã xóa */}
      <Modal
        title="Danh sách đồ uống đã xóa"
        open={isDeletedModalOpen}
        onCancel={() => setIsDeletedModalOpen(false)}
        footer={null}
        width={800}
      >
        <Table columns={deletedColumns} dataSource={deletedDrinks} rowKey="id" />
      </Modal>

      {/* Thêm ToastContainer với cấu hình */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default ProductManagement;