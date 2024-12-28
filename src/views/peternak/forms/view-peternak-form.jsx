/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from 'react'
import { Button, Modal, Table, Spin, Typography, Divider } from 'antd'
import { getKandangByPeternak } from '../../../api/kandang'
import moment from 'moment'

const { Text } = Typography

const ViewPeternakForm = ({
  viewRowData,
  viewPeternakModalVisible,
  handleViewModalCancel,
}) => {
  const [kandang, setKandang] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchKandangByPeternak = useCallback(async () => {
    if (!viewRowData?.idPeternak) return

    setLoading(true)
    try {
      const response = await getKandangByPeternak(viewRowData.idPeternak)
      setKandang(response?.data?.content || []) // Safely access nested data
    } catch (error) {
      console.error('Error fetching kandang data:', error)
      setKandang([]) // Reset kandang on error
    } finally {
      setLoading(false)
    }
  }, [viewRowData?.idPeternak])

  useEffect(() => {
    if (viewPeternakModalVisible) {
      fetchKandangByPeternak()
    }
  }, [viewPeternakModalVisible, fetchKandangByPeternak])

  // Define columns for kandang table
  const kandangColumns = [
    {
      title: 'ID Kandang',
      dataIndex: 'idKandang',
      key: 'idKandang',
    },
    {
      title: 'Nama Kandang',
      dataIndex: 'namaKandang',
      key: 'namaKandang',
    },
    // Tambahkan kolom lainnya sesuai kebutuhan
  ]

  return (
    <Modal
      title="Detail Peternak"
      visible={viewPeternakModalVisible}
      onCancel={handleViewModalCancel}
      footer={[
        <Button key="back" onClick={handleViewModalCancel}>
          Tutup
        </Button>,
      ]}
      width={800}
    >
      <div>
        <p>
          <strong>NIK:</strong> {viewRowData?.nikPeternak || 'N/A'}
        </p>
        <p>
          <strong>Nama:</strong> {viewRowData?.namaPeternak || 'N/A'}
        </p>
        <p>
          <strong>Lokasi:</strong> {viewRowData?.lokasi || 'N/A'}
        </p>
        <p>
          <strong>Petugas Pendaftar:</strong>{' '}
          {viewRowData?.petugas?.namaPetugas || 'N/A'}
        </p>
        <p>
          <strong>Tanggal Pendaftaran:</strong>{' '}
          {viewRowData?.tanggalPendaftaran
            ? moment(viewRowData.tanggalPendaftaran).format('DD/MM/YYYY')
            : 'N/A'}
        </p>
      </div>
      <Divider />
      <div>
        <Text strong>Daftar Kandang:</Text>
        {loading ? (
          <Spin style={{ marginLeft: 10 }} />
        ) : kandang.length > 0 ? (
          <Table
            dataSource={kandang}
            columns={kandangColumns}
            rowKey={(record) => record.idKandang || record.key}
            pagination={false}
            size="small"
            style={{ marginTop: 10 }}
          />
        ) : (
          <Text style={{ marginLeft: 10 }}>Tidak ada kandang ditemukan.</Text>
        )}
      </div>
    </Modal>
  )
}

export default ViewPeternakForm
