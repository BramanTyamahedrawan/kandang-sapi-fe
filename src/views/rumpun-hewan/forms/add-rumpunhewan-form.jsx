/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { forwardRef, useImperativeHandle } from 'react'
import { Form, Input, Modal } from 'antd'

const AddRumpunHewanForm = forwardRef((props, ref) => {
  const [form] = Form.useForm()
  const { visible, onCancel, onOk, confirmLoading } = props

  // Expose form methods to parent via ref
  useImperativeHandle(ref, () => ({
    form,
  }))

  // Handle form submission
  const onFinish = (values) => {
    onOk(values)
  }

  return (
    <Modal
      title="Tambah Rumpun Hewan"
      visible={visible}
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onOk(values, form)
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
        name="AddRumpunHewanForm"
        onFinish={onFinish}
      >
        <Form.Item
          name="rumpun"
          label="Rumpun Hewan:"
          rules={[
            { required: true, message: 'Silahkan masukkan rumpun hewan!' },
          ]}
        >
          <Input placeholder="Masukkan rumpun hewan" />
        </Form.Item>

        <Form.Item
          name="deskripsi"
          label="Deskripsi:"
          rules={[{ required: true, message: 'Silahkan masukkan deskripsi!' }]}
        >
          <Input.TextArea
            placeholder="Masukkan deskripsi rumpun hewan"
            autoSize={{ minRows: 3, maxRows: 6 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default AddRumpunHewanForm
