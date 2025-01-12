/* eslint-disable no-constant-condition */
/* eslint-disable no-unused-vars */
import { Component } from "react";
import {
  Card,
  Button,
  Table,
  message,
  Row,
  Col,
  Divider,
  Modal,
  Upload,
  Input,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  getKelahiran,
  getKelahiranByPeternak,
  deleteKelahiran,
  editKelahiran,
  addKelahiran,
  addKelahiranBulk,
} from "@/api/kelahiran";
import { addJenisHewanBulk } from "@/api/jenishewan";
import { addRumpunHewanBulk } from "@/api/rumpunhewan";
import { addHewanBulkImport } from "@/api/hewan";
import { addPeternakBulkByNama } from "@/api/peternak";
import { addPetugasBulkByNama } from "@/api/petugas";
import { addInseminsasiBulk } from "@/api/inseminasi";
import { getPetugas } from "@/api/petugas";
import { read, utils } from "xlsx";
import TypingCard from "@/components/TypingCard";
import AddKelahiranForm from "./forms/add-kelahiran-form";
import EditKelahiranForm from "./forms/edit-kelahiran-form";
import { reqUserInfo } from "../../api/user";
import { v4 as uuidv4 } from "uuid";

export const sendPetugasBulkData = async (data, batchSize = 7000) => {
  const totalBatches = Math.ceil(data.length / batchSize);

  for (let i = 0; i < totalBatches; i++) {
    const batchData = data.slice(i * batchSize, (i + 1) * batchSize);

    try {
      console.log(`Data Petugas (Batch ${i + 1}):`, batchData); // Log data yang dikirim
      const response = await addPetugasBulkByNama(batchData);
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
      const response = await addPeternakBulkByNama(batchData);
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

const sendTernakHewanBulkData = async (data, batchSize = 7000) => {
  const totalBatches = Math.ceil(data.length / batchSize);

  for (let i = 0; i < totalBatches; i++) {
    const batchData = data.slice(i * batchSize, (i + 1) * batchSize);

    try {
      console.log(`Data Ternak Hewan (Batch ${i + 1}):`, batchData); // Log data yang dikirim
      const response = await addHewanBulkImport(batchData);
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

export const sendInseminasiBulkData = async (data, batchSize = 7000) => {
  const totalBatches = Math.ceil(data.length / batchSize);

  for (let i = 0; i < totalBatches; i++) {
    const batchData = data.slice(i * batchSize, (i + 1) * batchSize);

    try {
      console.log(`Data Inseminasi Buatan (Batch ${i + 1}):`, batchData); // Log data yang dikirim
      const response = await addInseminsasiBulk(batchData);
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

export const sendKelahiranBulkData = async (data, batchSize = 7000) => {
  const totalBatches = Math.ceil(data.length / batchSize);

  for (let i = 0; i < totalBatches; i++) {
    const batchData = data.slice(i * batchSize, (i + 1) * batchSize);

    try {
      console.log(`Data Inseminasi Buatan (Batch ${i + 1}):`, batchData); // Log data yang dikirim
      // const response = await addKelahiranBulk(batchData);
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
  const isValid =
    desa !== "-" || kecamatan !== "-" || kabupaten !== "-" || provinsi !== "-";

  if (!isValid) {
    console.warn(`Lokasi tidak valid: ${lokasi}`);
    return "lokasi tidak valid";
  }

  // Return dalam bentuk object
  return { provinsi, kabupaten, kecamatan, desa };
}

const cleanNik = (nik) => (nik ? nik.replace(/'/g, "").trim() : "-");

class Kelahiran extends Component {
  state = {
    kelahirans: [],
    petugas: [],
    editKelahiranModalVisible: false,
    editKelahiranModalLoading: false,
    currentRowData: {},
    addKelahiranModalVisible: false,
    addKelahiranModalLoading: false,
    importModalVisible: false,
    importedData: [],
    columnTitles: [],
    fileName: "",
    uploading: false,
    columnMapping: {},
    searchKeyword: "",
    user: null,
  };

  getKelahiran = async () => {
    const result = await getKelahiran();
    console.log(result);
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      const filteredKelahiran = content.filter((kelahirans) => {
        const {
          idKejadian,
          tanggalLaporan,
          tanggalLahir,
          lokasi,
          idPeternak,
          kartuTernakInduk,
          kartuTernakAnak,
          eartagInduk,
          eartagAnak,
          kodeEartagNasional,
          idHewanAnak,
          spesiesInduk,
          spesiesPejantan,
          idPejantanStraw,
          idBatchStraw,
          jenisKelaminAnak,
          kategori,
          petugasPelapor,
          produsenStraw,
        } = kelahirans;
        const keyword = this.state.searchKeyword.toLowerCase();

        const isIdKejadianValid = typeof idKejadian === "string";
        const isTanggalLaporanValid = typeof tanggalLaporan === "string";
        const isTanggalLahirValid = typeof tanggalLahir === "string";
        const isLokasiValid = typeof lokasi === "string";
        const isIdPeternakValid = typeof idPeternak === "string";
        const isKartuTernakIndukValid = typeof kartuTernakInduk === "string";
        const isKartuTernakAnakValid = typeof kartuTernakAnak === "string";
        const isEartagIndukValid = typeof eartagInduk === "string";
        const isEartagAnakValid = typeof eartagAnak === "string";
        const isKodeEartagNasionalValid =
          typeof kodeEartagNasional === "string";
        const isIdHewanAnakValid = typeof idHewanAnak === "string";
        const isSpesiesIndukValid = typeof spesiesInduk === "string";
        const isSpesiesPejantanValid = typeof spesiesPejantan === "string";
        const isIdPejantanStrawValid = typeof idPejantanStraw === "string";
        const isIdBatchStrawValid = typeof idBatchStraw === "string";
        const isJenisKelaminAnakValid = typeof jenisKelaminAnak === "string";
        const isKategoriValid = typeof kategori === "string";
        const isPetugasPelaporValid = typeof petugasPelapor === "string";
        const isProdusenStrawValid = typeof produsenStraw === "string";

        return (
          (isIdKejadianValid && idKejadian.toLowerCase().includes(keyword)) ||
          (isTanggalLaporanValid &&
            tanggalLaporan.toLowerCase().includes(keyword)) ||
          (isTanggalLahirValid &&
            tanggalLahir.toLowerCase().includes(keyword)) ||
          (isLokasiValid && lokasi.toLowerCase().includes(keyword)) ||
          (isIdPeternakValid && idPeternak.toLowerCase().includes(keyword)) ||
          (isKartuTernakIndukValid &&
            kartuTernakInduk.toLowerCase().includes(keyword)) ||
          (isSpesiesIndukValid &&
            spesiesInduk.toLowerCase().includes(keyword)) ||
          (isKartuTernakAnakValid &&
            kartuTernakAnak.toLowerCase().includes(keyword)) ||
          (isEartagIndukValid && eartagInduk.toLowerCase().includes(keyword)) ||
          (isEartagAnakValid && eartagAnak.toLowerCase().includes(keyword)) ||
          (isKodeEartagNasionalValid &&
            kodeEartagNasional.toLowerCase().includes(keyword)) ||
          (isIdHewanAnakValid && idHewanAnak.toLowerCase().includes(keyword)) ||
          (isSpesiesPejantanValid &&
            spesiesPejantan.toLowerCase().includes(keyword)) ||
          (isIdPejantanStrawValid &&
            idPejantanStraw.toLowerCase().includes(keyword)) ||
          (isIdBatchStrawValid &&
            idBatchStraw.toLowerCase().includes(keyword)) ||
          (isJenisKelaminAnakValid &&
            jenisKelaminAnak.toLowerCase().includes(keyword)) ||
          (isKategoriValid && kategori.toLowerCase().includes(keyword)) ||
          (isPetugasPelaporValid &&
            petugasPelapor.toLowerCase().includes(keyword)) ||
          (isProdusenStrawValid &&
            produsenStraw.toLowerCase().includes(keyword))
        );
      });

      this.setState({
        kelahirans: filteredKelahiran,
      });
    }
  };

  getKelahiranByPeternak = async (peternakID) => {
    try {
      const result = await getKelahiranByPeternak(peternakID);
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        this.setState({ kelahirans: content });
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
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

  handleSearch = (keyword) => {
    this.setState(
      {
        searchKeyword: keyword,
      },
      () => {
        this.getKelahiran();
      }
    );
  };

  handleEditKelahiran = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editKelahiranModalVisible: true,
    });
  };

  handleDeleteKelahiran = (row) => {
    const { idKejadian } = row;
    Modal.confirm({
      title: "Konfirmasi",
      content: "Apakah Anda yakin ingin menghapus data ini?",
      okText: "Ya",
      okType: "danger",
      cancelText: "Tidak",
      onOk: () => {
        deleteKelahiran({ idKejadian }).then((res) => {
          message.success("Berhasil dihapus");
          this.getKelahiran();
        });
      },
    });
  };

  handleEditKelahiranOk = (_) => {
    const { form } = this.editKelahiranFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editKelahiranModalLoading: true });
      editKelahiran(values, values.idKejadian)
        .then((response) => {
          form.resetFields();
          this.setState({
            editKelahiranModalVisible: false,
            editKelahiranModalLoading: false,
          });
          message.success("Berhasil diedit!");
          this.getKelahiran();
        })
        .catch((e) => {
          message.success("Pengeditan gagal, harap coba lagi!");
        });
    });
  };

  handleCancel = (_) => {
    this.setState({
      editKelahiranModalVisible: false,
      addKelahiranModalVisible: false,
      importModalVisible: false,
    });
  };

  handleAddKelahiran = (row) => {
    this.setState({
      addKelahiranModalVisible: true,
    });
  };

  handleAddKelahiranOk = (_) => {
    const { form } = this.addKelahiranFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addKelahiranModalLoading: true });
      addKelahiran(values)
        .then((response) => {
          form.resetFields();
          this.setState({
            addKelahiranModalVisible: false,
            addKelahiranModalLoading: false,
          });
          message.success("Berhasil menambahkan!");
          this.getKelahiran();
        })
        .catch((e) => {
          message.success("Gagal menambahkan, harap coba lagi!");
        });
    });
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
      const jsonData = utils.sheet_to_json(worksheet, { header: 1 });

      const importedData = jsonData.slice(1); // Exclude the first row (column titles)

      const columnTitles = jsonData[0]; // Assume the first row contains column titles

      // Get the file name from the imported file
      const fileName = file.name.toLowerCase();

      this.setState({
        importedData,
        columnTitles,
        fileName, // Set the fileName in the state
      });

      // Create column mapping
      const columnMapping = {};
      columnTitles.forEach((title, index) => {
        columnMapping[title] = index;
      });
      this.setState({ columnMapping });
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

  convertToJSDate(input) {
    let date;

    if (typeof input === "number") {
      const utcDays = Math.floor(input - 25569);
      const utcValue = utcDays * 86400;
      const dateInfo = new Date(utcValue * 1000);
      date = new Date(
        dateInfo.getFullYear(),
        dateInfo.getMonth(),
        dateInfo.getDate()
      ).toString();
    } else if (typeof input === "string") {
      const [day, month, year] = input.split("/");
      date = new Date(`${year}-${month}-${day}`).toString();
    }

    return date;
  }

  saveImportedData = async (columnMapping) => {
    const { importedData } = this.state;
    let errorCount = 0;

    try {
      const uniqueData = new Map();

      const jenisHewanBulk = [];
      const rumpunHewanBulk = [];
      const ternakHewanBulk = [];
      const petugasKelahiran = [];
      const peternakBulk = [];
      const inseminasiBulk = [];
      const kelahiranBulk = [];

      for (const row of importedData) {
        const generateIdKejadian = uuidv4();
        const generateIdRumpunHewan = uuidv4();
        const generateIdJenisHewan = uuidv4();
        const generateIdHewan = uuidv4();
        const generateIdPeternak = uuidv4();
        const generateIdInseminasi = uuidv4();

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

            return `${year}-${month.padStart(2, "0")}-${day.padStart(
              2,
              "0"
            )} ${timePart}`;
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
            console.warn(
              `Email tidak valid: ${email}. Menggunakan email default.`
            );
            return "default@gmail.com"; // Email default
          }
          // Jika valid, kembalikan email
          return email;
        };

        const pecahLokasi = parseLocation(
          row[columnMapping["Lokasi"]] || row[columnMapping["Alamat"]] || "-"
        );
        const generateJenisKandang = (jenisKandang) => {
          return jenisKandang || "Permanen";
        };

        console.log("Row Data:", row);

        if (!uniqueData.has(row[columnMapping["Spesies Induk"]])) {
          const dataRumpunHewan = {
            idRumpunHewan:
              row[columnMapping["ID Rumpun Hewan"]] || generateIdRumpunHewan,
            rumpun: row[columnMapping["Spesies Induk"]] || "-",
            deskripsi:
              "Deskripsi " + row[(columnMapping, ["Spesies Induk"])] || "-",
          };
          rumpunHewanBulk.push(dataRumpunHewan);
          uniqueData.set(row[columnMapping["Spesies Induk"]], true);
        }

        if (!uniqueData.has(row[columnMapping["kategori"]])) {
          const dataJenisHewan = {
            idJenisHewan:
              row[columnMapping["ID Jenis Hewan"]] || generateIdJenisHewan,
            jenis: row[columnMapping["kategori"]] || "-",
            deskripsi: "Deskripsi " + row[(columnMapping, ["kategori"])] || "-",
          };
          jenisHewanBulk.push(dataJenisHewan);
          uniqueData.set(row[columnMapping["kategori"]], true);
        }

        const dataPetugasKelahiran = {
          nikPetugas: cleanNik(row[columnMapping["NIK Petugas"]]) || "-",
          namaPetugas: row[columnMapping["Petugas Pelapor"]] || "-",
          noTelp: row[columnMapping["No. Telp Petugas"]] || "-",
          email: validateEmail(row[columnMapping["Email Petugas"]]) || "-",
          job: "Petugas Kelahiran",
        };

        const dataPeternak = {
          idPeternak: row[columnMapping["ID Peternak"]] || generateIdPeternak,
          nikPeternak: cleanNik(row[columnMapping["NIK Peternak"]]) || "-",
          namaPeternak: row[columnMapping["Nama Peternak"]] || "-",
          noTelpPeternak: row[columnMapping["No Telp"]] || "-",
          emailPeternak:
            validateEmail(row[columnMapping["Email Pemilik Ternak"]]) || "-",
          nikPetugas: dataPetugasKelahiran.nikPetugas,
          namaPetugas: dataPetugasKelahiran.namaPetugas || "-",
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
          jenisKelaminPeternak:
            row[columnMapping["Jenis Kelamin Pemilik Ternak"]] || "-",
        };

        const dataTernakHewan = {
          idHewan: row[columnMapping["ID Hewan Induk"]] || generateIdHewan,
          kodeEartagNasional: row[columnMapping["eartag_induk"]] || "_",
          noKartuTernak: row[columnMapping["kartu ternak induk"]] || "_",
          nikPetugas: dataPetugasKelahiran.nikPetugas,
          namaPetugas: dataPetugasKelahiran.namaPetugas || "_",
          // tanggalLahir: formatDateToString(
          //   row[columnMapping["Tanggal Lahir Ternak**)"]] || "_"
          // ),
          sex: row[columnMapping["Jenis Kelamin**)"]] || "_",
          tempatLahir: row[columnMapping["Tempat Lahir Ternak"]] || "_",
          umur: row[columnMapping["Umur"]] || "_",
          identifikasiHewan:
            row[columnMapping["Identifikasi Hewan*"]] ||
            row[columnMapping["Identifikasi Hewan"]] ||
            "_",
          nikPeternak: dataPeternak.nikPeternak,
          // idKandang: row[columnMapping["ID Kandang"]] || generateIdKandang,
          // namaKandang: `Kandang ${dataPeternak.namaPeternak}`,
          jenis: row[columnMapping["kategori"]] || "-",
          rumpun: row[columnMapping["Spesies Induk"]] || "-",
          idPeternak: dataPeternak.idPeternak,
          namaPeternak: dataPeternak.namaPeternak,
          tujuanPemeliharaan:
            row[columnMapping["Tujuan Pemeliharaan Ternak**)"]] || "_",
          // tanggalTerdaftar: formatDateToString(
          //   row[columnMapping["Tanggal Pendataan"]] || "_"
          // ),
        };

        const dataInseminasi = {
          idInseminasi:
            row[columnMapping["ID Inseminasi"]] || generateIdInseminasi,
          tanggalIB:
            formatDateToString(row[columnMapping["Tanggal IB"]]) || "-",
          lokasi: row[columnMapping["lokasi inseminasi"]] || "-",
          // desa: pecahLokasi.desa,
          // kecamatan: pecahLokasi.kecamatan,
          // kabupaten: pecahLokasi.kabupaten,
          // provinsi: pecahLokasi.provinsi,
          namaPeternak: dataPeternak.namaPeternak,
          idPeternak: dataPeternak.idPeternak,
          nikPeternak: dataPeternak.nikPeternak,
          idHewan: dataTernakHewan.idHewan,
          kodeEartagNasional: dataTernakHewan.kodeEartagNasional,
          ib1: row[columnMapping["IB 1"]] || "-",
          ib2: row[columnMapping["IB 2"]] || "-",
          ib3: row[columnMapping["IB 3"]] || "-",
          ibLain: row[columnMapping["IB lain"]] || "-",
          idPejantan: row[columnMapping["ID Pejantan Straw"]] || "-",
          idPembuatan: row[columnMapping["ID Batch Straw"]] || "-",
          bangsaPejantan: row[columnMapping["Spesies Pejantan"]] || "-",
          produsen: row[columnMapping["Produsen Straw"]] || "-",
          namaPetugas: dataPetugasKelahiran.namaPetugas,
          nikPetugas: dataPetugasKelahiran.nikPetugas,
        };

        // data vaksin
        const dataKelahiran = {
          idKejadian: row[columnMapping["id kejadian"]] || generateIdKejadian,
          tanggalLaporan: formatDateToString(
            row[columnMapping["Tanggal laporan"]] || "_"
          ),
          tanggalLahir: formatDateToString(
            row[columnMapping["Tanggal lahir"]] || "_"
          ),
          lokasi: row[columnMapping["Lokasi"]] || "_",
          idPeternak: dataPeternak.idPeternak,
          namaPeternak: dataPeternak.namaPeternak,
          idHewan: dataTernakHewan.idHewan,
          noKartuTernak: dataTernakHewan.noKartuTernak,
          kodeEartagNasional: dataTernakHewan.kodeEartagNasional,
          spesies: row[columnMapping["Spesies Induk"]] || "-",
          kategori: row[columnMapping["kategori"]] || "-",
          jumlah: row[columnMapping["Jumlah"]] || "_",
          eartagAnak: row[columnMapping["eartag_anak"]] || "_",
          idHewanAnak: row[columnMapping["ID Hewan Anak"]] || "_",
          jenisKelaminAnak: row[columnMapping["Jenis Kelamin Anak"]] || "_",
          nikPetugas: dataPetugasKelahiran.nikPetugas,
          namaPetugas: dataPetugasKelahiran.namaPetugas,
          urutanIB: row[columnMapping["urutan_ib"]] || "_",
        };

        petugasKelahiran.push(dataPetugasKelahiran);
        peternakBulk.push(dataPeternak);
        ternakHewanBulk.push(dataTernakHewan);
        inseminasiBulk.push(dataInseminasi);
        kelahiranBulk.push(dataKelahiran);
      }

      // Send bulk data to server
      try {
        await sendJenisHewanBulkData(jenisHewanBulk);
        await sendRumpunHewanBulkData(rumpunHewanBulk);
        await sendPetugasBulkData(petugasKelahiran);
        await sendPeternakBulkData(peternakBulk);
        await sendTernakHewanBulkData(ternakHewanBulk);
        await sendInseminasiBulkData(inseminasiBulk);
        await sendKelahiranBulkData(kelahiranBulk);
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

  // saveImportedData = async (columnMapping) => {
  //   const { importedData, kelahirans, petugas } = this.state
  //   let errorCount = 0

  //   try {
  //     for (const row of importedData) {
  //       const petugasNama = row[columnMapping['Petugas Pelapor']]?.toLowerCase()
  //       const petugasData = petugas.find(
  //         (p) => p.namaPetugas.toLowerCase() === petugasNama
  //       )
  //       const petugasId = petugasData ? petugasData.nikPetugas : null
  //       console.log(
  //         `Mencocokkan nama petugas: ${petugasNama}, Ditemukan: ${
  //           petugasData ? 'Ya' : 'Tidak'
  //         }, petugasId: ${petugasId}`
  //       )
  //       const dataToSave = {
  //         idKejadian: row[columnMapping['ID Kejadian']],
  //         tanggalLaporan: this.convertToJSDate(
  //           row[columnMapping['Tanggal laporan']]
  //         ),
  //         tanggalLahir: this.convertToJSDate(
  //           row[columnMapping['Tanggal lahir']]
  //         ),
  //         peternak_id: row[columnMapping['ID Peternak']],
  //         hewan_id: row[columnMapping['ID Hewan Induk']],
  //         petugas_id: row[columnMapping['Petugas Pelapor']],
  //         idPejantanStraw: row[columnMapping['ID Pejantan Straw']],
  //         idBatchStraw: row[columnMapping['ID Batch Straw']],
  //         produsenStraw: row[columnMapping['Produsen Straw']],
  //         spesiesPejantan: row[columnMapping['Spesies Pejantan']],
  //         eartagAnak: row[columnMapping['eartag_anak']],
  //         jenisKelaminAnak: row[columnMapping['Jenis Kelamin Anak']],
  //         spesies: row[columnMapping['kategori']],
  //         kandang_id: row[columnMapping['ID Kandang']],
  //         inseminasi_id: row[columnMapping['urutan_ib']],
  //       }
  //       const existingKelahiranIndex = kelahirans.findIndex(
  //         (p) => p.idKejadian === dataToSave.idKejadian
  //       )

  //       try {
  //         if (existingKelahiranIndex > -1) {
  //           // Update existing data
  //           await editKelahiran(dataToSave, dataToSave.idKejadian)
  //           this.setState((prevState) => {
  //             const updatedKelahiran = [...prevState.kelahirans]
  //             updatedKelahiran[existingKelahiranIndex] = dataToSave
  //             return { kelahirans: updatedKelahiran }
  //           })
  //         } else {
  //           // Add new data
  //           await addKelahiran(dataToSave)
  //           this.setState((prevState) => ({
  //             kelahirans: [...prevState.kelahirans, dataToSave],
  //           }))
  //         }
  //       } catch (error) {
  //         errorCount++
  //         console.error('Gagal menyimpan data:', error)
  //       }
  //     }

  //     if (errorCount === 0) {
  //       message.success(`Semua data berhasil disimpan.`)
  //     } else {
  //       message.error(`${errorCount} data gagal disimpan, harap coba lagi!`)
  //     }
  //   } catch (error) {
  //     console.error('Gagal memproses data:', error)
  //   } finally {
  //     this.setState({
  //       importedData: [],
  //       columnTitles: [],
  //       columnMapping: {},
  //     })
  //   }
  // }

  handleExportData = () => {
    const { kelahirans } = this.state;
    const csvContent = this.convertToCSV(kelahirans);
    this.downloadCSV(csvContent);
  };

  convertToCSV = (data) => {
    const columnTitles = [
      "ID Kejadian",
      "Tanggal Laporan",
      "Tanggal Lahir",
      "Lokasi",
      "Nama Peternak",
      "Id Peternak",
      "Id Hewan Induk",
      "Spesies Induk",
      "Id Pejantan Straw",
      "Id Batch Straw",
      "Produsen Straw",
      "Spesies Pejantan",
      "Eartag Anak",
      "Id Hewan Anak",
      "Jenis Kelamin Anak",
      "Kategori",
      "Petugas Pelopor",
      "Urutan Ib",
    ];

    const rows = [columnTitles];
    data.forEach((item) => {
      const row = [
        item.idKejadian,
        item.tanggalLaporan,
        item.tanggalLahir,
        item.peternak.lokasi,
        item.peternak.namaPeternak,
        item.peternak.idPeternak,
        item.hewan.kodeEartagNasional,
        item.hewan.spesies,
        item.idPejantanStraw,
        item.idBatchStraw,
        item.produsenStraw,
        item.spesiesPejantan,
        item.eartagAnak,
        item.idHewanAnak,
        item.jenisKelaminAnak,
        item.kategori,
        item.petugas.namaPetugas,
        item.inseminasi.idInseminasi,
      ];
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
    link.setAttribute("download", "Kelahiran.csv");
    document.body.appendChild(link);
    link.click();
  };

  componentDidMount() {
    this.getPetugas();

    reqUserInfo()
      .then((response) => {
        const user = response.data;
        this.setState({ user }, () => {
          if (user.role === "ROLE_PETERNAK") {
            this.getKelahiranByPeternak(user.username);
          } else {
            this.getKelahiran();
          }
        });
      })
      .catch((error) => {
        console.error("Terjadi kesalahan saat mengambil data user:", error);
      });
  }

  render() {
    const { kelahirans, importModalVisible, searchKeyword, user } = this.state;
    const columns = [
      { title: "ID Kejadian", dataIndex: "idKejadian", key: "idKejadian" },
      {
        title: "Tanggal Laporan",
        dataIndex: "tanggalLaporan",
        key: "tanggalLaporan",
      },
      {
        title: "Tanggal Lahir",
        dataIndex: "tanggalLahir",
        key: "tanggalLahir",
      },
      { title: "Lokasi", dataIndex: "peternak.lokasi", key: "lokasi" },
      {
        title: "Nama Peternak",
        dataIndex: "peternak.idPeternak",
        key: "namaPeternak",
      },
      {
        title: "ID Peternak",
        dataIndex: "peternak.namaPeternak",
        key: "idPeternak",
      },
      {
        title: "Eartag Induk",
        dataIndex: "hewan.kodeEartagNasional",
        key: "kodeEartagNasional",
      },
      {
        title: "Spesies Induk",
        dataIndex: "hewan.spesies",
        key: "spesiesInduk",
      },
      {
        title: "ID Pejantan Straw",
        dataIndex: "inseminasi.idPejantan",
        key: "idPejantan",
      },
      {
        title: "ID Batch Straw",
        dataIndex: "inseminasi.idPembuatan",
        key: "idPembuatan",
      },
      {
        title: "Produsen Straw",
        dataIndex: "inseminasi.produsen",
        key: "produsen",
      },
      {
        title: "Spesies Pejantan",
        dataIndex: "inseminasi.bangsaPejantan",
        key: "bangsaPejantan",
      },
      { title: "Eartag Anak", dataIndex: "eartagAnak", key: "eartagAnak" },
      {
        title: "Jenis Kelamin Anak",
        dataIndex: "jenisKelaminAnak",
        key: "jenisKelaminAnak",
      },
      { title: "Spesies", dataIndex: "spesies", key: "spesies" },
      {
        title: "Petugas Pelapor",
        dataIndex: "petugas.namaPetugas",
        key: "petugasPelapor",
      },
      { title: "Urutan IB", dataIndex: "inseminasi.ib", key: "ib" },
    ];

    const renderTable = () => {
      if (user && user.role === "ROLE_PETERNAK") {
        return <Table dataSource={kelahirans} bordered columns={columns} />;
      } else if (
        (user && user.role === "ROLE_ADMINISTRATOR") ||
        "ROLE_PETUGAS"
      ) {
        return (
          <Table
            dataSource={kelahirans}
            bordered
            columns={columns && renderColumns()}
          />
        );
      } else {
        return null;
      }
    };

    const renderButtons = () => {
      if (
        user &&
        (user.role === "ROLE_ADMINISTRATOR" || user.role === "ROLE_PETUGAS")
      ) {
        return (
          <Row gutter={[16, 16]} justify="start" style={{ paddingLeft: 9 }}>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <Button type="primary" onClick={this.handleAddKelahiran} block>
                Tambah Kelahiran
              </Button>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <Button
                icon={<UploadOutlined />}
                onClick={this.handleImportModalOpen}
                block
              >
                Import File
              </Button>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <Button
                icon={<UploadOutlined />}
                onClick={this.handleExportData}
                block
              >
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
              <Button
                type="primary"
                shape="circle"
                icon="edit"
                title="Edit"
                onClick={() => this.handleEditKelahiran(row)}
              />
              <Divider type="vertical" />
              <Button
                type="primary"
                shape="circle"
                icon="delete"
                title="Delete"
                onClick={() => this.handleDeleteKelahiran(row)}
              />
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
          <Input
            placeholder="Cari data"
            value={searchKeyword}
            onChange={(e) => this.handleSearch(e.target.value)}
            style={{ width: 235, marginLeft: 10 }}
          />
        </Col>
      </Row>
    );

    const { role } = user ? user.role : "";
    console.log("peran pengguna:", role);
    const cardContent = `Di sini, Anda dapat mengelola daftar kelahirans di sistem.`;

    return (
      <div className="app-container">
        <TypingCard title="Manajemen Kelahiran" source={cardContent} />
        <br />
        <Card title={title} style={{ overflowX: "scroll" }}>
          {renderTable()}
        </Card>
        <EditKelahiranForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) =>
            (this.editKelahiranFormRef = formRef)
          }
          visible={this.state.editKelahiranModalVisible}
          confirmLoading={this.state.editKelahiranModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditKelahiranOk}
        />
        <AddKelahiranForm
          wrappedComponentRef={(formRef) =>
            (this.addKelahiranFormRef = formRef)
          }
          visible={this.state.addKelahiranModalVisible}
          confirmLoading={this.state.addKelahiranModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddKelahiranOk}
        />
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

export default Kelahiran;
