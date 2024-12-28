/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { Modal, Form, Input, Select } from 'antd'
import { getPetugas } from '@/api/petugas'
import { getPeternaks } from '@/api/peternak'
import { getHewans } from '../../../api/hewan'

const { Option } = Select

const AddVaksinForm = ({ visible, onCancel, onOk, confirmLoading }) => {
  const [form] = Form.useForm()
  const [petugasList, setPetugasList] = useState([])
  const [peternakList, setPeternakList] = useState([])
  const [hewanList, setHewanList] = useState([])

  useEffect(() => {
    fetchPetugasList()
    fetchPeternakList()
    fetchHewanList()
  }, [])

  const fetchPetugasList = async () => {
    try {
      const result = await getPetugas()
      const { content, statusCode } = result.data
      if (statusCode === 200) {
        setPetugasList(
          content.map(({ nikPetugas, namaPetugas }) => ({
            nikPetugas,
            namaPetugas,
          }))
        )
      }
    } catch (error) {
      console.error('Error fetching petugas data:', error)
    }
  }

  const fetchHewanList = async () => {
    try {
      const result = await getHewans()
      const { content, statusCode } = result.data
      if (statusCode === 200) {
        setHewanList(content.map((hewan) => hewan.kodeEartagNasional))
      }
    } catch (error) {
      console.error('Error fetching hewan data:', error)
    }
  }

  const fetchPeternakList = async () => {
    try {
      const result = await getPeternaks()
      const { content, statusCode } = result.data
      if (statusCode === 200) {
        setPeternakList(
          content.map(({ idPeternak, namaPeternak }) => ({
            idPeternak,
            namaPeternak,
          }))
        )
      }
    } catch (error) {
      console.error('Error fetching peternak data:', error)
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      onOk(values)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  return (
    <Modal
      title="Tambah Data Vaksin"
      visible={visible}
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      onOk={handleSubmit}
      confirmLoading={confirmLoading}
    >
      <Form form={form} layout="vertical" name="add_vaksin_form">
        <Form.Item
          label="Nama Vaksin"
          name="namaVaksin"
          rules={[{ required: true, message: 'Silahkan isi nama vaksin!' }]}
        >
          <Input placeholder="Masukkan Nama Vaksin" />
        </Form.Item>
        <Form.Item
          label="Jenis Vaksin"
          name="jenisVaksin"
          rules={[{ required: true, message: 'Silahkan isi jenis vaksin!' }]}
        >
          <Input placeholder="Masukkan Jenis Vaksin" />
        </Form.Item>
        <Form.Item
          label="Nama Peternak"
          name="peternak_id"
          rules={[{ required: true, message: 'Silahkan pilih nama peternak!' }]}
        >
          <Select placeholder="Pilih Nama Peternak">
            {peternakList.map(({ idPeternak, namaPeternak }) => (
              <Option key={idPeternak} value={idPeternak}>
                {namaPeternak}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Eartag Hewan"
          name="hewan_id"
          rules={[{ required: true, message: 'Silahkan pilih eartag hewan!' }]}
        >
          <Select placeholder="Pilih Eartag">
            {hewanList.map((eartag) => (
              <Option key={eartag} value={eartag}>
                {eartag}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Inseminator"
          name="petugas_id"
          rules={[{ required: true, message: 'Silahkan pilih inseminator!' }]}
        >
          <Select placeholder="Pilih Inseminator">
            {petugasList.map(({ nikPetugas, namaPetugas }) => (
              <Option key={nikPetugas} value={nikPetugas}>
                {namaPetugas}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Tanggal Vaksin"
          name="tglVaksin"
          rules={[{ required: true, message: 'Silahkan isi tanggal vaksin!' }]}
        >
          <Input type="date" placeholder="Masukkan Tanggal Vaksin" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddVaksinForm
