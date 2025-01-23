/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback } from "react";
import { Col, Form, Input, Modal, Row, Select, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { getPeternaks } from "@/api/peternak";
import { getJenisHewan } from "../../../api/jenishewan";

const { Option } = Select;

const AddKandangForm = ({ visible, onCancel, onOk, confirmLoading }) => {
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [peternakList, setPeternakList] = useState([]);
  const [jenisHewanList, setJenisHewanList] = useState([]);
  const [mergedLocation, setMergedLocation] = useState("");

  // Fetch provinces and peternak list on mount
  useEffect(() => {
    fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
      .then((response) => response.json())
      .then(setProvinces)
      .catch((error) => console.error("Error fetching provinces:", error));

    const fetchPeternakList = async () => {
      try {
        const result = await getPeternaks();
        const { content, statusCode } = result.data;
        console.log(result);
        if (statusCode === 200) {
          const peternak = content.map((item) => ({
            idPeternak: item.idPeternak,
            namaPeternak: item.namaPeternak,
            alamat: item.alamat, // Assuming location is in "desa, kecamatan, kabupaten, provinsi"
            nik: item.nikPeternak,
          }));
          setPeternakList(peternak);
        }
      } catch (error) {
        console.error("Error fetching peternak data:", error);
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

    fetchPeternakList();
    fetchJenisHewanList();
  }, []);

  const handlePeternakChange = useCallback(
    async (value) => {
      const selectedPeternak = peternakList.find((peternak) => peternak.idPeternak === value);
      console.log("peternak: ", selectedPeternak);
      if (selectedPeternak) {
        const [desa, kecamatan, kabupaten, provinsi] = selectedPeternak.alamat.split(", ").map((item) => item.trim());

        setMergedLocation(selectedPeternak.alamat);

        // Set form fields based on location
        form.setFieldsValue({
          provinsi,
          kabupaten,
          kecamatan,
          desa,
          alamat: selectedPeternak.alamat,
        });

        // Dynamically load regions
        await loadRegions(provinsi, kabupaten, kecamatan);
      }
    },
    [peternakList, form]
  );

  const loadRegions = async (provinsi, kabupaten, kecamatan) => {
    const province = provinces.find((item) => item.name === provinsi);
    if (province) {
      const regencyResponse = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${province.id}.json`);
      const regenciesData = await regencyResponse.json();
      setRegencies(regenciesData);

      const regency = regenciesData.find((item) => item.name === kabupaten);
      if (regency) {
        const districtResponse = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${regency.id}.json`);
        const districtsData = await districtResponse.json();
        setDistricts(districtsData);

        const district = districtsData.find((item) => item.name === kecamatan);
        if (district) {
          const villageResponse = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${district.id}.json`);
          const villagesData = await villageResponse.json();
          setVillages(villagesData);
        }
      }
    }
  };

  const handleProvinceChange = async (value) => {
    const province = provinces.find((item) => item.name === value);
    if (province) {
      const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${province.id}.json`);
      const regenciesData = await response.json();
      setRegencies(regenciesData);
      setDistricts([]);
      setVillages([]);
      form.resetFields(["kabupaten", "kecamatan", "desa"]);
    }
  };

  const handleRegencyChange = async (value) => {
    const regency = regencies.find((item) => item.name === value);
    if (regency) {
      const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${regency.id}.json`);
      const districtsData = await response.json();
      setDistricts(districtsData);
      setVillages([]);
      form.resetFields(["kecamatan", "desa"]);
    }
  };

  const handleDistrictChange = async (value) => {
    const district = districts.find((item) => item.name === value);
    if (district) {
      const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${district.id}.json`);
      const villagesData = await response.json();
      setVillages(villagesData);
      form.resetFields(["desa"]);
    }
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onOk(values);
        form.resetFields();
      })
      .catch((error) => console.error("Validation failed:", error));
  };

  return (
    <Modal
      title="Tambah Data Kandang"
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
            <Form.Item label="Nama Peternak" name="idPeternak" rules={[{ required: true, message: "Pilih Nama Peternak!" }]}>
              <Select
                showSearch
                placeholder="Pilih Nama Peternak"
                optionFilterProp="label"
                onChange={handlePeternakChange}
                // options={[]}
              >
                {peternakList.map((item) => (
                  <Option key={item.idPeternak} value={item.idPeternak}>
                    {item.namaPeternak} ({item.nik})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Nama Kadang:" name="namaKandang" rules={[{ required: true, message: "Silahkan isi Nama Kandang" }]}>
              <Input placeholder="Masukkan Nama Kandang" />
            </Form.Item>
          </Col>

          <Col span={12}>
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

          <Col span={12}>
            <Form.Item label="Nilai Bangunan:" name="nilaiBangunan" rules={[{ required: true, message: "Silahkan isi Nilai Bangunan" }]}>
              <Input placeholder="Masukkan Nilai Bangunan" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Luas Kandang:" name="luas" rules={[{ required: true, message: "Silahkan isi luas" }]}>
              <Input placeholder="Masukkan luas kandang" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Kapasitas Kandang:" name="kapasitas" rules={[{ required: true, message: "Silahkan isi kapasitas" }]}>
              <Input placeholder="Masukkan kapasitas kandang" />
            </Form.Item>
          </Col>

          <Col span={12}>
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

          <Col span={12}>
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

          <Col span={12}>
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

          <Col span={12}>
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

          <Col span={12}>
            <Form.Item label="Desa" name="desa">
              <Select placeholder="Pilih Desa">
                {villages.map((item) => (
                  <Option key={item.id} value={item.name}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Alamat" name="alamat">
              <Input value={mergedLocation} readOnly placeholder="Alamat akan terisi otomatis" />
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

          <Col span={24}>
            <Form.Item label="Foto Kandang" name="file" valuePropName="fileList" getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}>
              <Upload.Dragger
                beforeUpload={() => false}
                listType="picture"
                maxCount={1} // Hanya izinkan satu file
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">Support for a single or bulk upload.</p>
              </Upload.Dragger>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddKandangForm;
