/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
import React, { forwardRef, useImperativeHandle, useEffect } from 'react'
import { Form, Input, Modal } from 'antd'

const EditRumpunHewanForm = forwardRef((props, ref) => {
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
        rumpun: currentRowData.rumpun,
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
      title="Edit Rumpun Hewan"
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
        name="EditRumpunHewanForm"
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

export default EditRumpunHewanForm
