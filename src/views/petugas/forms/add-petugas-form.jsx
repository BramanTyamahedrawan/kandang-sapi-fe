import { useState, useEffect } from "react";
import { Form, Input, Modal, Select } from "antd";

const { Option } = Select;

// eslint-disable-next-line react/prop-types
const AddPetugasForm = ({ visible, onCancel, onOk, confirmLoading }) => {
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
      .then((response) => response.json())
      .then((data) => setProvinces(data));
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
      form.setFieldsValue({ kecamatan: undefined });
    }
  };

  const handleDistrictChange = (value) => {
    const selectedProvince = provinces.find((province) => province.name === form.getFieldValue("provinsi"));
    const selectedRegency = regencies.find((regency) => regency.name === form.getFieldValue("kabupaten"));
    const selectedDistrict = districts.find((district) => district.name === value);

    if (selectedProvince && selectedRegency && selectedDistrict) {
      const mergedLocation = `${selectedDistrict.name}, ${selectedRegency.name}, ${selectedProvince.name}`;
      form.setFieldsValue({ wilayah: mergedLocation });
    }
  };

  const onFinish = (values) => {
    onOk(values, form);
  };

  return (
    <Modal title="Tambah Data Petugas" visible={visible} onCancel={onCancel} onOk={() => form.submit()} confirmLoading={confirmLoading} width={700} okText="Simpan">
      <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item label="NIK Petugas:" name="nikPetugas" rules={[{ required: true, message: "Masukkan NIK petugas!" }]}>
          <Input placeholder="Masukkan NIK petugas" />
        </Form.Item>
        <Form.Item label="Nama Petugas:" name="namaPetugas" rules={[{ required: true, message: "Masukkan nama petugas!" }]}>
          <Input placeholder="Masukkan nama petugas" />
        </Form.Item>
        <Form.Item label="No Telepon Petugas:" name="noTelp">
          <Input placeholder="Masukkan telepon petugas" />
        </Form.Item>
        <Form.Item label="Email Petugas:" name="email">
          <Input placeholder="Masukkan email petugas" />
        </Form.Item>
        <Form.Item label="Provinsi:" name="provinsi" rules={[{ required: true, message: "Pilih provinsi!" }]}>
          <Select placeholder="Pilih provinsi" onChange={handleProvinceChange}>
            {provinces.map((province) => (
              <Option key={province.id} value={province.name}>
                {province.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Kabupaten:" name="kabupaten" rules={[{ required: true, message: "Pilih kabupaten!" }]}>
          <Select placeholder="Pilih kabupaten" onChange={handleRegencyChange}>
            {regencies.map((regency) => (
              <Option key={regency.id} value={regency.name}>
                {regency.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Kecamatan:" name="kecamatan" rules={[{ required: true, message: "Pilih kecamatan!" }]}>
          <Select placeholder="Pilih kecamatan" onChange={handleDistrictChange}>
            {districts.map((district) => (
              <Option key={district.id} value={district.name}>
                {district.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Wilayah:" name="wilayah" rules={[{ required: true, message: "Wilayah akan otomatis terisi" }]}>
          <Input placeholder="Wilayah akan otomatis terisi" />
        </Form.Item>
        <Form.Item label="Pekerjaan:" name="job">
          <Select placeholder="Pilih pekerjaan">
            <Option key={1} value="pendataan">
              Pendataan
            </Option>
            <Option key={2} value="vaksinasi">
              Vaksinasi
            </Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPetugasForm;
