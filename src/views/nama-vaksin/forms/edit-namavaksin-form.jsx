/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
import React, { forwardRef, useImperativeHandle, useEffect, useState } from "react";
import { Form, Input, Modal } from "antd";
import { getJenisVaksin } from "@/api/jenis-vaksin";

const EditNamaVaksinForm = forwardRef((props, ref) => {
  const [form] = Form.useForm();
  const { visible, onCancel, onOk, confirmLoading, currentRowData } = props;
  const [jenisVaksinList, setJenisVaksin] = useState([]);

  const fetchJenisVaksinList = async () => {
    try {
      const result = await getJenisVaksin();
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        setJenisVaksin(
          content.map(({ idJenisVaksin, jenis }) => ({
            idJenisVaksin,
            jenis,
          }))
        );
      }
    } catch (error) {
      console.log("Error fetching jenis vaksin list", error);
    }
  };

  // Expose form methods to parent via ref
  useImperativeHandle(ref, () => ({
    form,
  }));

  // Set form fields when currentRowData changes
  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        idJenisVaksin: currentRowData.idJenisVaksin,
        nama: currentRowData.nama,
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
      title="Edit Nama Vaksin"
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
      width={700}
      destroyOnClose
    >
      <Form
        {...{
          labelCol: { span: 6 },
          wrapperCol: { span: 17 },
        }}
        form={form}
        layout="vertical"
        name="EditJenisVaksinForm"
        onFinish={onFinish}
      >
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

export default EditNamaVaksinForm;
