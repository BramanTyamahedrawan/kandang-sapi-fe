/* eslint-disable no-constant-condition */
/* eslint-disable no-unused-vars */
import { Component } from "react";
import { Card, Button, Table, message, Row, Col, Divider, Modal, Upload, Input } from "antd";
import { getPeternaks } from "@/api/peternak";
import { getInseminasis, getInseminasiByPeternak, deleteInseminasi, editInseminasi, addInseminasi, addInseminasiImport, addInseminsasiBulk } from "@/api/inseminasi";
import { addJenisHewanBulk } from "@/api/jenishewan";
import { addRumpunHewanBulk } from "@/api/rumpunhewan";
import { addHewanBulkImport } from "@/api/hewan";
import { addKandangBulkByNama } from "@/api/kandang";
import { addPeternakBulkByNama } from "@/api/peternak";
import { addPetugasBulkByNama } from "@/api/petugas";
import { getPetugas } from "@/api/petugas";
import { UploadOutlined } from "@ant-design/icons";
import { read, utils } from "xlsx";
import AddInseminasiBuatanForm from "./forms/add-inseminasi-form";
import EditInseminasiBuatanForm from "./forms/edit-inseminasi-form";
import TypingCard from "@/components/TypingCard";
import { reqUserInfo } from "../../api/user";
import { v4 as uuidv4 } from "uuid";
import { data } from "react-router-dom";

export const sendPetugasBulkData = async (data, batchSize = 7000) => {
  const totalBatches = Math.ceil(data.length / batchSize);

  for (let i = 0; i < totalBatches; i++) {
    const batchData = data.slice(i * batchSize, (i + 1) * batchSize);

    try {
      console.log(`Data Petugas (Batch ${i + 1}):`, batchData); // Log data yang dikirim
      const response = await addPetugasBulkByNama(batchData);
      console.log(`Batch ${i + 1}/${totalBatches} berhasil dikirim`, response.data);
    } catch (error) {
      console.error(`Batch ${i + 1}/${totalBatches} gagal dikirim`, error.response?.data || error.message);
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
      const response = await addPeternakBulkByNama(batchData);
      console.log(`Batch ${i + 1}/${totalBatches} berhasil dikirim`, response.data);
    } catch (error) {
      console.error(`Batch ${i + 1}/${totalBatches} gagal dikirim`, error.response?.data || error.message);
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
      console.log(`Batch ${i + 1}/${totalBatches} berhasil dikirim`, response.data);
    } catch (error) {
      console.error(`Batch ${i + 1}/${totalBatches} gagal dikirim`, error.response?.data || error.message);
      throw error;
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
      console.log(`Batch ${i + 1}/${totalBatches} berhasil dikirim`, response.data);
    } catch (error) {
      console.error(`Batch ${i + 1}/${totalBatches} gagal dikirim`, error.response?.data || error.message);
      throw error; // Hentikan proses jika batch gagal
    }
  }
};

export const sendKandangBulkData = async (data, batchSize = 7000) => {
  const totalBatches = Math.ceil(data.length / batchSize);

  for (let i = 0; i < totalBatches; i++) {
    const batchData = data.slice(i * batchSize, (i + 1) * batchSize);

    try {
      console.log(`Data Kandang (Batch ${i + 1}):`, batchData); // Log data yang dikirim
      const response = await addKandangBulkByNama(batchData);
      console.log(`Batch ${i + 1}/${totalBatches} berhasil dikirim`, response.data);
    } catch (error) {
      console.error(`Batch ${i + 1}/${totalBatches} gagal dikirim`, error.response?.data || error.message);
      throw error; // Hentikan proses jika batch gagal
    }
  }
};

const sendTernakHewanBulkData = async (data, batchSize = 7000) => {
  const totalBatches = Math.ceil(data.length / batchSize);

  for (let i = 0; i < totalBatches; i++) {
    const batchData = data.slice(i * batchSize, (i + 1) * batchSize);

    try {
      console.log(`Data Ternak Hewan (Batch ${i + 1}):`, batchData); // Log data yang dikirim
      const response = await addHewanBulkImport(batchData);
      console.log(`Batch ${i + 1}/${totalBatches} berhasil dikirim`, response.data);
    } catch (error) {
      console.error(`Batch ${i + 1}/${totalBatches} gagal dikirim`, error.response?.data || error.message);
      throw error; // Hentikan proses jika batch gagal
    }
  }
};

