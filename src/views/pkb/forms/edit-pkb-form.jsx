/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Form, Input, Modal, Select, Row, Col } from "antd";
import { getPetugas } from "@/api/petugas";
import { getPeternaks } from "@/api/peternak";
import { getHewans } from "../../../api/hewan";
import { getKandang } from "@/api/kandang";
import { getRumpunHewan } from "@/api/rumpunhewan";
import { getJenisHewan } from "@/api/jenishewan";

const { Option } = Select;

const EditPKBForm = ({
  visible,
  onCancel,
  onOk,
  confirmLoading,
  currentRowData,
}) => {
  const [form] = Form.useForm();
  const [hewanList, setHewanList] = useState([]);
  const [petugasList, setPetugasList] = useState([]);
  const [peternakList, setPeternakList] = useState([]);
  const [kandangList, setKandangList] = useState([]);
  const [rumpunHewanList, setRumpunHewanList] = useState([]);
  const [jenisHewanList, setJenisHewanList] = useState([]);

  useEffect(() => {
    fetchPetugasList();
    fetchPeternakList();
    fetchHewanList();
    fetchKandangList();
    fetchRumpunHewanList();
    fetchJenisHewanList();

    if (currentRowData) {
      form.setFieldsValue({
        idPkb: currentRowData.idPkb,
        idKejadian: currentRowData.idKejadian,
        tanggalPkb: currentRowData.tanggalPkb,
        jumlah: currentRowData.jumlah,
        umurKebuntingan: currentRowData.umurKebuntingan,
        idPeternak: currentRowData.peternak?.idPeternak,
        idHewan: currentRowData.hewan?.idHewan,
        petugasId: currentRowData.petugas?.petugasId,
        idRumpunHewan: currentRowData.rumpunHewan?.idRumpunHewan,
        idJenisHewan: currentRowData.jenisHewan?.idJenisHewan,
        idKandang: currentRowData.kandang?.idKandang,
      });
    }
  }, [currentRowData, form]);

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
      title="Edit PKB"
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleSubmit}
      confirmLoading={confirmLoading}
      width={1000}
      okText="Simpan"
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="idKejadian" label="ID Kejadian">
              <Input placeholder="Masukkan ID Kejadian" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="tanggalPkb"
              label="Tanggal PKB"
              rules={[{ required: true, message: "Masukkan tanggal PKB!" }]}
            >
              <Input type="date" placeholder="Masukkan tanggal" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="jumlah"
              label="Jumlah"
              rules={[{ required: true, message: "Masukkan Jumlah" }]}
            >
              <Input placeholder="Masukkan jumlah" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="umurKebuntingan"
              label="Umur Kebuntingan Saat PKB"
              rules={[
                { required: true, message: "Masukkan umur kebuntingan!" },
              ]}
            >
              <Input placeholder="Masukkan umur kebuntingan" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="idPeternak"
              label="Nama Peternak"
              rules={[
                { required: true, message: "Silahkan isi nama peternak!" },
              ]}
            >
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
            <Form.Item name="petugasId" label="Pemeriksa Kebuntingan">
              <Select placeholder="Pilih Petugas">
                {petugasList.map(({ petugasId, namaPetugas }) => (
                  <Option key={petugasId} value={petugasId}>
                    {namaPetugas}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="idKandang" label="Kandang">
              <Select placeholder="Pilih Kandang">
                {kandangList.map(({ idKandang, namaKandang }) => (
                  <Option key={idKandang} value={idKandang}>
                    {namaKandang}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="idHewan" label="No Kartu Ternak">
              <Select placeholder="Pilih No Kartu Ternak">
                {hewanList.map(({ idHewan, noKartuTernak }) => (
                  <Option key={idHewan} value={idHewan}>
                    {noKartuTernak}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="idRumpunHewan" label="Spesies">
              <Select placeholder="Pilih Spesies">
                {rumpunHewanList.map(({ idRumpunHewan, rumpun }) => (
                  <Option key={idRumpunHewan} value={idRumpunHewan}>
                    {rumpun}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="idJenisHewan" label="Kategori">
              <Select placeholder="Pilih Kategori">
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

export default EditPKBForm;
