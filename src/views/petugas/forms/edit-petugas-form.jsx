/** @format */

import { Form, Input, Modal, Select, message } from "antd";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

const { Option } = Select;

// Menggunakan forwardRef untuk memberikan referensi ke komponen luar
// eslint-disable-next-line react/display-name
const EditPetugasForm = forwardRef(
  // eslint-disable-next-line react/prop-types
  ({ visible, onCancel, onOk, confirmLoading, currentRowData }, ref) => {
    const [form] = Form.useForm();
    const [provinces, setProvinces] = useState([]);
    const [regencies, setRegencies] = useState([]);
    const [districts, setDistricts] = useState([]);

    // Menggunakan useImperativeHandle untuk memberikan akses ke form dari luar
    useImperativeHandle(ref, () => ({
      validateFields: () => form.validateFields(),
      resetFields: () => form.resetFields(),
    }));

    useEffect(() => {
      // Fetch provinsi
      fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
        .then((response) => response.json())
        .then((data) => {
          setProvinces(data);

          // Jika currentRowData tersedia, isi form dan load wilayah terkait
          if (currentRowData) {
            form.setFieldsValue(currentRowData);
            loadRegenciesAndDistricts(data, currentRowData);
          }
        })
        .catch(() => {
          message.error("Gagal memuat data provinsi");
        });
    }, [currentRowData]);

    const loadRegenciesAndDistricts = (provincesData, rowData) => {
      const selectedProvince = provincesData.find((province) => province.name === rowData.provinsi);

      if (selectedProvince) {
        // Fetch kabupaten
        fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvince.id}.json`)
          .then((response) => response.json())
          .then((regencyData) => {
            setRegencies(regencyData);

            // Fetch kecamatan jika kabupaten ditemukan
            const selectedRegency = regencyData.find((regency) => regency.name === rowData.kabupaten);
            if (selectedRegency) {
              fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selectedRegency.id}.json`)
                .then((response) => response.json())
                .then((districtData) => {
                  setDistricts(districtData);
                  // Setelah kecamatan ditemukan, atur wilayah secara otomatis
                  const selectedDistrict = districtData.find((district) => district.name === rowData.kecamatan);
                  if (selectedDistrict) {
                    const mergedLocation = `${selectedDistrict.name}, ${selectedRegency.name}, ${selectedProvince.name}`;
                    form.setFieldsValue({ wilayah: mergedLocation });
                  }
                });
            }
          });
      }
    };

    const handleProvinceChange = (value) => {
      const selectedProvince = provinces.find((province) => province.name === value);
      if (selectedProvince) {
        fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvince.id}.json`)
          .then((response) => response.json())
          .then((data) => setRegencies(data));
        form.setFieldsValue({ kabupaten: undefined, kecamatan: undefined });
        setDistricts([]); // Reset districts saat provinsi berubah
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

    const handleFinish = (values) => {
      onOk(values);
    };

    return (
      <Modal title="Edit Data Petugas" visible={visible} onCancel={onCancel} onOk={() => form.submit()} confirmLoading={confirmLoading} width={700} okText="Simpan">
        <Form form={form} layout="vertical" onFinish={handleFinish} autoComplete="off">
          <Form.Item label="ID Petugas" name="petugasId">
            <Input disabled />
          </Form.Item>
          <Form.Item label="NIK Petugas" name="nikPetugas" rules={[{ required: true, message: "Masukkan NIK Petugas!" }]}>
            <Input placeholder="Masukkan NIK Petugas" />
          </Form.Item>
          <Form.Item label="Nama Petugas" name="namaPetugas" rules={[{ required: true, message: "Masukkan Nama Petugas!" }]}>
            <Input placeholder="Masukkan Nama Petugas" />
          </Form.Item>
          <Form.Item label="No. Telepon Petugas" name="noTelp" rules={[{ required: true, message: "Masukkan No Telepon Petugas!" }]}>
            <Input placeholder="Masukkan No Telepon Petugas" />
          </Form.Item>
          <Form.Item label="Email Petugas" name="email" rules={[{ required: true, message: "Masukkan Email Petugas!" }]}>
            <Input placeholder="Masukkan Email Petugas" />
          </Form.Item>
          <Form.Item label="Provinsi" name="provinsi">
            <Select placeholder="Pilih Provinsi" onChange={handleProvinceChange} value={form.getFieldValue("provinsi")}>
              {provinces.map((province) => (
                <Option key={province.id} value={province.name}>
                  {province.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Kabupaten" name="kabupaten">
            <Select placeholder="Pilih Kabupaten" onChange={handleRegencyChange} value={form.getFieldValue("kabupaten")}>
              {regencies.map((regency) => (
                <Option key={regency.id} value={regency.name}>
                  {regency.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Kecamatan" name="kecamatan">
            <Select placeholder="Pilih Kecamatan" onChange={handleDistrictChange} value={form.getFieldValue("kecamatan")}>
              {districts.map((district) => (
                <Option key={district.id} value={district.name}>
                  {district.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Wilayah" name="wilayah" rules={[{ required: true, message: "Wilayah akan otomatis terisi" }]}>
            <Input placeholder="Wilayah akan otomatis terisi" readOnly />
          </Form.Item>
          <Form.Item label="Pekerjaan" name="job" rules={[{ required: true, message: "Pilih Pekerjaan!" }]}>
            <Select placeholder="Pilih Pekerjaan">
              <Option value="pendataan">Pendataan</Option>
              <Option value="vaksinasi">Vaksinasi</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
);

export default EditPetugasForm;
