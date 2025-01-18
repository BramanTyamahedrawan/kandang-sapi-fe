/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
import { getJenisVaksin } from "@/api/jenis-vaksin";
import { Form, Input, Modal, Select } from "antd";
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";

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
      destroyOnClose
    >
      <Form form={form} layout="vertical" name="EditJenisVaksinForm" onFinish={onFinish}>
        <Form.Item
          label="Jenis Vaksin:"
          name="jenisVaksinId"
          rules={[
            {
              required: true,
              message: "Silahkan pilih jenis vaksin!",
            },
          ]}
        >
          <Select placeholder="Pilih Jenis Vaksin" allowClear>
            {jenisVaksinList.map((jenisVaksin) => (
              <Select.Option key={jenisVaksin.idJenisVaksin} value={jenisVaksin.idJenisVaksin}>
                {jenisVaksin.jenis}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="jenis" label="Jenis Vaksin:" rules={[{ required: true, message: "Silahkan masukkan nama vaksin!" }]}>
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
