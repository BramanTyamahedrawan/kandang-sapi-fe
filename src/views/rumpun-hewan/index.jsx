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
import { UploadOutlined } from '@ant-design/icons'
import { read, utils } from 'xlsx'
import AddHewanForm from './forms/add-rumpunhewan-form'
import EditHewanForm from './forms/edit-rumpunhewan-form'
import TypingCard from '@/components/TypingCard'
import {
  getRumpunHewan,
  deleteRumpunHewan,
  editRumpunHewan,
  addRumpunHewan,
} from '@/api/rumpunhewan'
import { getPetugas } from '@/api/petugas'
import { reqUserInfo } from '../../api/user'

import kandangSapi from '../../assets/images/kandangsapi.jpg' // Assuming it's a default export

const RumpunHewan = () => {
  // State Variables
  const [petugas, setPetugas] = useState([])
  const [rumpunHewans, setRumpunHewans] = useState([])
  const [editHewanModalVisible, setEditHewanModalVisible] = useState(false)
  const [editHewanModalLoading, setEditHewanModalLoading] = useState(false)
  const [currentRowData, setCurrentRowData] = useState({})
  const [addHewanModalVisible, setAddHewanModalVisible] = useState(false)
  const [addHewanModalLoading, setAddHewanModalLoading] = useState(false)
  const [importModalVisible, setImportModalVisible] = useState(false)
  const [importedData, setImportedData] = useState([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [user, setUser] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [columnTitles, setColumnTitles] = useState([])
  const [fileName, setFileName] = useState('')
  const [columnMapping, setColumnMapping] = useState({})

  // Form References
  const editHewanFormRef = useRef(null)
  const addHewanFormRef = useRef(null)

  // Fetch Initial Data on Component Mount
  useEffect(() => {
    const fetchInitialData = async () => {
      await getPetugasData()
      try {
        const response = await reqUserInfo()
        const userData = response.data
        setUser(userData)
        if (userData.role === 'ROLE_PETERNAK') {
          await getHewanByPeternak(userData.username)
        } else {
          await getRumpunHewanData()
        }
      } catch (error) {
        console.error('Terjadi kesalahan saat mengambil data user:', error)
      }
    }

    fetchInitialData()
  }, [])

  // Fetch All Rumpun Hewan with Optional Filtering
  const getRumpunHewanData = async () => {
    try {
      const result = await getRumpunHewan()
      const { content, statusCode } = result.data

      if (statusCode === 200) {
        const filteredRumpunHewan = content.filter((hewan) => {
          const { idRumpunHewan, rumpun, deskripsi } = hewan
          const keyword = searchKeyword.toLowerCase()

          const isIdRumpunHewanValid = typeof idRumpunHewan === 'string'
          const isRumpunValid = typeof rumpun === 'string'
          const isDeskripsiValid = typeof deskripsi === 'string'

          return (
            (isIdRumpunHewanValid &&
              idRumpunHewan.toLowerCase().includes(keyword)) ||
            (isRumpunValid && rumpun.toLowerCase().includes(keyword)) ||
            (isDeskripsiValid && deskripsi.toLowerCase().includes(keyword))
          )
        })

        setRumpunHewans(filteredRumpunHewan)
      }
    } catch (error) {
      console.error('Failed to fetch rumpun hewan:', error)
      message.error('Gagal mengambil data rumpun hewan, harap coba lagi!')
    }
  }

  // Fetch Rumpun Hewan by Peternak ID (for ROLE_PETERNAK)
  const getHewanByPeternak = async (peternakID) => {
    try {
      const result = await getRumpunHewan() // Assuming similar API structure
      const { content, statusCode } = result.data
      if (statusCode === 200) {
        const filteredHewans = content.filter(
          (hewan) => hewan.peternak_id === peternakID
        )
        setRumpunHewans(filteredHewans)
      }
    } catch (error) {
      console.error('Failed to fetch rumpun hewan by peternak:', error)
      message.error('Gagal mengambil data rumpun hewan, harap coba lagi!')
    }
  }

  // Fetch All Petugas
  const getPetugasData = async () => {
    try {
      const result = await getPetugas()
      const { content, statusCode } = result.data

      if (statusCode === 200) {
        setPetugas(content)
      }
    } catch (error) {
      console.error('Failed to fetch petugas:', error)
      message.error('Gagal mengambil data petugas, harap coba lagi!')
    }
  }

  // Handle Search Input Change
  const handleSearch = (keyword) => {
    setSearchKeyword(keyword)
    getRumpunHewanData()
  }

  // Handle Opening the Import Modal
  const handleImportModalOpen = () => {
    setImportModalVisible(true)
  }

  // Handle Closing the Import Modal
  const handleImportModalClose = () => {
    setImportModalVisible(false)
  }

  // Handle Adding a Rumpun Hewan
  const handleAddHewan = () => {
    setAddHewanModalVisible(true)
  }

  // Handle Confirming the Add Rumpun Hewan Modal
  const handleAddHewanOk = async (values, form) => {
    setAddHewanModalLoading(true)
    const hewanData = {
      rumpun: values.rumpun,
      deskripsi: values.deskripsi,
    }
    try {
      await addRumpunHewan(hewanData)
      form.resetFields()
      setAddHewanModalVisible(false)
      setAddHewanModalLoading(false)
      message.success('Berhasil menambahkan!')
      getRumpunHewanData()
    } catch (e) {
      setAddHewanModalLoading(false)
      console.error('Failed to add rumpun hewan:', e)
      message.error('Gagal menambahkan, harap coba lagi!')
    }
  }

  // Handle Editing a Rumpun Hewan
  const handleEditHewan = (row) => {
    setCurrentRowData({ ...row })
    setEditHewanModalVisible(true)
  }

  // Handle Confirming the Edit Rumpun Hewan Modal
  const handleEditHewanOk = async (values, form) => {
    setEditHewanModalLoading(true)
    try {
      await editRumpunHewan(values, values.idRumpunHewan)
      form.resetFields()
      setEditHewanModalVisible(false)
      setEditHewanModalLoading(false)
      message.success('Berhasil diedit!')
      getRumpunHewanData()
    } catch (e) {
      setEditHewanModalLoading(false)
      console.error('Failed to edit rumpun hewan:', e)
      message.error('Pengeditan gagal, harap coba lagi!')
    }
  }

  // Handle Deleting a Rumpun Hewan
  const handleDeleteHewan = (row) => {
    const { idRumpunHewan } = row

    Modal.confirm({
      title: 'Konfirmasi',
      content: 'Apakah Anda yakin ingin menghapus data ini?',
      okText: 'Ya',
      okType: 'danger',
      cancelText: 'Tidak',
      onOk: async () => {
        try {
          await deleteRumpunHewan({ idRumpunHewan })
          message.success('Berhasil dihapus')
          getRumpunHewanData()
        } catch (error) {
          console.error('Failed to delete rumpun hewan:', error)
          message.error('Gagal menghapus data, harap coba lagi!')
        }
      },
    })
  }

  // Handle Canceling Any Modal
  const handleCancel = () => {
    setEditHewanModalVisible(false)
    setAddHewanModalVisible(false)
    setImportModalVisible(false)
  }

  // Convert Excel Date Format to JavaScript Date
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

  // Handle File Import
  const handleFileImport = (file) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result)
      const workbook = read(data, { type: 'array' })

      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = utils.sheet_to_json(worksheet, { header: 1 })

      const importedData = jsonData.slice(1) // Exclude the first row (column titles)
      const columnTitles = jsonData[0] // Assume the first row contains column titles

      // Create column mapping
      const mapping = {}
      columnTitles.forEach((title, index) => {
        mapping[title] = index
      })

      // Iterate through importedData and process the address (if applicable)
      // Note: For Rumpun Hewan, address processing may not be necessary.
      // If not needed, this part can be adjusted or removed.
      const modifiedData = importedData.map((row) => {
        // Example processing; adjust based on actual CSV structure
        return {
          ...row,
          // Add any additional processing if needed
        }
      })

      setImportedData(modifiedData)
      setColumnTitles(columnTitles)
      setFileName(file.name.toLowerCase())
      setColumnMapping(mapping)
    }

    reader.readAsArrayBuffer(file)
    return false // Prevent upload
  }

  // Handle Uploading the Imported Data
  const handleUpload = async () => {
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

  // Save Imported Data to the Database
  const saveImportedData = async (mapping) => {
    let errorCount = 0

    try {
      for (const row of importedData) {
        const idRumpunHewan = row[mapping['ID Rumpun Hewan']]?.toLowerCase()
        const rumpun = row[mapping['Rumpun']]?.toLowerCase()
        const deskripsi = row[mapping['Deskripsi']]?.toLowerCase()

        const dataToSave = {
          idRumpunHewan: row[mapping['ID Rumpun Hewan']] || '',
          rumpun: row[mapping['Rumpun']] || '',
          deskripsi: row[mapping['Deskripsi']] || '',
        }

        const existingHewanIndex = rumpunHewans.findIndex(
          (p) => p.idRumpunHewan === dataToSave.idRumpunHewan
        )

        try {
          if (existingHewanIndex > -1) {
            // Update existing data
            await editRumpunHewan(dataToSave, dataToSave.idRumpunHewan)
            setRumpunHewans((prevRumpunHewans) => {
              const updatedRumpunHewans = [...prevRumpunHewans]
              updatedRumpunHewans[existingHewanIndex] = dataToSave
              return updatedRumpunHewans
            })
          } else {
            // Add new data
            await addRumpunHewan(dataToSave)
            setRumpunHewans((prevRumpunHewans) => [
              ...prevRumpunHewans,
              dataToSave,
            ])
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
      message.error('Gagal memproses data, harap coba lagi!')
    } finally {
      setImportedData([])
      setColumnTitles([])
      setColumnMapping({})
    }
  }

  // Handle Exporting Data to CSV
  const handleExportData = () => {
    const csvContent = convertToCSV(rumpunHewans)
    downloadCSV(csvContent)
  }

  // Convert Data to CSV Format
  const convertToCSV = (data) => {
    const columnTitles = ['ID Rumpun Hewan', 'Rumpun', 'Deskripsi']

    const rows = [columnTitles]
    data.forEach((item) => {
      const row = [item.idRumpunHewan, item.rumpun, item.deskripsi]
      rows.push(row)
    })

    let csvContent = 'data:text/csv;charset=utf-8,'

    rows.forEach((rowArray) => {
      const row = rowArray.join(';')
      csvContent += row + '\r\n'
    })

    return csvContent
  }

  // Download CSV File
  const downloadCSV = (csvContent) => {
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'RumpunHewan.csv')
    document.body.appendChild(link) // Required for Firefox
    link.click()
    document.body.removeChild(link) // Clean up
  }

  // Render Columns with Operations
  const renderColumns = () => {
    const baseColumns = [
      {
        title: 'ID Rumpun Hewan',
        dataIndex: 'idRumpunHewan',
        key: 'idRumpunHewan',
      },
      { title: 'Rumpun', dataIndex: 'rumpun', key: 'rumpun' },
      { title: 'Deskripsi', dataIndex: 'deskripsi', key: 'deskripsi' },
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
              icon="edit"
              title="Edit"
              onClick={() => handleEditHewan(row)}
            />
            <Divider type="vertical" />
            <Button
              type="primary"
              danger
              shape="circle"
              icon="delete"
              title="Delete"
              onClick={() => handleDeleteHewan(row)}
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
          dataSource={rumpunHewans}
          bordered
          columns={renderColumns()}
          rowKey="idRumpunHewan"
        />
      )
    } else if (
      user &&
      (user.role === 'ROLE_ADMINISTRATOR' || user.role === 'ROLE_PETUGAS')
    ) {
      return (
        <Table
          dataSource={rumpunHewans}
          bordered
          columns={renderColumns()}
          rowKey="idRumpunHewan"
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
            <Button type="primary" onClick={handleAddHewan} block>
              Tambah Rumpun
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

  // Define the Title with Buttons and Search Input
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

  const cardContent = `Di sini, Anda dapat mengelola daftar rumpun hewan di sistem.`

  return (
    <div className="app-container">
      {/* TypingCard component */}
      <TypingCard title="Manajemen Rumpun Hewan" source={cardContent} />
      <br />
      <Card title={title} style={{ overflowX: 'scroll' }}>
        {renderTable()}
      </Card>

      {/* Edit Rumpun Hewan Modal */}
      <EditHewanForm
        currentRowData={currentRowData}
        wrappedComponentRef={editHewanFormRef}
        visible={editHewanModalVisible}
        confirmLoading={editHewanModalLoading}
        onCancel={handleCancel}
        onOk={handleEditHewanOk}
      />

      {/* Add Rumpun Hewan Modal */}
      <AddHewanForm
        wrappedComponentRef={addHewanFormRef}
        visible={addHewanModalVisible}
        confirmLoading={addHewanModalLoading}
        onCancel={handleCancel}
        onOk={handleAddHewanOk}
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

export default RumpunHewan
