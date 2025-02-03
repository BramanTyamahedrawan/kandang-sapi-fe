/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Form, Input, Modal, Upload, Select, Row, Col } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { getPeternaks } from "@/api/peternak";
import { getJenisHewan } from "@/api/jenishewan";
const { Option } = Select;

const EditKandangForm = ({ visible, onCancel, onOk, confirmLoading, currentRowData }) => {
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [peternakList, setPeternakList] = useState([]);
  const [jenisHewanList, setJenisHewanList] = useState([]);

  useEffect(() => {
    fetchProvinces();
    fetchPeternakList();
    fetchJenisHewanList();
  }, []);

  // Inisialisasi form ketika currentRowData berubah
  useEffect(() => {
    if (currentRowData && currentRowData.alamat) {
      console.log("currentRowData in EditPeternakForm:", currentRowData);
      initializeForm(currentRowData.alamat);
    }
  }, [currentRowData, provinces]);

  // Fungsi untuk mengambil daftar provinsi
  const fetchProvinces = async () => {
    try {
      const response = await fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json");
      const data = await response.json();
      setProvinces(data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
      message.error("Gagal mengambil data provinsi.");
    }
  };

  // Fungsi untuk mengambil daftar petugas
  const fetchPeternakList = async () => {
    try {
      const result = await getPeternaks(); // Mengambil data petugas dari server
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        const list = content.map((peternak) => ({
          idPeternak: peternak.idPeternak,
          namaPeternak: peternak.namaPeternak,
        }));
        setPeternakList(list);
      } else {
        message.error("Gagal mengambil data peternak.");
      }
    } catch (error) {
      console.error("Error fetching peternak data:", error);
      message.error("Terjadi kesalahan saat mengambil data peternak.");
    }
  };

  const fetchJenisHewanList = async () => {
    try {
      const result = await getJenisHewan();
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        const jenisHewan = content.map((item) => ({
          idJenisHewan: item.idJenisHewan,
          jenis: item.jenis,
        }));
        setJenisHewanList(jenisHewan);
      }
    } catch (error) {
      console.error("Error fetching peternak data:", error);
    }
  };

  // Fungsi untuk menginisialisasi form berdasarkan alamat
  const initializeForm = async (alamat) => {
    const [village, district, regency, province] = alamat.split(", ").map((item) => item.trim());

    form.setFieldsValue({
      provinsi: province,
      kabupaten: regency,
      kecamatan: district,
      desa: village,
      alamat: alamat,
      idKandang: currentRowData.idKandang,
      namaKandang: currentRowData.namaKandang,
      idPeternak: currentRowData.peternak?.idPeternak,
      idJenisHewan: currentRowData.jenisHewan?.idJenisHewan,
      jenis: currentRowData.jenis,
      namaPeternak: currentRowData.namaPeternak,
      nikPeternak: currentRowData.nikPeternak,
      luas: currentRowData.luas,
      kapasitas: currentRowData.kapasitas,
      nilaiBangunan: currentRowData.nilaiBangunan,
      jenisKandang: currentRowData.jenisKandang,
      latitude: currentRowData.latitude,
      longitude: currentRowData.longitude,
    });

    // Load regencies, districts, villages berdasarkan lokasi
    await loadRegencies(province);
    await loadDistricts(regency);
    await loadVillages(district);
  };

  // Fungsi untuk memuat kabupaten berdasarkan provinsi
  const loadRegencies = async (province) => {
    const selectedProvince = provinces.find((prov) => prov.name === province);
    if (selectedProvince) {
      try {
        const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvince.id}.json`);
        const data = await response.json();
        setRegencies(data);
      } catch (error) {
        console.error("Error fetching regencies:", error);
        message.error("Gagal mengambil data kabupaten.");
      }
    }
  };

  // Fungsi untuk memuat kecamatan berdasarkan kabupaten
  const loadDistricts = async (regency) => {
    const selectedRegency = regencies.find((reg) => reg.name === regency);
    if (selectedRegency) {
      try {
        const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selectedRegency.id}.json`);
        const data = await response.json();
        setDistricts(data);
      } catch (error) {
        console.error("Error fetching districts:", error);
        message.error("Gagal mengambil data kecamatan.");
      }
    }
  };

  // Fungsi untuk memuat desa berdasarkan kecamatan
  const loadVillages = async (district) => {
    const selectedDistrict = districts.find((dist) => dist.name === district);
    if (selectedDistrict) {
      try {
        const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${selectedDistrict.id}.json`);
        const data = await response.json();
        setVillages(data);
      } catch (error) {
        console.error("Error fetching villages:", error);
        message.error("Gagal mengambil data desa.");
      }
    }
  };

  // Handler perubahan provinsi
  const handleProvinceChange = async (value) => {
    const selectedProvince = provinces.find((province) => province.name === value);

    if (selectedProvince) {
      try {
        const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvince.id}.json`);
        const data = await response.json();
        setRegencies(data);
        setDistricts([]);
        setVillages([]);
        form.setFieldsValue({
          kabupaten: undefined,
          kecamatan: undefined,
          desa: undefined,
          alamat: undefined,
        });
      } catch (error) {
        console.error("Error fetching regencies:", error);
        message.error("Gagal mengambil data kabupaten.");
      }
    }
  };

  // Handler perubahan kabupaten
  const handleRegencyChange = async (value) => {
    const selectedRegency = regencies.find((regency) => regency.name === value);

    if (selectedRegency) {
      try {
        const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selectedRegency.id}.json`);
        const data = await response.json();
        setDistricts(data);
        setVillages([]);
        form.setFieldsValue({
          kecamatan: undefined,
          desa: undefined,
          alamat: undefined,
        });
      } catch (error) {
        console.error("Error fetching districts:", error);
        message.error("Gagal mengambil data kecamatan.");
      }
    }
  };

  // Handler perubahan kecamatan
  const handleDistrictChange = async (value) => {
    const selectedDistrict = districts.find((district) => district.name === value);

    if (selectedDistrict) {
      try {
        const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${selectedDistrict.id}.json`);
        const data = await response.json();
        setVillages(data);
        form.setFieldsValue({
          desa: undefined,
          alamat: undefined,
        });
      } catch (error) {
        console.error("Error fetching villages:", error);
        message.error("Gagal mengambil data desa.");
      }
    }
  };

  // Handler perubahan desa
  const handleVillageChange = (value) => {
    const selectedProvince = provinces.find((province) => province.name === form.getFieldValue("provinsi"));
    const selectedRegency = regencies.find((regency) => regency.name === form.getFieldValue("kabupaten"));
    const selectedDistrict = districts.find((district) => district.name === form.getFieldValue("kecamatan"));
    const selectedVillage = villages.find((village) => village.name === value);

    if (selectedProvince && selectedRegency && selectedDistrict && selectedVillage) {
      const mergedLocation = `${selectedVillage.name}, ${selectedDistrict.name}, ${selectedRegency.name}, ${selectedProvince.name}`;
      form.setFieldsValue({
        alamat: mergedLocation,
      });
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
      title="Edit Data Ternak"
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
            <Form.Item label="Nama Kadang:" name="namaKandang" rules={[{ required: true, message: "Silahkan isi Nama Kandang" }]}>
              <Input placeholder="Masukkan Nama Kandang" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item label="Jenis Hewan:" name="idJenisHewan" rules={[{ required: true, message: "Pilih Jenis Hewan!" }]}>
              <Select
                showSearch
                placeholder="Pilih Jenis Hewan"
                optionFilterProp="label"
                // options={[]}
              >
                {jenisHewanList.map((item) => (
                  <Option key={item.idJenisHewan} value={item.idJenisHewan}>
                    {item.jenis}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item label="Jenis Kandang" name="jenisKandang" rules={[{ required: true, message: "Pilih Jenis Kandang!" }]}>
              <Select placeholder="Pilih Jenis Kandang">
                <Select.Option key="1" value="permanen">
                  Permanen
                </Select.Option>
                <Select.Option key="2" value="semi permanen">
                  Semi Permanen
                </Select.Option>
                <Select.Option key="3" value="tidak permanen">
                  Tidak Permanen
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item label="Luas Kandang" name="luas">
              <Input placeholder="Masukkan Luas Kandang" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item label="Kapasitas Kandang" name="kapasitas">
              <Input placeholder="Masukkan Kapasitas Kandang" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item label="Nilai Bangunan" name="nilaiBangunan">
              <Input placeholder="Masukkan Nilai Bangunan" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item label="Provinsi" name="provinsi">
              <Select placeholder="Pilih Provinsi" onChange={handleProvinceChange}>
                {provinces.map((item) => (
                  <Option key={item.id} value={item.name}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item label="Kabupaten" name="kabupaten">
              <Select placeholder="Pilih Kabupaten" onChange={handleRegencyChange}>
                {regencies.map((item) => (
                  <Option key={item.id} value={item.name}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item label="Kecamatan" name="kecamatan">
              <Select placeholder="Pilih Kecamatan" onChange={handleDistrictChange}>
                {districts.map((item) => (
                  <Option key={item.id} value={item.name}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item label="Desa" name="desa">
              <Select placeholder="Pilih Desa" onChange={handleVillageChange} allowClear disabled={!villages.length}>
                {villages.map((item) => (
                  <Option key={item.id} value={item.name}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item label="Alamat:" name="alamat" rules={[{ required: true, message: "Silahkan isi alamat" }]}>
              <Input placeholder="Alamat akan terisi otomatis" readOnly />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Latitude:"
              name="latitude"
              rules={[
                { required: true, message: "Silahkan isi latitude" },
                {
                  pattern: /^-?\d+(\.\d+)?$/,
                  message: "Latitude harus berupa angka",
                },
              ]}
            >
              <Input placeholder="Masukkan Latitude" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Longitude:"
              name="longitude"
              rules={[
                { required: true, message: "Silahkan isi longitude" },
                {
                  pattern: /^-?\d+(\.\d+)?$/,
                  message: "Longitude harus berupa angka",
                },
              ]}
            >
              <Input placeholder="Masukkan Longitude" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Foto Kandang" name="file" valuePropName="fileList" getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}>
              <Upload.Dragger beforeUpload={() => false} listType="picture" maxCount={1}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Klik atau seret file untuk mengunggah</p>
                <p className="ant-upload-hint">Mendukung unggahan tunggal atau beberapa file.</p>
              </Upload.Dragger>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EditKandangForm;
