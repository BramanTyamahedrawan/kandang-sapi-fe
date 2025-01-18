/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Modal, Form, Input, Select } from "antd";
import { getPetugas } from "@/api/petugas";
import { getPeternaks } from "@/api/peternak";
import { getKandang } from "@/api/kandang";

const { Option } = Select;

const EditHewanForm = ({ visible, onCancel, onOk, confirmLoading, currentRowData }) => {
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [peternakList, setPeternakList] = useState([]);
  const [petugasList, setPetugasList] = useState([]);
  const [kandangList, setKandangList] = useState([]);

  useEffect(() => {
    fetchProvinces();
    fetchPeternakList();
    fetchPetugasList();
    fetchKandangList();
  }, []);

  useEffect(() => {
    if (currentRowData) {
      form.setFieldsValue(currentRowData);
    }
  }, [currentRowData, form]);

  const fetchProvinces = async () => {
    try {
      const response = await fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json");
      const data = await response.json();
      setProvinces(data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const fetchPeternakList = async () => {
    try {
      const result = await getPeternaks();
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        setPeternakList(
          content.map(({ idPeternak, namaPeternak }) => ({
            idPeternak,
            namaPeternak,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching peternak data:", error);
    }
  };

  const fetchPetugasList = async () => {
    try {
      const result = await getPetugas();
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        setPetugasList(
          content.map(({ nikPetugas, namaPetugas }) => ({
            nikPetugas,
            namaPetugas,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching petugas data:", error);
    }
  };

  const fetchKandangList = async () => {
    try {
      const result = await getKandang();
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        setKandangList(content.map((kandang) => kandang.idKandang));
      }
    } catch (error) {
      console.error("Error fetching kandang data:", error);
    }
  };

  const handleProvinceChange = async (value) => {
    const province = provinces.find((item) => item.name === value);
    if (province) {
      try {
        const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${province.id}.json`);
        const data = await response.json();
        setRegencies(data);
        setDistricts([]);
        setVillages([]);
        form.resetFields(["kabupaten", "kecamatan", "desa"]);
      } catch (error) {
        console.error("Error fetching regencies:", error);
      }
    }
  };

  const handleRegencyChange = async (value) => {
    const regency = regencies.find((item) => item.name === value);
    if (regency) {
      try {
        const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${regency.id}.json`);
        const data = await response.json();
        setDistricts(data);
        setVillages([]);
        form.resetFields(["kecamatan", "desa"]);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    }
  };

  const handleDistrictChange = async (value) => {
    const district = districts.find((item) => item.name === value);
    if (district) {
      try {
        const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${district.id}.json`);
        const data = await response.json();
        setVillages(data);
        form.resetFields(["desa"]);
      } catch (error) {
        console.error("Error fetching villages:", error);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onOk(values);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      title="Edit Hewan"
      visible={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleSubmit}
      confirmLoading={confirmLoading}
      width={700}
      okText="Simpan"
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Kode Eartag Nasional" name="kodeEartagNasional" rules={[{ required: true, message: "Masukkan Kode Eartag Nasional!" }]}>
          <Input placeholder="Kode Eartag Nasional" disabled />
        </Form.Item>
        <Form.Item label="Provinsi" name="provinsi" rules={[{ required: true, message: "Masukkan Provinsi!" }]}>
          <Select placeholder="Pilih Provinsi" onChange={handleProvinceChange} allowClear>
            {provinces.map((item) => (
              <Option key={item.id} value={item.name}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Kabupaten" name="kabupaten">
          <Select placeholder="Pilih Kabupaten" onChange={handleRegencyChange} allowClear>
            {regencies.map((item) => (
              <Option key={item.id} value={item.name}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Kecamatan" name="kecamatan">
          <Select placeholder="Pilih Kecamatan" onChange={handleDistrictChange} allowClear>
            {districts.map((item) => (
              <Option key={item.id} value={item.name}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Desa" name="desa">
          <Select placeholder="Pilih Desa" allowClear>
            {villages.map((item) => (
              <Option key={item.id} value={item.name}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Alamat" name="alamat" rules={[{ required: true, message: "Masukkan Alamat!" }]}>
          <Input placeholder="Masukkan Alamat" />
        </Form.Item>
        <Form.Item label="Peternak" name="peternak_id">
          <Select placeholder="Pilih Peternak" allowClear>
            {peternakList.map(({ idPeternak, namaPeternak }) => (
              <Option key={idPeternak} value={idPeternak}>
                {namaPeternak}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Kandang" name="kandang_id">
          <Select placeholder="Pilih Kandang" allowClear>
            {kandangList.map((id) => (
              <Option key={id} value={id}>
                {id}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Petugas Pendaftar" name="petugas_id" rules={[{ required: true, message: "Pilih Petugas Pendaftar!" }]}>
          <Select placeholder="Pilih Petugas Pendaftar" allowClear>
            {petugasList.map(({ nikPetugas, namaPetugas }) => (
              <Option key={nikPetugas} value={nikPetugas}>
                {namaPetugas}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditHewanForm;
