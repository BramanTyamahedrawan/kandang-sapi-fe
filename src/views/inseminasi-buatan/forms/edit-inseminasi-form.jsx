/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { Modal, Form, Input, Select } from 'antd'
import { getPetugas } from '@/api/petugas'
import { getPeternaks } from '@/api/peternak'
import { getHewans } from '../../../api/hewan'

const { Option } = Select

const EditInseminasiBuatanForm = ({
  visible,
  onCancel,
  onOk,
  confirmLoading,
  currentRowData,
}) => {
  const [form] = Form.useForm()
  const [petugasList, setPetugasList] = useState([])
  const [peternakList, setPeternakList] = useState([])
  const [hewanList, setHewanList] = useState([])

  const {
    idInseminasi,
    tanggalIB,
    peternak,
    hewan,
    ib,
    idPejantan,
    idPembuatan,
    bangsaPejantan,
    produsen,
    petugas,
  } = currentRowData || {}

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
      title="Edit Inseminasi Buatan"
      visible={visible}
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      onOk={handleSubmit}
      confirmLoading={confirmLoading}
    >
      <Form form={form} layout="vertical" initialValues={{}}>
        <Form.Item
          label="ID Inseminasi:"
          name="idInseminasi"
          initialValue={idInseminasi}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="Tanggal IB:"
          name="tanggalIB"
          initialValue={tanggalIB}
        >
          <Input type="date" placeholder="Masukkan Tanggal IB" />
        </Form.Item>
        <Form.Item
          label="Inseminator:"
          name="petugas_id"
          initialValue={petugas?.nikPetugas}
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
          label="Produsen:"
          name="produsen"
          initialValue={produsen || 'BBIB Singosari'}
        >
          <Select>
            <Option value="BBIB Singosari">BBIB Singosari</Option>
            <Option value="BIB Lembang">BIB Lembang</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Nama Peternak:"
          name="peternak_id"
          initialValue={peternak?.idPeternak}
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
          label="Eartag Hewan:"
          name="hewan_id"
          initialValue={hewan?.kodeEartagNasional}
        >
          <Select placeholder="Pilih Eartag">
            {hewanList.map((eartag) => (
              <Option key={eartag} value={eartag}>
                {eartag}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="IB:" name="ib" initialValue={ib}>
          <Select>
            <Option value="1">1</Option>
            <Option value="2">2</Option>
            <Option value="3">3</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="ID Pejantan:"
          name="idPejantan"
          initialValue={idPejantan}
        >
          <Input placeholder="Masukkan ID Pejantan" />
        </Form.Item>
        <Form.Item
          label="Bangsa Pejantan:"
          name="bangsaPejantan"
          initialValue={bangsaPejantan || 'Sapi Limosin'}
        >
          <Select>
            <Option value="Sapi Limosin">Sapi Limosin</Option>
            <Option value="Sapi Simental">Sapi Simental</Option>
            <Option value="Sapi FH">Sapi FH</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="ID Pembuatan:"
          name="idPembuatan"
          initialValue={idPembuatan}
        >
          <Input placeholder="Masukkan ID Pembuatan" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditInseminasiBuatanForm
