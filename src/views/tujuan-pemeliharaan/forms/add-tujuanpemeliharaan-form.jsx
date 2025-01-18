/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { forwardRef, useImperativeHandle } from "react";
import { Form, Input, Modal } from "antd";

const AddTujuanPemeliharaanForm = forwardRef((props, ref) => {
  const [form] = Form.useForm();
  const { visible, onCancel, onOk, confirmLoading } = props;

  // Expose form methods to parent via ref
  useImperativeHandle(ref, () => ({
    form,
  }));

  // Handle form submission
  const onFinish = (values) => {
    onOk(values);
  };

  return (
    <Modal
      title="Tambah Tujuan Pemeliharaan"
      visible={visible}
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onOk(values, form);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
      confirmLoading={confirmLoading}
      destroyOnClose
      okText="Simpan"
    >
      <Form form={form} layout="vertical" name="AddTujuanPemeliharaanForm" onFinish={onFinish}>
        <Form.Item name="tujuanPemeliharaan" label="Tujuan Pemeliharaan:" rules={[{ required: true, message: "Silahkan masukkan tujuan pemeliharaan!" }]}>
          <Input placeholder="Masukkan tujuan pemeliharaan" />
        </Form.Item>

        <Form.Item name="deskripsi" label="Deskripsi:" rules={[{ required: true, message: "Silahkan masukkan deskripsi!" }]}>
          <Input.TextArea placeholder="Masukkan deskripsi tujuan pemeliharaan" autoSize={{ minRows: 3, maxRows: 6 }} />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default AddTujuanPemeliharaanForm;
