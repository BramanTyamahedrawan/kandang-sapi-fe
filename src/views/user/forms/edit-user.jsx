import { useState, useEffect } from "react";
import { Form, Input, message, Modal, Select, Row, Col } from "antd";
import Item from "antd/es/list/Item";
const { Option } = Select;
import { validatePassword } from "@/api/user";

const EditUserForm = ({ visible, onCancel, onOk, confirmLoading, currentRowData }) => {
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (currentRowData && currentRowData.alamat) {
      initializeForm(currentRowData.alamat);
    }
  }, [currentRowData]);

  const fetchProvinces = async () => {
    try {
      const response = await fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json");
      const data = await response.json();
      setProvinces(data);
    } catch (error) {
      message.error("Gagal memuat provinsi");
    }
  };

  const initializeForm = async (alamat) => {
    const [district, regency, province] = alamat.split(",").map((item) => item.trim());
    form.setFieldsValue({
      provinsi: province,
      kabupaten: regency,
      kecamatan: district,
      nik: currentRowData.nik,
      name: currentRowData.name,
      email: currentRowData.email,
      username: currentRowData.username,
      alamat: currentRowData.alamat,
      role: currentRowData.role,
      id: currentRowData.id,
    });

    if (province) await loadRegencies(province);
    if (regency) await loadDistricts(regency);
  };

  const loadRegencies = async (province) => {
    const selectedProvince = provinces.find((prov) => prov.name === province);
    if (selectedProvince) {
      try {
        const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvince.id}.json`);
        const data = await response.json();
        setRegencies(data);
      } catch (error) {
        message.error("Gagal memuat data kecamatan");
      }
    }
  };

  const loadDistricts = async (regency) => {
    const selectedRegency = regencies.find((reg) => reg.name === regency);
    if (selectedRegency) {
      try {
        const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selectedRegency.id}.json`);
        const data = await response.json();
        setDistricts(data);
      } catch (error) {
        message.error("Gagal memuat data kecamatan");
      }
    }
  };

  const handleProvinceChange = async (value) => {
    const selectedProvince = provinces.find((province) => province.name === value);

    if (selectedProvince) {
      try {
        const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvince.id}.json`);
        const data = await response.json();
        setRegencies(data);
        setDistricts([]);
        form.setFieldsValue({
          kabupaten: undefined,
          kecamatan: undefined,
          alamat: undefined,
        });
      } catch (error) {
        console.error("Error fetching regencies:", error);
        message.error("Gagal mengambil data kabupaten.");
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
        form.setFieldsValue({
          kecamatan: undefined,
          alamat: undefined,
        });
      } catch (error) {
        console.error("Error fetching districts:", error);
        message.error("Gagal mengambil data kecamatan.");
      }
    }
  };
  const handleDistrictChange = (value) => {
    const selectedProvince = provinces.find((provinces) => provinces.name === form.getFieldValue("provinsi"));
    const selectedRegency = regencies.find((regencies) => regencies.name === form.getFieldValue("kabupaten"));
    const selectedDistrict = districts.find((district) => district.name === value);

    if (selectedProvince && selectedRegency && selectedDistrict) {
      const mergedLocation = `${selectedDistrict.name}, ${selectedRegency.name}, ${selectedProvince.name}`;
      form.setFieldsValue({ alamat: mergedLocation });
    }
  };

  const onSubmit = async (values) => {
    try {
      await form.validateFields(); // Validasi form
      onOk(values, form);
    } catch (error) {
      console.error("Validate Failed:", error);
    }
  };

  return (
    <Modal title="Update Data User" visible={visible} onCancel={onCancel} onOk={() => form.submit()} confirmLoading={confirmLoading} width={1000} okText="Simpan">
      <Form form={form} layout="vertical" onFinish={onSubmit} autoComplete="off">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Id User" name="id">
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Nik" name="nik" rules={[{ required: true, message: "Silakan masukan nik user!" }]}>
              <Input placeholder="Masuka Nik User" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Nama Lengkap" name="name" rules={[{ required: true, message: "Masukkan nama lengkap!" }]}>
              <Input placeholder="Masukan Nama Lengkap" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Email" name="email" rules={[{ required: true, message: "Masukan email!", type: "email", message: "Masukkan email yang valid!" }]}>
              <Input placeholder="Masukan Email" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Provinsi:" name="provinsi" rules={[{ required: true, message: "Pilih provinsi!" }]}>
              <Select placeholder="Pilih provinsi" onChange={handleProvinceChange}>
                {provinces.map((province) => (
                  <Option key={province.id} value={province.name}>
                    {province.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Kabupaten:" name="kabupaten" rules={[{ required: true, message: "Pilih kabupaten!" }]}>
              <Select placeholder="Pilih kabupaten" onChange={handleRegencyChange}>
                {regencies.map((regency) => (
                  <Option key={regency.id} value={regency.name}>
                    {regency.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Kecamatan:" name="kecamatan" rules={[{ required: true, message: "Pilih kecamatan!" }]}>
              <Select placeholder="Pilih kecamatan" onChange={handleDistrictChange}>
                {districts.map((district) => (
                  <Option key={district.id} value={district.name}>
                    {district.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Alamat:" name="alamat" rules={[{ required: true, message: "Alamat akan otomatis terisi" }]}>
              <Input placeholder="Alamat akan otomatis terisi" readOnly />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Username" name="username" rules={[{ required: true, message: "Masukkan Username" }]}>
              <Input placeholder="Masukan Username" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Password Lama" name="oldPassword">
              <Input.Password placeholder="Masukan password lama jika mau update password" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Password Baru" name="newPassword">
              <Input.Password placeholder="Masukan password baru jika update password" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Role User:" name="role">
              <Select placeholder="Pilih Role">
                <Option key={1} value="1">
                  ROLE_ADMINISTRATOR
                </Option>
                <Option key={2} value="2">
                  ROLE_PETUGAS
                </Option>
                <Option key={3} value="3">
                  ROLE_PETERNAK
                </Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EditUserForm;
