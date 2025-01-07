/* eslint-disable no-constant-condition */
/* eslint-disable no-unused-vars */
import { getPeternaks } from '@/api/peternak'
import { getPetugas } from '@/api/petugas'
import {
  addVaksin,
  deleteVaksin,
  editVaksin,
  getVaksins
} from '@/api/vaksin'
import TypingCard from '@/components/TypingCard'
import { DeleteOutlined, EditOutlined, UploadOutlined, } from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Divider,
  Input,
  message,
  Modal,
  Row,
  Table,
  Upload,
} from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { read, utils } from 'xlsx'
import { reqUserInfo } from '../../api/user'
import AddVaksinForm from './forms/add-vaksin-form'
import EditVaksinForm from './forms/edit-vaksin-form'

const Vaksin = () => {
  const [vaksins, setVaksins] = useState([])
  const [peternaks, setPeternaks] = useState([])
  const [petugas, setPetugas] = useState([])
  const [editVaksinModalVisible, setEditVaksinModalVisible] = useState(false)
  const [editVaksinModalLoading, setEditVaksinModalLoading] = useState(false)
  const [currentRowData, setCurrentRowData] = useState({})
  const [addVaksinModalVisible, setAddVaksinModalVisible] = useState(false)
  const [addVaksinModalLoading, setAddVaksinModalLoading] = useState(false)
  const [importModalVisible, setImportModalVisible] = useState(false)
  const [importedData, setImportedData] = useState([])
  const [columnTitles, setColumnTitles] = useState([])
  const [fileName, setFileName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [columnMapping, setColumnMapping] = useState({})
  const [searchKeyword, setSearchKeyword] = useState('')
  const [user, setUser] = useState(null)

  const editVaksinFormRef = useRef(null)
  const addVaksinFormRef = useRef(null)

  // Fetch initial data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      await getPeternaksData()
      await getPetugasData()
      try {
        const response = await reqUserInfo()
        const userData = response.data
        setUser(userData)
        if (userData.role === 'ROLE_PETERNAK') {
          await getVaksinByPeternak(userData.username)
        } else {
          await getVaksinsData()
        }
      } catch (error) {
        console.error('Terjadi kesalahan saat mengambil data user:', error)
      }
    }

    fetchInitialData()
  }, [])

  // Fetch all vaksins with optional filtering
  const getVaksinsData = async () => {
    try {
      const result = await getVaksins()
      const { content, statusCode } = result.data

      if (statusCode === 200) {
        const filteredVaksin = content.filter((vaksin) => {
          const {
            idVaksin,
            idPeternak,
            namaPeternak,
            kodeEartagNasional,
            idPejantan,
            idPembuatan,
            bangsaPejantan,
            produsen,
            inseminator,
            lokasi,
          } = vaksin
          const keyword = searchKeyword.toLowerCase()

          const isIdVaksinValid = typeof idVaksin === 'string'
          const isIdPeternakValid = typeof idPeternak === 'string'
          const isNamaPeternakValid = typeof namaPeternak === 'string'
          const isKodeEartagNasionalValid =
            typeof kodeEartagNasional === 'string'
          const isIdPejantanValid = typeof idPejantan === 'string'
          const isIdPembuatanValid = typeof idPembuatan === 'string'
          const isBangsaPejantanValid = typeof bangsaPejantan === 'string'
          const isProdusenValid = typeof produsen === 'string'
          const isInseminatorValid = typeof inseminator === 'string'
          const isLokasiValid = typeof lokasi === 'string'

          return (
            (isIdVaksinValid && idVaksin.toLowerCase().includes(keyword)) ||
            (isIdPeternakValid && idPeternak.toLowerCase().includes(keyword)) ||
            (isNamaPeternakValid &&
              namaPeternak.toLowerCase().includes(keyword)) ||
            (isKodeEartagNasionalValid &&
              kodeEartagNasional.toLowerCase().includes(keyword)) ||
            (isIdPejantanValid && idPejantan.toLowerCase().includes(keyword)) ||
            (isIdPembuatanValid &&
              idPembuatan.toLowerCase().includes(keyword)) ||
            (isBangsaPejantanValid &&
              bangsaPejantan.toLowerCase().includes(keyword)) ||
            (isProdusenValid && produsen.toLowerCase().includes(keyword)) ||
            (isInseminatorValid &&
              inseminator.toLowerCase().includes(keyword)) ||
            (isLokasiValid && lokasi.toLowerCase().includes(keyword))
          )
        })

        setVaksins(filteredVaksin)
      }
    } catch (error) {
      console.error('Failed to fetch vaksins:', error)
    }
  }

  // Fetch vaksins by peternak ID (for ROLE_PETERNAK)
  const getVaksinByPeternak = async (peternakID) => {
    try {
      const result = await getVaksinByPeternak(peternakID)
      const { content, statusCode } = result.data
      if (statusCode === 200) {
        setVaksins(content)
      }
    } catch (error) {
      console.error('Failed to fetch vaksins by peternak:', error)
    }
  }

  // Fetch all peternaks
  const getPeternaksData = async () => {
    try {
      const result = await getPeternaks()
      const { content, statusCode } = result.data

      if (statusCode === 200) {
        setPeternaks(content)
      }
    } catch (error) {
      console.error('Failed to fetch peternaks:', error)
    }
  }

  // Fetch all petugas
  const getPetugasData = async () => {
    try {
      const result = await getPetugas()
      const { content, statusCode } = result.data

      if (statusCode === 200) {
        setPetugas(content)
      }
    } catch (error) {
      console.error('Failed to fetch petugas:', error)
    }
  }

  // Handle search input change
  const handleSearch = (keyword) => {
    setSearchKeyword(keyword)
    getVaksinsData()
  }

  // Handle opening the import modal
  const handleImportModalOpen = () => {
    setImportModalVisible(true)
  }

  // Handle closing the import modal
  const handleImportModalClose = () => {
    setImportModalVisible(false)
  }

  // Handle adding a vaksin
  const handleAddVaksin = () => {
    setAddVaksinModalVisible(true)
  }

  // Handle confirming the add vaksin modal
  const handleAddVaksinOk = () => {
    const form = addVaksinFormRef.current?.props?.form
    if (form) {
      form.validateFields(async (err, values) => {
        if (err) {
          return
        }
        setAddVaksinModalLoading(true)
        try {
          await addVaksin(values)
          form.resetFields()
          setAddVaksinModalVisible(false)
          setAddVaksinModalLoading(false)
          message.success('Berhasil menambahkan!')
          getVaksinsData()
        } catch (e) {
          setAddVaksinModalLoading(false)
          message.error('Gagal menambahkan, harap coba lagi!')
        }
      })
    }
  }

  // Handle editing a vaksin
  const handleEditVaksin = (row) => {
    setCurrentRowData({ ...row })
    setEditVaksinModalVisible(true)
  }

  // Handle confirming the edit vaksin modal
  const handleEditVaksinOk = () => {
    const form = editVaksinFormRef.current?.props?.form
    if (form) {
      form.validateFields(async (err, values) => {
        if (err) {
          return
        }
        setEditVaksinModalLoading(true)
        try {
          await editVaksin(values, values.idVaksin)
          form.resetFields()
          setEditVaksinModalVisible(false)
          setEditVaksinModalLoading(false)
          message.success('Berhasil diedit!')
          getVaksinsData()
        } catch (e) {
          setEditVaksinModalLoading(false)
          message.error('Pengeditan gagal, harap coba lagi!')
        }
      })
    }
  }

  // Handle deleting a vaksin
  const handleDeleteVaksin = (row) => {
    const { idVaksin } = row

    Modal.confirm({
      title: 'Konfirmasi',
      content: 'Apakah Anda yakin ingin menghapus data ini?',
      okText: 'Ya',
      okType: 'danger',
      cancelText: 'Tidak',
      onOk: async () => {
        try {
          await deleteVaksin({ idVaksin })
          message.success('Berhasil dihapus')
          getVaksinsData()
        } catch (error) {
          message.error('Gagal menghapus data, harap coba lagi!')
        }
      },
    })
  }

  // Handle canceling any modal
  const handleCancel = () => {
    setEditVaksinModalVisible(false)
    setAddVaksinModalVisible(false)
    setImportModalVisible(false)
  }

  // Convert Excel date format to JavaScript Date
  const convertToJSDate = (input) => {
    let date
    if (typeof input === 'number') {
      const utcDays = Math.floor(input - 25569)
      const utcValue = utcDays * 86400
      const dateInfo = new Date(utcValue * 1000)
      date = new Date(
        dateInfo.getFullYear(),
        dateInfo.getMonth(),
        dateInfo.getDate()
      ).toString()
    } else if (typeof input === 'string') {
      const [day, month, year] = input.split('/')
      date = new Date(`${year}-${month}-${day}`).toString()
    }

    return date
  }

  // Handle file import
  const handleFileImport = (file) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result)
      const workbook = read(data, { type: 'array' })

      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = utils.sheet_to_json(worksheet, { header: 1 })

      const importedData = jsonData.slice(1) // Exclude the first row (column titles)
      const columnTitles = jsonData[0] // Assume the first row contains column titles

      // Get the file name from the imported file
      const fileName = file.name.toLowerCase()

      // Create column mapping
      const mapping = {}
      columnTitles.forEach((title, index) => {
        mapping[title] = index
      })

      setImportedData(importedData)
      setColumnTitles(columnTitles)
      setFileName(fileName)
      setColumnMapping(mapping)
    }

    reader.readAsArrayBuffer(file)
    return false // Prevent upload
  }

  // Handle uploading the imported data
  const handleUpload = async () => {
    const { columnMapping, importedData } = { columnMapping, importedData }

    if (importedData.length === 0) {
      message.error('No data to import.')
      return
    }

    setUploading(true)

    try {
      await saveImportedData(columnMapping)
      setUploading(false)
      setImportModalVisible(false)
      message.success('Data berhasil diimport!')
    } catch (error) {
      console.error('Gagal mengunggah data:', error)
      setUploading(false)
      message.error('Gagal mengunggah data, harap coba lagi.')
    }
  }

  // Save imported data to the database
  const saveImportedData = async (mapping) => {
    let errorCount = 0

    try {
      for (const row of importedData) {
        const petugasNama = row[mapping['Inseminator']]?.toLowerCase()
        const petugasData = petugas.find(
          (p) => p.namaPetugas.toLowerCase() === petugasNama
        )
        const petugasId = petugasData ? petugasData.nikPetugas : null
        console.log(
          `Mencocokkan nama petugas: ${petugasNama}, Ditemukan: ${
            petugasData ? 'Ya' : 'Tidak'
          }, petugasId: ${petugasId}`
        )
        const dataToSave = {
          idVaksin: row[mapping['Batch Vaksin**)']],
          namaVaksin: row[mapping['Nama Vaksin**)']],
          jenisVaksin: row[mapping['Jenis Vaksin**)']],
          peternak_id: row[mapping['NIK Pemilik Ternak**)']],
          hewan_id: row[mapping['No. Eartag***)']],
          petugas_id: row[mapping['NIK Petugas Pendataan*)']],
          tglVaksin: convertToJSDate(row[mapping['Tanggal Vaksin**)']]),
        }

        const existingVaksinIndex = vaksins.findIndex(
          (p) => p.idVaksin === dataToSave.idVaksin
        )

        try {
          if (existingVaksinIndex > -1) {
            // Update existing data
            await editVaksin(dataToSave, dataToSave.idVaksin)
            setVaksins((prevVaksins) => {
              const updatedVaksins = [...prevVaksins]
              updatedVaksins[existingVaksinIndex] = dataToSave
              return updatedVaksins
            })
          } else {
            // Add new data
            await addVaksin(dataToSave)
            setVaksins((prevVaksins) => [...prevVaksins, dataToSave])
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
    } finally {
      setImportedData([])
      setColumnTitles([])
      setColumnMapping({})
    }
  }

  // Handle exporting data to CSV
  const handleExportData = () => {
    const csvContent = convertToCSV(vaksins)
    downloadCSV(csvContent)
  }

  // Convert data to CSV format
  const convertToCSV = (data) => {
    const columnTitles = [
      'ID Vaksin',
      'Nama Vaksin',
      'Jenis Vaksin',
      'Lokasi',
      'Nama Peternak',
      'NIK Peternak',
      'Eartag Hewan',
      'Inseminator',
      'Tanggal Vaksin',
    ]

    const rows = [columnTitles]
    data.forEach((item) => {
      const row = [
        item.idVaksin,
        item.namaVaksin,
        item.jenisVaksin,
        item.peternak?.lokasi || '',
        item.peternak?.namaPeternak || '',
        item.peternak?.idPeternak || '',
        item.hewan?.kodeEartagNasional || '',
        item.petugas?.namaPetugas || '',
        item.tglVaksin,
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

  // Download CSV file
  const downloadCSV = (csvContent) => {
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'Vaksin.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link) // Clean up
  }

  // Render Columns with Operations
  const renderColumns = () => {
    const baseColumns = [
      { title: 'ID Vaksin', dataIndex: 'idVaksin', key: 'idVaksin' },
      { title: 'Jenis Vaksin', dataIndex: ['jenisVaksin','jenisVaksin'], key: 'jenisVaksin' },
      { title: 'Nama Vaksin', dataIndex: ['namaVaksin', 'namaVaksin'], key: 'namaVaksin' },
      {
        title: 'Kode Eartag',
        dataIndex: ['hewan', 'kodeEartagNasional'],
        key: 'kodeEartagNasional',
      },
      {
        title: 'Nama Peternak',
        dataIndex: ['peternak', 'namaPeternak'],
        key: 'namaPeternak',
      },
      {
        title: 'NIK Peternak',
        dataIndex: ['peternak', 'nikPeternak'],
        key: 'nikPeternak',
      },
      { title: 'Bacth Vaksin', dataIndex: 'batchVaksin', key: 'batchVaksin' },
      { title: 'Dosis Vaksin', dataIndex: 'vaksinKe', key: 'vaksinKe' },
      {
        title: 'Inseminator',
        dataIndex: ['petugas', 'namaPetugas'],
        key: 'inseminator',
      },
      { title: 'Tanggal Vaksin', dataIndex: 'tglVaksin', key: 'tglVaksin' },
      { title: 'Tanggal Pendataan', dataIndex: ['hewan', 'tanggalTerdaftar'], key: 'tanggalTerdaftar' },
      
    ]

    if (
      user &&
      (user.role === 'ROLE_ADMINISTRATOR' || user.role === 'ROLE_PETUGAS')
    ) {
      baseColumns.push({
        title: 'Operasi',
        key: 'action',
        width: 120,
        align: 'center',
        render: (text, row) => (
          <span>
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined/>}
              title="Edit"
              onClick={() => handleEditVaksin(row)}
            />
            <Divider type="vertical" />
            <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined/>}
              title="Delete"
              onClick={() => handleDeleteVaksin(row)}
            />
          </span>
        ),
      })
    }

    return baseColumns
  }

  // Render Table based on User Role
  const renderTable = () => {
    if (user && user.role === 'ROLE_PETERNAK') {
      return (
        <Table
          dataSource={vaksins}
          bordered
          columns={renderColumns()}
          rowKey="idVaksin"
        />
      )
    } else if (
      user &&
      (user.role === 'ROLE_ADMINISTRATOR' || user.role === 'ROLE_PETUGAS')
    ) {
      return (
        <Table
          dataSource={vaksins}
          bordered
          columns={renderColumns()}
          rowKey="idVaksin"
        />
      )
    } else {
      return null
    }
  }

  // Render Buttons based on User Role
  const renderButtons = () => {
    if (
      user &&
      (user.role === 'ROLE_ADMINISTRATOR' || user.role === 'ROLE_PETUGAS')
    ) {
      return (
        <Row gutter={[16, 16]} justify="start" style={{ paddingLeft: 9 }}>
          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <Button type="primary" onClick={handleAddVaksin} block>
              Tambah Vaksin
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

  // Define the title with buttons and search input
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

  const cardContent = `Di sini, Anda dapat mengelola daftar vaksin di sistem.`

  return (
    <div className="app-container">
      {/* TypingCard component */}
      <TypingCard title="Manajemen Vaksin Buatan" source={cardContent} />
      <br />
      <Card title={title} style={{ overflowX: 'scroll' }}>
        {renderTable()}
      </Card>

      {/* Edit Vaksin Modal */}
      <EditVaksinForm
        currentRowData={currentRowData}
        wrappedComponentRef={editVaksinFormRef}
        visible={editVaksinModalVisible}
        confirmLoading={editVaksinModalLoading}
        onCancel={handleCancel}
        onOk={handleEditVaksinOk}
      />

      {/* Add Vaksin Modal */}
      <AddVaksinForm
        wrappedComponentRef={addVaksinFormRef}
        visible={addVaksinModalVisible}
        confirmLoading={addVaksinModalLoading}
        onCancel={handleCancel}
        onOk={handleAddVaksinOk}
      />

      {/* Import Modal */}
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
        <Upload
          beforeUpload={handleFileImport}
          accept=".xlsx,.xls,.csv"
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>Pilih File</Button>
        </Upload>
      </Modal>
    </div>
  )
}

export default Vaksin
