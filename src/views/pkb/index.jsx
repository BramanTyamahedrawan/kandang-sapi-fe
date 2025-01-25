/* eslint-disable no-constant-condition */
/* eslint-disable no-unused-vars */
import { Component } from "react";
import { Card, Button, Table, message, Row, Col, Divider, Modal, Upload, Input } from "antd";
import { getPkb, getPkbByPeternak, deletePkb, editPkb, addPkb, addPkbImport } from "@/api/pkb";
import { addJenisHewanBulk } from "@/api/jenishewan";
import { addRumpunHewanBulk } from "@/api/rumpunhewan";
import { addHewanBulkImport } from "@/api/hewan";
// import { addTernakBulk } from "@/api/hewan";
import { addPeternakBulkByNama } from "@/api/peternak";
import { addPetugasBulkByNama } from "@/api/petugas";
import { addKandangBulkByNama } from "@/api/kandang";
import { getPetugas } from "@/api/petugas";
import { getHewans } from "@/api/hewan";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { read, utils } from "xlsx";
import TypingCard from "@/components/TypingCard";
import EditPkbForm from "./forms/edit-pkb-form";
import AddPkbForm from "./forms/add-pkb-form";
import { reqUserInfo } from "../../api/user";
import { v4 as uuidv4 } from "uuid";
import { getPeternaks } from "../../api/peternak";
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

