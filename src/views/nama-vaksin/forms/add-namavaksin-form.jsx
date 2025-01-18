/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { getJenisVaksin } from "../../../api/jenis-vaksin";
import { Form, Input, Modal, Select } from "antd";

const AddNamaVaksinForm = forwardRef((props, ref) => {
  const [form] = Form.useForm();
  const { visible, onCancel, onOk, confirmLoading } = props;
  const [jenisVaksinList, setJenisVaksinList] = useState([]);

  const fetchJenisVaksinList = async () => {
    try {
      const result = await getJenisVaksin();
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        console.log(content);
        const jenisVaksin = content.map(({ idJenisVaksin, jenis }) => ({
          idJenisVaksin,
          jenis,
        }));
        setJenisVaksinList(jenisVaksin);
      }
    } catch (error) {
      console.error("Error fetching jenis vaksin data:", error);
    }
  };
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
      title="Tambah Nama Vaksin"
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
      <Form form={form} layout="vertical" name="AddNamaVaksinForm" onFinish={onFinish}>
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
        <Form.Item name="nama" label="Nama Vaksin:" rules={[{ required: true, message: "Silahkan masukkan nama vaksin!" }]}>
          <Input placeholder="Masukkan nama vaksin" />
        </Form.Item>

        <Form.Item name="deskripsi" label="Deskripsi:" rules={[{ required: true, message: "Silahkan masukkan deskripsi!" }]}>
          <Input.TextArea placeholder="Masukkan deskripsi jenis vaksin" autoSize={{ minRows: 3, maxRows: 6 }} />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default AddNamaVaksinForm;
