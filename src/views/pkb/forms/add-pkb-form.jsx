/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { Form, Input, Modal, Select } from 'antd'
import { getPetugas } from '@/api/petugas'
import { getPeternaks } from '@/api/peternak'
import { getHewans } from '../../../api/hewan'

const { Option } = Select

const AddPKBForm = ({ visible, onCancel, onOk, confirmLoading }) => {
  const [form] = Form.useForm()
  const [hewanList, setHewanList] = useState([])
  const [petugasList, setPetugasList] = useState([])
  const [peternakList, setPeternakList] = useState([])

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
        const list = content.map(({ nikPetugas, namaPetugas }) => ({
          nikPetugas,
          namaPetugas,
        }))
        setPetugasList(list)
      }
    } catch (error) {
      console.error('Error fetching petugas data:', error)
    }
  }

  const fetchPeternakList = async () => {
    try {
      const result = await getPeternaks()
      const { content, statusCode } = result.data
      if (statusCode === 200) {
        const list = content.map(({ idPeternak, namaPeternak }) => ({
          idPeternak,
          namaPeternak,
        }))
        setPeternakList(list)
      }
    } catch (error) {
      console.error('Error fetching peternak data:', error)
    }
  }

  const fetchHewanList = async () => {
    try {
      const result = await getHewans()
      const { content, statusCode } = result.data
      if (statusCode === 200) {
        setHewanList(
          content.map(({ kodeEartagNasional }) => kodeEartagNasional)
        )
      }
    } catch (error) {
      console.error('Error fetching hewan data:', error)
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
      title="Tambah PKB"
      visible={visible}
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      onOk={handleSubmit}
      confirmLoading={confirmLoading}
      width={820}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="idKejadian"
          label="ID Kejadian"
          rules={[{ required: true, message: 'Masukkan ID kejadian!' }]}
        >
          <Input placeholder="Masukkan ID kejadian" />
        </Form.Item>
        <Form.Item
          name="tanggalPkb"
          label="Tanggal PKB"
          rules={[{ required: true, message: 'Masukkan tanggal PKB!' }]}
        >
          <Input type="date" placeholder="Masukkan tanggal" />
        </Form.Item>
        <Form.Item
          name="peternak_id"
          label="Nama Peternak"
          rules={[{ required: true, message: 'Silahkan isi nama peternak!' }]}
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
          name="hewan_id"
          label="ID Hewan"
          rules={[{ required: true, message: 'Silahkan isi ID Hewan!' }]}
        >
          <Select placeholder="Pilih ID Hewan">
            {hewanList.map((eartag) => (
              <Option key={eartag} value={eartag}>
                {eartag}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="spesies" label="Spesies" initialValue="Sapi Limosin">
          <Select>
            <Option value="Sapi Limosin">Sapi Limosin</Option>
            <Option value="Sapi Simental">Sapi Simental</Option>
            <Option value="Sapi FH">Sapi FH</Option>
            <Option value="Sapi PO">Sapi PO</Option>
            <Option value="Sapi Brangus">Sapi Brangus</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="umurKebuntingan"
          label="Umur Kebuntingan Saat PKB"
          rules={[{ required: true, message: 'Masukkan umur kebuntingan!' }]}
        >
          <Input placeholder="Masukkan umur kebuntingan" />
        </Form.Item>
        <Form.Item
          name="petugas_id"
          label="Pemeriksa Kebuntingan"
          rules={[
            { required: true, message: 'Pilih petugas pemeriksa kebuntingan!' },
          ]}
        >
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
  )
}

export default AddPKBForm