export const sendInseminasiBuatanImport = async (data, batchSize = 7000) => {
  const totalBatches = Math.ceil(data.length / batchSize);

  for (let i = 0; i < totalBatches; i++) {
    const batchData = data.slice(i * batchSize, (i + 1) * batchSize);

    try {
      console.log(`Data Inseminasi Buatan (Batch ${i + 1}):`, batchData); // Log data yang dikirim
      const response = await addInseminsasiBulk(batchData);
      console.log(`Batch ${i + 1}/${totalBatches} berhasil dikirim`, response.data);
    } catch (error) {
      console.error(`Batch ${i + 1}/${totalBatches} gagal dikirim`, error.response?.data || error.message);
      throw error; // Hentikan proses jika batch gagal
    }
  }
};

function parseLocation(lokasi) {
  // Pastikan lokasi berupa string, jika tidak kembalikan "lokasi tidak valid"
  if (typeof lokasi !== "string" || !lokasi) {
    console.warn(`Alamat tidak valid: ${lokasi}`);
    return "alamat tidak valid";
  }

  // Pecah alamat berdasarkan koma
  const parts = lokasi.split(",").map((part) => part.trim());

  // Ambil masing-masing bagian sesuai urutan, isi dengan "-" jika tidak ada
  const provinsi = parts[0] || "-";
  const kabupaten = parts[1]?.replace(/KAB\. /i, "") || "-"; // Hapus "KAB." jika ada
  const kecamatan = parts[2] || "-";
  const desa = parts[3] || "-";

  // Validasi bahwa setidaknya satu bagian selain "-" harus terisi
  const isValid = desa !== "-" || kecamatan !== "-" || kabupaten !== "-" || provinsi !== "-";

  if (!isValid) {
    console.warn(`Lokasi tidak valid: ${lokasi}`);
    return "lokasi tidak valid";
  }

  // Return dalam bentuk object
  return { provinsi, kabupaten, kecamatan, desa };
}

