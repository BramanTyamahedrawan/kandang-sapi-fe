/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { getKandang } from "@/api/kandang";
import { getPeternaks } from "@/api/peternak";
import { getPetugas } from "@/api/petugas";
import { InboxOutlined } from "@ant-design/icons";
import { Col, Form, Input, Modal, Row, Select, Upload } from "antd";
import { useEffect, useState } from "react";
import { getJenisHewan } from "../../../api/jenishewan";
import { getRumpunHewan } from "../../../api/rumpunhewan";
import { getTujuanPemeliharaan } from "@/api/tujuan-pemeliharaan";
const { Option } = Select;

const AddHewanForm = ({ visible, onCancel, onOk, confirmLoading }) => {
  const [form] = Form.useForm();
  const [kandangList, setKandangList] = useState([]);
  const [petugasList, setPetugasList] = useState([]);
  const [peternakList, setPeternakList] = useState([]);
  const [jenisHewanList, setJenisHewanList] = useState([]);
  const [rumpunHewanList, setRumpunHewanList] = useState([]);
  const [tujuanPemeliharaanList, setTujuanPemeliharaanList] = useState([]);

  useEffect(() => {
    // Fetch petugas, peternak, and kandang data
    fetchPetugasList();
    fetchPeternakList();
    fetchKandangList();
    fetchJenisHewanList();
    fetchRumpunHewanList();
    fetchTujuanPemeliharaanList();
  }, []);

  const fetchJenisHewanList = async () => {
    try {
      const result = await getJenisHewan();
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        console.log(content);
        const jenisHewan = content.map(({ idJenisHewan, jenis }) => ({
          idJenisHewan,
          jenis,
        }));
        setJenisHewanList(jenisHewan);
      }
    } catch (error) {
      console.error("Error fetching jenis hewan data:", error);
    }
  };

  const fetchRumpunHewanList = async () => {
    try {
      const result = await getRumpunHewan();
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        const rumpunHewan = content.map(({ idRumpunHewan, rumpun }) => ({
          idRumpunHewan,
          rumpun,
        }));
        setRumpunHewanList(rumpunHewan);
      }
    } catch (error) {
      console.error("Error fetching rumpun hewan data:", error);
    }
  };

  const fetchPetugasList = async () => {
    try {
      const result = await getPetugas();
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        const petugas = content.map(({ petugasId, namaPetugas }) => ({
          petugasId,
          namaPetugas,
        }));
        setPetugasList(petugas);
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
        const peternak = content.map(({ idPeternak, namaPeternak }) => ({
          idPeternak,
          namaPeternak,
        }));
        setPeternakList(peternak);
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

  const fetchTujuanPemeliharaanList = async () => {
    try {
      const result = await getTujuanPemeliharaan();
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        setTujuanPemeliharaanList(content);
      }
    } catch (error) {
      console.error("Error fetching tujuan pemeliharaan data:", error);
    }
  };

  const handleSubmit = () => {
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
      title="Tambah Data Ternak"
      visible={visible}
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
            <Form.Item label="Kode Eartag Nasional" name="kodeEartagNasional" rules={[{ required: true, message: "Masukkan Kode Eartag Nasional!" }]}>
              <Input placeholder="Masukkan kode" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item label="No Kartu Ternak" name="noKartuTernak" rules={[{ required: true, message: "Masukkan No Kartu Ternak!" }]}>
              <Input placeholder="Masukkan No Kartu Ternak" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item label="ID Isikhnas ternak" name="idIsikhnasTernak" rules={[{ required: true, message: "Masukkan ID Isikhnas ternak!" }]}>
              <Input placeholder="Masukkan ID Isikhnas ternak" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Jenis Hewan:"
              name="jenisHewanId"
              rules={[
                {
                  required: true,
                  message: "Silahkan pilih jenis hewan",
                },
              ]}
            >
              <Select placeholder="Pilih Jenis Hewan" allowClear>
                {jenisHewanList.map((jenisHewan) => (
                  <Select.Option key={jenisHewan.idJenisHewan} value={jenisHewan.idJenisHewan}>
                    {jenisHewan.jenis}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Rumpun Hewan:"
              name="rumpunHewanId"
              rules={[
                {
                  required: true,
                  message: "Silahkan pilih rumpun hewan",
                },
              ]}
            >
              <Select placeholder="Pilih Rumpun Hewan" allowClear>
                {rumpunHewanList.map((rumpunHewan) => (
                  <Select.Option key={rumpunHewan.idRumpunHewan} value={rumpunHewan.idRumpunHewan}>
                    {rumpunHewan.rumpun}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Jenis Kelamin:"
              name="sex"
              rules={[
                {
                  required: true,
                  message: "Silahkan pilih jenis kelamin hewan",
                },
              ]}
            >
              <Select placeholder="Pilih jenis kelamin" allowClear>
                <Select.Option key={1} value={"jantan"}>
                  Jantan
                </Select.Option>
                <Select.Option key={2} value={"betina"}>
                  Betina
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Tempat Lahir:"
              name="tempatLahir"
              rules={[
                {
                  required: true,
                  message: "Silahkan masukkan tempat lahir",
                },
              ]}
            >
              <Input type="text" placeholder="Masukkan Tempat Lahir" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Tanggal Lahir:"
              name="tanggalLahir"
              rules={[
                {
                  required: true,
                  message: "Silahkan pilih tanggal lahir",
                },
              ]}
            >
              <Input type="date" placeholder="Masukkan Tanggal Lahir" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item label="Nama Peternak" name="idPeternak" rules={[{ required: true, message: "Pilih Nama Peternak!" }]}>
              <Select placeholder="Pilih Nama Peternak">
                {peternakList.map((item) => (
                  <Option key={item.idPeternak} value={item.idPeternak}>
                    {item.namaPeternak}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item label="Kandang" name="idKandang" rules={[{ required: true, message: "Pilih Nama Kandang!" }]}>
              <Select placeholder="Pilih Nama Kandang">
                {kandangList.map((val) => (
                  <Option key={val.idKandang} value={val.idKandang}>
                    {val.peternak != null ? `Kandang ${val.namaKandang} (${val.peternak.namaPeternak})` : `Kandang ${val.namaKandang}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Petugas Pendaftar:"
              name="petugasId"
              rules={[
                {
                  required: true,
                  message: "Silahkan pilih petugas pendaftar",
                },
              ]}
            >
              <Select placeholder="Pilih Petugas Pendaftar">
                {petugasList.map((petugas) => (
                  <Option key={petugas.petugasId} value={petugas.petugasId}>
                    {petugas.namaPetugas}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Tujuan Pemeliharaan:"
              name="idTujuanPemeliharaan"
              rules={[
                {
                  required: true,
                  message: "Silahkan pilih tujuan pemeliharaan",
                },
              ]}
            >
              <Select placeholder="Pilih Tujuan Pemeliharaan" allowClear>
                {tujuanPemeliharaanList.map((tujuan) => (
                  <Select.Option key={tujuan.idTujuanPemeliharaan} value={tujuan.idTujuanPemeliharaan}>
                    {tujuan.tujuanPemeliharaan}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Identifikasi Hewan:"
              name="identifikasiHewan"
              rules={[
                {
                  required: true,
                  message: "Silahkan masukkan identifikasi hewan",
                },
              ]}
            >
              <Input type="text" placeholder="Masukkan identifikasi hewan" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Foto Hewan" name="file" valuePropName="fileList" getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}>
              <Upload.Dragger beforeUpload={() => false} listType="picture">
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
              </Upload.Dragger>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddHewanForm;
