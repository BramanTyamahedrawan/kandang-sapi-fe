/* eslint-disable no-unused-vars */
import { addJenisHewanBulk } from "@/api/jenisHewan";
import { addKandangBulk } from "@/api/kandang";
import { addPeternakBulk } from "@/api/peternak";
import { addPetugasBulk } from "@/api/petugas";
import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Modal, Upload } from "antd";
import React, { Component } from "react";
import { v4 as uuidv4 } from "uuid";
import { read, utils } from "xlsx";

// import { addPeternakBulk } from "@/api/peternak";
// import { addPetugasBulk } from "@/api/petugas";
export const sendPetugasBulkData = async (data, batchSize = 100) => {
  const totalBatches = Math.ceil(data.length / batchSize);

  for (let i = 0; i < totalBatches; i++) {
    const batchData = data.slice(i * batchSize, (i + 1) * batchSize);

    try {
      console.log(`Data Petugas (Batch ${i + 1}):`, batchData); // Log data yang dikirim
      const response = await addPetugasBulk(batchData);
      console.log(
        `Batch ${i + 1}/${totalBatches} berhasil dikirim`,
        response.data
      );
    } catch (error) {
      console.error(
        `Batch ${i + 1}/${totalBatches} gagal dikirim`,
        error.response?.data || error.message
      );
      throw error; // Hentikan proses jika batch gagal
    }
  }
};

export const sendPeternakBulkData = async (data, batchSize = 100) => {
  const totalBatches = Math.ceil(data.length / batchSize);

  for (let i = 0; i < totalBatches; i++) {
    const batchData = data.slice(i * batchSize, (i + 1) * batchSize);

    try {
      console.log(`Data Peternak (Batch ${i + 1}):`, batchData); // Log data yang dikirim
      const response = await addPeternakBulk(batchData);
      console.log(
        `Batch ${i + 1}/${totalBatches} berhasil dikirim`,
        response.data
      );
    } catch (error) {
      console.error(
        `Batch ${i + 1}/${totalBatches} gagal dikirim`,
        error.response?.data || error.message
      );
      throw error; // Hentikan proses jika batch gagal
    }
  }
};

const sendKandangBulkData = async (data, batchSize = 100) => {
  const totalBatches = Math.ceil(data.length / batchSize);

  for (let i = 0; i < totalBatches; i++) {
    const batchData = data.slice(i * batchSize, (i + 1) * batchSize);

    try {
      console.log(`Data Kandang (Batch ${i + 1}):`, batchData); // Log data yang dikirim
      const response = await addKandangBulk(batchData);
      console.log(
        `Batch ${i + 1}/${totalBatches} berhasil dikirim`,
        response.data
      );
    } catch (error) {
      console.error(
        `Batch ${i + 1}/${totalBatches} gagal dikirim`,
        error.response?.data || error.message
      );
      throw error; // Hentikan proses jika batch gagal
    }
  }
};

const sendJenisHewanBulkData = async (data, batchSize = 100) => {
  const totalBatches = Math.ceil(data.length / batchSize);

  for (let i = 0; i < totalBatches; i++) {
    const batchData = data.slice(i * batchSize, (i + 1) * batchSize);

    try {
      console.log(`Data Jenis Hewan (Batch ${i + 1}):`, batchData); // Log data yang dikirim
      const response = await addJenisHewanBulk(batchData);
      console.log(
        `Batch ${i + 1}/${totalBatches} berhasil dikirim`,
        response.data
      );
    } catch (error) {
      console.error(
        `Batch ${i + 1}/${totalBatches} gagal dikirim`,
        error.response?.data || error.message
      );
      throw error; // Hentikan proses jika batch gagal
    }
  }
};

const sendRumpunHewanBulkData = async (data, batchSize = 100) => {
  const totalBatches = Math.ceil(data.length / batchSize);

  for (let i = 0; i < totalBatches; i++) {
    const batchData = data.slice(i * batchSize, (i + 1) * batchSize);

    try {
      console.log(`Data Rumpun Hewan (Batch ${i + 1}):`, batchData); // Log data yang dikirim
      // const response = await addRumpunHewanBulk(batchData);
      // console.log(
      //   `Batch ${i + 1}/${totalBatches} berhasil dikirim`,
      //   response.data
      // );
    } catch (error) {
      console.error(
        `Batch ${i + 1}/${totalBatches} gagal dikirim`,
        error.response?.data || error.message
      );
      throw error;
    }
  }
};

