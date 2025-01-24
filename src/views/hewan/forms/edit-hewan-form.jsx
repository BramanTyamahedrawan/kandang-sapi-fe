/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Row, Col, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { getPetugas } from "@/api/petugas";
import { getPeternaks } from "@/api/peternak";
import { getKandang } from "@/api/kandang";
import { getJenisHewan } from "@/api/jenishewan";
import { getRumpunHewan } from "@/api/rumpunhewan";
import { getTujuanPemeliharaan } from "@/api/tujuan-pemeliharaan";
const { Option } = Select;

const EditHewanForm = ({ visible, onCancel, onOk, confirmLoading, currentRowData }) => {
  const [form] = Form.useForm();
  const [peternakList, setPeternakList] = useState([]);
  const [petugasList, setPetugasList] = useState([]);
  const [kandangList, setKandangList] = useState([]);
  const [tujuanPemeliharaanList, setTujuanPemeliharaanList] = useState([]);
  const [rumpunHewanList, setRumpunHewanList] = useState([]);
  const [jenisHewanList, setJenisHewanList] = useState([]);

  useEffect(() => {
    fetchJenisHewanList();
    fetchPeternakList();
    fetchPetugasList();
    fetchKandangList();
    fetchTujuanPemeliharaanList();
    fetchRumpunHewanList();
  }, []);

  useEffect(() => {
    if (currentRowData) {
      console.log("Current", currentRowData);
      form.setFieldsValue({
        idPeternak: currentRowData.peternak?.idPeternak,
        jenisHewanId: currentRowData.jenisHewan?.idJenisHewan,
        petugasId: currentRowData.petugas?.petugasId,
        idKandang: currentRowData.kandang?.idKandang,
        rumpunHewanId: currentRowData.rumpunHewan?.idRumpunHewan,
        idTujuanPemeliharaan: currentRowData.tujuanPemeliharaan?.idTujuanPemeliharaan,
        namaKandang: currentRowData.kandang?.namaKandang,
        sex: currentRowData.sex,
        identifikasiHewan: currentRowData.identifikasiHewan,
        tanggalLahir: currentRowData.tanggalLahir,
        tempatLahir: currentRowData.tempatLahir,
        idIsikhnasTernak: currentRowData.idIsikhnasTernak,
        kodeEartagNasional: currentRowData.kodeEartagNasional,
        noKartuTernak: currentRowData.noKartuTernak,
      });
    }
  }, [currentRowData, form]);

  const fetchPeternakList = async () => {
    try {
      const result = await getPeternaks();
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        setPeternakList(
          content.map(({ idPeternak, namaPeternak }) => ({
            idPeternak,
            namaPeternak,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching peternak data:", error);
    }
  };

  const fetchPetugasList = async () => {
    try {
      const result = await getPetugas();
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        setPetugasList(
          content.map(({ petugasId, namaPetugas }) => ({
            petugasId,
            namaPetugas,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching petugas data:", error);
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
    } catch (e) {
      console.log("Error fetching tujuan pemeliharaan : ", e);
    }
  };

  const fetchRumpunHewanList = async () => {
    try {
      const result = await getRumpunHewan();
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        setRumpunHewanList(content);
      }
    } catch (e) {
      console.log("Error fetching rumpun : ", e);
    }
  };

  const fetchJenisHewanList = async () => {
    try {
      const result = await getJenisHewan();
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        setJenisHewanList(content);
      }
    } catch (e) {
      console.log("Error fetching jenis : ", e);
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
      title="Edit Hewan"
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
          <Col span={12}>
            <Form.Item label="Kode Eartag Nasional" name="kodeEartagNasional" rules={[{ required: true, message: "Masukkan Kode Eartag Nasional!" }]}>
              <Input placeholder="Masukkan kode" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="No Kartu Ternak" name="noKartuTernak" rules={[{ required: true, message: "Masukkan No Kartu Ternak!" }]}>
              <Input placeholder="Masukkan No Kartu Ternak" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="ID Isikhnas ternak" name="idIsikhnasTernak" rules={[{ required: true, message: "Masukkan ID Isikhnas ternak!" }]}>
              <Input placeholder="Masukkan ID Isikhnas ternak" />
            </Form.Item>
          </Col>
          <Col span={12}>
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
          <Col span={12}>
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
          <Col span={12}>
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
          <Col span={12}>
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
          <Col span={12}>
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
          <Col span={12}>
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
          <Col span={12}>
            <Form.Item label="Kandang" name="idKandang" rules={[{ required: true, message: "Pilih Nama Kandang!" }]}>
              <Select placeholder="Pilih Nama Kandang">
                {kandangList.map((val) => (
                  <Option key={val.idKandang} value={val.idKandang}>
                    {val.peternak != null ? `${val.namaKandang} (${val.peternak.namaPeternak})` : `Kandang ${val.namaKandang}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
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
          <Col span={12}>
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

export default EditHewanForm;