export const sendPkbImport = async (data, batchSize = 7000) => {
  const totalBatches = Math.ceil(data.length / batchSize);

  for (let i = 0; i < totalBatches; i++) {
    const batchData = data.slice(i * batchSize, (i + 1) * batchSize);

    try {
      console.log(`Data PKB (Batch ${i + 1}):`, batchData); // Log data yang dikirim
      const response = await addPkbImport(batchData);
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

class Pkb extends Component {
  state = {
    pkb: [],
    petugas: [],
    editPkbModalVisible: false,
    editPkbModalLoading: false,
    currentRowData: {},
    addPkbModalVisible: false,
    addPkbModalLoading: false,
    importModalVisible: false,
    importedData: [],
    columnTitles: [],
    fileName: "",
    uploading: false,
    columnMapping: {},
    searchKeyword: "",
    user: null,
  };

  // Fungsi ambil data dari database
  getPkb = async () => {
    const result = await getPkb();
    console.log(result);
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      const filteredPKB = content.filter((pkb) => {
        const { idKejadian, idPeternak, kodeEartagNasional, tanggalPkb, lokasi, namaPeternak, nikPeternak, spesies, kategori, pemeriksaKebuntingan } = pkb;
        const keyword = this.state.searchKeyword.toLowerCase();

        const isIdKejadianValid = typeof idKejadian === "string";
        const isIdPeternakValid = typeof idPeternak === "string";
        const isKodeEartagNasionalValid = typeof kodeEartagNasional === "string";
        const isTanggalPKBValid = typeof tanggalPkb === "string";
        const isLokasiValid = typeof lokasi === "string";
        const isNamaPeternakValid = typeof namaPeternak === "string";
        const isNikPeternakValid = typeof nikPeternak === "string";
        const isSpesiesValid = typeof spesies === "string";
        const isKategoriValid = typeof kategori === "string";
        const isPemeriksaKebuntinganValid = typeof pemeriksaKebuntingan === "string";

        return (
          (isIdKejadianValid && idKejadian.toLowerCase().includes(keyword)) ||
          (isIdPeternakValid && idPeternak.toLowerCase().includes(keyword)) ||
          (isKodeEartagNasionalValid && kodeEartagNasional.toLowerCase().includes(keyword)) ||
          (isTanggalPKBValid && tanggalPkb.toLowerCase().includes(keyword)) ||
          (isLokasiValid && lokasi.toLowerCase().includes(keyword)) ||
          (isNamaPeternakValid && namaPeternak.toLowerCase().includes(keyword)) ||
          (isNikPeternakValid && nikPeternak.toLowerCase().includes(keyword)) ||
          (isSpesiesValid && spesies.toLowerCase().includes(keyword)) ||
          (isKategoriValid && kategori.toLowerCase().includes(keyword)) ||
          (isPemeriksaKebuntinganValid && pemeriksaKebuntingan.toLowerCase().includes(keyword))
        );
      });

      this.setState({
        pkb: filteredPKB,
      });
    }
  };

  getPkbByPeternak = async (peternakID) => {
    try {
      const result = await getPkbByPeternak(peternakID);
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        this.setState({ pkb: content });
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

  // getHewan = async () => {
  //   const result = await getHewans();
  //   const { content, statusCode } = result.data;

  //   if (statusCode === 200) {
  //     this.setState({
  //       hewan: content,
  //     });
  //   }
  // };

  getPeternak = async () => {
    const result = await getPeternaks();
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      this.setState({
        peternak: content,
      });
    }
  };

  handleSearch = (keyword) => {
    this.setState(
      {
        searchKeyword: keyword,
      },
      () => {
        this.getPkb();
      }
    );
  };

  // Fungsi Import File Csv
  handleImportModalOpen = () => {
    this.setState({ importModalVisible: true });
  };

  handleImportModalClose = () => {
    this.setState({ importModalVisible: false });
  };

  // Fungsi Edit Pkb
  handleEditPkb = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editPkbModalVisible: true,
    });
  };

  handleEditPkbOk = (_) => {
    const { form } = this.editPkbFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editModalLoading: true });
      editPkb(values, values.idKejadian)
        .then((response) => {
          form.resetFields();
          this.setState({
            editPkbModalVisible: false,
            editPkbModalLoading: false,
          });
          message.success("Berhasil diedit!");
          this.getPkb();
        })
        .catch((e) => {
          message.error("Pengeditan gagal, harap coba lagi!");
        });
    });
  };

  handleDeletePkb = (row) => {
    const { idKejadian } = row;
    Modal.confirm({
      title: "Konfirmasi",
      content: "Apakah Anda yakin ingin menghapus data ini?",
      okText: "Ya",
      okType: "danger",
      cancelText: "Tidak",
      onOk: () => {
        deletePkb({ idKejadian }).then((res) => {
          message.success("Berhasil dihapus");
          this.getPkb();
        });
      },
    });
  };

  handleAddPkb = (row) => {
    this.setState({
      addPkbModalVisible: true,
    });
  };

  handleAddPkbOk = (_) => {
    const { form } = this.addPkbFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addPkbModalLoading: true });
      addPkb(values)
        .then((response) => {
          form.resetFields();
          this.setState({
            addPkbModalVisible: false,
            addPkbModalLoading: false,
          });
          message.success("Berhasil menambahkan!");
          this.getPkb();
        })
        .catch((e) => {
          message.error("Gagal menambahkan, harap coba lagi!");
        });
    });
  };

  handleCancel = (_) => {
    this.setState({
      editPkbModalVisible: false,
      addPkbModalVisible: false,
    });
  };

  componentDidMount() {
    this.getPetugas();

    reqUserInfo()
      .then((response) => {
        const user = response.data;
        this.setState({ user }, () => {
          if (user.role === "ROLE_PETERNAK") {
            this.getPkbByPeternak(user.username);
          } else {
            this.getPkb();
          }
        });
      })
      .catch((error) => {
        console.error("Terjadi kesalahan saat mengambil data user:", error);
      });
  }

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
      date = new Date(dateInfo.getFullYear(), dateInfo.getMonth(), dateInfo.getDate()).toString();
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

      const pkb = [];
      const jenisHewanBulk = [];
      const rumpunHewanBulk = [];
      const ternakHewanBulk = [];
      const petugasPendataanBulk = [];
      const peternakBulk = [];
      const kandangBulk = [];

      for (const row of importedData) {
        const generateIdKejadian = uuidv4();
        const generateIdRumpunHewan = uuidv4();
        const generateIdJenisHewan = uuidv4();
        const generateIdHewan = uuidv4();
        const generateIdPeternak = uuidv4();
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

        console.log("Row Data:", row);

        if (!uniqueData.has(row[columnMapping["Spesies"]])) {
          const dataRumpunHewan = {
            idRumpunHewan: row[columnMapping["ID Rumpun Hewan"]] || generateIdRumpunHewan,
            rumpun: row[columnMapping["Spesies"]] || "-",
            deskripsi: "Deskripsi " + row[(columnMapping, ["Spesies"])] || "-",
          };
          rumpunHewanBulk.push(dataRumpunHewan);
          uniqueData.set(row[columnMapping["Spesies"]], true);
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

        const dataPetugasPemeriksa = {
          nikPetugas: cleanNik(row[columnMapping["NIK Petugas"]]) || "-",
          namaPetugas: row[columnMapping["Pemeriksa Kebuntingan"]] || "-",
          noTelp: row[columnMapping["No. Telp Petugas"]] || "-",
          email: validateEmail(row[columnMapping["Email Petugas"]]) || "-",
          job: "Pemeriksa Kebuntingan",
        };

        const dataPeternak = {
          idPeternak: row[columnMapping["ID Peternak"]] || generateIdPeternak,
          nikPeternak: cleanNik(row[columnMapping["NIK Peternak"]]) || "-",
          namaPeternak: row[columnMapping["Nama Peternak"]] || "-",
          noTelpPeternak: row[columnMapping["No Telp"]] || "-",
          emailPeternak: validateEmail(row[columnMapping["Email Pemilik Ternak"]]) || "-",
          nikPetugas: cleanNik(row[columnMapping["NIK Petugas"]]) || "-",
          namaPetugas: row[columnMapping["Pemeriksa Kebuntingan"]] || "-",
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
          kodeEartagNasional: row[columnMapping["Kode Eartag Nasional"]] || "_",
          noKartuTernak: row[columnMapping["No Kartu Ternak"]] || "_",
          nikPetugas: cleanNik(row[columnMapping["NIK Petugas Pendataan*)"]]),
          namaPetugas: dataPetugasPemeriksa.namaPetugas || "_",
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
          jenis: row[columnMapping["kategori"]] || "_",
          rumpun: row[columnMapping["Spesies"]] || "_",
          idPeternak: dataPeternak.idPeternak,
          namaPeternak: dataPeternak.namaPeternak,
          tujuanPemeliharaan: row[columnMapping["Tujuan Pemeliharaan Ternak**)"]] || "_",
          // tanggalTerdaftar: formatDateToString(
          //   row[columnMapping["Tanggal Pendataan"]] || "_"
          // ),
        };

        const dataPkb = {
          idKejadian: row[columnMapping["ID Kejadian"]] || generateIdKejadian,
          tanggalPkb: formatDateToString(row[columnMapping["Tanggal PKB"]]),
          lokasi: row[columnMapping["Lokasi"]] || "-",
          jumlah: row[columnMapping["Jumlah"]] || "-",
          umurKebuntingan: row[columnMapping["Umur Kebuntingan saat PKB (bulan)"]],
          spesies: row[columnMapping["Spesies"]] || "-",
          idPeternak: dataPeternak.idPeternak || generateIdPeternak,
          namaPeternak: dataPeternak.namaPeternak || "-",
          nikPeternak: dataPeternak.nikPeternak || "-",
          nikPetugas: cleanNik(row[columnMapping["NIK Petugas"]]) || "-",
          namaPetugas: row[columnMapping["Pemeriksa Kebuntingan"]] || "-",
          idKandang: dataKandang.idKandang || generateIdKandang,
          namaKandang: dataKandang.namaKandang || "-",
          idHewan: dataTernakHewan.idHewan || generateIdHewan,
          kodeEartagNasional: row[columnMapping["Kode Eartag Nasional"]] || "-",
          rumpun: row[columnMapping["Spesies"]] || "-",
          jenis: row[columnMapping["kategori"]] || "-",
        };

        petugasPendataanBulk.push(dataPetugasPemeriksa);
        peternakBulk.push(dataPeternak);
        kandangBulk.push(dataKandang);
        ternakHewanBulk.push(dataTernakHewan);
        pkb.push(dataPkb);
      }

      // Send bulk data to server
      try {
        await sendJenisHewanBulkData(jenisHewanBulk);
        await sendRumpunHewanBulkData(rumpunHewanBulk);
        await sendPetugasBulkData(petugasPendataanBulk);
        await sendPeternakBulkData(peternakBulk);
        await sendKandangBulkData(kandangBulk);
        await sendTernakHewanBulkData(ternakHewanBulk);
        await sendPkbImport(pkb);
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

  handleDownloadCSV = () => {
    const csvContent = this.convertHeaderToCSV();
    this.downloadFormatCSV(csvContent);
  };

  convertHeaderToCSV = () => {
    const columnTitlesLocal = ["No", "ID Kejadian", "Nama Peternak", "Nik Peternak", "ID Hewan", "Spesies", "kategori", "Jumlah", "Umur Kebuntingan saat PKB (bulan)", "Pemeriksa Kebuntingan"];
    const exampleRow = ["1", "Contoh 78210308", "Contoh Sugi", "Contoh 3508070507040006", "Contoh 090439", "Contoh sapi limosin", "Contoh sapi potong", "Contoh 1", "Contoh 5", "Contoh Irfan Setiyawan P."];

    // Gabungkan header dan contoh data
    const rows = [columnTitlesLocal, exampleRow];

    // Gabungkan semua baris dengan delimiter koma
    const csvContent = rows
      .map((row) =>
        row
          .map((item) => `"${item.replace(/"/g, '""')}"`) // Escaping kutip ganda jika ada
          .join(",")
      )
      .join("\n");
    return csvContent;
  };

  downloadFormatCSV = (csvContent) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.setAttribute("download", "format_pkb.csv");
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fungsi Export dari database ke file csv
  handleExportData = () => {
    const { pkb } = this.state;
    const csvContent = this.convertToCSV(pkb);
    this.downloadCSV(csvContent);
  };

  convertToCSV = (data) => {
    const columnTitles = ["ID Kejadian", "Tanggal PKB", "Lokasi", "Nama Peternak", "NIK Peternak", "ID Hewan", "Spesies", "Kategori", "Umur Kebuntingan saat PKB (bulan)", "Pemeriksa Kebuntingan"];

    const rows = [columnTitles];
    data.forEach((item) => {
      const row = [item.idKejadian, item.tanggalPkb, item.peternak.lokasi, item.peternak.namaPeternak, item.peternak.nikPeternak, item.hewan.kodeEartagNasional, item.spesies, item.kategori, item.umurKebuntingan, item.pemeriksaKebuntingan];
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
    link.setAttribute("download", "Pkb.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
  };

  render() {
    const { pkb, importModalVisible, searchKeyword, user } = this.state;
    const columns = [
      { title: "ID Kejadian", dataIndex: "idKejadian", key: "idKejadian" },
      { title: "Tanggal PKB", dataIndex: "tanggalPkb", key: "tanggalPkb" },
      { title: "Lokasi", dataIndex: "lokasi", key: "lokasi" },
      {
        title: "Nama Peternak",
        dataIndex: ["peternak", "namaPeternak"],
        key: "namaPeternak",
      },
      {
        title: "ID Hewan",
        dataIndex: ["hewan", "idHewan"],
        key: "idHewan",
      },
      {
        title: "Species",
        dataIndex: ["rumpunHewan", "rumpun"],
        key: "rumpun",
      },
      {
        title: "Kategori",
        dataIndex: ["jenisHewan", "jenis"],
        key: "jenis",
      },
      {
        title: "Jumlah",
        dataIndex: "jumlah",
        key: "jumlah",
      },
      {
        title: "Umur Kebuntingan",
        dataIndex: "umurKebuntingan",
        key: "umurKebuntingan",
      },
      {
        title: "Pemeriksa Kebuntingan",
        dataIndex: ["petugas", "namaPetugas"],
        key: "namaPetugas",
      },
    ];

    const renderTable = () => {
      if (user && user.role === "ROLE_PETERNAK") {
        return <Table dataSource={pkb} bordered columns={columns} />;
      } else if ((user && user.role === "ROLE_ADMINISTRATOR") || "ROLE_PETUGAS") {
        return <Table dataSource={pkb} bordered columns={columns && renderColumns()} rowKey={(row) => row.idKejadian} />;
      } else {
        return null;
      }
    };

    const renderButtons = () => {
      if (user && (user.role === "ROLE_ADMINISTRATOR" || user.role === "ROLE_PETUGAS")) {
        return (
          <Row gutter={[16, 16]} justify="start" style={{ paddingLeft: 9 }}>
            <Col>
              <Button type="primary" onClick={this.handleAddPkb} block>
                Tambah PKB
              </Button>
            </Col>
            <Col>
              <Button icon={<UploadOutlined />} onClick={this.handleImportModalOpen} block>
                Import File
              </Button>
            </Col>
            <Col>
              <Button icon={<DownloadOutlined />} onClick={this.handleDownloadCSV} block>
                Download Fornat CSV
              </Button>
            </Col>
            <Col>
              <Button icon={<UploadOutlined />} onClick={this.handleExportData} block>
                Export Data To CSV
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
              <Button type="primary" shape="circle" icon="edit" title="Edit" onClick={() => this.handleEditPkb(row)} />
              <Divider type="vertical" />
              <Button type="primary" shape="circle" icon="delete" title="Delete" onClick={() => this.handleDeletePkb(row)} />
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

    const { role } = user ? user.role : "";
    console.log("peran pengguna:", role);
    const cardContent = `Di sini, Anda dapat mengelola daftar pkb di sistem.`;
    return (
      <div className="app-container">
        {/* TypingCard component */}

        <TypingCard title="Manajemen Hewan" source={cardContent} />
        <br />

        <Card title={title} style={{ overflowX: "scroll" }}>
          {renderTable()}
        </Card>

        <EditPkbForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) => (this.editPkbFormRef = formRef)}
          visible={this.state.editPkbModalVisible}
          confirmLoading={this.state.editPkbModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditPkbOk}
        />
        <AddPkbForm wrappedComponentRef={(formRef) => (this.addPkbFormRef = formRef)} visible={this.state.addPkbModalVisible} confirmLoading={this.state.addPkbModalLoading} onCancel={this.handleCancel} onOk={this.handleAddPkbOk} />

        {/* Modal Import */}
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

export default Pkb;
