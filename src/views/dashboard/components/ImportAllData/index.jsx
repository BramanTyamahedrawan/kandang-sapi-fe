/**
 * eslint-disable no-unused-vars
 *
 * @format
 */

import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Modal, Upload } from "antd";
import { Component } from "react";
import { v4 as uuidv4 } from "uuid";
import { read, utils } from "xlsx";

import { addTernakBulk } from "@/api/hewan";
import { addJenisVaksinBulk } from "@/api/jenis-vaksin";
import { addJenisHewanBulk } from "@/api/jenishewan";
import { addKandangBulk } from "@/api/kandang";
import { addNamaVaksinBulk } from "@/api/nama-vaksin";
import { addPeternakBulk } from "@/api/peternak";
import { addPetugasBulk } from "@/api/petugas";
import { addRumpunHewanBulk } from "@/api/rumpunhewan";
import { addTujuanPemeliharaanBulk } from "@/api/tujuan-pemeliharaan";
import { addVaksinBulk } from "@/api/vaksin";
// import { addTernakBulk } from "@/api/hewan";
// import { addJenisHewanBulk } from "@/api/jenishewan";
// import { addKandangBulk } from "@/api/kandang";
// import { addPeternakBulk } from "@/api/peternak";
// import { addPetugasBulk } from "@/api/petugas";
// import { addRumpunHewanBulk } from "@/api/rumpunhewan";
// import { addTujuanPemeliharaanBulk } from "@/api/tujuan-pemeliharaan";

