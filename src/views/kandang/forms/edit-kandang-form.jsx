/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { Form, Input, Modal, Upload, Select } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { getPeternaks } from '@/api/peternak'

const { Option } = Select

const EditKandangForm = ({
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
  const [villages, setVillages] = useState([])
  const [peternakList, setPeternakList] = useState([])

  useEffect(() => {
    // Fetch provinces
    fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json')
      .then((response) => response.json())
      .then(setProvinces)
      .catch((error) => console.error('Error fetching provinces:', error))

    // Fetch peternak list
    const fetchPeternakList = async () => {
      try {
        const result = await getPeternaks()
        const { content, statusCode } = result.data
        if (statusCode === 200) {
          const peternak = content.map((item) => ({
            idPeternak: item.idPeternak,
            namaPeternak: item.namaPeternak,
          }))
          setPeternakList(peternak)
        }
      } catch (error) {
        console.error('Error fetching peternak data:', error)
      }
    }

    fetchPeternakList()
  }, [])

  useEffect(() => {
    // Populate the form when `currentRowData` changes
    if (currentRowData) {
      form.setFieldsValue({
        ...currentRowData,
        peternak_id: currentRowData?.peternak?.idPeternak,
      })
    }
  }, [currentRowData, form])

  const handleProvinceChange = async (value) => {
    const province = provinces.find((item) => item.name === value)
    if (province) {
      const response = await fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${province.id}.json`
      )
      const regenciesData = await response.json()
      setRegencies(regenciesData)
      setDistricts([])
      setVillages([])
      form.resetFields(['kabupaten', 'kecamatan', 'desa'])
    }
  }

  const handleRegencyChange = async (value) => {
    const regency = regencies.find((item) => item.name === value)
    if (regency) {
      const response = await fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${regency.id}.json`
      )
      const districtsData = await response.json()
      setDistricts(districtsData)
      setVillages([])
      form.resetFields(['kecamatan', 'desa'])
    }
  }

  const handleDistrictChange = async (value) => {
    const district = districts.find((item) => item.name === value)
    if (district) {
      const response = await fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/villages/${district.id}.json`
      )
      const villagesData = await response.json()
      setVillages(villagesData)
      form.resetFields(['desa'])
    }
  }

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onOk(values)
        form.resetFields()
      })
      .catch((error) => console.error('Validation failed:', error))
  }

  return (
    <Modal
      title="Edit Data Ternak"
      visible={visible}
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      onOk={handleSubmit}
      confirmLoading={confirmLoading}
      width={700}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="ID Kandang" name="idKandang">
          <Input />
        </Form.Item>
        <Form.Item
          label="Nama Peternak"
          name="peternak_id"
          rules={[{ required: true, message: 'Pilih Nama Peternak!' }]}
        >
          <Select placeholder="Pilih Nama Peternak">
            {peternakList.map((item) => (
              <Option key={item.idPeternak} value={item.idPeternak}>
                {item.namaPeternak}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Luas Kandang" name="luas">
          <Input placeholder="Masukkan Luas Kandang" />
        </Form.Item>
        <Form.Item
          label="Jenis Hewan"
          name="jenis_id"
          rules={[{ required: true, message: 'Masukkan Jenis Hewan!' }]}
        >
          <Input placeholder="Masukkan Jenis Hewan" />
        </Form.Item>
        <Form.Item label="Kapasitas Kandang" name="kapasitas">
          <Input placeholder="Masukkan Kapasitas Kandang" />
        </Form.Item>
        <Form.Item label="Nilai Bangunan" name="nilaiBangunan">
          <Input placeholder="Masukkan Nilai Bangunan" />
        </Form.Item>
        <Form.Item label="Alamat" name="alamat">
          <Input placeholder="Masukkan Alamat" />
        </Form.Item>
        <Form.Item label="Provinsi" name="provinsi">
          <Select placeholder="Pilih Provinsi" onChange={handleProvinceChange}>
            {provinces.map((item) => (
              <Option key={item.id} value={item.name}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Kabupaten" name="kabupaten">
          <Select placeholder="Pilih Kabupaten" onChange={handleRegencyChange}>
            {regencies.map((item) => (
              <Option key={item.id} value={item.name}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Kecamatan" name="kecamatan">
          <Select placeholder="Pilih Kecamatan" onChange={handleDistrictChange}>
            {districts.map((item) => (
              <Option key={item.id} value={item.name}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Desa" name="desa">
          <Select placeholder="Pilih Desa">
            {villages.map((item) => (
              <Option key={item.id} value={item.name}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Foto Kandang" name="file">
          <Upload.Dragger beforeUpload={() => false} listType="picture">
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Klik atau seret file untuk mengunggah
            </p>
            <p className="ant-upload-hint">
              Mendukung unggahan tunggal atau beberapa file.
            </p>
          </Upload.Dragger>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditKandangForm
