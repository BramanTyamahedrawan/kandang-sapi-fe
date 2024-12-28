/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { Modal, Form, Input, Select, Upload, Row, Col } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { getPetugas } from '@/api/petugas'
import { getPeternaks } from '@/api/peternak'
import { getKandang } from '@/api/kandang'
import { getJenisHewan } from '../../../api/jenishewan'
import { getRumpunHewan } from '../../../api/rumpunhewan'

const { Option } = Select

const AddHewanForm = ({ visible, onCancel, onOk, confirmLoading }) => {
  const [form] = Form.useForm()
  const [provinces, setProvinces] = useState([])
  const [regencies, setRegencies] = useState([])
  const [districts, setDistricts] = useState([])
  const [villages, setVillages] = useState([])
  const [kandangList, setKandangList] = useState([])
  const [petugasList, setPetugasList] = useState([])
  const [peternakList, setPeternakList] = useState([])
  const [jenisHewanList, setJenisHewanList] = useState([])
  const [rumpunHewanList, setRumpunHewanList] = useState([])

  useEffect(() => {
    // Fetch provinces
    fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json')
      .then((response) => response.json())
      .then(setProvinces)
      .catch((error) => console.error('Error fetching provinces:', error))

    // Fetch petugas, peternak, and kandang data
    fetchPetugasList()
    fetchPeternakList()
    fetchKandangList()
    fetchJenisHewanList()
    fetchRumpunHewanList()
  }, [])

  const fetchJenisHewanList = async () => {
    try {
      const result = await getJenisHewan()
      const { content, statusCode } = result.data
      if (statusCode === 200) {
        const jenisHewan = content.map(({ idJenisHewan, jenis }) => ({
          idJenisHewan,
          jenis,
        }))
        setJenisHewanList(jenisHewan)
      }
    } catch (error) {
      console.error('Error fetching jenis hewan data:', error)
    }
  }

  const fetchRumpunHewanList = async () => {
    try {
      const result = await getRumpunHewan()
      const { content, statusCode } = result.data
      if (statusCode === 200) {
        const rumpunHewan = content.map(({ idRumpunHewan, rumpun }) => ({
          idRumpunHewan,
          rumpun,
        }))
        setRumpunHewanList(rumpunHewan)
      }
    } catch (error) {
      console.error('Error fetching rumpun hewan data:', error)
    }
  }

  const fetchPetugasList = async () => {
    try {
      const result = await getPetugas()
      const { content, statusCode } = result.data
      if (statusCode === 200) {
        const petugas = content.map(({ nikPetugas, namaPetugas }) => ({
          nikPetugas,
          namaPetugas,
        }))
        setPetugasList(petugas)
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
        const peternak = content.map(({ idPeternak, namaPeternak }) => ({
          idPeternak,
          namaPeternak,
        }))
        setPeternakList(peternak)
      }
    } catch (error) {
      console.error('Error fetching peternak data:', error)
    }
  }

  const fetchKandangList = async () => {
    try {
      const result = await getKandang()
      const { content, statusCode } = result.data
      if (statusCode === 200) {
        setKandangList(content)
      }
    } catch (error) {
      console.error('Error fetching kandang data:', error)
    }
  }

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
        onOk(values, form)
        form.resetFields()
      })
      .catch((error) => console.error('Validation failed:', error))
  }

  return (
    <Modal
      title="Tambah Data Ternak"
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
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Kode Eartag Nasional"
              name="kodeEartagNasional"
              rules={[
                { required: true, message: 'Masukkan Kode Eartag Nasional!' },
              ]}
            >
              <Input placeholder="Masukkan kode" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="ID Isikhnas ternak"
              name="idIsikhnasTernak"
              rules={[
                { required: true, message: 'Masukkan ID Isikhnas ternak!' },
              ]}
            >
              <Input placeholder="Masukkan ID Isikhnas ternak" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Jenis Hewan:"
              name="jenisHewanId"
              rules={[
                {
                  required: true,
                  message: 'Silahkan pilih jenis hewan',
                },
              ]}
            >
              <Select placeholder="Pilih Jenis Hewan" allowClear>
                {jenisHewanList.map((jenisHewan) => (
                  <Select.Option
                    key={jenisHewan.idJenisHewan}
                    value={jenisHewan.idJenisHewan}
                  >
                    {jenisHewan.jenis}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Rumpun Hewan:"
              name="rumpunHewanId"
              rules={[
                {
                  required: true,
                  message: 'Silahkan pilih rumpun hewan',
                },
              ]}
            >
              <Select placeholder="Pilih Rumpun Hewan" allowClear>
                {rumpunHewanList.map((rumpunHewan) => (
                  <Select.Option
                    key={rumpunHewan.idRumpunHewan}
                    value={rumpunHewan.idRumpunHewan}
                  >
                    {rumpunHewan.rumpun}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Jenis Kelamin:"
              name="sex"
              rules={[
                {
                  required: true,
                  message: 'Silahkan pilih jenis kelamin hewan',
                },
              ]}
            >
              <Select placeholder="Pilih jenis kelamin" allowClear>
                <Select.Option key={1} value={'jantan'}>
                  Jantan
                </Select.Option>
                <Select.Option key={2} value={'betina'}>
                  Betina
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Tempat Lahir:"
              name="tempatLahir"
              rules={[
                {
                  required: true,
                  message: 'Silahkan masukkan tempat lahir',
                },
              ]}
            >
              <Input type="text" placeholder="Masukkan Tempat Lahir" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Tanggal Lahir:"
              name="tanggalLahir"
              rules={[
                {
                  required: true,
                  message: 'Silahkan pilih tanggal lahir',
                },
              ]}
            >
              <Input type="date" placeholder="Masukkan Tanggal Lahir" />
            </Form.Item>
          </Col>
          <Col span={12}>
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
          </Col>
          <Col span={12}>
            <Form.Item
              label="Kandang"
              name="kandang_id"
              rules={[{ required: true, message: 'Pilih ID Kandang!' }]}
            >
              <Select placeholder="Pilih ID Kandang">
                {kandangList.map((val) => (
                  <Option key={val.idKandang} value={val.idKandang}>
                    {val.peternak != null
                      ? `Kandang ${val.namaKandang} (${val.peternak.namaPeternak})`
                      : `Kandang ${val.namaKandang}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Petugas Pendaftar:"
              name="petugas_id"
              rules={[
                {
                  required: true,
                  message: 'Silahkan pilih petugas pendaftar',
                },
              ]}
            >
              <Select placeholder="Pilih Petugas Pendaftar" allowClear>
                {petugasList.map((petugas) => (
                  <Select.Option
                    key={petugas.nikPetugas}
                    value={petugas.nikPetugas}
                  >
                    {petugas.namaPetugas}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Tujuan Pemeliharaan:"
              name="tujuanPemeliharaan"
              rules={[
                {
                  required: true,
                  message: 'Silahkan masukkan tujuan pemeliharaan',
                },
              ]}
            >
              <Input type="text" placeholder="Masukkan tujuan pemeliharaan" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Identifikasi Hewan:"
              name="identifikasiHewan"
              rules={[
                {
                  required: true,
                  message: 'Silahkan masukkan identifikasi hewan',
                },
              ]}
            >
              <Input type="text" placeholder="Masukkan identifikasi hewan" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Foto Hewan"
              name="file"
              valuePropName="fileList"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            >
              <Upload.Dragger beforeUpload={() => false} listType="picture">
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
              </Upload.Dragger>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default AddHewanForm