export const sendPetugasBulkData = async (data, batchSize = 7000) => {
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

export const sendPeternakBulkData = async (data, batchSize = 7000) => {
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

const sendKandangBulkData = async (data, batchSize = 7000) => {
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

const sendJenisHewanBulkData = async (data, batchSize = 7000) => {
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

const sendTujuanPemeliharaanBulkData = async (data, batchSize = 7000) => {
  const totalBatches = Math.ceil(data.length / batchSize);

  for (let i = 0; i < totalBatches; i++) {
    const batchData = data.slice(i * batchSize, (i + 1) * batchSize);

    try {
      console.log(`Data Tujuan Pemeliharaan (Batch ${i + 1}):`, batchData); // Log data yang dikirim
      const response = await addTujuanPemeliharaanBulk(batchData);
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

const sendRumpunHewanBulkData = async (data, batchSize = 7000) => {
  const totalBatches = Math.ceil(data.length / batchSize);

  for (let i = 0; i < totalBatches; i++) {
    const batchData = data.slice(i * batchSize, (i + 1) * batchSize);

    try {
      console.log(`Data Rumpun Hewan (Batch ${i + 1}):`, batchData); // Log data yang dikirim
      const response = await addRumpunHewanBulk(batchData);
      console.log(
        `Batch ${i + 1}/${totalBatches} berhasil dikirim`,
        response.data
      );
    } catch (error) {
      console.error(
        `Batch ${i + 1}/${totalBatches} gagal dikirim`,
        error.response?.data || error.message
      );
      throw error;
    }
  }
};

const sendTernakHewanBulkData = async (data, batchSize = 7000) => {
  const totalBatches = Math.ceil(data.length / batchSize);

  for (let i = 0; i < totalBatches; i++) {
    const batchData = data.slice(i * batchSize, (i + 1) * batchSize);

    try {
      console.log(`Data Ternak Hewan (Batch ${i + 1}):`, batchData); // Log data yang dikirim
      const response = await addTernakBulk(batchData);
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

const sendJenisVaksinBulkData = async (data, batchSize = 7000) => {
  const totalBatches = Math.ceil(data.length / batchSize);

  for (let i = 0; i < totalBatches; i++) {
    const batchData = data.slice(i * batchSize, (i + 1) * batchSize);

    try {
      console.log(`Data Jenis Vaksin (Batch ${i + 1}):`, batchData); // Log data yang dikirim
      const response = await addJenisVaksinBulk(batchData);
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

const sendNamaVaksinBulkData = async (data, batchSize = 7000) => {
  const totalBatches = Math.ceil(data.length / batchSize);

  for (let i = 0; i < totalBatches; i++) {
    const batchData = data.slice(i * batchSize, (i + 1) * batchSize);

    try {
      console.log(`Data Nama Vaksin (Batch ${i + 1}):`, batchData); // Log data yang dikirim
      const response = await addNamaVaksinBulk(batchData);
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

const sendVaksinBulkData = async (data, batchSize = 7000) => {
  const totalBatches = Math.ceil(data.length / batchSize);

  for (let i = 0; i < totalBatches; i++) {
    const batchData = data.slice(i * batchSize, (i + 1) * batchSize);

    try {
      console.log(`Data Vaksin (Batch ${i + 1}):`, batchData); // Log data yang dikirim
      const response = await addVaksinBulk(batchData);
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

const cleanNik = (nik) => (nik ? nik.replace(/'/g, "").trim() : "-");

// function untuk parse address
function parseAddress(address) {
  // Pastikan alamat berupa string, jika tidak kembalikan "alamat tidak valid"
  if (typeof address !== "string" || !address) {
    console.warn(`Alamat tidak valid: ${address}`);
    return "alamat tidak valid";
  }

  // Pecah alamat berdasarkan koma
  const parts = address.split(",").map((part) => part.trim());

  // Ambil masing-masing bagian sesuai urutan, isi dengan "-" jika tidak ada
  const dusun = parts[0] || "-";
  const desa = parts[1] || "-";
  const kecamatan = parts[2] || "-";
  const kabupaten = parts[3]?.replace(/KAB\. /i, "") || "-"; // Hapus "KAB." jika ada
  const provinsi = parts[4] || "-";

  // Validasi bahwa setidaknya satu bagian selain "-" harus terisi
  const isValid =
    dusun !== "-" ||
    desa !== "-" ||
    kecamatan !== "-" ||
    kabupaten !== "-" ||
    provinsi !== "-";

  if (!isValid) {
    console.warn(`Alamat tidak valid: ${address}`);
    return "alamat tidak valid";
  }

  // Return dalam bentuk object
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
      const tujuanPemeliharaanBulk = [];
      const jenisVaksinBulk = [];
      const namaVaksinBulk = [];

      for (const row of importedData) {
        const generateIdPeternak = uuidv4();
        const generateIdJenisHewan = uuidv4();
        const generateIdRumpunHewan = uuidv4();
        const generateIdKandang = uuidv4();
        const generateIdHewan = uuidv4();
        const generateIdVaksin = uuidv4();
        const generateIdTujuanPemeliharaan = uuidv4();
        const generateIdJenisVaksin = uuidv4();
        const generateIdNamaVaksin = uuidv4();

        const nikPemilikTernak = cleanNik(
          row[columnMapping["NIK Pemilik Ternak**)"]]
        );
        const nikPetugasPendataan = cleanNik(
          row[columnMapping["NIK Petugas Pendataan*)"]]
        );

        const formatDateToString = (dateString) => {
          // if (!dateString || typeof dateString !== "string") return "Invalid Date";

          // Jika dateString adalah angka (seperti nilai dari Excel)
          if (!isNaN(dateString)) {
            const excelEpoch = new Date(1900, 0, 1).getTime();
            const milliseconds = dateString * 86400000;
            const date = new Date(excelEpoch + milliseconds);

            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();

            return `${day}/${month}/${year}`;
          }

          // Jika dateString adalah string yang valid dengan format DD/MM/YYYY atau dengan waktu
          if (typeof dateString === "string") {
            // Pisahkan tanggal dan waktu, jika ada waktu
            const datePart = dateString.split(" ")[0]; // Ambil bagian tanggal saja (sebelum spasi)

            // Pastikan tanggalnya memiliki format yang valid (DD/MM/YYYY)
            const [day, month, year] = datePart.split("/");

            // Pastikan hasil split memiliki 3 elemen (tanggal, bulan, tahun)
            if (day && month && year) {
              return `${year}-${month.padStart(2, "0")}-${day.padStart(
                2,
                "0"
              )}`;
            }
          }

          // Jika format tidak dikenali
          return "Invalid Date";
        };

        const validateEmail = (email) => {
          // Jika email tidak valid (null, undefined, atau bukan string), gunakan default
          if (typeof email !== "string" || !email.includes("@")) {
            console.warn(
              `Email tidak valid: ${email}. Menggunakan email default.`
            );
            return "default@gmail.com"; // Email default
          }
          // Jika valid, kembalikan email
          return email;
        };

        const generateDefaultPhoneNumber = () => {
          const randomNumber = Math.floor(
            1000000000 + Math.random() * 9000000000
          ); // 10 digit dimulai dengan 8
          return `8${randomNumber.toString().substring(1)}`; // Tambahkan 8 di depan
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
            email: validateEmail(row[columnMapping["Email Petugas Pendataan"]]),
            job: "Pendataan",
          };
          petugasPendataanBulk.push(dataPetugasPendataan);
          uniqueData.set(nikPetugasPendataan, true);
        }
        console.log("Petugas Pendataan Bulk api:", petugasPendataanBulk);

        // data petugas
        const dataPetugasVaksinasi = {
          nikPetugas: row[columnMapping["NIK Petugas Vaksinasi*)"]],
          namaPetugas: row[columnMapping["Nama Petugas Vaksinasi*)"]],
          noTelp: row[columnMapping["No. Telp Petugas Vaksinasi*)"]],
          email: row[columnMapping["Email Petugas Vaksinasi*)"]],
          job: "Vaksinasi",
        };
        // data peternak

        if (!uniqueData.has(nikPemilikTernak)) {
          const dataPeternak = {
            idPeternak: generateIdPeternak,
            nikPeternak: cleanNik(row[columnMapping["NIK Pemilik Ternak**)"]]),
            namaPeternak: row[columnMapping["Nama Pemilik Ternak**)"]] || "-",
            noTelepon:
              row[columnMapping["No Telp. Pemilik Ternak**)"]] ||
              generateDefaultPhoneNumber(),
            email: validateEmail(row[columnMapping["Email Pemilik Ternak"]]),
            nikPetugas: cleanNik(row[columnMapping["NIK Petugas Pendataan*)"]]),
            alamat: row[columnMapping["Alamat Pemilik Ternak**)"]] || "-",
            dusun: pecahAlamat.dusun,
            desa: pecahAlamat.desa,
            kecamatan: pecahAlamat.kecamatan,
            kabupaten: pecahAlamat.kabupaten,
            tanggalLahir: formatDateToString(
              row[columnMapping["Tanggal Lahir Pemilik Ternak"]] || "_ "
            ),
            idIsikhnas: row[columnMapping["ID Isikhnas*)"]] || "-",
            latitude: row[columnMapping["latitude"]],
            longitude: row[columnMapping["longitude"]],
            jenisKelamin: row[columnMapping["Jenis Kelamin Pemilik Ternak"]],
          };
          peternakBulk.push(dataPeternak);
          uniqueData.set(nikPemilikTernak, dataPeternak);
        }

        // Jenis Hewan
        // if jenis hewan berulang kali dengan nama yang sama, maka hanya akan disimpan satu kali
        if (!uniqueData.has(row[columnMapping["Jenis Ternak**)"]])) {
          const dataJenisHewan = {
            idJenisHewan: generateIdJenisHewan,
            jenis: row[columnMapping["Jenis Ternak**)"]],
            deskripsi:
              "Deskripsi " + getValidData(row, columnMapping, "Jenis Ternak*)"),
          };
          jenisHewanBulk.push(dataJenisHewan);
          uniqueData.set(row[columnMapping["Jenis Ternak**)"]], true);
        }

        // data tujuan pemeliharaan
        if (
          !uniqueData.has(row[columnMapping["Tujuan Pemeliharaan Ternak**)"]])
        ) {
          const dataTujuanPemeliharaan = {
            idTujuanPemeliharaan: generateIdTujuanPemeliharaan,
            tujuanPemeliharaan:
              row[columnMapping["Tujuan Pemeliharaan Ternak**)"]],
            deskripsi:
              "Deskripsi " +
              getValidData(row, columnMapping, "Tujuan Pemeliharaan Ternak**)"),
          };
          tujuanPemeliharaanBulk.push(dataTujuanPemeliharaan);
          uniqueData.set(
            row[columnMapping["Tujuan Pemeliharaan Ternak**)"]],
            true
          );
        }

        console.log("Peternak Bulk api:", peternakBulk);
        // data kandang
        const namaKandang = `Kandang ${row[columnMapping["Jenis Ternak**)"]]} ${
          uniqueData.get(nikPemilikTernak).namaPeternak
        }`;
        const dataKandang = {
          idKandang: generateIdKandang,
          jenis: row[columnMapping["Jenis Ternak**)"]] || "_",
          idPeternak: uniqueData.get(nikPemilikTernak).idPeternak,
          nikPeternak: cleanNik(row[columnMapping["NIK Pemilik Ternak**)"]]),
          namaKandang: namaKandang,
          alamat:
            row[columnMapping["Alamat Kandang**)"]] || "Alamat Tidak Valid",
          luas: row[columnMapping["Luas Kandang*)"]] || "_",
          kapasitas: row[columnMapping["Kapasitas Kandang*)"]] || "_",
          nilaiBangunan: row[columnMapping["Nilai Bangunan*)"]] || "_",
          jenisKandang: generateJenisKandang(
            row[columnMapping["Jenis Kandang*)"]]
          ),
          latitude: row[columnMapping["latitude"]] || null,
          longitude: row[columnMapping["longitude"]] || null,
        };

        console.log("Data Kandang:", kandangBulk);

        // data rumpun hewan
        if (!uniqueData.has(row[columnMapping["Rumpun Ternak"]])) {
          const dataRumpunHewan = {
            idRumpunHewan: generateIdRumpunHewan,
            rumpun: getValidData(row, columnMapping, "Rumpun Ternak"),
            deskripsi:
              "Deskripsi " + getValidData(row, columnMapping, "Rumpun Ternak"),
          };
          rumpunHewanBulk.push(dataRumpunHewan);
          uniqueData.set(row[columnMapping["Rumpun Ternak"]], true);
        }

        // data ternak hewan
        const dataTernakHewan = {
          idHewan: generateIdHewan,
          kodeEartagNasional: getValidData(
            row,
            columnMapping,
            "No. Eartag***)"
          ),
          noKartuTernak: row[columnMapping["No Kartu Ternak"]] || "-",
          idIsikhnasTernak: row[columnMapping["IdIsikhnas"]] || "_",
          nikPetugas: cleanNik(row[columnMapping["NIK Petugas Pendataan*)"]]),
          tanggalLahir: formatDateToString(
            row[columnMapping["Tanggal Lahir Ternak**)"]] || "_"
          ),
          sex: row[columnMapping["Jenis Kelamin**)"]] || "_",
          tempatLahir: row[columnMapping["Tempat Lahir Ternak"]] || "_",
          umur: row[columnMapping["Umur"]] || "_",
          identifikasiHewan:
            row[columnMapping["Identifikasi Hewan*"]] ||
            row[columnMapping["Identifikasi Hewan"]] ||
            "_",
          idPeternak: uniqueData.get(nikPemilikTernak).idPeternak,
          nikPeternak: cleanNik(row[columnMapping["NIK Pemilik Ternak**)"]]),
          namaKandang: dataKandang.namaKandang,
          jenis: row[columnMapping["Jenis Ternak**)"]] || "_",
          tujuanPemeliharaan:
            row[columnMapping["Tujuan Pemeliharaan Ternak**)"]] || "_",
          rumpun: row[columnMapping["Rumpun Ternak"]] || "_",
          tanggalTerdaftar: formatDateToString(
            row[columnMapping["Tanggal Pendataan"]] || "_"
          ),
        };
        console.log("data ternak : ", ternakHewanBulk);

        // Jenis Vaksin
        if (!uniqueData.has(row[columnMapping["Jenis Vaksin**)"]])) {
          const dataJenisVaksin = {
            idJenisVaksin: generateIdJenisVaksin,
            jenis: row[columnMapping["Jenis Vaksin**)"]],
            deskripsi:
              "Deskripsi " +
              getValidData(row, columnMapping, "Jenis Vaksin**)"),
          };
          jenisVaksinBulk.push(dataJenisVaksin);
          uniqueData.set(row[columnMapping["Jenis Vaksin**)"]], true);
        }

        if (!uniqueData.has(row[columnMapping["Nama Vaksin**)"]])) {
          const dataNamaVaksin = {
            idNamaVaksin: generateIdNamaVaksin,
            jenis: row[columnMapping["Jenis Vaksin**)"]],
            nama: row[columnMapping["Nama Vaksin**)"]],
            deskripsi:
              "Deskripsi " + getValidData(row, columnMapping, "Nama Vaksin**)"),
          };
          namaVaksinBulk.push(dataNamaVaksin);
          uniqueData.set(row[columnMapping["Nama Vaksin**)"]], true);
        }

        // data vaksin
        const dataVaksin = {
          idVaksin: generateIdVaksin,
          jenis: row[columnMapping["Jenis Vaksin**)"]],
          nama: row[columnMapping["Nama Vaksin**)"]],
          kodeEartagNasional: getValidData(
            row,
            columnMapping,
            "No. Eartag***)"
          ),
          nikPetugas: cleanNik(row[columnMapping["NIK Petugas Vaksinasi*)"]]),
          nikPeternak: cleanNik(row[columnMapping["NIK Pemilik Ternak**)"]]),
          batchVaksin: row[columnMapping["Batch Vaksin**)"]],
          vaksinKe: row[columnMapping["Vaksin ke-**)"]],

          tglVaksin: formatDateToString(
            row[columnMapping["Tanggal Vaksin**)"]]
          ),
        };

        console.log("Data Vaksin:", dataVaksin);

        // Add data to bulk arrays
        // petugasPendataanBulk.push(dataPetugasPendataan);
        petugasVaksinasiBulk.push(dataPetugasVaksinasi);
        // peternakBulk.push(dataPeternak);
        kandangBulk.push(dataKandang);
        ternakHewanBulk.push(dataTernakHewan);
        // jenisVaksinBulk.push(dataJenisVaksin);
        // namaVaksinBulk.push(dataNamaVaksin);
        vaksinBulk.push(dataVaksin);
      }

      // Send bulk data to server
      try {
        await sendPetugasBulkData(petugasPendataanBulk);
        await sendPeternakBulkData(peternakBulk);
        await sendJenisHewanBulkData(jenisHewanBulk);
        await sendRumpunHewanBulkData(rumpunHewanBulk);
        await sendKandangBulkData(kandangBulk);
        await sendTujuanPemeliharaanBulkData(tujuanPemeliharaanBulk);
        await sendTernakHewanBulkData(ternakHewanBulk);
        await sendJenisVaksinBulkData(jenisVaksinBulk);
        await sendNamaVaksinBulkData(namaVaksinBulk);
        await sendVaksinBulkData(vaksinBulk);
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
