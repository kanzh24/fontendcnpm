import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, Select } from "antd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS của react-toastify
import {
  getIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
  restoreIngredient,
  getSuppliers,
  deletedIngredient,
} from "../../api/api";

const { Option } = Select;

const IngredientManagement = () => {
  const [ingredients, setIngredients] = useState([]);
  const [deletedIngredients, setDeletedIngredients] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeletedModalOpen, setIsDeletedModalOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchIngredients();
    fetchSuppliers();
  }, []);

  const fetchIngredients = async () => {
    setLoading(true);
    try {
      const response = await getIngredients();
      setIngredients(response || []);
      const deleted = await deletedIngredient();
      // console.log(deleted)
      setDeletedIngredients(deleted || []);
    } catch (error) {
      toast.error("Không thể tải danh sách nguyên liệu");
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await getSuppliers();
      setSuppliers(response || []);
    } catch (error) {
      toast.error("Không thể tải danh sách nhà cung cấp");
    }
  };

  const fetchDeletedIngredients = async () => {
    try {
      const response = await deletedIngredient();
      setDeletedIngredients(response || []);
      console.log(response);

      setIsDeletedModalOpen(true);
    } catch (error) {
      toast.error("Không thể tải danh sách nguyên liệu đã xóa");
    }
  };

  const handleRestore = async id => {
    try {
      await restoreIngredient(id);
      toast.success("Khôi phục nguyên liệu thành công");
      fetchIngredients();
    } catch (error) {
      toast.error("Không thể khôi phục nguyên liệu");
    }
  };

  const showModal = (ingredient = null) => {
    setEditingIngredient(ingredient);
    if (ingredient) {
      form.setFieldsValue({
        name: ingredient.name,
        availableCount: parseFloat(ingredient.availableCount),
        unit: ingredient.unit,
        supplierId: ingredient.supplierId,
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const ingredientData = {
        name: values.name,
        availableCount: parseFloat(values.availableCount),
        unit: values.unit,
        supplierId: parseInt(values.supplierId),
      };

      if (editingIngredient) {
        await updateIngredient(editingIngredient.id, ingredientData);
        toast.success("Cập nhật nguyên liệu thành công");
      } else {
        await createIngredient(ingredientData);
        toast.success("Thêm nguyên liệu thành công");
      }
      setIsModalOpen(false);
      fetchIngredients();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response.data.message);
    }
  };

  const handleDelete = async id => {
    try {
      await deleteIngredient(id);
      toast.success("Xóa nguyên liệu thành công");
      fetchIngredients();
    } catch (error) {
      toast.error("Không thể xóa nguyên liệu");
    }
  };

  const columns = [
    {
      title: "Tên nguyên liệu",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "ID nguyên liệu",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Số lượng hiện tại",
      dataIndex: "availableCount",
      key: "availableCount",
      render: (availableCount, record) =>
        `${parseFloat(availableCount).toLocaleString()} ${record.unit}`,
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier",
      key: "supplier",
      render: supplier => supplier?.name || "N/A",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div>
          <Button
            type="primary"
            onClick={() => showModal(record)}
            style={{ marginRight: 8 }}
          >
            Sửa
          </Button>
          <Button type="primary" danger onClick={() => handleDelete(record.id)}>
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  const deletedColumns = [
    {
      title: "Tên nguyên liệu",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "ID nguyên liệu",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Số lượng hiện tại",
      dataIndex: "availableCount",
      key: "availableCount",
      render: (availableCount, record) =>
        `${parseFloat(availableCount).toLocaleString()} ${record.unit}`,
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplierId",
      key: "supplierId",
      render: supplierId => `${parseFloat(supplierId).toLocaleString()}`,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button type="primary" onClick={() => handleRestore(record.id)}>
          Khôi phục
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2>Quản lý nguyên liệu</h2>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          onClick={() => showModal()}
          style={{ marginRight: 8 }}
        >
          Thêm nguyên liệu mới
        </Button>
        <Button type="default" onClick={fetchDeletedIngredients}>
          Xem nguyên liệu đã xóa
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={ingredients}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingIngredient ? "Sửa nguyên liệu" : "Thêm nguyên liệu mới"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên nguyên liệu"
            rules={[
              { required: true, message: "Vui lòng nhập tên nguyên liệu" },
            ]}
          >
            <Input />
          </Form.Item>
          {/* <Form.Item
            name="availableCount"
            label="Số lượng hiện tại"
            rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
          >
            <InputNumber min={0} step={0.1} style={{ width: "100%" }} />
          </Form.Item> */}
          <Form.Item
            name="unit"
            label="Đơn vị"
            rules={[{ required: true, message: "Vui lòng nhập đơn vị" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="supplierId"
            label="Nhà cung cấp"
            rules={[{ required: true, message: "Vui lòng chọn nhà cung cấp" }]}
          >
            <Select placeholder="Chọn nhà cung cấp">
              {suppliers.map(supplier => (
                <Option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Danh sách nguyên liệu đã xóa"
        open={isDeletedModalOpen}
        onCancel={() => setIsDeletedModalOpen(false)}
        footer={null}
        width={800}
      >
        <Table
          columns={deletedColumns}
          dataSource={deletedIngredients}
          rowKey="id"
        />
      </Modal>

      {/* Thêm ToastContainer */}
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

export default IngredientManagement;
