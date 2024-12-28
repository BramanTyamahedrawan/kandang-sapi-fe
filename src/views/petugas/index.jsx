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
  getPetugas,
  deletePetugas,
  editPetugas,
  addPetugas,
} from '@/api/petugas'
import TypingCard from '@/components/TypingCard'
import EditPetugasForm from './forms/edit-petugas-form'
import AddPetugasForm from './forms/add-petugas-form'
import { read, utils } from 'xlsx'
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons'
import { reqUserInfo } from '../../api/user'

const Petugas = () => {
  const [petugas, setPetugas] = useState([])
  const [editPetugasModalVisible, setEditPetugasModalVisible] = useState(false)
  const [editPetugasModalLoading, setEditPetugasModalLoading] = useState(false)
  const [currentRowData, setCurrentRowData] = useState({})
  const [addPetugasModalVisible, setAddPetugasModalVisible] = useState(false)
  const [addPetugasModalLoading, setAddPetugasModalLoading] = useState(false)
  const [importedData, setImportedData] = useState([])
  const [columnTitles, setColumnTitles] = useState([])
  const [fileName, setFileName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [importModalVisible, setImportModalVisible] = useState(false)
  const [columnMapping, setColumnMapping] = useState({})
  const [searchKeyword, setSearchKeyword] = useState('')
  const [user, setUser] = useState(null)

  const editPetugasFormRef = useRef(null)
  const addPetugasFormRef = useRef(null)

  useEffect(() => {
    getPetugasData()
    reqUserInfo()
      .then((response) => {
        setUser(response.data)
      })
      .catch((error) => {
        console.error('Terjadi kesalahan saat mengambil data user:', error)
      })
  }, [])

  const getPetugasData = async () => {
    try {
      const result = await getPetugas()
      console.log(result)
      const { content, statusCode } = result.data
      if (statusCode === 200) {
        const filteredPetugas = content.filter((petugasItem) => {
          const { nikPetugas, namaPetugas, email } = petugasItem
          const keyword = searchKeyword.toLowerCase()
          const isNikPetugasValid = typeof nikPetugas === 'string'
          const isNamaPetugasValid = typeof namaPetugas === 'string'
          const isEmailValid = typeof email === 'string'

          return (
            (isNikPetugasValid && nikPetugas.toLowerCase().includes(keyword)) ||
            (isNamaPetugasValid &&
              namaPetugas.toLowerCase().includes(keyword)) ||
            (isEmailValid && email.toLowerCase().includes(keyword))
          )
        })

        setPetugas(filteredPetugas)
      }
    } catch (error) {
      console.error('Gagal mengambil data petugas:', error)
      message.error('Gagal mengambil data petugas.')
    }
  }

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword)
    // Debounce atau delay jika diperlukan
    getPetugasData()
  }

  const handleAddPetugas = () => {
    setAddPetugasModalVisible(true)
  }

  const handleClosePetugas = () => {
    setAddPetugasModalVisible(false)
  }

  const handleAddPetugasOk = (values, form) => {
    setAddPetugasModalLoading(true)
    addPetugas(values)
      .then((response) => {
        setAddPetugasModalVisible(false)
        setAddPetugasModalLoading(false)
        message.success('Berhasil menambahkan!')
        getPetugasData()
        form.resetFields()
      })
      .catch((e) => {
        setAddPetugasModalLoading(false)
        message.error('Gagal menambahkan, harap coba lagi!')
      })
  }

  const handleEditPetugas = (row) => {
    setCurrentRowData({ ...row })
    setEditPetugasModalVisible(true)
  }

  const handleDeletePetugas = (row) => {
    const { nikPetugas } = row
    Modal.confirm({
      title: 'Konfirmasi',
      content: 'Apakah Anda yakin ingin menghapus data ini?',
      okText: 'Ya',
      okType: 'danger',
      cancelText: 'Tidak',
      onOk: () => {
        deletePetugas({ nikPetugas })
          .then((res) => {
            message.success('Berhasil dihapus')
            getPetugasData()
          })
          .catch((error) => {
            console.error('Gagal menghapus petugas:', error)
            message.error('Gagal menghapus petugas.')
          })
      },
    })
  }

  const handleEditPetugasOk = () => {
    const form = editPetugasFormRef.current
    if (form) {
      form
        .validateFields()
        .then((values) => {
          setEditPetugasModalLoading(true)
          editPetugas(values, values.nikPetugas)
            .then((response) => {
              form.resetFields()
              setEditPetugasModalVisible(false)
              setEditPetugasModalLoading(false)
              message.success('Berhasil diedit!')
              getPetugasData()
            })
            .catch((e) => {
              setEditPetugasModalLoading(false)
              message.error('Pengeditan gagal, harap coba lagi!')
            })
        })
        .catch((err) => {
          console.error('Validasi form gagal:', err)
        })
    }
  }

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

      const columnMappingLocal = {}
      columnTitlesLocal.forEach((title, index) => {
        columnMappingLocal[title] = index
      })

      setImportedData(importedDataLocal)
      setColumnTitles(columnTitlesLocal)
      setFileName(fileNameLocal)
      setColumnMapping(columnMappingLocal)
    }
    reader.readAsArrayBuffer(file)
    return false // Prevent automatic upload
  }

  const handleUpload = () => {
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

  const saveImportedData = async (columnMappingLocal) => {
    let errorCount = 0

    try {
      for (const row of importedData) {
        const dataToSave = {
          nikPetugas: row[columnMappingLocal['NIK Petugas Pendataan*)']],
          namaPetugas: row[columnMappingLocal['Nama Petugas Pendataan*)']],
          noTelp: row[columnMappingLocal['No. Telp Petugas Pendataan*)']],
          email: row[columnMappingLocal['Email Petugas Pendataan']],
        }

        // Check if data already exists
        const existingPetugasIndex = petugas.findIndex(
          (p) => p.nikPetugas === dataToSave.nikPetugas
        )

        try {
          if (existingPetugasIndex > -1) {
            // Update existing data
            await editPetugas(dataToSave, dataToSave.nikPetugas)
            setPetugas((prevPetugas) => {
              const updatedPetugas = [...prevPetugas]
              updatedPetugas[existingPetugasIndex] = dataToSave
              return updatedPetugas
            })
          } else {
            // Add new data
            await addPetugas(dataToSave)
            setPetugas((prevPetugas) => [...prevPetugas, dataToSave])
          }
        } catch (error) {
          errorCount++
          console.error('Gagal menyimpan data:', error)
        }
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

  const handleExportData = () => {
    const csvContent = convertToCSV(petugas)
    downloadCSV(csvContent)
  }

  const convertToCSV = (data) => {
    const columnTitlesLocal = [
      'NIK Petugas',
      'Nama Petugas',
      'No. Telp Petugas',
      'Email Petugas',
    ]

    const rows = [columnTitlesLocal]
    data.forEach((item) => {
      const row = [item.nikPetugas, item.namaPetugas, item.noTelp, item.email]
      rows.push(row)
    })

    const csvContent = rows.map((row) => row.join(',')).join('\n')
    return csvContent
  }

  const downloadCSV = (csvContent) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.href = url
    link.setAttribute('download', 'petugas.csv')
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const renderColumns = () => {
    const baseColumns = [
      { title: 'NIK Petugas', dataIndex: 'nikPetugas', key: 'nikPetugas' },
      { title: 'Nama Petugas', dataIndex: 'namaPetugas', key: 'namaPetugas' },
      {
        title: 'No. Telepon Petugas',
        dataIndex: 'noTelp',
        key: 'noTelponPetugas',
      },
      { title: 'Email Petugas', dataIndex: 'email', key: 'emailPetugas' },
    ]

    if (user && user.role === 'ROLE_ADMINISTRATOR') {
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
              onClick={() => handleEditPetugas(row)}
            />
            <Divider type="vertical" />
            <Button
              danger
              type="primary"
              shape="circle"
              icon={<DeleteOutlined />}
              title="Delete"
              onClick={() => handleDeletePetugas(row)}
            />
          </span>
        ),
      })
    }

    return baseColumns
  }

  const renderTable = () => {
    if (user && user.role === 'ROLE_PETUGAS') {
      return (
        <Table
          dataSource={petugas}
          bordered
          columns={renderColumns()}
          rowKey="nikPetugas"
        />
      )
    } else if (user && user.role === 'ROLE_ADMINISTRATOR') {
      return (
        <Table
          dataSource={petugas}
          bordered
          columns={renderColumns()}
          rowKey="nikPetugas"
        />
      )
    } else {
      return null
    }
  }

  const renderButtons = () => {
    if (user && user.role === 'ROLE_ADMINISTRATOR') {
      return (
        <Row gutter={[16, 16]} justify="start" style={{ paddingLeft: 9 }}>
          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <Button type="primary" onClick={handleAddPetugas} block>
              Tambah Petugas
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

  const cardContent = `Di sini, Anda dapat mengelola daftar petugas di sistem.`

  return (
    <div className="app-container">
      <TypingCard title="Manajemen Data Petugas" source={cardContent} />
      <br />
      <Card title={title} style={{ overflowX: 'scroll' }}>
        {renderTable()}
      </Card>
      <EditPetugasForm
        currentRowData={currentRowData}
        wrappedComponentRef={editPetugasFormRef}
        visible={editPetugasModalVisible}
        confirmLoading={editPetugasModalLoading}
        onCancel={() => setEditPetugasModalVisible(false)}
        onOk={handleEditPetugasOk}
      />
      <AddPetugasForm
        wrappedComponentRef={addPetugasFormRef}
        visible={addPetugasModalVisible}
        confirmLoading={addPetugasModalLoading}
        onCancel={handleClosePetugas}
        onOk={handleAddPetugasOk}
      />
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

export default Petugas
