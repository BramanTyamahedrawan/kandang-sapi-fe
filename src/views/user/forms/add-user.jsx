import { useState, useEffect } from "react";
import { Form, Input, Modal, Select, Row, Col } from "antd";
const { Option } = Select;

const AddUserForm = ({ visible, onCancel, onOk, confirmLoading }) => {
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
      .then((response) => response.json())
      .then((data) => {
        setProvinces(data);
      });
  }, []);

  const handleProvinceChange = (value) => {
    const selectedProvince = provinces.find((province) => province.name === value);
    if (selectedProvince) {
      fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvince.id}.json`)
        .then((response) => response.json())
        .then((data) => setRegencies(data));
      form.setFieldsValue({ kabupaten: undefined, kecamatan: undefined });
    }
  };

  const handleRegencyChange = (value) => {
    const selectedRegency = regencies.find((regency) => regency.name === value);
    if (selectedRegency) {
      fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selectedRegency.id}.json`)
        .then((response) => response.json())
        .then((data) => setDistricts(data));
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

  const onSubmit = (values) => {
    onOk(values, form);
  };

  return (
    <Modal title="Tambah Data User" visible={visible} onCancel={onCancel} onOk={() => form.submit()} confirmLoading={confirmLoading} width={1000} okText="Simpan">
      <Form form={form} layout="vertical" onFinish={onSubmit} autoComplete="off">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Nik" name="nik" rules={[{ required: true, message: "Silakan masukan nik user!" }]}>
              <Input placeholder="Masukan Nik User" />
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
            <Form.Item label="Password" name="password" rules={[{ required: true, message: "Masukkan password!" }]}>
              <Input.Password placeholder="Masukan Password" />
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

export default AddUserForm;
