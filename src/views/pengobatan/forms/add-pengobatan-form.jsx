/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Row, Col } from "antd";
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
      const response = await fetch(
        "https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json"
      );
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
        setPetugasList(content);
      }
    } catch (error) {
      console.error("Error fetching petugas data:", error);
    }
  };

  const handleProvinceChange = async (value) => {
    const selectedProvince = provinces.find(
      (province) => province.name === value
    );
    if (selectedProvince) {
      try {
        const response = await fetch(
          `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvince.id}.json`
        );
        const data = await response.json();
        setRegencies(data);
        form.setFieldsValue({
          kabupatenPengobatan: undefined,
          kecamatanPengobatan: undefined,
          desaPengobatan: undefined,
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
        const response = await fetch(
          `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selectedRegency.id}.json`
        );
        const data = await response.json();
        setDistricts(data);
        form.setFieldsValue({
          kecamatanPengobatan: undefined,
          desaPengobatan: undefined,
        });
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    }
  };

  const handleDistrictChange = async (value) => {
    const selectedDistrict = districts.find(
      (district) => district.name === value
    );
    if (selectedDistrict) {
      try {
        const response = await fetch(
          `https://www.emsifa.com/api-wilayah-indonesia/api/villages/${selectedDistrict.id}.json`
        );
        const data = await response.json();
        setVillages(data);
        form.setFieldsValue({ desaPengobatan: undefined });
      } catch (error) {
        console.error("Error fetching villages:", error);
      }
    }
  };

  const handleVillageChange = (value) => {
    const selectedProvince = provinces.find(
      (province) => province.name === form.getFieldValue("provinsiPengobatan")
    );
    const selectedRegency = regencies.find(
      (regency) => regency.name === form.getFieldValue("kabupatenPengobatan")
    );
    const selectedDistrict = districts.find(
      (district) => district.name === form.getFieldValue("kecamatanPengobatan")
    );
    const selectedVillage = villages.find((village) => village.name === value);

    if (
      selectedProvince &&
      selectedRegency &&
      selectedDistrict &&
      selectedVillage
    ) {
      const mergedLocation = `${selectedVillage.name}, ${selectedDistrict.name}, ${selectedRegency.name}, ${selectedProvince.name}`;
      form.setFieldsValue({ lokasi: mergedLocation });
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formatDateToSubmit = (dateString) => {
        if (!dateString) return "";
        const [year, month, day] = dateString.split("-");
        return `${day}/${month}/${year}`;
      };

      values.tanggalPengobatan = formatDateToSubmit(values.tanggalPengobatan);
      values.tanggalKasus = formatDateToSubmit(values.tanggalKasus);
      onOk(values);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      title="Tambah Data Pengobatan"
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleSubmit}
      confirmLoading={confirmLoading}
      width={1000}
      okText="Simpan"
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="idKasus"
              label="ID Kasus:"
              rules={[{ required: true, message: "Masukkan ID Kasus!" }]}
            >
              <Input placeholder="Masukkan ID Kasus" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="tanggalPengobatan"
              label="Tanggal Pengobatan:"
              rules={[{ required: true }]}
            >
              <Input type="date" placeholder="Masukkan tanggal pengobatan" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="tanggalKasus"
              label="Tanggal Kasus:"
              rules={[{ required: true }]}
            >
              <Input type="date" placeholder="Masukkan tanggal kasus" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="petugasId"
              label="Petugas:"
              rules={[{ required: true, message: "Pilih Petugas!" }]}
            >
              <Select placeholder="Pilih Petugas">
                {petugasList.map(({ petugasId, namaPetugas }) => (
                  <Option key={petugasId} value={petugasId}>
                    {namaPetugas}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="dosis" label="Dosis:">
              <Input placeholder="Masukkan Dosis" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="sindrom" label="Tanda atau Sindrom:">
              <Input placeholder="Masukkan Tanda atau Sindrom" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="diagnosaBanding" label="Diagnosa Banding:">
              <Input placeholder="Masukkan Diagnosa Banding" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="namaInfrastruktur" label="Nama Infrastruktur:">
              <Input placeholder="Masukkan Nama Infrastruktur" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="provinsiPengobatan" label="Provinsi:">
              <Select
                placeholder="Pilih Provinsi"
                onChange={handleProvinceChange}
              >
                {provinces.map(({ id, name }) => (
                  <Option key={id} value={name}>
                    {name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="kabupatenPengobatan" label="Kabupaten:">
              <Select
                placeholder="Pilih Kabupaten"
                onChange={handleRegencyChange}
              >
                {regencies.map(({ id, name }) => (
                  <Option key={id} value={name}>
                    {name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="kecamatanPengobatan" label="Kecamatan:">
              <Select
                placeholder="Pilih Kecamatan"
                onChange={handleDistrictChange}
              >
                {districts.map(({ id, name }) => (
                  <Option key={id} value={name}>
                    {name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="desaPengobatan" label="Desa:">
              <Select placeholder="Pilih Desa" onChange={handleVillageChange}>
                {villages.map(({ id, name }) => (
                  <Option key={id} value={name}>
                    {name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="lokasi" label="Lokasi:">
              <Input placeholder="Lokasi akan otomatis terisi" disabled />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddPengobatanForm;
