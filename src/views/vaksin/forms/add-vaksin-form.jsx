/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Row, Col } from "antd";
import { getPetugas } from "@/api/petugas";
import { getPeternaks } from "@/api/peternak";
import { getHewans } from "../../../api/hewan";
import { getJenisVaksin } from "@/api/jenis-vaksin";
import { getNamaVaksin } from "@/api/nama-vaksin";

const { Option } = Select;

const AddVaksinForm = ({ visible, onCancel, onOk, confirmLoading }) => {
  const [form] = Form.useForm();
  const [petugasList, setPetugasList] = useState([]);
  const [peternakList, setPeternakList] = useState([]);
  const [hewanList, setHewanList] = useState([]);
  const [jenisVaksinList, setJenisVaksinList] = useState([]);
  const [namaVaksinList, setNamaVaksinList] = useState([]);

  useEffect(() => {
    fetchPetugasList();
    fetchPeternakList();
    fetchHewanList();
    fetchJenisVaksinList();
    fetchNamaVaksinList();
  }, []);

  const fetchPetugasList = async () => {
    try {
      const result = await getPetugas();
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        setPetugasList(content);
      }
    } catch (error) {
      console.error("Error fetching petugas data:", error);
    }
  };

  const fetchHewanList = async () => {
    try {
      const result = await getHewans();
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        setHewanList(content);
      }
    } catch (error) {
      console.error("Error fetching hewan data:", error);
    }
  };

  const fetchPeternakList = async () => {
    try {
      const result = await getPeternaks();
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        setPeternakList(content);
      }
    } catch (error) {
      console.error("Error fetching peternak data:", error);
    }
  };

  const fetchJenisVaksinList = async () => {
    try {
      const result = await getJenisVaksin();
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        setJenisVaksinList(content);
      }
    } catch (error) {
      console.error("Error fetching jenis vaksin data:", error);
    }
  };

  const fetchNamaVaksinList = async () => {
    try {
      const result = await getNamaVaksin();
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        setNamaVaksinList(content);
      }
    } catch (error) {
      console.error("Error fetching nama vaksin data:", error);
    }
  };

  const handleNamaVaksinChange = (value) => {
    const selectedNamaVaksin = namaVaksinList.find((item) => item.idNamaVaksin === value);
    if (selectedNamaVaksin) {
      const selectedJenisVaksin = jenisVaksinList.find((jenis) => jenis.idJenisVaksin === selectedNamaVaksin.jenisVaksin?.idJenisVaksin);
      if (selectedJenisVaksin) {
        form.setFieldsValue({ idJenisVaksin: selectedJenisVaksin.idJenisVaksin });
      }
    }
  };

  const handleSubmit = async () => {
    form
      .validateFields()
      .then((values) => {
        onOk(values, form);
        form.resetFields();
      })
      .catch((error) => console.error("Validation failed:", error));
  };

  return (
    <Modal
      title="Tambah Data Vaksin"
      visible={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleSubmit}
      confirmLoading={confirmLoading}
      okText="Simpan"
      width={1000}
    >
      <Form form={form} layout="vertical" name="add_vaksin_form">
        <Row gutter={16}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item label="Nama Vaksin" name="idNamaVaksin" rules={[{ required: true, message: "Silahkan pilih nama vaksin!" }]}>
              <Select placeholder="Pilih Nama Vaksin" onChange={handleNamaVaksinChange}>
                {namaVaksinList.map(({ idNamaVaksin, nama }) => (
                  <Option key={idNamaVaksin} value={idNamaVaksin}>
                    {nama}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item label="Jenis Vaksin" name="idJenisVaksin" rules={[{ required: true, message: "Silahkan pilih jenis vaksin!" }]}>
              <Select placeholder="Jenis vaksin terisi otomatis">
                {jenisVaksinList.map(({ idJenisVaksin, jenis }) => (
                  <Option key={idJenisVaksin} value={idJenisVaksin}>
                    {jenis}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item label="Nama Peternak" name="peternak_id" rules={[{ required: true, message: "Silahkan pilih nama peternak!" }]}>
              <Select placeholder="Pilih Nama Peternak">
                {peternakList.map(({ idPeternak, namaPeternak }) => (
                  <Option key={idPeternak} value={idPeternak}>
                    {namaPeternak}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item label="Eartag Hewan" name="hewan_id" rules={[{ required: true, message: "Silahkan pilih eartag hewan!" }]}>
              <Select placeholder="Pilih Eartag">
                {hewanList.map(({ idHewan, kodeEartagNasional }) => (
                  <Option key={idHewan} value={idHewan}>
                    {kodeEartagNasional}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item label="Batch Vaksin" name="batchVaksin" rules={[{ required: true, message: "Silahkan isi batch vaksin!" }]}>
              <Input placeholder="Masukan Bach Vaksin" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Dosis Vaksin"
              name="vaksinKe"
              rules={[
                { required: true, message: "Silahkan isi dosis vaksin!" },
                {
                  pattern: /^-?\d+(\.\d+)?$/,
                  message: "Dosis harus berupa angka",
                },
              ]}
            >
              <Input placeholder="Masukan Dosis Vaksin" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item label="Inseminator" name="petugas_id" rules={[{ required: true, message: "Silahkan pilih inseminator!" }]}>
              <Select placeholder="Pilih Inseminator">
                {petugasList.map(({ petugasId, namaPetugas }) => (
                  <Option key={petugasId} value={petugasId}>
                    {namaPetugas}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item label="Tanggal Vaksin" name="tglVaksin" rules={[{ required: true, message: "Silahkan isi tanggal vaksin!" }]}>
              <Input type="date" placeholder="Masukkan Tanggal Vaksin" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddVaksinForm;
