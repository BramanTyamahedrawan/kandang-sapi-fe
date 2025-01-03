/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
import React, { forwardRef, useImperativeHandle, useEffect } from 'react'
import { Form, Input, Modal } from 'antd'

const EditJenisHewanForm = forwardRef((props, ref) => {
  const [form] = Form.useForm()
  const { visible, onCancel, onOk, confirmLoading, currentRowData } = props

  // Expose form methods to parent via ref
  useImperativeHandle(ref, () => ({
    form,
  }))

  // Set form fields when currentRowData changes
  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        jenis: currentRowData.jenis,
        deskripsi: currentRowData.deskripsi,
      })
    } else {
      form.resetFields()
    }
  }, [visible, currentRowData, form])

  // Handle form submission
  const onFinish = (values) => {
    onOk(values, form)
  }

  return (
    <Modal
      title="Edit Jenis Hewan"
      visible={visible}
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onOk(values)
          })
          .catch((info) => {
            console.log('Validate Failed:', info)
          })
      }}
      confirmLoading={confirmLoading}
      width={700}
      destroyOnClose
    >
      <Form
        {...{
          labelCol: { span: 6 },
          wrapperCol: { span: 17 },
        }}
        form={form}
        layout="vertical"
        name="EditJenisHewanForm"
        onFinish={onFinish}
      >
        <Form.Item
          name="jenis"
          label="Jenis Hewan:"
          rules={[
            { required: true, message: 'Silahkan masukkan jenis hewan!' },
          ]}
        >
          <Input placeholder="Masukkan jenis hewan" />
        </Form.Item>

        <Form.Item
          name="deskripsi"
          label="Deskripsi:"
          rules={[{ required: true, message: 'Silahkan masukkan deskripsi!' }]}
        >
          <Input.TextArea
            placeholder="Masukkan deskripsi jenis hewan"
            autoSize={{ minRows: 3, maxRows: 6 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default EditJenisHewanForm
