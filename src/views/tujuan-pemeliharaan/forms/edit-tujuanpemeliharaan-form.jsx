/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
import React, { forwardRef, useImperativeHandle, useEffect } from "react";
import { Form, Input, Modal } from "antd";
import TujuanPemeliharaan from "..";

const EditTujuanPemeliharaanForm = forwardRef((props, ref) => {
  const [form] = Form.useForm();
  const { visible, onCancel, onOk, confirmLoading, currentRowData } = props;

  // Expose form methods to parent via ref
  useImperativeHandle(ref, () => ({
    form,
  }));

  // Set form fields when currentRowData changes
  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        idTujuanPemeliharaan: currentRowData.idTujuanPemeliharaan,
        tujuanPemeliharaan: currentRowData.tujuanPemeliharaan,
        deskripsi: currentRowData.deskripsi,
      });
    } else {
      form.resetFields();
    }
  }, [visible, currentRowData, form]);

  // Handle form submission
  const onFinish = (values) => {
    onOk(values, form);
  };

  return (
    <Modal
      title="Edit Tujuan Pemeliharaan"
      visible={visible}
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onOk(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
      confirmLoading={confirmLoading}
      destroyOnClose
      okText="Simpan"
    >
      <Form form={form} layout="vertical" name="EditTujuanPemeliharaanForm" onFinish={onFinish}>
        <Form.Item name="idTujuanPemeliharaan" hidden>
          <Input placeholder="ID Tujuan Pemeliharaan" />
        </Form.Item>
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

export default EditTujuanPemeliharaanForm;
