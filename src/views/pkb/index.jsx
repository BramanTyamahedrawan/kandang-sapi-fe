/* eslint-disable no-unused-vars */
import { addHewanBulkImport } from "@/api/hewan";
import { addJenisHewanBulk } from "@/api/jenishewan";
import { addKandangBulkByNama } from "@/api/kandang";
import { addPeternakBulkByNama } from "@/api/peternak";
import { addPetugasBulkByNama, getPetugas } from "@/api/petugas";
import {
  addPkb,
  addPkbImport,
  deletePkb,
  editPkb,
  getPkb
} from "@/api/pkb";
import { addRumpunHewanBulk } from "@/api/rumpunhewan";
import TypingCard from "@/components/TypingCard";
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  Input,
  message,
  Modal,
  Row,
  Skeleton,
  Space,
  Table,
  Upload,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { v4 as uuidv4 } from "uuid";
import { read, utils } from "xlsx";
import { getPeternaks } from "../../api/peternak";
import { reqUserInfo } from "../../api/user";
import AddPkbForm from "./forms/add-pkb-form";
import EditPkbForm from "./forms/edit-pkb-form";

const sendPetugasBulkData = async (data, batchSize = 7000) => {
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

const sendPeternakBulkData = async (data, batchSize = 7000) => {
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

const sendKandangBulkData = async (data, batchSize = 7000) => {
  const totalBatches = Math.ceil(data.length / batchSize);

  for (let i = 0; i < totalBatches; i++) {
    const batchData = data.slice(i * batchSize, (i + 1) * batchSize);

    try {
      console.log(`Data Kandang (Batch ${i + 1}):`, batchData); // Log data yang dikirim
      const response = await addKandangBulkByNama(batchData);
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

const sendPkbImport = async (data, batchSize = 7000) => {
  const totalBatches = Math.ceil(data.length / batchSize);

  for (let i = 0; i < totalBatches; i++) {
    const batchData = data.slice(i * batchSize, (i + 1) * batchSize);

    try {
      console.log(`Data PKB (Batch ${i + 1}):`, batchData); // Log data yang dikirim
      const response = await addPkbImport(batchData);
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

function parseAddress(address) {
  // Pastikan alamat berupa string, jika tidak kembalikan "alamat tidak valid"
  if (typeof address !== "string" || !address) {
    console.warn(`Alamat tidak valid: ${address}`);
    return "alamat tidak valid";
  }

  // Pecah alamat berdasarkan koma
  const parts = address.split(",").map((part) => part.trim());

  // Ambil masing-masing bagian sesuai urutan, isi dengan "-" jika tidak ada
  const dusun = parts[4] || "-";
  const desa = parts[3] || "-";
  const kecamatan = parts[2] || "-";
  const kabupaten = parts[1]?.replace(/KAB\. /i, "") || "-"; // Hapus "KAB." jika ada
  const provinsi = parts[0] || "-";

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

const cleanNik = (nik) => {
  return nik ? String(nik).replace(/'/g, "").trim() : "-";
};

const Pkb = () => {
  const [pkb, setPkb] = useState([]);
  const [petugas, setPetugas] = useState([]);
  const [editPkbModalVisible, setEditPkbModalVisible] = useState(false);
  const [editPkbModalLoading, setEditPkbModalLoading] = useState(false);
  const [currentRowData, setCurrentRowData] = useState({});
  const [addPkbModalVisible, setAddPkbModalVisible] = useState(false);
  const [addPkbModalLoading, setAddPkbModalLoading] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importedData, setImportedData] = useState([]);
  const [columnTitles, setColumnTitles] = useState([]);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [columnMapping, setColumnMapping] = useState({});
  const [searchKeyword, setSearchKeyword] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const searchInput = useRef(null);
  const editPkbFormRef = useRef();
  const addPkbFormRef = useRef();

  useEffect(() => {
    const fetchInitialData = async () => {
      await getPetugasData();
      await getPeternaksData();

      try {
        const response = await reqUserInfo();
        const userData = response.data;
        setUser(userData);

        if (userData.role === "ROLE_PETERNAK") {
          await getPkbByPeternak(userData.username);
        } else {
          await getPkbData();
        }
      } catch (error) {
        console.error("Terjadi kesalahan saat mengambil data user:", error);
      }
    };

    fetchInitialData();
  }, []);

  const getPkbData = async () => {
    setLoading(true);
    try {
      const result = await getPkb();
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        const filteredPKB = content
          .filter((pkb) => {
            const {
              idPkb,
              idKejadian,
              tanggalPkb,
              jumlah,
              umurKebuntingan,
              idPetugas,
              idPeternak,
              idHewan,
              idKandang,
              idRumpunHewan,
              idJenisHewan,
            } = pkb;
            const keyword = searchKeyword.toLowerCase();

            return (
              (typeof idPkb === "string" &&
                idPkb.toLowerCase().includes(keyword)) ||
              (typeof idKejadian === "string" &&
                idKejadian.toLowerCase().includes(keyword)) ||
              (typeof tanggalPkb === "string" &&
                tanggalPkb.toLowerCase().includes(keyword)) ||
              (typeof jumlah === "string" &&
                jumlah.toLowerCase().includes(keyword)) ||
              (typeof umurKebuntingan === "string" &&
                umurKebuntingan.toLowerCase().includes(keyword)) ||
              (typeof idPetugas === "string" &&
                idPetugas.toLowerCase().includes(keyword)) ||
              (typeof idPeternak === "string" &&
                idPeternak.toLowerCase().includes(keyword)) ||
              (typeof idHewan === "string" &&
                idHewan.toLowerCase().includes(keyword)) ||
              (typeof idKandang === "string" &&
                idKandang.toLowerCase().includes(keyword)) ||
              (typeof idRumpunHewan === "string" &&
                idRumpunHewan.toLowerCase().includes(keyword)) ||
              (typeof idJenisHewan === "string" &&
                idJenisHewan.toLowerCase().includes(keyword))
            );
          })
          .sort((a, b) => {
            return new Date(b.tanggalPkb) - new Date(a.tanggalPkb);
          });

        setPkb(filteredPKB);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPkbByPeternak = async (peternakID) => {
    try {
      const result = await getPkbByPeternak(peternakID);
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        setPkb(content);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const getPetugasData = async () => {
    try {
      const result = await getPetugas();
      const { content, statusCode } = result.data;

      if (statusCode === 200) {
        setPetugas(content);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const getPeternaksData = async () => {
    try {
      const result = await getPeternaks();
      const { content, statusCode } = result.data;

      if (statusCode === 200) {
        setPetugas(content);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  // const handleSearch = (keyword) => {
  //   setSearchKeyword(keyword);
  //   getPkbData();
  // };

  const handleImportModalOpen = () => {
    setImportModalVisible(true);
  };

  const handleImportModalClose = () => {
    setImportModalVisible(false);
  };

  const handleCancel = () => {
    setEditPkbModalVisible(false);
    setAddPkbModalVisible(false);
    setImportModalVisible(false);
  };

  const handleAddPkb = () => {
    setAddPkbModalVisible(true);
  };

  const handleAddPkbOk = async (values) => {
    setAddPkbModalLoading(true);
    setLoading(true);
    try {
      console.log("Data yang dikirim:", values);
      await addPkb(values);
      setAddPkbModalVisible(false);
      setAddPkbModalLoading(false);
      message.success("Berhasil menambahkan!");
      getPkbData();
    } catch (error) {
      console.error("Gagal menambahkan, harap coba lagi!", error);
      message.error("Gagal menambahkan, harap coba lagi!");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPkb = (row) => {
    setCurrentRowData({ ...row });
    setEditPkbModalVisible(true);
  };

  const handleEditPkbOk = async (values) => {
    setEditPkbModalLoading(true);
    setLoading(true);
    try {
      console.log("Edit pkb values: ", values);
      await editPkb(values, currentRowData.idPkb);
      setEditPkbModalVisible(false);
      setEditPkbModalLoading(false);
      message.success("Berhasil diedit!");
      getPkbData();
    } catch (error) {
      console.error("Pengeditan gagal, harap coba lagi!", error);
      message.error("Pengeditan gagal, harap coba lagi!");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePkb = (row) => {
    const { idPkb } = row;
    Modal.confirm({
      title: "Konfirmasi",
      content: "Apakah Anda yakin ingin menghapus data ini?",
      okText: "Ya",
      okType: "danger",
      cancelText: "Tidak",
      onOk: async () => {
        setLoading(true);
        try {
          await deletePkb({ idPkb });
          message.success("Berhasil dihapus");
          getPkbData();
        } catch (error) {
          console.error("Gagal menghapus data:", error);
          message.error("Gagal menghapus data, harap coba lagi.");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleFileImport = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      const jsonData = utils.sheet_to_json(worksheet, {
        header: 1,
        blankrows: false,
        defval: null,
      });

      const importedData = jsonData.slice(1); // Mengambil data tanpa header
      const columnTitles = jsonData[0]; // Mengambil judul kolom dari baris pertama

      const columnMapping = {};
      columnTitles.forEach((title, index) => {
        columnMapping[title.trim()] = index;
      });

      // Mengupdate state menggunakan hooks
      setImportedData(importedData);
      setColumnTitles(columnTitles);
      setFileName(file.name.toLowerCase());
      setColumnMapping(columnMapping);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleUpload = () => {
    if (importedData.length === 0) {
      message.error("No data to import.");
      return;
    }

    setUploading(true);

    saveImportedData(columnMapping)
      .then(() => {
        setUploading(false);
        setImportModalVisible(false);
        message.success("Berhasil mengunggah data.");
      })
      .catch((error) => {
        console.error("Gagal mengunggah data:", error);
        setUploading(false);
        message.error("Gagal mengunggah data, harap coba lagi.");
      });
  };

  const saveImportedData = async (columnMapping) => {
    let errorCount = 0;

    try {
      const uniqueData = new Map();

      const pkb = [];
      const jenisHewanBulk = [];
      const rumpunHewanBulk = [];
      const ternakHewanBulk = [];
      const petugasPemeriksaBulk = [];
      const peternakBulk = [];
      const kandangBulk = [];

      for (const row of importedData) {
        const generateIdPkb = uuidv4();
        const generateIdRumpunHewan = uuidv4();
        const generateIdJenisHewan = uuidv4();
        const generateIdHewan = uuidv4();
        const generateIdPeternak = uuidv4();
        const generateIdKandang = uuidv4();
        const generateIdPetugas = uuidv4();

        const formatDateToString = (dateString) => {
          // Jika data berisi null atau "-", keluarkan "-"
          if (dateString === null || dateString === "-") {
            return "-";
          }

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

        const pecahLokasi = parseAddress(
          row[columnMapping["Lokasi"]] || row[columnMapping["Alamat"]] || "-"
        );
        const generateJenisKandang = (jenisKandang) => {
          return jenisKandang || "Permanen";
        };

        const rumpunHewanUnique = row[columnMapping["Spesies"]] || "-";
        if (!uniqueData.has(rumpunHewanUnique)) {
          const dataRumpunHewan = {
            idRumpunHewan: generateIdRumpunHewan,
            rumpun: row[columnMapping["Spesies"]] || "-",
            deskripsi: "Deskripsi " + row[(columnMapping, ["Spesies"])] || "-",
          };
          // rumpunHewanBulk.push(dataRumpunHewan);
          uniqueData.set(rumpunHewanUnique, dataRumpunHewan);
        }

        const jenisHewanUnique = row[columnMapping["kategori"]] || "-";
        if (!uniqueData.has(jenisHewanUnique)) {
          const dataJenisHewan = {
            idJenisHewan: generateIdJenisHewan,
            jenis: row[columnMapping["kategori"]] || "-",
            deskripsi: "Deskripsi " + row[(columnMapping, ["kategori"])] || "-",
          };
          // jenisHewanBulk.push(dataJenisHewan);
          uniqueData.set(jenisHewanUnique, dataJenisHewan);
        }

        const namaPetugasPemeriksa =
          row[columnMapping["Pemeriksa Kebuntingan"]] || "-";
        if (!uniqueData.has(namaPetugasPemeriksa)) {
          const dataPetugasPemeriksa = {
            petugasId: generateIdPetugas,
            nikPetugas: cleanNik(row[columnMapping["NIK Petugas"]]) || "-",
            namaPetugas: row[columnMapping["Pemeriksa Kebuntingan"]] || "-",
            noTelp: row[columnMapping["No. Telp Petugas"]] || "-",
            email: validateEmail(row[columnMapping["Email Petugas"]]) || "-",
            job: "Pemeriksa Kebuntingan",
          };
          // petugasPemeriksaBulk.push(dataPetugasPemeriksa);
          uniqueData.set(namaPetugasPemeriksa, dataPetugasPemeriksa);
        }

        // const nikDataPeternak = row[columnMapping["NIK Peternak"]]
        //   ? cleanNik(row[columnMapping["NIK Peternak"]])
        //   : row[columnMapping["ID Peternak"]] || "-";

        const namaPemilikTernak = row[columnMapping["Nama Peternak"]] || "-";
        if (!uniqueData.has(namaPemilikTernak)) {
          const dataPeternak = {
            idPeternak: generateIdPeternak,
            nikPeternak:  row[columnMapping["NIK Peternak"]] || "-",
            namaPeternak: row[columnMapping["Nama Peternak"]] || "-",
            noTelpPeternak: row[columnMapping["No Telp"]] || "-",
            emailPeternak:
              validateEmail(row[columnMapping["Email Pemilik Ternak"]]) || "-",
            idPetugas: uniqueData.get(namaPetugasPemeriksa).petugasId,
            nikPetugas: uniqueData.get(namaPetugasPemeriksa).nikPetugas,
            namaPetugas: uniqueData.get(namaPetugasPemeriksa).namaPetugas,
            alamat: row[columnMapping["Lokasi"]] || "-",
            dusun: pecahLokasi.dusun,
            desa: pecahLokasi.desa,
            kecamatan: pecahLokasi.kecamatan,
            kabupaten: pecahLokasi.kabupaten,
            provinsi: pecahLokasi.provinsi,
            tanggalLahirPeternak: formatDateToString(
              row[columnMapping["Tanggal Lahir Pemilik Ternak"]] || "-"
            ),
            latitude: row[columnMapping["latitude"]] || "-",
            longitude: row[columnMapping["longitude"]] || "-",
            idIsikhnas: row[columnMapping["ID Isikhnas*)"]] || "-",
            jenisKelaminPeternak:
              row[columnMapping["Jenis Kelamin Pemilik Ternak"]] || "-",
          };
          // peternakBulk.push(dataPeternak);
          uniqueData.set(namaPemilikTernak, dataPeternak);
        }

        const namaKandang = `Kandang ${
          uniqueData.get(jenisHewanUnique).jenis
        } ${uniqueData.get(namaPemilikTernak).namaPeternak}`;
        if (!uniqueData.has(namaKandang)) {
          const dataKandang = {
            idKandang: generateIdKandang,
            jenis: uniqueData.get(jenisHewanUnique).jenis,
            idPeternak: uniqueData.get(namaPemilikTernak).idPeternak,
            nikPeternak: uniqueData.get(namaPemilikTernak).nikPeternak,
            namaPeternak: uniqueData.get(namaPemilikTernak).namaPeternak,
            namaKandang: namaKandang,
            alamat: row[columnMapping["Alamat Kandang"]] || "-",
            luas: row[columnMapping["Luas Kandang"]] || "-",
            kapasitas: row[columnMapping["Kapasitas Kandang"]] || "-",
            nilaiBangunan: row[columnMapping["Nilai Bangunan"]] || "-",
            jenisKandang: generateJenisKandang(
              row[columnMapping["Jenis Kandang"]]
            ),
            latitude: row[columnMapping["latitude"]] || "-",
            longitude: row[columnMapping["longitude"]] || "-",
          };
          // kandangBulk.push(dataKandang);
          uniqueData.set(namaKandang, dataKandang);
        }

        const dataTernakHewan = {
          idHewan: generateIdHewan,
          kodeEartagNasional: row[columnMapping["Kode Eartag Nasional"]] || "-",
          noKartuTernak:
            row[columnMapping["No Kartu Ternak"]] ||
            row[columnMapping["ID Hewan"]] ||
            "-",
          idIsikhnasTernak: row[columnMapping["IdIsikhnas"]] || "-",
          tanggalLahir: formatDateToString(
            row[columnMapping["Tanggal Lahir Ternak"]] || "-"
          ),
          sex: row[columnMapping["Jenis Kelamin Ternak"]] || "-",
          tempatLahir: row[columnMapping["Tempat Lahir Ternak"]] || "-",
          umur: row[columnMapping["Umur"]] || "-",
          identifikasiHewan:
            row[columnMapping["Identifikasi Hewan*"]] ||
            row[columnMapping["Identifikasi Hewan"]] ||
            "-",
          tanggalTerdaftar: formatDateToString(
            row[columnMapping["Tanggal Pendataan"]] || "-"
          ),
          idPetugas: uniqueData.get(namaPetugasPemeriksa).petugasId,
          namaPetugas: uniqueData.get(namaPetugasPemeriksa).namaPetugas,
          nikPetugas: uniqueData.get(namaPetugasPemeriksa).nikPetugas,
          idKandang: uniqueData.get(namaKandang).idKandang,
          namaKandang: uniqueData.get(namaKandang).namaKandang,
          jenis: uniqueData.get(jenisHewanUnique).jenis,
          rumpun: uniqueData.get(rumpunHewanUnique).rumpun,
          idPeternak: uniqueData.get(namaPemilikTernak).idPeternak,
          namaPeternak: uniqueData.get(namaPemilikTernak).namaPeternak,
          nikPeternak: uniqueData.get(namaPemilikTernak).nikPeternak,
          tujuanPemeliharaan:
            row[columnMapping["Tujuan Pemeliharaan Ternak"]] || "-",
        };

        const dataPkb = {
          idPkb: generateIdPkb,
          idKejadian: row[columnMapping["ID Kejadian"]] || "-",
          tanggalPkb:
            formatDateToString(row[columnMapping["Tanggal PKB"]]) || "-",
          jumlah: row[columnMapping["Jumlah"]] || "-",
          umurKebuntingan:
            row[columnMapping["Umur Kebuntingan saat PKB (bulan)"]] ||
            row[columnMapping["Umur Kebuntingan"]] ||
            "-",
          idPeternak: uniqueData.get(namaPemilikTernak).idPeternak,
          namaPeternak: uniqueData.get(namaPemilikTernak).namaPeternak,
          nikPeternak: uniqueData.get(namaPemilikTernak).nikPeternak,
          nikPetugas: uniqueData.get(namaPetugasPemeriksa).nikPetugas,
          namaPetugas: uniqueData.get(namaPetugasPemeriksa).namaPetugas,
          idKandang: uniqueData.get(namaKandang).idKandang,
          namaKandang: uniqueData.get(namaKandang).namaKandang,
          idHewan: dataTernakHewan.idHewan,
          kodeEartagNasional: row[columnMapping["Kode Eartag Nasional"]] || "-",
          noKartuTernak:
            row[columnMapping["No Kartu Ternak"]] ||
            row[columnMapping["ID Hewan"]] ||
            "-",
          idIsikhnasTernak: row[columnMapping["IdIsikhnas"]] || "-",
          tanggalLahir: formatDateToString(
            row[columnMapping["Tanggal Lahir Ternak"]] || "-"
          ),
          sex: row[columnMapping["Jenis Kelamin Ternak"]] || "-",
          tempatLahir: row[columnMapping["Tempat Lahir Ternak"]] || "-",
          umur: row[columnMapping["Umur"]] || "-",
          identifikasiHewan:
            row[columnMapping["Identifikasi Hewan*"]] ||
            row[columnMapping["Identifikasi Hewan"]] ||
            "-",
          tanggalTerdaftar: formatDateToString(
            row[columnMapping["Tanggal Pendataan"]] || "-"
          ),
          rumpun: uniqueData.get(rumpunHewanUnique).rumpun,
          jenis: uniqueData.get(jenisHewanUnique).jenis,
        };

        // ternakHewanBulk.push(dataTernakHewan);
        pkb.push(dataPkb);
      }

      // Send bulk data to server
      setLoading(true);
      try {
        // await sendJenisHewanBulkData(jenisHewanBulk);
        // await sendRumpunHewanBulkData(rumpunHewanBulk);
        // await sendPetugasBulkData(petugasPemeriksaBulk);
        // await sendPeternakBulkData(peternakBulk);
        // await sendKandangBulkData(kandangBulk);
        // await sendTernakHewanBulkData(ternakHewanBulk);
        await sendPkbImport(pkb);
      } catch (error) {
        console.error(
          "Gagal menyimpan data secara bulk:",
          error,
          error.response?.data
        );
      }

      if (errorCount === 0) {
        message.success(`Semua data berhasil disimpan.`);
        getPkbData();
      } else {
        message.error(
          `${errorCount} data gagal disimpan karena duplikasi data!`
        );
      }
    } catch (error) {
      console.error("Gagal memproses data:", error);
    } finally {
      setImportedData([]);
      setColumnTitles([]);
      setFileName("");
      setColumnMapping({});
      setLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    const csvContent = convertHeaderToCSV();
    downloadFormatCSV(csvContent);
  };

  const convertHeaderToCSV = () => {
    const columnTitlesLocal = [
      "No",
      "ID Kejadian",
      "Tanggal PKB",
      "Jumlah",
      "Umur Kebuntingan saat PKB (bulan)",
      "Spesies",
      "kategori",
      "Nama Peternak",
      "NIK Peternak",
      "No Kartu Ternak",
      "Pemeriksa Kebuntingan",
    ];
    const exampleRow = [
      "1",
      "Contoh 78210308",
      "COntoh 01/01/2021",
      "Contoh 1",
      "Contoh 2",
      "Contoh sapi fh",
      "Contoh sapi",
      "Contoh Budi",
      "Contoh 1234567890123456",
      "Contoh 23532",
      "Contoh Joko",
    ];

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

  const downloadFormatCSV = (csvContent) => {
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

  const handleExportData = () => {
    const csvContent = convertDataToCSV(pkb);
    downloadCSV(csvContent);
  };

  const convertDataToCSV = (data) => {
    const columnTitles = [
      "ID Kejadian",
      "Tanggal PKB",
      "Jumlah",
      "Umur Kebuntingan",
      "Species",
      "Kategori",
      "Nama Peternak",
      "NIK Peternak",
      "No Kartu Ternak",
      "Pemeriksa Kebuntingan",
    ];

    // Gabungkan header dan data
    const rows = [columnTitles];
    data.forEach((row) => {
      const rowData = [
        row.idKejadian,
        row.tanggalPkb,
        row.jumlah,
        row.umurKebuntingan,
        row.rumpunHewan.rumpun,
        row.jenisHewan.jenis,
        row.peternak.namaPeternak,
        row.peternak.nikPeternak,
        row.hewan.noKartuTernak,
        row.petugas.namaPetugas,
      ];
      rows.push(rowData);
    });

    let csvContent = "data:text/csv;charset=utf-8,";

    rows.forEach((rowArray) => {
      const row = rowArray.join(";");
      csvContent += row + "\r\n";
    });

    return csvContent;
  };

  const downloadCSV = (csvContent) => {
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "PKB.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link); // Clean up
  };

  const getColumnSearchProps = (dataIndex, nestedPath) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button type="link" size="small" onClick={() => close()}>
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      if (nestedPath) {
        const nestedValue = nestedPath
          .split(".")
          .reduce((obj, key) => obj?.[key], record);
        return nestedValue
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      }
      return record[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    },
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) setTimeout(() => searchInput.current?.select(), 100);
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text?.toString() || ""}
        />
      ) : (
        text
      ),
  });

  const renderColumns = () => {
    const baseColumns = [
      {
        title: "ID Kejadian",
        dataIndex: "idKejadian",
        key: "idKejadian",
        ...getColumnSearchProps("idKejadian"),
        sorter: (a, b) => a.idKejadian.localeCompare(b.idKejadian),
      },
      {
        title: "Tanggal PKB",
        dataIndex: "tanggalPkb",
        key: "tanggalPkb",
        ...getColumnSearchProps("tanggalPkb"),
        sorter: (a, b) => new Date(a.tanggalPkb) - new Date(b.tanggalPkb),
      },
      {
        title: "Jumlah",
        dataIndex: "jumlah",
        key: "jumlah",
        ...getColumnSearchProps("jumlah"),
        sorter: (a, b) => a.jumlah.localeCompare(b.jumlah),
      },
      {
        title: "Umur Kebuntingan",
        dataIndex: "umurKebuntingan",
        key: "umurKebuntingan",
        ...getColumnSearchProps("umurKebuntingan"),
        sorter: (a, b) => a.umurKebuntingan.localeCompare(b.umurKebuntingan),
      },
      {
        title: "Species",
        dataIndex: ["rumpunHewan", "rumpun"],
        key: "rumpun",
        ...getColumnSearchProps("rumpun", "rumpunHewan.rumpun"),
        sorter: (a, b) =>
          a.rumpunHewan.rumpun.localeCompare(b.rumpunHewan.rumpun),
      },
      {
        title: "Kategori",
        dataIndex: ["jenisHewan", "jenis"],
        key: "jenis",
        ...getColumnSearchProps("jenis", "jenisHewan.jenis"),
        sorter: (a, b) => a.jenisHewan.jenis.localeCompare(b.jenisHewan.jenis),
      },
      {
        title: "Nama Peternak",
        dataIndex: ["peternak", "namaPeternak"],
        key: "namaPeternak",
        ...getColumnSearchProps("namaPeternak", "peternak.namaPeternak"),
        sorter: (a, b) =>
          a.peternak.namaPeternak.localeCompare(b.peternak.namaPeternak),
      },
      {
        title: "Pemeriksa Kebuntingan",
        dataIndex: ["petugas", "namaPetugas"],
        key: "namaPetugas",
        ...getColumnSearchProps("namaPetugas", "petugas.namaPetugas"),
        sorter: (a, b) =>
          a.petugas.namaPetugas.localeCompare(b.petugas.namaPetugas),
      },
      {
        title: "Kartu Ternak",
        dataIndex: ["hewan", "noKartuTernak"],
        key: "noKartuTernak",
        ...getColumnSearchProps("noKartuTernak", "hewan.noKartuTernak"),
        sorter: (a, b) =>
          a.hewan.noKartuTernak.localeCompare(b.hewan.noKartuTernak),
      },
      {
        title: "Kandang",
        dataIndex: ["kandang", "namaKandang"],
        key: "namaKandang",
        ...getColumnSearchProps("namaKandang", "kandang.namaKandang"),
        sorter: (a, b) =>
          a.kandang.namaKandang.localeCompare(b.kandang.namaKandang),
      },
    ];

    if (user && (user.role === "ROLE_ADMINISTRATOR" || "ROLE_PETUGAS")) {
      baseColumns.push({
        title: "Operasi",
        key: "action",
        width: 120,
        align: "center",
        render: (text, row) => (
          <span>
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              title="Edit"
              onClick={() => handleEditPkb(row)}
            />
            <Divider type="vertical" />
            <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              title="Delete"
              onClick={() => handleDeletePkb(row)}
            />
          </span>
        ),
      });
    }

    return baseColumns;
  };

  const renderTable = () => {
    if (user && user.role === "ROLE_PETERNAK") {
      return (
        <Table
          dataSource={pkb}
          bordered
          columns={renderColumns()}
          rowKey="idPkb"
        />
      );
    } else if (
      user &&
      (user.role === "ROLE_ADMINISTRATOR" || user.role === "ROLE_PETUGAS")
    ) {
      return (
        <Table
          dataSource={pkb}
          bordered
          columns={renderColumns()}
          rowKey="idPkb"
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
          <Col>
            <Button type="primary" onClick={handleAddPkb} block>
              Tambah PKB
            </Button>
          </Col>
          <Col>
            <Button
              icon={<UploadOutlined />}
              onClick={handleImportModalOpen}
              block
            >
              Import File
            </Button>
          </Col>
          <Col>
            <Button
              icon={<DownloadOutlined />}
              onClick={handleDownloadCSV}
              block
            >
              Download Format CSV
            </Button>
          </Col>
          <Col>
            <Button icon={<UploadOutlined />} onClick={handleExportData} block>
              Export Data To CSV
            </Button>
          </Col>
        </Row>
      );
    } else {
      return null;
    }
  };

  const title = (
    <Row gutter={[16, 16]} justify="start">
      {renderButtons()}
      {/* <Col xs={24} sm={12} md={8} lg={8} xl={8}>
        <Input
          placeholder="Cari data"
          value={searchKeyword}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 235, marginLeft: 10 }}
        />
      </Col> */}
    </Row>
  );

  return (
    <div className="app-container">
      <TypingCard
        title="Manajemen PKB"
        source="Di sini, Anda dapat mengelola daftar pkb di sistem."
      />
      <br />

      {loading ? (
        <Card>
          <Skeleton active paragraph={{ rows: 10 }} />
        </Card>
      ) : (
        <Card title={title} style={{ overflowX: "scroll" }}>
          {renderTable()}
        </Card>
      )}

      <EditPkbForm
        currentRowData={currentRowData}
        wrappedComponentRef={editPkbFormRef}
        visible={editPkbModalVisible}
        confirmLoading={editPkbModalLoading}
        onCancel={handleCancel}
        onOk={handleEditPkbOk}
      />
      <AddPkbForm
        wrappedComponentRef={addPkbFormRef}
        visible={addPkbModalVisible}
        confirmLoading={addPkbModalLoading}
        onCancel={handleCancel}
        onOk={handleAddPkbOk}
      />

      <Modal
        title="Import File"
        open={importModalVisible}
        onCancel={handleImportModalClose}
        footer={[
          <Button key="cancel" onClick={handleImportModalClose}>
            Cancel
          </Button>,
          <Button
            key="upload"
            type="primary"
            loading={uploading}
            onClick={handleUpload}
          >
            Upload
          </Button>,
        ]}
      >
        <Upload beforeUpload={handleFileImport} accept=".xls,.xlsx,.csv">
          <Button icon={<UploadOutlined />}>Pilih File</Button>
        </Upload>
      </Modal>
    </div>
  );
};

export default Pkb;
