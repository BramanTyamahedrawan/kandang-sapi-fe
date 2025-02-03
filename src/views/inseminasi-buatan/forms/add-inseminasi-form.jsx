/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Row, Col } from "antd";
import { getPetugas } from "@/api/petugas";
import { getPeternaks } from "@/api/peternak";
import { getHewans } from "../../../api/hewan";
import { getKandang } from "@/api/kandang";
import { getJenisHewan } from "@/api/jenishewan";
import { getRumpunHewan } from "../../../api/rumpunhewan";

const { Option } = Select;

const AddInseminasiBuatanForm = ({ visible, onCancel, onOk, confirmLoading }) => {
  const [form] = Form.useForm();
  const [petugasList, setPetugasList] = useState([]);
  const [peternakList, setPeternakList] = useState([]);
  const [hewanList, setHewanList] = useState([]);
  const [kandangList, setKandangList] = useState([]);
  const [jenisHewanList, setJenisHewanList] = useState([]);
  const [rumpunHewanList, setRumpunHewanList] = useState([]);

  useEffect(() => {
    fetchPetugasList();
    fetchPeternakList();
    fetchRumpunHewanList();
    fetchHewanList();
    fetchKandangList();
    fetchJenisHewanList();
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

  const fetchRumpunHewanList = async () => {
    try {
      const result = await getRumpunHewan();
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        setRumpunHewanList(content);
      }
    } catch (error) {
      console.error("Error fetching rumpun hewan data:", error);
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

  const fetchKandangList = async () => {
    try {
      const result = await getKandang();
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        setKandangList(content);
      }
    } catch (error) {
      console.error("Error fetching kandang data:", error);
    }
  };

  const fetchJenisHewanList = async () => {
    try {
      const result = await getJenisHewan();
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        setJenisHewanList(content);
      }
    } catch (error) {
      console.error("Error fetching jenis hewan data:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onOk(values);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      title="Tambah Data Inseminasi Buatan"
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleSubmit}
      confirmLoading={confirmLoading}
      okText="Simpan"
      width={1000} // Mengatur lebar modal agar lebih luas
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item label="Produsen:" name="produsen">
              <Select placeholder="Pilih BBIB" allowClear>
                <Option value="BBIB Singosari">BBIB Singosari</Option>
                <Option value="BIB Lembang">BIB Lembang</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item label="IB:" name="ib">
              <Select
                placeholder="Pilih IB"
                onChange={(value) => {
                  const ibMapping = {
                    ib1: value === "1" ? "1" : "-",
                    ib2: value === "2" ? "1" : "-",
                    ib3: value === "3" ? "1" : "-",
                    ibLain: value === "4" ? "1" : "-",
                  };
                  form.setFieldsValue(ibMapping); // Mengatur nilai untuk input API utama
                  console.log(ibMapping);
                }}
              >
                <Option value="1">IB1</Option>
                <Option value="2">IB2</Option>
                <Option value="3">IB3</Option>
                <Option value="4">IBLain</Option>
              </Select>
              <Form.Item name="ib1" style={{ display: "none" }}>
                <Input />
              </Form.Item>
              <Form.Item name="ib2" style={{ display: "none" }}>
                <Input />
              </Form.Item>
              <Form.Item name="ib3" style={{ display: "none" }}>
                <Input />
              </Form.Item>
              <Form.Item name="ibLain" style={{ display: "none" }}>
                <Input />
              </Form.Item>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item label="ID Pejantan:" name="idPejantan" rules={[{ required: true, message: "Silahkan isi ID pejantan" }]}>
              <Input placeholder="Masukkan ID Pejantan" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item label="ID Pembuatan:" name="idPembuatan" rules={[{ required: true, message: "Silahkan isi ID pembuatan" }]}>
              <Input placeholder="Masukkan ID Pembuatan" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item label="Tanggal IB:" name="tanggalIB" rules={[{ required: true, message: "Silahkan isi tanggal IB" }]}>
              <Input type="date" placeholder="Masukkan Tanggal IB" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item label="Inseminator:" name="petugasId" rules={[{ required: true, message: "Silahkan pilih inseminator" }]}>
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
            <Form.Item label="Nama Peternak:" name="idPeternak" rules={[{ required: true, message: "Silahkan pilih nama peternak" }]}>
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
            <Form.Item label="Eartag Hewan:" name="idHewan" rules={[{ required: true, message: "Silahkan pilih eartag hewan" }]}>
              <Select placeholder="Pilih Kode Eartag">
                {hewanList.map(({ idHewan, kodeEartagNasional }) => (
                  <Option key={idHewan} value={idHewan}>
                    {kodeEartagNasional}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item label="Bangsa Pejantan:" name="idRumpunHewan" rules={[{ required: true, message: "Silahkan pilih Bangsa Pejantan" }]}>
              <Select
                placeholder="Pilih Bangsa Pejantan"
                onChange={(value) => {
                  const selectedRumpun = rumpunHewanList.find((rumpunHewan) => rumpunHewan.idRumpunHewan === value);
                  if (selectedRumpun) {
                    form.setFieldsValue({
                      bangsaPejantan: selectedRumpun.rumpun,
                    });
                  }
                }}
              >
                {rumpunHewanList.map((rumpunHewan) => (
                  <Select.Option key={rumpunHewan.idRumpunHewan} value={rumpunHewan.idRumpunHewan}>
                    {rumpunHewan.rumpun}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="bangsaPejantan" style={{ display: "none" }}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item label="Kandang" name="idKandang">
              <Select placeholder="Pilih Kandang">
                {kandangList.map(({ idKandang, namaKandang }) => (
                  <Option key={idKandang} value={idKandang}>
                    {namaKandang}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24}>
            <Form.Item label="Jenis Hewan" name="idJenisHewan">
              <Select placeholder="Pilih Jenis Hewan">
                {jenisHewanList.map(({ idJenisHewan, jenis }) => (
                  <Option key={idJenisHewan} value={idJenisHewan}>
                    {jenis}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddInseminasiBuatanForm;
