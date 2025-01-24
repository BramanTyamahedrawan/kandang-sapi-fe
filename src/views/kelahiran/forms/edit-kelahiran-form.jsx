/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Row, Col } from "antd";
import { getPetugas } from "@/api/petugas";
import { getPeternaks } from "@/api/peternak";
import { getHewans } from "@/api/hewan";
import { getInseminasis } from "@/api/inseminasi";
import { getKandang } from "@/api/kandang";
import { getRumpunHewan } from "@/api/rumpunhewan";
import { getJenisHewan } from "@/api/jenishewan";

const { Option } = Select;

const EditKelahiranForm = ({
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
  const [inseminasiList, setInseminasiList] = useState([]);
  const [kandangList, setKandangList] = useState([]);
  const [rumpunHewanList, setRumpunHewanList] = useState([]);
  const [jenisHewanList, setJenisHewanList] = useState([]);

  useEffect(() => {
    fetchPetugasList();
    fetchPeternakList();
    fetchHewanList();
    fetchKandangList();
    fetchInseminasiList();
    fetchRumpunHewanList();
    fetchJenisHewanList();
    if (currentRowData) {
      form.setFieldsValue({
        idKejadian: currentRowData.idKejadian,
        tanggalLaporan: currentRowData.tanggalLaporan,
        tanggalLahir: currentRowData.tanggalLahir,
        noKartuTernakAnak: currentRowData.noKartuTernakAnak,
        eartagAnak: currentRowData.eartagAnak,
        jenisKelaminAnak: currentRowData.jenisKelaminAnak,
        idHewanAnak: currentRowData.idHewanAnak,
        jumlah: currentRowData.jumlah,
        urutanIB: currentRowData.urutanIB,
        spesies: currentRowData.spesies,
        kategori: currentRowData.kategori,
        idKandang: currentRowData.kandang?.idKandang,
        petugasId: currentRowData.petugas?.petugasId,
        idPeternak: currentRowData.peternak?.idPeternak,
        idHewan: currentRowData.hewan?.idHewan,
        idInseminasi: currentRowData.inseminasi?.idInseminasi,
        idRumpunHewan: currentRowData.rumpunHewan?.idRumpunHewan,
        idJenisHewan: currentRowData.jenisHewan?.idJenisHewan,
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
      title="Edit Kelahiran"
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
              // initialValue={currentRowData?.idKejadian}
              rules={[{ required: true, message: "Silahkan isi ID kejadian!" }]}
            >
              <Input disabled />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="tanggalLaporan"
              label="Tanggal Laporan:"
              // initialValue={currentRowData?.tanggalLaporan}
            >
              <Input type="date" placeholder="Masukkan tanggal laporan" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="tanggalLahir"
              label="Tanggal Lahir:"
              // initialValue={currentRowData?.tanggalLahir}
            >
              <Input type="date" placeholder="Masukkan tanggal lahir" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="idPeternak"
              label="Nama Peternak:"
              // initialValue={currentRowData?.peternak?.idPeternak}
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
            <Form.Item
              name="idHewan"
              label="Eartag Induk:"
              // initialValue={currentRowData?.hewan?.kodeEartagNasional}
            >
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
            <Form.Item
              name="idHewan"
              label="Kartu Ternak Induk:"
              // initialValue={currentRowData?.hewan?.noKartuTernak}
            >
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
            <Form.Item
              name="idInseminasi"
              label="ID Pejantan"
              // initialValue={currentRowData?.inseminasi?.idInseminasi}
            >
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
            <Form.Item
              name="idInseminasi"
              label="ID Inseminasi"
              // initialValue={currentRowData?.inseminasi?.idInseminasi}
            >
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
            <Form.Item
              name="idInseminasi"
              label="ID Pembuatan"
              // initialValue={currentRowData?.inseminasi?.idInseminasi}
            >
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
            <Form.Item
              name="idInseminasi"
              label="Produsen"
              // initialValue={currentRowData?.inseminasi?.idInseminasi}
            >
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
              // initialValue={currentRowData?.idHewanAnak}
              rules={[
                { required: true, message: "Silahkan isi ID Hewan Anak" },
              ]}
            >
              <Input placeholder="Masukkan ID Hewan Anak" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="noKartuTernakAnak"
              label="No Kartu Ternak Anak:"
              // initialValue={currentRowData?.noKartuTernakAnak}
            >
              <Input placeholder="Masukkan No Kartu Ternak Anak" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="eartagAnak"
              label="Eartag Anak:"
              // initialValue={currentRowData?.eartagAnak}
            >
              <Input placeholder="Masukkan Eartag" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="jenisKelaminAnak"
              label="Jenis Kelamin Anak:"
              // initialValue={currentRowData?.jenisKelaminAnak}
            >
              <Select>
                <Option value="Betina">Betina</Option>
                <Option value="Jantan">Jantan</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="idRumpunHewan"
              label="Species"
              // initialValue={currentRowData?.spesies}
            >
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
            <Form.Item name="spesies" style={{ display: "none" }}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="idJenisHewan"
              label="Kategori"
              // initialValue={currentRowData?.spesies}
            >
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
            <Form.Item name="kategori" style={{ display: "none" }}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="idKandang"
              label="Kandang"
              // initialValue={currentRowData?.kandang?.idKandang}
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
              label="Petugas Pelapor"
              name="petugasId"
              // initialValue={currentRowData?.petugas?.petugasId}
              rules={[
                { required: true, message: "Silahkan pilih Petugas Pelapor" },
              ]}
            >
              <Select placeholder="Pilih Petugas Pelapor">
                {petugasList.map(({ petugasId, namaPetugas }) => (
                  <Option key={petugasId} value={petugasId}>
                    {namaPetugas}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="jumlah"
              label="jumlah"
              // initialValue={currentRowData?.jumlah}
            >
              <Input placeholder="Masukkan Jumlah" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="urutanIB"
              label="Urutan IB"
              // initialValue={currentRowData?.urutanIB}
            >
              <Input placeholder="Masukkan Urutan IB" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EditKelahiranForm;
