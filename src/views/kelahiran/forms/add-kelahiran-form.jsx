/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Row, Col } from "antd";
import { getPetugas } from "@/api/petugas";
import { getPeternaks } from "@/api/peternak";
import { getHewans } from "@/api/hewan";
import { getInseminasis } from "@/api/inseminasi";
import { getKandang } from "@/api/kandang";
import { getRumpunHewan } from "@/api/rumpunhewan";
import { getJenisHewan } from "@/api/jenishewan";

const { Option } = Select;

const AddKelahiranForm = ({ visible, onCancel, onOk, confirmLoading }) => {
  const [form] = Form.useForm();
  const [petugasList, setPetugasList] = useState([]);
  const [peternakList, setPeternakList] = useState([]);
  const [hewanList, setHewanList] = useState([]);
  const [inseminasiList, setInseminasiList] = useState([]);
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
    fetchInseminasiList();
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

  const fetchInseminasiList = async () => {
    try {
      const result = await getInseminasis();
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        setInseminasiList(content);
      }
    } catch (error) {
      console.error("Error fetching inseminasi data:", error);
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
      title="Tambah Kelahiran"
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
            <Form.Item
              name="idKejadian"
              label="ID Kejadian:"
              rules={[{ required: true, message: "Silahkan isi ID kejadian!" }]}
            >
              <Input placeholder="Masukkan ID kejadian" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="tanggalLaporan" label="Tanggal Laporan:">
              <Input type="date" placeholder="Masukkan tanggal laporan" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="tanggalLahir" label="Tanggal Lahir:">
              <Input type="date" placeholder="Masukkan tanggal lahir" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="idPeternak"
              label="Nama Peternak:"
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
            <Form.Item name="idHewan" label="Eartag Induk:">
              <Select placeholder="Pilih Kode Ternak Induk">
                {hewanList.map(({ idHewan, kodeEartagNasional }) => (
                  <Option key={idHewan} value={idHewan}>
                    {kodeEartagNasional}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="idHewan" label="Kartu Ternak Induk:">
              <Select placeholder="PilihKartu Ternak Induk">
                {hewanList.map(({ idHewan, noKartuTernak }) => (
                  <Option key={idHewan} value={idHewan}>
                    {noKartuTernak}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="idInseminasi" label="ID Pejantan">
              <Select placeholder="Pilih Inseminasi" allowClear>
                {inseminasiList.map(({ idInseminasi, idPejantan }) => (
                  <Option key={idInseminasi} value={idInseminasi}>
                    {idPejantan}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="idInseminasi" label="ID Inseminasi">
              <Select placeholder="Pilih Inseminasi" allowClear>
                {inseminasiList.map(({ idInseminasi, bangsaPejantan }) => (
                  <Option key={idInseminasi} value={idInseminasi}>
                    {bangsaPejantan}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="idInseminasi" label="ID Pembuatan">
              <Select placeholder="Pilih Inseminasi" allowClear>
                {inseminasiList.map(({ idInseminasi, idPembuatan }) => (
                  <Option key={idInseminasi} value={idInseminasi}>
                    {idPembuatan}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="idInseminasi" label="Produsen">
              <Select placeholder="Pilih Inseminasi" allowClear>
                {inseminasiList.map(({ idInseminasi, produsen }) => (
                  <Option key={idInseminasi} value={idInseminasi}>
                    {produsen}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="idHewanAnak"
              label="ID Hewan Anak:"
              rules={[
                { required: true, message: "Silahkan isi ID Hewan Anak" },
              ]}
            >
              <Input placeholder="Masukkan ID Hewan Anak" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="noKartuTernakAnak" label="No Kartu Ternak Anak:">
              <Input placeholder="Masukkan No Kartu Ternak Anak" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="eartagAnak" label="Eartag Anak:">
              <Input placeholder="Masukkan Eartag" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="jenisKelaminAnak"
              label="Jenis Kelamin Anak:"
              rules={[
                { required: true, message: "Silahkan isi Jenis Kelamin Anak" },
              ]}
            >
              <Select placeholder="Pilih Jenis Kelamin Anak">
                <Option value="Betina">Betina</Option>
                <Option value="Jantan">Jantan</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="idRumpunHewan" label="Species">
              <Select
                placeholder="Pilih Spesies"
                onChange={(value) => {
                  const selectedRumpun = rumpunHewanList.find(
                    (rumpunHewan) => rumpunHewan.idRumpunHewan === value
                  );
                  if (selectedRumpun) {
                    form.setFieldsValue({
                      spesies: selectedRumpun.rumpun,
                    });
                  }
                }}
              >
                {rumpunHewanList.map((rumpunHewan) => (
                  <Select.Option
                    key={rumpunHewan.idRumpunHewan}
                    value={rumpunHewan.idRumpunHewan}
                  >
                    {rumpunHewan.rumpun}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="idJenisHewan" label="Kategori">
              <Select
                placeholder="Pilih Kategori"
                onChange={(value) => {
                  const selectedJenis = jenisHewanList.find(
                    (jenisHewan) => jenisHewan.idJenisHewan === value
                  );
                  if (selectedJenis) {
                    form.setFieldsValue({
                      kategori: selectedJenis.jenis,
                    });
                  }
                }}
              >
                {jenisHewanList.map((jenisHewan) => (
                  <Select.Option
                    key={jenisHewan.idJenisHewan}
                    value={jenisHewan.idJenisHewan}
                  >
                    {jenisHewan.jenis}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="idKandang"
              label="Kandang"
              rules={[{ required: true, message: "Silahkan isi ID Kandang" }]}
            >
              <Select placeholder="Pilih ID Kandang">
                {kandangList.map(({ idKandang, namaKandang }) => (
                  <Option key={idKandang} value={idKandang}>
                    {namaKandang}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="petugasId"
              label="Petugas Pelapor:"
              rules={[{ required: true, message: "Silahkan isi Inseminator" }]}
            >
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
            <Form.Item name="jumlah" label="jumlah">
              <Input placeholder="Masukkan Jumlah" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="urutanIB" label="Urutan IB">
              <Input placeholder="Masukkan Urutan IB" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddKelahiranForm;
