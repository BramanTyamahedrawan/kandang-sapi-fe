/* eslint-disable no-constant-condition */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react'
import {
  Card,
  Button,
  Table,
  message,
  Upload,
  Row,
  Col,
  Divider,
  Modal,
  Input,
} from 'antd'
import {
  getKandang,
  getKandangByPeternak,
  deleteKandang,
  editKandang,
  addKandang,
} from '@/api/kandang'
import TypingCard from '@/components/TypingCard'
import EditKandangForm from './forms/edit-kandang-form'
import AddKandangForm from './forms/add-kandang-form'
// import ViewKandangForm from "./forms/view-kandang-form";
import { read, utils } from 'xlsx'
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons'
import { reqUserInfo } from '../../api/user'
import imgUrl from '../../utils/imageURL'

import kandangSapi from '../../assets/images/kandangsapi.jpg'

const Kandang = () => {
  const [kandangs, setKandangs] = useState([])
  const [editKandangModalVisible, setEditKandangModalVisible] = useState(false)
  const [editKandangModalLoading, setEditKandangModalLoading] = useState(false)
  // const [viewKandangModalVisible, setViewKandangModalVisible] = useState(false)
  const [currentRowData, setCurrentRowData] = useState({})
  const [addKandangModalVisible, setAddKandangModalVisible] = useState(false)
  const [addKandangModalLoading, setAddKandangModalLoading] = useState(false)
  const [importedData, setImportedData] = useState([])
  const [columnTitles, setColumnTitles] = useState([])
  const [fileName, setFileName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [importModalVisible, setImportModalVisible] = useState(false)
  const [columnMapping, setColumnMapping] = useState({})
  const [searchKeyword, setSearchKeyword] = useState('')
  const [user, setUser] = useState(null)

  const editKandangFormRef = useRef(null)
  const addKandangFormRef = useRef(null)

  useEffect(() => {
    reqUserInfo()
      .then((response) => {
        const userData = response.data
        setUser(userData)
        if (userData.role === 'ROLE_PETERNAK') {
          getKandangByPeternak(userData.username)
        } else {
          getKandangData()
        }
      })
      .catch((error) => {
        console.error('Terjadi kesalahan saat mengambil data user:', error)
        message.error('Gagal mengambil data user.')
      })
  }, [])

  const getKandangByPeternak = async (peternakID) => {
    try {
      const result = await getKandangByPeternak(peternakID)
      const { content, statusCode } = result.data
      if (statusCode === 200) {
        setKandangs(content)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
      message.error('Gagal mengambil data kandang.')
    }
  }

  const getKandangData = async () => {
    try {
      const result = await getKandang()
      console.log(result)
      const { content, statusCode } = result.data

      if (statusCode === 200) {
        const filteredKandang = content.filter((kandang) => {
          const {
            idKandang,
            idPeternak,
            namaPeternak,
            luas,
            jenisHewan,
            kapasitas,
            nilaiBangunan,
            alamat,
            provinsi,
            kabupaten,
            kecamatan,
            desa,
          } = kandang
          const keyword = searchKeyword.toLowerCase()

          const isIdKandangValid = typeof idKandang === 'string'
          const isIdPeternakValid = typeof idPeternak === 'string'
          const isNamaPeternakValid = typeof namaPeternak === 'string'
          const isLuasValid = typeof luas === 'string'
          const isJenisHewanValid = typeof jenisHewan === 'string'
          const isKapasitasValid = typeof kapasitas === 'string'
          const isNilaiBangunanValid = typeof nilaiBangunan === 'string'
          const isAlamatValid = typeof alamat === 'string'
          const isProvinsiValid = typeof provinsi === 'string'
          const isKabupatenValid = typeof kabupaten === 'string'
          const isKecamatanValid = typeof kecamatan === 'string'
          const isDesaValid = typeof desa === 'string'

          return (
            (isIdKandangValid && idKandang.toLowerCase().includes(keyword)) ||
            (isIdPeternakValid && idPeternak.toLowerCase().includes(keyword)) ||
            (isNamaPeternakValid &&
              namaPeternak.toLowerCase().includes(keyword)) ||
            (isLuasValid && luas.toLowerCase().includes(keyword)) ||
            (isJenisHewanValid && jenisHewan.toLowerCase().includes(keyword)) ||
            (isKapasitasValid && kapasitas.toLowerCase().includes(keyword)) ||
            (isNilaiBangunanValid &&
              nilaiBangunan.toLowerCase().includes(keyword)) ||
            (isAlamatValid && alamat.toLowerCase().includes(keyword)) ||
            (isProvinsiValid && provinsi.toLowerCase().includes(keyword)) ||
            (isKabupatenValid && kabupaten.toLowerCase().includes(keyword)) ||
            (isKecamatanValid && kecamatan.toLowerCase().includes(keyword)) ||
            (isDesaValid && desa.toLowerCase().includes(keyword))
          )
        })

        setKandangs(filteredKandang)
      }
    } catch (error) {
      console.error('Gagal mengambil data kandang:', error)
      message.error('Gagal mengambil data kandang.')
    }
  }

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword)
    // Debounce atau delay jika diperlukan
    getKandangData()
  }

  const handleEditKandang = (row) => {
    setCurrentRowData({ ...row })
    setEditKandangModalVisible(true)
  }

  const handleDeleteKandang = (row) => {
    const { idKandang } = row
    Modal.confirm({
      title: 'Konfirmasi',
      content: 'Apakah Anda yakin ingin menghapus data ini?',
      okText: 'Ya',
      okType: 'danger',
      cancelText: 'Tidak',
      onOk: () => {
        deleteKandang(idKandang)
          .then(() => {
            message.success('Berhasil dihapus')
            getKandangData()
          })
          .catch((error) => {
            console.error('Gagal menghapus kandang:', error)
            message.error('Gagal menghapus kandang.')
          })
      },
    })
  }

  const handleEditKandangOk = () => {
    const form = editKandangFormRef.current
    if (form) {
      form
        .validateFields()
        .then((values) => {
          setEditKandangModalLoading(true)
          editKandang(values, values.idKandang)
            .then(() => {
              form.resetFields()
              setEditKandangModalVisible(false)
              setEditKandangModalLoading(false)
              message.success('Berhasil diedit!')
              getKandangData()
            })
            .catch((e) => {
              setEditKandangModalLoading(false)
              message.error('Pengeditan gagal, harap coba lagi!')
            })
        })
        .catch((err) => {
          console.error('Validasi form gagal:', err)
        })
    }
  }

  // const handleViewKandang = (row) => {
  //   setCurrentRowData({ ...row })
  //   setViewKandangModalVisible(true)
  // }

  // Fungsi Import File CSV
  const handleImportModalOpen = () => {
    setImportModalVisible(true)
  }

  const handleImportModalClose = () => {
    setImportModalVisible(false)
  }

  const handleFileImport = (file) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result)
      const workbook = read(data, { type: 'array' })

      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = utils.sheet_to_json(worksheet, { header: 1 })

      const importedDataLocal = jsonData.slice(1) // Exclude the first row (column titles)
      const columnTitlesLocal = jsonData[0] // Assume the first row contains column titles

      const fileNameLocal = file.name.toLowerCase()

      setImportedData(importedDataLocal)
      setColumnTitles(columnTitlesLocal)
      setFileName(fileNameLocal)

      // Create column mapping
      const columnMappingLocal = {}
      columnTitlesLocal.forEach((title, index) => {
        columnMappingLocal[title] = index
      })
      setColumnMapping(columnMappingLocal)
    }

    reader.readAsArrayBuffer(file)
    return false // Prevent automatic upload
  }

  const handleUpload = () => {
    const { importedData, columnMapping } = { importedData, columnMapping }

    if (importedData.length === 0) {
      message.error('No data to import.')
      return
    }

    setUploading(true)

    saveImportedData(columnMapping)
      .then(() => {
        setUploading(false)
        setImportModalVisible(false)
      })
      .catch((error) => {
        console.error('Gagal mengunggah data:', error)
        setUploading(false)
        message.error('Gagal mengunggah data, harap coba lagi.')
      })
  }

  const fetchCoordinates = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          address
        )}&format=json`
      )
      const data = await response.json()
      if (data && data.length > 0) {
        return { lat: data[0].lat, lon: data[0].lon }
      } else {
        console.error('No coordinates found for the provided address:', address)
        return { lat: null, lon: null }
      }
    } catch (error) {
      console.error('Error converting address to coordinates:', error)
      return { lat: null, lon: null }
    }
  }

  const saveImportedData = async (columnMappingLocal) => {
    let errorCount = 0

    try {
      for (const row of importedData) {
        const address = `${row[columnMappingLocal['Desa']]}, ${
          row[columnMappingLocal['Kecamatan']]
        }, ${row[columnMappingLocal['Kabupaten']]}, ${
          row[columnMappingLocal['Provinsi']]
        }`
        const { lat, lon } = await fetchCoordinates(address)

        const dataToSave = {
          idKandang: row[columnMappingLocal['Id Kandang']],
          peternak_id: row[columnMappingLocal['Id Peternak']],
          luas: row[columnMappingLocal['Luas']],
          jenis_id: row[columnMappingLocal['Jenis Hewan']],
          kapasitas: row[columnMappingLocal['Kapasitas']],
          nilaiBangunan: row[columnMappingLocal['Nilai Bangunan']],
          alamat: row[columnMappingLocal['Alamat']],
          latitude: lat || row[columnMappingLocal['Latitude']],
          longitude: lon || row[columnMappingLocal['Longitude']],
          file: kandangSapi,
        }

        const existingKandangIndex = kandangs.findIndex(
          (p) => p.idKandang === dataToSave.idKandang
        )
        try {
          if (existingKandangIndex > -1) {
            // Update existing data
            await editKandang(dataToSave, dataToSave.idKandang)
            setKandangs((prevKandangs) => {
              const updatedKandangs = [...prevKandangs]
              updatedKandangs[existingKandangIndex] = dataToSave
              return updatedKandangs
            })
          } else {
            // Add new data
            await addKandang(dataToSave)
            setKandangs((prevKandangs) => [...prevKandangs, dataToSave])
          }
        } catch (error) {
          errorCount++
          console.error('Gagal menyimpan data:', error)
        }

        // Delay to avoid hitting rate limits
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      if (errorCount === 0) {
        message.success(`Semua data berhasil disimpan.`)
      } else {
        message.error(`${errorCount} data gagal disimpan, harap coba lagi!`)
      }
    } catch (error) {
      console.error('Gagal memproses data:', error)
      message.error('Gagal memproses data, harap coba lagi.')
    } finally {
      setImportedData([])
      setColumnTitles([])
      setColumnMapping({})
    }
  }

  // Fungsi Export dari database ke file CSV
  const handleExportData = () => {
    const csvContent = convertToCSV(kandangs)
    downloadCSV(csvContent)
  }

  const convertToCSV = (data) => {
    const columnTitlesLocal = [
      'Id Kandang',
      'Luas',
      'Kapasitas',
      'Nilai Bangunan',
      'Alamat',
    ]

    const rows = [columnTitlesLocal]
    data.forEach((item) => {
      const row = [
        item.idKandang,
        item.luas,
        item.kapasitas,
        item.nilaiBangunan,
        item.alamat,
      ]
      rows.push(row)
    })

    let csvContent = 'data:text/csv;charset=utf-8,'

    rows.forEach((rowArray) => {
      const row = rowArray.join(';')
      csvContent += row + '\r\n'
    })

    return csvContent
  }

  const downloadCSV = (csvContent) => {
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'Kandang.csv')
    document.body.appendChild(link) // Required for Firefox
    link.click()
    document.body.removeChild(link)
  }

  const handleCancel = () => {
    setEditKandangModalVisible(false)
    setAddKandangModalVisible(false)
    // setViewKandangModalVisible(false)
  }

  const handleAddKandang = () => {
    setAddKandangModalVisible(true)
  }

  const handleAddKandangOk = (values, form) => {
    setAddKandangModalLoading(true)
    const kandangData = {
      idKandang: values.idKandang,
      peternak_id: values.peternak_id,
      luas: values.luas + ' m2',
      jenis_id: values.jenis_id,
      kapasitas: values.kapasitas + ' ekor',
      nilaiBangunan: 'Rp. ' + values.nilaiBangunan,
      alamat: values.alamat,
      latitude: values.latitude,
      longitude: values.longitude,
      namaKandang: values.namaKandang,
      jenisKandang: values.jenisKandang,
      file: values.file,
    }

    addKandang(kandangData)
      .then(() => {
        form.resetFields()
        setAddKandangModalVisible(false)
        setAddKandangModalLoading(false)
        message.success('Berhasil menambahkan!')
        getKandangData()
      })
      .catch((e) => {
        setAddKandangModalVisible(false)
        setAddKandangModalLoading(false)
        message.error('Gagal menambahkan, harap coba lagi!')
      })
  }

  const renderColumns = () => {
    const baseColumns = [
      { title: 'Id Kandang', dataIndex: 'idKandang', key: 'idKandang' },
      { title: 'Luas', dataIndex: 'luas', key: 'luas' },
      { title: 'Jenis Hewan', dataIndex: ['jenis', 'nama'], key: 'jenis.nama' },
      { title: 'Kapasitas', dataIndex: 'kapasitas', key: 'kapasitas' },
      {
        title: 'Nilai Bangunan',
        dataIndex: 'nilaiBangunan',
        key: 'nilaiBangunan',
      },
      { title: 'Alamat', dataIndex: 'alamat', key: 'alamat' },
      {
        title: 'Foto Kandang',
        dataIndex: 'file_path',
        key: 'file_path',
        render: (text, row) => (
          <img
            src={`${imgUrl + '/kandang/' + row.file_path}`}
            alt="Foto Kandang"
            width={200}
            height={150}
          />
        ),
      },
    ]

    if (
      user &&
      (user.role === 'ROLE_ADMINISTRATOR' || user.role === 'ROLE_PETUGAS')
    ) {
      baseColumns.push({
        title: 'Operasi',
        key: 'action',
        width: 170,
        align: 'center',
        render: (text, row) => (
          <span>
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              title="Edit"
              onClick={() => handleEditKandang(row)}
            />
            <Divider type="vertical" />
            <Button
              danger
              type="primary"
              shape="circle"
              icon={<DeleteOutlined />}
              title="Delete"
              onClick={() => handleDeleteKandang(row)}
            />
            {/* Tambahkan tombol view jika diperlukan */}
            {/* <Divider type="vertical" />
            <Button
              type="primary"
              shape="circle"
              icon={<EyeOutlined />}
              title="View"
              onClick={() => handleViewKandang(row)}
            /> */}
          </span>
        ),
      })
    }

    return baseColumns
  }

  const renderTable = () => {
    if (user && user.role === 'ROLE_PETERNAK') {
      return (
        <Table
          dataSource={kandangs}
          bordered
          columns={renderColumns()}
          rowKey="idKandang"
        />
      )
    } else if (
      user &&
      (user.role === 'ROLE_ADMINISTRATOR' || user.role === 'ROLE_PETUGAS')
    ) {
      return (
        <Table
          dataSource={kandangs}
          bordered
          columns={renderColumns()}
          rowKey="idKandang"
        />
      )
    } else {
      return null
    }
  }

  const renderButtons = () => {
    if (
      user &&
      (user.role === 'ROLE_ADMINISTRATOR' || user.role === 'ROLE_PETUGAS')
    ) {
      return (
        <Row gutter={[16, 16]} justify="start" style={{ paddingLeft: 9 }}>
          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <Button type="primary" onClick={handleAddKandang} block>
              Tambah Kandang
            </Button>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <Button
              icon={<UploadOutlined />}
              onClick={handleImportModalOpen}
              block
            >
              Import File
            </Button>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <Button icon={<UploadOutlined />} onClick={handleExportData} block>
              Export File
            </Button>
          </Col>
        </Row>
      )
    } else {
      return null
    }
  }

  const title = (
    <Row gutter={[16, 16]} justify="space-between">
      {renderButtons()}
      <Col xs={24} sm={12} md={8} lg={8} xl={8}>
        <Input
          placeholder="Cari data"
          value={searchKeyword}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: '100%' }}
        />
      </Col>
    </Row>
  )

  const cardContent = `Di sini, Anda dapat mengelola daftar kandang di sistem.`

  return (
    <div className="app-container">
      <TypingCard title="Manajemen Data Kandang" source={cardContent} />
      <br />
      <Card title={title} style={{ overflowX: 'scroll' }}>
        {renderTable()}
      </Card>
      <EditKandangForm
        currentRowData={currentRowData}
        wrappedComponentRef={editKandangFormRef}
        visible={editKandangModalVisible}
        confirmLoading={editKandangModalLoading}
        onCancel={handleCancel}
        onOk={handleEditKandangOk}
      />

      <AddKandangForm
        wrappedComponentRef={addKandangFormRef}
        visible={addKandangModalVisible}
        confirmLoading={addKandangModalLoading}
        onCancel={handleCancel}
        onOk={handleAddKandangOk}
      />

      {/* <ViewKandangForm
        currentRowData={currentRowData}
        visible={viewKandangModalVisible}
        onCancel={() => setViewKandangModalVisible(false)}
      /> */}

      <Modal
        title="Import File"
        visible={importModalVisible}
        onCancel={handleImportModalClose}
        footer={[
          <Button key="cancel" onClick={handleImportModalClose}>
            Cancel
          </Button>,
          <Button
            key="upload"
            type="primary"
            loading={uploading}
            onClick={handleUpload}
          >
            Upload
          </Button>,
        ]}
      >
        <Upload beforeUpload={handleFileImport} showUploadList={false}>
          <Button icon={<UploadOutlined />}>Pilih File</Button>
        </Upload>
      </Modal>
    </div>
  )
}

export default Kandang
