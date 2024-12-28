/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { Form, Input, Modal, Select } from 'antd'

const { Option } = Select

const EditPetugasForm = ({
  visible,
  onCancel,
  onOk,
  confirmLoading,
  currentRowData,
}) => {
  const [form] = Form.useForm()
  const [provinces, setProvinces] = useState([])
  const [regencies, setRegencies] = useState([])
  const [districts, setDistricts] = useState([])

  useEffect(() => {
    fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json')
      .then((response) => response.json())
      .then((data) => setProvinces(data))

    if (currentRowData) {
      form.setFieldsValue(currentRowData)
    }
  }, [currentRowData, form])

  const handleProvinceChange = (value) => {
    const selectedProvince = provinces.find(
      (province) => province.name === value
    )
    if (selectedProvince) {
      fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvince.id}.json`
      )
        .then((response) => response.json())
        .then((data) => setRegencies(data))
      form.setFieldsValue({ kabupaten: undefined, kecamatan: undefined })
    }
  }

  const handleRegencyChange = (value) => {
    const selectedRegency = regencies.find((regency) => regency.name === value)
    if (selectedRegency) {
      fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selectedRegency.id}.json`
      )
        .then((response) => response.json())
        .then((data) => setDistricts(data))
      form.setFieldsValue({ kecamatan: undefined })
    }
  }

  const handleFinish = (values) => {
    onOk(values)
  }

  return (
    <Modal
      title="Edit Data Petugas"
      visible={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={confirmLoading}
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        autoComplete="off"
      >
        <Form.Item
          label="NIK Petugas"
          name="nikPetugas"
          rules={[{ required: true, message: 'Masukkan NIK Petugas!' }]}
        >
          <Input placeholder="Masukkan NIK Petugas" />
        </Form.Item>
        <Form.Item
          label="Nama Petugas"
          name="namaPetugas"
          rules={[{ required: true, message: 'Masukkan Nama Petugas!' }]}
        >
          <Input placeholder="Masukkan Nama Petugas" />
        </Form.Item>
        <Form.Item
          label="No. Telepon Petugas"
          name="noTelp"
          rules={[{ required: true, message: 'Masukkan No Telepon Petugas!' }]}
        >
          <Input placeholder="Masukkan No Telepon Petugas" />
        </Form.Item>
        <Form.Item
          label="Email Petugas"
          name="email"
          rules={[{ required: true, message: 'Masukkan Email Petugas!' }]}
        >
          <Input placeholder="Masukkan Email Petugas" />
        </Form.Item>
        <Form.Item
          label="Provinsi"
          name="provinsi"
          rules={[{ required: true, message: 'Pilih Provinsi!' }]}
        >
          <Select placeholder="Pilih Provinsi" onChange={handleProvinceChange}>
            {provinces.map((province) => (
              <Option key={province.id} value={province.name}>
                {province.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Kabupaten"
          name="kabupaten"
          rules={[{ required: true, message: 'Pilih Kabupaten!' }]}
        >
          <Select placeholder="Pilih Kabupaten" onChange={handleRegencyChange}>
            {regencies.map((regency) => (
              <Option key={regency.id} value={regency.name}>
                {regency.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Kecamatan"
          name="kecamatan"
          rules={[{ required: true, message: 'Pilih Kecamatan!' }]}
        >
          <Select placeholder="Pilih Kecamatan">
            {districts.map((district) => (
              <Option key={district.id} value={district.name}>
                {district.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Wilayah"
          name="wilayah"
          rules={[{ required: true, message: 'Wilayah akan otomatis terisi' }]}
        >
          <Input placeholder="Wilayah akan otomatis terisi" />
        </Form.Item>
        <Form.Item
          label="Pekerjaan"
          name="job"
          rules={[{ required: true, message: 'Pilih Pekerjaan!' }]}
        >
          <Select placeholder="Pilih Pekerjaan">
            <Option value="pendataan">Pendataan</Option>
            <Option value="vaksinasi">Vaksinasi</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditPetugasForm
