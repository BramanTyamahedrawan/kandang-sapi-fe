/* eslint-disable react/prop-types */
import { Modal, Descriptions } from 'antd'

const ViewKandangForm = ({ visible, onCancel, currentRowData }) => {
  return (
    <Modal
      visible={visible}
      title="Detail Kandang"
      onCancel={onCancel}
      footer={null}
    >
      <Descriptions bordered>
        <Descriptions.Item label="Id Kandang">
          {currentRowData?.idKandang || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="Luas">
          {currentRowData?.luas || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="Kapasitas">
          {currentRowData?.kapasitas || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="Nilai Bangunan">
          {currentRowData?.nilaiBangunan || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="Alamat">
          {currentRowData?.alamat || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="Latitude">
          {currentRowData?.latitude || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="Longitude">
          {currentRowData?.longitude || 'N/A'}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  )
}

export default ViewKandangForm
