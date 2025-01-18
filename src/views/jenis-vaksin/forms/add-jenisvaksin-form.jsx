/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { forwardRef, useImperativeHandle } from "react";
import { Form, Input, Modal } from "antd";

const AddJenisVaksinForm = forwardRef((props, ref) => {
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
      title="Tambah Jenis Vaksin"
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
      <Form form={form} layout="vertical" name="AddJenisVaksinForm" onFinish={onFinish}>
        <Form.Item name="jenis" label="Jenis Vaksin:" rules={[{ required: true, message: "Silahkan masukkan jenis vaksin!" }]}>
          <Input placeholder="Masukkan jenis vaksin" />
        </Form.Item>

        <Form.Item name="deskripsi" label="Deskripsi:" rules={[{ required: true, message: "Silahkan masukkan deskripsi!" }]}>
          <Input.TextArea placeholder="Masukkan deskripsi jenis vaksin" autoSize={{ minRows: 3, maxRows: 6 }} />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default AddJenisVaksinForm;
