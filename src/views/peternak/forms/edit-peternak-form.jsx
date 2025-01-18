/* eslint-disable react/prop-types */
/**
 * eslint-disable react/prop-types
 *
 * @format
 */

import { getPetugas } from "@/api/petugas"; // Import fungsi API untuk mengambil data petugas
import { Col, Form, Input, Modal, Row, Select, message } from "antd";
import { useEffect, useState } from "react";

const { Option } = Select;

const EditPeternakForm = ({ visible, onCancel, onOk, confirmLoading, currentRowData }) => {
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [petugasList, setPetugasList] = useState([]);

  // Fetch provinces and petugas list saat komponen di-mount
  useEffect(() => {
    fetchProvinces();
    fetchPetugasList();
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
  const fetchPetugasList = async () => {
    try {
      const result = await getPetugas(); // Mengambil data petugas dari server
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        const list = content.map((petugas) => ({
          petugasId: petugas.petugasId,
          namaPetugas: petugas.namaPetugas,
        }));
        setPetugasList(list);
      } else {
        message.error("Gagal mengambil data petugas.");
      }
    } catch (error) {
      console.error("Error fetching petugas data:", error);
      message.error("Terjadi kesalahan saat mengambil data petugas.");
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
      lokasi: currentRowData.lokasi,
      // Set nilai-nilai lainnya jika diperlukan
      idPeternak: currentRowData.idPeternak,
      idIsikhnas: currentRowData.idIsikhnas,
      namaPeternak: currentRowData.namaPeternak,
      nikPeternak: currentRowData.nikPeternak,
      noTelepon: currentRowData.noTelepon,
      email: currentRowData.email,
      jenisKelamin: currentRowData.jenisKelamin,
      tanggalLahir: currentRowData.tanggalLahir,
      dusun: currentRowData.dusun,
      latitude: currentRowData.latitude,
      longitude: currentRowData.longitude,
      petugasId: currentRowData.petugas?.petugasId,
      tanggalPendaftaran: currentRowData.tanggalPendaftaran,
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

  // Handler saat modal OK ditekan
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onOk(values, form);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Modal title="Edit Peternak" visible={visible} onCancel={onCancel} onOk={handleOk} confirmLoading={confirmLoading} width={1000} okText="Simpan">
      <Form
        form={form}
        name="edit_peternak_form"
        layout="vertical"
        initialValues={{
          idPeternak: currentRowData?.idPeternak,
          idIsikhnas: currentRowData?.idIsikhnas,
          namaPeternak: currentRowData?.namaPeternak,
          nikPeternak: currentRowData?.nikPeternak,
          noTelepon: currentRowData?.noTelepon,
          email: currentRowData?.email,
          jenisKelamin: currentRowData?.jenisKelamin,
          tanggalLahir: currentRowData?.tanggalLahir,
          dusun: currentRowData?.dusun,
          lokasi: currentRowData?.lokasi,
          latitude: currentRowData?.latitude,
          longitude: currentRowData?.longitude,
          petugasId: currentRowData.petugas?.petugasId,
          tanggalPendaftaran: currentRowData?.tanggalPendaftaran,
        }}
        autoComplete="off"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="ID Isikhnas:"
              name="idIsikhnas"
              rules={[
                {
                  required: true,
                  message: "Silahkan isi ID Isikhnas Peternak",
                },
              ]}
            >
              <Input placeholder="Masukkan ID Isikhnas Peternak" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Nama Peternak:" name="namaPeternak" rules={[{ required: true, message: "Silahkan isi nama peternak" }]}>
              <Input placeholder="Masukkan Nama Peternak" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="NIK Peternak:" name="nikPeternak" rules={[{ required: true, message: "Silahkan isi NIK Peternak" }]}>
              <Input placeholder="Masukkan NIK Peternak" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="No. Telepon:"
              name="noTelepon"
              rules={[
                {
                  required: true,
                  message: "Silahkan isi No. Telepon Peternak",
                },
              ]}
            >
              <Input placeholder="Masukkan No. Telepon Peternak" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Email:"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Silahkan isi Email Peternak",
                },
              ]}
            >
              <Input placeholder="Masukkan Email Peternak" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Jenis Kelamin:"
              name="jenisKelamin"
              rules={[
                {
                  required: true,
                  message: "Silahkan isi Jenis Kelamin Peternak",
                },
              ]}
            >
              <Select placeholder="Pilih jenis kelamin">
                <Select.Option key={1} value={"laki-laki"}>
                  Laki-laki
                </Select.Option>
                <Select.Option key={2} value={"Perempuan"}>
                  Perempuan
                </Select.Option>
              </Select>
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
            <Form.Item label="Provinsi:" name="provinsi" rules={[{ required: true, message: "Silahkan pilih provinsi" }]}>
              <Select placeholder="Pilih Provinsi" onChange={handleProvinceChange} allowClear>
                {provinces.map((province) => (
                  <Option key={province.id} value={province.name}>
                    {province.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Kabupaten:" name="kabupaten" rules={[{ required: true, message: "Silahkan pilih kabupaten" }]}>
              <Select placeholder="Pilih Kabupaten" onChange={handleRegencyChange} allowClear disabled={!regencies.length}>
                {regencies.map((regency) => (
                  <Option key={regency.id} value={regency.name}>
                    {regency.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Kecamatan:" name="kecamatan" rules={[{ required: true, message: "Silahkan pilih kecamatan" }]}>
              <Select placeholder="Pilih Kecamatan" onChange={handleDistrictChange} allowClear disabled={!districts.length}>
                {districts.map((district) => (
                  <Option key={district.id} value={district.name}>
                    {district.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Desa:" name="desa" rules={[{ required: true, message: "Silahkan pilih desa" }]}>
              <Select placeholder="Pilih Desa" onChange={handleVillageChange} allowClear disabled={!villages.length}>
                {villages.map((village) => (
                  <Option key={village.id} value={village.name}>
                    {village.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Dusun:" name="dusun" rules={[{ required: true, message: "Silahkan isi dusun" }]}>
              <Input placeholder="Masukkan dusun" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Alamat:" name="alamat" rules={[{ required: true, message: "Silahkan isi alamat" }]}>
              <Input placeholder="Alamat akan terisi otomatis" readOnly />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Lokasi:" name="lokasi" rules={[{ required: true, message: "Silahkan isi lokasi" }]}>
              <Input placeholder="Masukan Lokasi" />
            </Form.Item>
          </Col>
          <Col span={12}>
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
          <Col span={12}>
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
              <Select placeholder="Pilih Petugas Pendaftar" allowClear>
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
              label="Tanggal Pendaftaran:"
              name="tanggalPendaftaran"
              rules={[
                {
                  required: true,
                  message: "Silahkan pilih tanggal pendaftaran",
                },
              ]}
            >
              <Input type="date" placeholder="Masukkan Tanggal Pendaftaran" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EditPeternakForm;