const cleanNik = (nik) => (nik ? nik.replace(/'/g, "").trim() : "-");

class InseminasiBuatan extends Component {
  state = {
    inseminasis: [],
    peternaks: [],
    petugas: [],
    editInseminasiModalVisible: false,
    editInseminasiModalLoading: false,
    currentRowData: {},
    addInseminasiModalVisible: false,
    addInseminasiModalLoading: false,
    importModalVisible: false,
    importedData: [],
    columnTitles: [],
    fileName: "",
    uploading: false,
    columnMapping: {},
    searchKeyword: "",
    user: null,
  };

  getInseminasis = async () => {
    const result = await getInseminasis();

    console.log(result);
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      const filteredInseminasi = content.filter((inseminasis) => {
        const { idInseminasi, idPeternak, namaPeternak, kodeEartagNasional, idPejantan, idPembuatan, bangsaPejantan, produsen, inseminator, lokasi } = inseminasis;
        const keyword = this.state.searchKeyword.toLowerCase();

        const isIdInseminasiValid = typeof idInseminasi === "string";
        const isIdPeternakValid = typeof idPeternak === "string";
        const isNamaPeternakValid = typeof namaPeternak === "string";
        const isKodeEartagNasionalValid = typeof kodeEartagNasional === "string";
        const isIdPejantanValid = typeof idPejantan === "string";
        const isIdPembuatanValid = typeof idPembuatan === "string";
        const isBangsaPejantanValid = typeof bangsaPejantan === "string";
        const isProdusenValid = typeof produsen === "string";
        const isInseminatorValid = typeof inseminator === "string";
        const isLokasiValid = typeof lokasi === "string";

        return (
          (isIdInseminasiValid && idInseminasi.toLowerCase().includes(keyword)) ||
          (isIdPeternakValid && idPeternak.toLowerCase().includes(keyword)) ||
          (isNamaPeternakValid && namaPeternak.toLowerCase().includes(keyword)) ||
          (isKodeEartagNasionalValid && kodeEartagNasional.toLowerCase().includes(keyword)) ||
          (isIdPejantanValid && idPejantan.toLowerCase().includes(keyword)) ||
          (isIdPembuatanValid && idPembuatan.toLowerCase().includes(keyword)) ||
          (isBangsaPejantanValid && bangsaPejantan.toLowerCase().includes(keyword)) ||
          (isProdusenValid && produsen.toLowerCase().includes(keyword)) ||
          (isInseminatorValid && inseminator.toLowerCase().includes(keyword)) ||
          (isLokasiValid && lokasi.toLowerCase().includes(keyword))
        );
      });

      this.setState({
        inseminasis: filteredInseminasi,
      });
    }
  };

  getInseminasiByPeternak = async (peternakID) => {
    try {
      const result = await getInseminasiByPeternak(peternakID);
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        this.setState({ inseminasis: content });
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  handleSearch = (keyword) => {
    this.setState(
      {
        searchKeyword: keyword,
      },
      () => {
        this.getInseminasis();
      }
    );
  };

  getPeternaks = async () => {
    const result = await getPeternaks();
    console.log(result);
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      this.setState({
        peternaks: content,
      });
    }
  };

  getPetugas = async () => {
    const result = await getPetugas();
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      this.setState({
        petugas: content,
      });
    }
  };

  handleEditInseminasi = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editInseminasiModalVisible: true,
    });
  };

  handleEditInseminasiOk = (_) => {
    const { form } = this.editInseminasiFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editInseminasiModalLoading: true });
      editInseminasi(values, values.idInseminasi)
        .then((response) => {
          form.resetFields();
          this.setState({
            editInseminasiModalVisible: false,
            editInseminasiModalLoading: false,
          });
          message.success("Berhasil diedit!");
          this.getInseminasis();
        })
        .catch((e) => {
          message.success("Pengeditan gagal, harap coba lagi!");
        });
    });
  };

  handleDeleteInseminasi = (row) => {
    const { idInseminasi } = row;

    Modal.confirm({
      title: "Konfirmasi",
      content: "Apakah Anda yakin ingin menghapus data ini?",
      okText: "Ya",
      okType: "danger",
      cancelText: "Tidak",
      onOk: () => {
        deleteInseminasi({ idInseminasi }).then((res) => {
          message.success("Berhasil dihapus");
          this.getInseminasis();
        });
      },
    });
  };

  handleCancel = (_) => {
    this.setState({
      editInseminasiModalVisible: false,
      addInseminasiModalVisible: false,
      importModalVisible: false,
    });
  };

  handleAddInseminasi = (row) => {
    this.setState({
      addInseminasiModalVisible: true,
    });
  };

  handleAddInseminasiOk = (_) => {
    const { form } = this.addInseminasiFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addInseminasiModalLoading: true });
      addInseminasi(values)
        .then((response) => {
          form.resetFields();
          this.setState({
            addInseminasiModalVisible: false,
            addInseminasiModalLoading: false,
          });
          message.success("Berhasil menambahkan!");
          this.getInseminasis();
        })
        .catch((e) => {
          message.success("Gagal menambahkan, harap coba lagi!");
        });
    });
  };

  convertToJSDate(input) {
    let date;
    if (typeof input === "number") {
      const utcDays = Math.floor(input - 25569);
      const utcValue = utcDays * 86400;
      const dateInfo = new Date(utcValue * 1000);
      date = new Date(dateInfo.getFullYear(), dateInfo.getMonth(), dateInfo.getDate()).toString();
    } else if (typeof input === "string") {
      const [day, month, year] = input.split("/");
      date = new Date(`${year}-${month}-${day}`).toString();
    }

    return date;
  }

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

      const jenisHewanBulk = [];
      const rumpunHewanBulk = [];
      const ternakHewanBulk = [];
      const petugasInseminasi = [];
      const peternakBulk = [];
      const kandangBulk = [];
      const inseminasiBuatan = [];

      for (const row of importedData) {
        const generateIdPeternak = uuidv4();
        const generateIdInseminasi = uuidv4();
        const generateIdHewan = uuidv4();
        const generateIdRumpunHewan = uuidv4();
        const generateIdJenisHewan = uuidv4();
        const generateIdKandang = uuidv4();

        const formatDateToString = (dateString) => {
          // Jika dateString adalah angka (seperti nilai dari Excel)
          if (!isNaN(dateString)) {
            // Excel menganggap angka tersebut sebagai jumlah hari sejak 01/01/1900
            // Konversi angka menjadi milidetik
            const excelEpoch = new Date(1900, 0, 1).getTime(); // 1 Januari 1900
            const milliseconds = dateString * 86400000; // 86400000 ms dalam 1 hari
            const date = new Date(excelEpoch + milliseconds);

            // Format tanggal dan waktu menjadi string
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0"); // Bulan dimulai dari 0
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            const seconds = String(date.getSeconds()).padStart(2, "0");

            return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
          }

          // Jika dateString adalah string yang valid dengan format DD/MM/YYYY atau DD/MM/YYYY HH:mm:ss
          if (typeof dateString === "string" && dateString.includes(" ")) {
            const [datePart, timePart] = dateString.split(" ");
            const [day, month, year] = datePart.split("/");

            return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")} ${timePart}`;
          } else if (typeof dateString === "string") {
            const [day, month, year] = dateString.split("/");
            return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
          }

          // Jika format tidak dikenali
          return "Invalid Date";
        };

        const validateEmail = (email) => {
          // Jika email tidak valid (null, undefined, atau bukan string), gunakan default
          if (typeof email !== "string" || !email.includes("@")) {
            console.warn(`Email tidak valid: ${email}. Menggunakan email default.`);
            return "default@gmail.com"; // Email default
          }
          // Jika valid, kembalikan email
          return email;
        };

        const pecahLokasi = parseLocation(row[columnMapping["Lokasi"]] || row[columnMapping["Alamat"]] || "-");

        const generateJenisKandang = (jenisKandang) => {
          return jenisKandang || "Permanen";
        };
        // const setEmail =;

        console.log("Row Data:", row);

        if (!uniqueData.has(row[columnMapping["Spesies Induk"]])) {
          const dataRumpunHewan = {
            idRumpunHewan: row[columnMapping["ID Rumpun Hewan"]] || generateIdRumpunHewan,
            rumpun: row[columnMapping["Spesies Induk"]] || "-",
            deskripsi: "Deskripsi " + row[(columnMapping, ["Spesies Induk"])] || "-",
          };
          rumpunHewanBulk.push(dataRumpunHewan);
          uniqueData.set(row[columnMapping["Spesies Induk"]], true);
        }

        if (!uniqueData.has(row[columnMapping["kategori"]])) {
          const dataJenisHewan = {
            idJenisHewan: row[columnMapping["ID Jenis Hewan"]] || generateIdJenisHewan,
            jenis: row[columnMapping["kategori"]] || "-",
            deskripsi: "Deskripsi " + row[(columnMapping, ["kategori"])] || "-",
          };
          jenisHewanBulk.push(dataJenisHewan);
          uniqueData.set(row[columnMapping["kategori"]], true);
        }

        const dataPetugas = {
          nikPetugas: cleanNik(row[columnMapping["NIK Petugas"]]) || "-",
          namaPetugas: row[columnMapping["Inseminator"]] || "-",
          noTelp: row[columnMapping["No. Telp Petugas"]] || "-",
          email: validateEmail(row[columnMapping["Email Petugas"]]) || "-",
          job: "Petugas Kelahiran",
        };

        const dataPeternak = {
          idPeternak: row[columnMapping["ID Peternak"]] || generateIdPeternak,
          nikPeternak: cleanNik(row[columnMapping["NIK Peternak"]]) || "-",
          namaPeternak: row[columnMapping["Nama Peternak"]] || "-",
          noTelpPeternak: row[columnMapping["No Telp"]] || "-",
          emailPeternak: validateEmail(row[columnMapping["Email Pemilik Ternak"]]) || "-",
          nikPetugas: dataPetugas.nikPetugas,
          namaPetugas: dataPetugas.namaPetugas || "-",
          alamatPeternak: row[columnMapping["Alamat Pemilik Ternak**)"]] || "-",
          dusunPeternak: pecahLokasi.dusun,
          desaPeternak: pecahLokasi.desa,
          kecamatanPeternak: pecahLokasi.kecamatan,
          kabupatenPeternak: pecahLokasi.kabupaten,
          provinsiPeternak: pecahLokasi.provinsi,
          // tanggalLahirPeternak: formatDateToString(
          //   row[columnMapping["Tanggal Lahir Pemilik Ternak"]] || "_ "
          // ),
          idIsikhnas: row[columnMapping["ID Isikhnas*)"]] || "-",
          jenisKelaminPeternak: row[columnMapping["Jenis Kelamin Pemilik Ternak"]] || "-",
        };

        const dataKandang = {
          idKandang: row[columnMapping["ID Kandang"]] || generateIdKandang,
          peternak_id: dataPeternak.idPeternak,
          nikPeternak: dataPeternak.nikPeternak,
          namaPeternak: dataPeternak.namaPeternak,
          namaKandang: `Kandang ${dataPeternak.namaPeternak}`,
          alamat: row[columnMapping["Alamat Kandang**)"]] || "Alamat Tidak Valid",
          luas: row[columnMapping["Luas Kandang*)"]] || "_",
          kapasitas: row[columnMapping["Kapasitas Kandang*)"]] || "_",
          nilaiBangunan: row[columnMapping["Nilai Bangunan*)"]] || "_",
          jenisKandang: generateJenisKandang(row[columnMapping["Jenis Kandang"]]),
          latitude: row[columnMapping["latitude"]] || null,
          longitude: row[columnMapping["longitude"]] || null,
        };

        const dataTernakHewan = {
          idHewan: row[columnMapping["ID Hewan"]] || generateIdHewan,
          kodeEartagNasional: row[columnMapping["eartag"]] || "-",
          noKartuTernak: row[columnMapping["kartu ternak induk"]] || "_",
          nikPetugas: dataPetugas.nikPetugas,
          namaPetugas: dataPetugas.namaPetugas || "_",
          // tanggalLahir: formatDateToString(
          //   row[columnMapping["Tanggal Lahir Ternak**)"]] || "_"
          // ),
          sex: row[columnMapping["Jenis Kelamin**)"]] || "_",
          tempatLahir: row[columnMapping["Tempat Lahir Ternak"]] || "_",
          umur: row[columnMapping["Umur"]] || "_",
          identifikasiHewan: row[columnMapping["Identifikasi Hewan*"]] || row[columnMapping["Identifikasi Hewan"]] || "_",
          nikPeternak: dataPeternak.nikPeternak,
          idKandang: dataKandang.idKandang,
          namaKandang: dataKandang.namaKandang,
          jenis: row[columnMapping["kategori"]] || "-",
          rumpun: row[columnMapping["species"]] || "-",
          idPeternak: dataPeternak.idPeternak,
          namaPeternak: dataPeternak.namaPeternak,
          tujuanPemeliharaan: row[columnMapping["Tujuan Pemeliharaan Ternak**)"]] || "_",
          // tanggalTerdaftar: formatDateToString(
          //   row[columnMapping["Tanggal Pendataan"]] || "_"
          // ),
        };

        // data inseminasi
        const dataInseminasi = {
          idInseminasi: row[columnMapping["ID"]] || generateIdInseminasi,
          tanggalIB: formatDateToString(row[columnMapping["Tanggal IB"]]) || "-",
          lokasi: row[columnMapping["Lokasi"]] || "-",
          desa: pecahLokasi.desa,
          kecamatan: pecahLokasi.kecamatan,
          kabupaten: pecahLokasi.kabupaten,
          provinsi: pecahLokasi.provinsi,
          namaPeternak: dataPeternak.namaPeternak,
          idPeternak: dataPeternak.idPeternak,
          nikPeternak: dataPeternak.nikPeternak,
          idHewan: dataTernakHewan.idHewan,
          kodeEartagNasional: dataTernakHewan.kodeEartagNasional,
          ib1: row[columnMapping["IB 1"]] || "-",
          ib2: row[columnMapping["IB 2"]] || "-",
          ib3: row[columnMapping["IB 3"]] || "-",
          ibLain: row[columnMapping["IB lain"]] || "-",
          idPejantan: row[columnMapping["ID Pejantan"]] || "-",
          idPembuatan: row[columnMapping["ID Pembuatan"]] || "-",
          bangsaPejantan: row[columnMapping["Bangsa Pejantan"]] || "-",
          produsen: row[columnMapping["Produsen"]] || "-",
          namaPetugas: dataPetugas.namaPetugas,
          nikPetugas: dataPetugas.nikPetugas,
          idKandang: dataKandang.idKandang,
          namaKandang: dataKandang.namaKandang,
          rumpun: dataTernakHewan.rumpun,
          jenis: dataTernakHewan.jenis,
        };

        console.log("Data Inseminasi:", dataInseminasi);

        petugasInseminasi.push(dataPetugas);
        peternakBulk.push(dataPeternak);
        kandangBulk.push(dataKandang);
        ternakHewanBulk.push(dataTernakHewan);
        inseminasiBuatan.push(dataInseminasi);
      }

      // Send bulk data to server
      try {
        await sendJenisHewanBulkData(jenisHewanBulk);
        await sendRumpunHewanBulkData(rumpunHewanBulk);
        await sendPetugasBulkData(petugasInseminasi);
        await sendPeternakBulkData(peternakBulk);
        await sendKandangBulkData(kandangBulk);
        await sendTernakHewanBulkData(ternakHewanBulk);
        await sendInseminasiBuatanImport(inseminasiBuatan);
      } catch (error) {
        console.error("Gagal menyimpan data secara bulk:", error, error.response?.data);
      }

      if (errorCount === 0) {
        message.success(`Semua data berhasil disimpan.`);
      } else {
        message.error(`${errorCount} data gagal disimpan karena duplikasi data!`);
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

  handleExportData = () => {
    const { inseminasis } = this.state;
    const csvContent = this.convertToCSV(inseminasis);
    this.downloadCSV(csvContent);
  };

  convertToCSV = (data) => {
    const columnTitles = ["ID Inseminasi", "Tanggal IB", "Lokasi", "Nama Peternak", "ID Peternak", "ID Hewan", "Eartag", "IB", "ID Pejantan", "ID Pembuatan", "Bangsa Pejantan", "Produsen", "Inseminator"];

    const rows = [columnTitles];
    data.forEach((item) => {
      const row = [item.idInseminasi, item.tanggalIB, item.alamat, item.namaPeternak, item.idPeternak, item.kodeEartagNasional, item.ib, item.idPejantan, item.idPembuatan, item.bangsaPejantan, item.produsen, item.inseminator];
      rows.push(row);
    });

    let csvContent = "data:text/csv;charset=utf-8,";

    rows.forEach((rowArray) => {
      const row = rowArray.join(";");
      csvContent += row + "\r\n";
    });

    return csvContent;
  };

  downloadCSV = (csvContent) => {
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Inseminasi.csv");
    document.body.appendChild(link);
    link.click();
  };

  componentDidMount() {
    this.getPeternaks();
    this.getPetugas();
    reqUserInfo()
      .then((response) => {
        const user = response.data;
        this.setState({ user }, () => {
          if (user.role === "ROLE_PETERNAK") {
            this.getInseminasiByPeternak(user.username);
          } else {
            this.getInseminasis();
          }
        });
      })
      .catch((error) => {
        console.error("Terjadi kesalahan saat mengambil data user:", error);
      });
  }

  render() {
    const { inseminasis, peternaks, importModalVisible, searchKeyword, user } = this.state;
    const columns = [
      {
        title: "ID Inseminasi",
        dataIndex: "idInseminasi",
        key: "idInseminasi",
      },
      { title: "Tanggal IB", dataIndex: "tanggalIB", key: "tanggalIB" },
      {
        title: "Nama Peternak",
        dataIndex: ["peternak", "namaPeternak"],
        key: "namaPeternak",
      },
      // {
      //   title: "NIK Peternak",
      //   dataIndex: ["peternak", "nikPeternak"],
      //   key: "nikPeternak",
      // },
      { title: "Lokasi", dataIndex: "lokasi", key: "lokasi" },
      {
        title: "Kode Eartag",
        dataIndex: ["hewan", "kodeEartagNasional"],
        key: "kodeEartagNasional",
      },
      {
        title: "IB",
        key: "ib",
        render: (text, record) => {
          const { ib1, ib2, ib3, ibLain } = record;

          const ibValues = [
            { label: "IB1", value: ib1 },
            { label: "IB2", value: ib2 },
            { label: "IB3", value: ib3 },
            { label: "IB Lain", value: ibLain },
          ];

          const validIB = ibValues.filter((ib) => ib.value && ib.value !== "-" && ib.value !== null && ib.value !== undefined).map((ib) => `${ib.label}: ${ib.value}`); // Gabungkan label dan nilai

          return validIB.length > 0 ? validIB.join(", ") : "Tidak ada IB";
        },
      },
      { title: "ID Pejantan", dataIndex: "idPejantan", key: "idPejantan" },
      { title: "ID Pembuatan", dataIndex: "idPembuatan", key: "idPembuatan" },
      {
        title: "Bangsa Pejantan",
        dataIndex: "bangsaPejantan",
        key: "bangsaPejantan",
      },
      { title: "Produsen", dataIndex: "produsen", key: "produsen" },
      {
        title: "inseminator",
        dataIndex: ["petugas", "namaPetugas"],
        key: "inseminator",
      },
    ];

    const renderTable = () => {
      if (user && user.role === "ROLE_PETERNAK") {
        return <Table dataSource={inseminasis} bordered columns={columns} />;
      } else if ((user && user.role === "ROLE_ADMINISTRATOR") || "ROLE_PETUGAS") {
        return <Table dataSource={inseminasis} bordered columns={columns && renderColumns()} />;
      } else {
        return null;
      }
    };

    const renderButtons = () => {
      if (user && (user.role === "ROLE_ADMINISTRATOR" || user.role === "ROLE_PETUGAS")) {
        return (
          <Row gutter={[16, 16]} justify="start" style={{ paddingLeft: 9 }}>
            <Col>
              <Button type="primary" onClick={this.handleAddInseminasi} block>
                Tambah Inseminasi
              </Button>
            </Col>
            <Col>
              <Button icon={<UploadOutlined />} onClick={this.handleImportModalOpen} block>
                Import File
              </Button>
            </Col>
            <Col>
              <Button icon={<UploadOutlined />} onClick={this.handleExportData} block>
                Export File
              </Button>
            </Col>
          </Row>
        );
      } else {
        return null;
      }
    };

    const renderColumns = () => {
      if ((user && user.role === "ROLE_ADMINISTRATOR") || "ROLE_PETUGAS") {
        columns.push({
          title: "Operasi",
          key: "action",
          width: 120,
          align: "center",
          render: (text, row) => (
            <span>
              <Button type="primary" shape="circle" icon="edit" title="Edit" onClick={() => this.handleEditInseminasi(row)} />
              <Divider type="vertical" />
              <Button type="primary" shape="circle" icon="delete" title="Delete" onClick={() => this.handleDeleteInseminasi(row)} />
            </span>
          ),
        });
      }
      return columns;
    };

    const title = (
      <Row gutter={[16, 16]} justify="start">
        {renderButtons()}
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <Input placeholder="Cari data" value={searchKeyword} onChange={(e) => this.handleSearch(e.target.value)} style={{ width: 235, marginLeft: 10 }} />
        </Col>
      </Row>
    );

    // const { role } = user ? user.role : "";
    // console.log("peran pengguna:", role);
    const cardContent = `Di sini, Anda dapat mengelola daftar inseminasi di sistem.`;

    return (
      <div className="app-container">
        <TypingCard title="Manajemen Inseminasi Buatan" source={cardContent} />
        <br />
        <Card title={title} style={{ overflowX: "scroll" }}>
          {renderTable()}
        </Card>
        <EditInseminasiBuatanForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) => (this.editInseminasiFormRef = formRef)}
          visible={this.state.editInseminasiModalVisible}
          confirmLoading={this.state.editInseminasiModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditInseminasiOk}
        />
        <AddInseminasiBuatanForm
          wrappedComponentRef={(formRef) => (this.addInseminasiFormRef = formRef)}
          visible={this.state.addInseminasiModalVisible}
          confirmLoading={this.state.addInseminasiModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddInseminasiOk}
        />
        <Modal
          title="Import File"
          visible={importModalVisible}
          onCancel={this.handleImportModalClose}
          footer={[
            <Button key="cancel" onClick={this.handleImportModalClose}>
              Cancel
            </Button>,
            <Button key="upload" type="primary" loading={this.state.uploading} onClick={this.handleUpload}>
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

export default InseminasiBuatan;
