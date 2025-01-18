/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Modal, Form, Input, Select } from "antd";
import { getPetugas } from "@/api/petugas";

const { Option } = Select;

const AddPengobatanForm = ({ visible, onCancel, onOk, confirmLoading }) => {
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [petugasList, setPetugasList] = useState([]);

  useEffect(() => {
    fetchProvinces();
    fetchPetugasList();
  }, []);

  const fetchProvinces = async () => {
    try {
      const response = await fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json");
      const data = await response.json();
      setProvinces(data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
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

  const handleProvinceChange = async (value) => {
    const selectedProvince = provinces.find((province) => province.name === value);
    if (selectedProvince) {
      try {
        const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvince.id}.json`);
        const data = await response.json();
        setRegencies(data);
        form.setFieldsValue({
          kabupaten: undefined,
          kecamatan: undefined,
          desa: undefined,
        });
      } catch (error) {
        console.error("Error fetching regencies:", error);
      }
    }
  };

  const handleRegencyChange = async (value) => {
    const selectedRegency = regencies.find((regency) => regency.name === value);
    if (selectedRegency) {
      try {
        const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selectedRegency.id}.json`);
        const data = await response.json();
        setDistricts(data);
        form.setFieldsValue({ kecamatan: undefined, desa: undefined });
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    }
  };

  const handleDistrictChange = async (value) => {
    const selectedDistrict = districts.find((district) => district.name === value);
    if (selectedDistrict) {
      try {
        const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${selectedDistrict.id}.json`);
        const data = await response.json();
        setVillages(data);
        form.setFieldsValue({ desa: undefined });
      } catch (error) {
        console.error("Error fetching villages:", error);
      }
    }
  };

  const handleVillageChange = (value) => {
    const selectedProvince = provinces.find((province) => province.name === form.getFieldValue("provinsi"));
    const selectedRegency = regencies.find((regency) => regency.name === form.getFieldValue("kabupaten"));
    const selectedDistrict = districts.find((district) => district.name === form.getFieldValue("kecamatan"));
    const selectedVillage = villages.find((village) => village.name === value);

    if (selectedProvince && selectedRegency && selectedDistrict && selectedVillage) {
      const mergedLocation = `${selectedVillage.name}, ${selectedDistrict.name}, ${selectedRegency.name}, ${selectedProvince.name}`;
      form.setFieldsValue({ lokasi: mergedLocation });
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
      title="Tambah Data Pengobatan"
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
        <Form.Item name="idKasus" label="ID Kasus:" rules={[{ required: true, message: "Masukkan ID Kasus!" }]}>
          <Input placeholder="Masukkan ID Kasus" />
        </Form.Item>
        <Form.Item name="tanggalPengobatan" label="Tanggal Pengobatan:" rules={[{ required: true }]}>
          <Input type="date" placeholder="Masukkan tanggal pengobatan" />
        </Form.Item>
        <Form.Item name="tanggalKasus" label="Tanggal Kasus:" rules={[{ required: true }]}>
          <Input type="date" placeholder="Masukkan tanggal kasus" />
        </Form.Item>
        <Form.Item name="namaInfrastruktur" label="Nama Infrastruktur:">
          <Input placeholder="Masukkan Nama Infrastruktur" />
        </Form.Item>
        <Form.Item name="provinsi" label="Provinsi:">
          <Select placeholder="Pilih Provinsi" onChange={handleProvinceChange}>
            {provinces.map(({ id, name }) => (
              <Option key={id} value={name}>
                {name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="kabupaten" label="Kabupaten:">
          <Select placeholder="Pilih Kabupaten" onChange={handleRegencyChange}>
            {regencies.map(({ id, name }) => (
              <Option key={id} value={name}>
                {name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="kecamatan" label="Kecamatan:">
          <Select placeholder="Pilih Kecamatan" onChange={handleDistrictChange}>
            {districts.map(({ id, name }) => (
              <Option key={id} value={name}>
                {name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="desa" label="Desa:">
          <Select placeholder="Pilih Desa" onChange={handleVillageChange}>
            {villages.map(({ id, name }) => (
              <Option key={id} value={name}>
                {name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="lokasi" label="Lokasi:">
          <Input placeholder="Lokasi akan otomatis terisi" disabled />
        </Form.Item>
        <Form.Item name="dosis" label="Dosis:">
          <Input placeholder="Masukkan Dosis" />
        </Form.Item>
        <Form.Item name="sindrom" label="Tanda atau Sindrom:">
          <Input placeholder="Masukkan Tanda atau Sindrom" />
        </Form.Item>
        <Form.Item name="diagnosaBanding" label="Diagnosa Banding:">
          <Input placeholder="Masukkan Diagnosa Banding" />
        </Form.Item>
        <Form.Item name="petugas_id" label="Petugas:" rules={[{ required: true, message: "Pilih Petugas!" }]}>
          <Select placeholder="Pilih Petugas">
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

export default AddPengobatanForm;