const sendTernakHewanBulkData = async (data, batchSize = 100) => {
  const totalBatches = Math.ceil(data.length / batchSize);

  for (let i = 0; i < totalBatches; i++) {
    const batchData = data.slice(i * batchSize, (i + 1) * batchSize);

    try {
      console.log(`Data Ternak Hewan (Batch ${i + 1}):`, batchData); // Log data yang dikirim
      // const response = await addTernakBulk(batchData);
      // console.log(
      //   `Batch ${i + 1}/${totalBatches} berhasil dikirim`,
      //   response.data
      // );
    } catch (error) {
      console.error(
        `Batch ${i + 1}/${totalBatches} gagal dikirim`,
        error.response?.data || error.message
      );
      throw error; // Hentikan proses jika batch gagal
    }
  }
};

const cleanNik = (nik) => (nik ? nik.replace(/'/g, "").trim() : "-");

// function untuk parse address
function parseAddress(address) {
  // Pecah alamat berdasarkan koma
  const parts = address.split(","); 

  // Trim setiap bagian untuk menghapus spasi di awal/akhir
  const trimmedParts = parts.map((part) => part.trim());

  // Ambil masing-masing bagian sesuai urutan
  const dusun = trimmedParts[0] || "";
  const desa = trimmedParts[1] || "";
  const kecamatan = trimmedParts[2] || "";
  const kabupaten = trimmedParts[3]?.replace(/KAB\. /i, "") || ""; // Hapus "KAB." jika ada
  const provinsi = trimmedParts[4] || "";

  // Return dalam bentuk object atau array
  return { dusun, desa, kecamatan, kabupaten, provinsi };
}

// set email "-" jika tidak ada @

const getValidData = (row, columnMapping, columnKey) => {
  return row[columnMapping[columnKey]] == null
    ? "-"
    : row[columnMapping[columnKey]];
};

export default class ImportAllData extends Component {
  state = {
    importedData: [],
    importModalVisible: false,
  };

  handleImportModalOpen = () => {
    this.setState({ importModalVisible: true });
  };

  handleImportModalClose = () => {
    this.setState({ importModalVisible: false });
  };

  handleFileImport = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      // Set defval to null so empty cells are not skipped
      const jsonData = utils.sheet_to_json(worksheet, {
        header: 1,
        blankrows: false,
        defval: null,
      });
      const importedData = jsonData.slice(1); // Exclude the first row (column titles)
      const columnTitles = jsonData[0]; // Assume the first row contains column titles

      const columnMapping = {};
      columnTitles.forEach((title, index) => {
        columnMapping[title.trim()] = index; // Trim untuk menghapus spasi tambahan
      });

      console.log("Column Titles:", columnTitles);
      console.log("Column Mapping:", columnMapping);

      this.setState({
        importedData,
        columnTitles,
        fileName: file.name.toLowerCase(),
        columnMapping,
      });
    };
    reader.readAsArrayBuffer(file);
  };

  handleUpload = () => {
    const { importedData, columnMapping } = this.state;

    if (importedData.length === 0) {
      message.error("No data to import.");
      return;
    }

    this.setState({ uploading: true });

    this.saveImportedData(columnMapping)
      .then(() => {
        this.setState({
          uploading: false,
          importModalVisible: false,
        });
      })
      .catch((error) => {
        console.error("Gagal mengunggah data:", error);
        this.setState({ uploading: false });
        message.error("Gagal mengunggah data, harap coba lagi.");
      });
  };

  saveImportedData = async (columnMapping) => {
    const { importedData } = this.state;
    let errorCount = 0;

    try {
      const uniqueData = new Map();

      const petugasPendataanBulk = [];
      const petugasVaksinasiBulk = [];
      const peternakBulk = [];
      const jenisHewanBulk = [];
      const rumpunHewanBulk = [];
      const kandangBulk = [];
      const ternakHewanBulk = [];
      const vaksinBulk = [];

      for (const row of importedData) {
        const generateIdPeternak = uuidv4();
        const generateIdJenisHewan = uuidv4();
        const generateIdRumpunHewan = uuidv4();
        const generateIdKandang = uuidv4();
        const generateIdHewan = uuidv4();
        const generateIdVaksin = uuidv4();

        const nikPeternak = cleanNik(
          row[columnMapping["NIK Pemilik Ternak*)"]]
        );
        const nikPetugasPendataan = cleanNik(
          row[columnMapping["NIK Petugas Pendataan*)"]]
        );

        const generateEmailFromName = (name) => {
          if (!name) return "default@gmail.com"; // Jika nama tidak ada, beri default
          return name.toLowerCase().replace(/\s+/g, "") + "@gmail.com";
        };

        const validateEmail  = (email) => {
          // Cek apakah email mengandung karakter '@'
          if (!email.includes('@')) {
            return generateEmailFromName(); // Jika nama tidak ada, beri default
          }
          // Jika ada '@', kembalikan email apa adanya
          return email;
        }

        const generateDefaultPhoneNumber = () => {
          const randomNumber = Math.floor(
            1000000000 + Math.random() * 9000000000
          ); // 10 digit dimulai dengan 8
          return `8${randomNumber.toString().substring(1)}`; // Tambahkan 8 di depan
        };

        const generateDefaultTanggalLahir = () => {
          const randomDate = new Date(
            Math.floor(Math.random() * 100) + 1920,
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28)
          );
          return randomDate.toISOString().split("T")[0];
        };

        const generateJenisKandang = (jenisKandang) => {
          return jenisKandang || "Permanen";
        };

        const pecahAlamat = parseAddress(
          row[columnMapping["Alamat Pemilik Ternak**)"]]
        );

        // const setEmail =;



        console.log("Row Data:", row);

        if (!uniqueData.has(nikPetugasPendataan)) {
          const dataPetugasPendataan = {
            nikPetugas: cleanNik(row[columnMapping["NIK Petugas Pendataan*)"]]),
            namaPetugas: row[columnMapping["Nama Petugas Pendataan*)"]],
            noTelp: row[columnMapping["No. Telp Petugas Pendataan*)"]],
            email: row[columnMapping["Email Petugas Pendataan"]],
            job: "Pendataan",
          };
          petugasPendataanBulk.push(dataPetugasPendataan);
          uniqueData.set(nikPetugasPendataan, true);
        }

        console.log("Petugas Pendataan Bulk api:", petugasPendataanBulk);

        const dataPetugasVaksinasi = {
          nikPetugas: row[columnMapping["NIK Petugas Vaksinasi*)"]],
          namaPetugas: row[columnMapping["Nama Petugas Vaksinasi*)"]],
          noTelp: row[columnMapping["No. Telp Petugas Vaksinasi*)"]],
          email: row[columnMapping["Email Petugas Vaksinasi*)"]],
          job: "Vaksinasi",
        };

        if (!uniqueData.has(nikPeternak)) {
          const dataPeternak = {
            idPeternak: generateIdPeternak,
            nikPeternak: cleanNik(row[columnMapping["NIK Pemilik Ternak**)"]]),
            namaPeternak: row[columnMapping["Nama Pemilik Ternak**)"]] || "-",
            noTelepon:
              row[columnMapping["No. Telp Pemilik Ternak*)"]] ||
              generateDefaultPhoneNumber(),
            email:  validateEmail(
                row[columnMapping["Email Pemilik Ternak"]]
              ),
            nikPetugas: cleanNik(row[columnMapping["NIK Petugas Pendataan*)"]]),
            alamat: row[columnMapping["Alamat Pemilik Ternak**)"]] || "-",
            dusun: pecahAlamat.dusun,
            desa: pecahAlamat.desa,
            kecamatan: pecahAlamat.kecamatan,
            kabupaten: pecahAlamat.kabupaten,
            tanggalLahir:
              row[columnMapping["Tanggal Lahir Pemilik*)"]] ||
              generateDefaultTanggalLahir(),
            idIsikhnas: row[columnMapping["ID Isikhnas*)"]] || "-",
            latitude: row[columnMapping["latitude"]],
            longitude: row[columnMapping["longitude"]],
            jenisKelamin: row[columnMapping["Jenis Kelamin Pemilik Ternak"]],
          };
          console.log("data ternak = ", dataPeternak);
          peternakBulk.push(dataPeternak);
          // uniqueData.set(nikPeternak, true);
        }

        console.log("Peternak Bulk api:", peternakBulk);

        const dataKandang = {
          idKandang: generateIdKandang,
          peternak_id: generateIdPeternak,
          idJenisHewan: generateIdJenisHewan,
          nikPeternak: cleanNik(row[columnMapping["NIK Pemilik Ternak**)"]]),
          namaKandang: `kandang ${row[columnMapping["Nama Pemilik Ternak**)"]]}`,
          alamat: row[columnMapping["Alamat Kandang**)"]],
          luas: row[columnMapping["Luas Kandang*)"]] || "-",
          nilaiBangunan: row[columnMapping["Nilai Bangunan*)"]] || "-",
          jenisKandang: generateJenisKandang(
            row[columnMapping["Jenis Kandang*)"]]
          ),
          latitude: row[columnMapping["latitude"]],
          longitude: row[columnMapping["longitude"]],
          
        };

        const dataJenisHewan = {
          idJenisHewan: generateIdJenisHewan,
          jenis: row [columnMapping[ "Jenis Ternak**)"]],
          deskripsi:
            "Deskripsi " + getValidData(row, columnMapping, "Jenis Ternak*)"),
        };

        const dataRumpunHewan = {
          idRumpunHewan: generateIdRumpunHewan,
          rumpun: getValidData(row, columnMapping, "Rumpun Ternak"),
          deskripsi:
            "Deskripsi " + getValidData(row, columnMapping, "Rumpun Ternak"),
        };

        const dataTernakHewan = {
          idHewan: generateIdHewan,
          kodeEartagNasional: getValidData(
            row,
            columnMapping,
            "No. Eartag***)"
          ),
          petugas_id: row[columnMapping["NIK Petugas Pendataan*)"]],
          tanggalLahir: row[columnMapping["Tanggal Lahir Ternak**)"]],
          sex: row[columnMapping["Jenis Kelamin**)"]],
          tempatLahir: row[columnMapping["Tempat Lahir Ternak"]],
          peternak_id: generateIdPeternak,
          kandang_id: generateIdKandang,
          jenisHewanId: generateIdJenisHewan,
          rumpunHewanId: generateIdRumpunHewan,
        };

        const dataVaksin = {
          idVaksin: generateIdVaksin,
          peternak_id: generateIdPeternak,
          hewan_id: generateIdHewan,
          petugas_id: getValidData(
            row,
            columnMapping,
            "NIK Petugas Vaksinasi*)"
          ),
          namaVaksin: getValidData(row, columnMapping, "Nama Vaksin*)"),
          jenisVaksin: getValidData(row, columnMapping, "Jenis Vaksin*)"),
          tglVaksin: getValidData(row, columnMapping, "Tanggal Vaksin*)"),
        };

        // Add data to bulk arrays
        // petugasPendataanBulk.push(dataPetugasPendataan);
        petugasVaksinasiBulk.push(dataPetugasVaksinasi);
        // peternakBulk.push(dataPeternak);
        jenisHewanBulk.push(dataJenisHewan);
        rumpunHewanBulk.push(dataRumpunHewan);
        kandangBulk.push(dataKandang);
        ternakHewanBulk.push(dataTernakHewan);
        vaksinBulk.push(dataVaksin);
      }

      // Send bulk data to server
      try {
        console.log("Petugas Pendataan Bulk api: ", petugasPendataanBulk);
        console.log("Peternak Bulk api :", peternakBulk);
        console.log("Kandang Bulk api :", kandangBulk);
        // await sendPetugasBulkData(petugasVaksinasiBulk);
        await sendPetugasBulkData(petugasPendataanBulk);
        await sendPeternakBulkData(peternakBulk);
        await sendJenisHewanBulkData(jenisHewanBulk);
        await sendKandangBulkData(kandangBulk);
        // await sendRumpunHewanBulkData(rumpunHewanBulk);
        // await sendTernakHewanBulkData(ternakHewanBulk);

        // await sendPeternakImport(peternakBulk)
        // await sendJenisHewanImport(jenisHewanBulk)
        // await sendRumpunHewanImport(rumpunHewanBulk)
        // await sendKandangImport(kandangBulk)
        // await sendHewanImport(ternakBulk)
        // await sendVaksinImport(vaksinBulk)
      } catch (error) {
        console.error(
          "Gagal menyimpan data secara bulk:",
          error,
          error.response?.data
        );
      }

      if (errorCount === 0) {
        message.success(`Semua data berhasil disimpan.`);
      } else {
        message.error(
          `${errorCount} data gagal disimpan karena duplikasi data!`
        );
      }
    } catch (error) {
      console.error("Gagal memproses data:", error);
    } finally {
      this.setState({
        importedData: [],
        columnTitles: [],
        columnMapping: {},
      });
    }
  };

  render() {
    const { importModalVisible } = this.state;
    return (
      <div style={{ marginBottom: "1rem" }}>
        <Button icon={<UploadOutlined />} onClick={this.handleImportModalOpen}>
          Import File
        </Button>
        <Modal
          title="Import File"
          visible={importModalVisible}
          onCancel={this.handleImportModalClose}
          footer={[
            <Button key="cancel" onClick={this.handleImportModalClose}>
              Cancel
            </Button>,
            <Button
              key="upload"
              type="primary"
              loading={this.state.uploading}
              onClick={this.handleUpload}
            >
              Upload
            </Button>,
          ]}
        >
          <Upload beforeUpload={this.handleFileImport}>
            <Button icon={<UploadOutlined />}>Pilih File</Button>
          </Upload>
        </Modal>
      </div>
    );
  }
}
