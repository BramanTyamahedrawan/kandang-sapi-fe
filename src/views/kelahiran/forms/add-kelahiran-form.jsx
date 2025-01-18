/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Modal, Form, Input, Select } from "antd";
import { getPetugas } from "@/api/petugas";
import { getPeternaks } from "@/api/peternak";
import { getHewans } from "@/api/hewan";
import { getInseminasis } from "@/api/inseminasi";
import { getKandang } from "@/api/kandang";

const { Option } = Select;

const AddKelahiranForm = ({ visible, onCancel, onOk, confirmLoading }) => {
  const [form] = Form.useForm();
  const [petugasList, setPetugasList] = useState([]);
  const [peternakList, setPeternakList] = useState([]);
  const [hewanList, setHewanList] = useState([]);
  const [inseminasiList, setInseminasiList] = useState([]);
  const [kandangList, setKandangList] = useState([]);

  useEffect(() => {
    fetchPetugasList();
    fetchPeternakList();
    fetchHewanList();
    fetchKandangList();
    fetchInseminasiList();
  }, []);

  const fetchPetugasList = async () => {
    try {
      const result = await getPetugas();
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        setPetugasList(
          content.map(({ nikPetugas, namaPetugas }) => ({
            nikPetugas,
            namaPetugas,
          }))
        );
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
        setHewanList(content.map((hewan) => hewan.kodeEartagNasional));
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

  const fetchKandangList = async () => {
    try {
      const result = await getKandang();
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        setKandangList(content.map(({ idKandang }) => idKandang));
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
        setInseminasiList(content.map(({ idInseminasi }) => idInseminasi));
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
      visible={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleSubmit}
      confirmLoading={confirmLoading}
      width={700}
      okText="Simpan"
    >
      <Form form={form} layout="vertical">
        <Form.Item name="idKejadian" label="ID Kejadian:">
          <Input placeholder="Masukkan ID kejadian" />
        </Form.Item>
        <Form.Item name="tanggalLaporan" label="Tanggal Laporan:">
          <Input type="date" placeholder="Masukkan tanggal laporan" />
        </Form.Item>
        <Form.Item name="tanggalLahir" label="Tanggal Lahir:">
          <Input type="date" placeholder="Masukkan tanggal lahir" />
        </Form.Item>
        <Form.Item name="peternak_id" label="Nama Peternak:" rules={[{ required: true, message: "Silahkan isi nama peternak!" }]}>
          <Select placeholder="Pilih Nama Peternak">
            {peternakList.map(({ idPeternak, namaPeternak }) => (
              <Option key={idPeternak} value={idPeternak}>
                {namaPeternak}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="hewan_id" label="Eartag Induk:" rules={[{ required: true, message: "Silahkan isi ID Hewan" }]}>
          <Select placeholder="Pilih ID Hewan">
            {hewanList.map((eartag) => (
              <Option key={eartag} value={eartag}>
                {eartag}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="inseminasi_id" label="ID Inseminasi:" rules={[{ required: true, message: "Silahkan isi inseminasi" }]}>
          <Select placeholder="Pilih Inseminasi">
            {inseminasiList.map((idInseminasi) => (
              <Option key={idInseminasi} value={idInseminasi}>
                {idInseminasi}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="eartagAnak" label="Eartag Anak:">
          <Input placeholder="Masukkan Eartag" />
        </Form.Item>
        <Form.Item name="jenisKelaminAnak" label="Jenis Kelamin Anak:" initialValue="Betina">
          <Select>
            <Option value="Betina">Betina</Option>
            <Option value="Jantan">Jantan</Option>
          </Select>
        </Form.Item>
        <Form.Item name="spesies" label="Spesies Anak:" initialValue="Sapi Limosin">
          <Select>
            <Option value="Sapi Limosin">Sapi Limosin</Option>
            <Option value="Sapi Simental">Sapi Simental</Option>
            <Option value="Sapi FH">Sapi FH</Option>
            <Option value="Sapi PO">Sapi PO</Option>
            <Option value="Sapi Brangus">Sapi Brangus</Option>
          </Select>
        </Form.Item>
        <Form.Item name="kandang_id" label="Kandang Anak:" rules={[{ required: true, message: "Silahkan isi ID Kandang" }]}>
          <Select placeholder="Pilih ID Kandang">
            {kandangList.map((idKandang) => (
              <Option key={idKandang} value={idKandang}>
                {idKandang}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="petugas_id" label="Petugas Pelapor:" rules={[{ required: true, message: "Silahkan isi Inseminator" }]}>
          <Select placeholder="Pilih Petugas">
            {petugasList.map(({ nikPetugas, namaPetugas }) => (
              <Option key={nikPetugas} value={nikPetugas}>
                {namaPetugas}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddKelahiranForm;
