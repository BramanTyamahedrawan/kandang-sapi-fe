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
  Space,
} from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
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
import { addKandangBulkByNama } from "@/api/kandang";
import { addPeternakBulkByNama } from "@/api/peternak";
import { addPetugasBulkByNama } from "@/api/petugas";
import { addInseminsasiBulk } from "@/api/inseminasi";
import React, { useEffect, useRef, useState } from "react";
import { getPetugas } from "@/api/petugas";
import { read, utils } from "xlsx";
import TypingCard from "@/components/TypingCard";
import AddKelahiranForm from "./forms/add-kelahiran-form";
import EditKelahiranForm from "./forms/edit-kelahiran-form";
import { reqUserInfo } from "../../api/user";
import { v4 as uuidv4 } from "uuid";
import { Skeleton } from "antd";
import Highlighter from "react-highlight-words";
import { set } from "nprogress";

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

const sendInseminasiBulkData = async (data, batchSize = 7000) => {
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

const sendKelahiranBulkData = async (data, batchSize = 7000) => {
  const totalBatches = Math.ceil(data.length / batchSize);

  for (let i = 0; i < totalBatches; i++) {
    const batchData = data.slice(i * batchSize, (i + 1) * batchSize);

    try {
      console.log(`Data Kelahiran (Batch ${i + 1}):`, batchData); // Log data yang dikirim
      const response = await addKelahiranBulk(batchData);
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

const cleanNik = (nik) => (nik ? nik.replace(/'/g, "").trim() : "-");

const Kelahiran = () => {
  const [kelahirans, setKelahirans] = useState([]);
  const [petugas, setPetugas] = useState([]);
  const [editKelahiranModalVisible, setEditKelahiranModalVisible] =
    useState(false);
  const [editKelahiranModalLoading, setEditKelahiranModalLoading] =
    useState(false);
  const [currentRowData, setCurrentRowData] = useState({});
  const [addKelahiranModalVisible, setAddKelahiranModalVisible] =
    useState(false);
  const [addKelahiranModalLoading, setAddKelahiranModalLoading] =
    useState(false);
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
  const editKelahiranFormRef = useRef(null);
  const addKelahiranFormRef = useRef(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      await getPetugasData();
      await getPeternaksDat();
      try {
        const response = await reqUserInfo();
        const userData = response.data;
        setUser(userData);
        if (userData.role === "ROLE_PETERNAK") {
          await getKelahiranByPeternak(userData.username);
        } else {
          await getKelahiranData();
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchInitialData();
  }, []);

  const getKelahiranData = async () => {
    setLoading(true);
    try {
      const result = await getKelahiran();
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        const filteredKelahiran = content
          .filter((kelahiran) => {
            const {
              idKelahiran,
              idKejadian,
              tanggalLaporan,
              tanggalLahir,
              idPeternak,
              petugasId,
              idKandang,
              idJenisHewan,
              idRumpunHewan,
              kategori,
              jumlah,
              idHewanAnak,
              eartagAnak,
              jenisKelaminAnak,
              noKartuTernakAnak,
              spesies,
              urutanIB,
            } = kelahiran;
            const keyword = searchKeyword?.toLowerCase();

            return (
              idKelahiran?.toLowerCase()?.includes(keyword) ||
              idKejadian?.toLowerCase()?.includes(keyword) ||
              tanggalLaporan?.toLowerCase()?.includes(keyword) ||
              tanggalLahir?.toLowerCase()?.includes(keyword) ||
              kategori?.toLowerCase()?.includes(keyword) ||
              jumlah?.toString().toLowerCase()?.includes(keyword) ||
              idHewanAnak?.toLowerCase()?.includes(keyword) ||
              eartagAnak?.toLowerCase()?.includes(keyword) ||
              jenisKelaminAnak?.toLowerCase()?.includes(keyword) ||
              noKartuTernakAnak?.toLowerCase()?.includes(keyword) ||
              spesies?.toLowerCase()?.includes(keyword) ||
              urutanIB?.toString().toLowerCase()?.includes(keyword) ||
              idPeternak?.toLowerCase()?.includes(keyword) ||
              petugasId?.toLowerCase()?.includes(keyword) ||
              idKandang?.toLowerCase()?.includes(keyword) ||
              idJenisHewan?.toLowerCase()?.includes(keyword) ||
              idRumpunHewan?.toLowerCase()?.includes(keyword)
            );
          })
          .sort(
            (a, b) =>
              new Date(b.tanggalLaporan).getTime() -
              new Date(a.tanggalLaporan).getTime()
          );

        setKelahirans(filteredKelahiran);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getKelahiranByPeternak = async (peternakID) => {
    try {
      const result = await getKelahiranByPeternak(peternakID);
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        setKelahirans(content);
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

  const getPeternaksDat = async () => {
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

  const handleSearchTable = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
    getKelahiranData();
  };

  const handleAddKelahiran = () => {
    setAddKelahiranModalVisible(true);
  };

  const handleAddKelahiranOk = async (values) => {
    console.log("Add Kelahiran Values:", values);
    setAddKelahiranModalLoading(true);
    setLoading(true);
    try {
      await addKelahiran(values);
      setAddKelahiranModalVisible(false);
      setAddKelahiranModalLoading(false);
      message.success("Berhasil ditambahkan!");
      getKelahiranData();
    } catch (error) {
      console.error("Failed to add data:", error);
      message.error("Gagal menambahkan data, harap coba lagi!");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteKelahiran = (row) => {
    const { idKelahiran } = row;
    Modal.confirm({
      title: "Konfirmasi",
      content: "Apakah Anda yakin ingin menghapus data ini?",
      okText: "Ya",
      okType: "danger",
      cancelText: "Tidak",
      onOk: async () => {
        setLoading(true);
        try {
          await deleteKelahiran({ idKelahiran });
          message.success("Berhasil dihapus!");
          getKelahiranData();
        } catch (error) {
          message.error("Gagal menghapus data, harap coba lagi!");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleEditKelahiran = (row) => {
    setCurrentRowData({ ...row });
    setEditKelahiranModalVisible(true);
  };

  const handleEditKelahiranOk = async (values) => {
    setEditKelahiranModalLoading(true);
    setLoading(true);
    try {
      console.log("Edit Kelahiran Values:", values);
      await editKelahiran(values, currentRowData.idKelahiran);
      setEditKelahiranModalVisible(false);
      setEditKelahiranModalLoading(false);
      message.success("Berhasil diubah!");
      getKelahiranData();
    } catch (error) {
      console.error("Failed to edit data:", error);
      message.error("Gagal mengubah data, harap coba lagi!");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditKelahiranModalVisible(false);
    setAddKelahiranModalVisible(false);
    setImportModalVisible(false);
  };

  const handleImportModalOpen = () => {
    setImportModalVisible(true);
  };

  const handleImportModalClose = () => {
    setImportModalVisible(false);
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

      const jenisHewanBulk = [];
      const rumpunHewanBulk = [];
      const ternakHewanBulk = [];
      const petugasKelahiran = [];
      const peternakBulk = [];
      const inseminasiBulk = [];
      const kelahiranBulk = [];
      const kandangBulk = [];

      for (const row of importedData) {
        const generateIdKelahiran = uuidv4();
        const generateIdRumpunHewan = uuidv4();
        const generateIdJenisHewan = uuidv4();
        const generateIdHewan = uuidv4();
        const generateIdPeternak = uuidv4();
        const generateIdInseminasi = uuidv4();
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

        const rumpunHewanUnique = row[columnMapping["Spesies Induk"]] || "-";
        if (!uniqueData.has(rumpunHewanUnique)) {
          const dataRumpunHewan = {
            idRumpunHewan: generateIdRumpunHewan,
            rumpun: row[columnMapping["Spesies Induk"]] || "-",
            deskripsi:
              "Deskripsi " + row[columnMapping["Spesies Induk"]] || "-",
          };
          rumpunHewanBulk.push(dataRumpunHewan);
          uniqueData.set(rumpunHewanUnique, dataRumpunHewan);
        }

        const jenisHewanUnique = row[columnMapping["kategori"]] || "-";
        if (!uniqueData.has(jenisHewanUnique)) {
          const dataJenisHewan = {
            idJenisHewan: generateIdJenisHewan,
            jenis: row[columnMapping["kategori"]] || "-",
            deskripsi: "Deskripsi " + row[(columnMapping, ["kategori"])] || "-",
          };
          jenisHewanBulk.push(dataJenisHewan);
          uniqueData.set(jenisHewanUnique, dataJenisHewan);
        }

        const namaPetugasPelapor = row[columnMapping["Petugas Pelapor"]] || "-";
        if (!uniqueData.has(namaPetugasPelapor)) {
          const dataPetugasKelahiran = {
            petugasId: generateIdPetugas,
            nikPetugas: cleanNik(row[columnMapping["NIK Petugas"]]) || "-",
            namaPetugas: row[columnMapping["Petugas Pelapor"]] || "-",
            noTelp: row[columnMapping["No. Telp Petugas"]] || "-",
            email: validateEmail(row[columnMapping["Email Petugas"]]) || "-",
            job: "Petugas Kelahiran",
          };
          petugasKelahiran.push(dataPetugasKelahiran);
          uniqueData.set(namaPetugasPelapor, dataPetugasKelahiran);
        }

        const nikDataPeternak = row[columnMapping["NIK Peternak"]]
          ? cleanNik(row[columnMapping["NIK Peternak"]])
          : row[columnMapping["ID Peternak"]] || "-";

        const dataPeternakUnique = nikDataPeternak;
        if (!uniqueData.has(dataPeternakUnique)) {
          const dataPeternak = {
            idPeternak: generateIdPeternak,
            nikPeternak: nikDataPeternak,
            namaPeternak: row[columnMapping["Nama Peternak"]] || "-",
            noTelpPeternak: row[columnMapping["No Telp"]] || "-",
            emailPeternak:
              validateEmail(row[columnMapping["Email Pemilik Ternak"]]) || "-",
            idPetugas: uniqueData.get(namaPetugasPelapor).petugasId,
            nikPetugas: uniqueData.get(namaPetugasPelapor).nikPetugas,
            namaPetugas: uniqueData.get(namaPetugasPelapor).namaPetugas,
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
          peternakBulk.push(dataPeternak);
          uniqueData.set(dataPeternakUnique, dataPeternak);
        }

        const namaKandang = `Kandang ${
          uniqueData.get(jenisHewanUnique).jenis
        } ${uniqueData.get(dataPeternakUnique).namaPeternak}`;
        if (!uniqueData.has(namaKandang)) {
          const dataKandang = {
            idKandang: generateIdKandang,
            jenis: uniqueData.get(jenisHewanUnique).jenis,
            idPeternak: uniqueData.get(dataPeternakUnique).idPeternak,
            nikPeternak: uniqueData.get(dataPeternakUnique).nikPeternak,
            namaPeternak: uniqueData.get(dataPeternakUnique).namaPeternak,
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
          kandangBulk.push(dataKandang);
          uniqueData.set(namaKandang, dataKandang);
        }

        const dataTernakHewan = {
          idHewan: generateIdHewan,
          kodeEartagNasional: row[columnMapping["eartag_induk"]] || "-",
          noKartuTernak: row[columnMapping["kartu ternak induk"]] || "-",
          idIsikhnasTernak: row[columnMapping["IdIsikhnas"]] || "-",
          tanggalLahir: formatDateToString(
            row[columnMapping["Tanggal Lahir Ternak"]] || "-"
          ),
          sex: row[columnMapping["Jenis Kelamin"]] || "-",
          tempatLahir: row[columnMapping["Tempat Lahir Ternak"]] || "-",
          umur: row[columnMapping["Umur"]] || "-",
          identifikasiHewan:
            row[columnMapping["Identifikasi Hewan*"]] ||
            row[columnMapping["Identifikasi Hewan"]] ||
            "_",
          tanggalTerdaftar: formatDateToString(
            row[columnMapping["Tanggal Pendataan"]] || "-"
          ),
          nikPetugas: uniqueData.get(namaPetugasPelapor).nikPetugas,
          namaPetugas: uniqueData.get(namaPetugasPelapor).namaPetugas,
          idPetugas: uniqueData.get(namaPetugasPelapor).petugasId,
          nikPeternak: uniqueData.get(dataPeternakUnique).nikPeternak,
          idKandang: uniqueData.get(namaKandang).idKandang,
          namaKandang: uniqueData.get(namaKandang).namaKandang,
          jenis: uniqueData.get(jenisHewanUnique).jenis,
          rumpun: uniqueData.get(rumpunHewanUnique).rumpun,
          idPeternak: uniqueData.get(dataPeternakUnique).idPeternak,
          namaPeternak: uniqueData.get(dataPeternakUnique).namaPeternak,
          tujuanPemeliharaan:
            row[columnMapping["Tujuan Pemeliharaan Ternak"]] || "_",
        };

        if (row[columnMapping["ID Pejantan Straw"]] != null) {
          const dataInseminasi = {
            idInseminasi: generateIdInseminasi,
            tanggalIB:
              formatDateToString(row[columnMapping["Tanggal IB"]]) || "-",
            namaPeternak: uniqueData.get(dataPeternakUnique).namaPeternak,
            idPeternak: uniqueData.get(dataPeternakUnique).idPeternak,
            nikPeternak: uniqueData.get(dataPeternakUnique).nikPeternak,
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
            namaPetugas: uniqueData.get(namaPetugasPelapor).namaPetugas,
            nikPetugas: uniqueData.get(namaPetugasPelapor).nikPetugas,
            idPetugas: uniqueData.get(namaPetugasPelapor).petugasId,
            rumpun: dataTernakHewan.rumpun,
            jenis: dataTernakHewan.jenis,
            idKandang: uniqueData.get(namaKandang).idKandang,
            namaKandang: uniqueData.get(namaKandang).namaKandang,
          };
          inseminasiBulk.push(dataInseminasi);
        }

        // data kelahiran
        const dataKelahiran = {
          idKelahiran: generateIdKelahiran,
          idKejadian: row[columnMapping["id kejadian"]] || "-",
          tanggalLaporan: formatDateToString(
            row[columnMapping["Tanggal laporan"]] || "-"
          ),
          tanggalLahir: formatDateToString(
            row[columnMapping["Tanggal lahir"]] || "-"
          ),
          spesies: row[columnMapping["Spesies Induk"]] || "-",
          kategori: row[columnMapping["kategori"]] || "-",
          jumlah: row[columnMapping["Jumlah"]] || "-",
          eartagAnak: row[columnMapping["eartag_anak"]] || "-",
          idHewanAnak: row[columnMapping["ID Hewan Anak"]] || "-",
          noKartuTernakAnak: row[columnMapping["kartu ternak anak"]] || "-",
          jenisKelaminAnak: row[columnMapping["Jenis Kelamin Anak"]] || "-",
          urutanIB: row[columnMapping["urutan_ib"]] || "-",
          idPejantan: row[columnMapping["ID Pejantan Straw"]] || "-",
          idPeternak: uniqueData.get(dataPeternakUnique).idPeternak,
          namaPeternak: uniqueData.get(dataPeternakUnique).namaPeternak,
          nikPeternak: uniqueData.get(dataPeternakUnique).nikPeternak,
          idKandang: uniqueData.get(namaKandang).idKandang,
          namaKandang: uniqueData.get(namaKandang).namaKandang,
          idHewan: dataTernakHewan.idHewan,
          noKartuTernak: dataTernakHewan.noKartuTernak,
          kodeEartagNasional: dataTernakHewan.kodeEartagNasional,
          nikPetugas: uniqueData.get(namaPetugasPelapor).nikPetugas,
          namaPetugas: uniqueData.get(namaPetugasPelapor).namaPetugas,
          petugasId: uniqueData.get(namaPetugasPelapor).petugasId,
          jenis: uniqueData.get(jenisHewanUnique).jenis,
          rumpun: uniqueData.get(rumpunHewanUnique).rumpun,
        };

        ternakHewanBulk.push(dataTernakHewan);
        kelahiranBulk.push(dataKelahiran);
      }

      // Send bulk data to server
      setLoading(true);
      try {
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
        getKelahiranData();
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
      "id kejadian",
      "Tanggal laporan",
      "Tanggal lahir",
      "eartag_anak",
      "ID Hewan Anak",
      "kartu ternak anak",
      "Jenis Kelamin Anak",
      "Jumlah",
      "urutan_ib",
      "Nama Peternak",
      "NIK Peternak",
      "Lokasi",
      "eartag_induk",
      "kartu ternak induk",
      "ID Pejantan Straw",
      "ID Batch Straw",
      "Produsen Straw",
      "Spesies Pejantan",
      "Spesies Induk",
      "kategori",
      "Petugas Pelapor",
    ];
    const exampleRow = [
      "1",
      "Contoh 23325",
      "COntoh 12/12/2021",
      "Contoh 12/12/2021",
      "Contoh AAA32525",
      "Contoh 3245",
      "Contoh 23566",
      "Contoh Jantan",
      "Contoh 2",
      "Contoh 1",
      "Contoh Budi",
      "Contoh 123456789",
      "Contoh Jawa Timur, Lumajang, Pasirian, Sumberagung",
      "Contoh AA32525223",
      "Contoh 352355",
      "Contoh 31425",
      "Contoh UU5245",
      "Contoh BBIB Singosari",
      "Contoh Sapi Limosin",
      "Contoh Sapi fh",
      "Contoh Sapi Potong",
      "Contoh Agus",
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
    link.setAttribute("download", "format_kelahiran.csv");
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportData = () => {
    const csvContent = convertToCSV(kelahirans);
    downloadCSV(csvContent);
  };

  const convertToCSV = (data) => {
    const columnTitles = [
      "ID Kejadian",
      "Tanggal Laporan",
      "Tanggal Lahir",
      "Kode Eartag Anak",
      "ID Hewan Anak",
      "Kartu Ternak Anak",
      "Jenis Kelamin Anak",
      "Jumlah",
      "Urutan Ib",
      "Nama Peternak",
      "NIK Peternak",
      "Lokasi",
      "Kode Eartag Induk",
      "Kartu Ternak Induk",
      "Id Pejantan Straw",
      "Id Batch Straw",
      "Produsen Straw",
      "Spesies Pejantan",
      "Spesies Induk",
      "Kategori",
      "Petugas Pelopor",
    ];

    const rows = [columnTitles];
    data.forEach((item) => {
      const row = [
        item.idKejadian,
        item.tanggalLaporan,
        item.tanggalLahir,
        item.eartagAnak,
        item.idHewanAnak,
        item.noKartuTernakAnak,
        item.jenisKelaminAnak,
        item.jumlah,
        item.urutanIB,
        item.peternak.namaPeternak,
        item.peternak.nikPeternak,
        item.peternak.lokasi,
        item.hewan.kodeEartagNasional,
        item.hewan.noKartuTernak,
        item.idPejantan,
        item.idPembuatan,
        item.produsen,
        item.bangsaPejantan,
        item.rumpunHewan.rumpun,
        item.jenisHewan.jenis,
        item.petugas.namaPetugas,
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

  const downloadCSV = (csvContent) => {
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Kelahiran.csv");
    document.body.appendChild(link);
    link.click();
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
          onPressEnter={() =>
            handleSearchTable(selectedKeys, confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearchTable(selectedKeys, confirm, dataIndex)}
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
        title: "Tanggal Laporan",
        dataIndex: "tanggalLaporan",
        key: "tanggalLaporan",
        ...getColumnSearchProps("tanggalLaporan"),
        sorter: (a, b) =>
          new Date(a.tanggalLaporan) - new Date(b.tanggalLaporan),
      },
      {
        title: "Tanggal Lahir",
        dataIndex: "tanggalLahir",
        key: "tanggalLahir",
        ...getColumnSearchProps("tanggalLahir"),
        sorter: (a, b) => new Date(a.tanggalLahir) - new Date(b.tanggalLahir),
      },
      {
        title: "Eartag Anak",
        dataIndex: "eartagAnak",
        key: "eartagAnak",
        ...getColumnSearchProps("eartagAnak"),
        sorter: (a, b) => a.eartagAnak.localeCompare(b.eartagAnak),
      },
      {
        title: "ID Hewan Anak",
        dataIndex: "idHewanAnak",
        key: "idHewanAnak",
        ...getColumnSearchProps("idHewanAnak"),
        sorter: (a, b) => a.idHewanAnak.localeCompare(b.idHewanAnak),
      },
      {
        title: "No Kartu Ternak Anak",
        dataIndex: "noKartuTernakAnak",
        key: "noKartuTernakAnak",
        ...getColumnSearchProps("noKartuTernakAnak"),
        sorter: (a, b) =>
          a.noKartuTernakAnak.localeCompare(b.noKartuTernakAnak),
      },
      {
        title: "Jenis Kelamin Anak",
        dataIndex: "jenisKelaminAnak",
        key: "jenisKelaminAnak",
        ...getColumnSearchProps("jenisKelaminAnak"),
        sorter: (a, b) => a.jenisKelaminAnak.localeCompare(b.jenisKelaminAnak),
      },
      {
        title: "Jumlah",
        dataIndex: "jumlah",
        key: "jumlah",
        ...getColumnSearchProps("jumlah"),
        sorter: (a, b) => a.jumlah.localeCompare(b.jumlah),
      },
      {
        title: "Urutan IB",
        dataIndex: "urutanIB",
        key: "urutanIB",
        ...getColumnSearchProps("urutanIB"),
        sorter: (a, b) => a.urutanIB.localeCompare(b.urutanIB),
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
        title: "Eartag Induk",
        dataIndex: ["hewan", "kodeEartagNasional"],
        key: "kodeEartagNasional",
        ...getColumnSearchProps(
          "kodeEartagNasional",
          "hewan.kodeEartagNasional"
        ),
        sorter: (a, b) =>
          a.hewan.kodeEartagNasional.localeCompare(b.hewan.kodeEartagNasional),
      },
      {
        title: "Kartu Ternak Induk",
        dataIndex: ["hewan", "noKartuTernak"],
        key: "noKartuTernak",
        ...getColumnSearchProps("noKartuTernak", "hewan.noKartuTernak"),
        sorter: (a, b) =>
          a.hewan.noKartuTernak.localeCompare(b.hewan.noKartuTernak),
      },
      {
        title: "ID Pejantan",
        dataIndex: ["inseminasi", "idPejantan"],
        key: "idPejantan",
        ...getColumnSearchProps("idPejantan", "inseminasi.idPejantan"),
        sorter: (a, b) =>
          a.inseminasi.idPejantan.localeCompare(b.inseminasi.idPejantan),
      },
      {
        title: "ID Pembuatan",
        dataIndex: ["inseminasi", "idPembuatan"],
        key: "idPembuatan",
        ...getColumnSearchProps("idPembuatan", "inseminasi.idPembuatan"),
        sorter: (a, b) =>
          a.inseminasi.idPembuatan.localeCompare(b.inseminasi.idPembuatan),
      },
      {
        title: "Produsen",
        dataIndex: ["inseminasi", "produsen"],
        key: "produsen",
        ...getColumnSearchProps("produsen", "inseminasi.produsen"),
        sorter: (a, b) =>
          a.inseminasi.produsen.localeCompare(b.inseminasi.produsen),
      },
      {
        title: "Bangsa Pejantan",
        dataIndex: ["inseminasi", "bangsaPejantan"],
        key: "bangsaPejantan",
        ...getColumnSearchProps("bangsaPejantan", "inseminasi.bangsaPejantan"),
        sorter: (a, b) =>
          a.inseminasi.bangsaPejantan.localeCompare(
            b.inseminasi.bangsaPejantan
          ),
      },
      {
        title: "Spesies",
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
        title: "Petugas Pelapor",
        dataIndex: ["petugas", "namaPetugas"],
        key: "namaPetugas",
        ...getColumnSearchProps("namaPetugas", "petugas.namaPetugas"),
        sorter: (a, b) =>
          a.petugas.namaPetugas.localeCompare(b.petugas.namaPetugas),
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
              onClick={() => handleEditKelahiran(row)}
            />
            <Divider type="vertical" />
            <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              title="Delete"
              onClick={() => handleDeleteKelahiran(row)}
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
          dataSource={kelahirans}
          bordered
          columns={renderColumns}
          rowKey="idKelahiran"
        />
      );
    } else if (
      user &&
      (user.role === "ROLE_ADMINISTRATOR" || user.role === "ROLE_PETUGAS")
    ) {
      return (
        <Table
          dataSource={kelahirans}
          bordered
          columns={renderColumns()}
          rowKey="idKelahiran"
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
            <Button type="primary" onClick={handleAddKelahiran} block>
              Tambah Kelahiran
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
      <Col xs={24} sm={12} md={8} lg={8} xl={8}>
        <Input
          placeholder="Cari data"
          value={searchKeyword}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 235, marginLeft: 10 }}
        />
      </Col>
    </Row>
  );

  // const { role } = user ? user.role : "";
  // console.log("peran pengguna:", role);
  // const cardContent = `Di sini, Anda dapat mengelola daftar kelahirans di sistem.`;

  return (
    <div className="app-container">
      <TypingCard
        title="Manajemen Kelahiran"
        source="Di sini, Anda dapat mengelola daftar kelahirans di sistem."
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

      <EditKelahiranForm
        currentRowData={currentRowData}
        wrappedComponentRef={editKelahiranFormRef}
        visible={editKelahiranModalVisible}
        confirmLoading={editKelahiranModalLoading}
        onCancel={handleCancel}
        onOk={handleEditKelahiranOk}
      />
      <AddKelahiranForm
        wrappedComponentRef={addKelahiranFormRef}
        visible={addKelahiranModalVisible}
        confirmLoading={addKelahiranModalLoading}
        onCancel={handleCancel}
        onOk={handleAddKelahiranOk}
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
        <Upload beforeUpload={handleFileImport} accept=".xlsx,.xls,.csv">
          <Button icon={<UploadOutlined />}>Pilih File</Button>
        </Upload>
      </Modal>
    </div>
  );
};

export default Kelahiran;
