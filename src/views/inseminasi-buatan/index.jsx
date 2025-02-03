/* eslint-disable no-unused-vars */
// import { Component, useState, useRef } from "react";
import { Card, Button, Table, message, Row, Col, Divider, Modal, Upload, Input, Space } from "antd";
import { getPeternaks } from "@/api/peternak";
import { getInseminasis, getInseminasiByPeternak, deleteInseminasi, editInseminasi, addInseminasi, addInseminasiImport } from "@/api/inseminasi";
import { addJenisHewanBulk } from "@/api/jenishewan";
import { addRumpunHewanBulk } from "@/api/rumpunhewan";
import { addHewanBulkImport } from "@/api/hewan";
import { addKandangBulkByNama } from "@/api/kandang";
import { addPeternakBulkByNama } from "@/api/peternak";
import { addPetugasBulkByNama } from "@/api/petugas";
import { getPetugas } from "@/api/petugas";
import { UploadOutlined, EditOutlined, DeleteOutlined, DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import { read, utils } from "xlsx";
import AddInseminasiBuatanForm from "./forms/add-inseminasi-form";
import EditInseminasiBuatanForm from "./forms/edit-inseminasi-form";
import TypingCard from "@/components/TypingCard";
import React, { useEffect, useRef, useState } from "react";
import { reqUserInfo } from "../../api/user";
import { v4 as uuidv4 } from "uuid";
import { Skeleton } from "antd";
import Highlighter from "react-highlight-words";
import { data } from "react-router-dom";

const sendPetugasBulkData = async (data, batchSize = 7000) => {
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

const sendPeternakBulkData = async (data, batchSize = 7000) => {
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

const sendKandangBulkData = async (data, batchSize = 7000) => {
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

const sendInseminasiBuatanImport = async (data, batchSize = 7000) => {
  const totalBatches = Math.ceil(data.length / batchSize);

  for (let i = 0; i < totalBatches; i++) {
    const batchData = data.slice(i * batchSize, (i + 1) * batchSize);

    try {
      console.log(`Data Inseminasi Buatan (Batch ${i + 1}):`, batchData); // Log data yang dikirim
      const response = await addInseminasiImport(batchData);
      console.log(`Batch ${i + 1}/${totalBatches} berhasil dikirim`, response.data);
    } catch (error) {
      console.error(`Batch ${i + 1}/${totalBatches} gagal dikirim`, error.response?.data || error.message);
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
  const isValid = dusun !== "-" || desa !== "-" || kecamatan !== "-" || kabupaten !== "-" || provinsi !== "-";

  if (!isValid) {
    console.warn(`Alamat tidak valid: ${address}`);
    return "alamat tidak valid";
  }

  // Return dalam bentuk object
  return { dusun, desa, kecamatan, kabupaten, provinsi };
}

const cleanNik = (nik) => (nik ? nik.replace(/'/g, "").trim() : "-");

const InseminasiBuatan = () => {
  const [inseminasis, setInseminasis] = useState([]);
  const [peternaks, setPeternaks] = useState([]);
  const [petugas, setPetugas] = useState([]);
  const [editInseminasiModalVisible, setEditInseminasiModalVisible] = useState(false);
  const [editInseminasiModalLoading, setEditInseminasiModalLoading] = useState(false);
  const [currentRowData, setCurrentRowData] = useState({});
  const [addInseminasiModalVisible, setAddInseminasiModalVisible] = useState(false);
  const [addInseminasiModalLoading, setAddInseminasiModalLoading] = useState(false);
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
  const editInseminasiFormRef = useRef(null);
  const addInseminasiFormRef = useRef(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      await getPeternaksData();
      await getPetugasData();
      try {
        const response = await reqUserInfo();
        const userData = response.data;
        setUser(userData);
        if (userData.role === "ROLE_PETERNAK") {
          await getInseminasiByPeternak(userData.username);
        } else {
          await getInseminasisData();
        }
      } catch (error) {
        console.error("Terjadi kesalahan saat mengambil data user:", error);
      }
    };

    fetchInitialData();
  }, []);

  const getInseminasisData = async () => {
    setLoading(true);
    try {
      const result = await getInseminasis();
      const { content, statusCode } = result.data;

      if (statusCode === 200) {
        const filteredInseminasi = content
          .filter((inseminasi) => {
            const { idInseminasi, tanggalIB, idPeternak, namaPeternak, kodeEartagNasional, idPejantan, idPembuatan, bangsaPejantan, produsen, inseminator, lokasi, idKandang, namaKandang } = inseminasi;
            const keyword = searchKeyword.toLowerCase();

            return (
              idInseminasi?.toLowerCase().includes(keyword) ||
              tanggalIB?.toLowerCase().includes(keyword) ||
              idPeternak?.toLowerCase().includes(keyword) ||
              namaPeternak?.toLowerCase().includes(keyword) ||
              kodeEartagNasional?.toLowerCase().includes(keyword) ||
              idPejantan?.toLowerCase().includes(keyword) ||
              idPembuatan?.toLowerCase().includes(keyword) ||
              bangsaPejantan?.toLowerCase().includes(keyword) ||
              produsen?.toLowerCase().includes(keyword) ||
              inseminator?.toLowerCase().includes(keyword) ||
              idKandang?.toLowerCase().includes(keyword) ||
              namaKandang?.toLowerCase().includes(keyword) ||
              lokasi?.toLowerCase().includes(keyword)
            );
          })
          .sort((a, b) => new Date(b.tanggalIB).getTime() - new Date(a.tanggalIB).getTime());

        setInseminasis(filteredInseminasi);
      }
    } catch (error) {
      console.error("Failed to fetch inseminasis:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInseminasiByPeternak = async (peternakID) => {
    try {
      const result = await getInseminasiByPeternak(peternakID);
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        setInseminasis(content);
      }
    } catch (error) {
      console.error("Failed to fetch inseminasis by peternak:", error);
    }
  };

  const getPeternaksData = async () => {
    try {
      const result = await getPeternaks();
      const { content, statusCode } = result.data;

      if (statusCode === 200) {
        setPeternaks(content);
      }
    } catch (error) {
      console.error("Failed to fetch peternaks:", error);
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
      console.error("Failed to fetch petugas:", error);
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
    getInseminasisData();
  };

  const handleAddInseminasi = () => {
    setAddInseminasiModalVisible(true);
  };

  const handleAddInseminasiOk = async (values) => {
    setAddInseminasiModalLoading(true);
    setLoading(true);
    try {
      console.log("Data Inseminasi:", values);
      await addInseminasi(values);
      setAddInseminasiModalVisible(false);
      setAddInseminasiModalLoading(false);
      message.success("Berhasil menambahkan!");
      getInseminasisData();
    } catch (e) {
      setAddInseminasiModalLoading(false);
      message.error("Gagal menambahkan, harap coba lagi!");
    } finally {
      setLoading(false);
    }
  };

  const handleEditInseminasi = (row) => {
    setCurrentRowData({ ...row });
    setEditInseminasiModalVisible(true);
  };

  const handleEditInseminasiOk = async (values) => {
    setEditInseminasiModalLoading(true);
    setLoading(true);
    try {
      console.log("Data Inseminasi:", values);
      await editInseminasi(values, currentRowData.idInseminasi);
      setEditInseminasiModalVisible(false);
      setEditInseminasiModalLoading(false);
      message.success("Berhasil diedit!");
      getInseminasisData();
    } catch (e) {
      setEditInseminasiModalLoading(false);
      message.error("Pengeditan gagal, harap coba lagi!");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInseminasi = (row) => {
    const { idInseminasi } = row;
    Modal.confirm({
      title: "Konfirmasi",
      content: "Apakah Anda yakin ingin menghapus data ini?",
      okText: "Ya",
      okType: "danger",
      cancelText: "Tidak",
      onOk: async () => {
        setLoading(true);
        try {
          await deleteInseminasi({ idInseminasi });
          message.success("Berhasil dihapus");
          getInseminasisData();
        } catch (error) {
          message.error("Gagal menghapus data, harap coba lagi!");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleCancel = () => {
    setEditInseminasiModalVisible(false);
    setAddInseminasiModalVisible(false);
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
      const petugasInseminasi = [];
      const peternakBulk = [];
      const kandangBulk = [];
      const inseminasiBuatan = [];

      for (const row of importedData) {
        const generateIdPetugas = uuidv4();
        const generateIdPeternak = uuidv4();
        const generateIdInseminasi = uuidv4();
        const generateIdHewan = uuidv4();
        const generateIdRumpunHewan = uuidv4();
        const generateIdJenisHewan = uuidv4();
        const generateIdKandang = uuidv4();

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

        const pecahLokasi = parseAddress(row[columnMapping["Lokasi"]] || row[columnMapping["Alamat"]] || "-");

        const generateJenisKandang = (jenisKandang) => {
          return jenisKandang || "Permanen";
        };
        // const setEmail =;

        const rumpunHewanUnique = row[columnMapping["Bangsa Pejantan"]];
        if (!uniqueData.has(rumpunHewanUnique)) {
          const dataRumpunHewan = {
            idRumpunHewan: generateIdRumpunHewan,
            rumpun: row[columnMapping["Bangsa Pejantan"]] || "-",
            deskripsi: "Deskripsi " + row[(columnMapping, ["Bangsa Pejantan"])] || "-",
          };
          rumpunHewanBulk.push(dataRumpunHewan);
          uniqueData.set(rumpunHewanUnique, dataRumpunHewan);
        }

        const jenisHewanUnique = row[columnMapping["kategori"]];
        if (!uniqueData.has(jenisHewanUnique)) {
          const dataJenisHewan = {
            idJenisHewan: generateIdJenisHewan,
            jenis: row[columnMapping["kategori"]] || "-",
            deskripsi: "Deskripsi " + row[(columnMapping, ["kategori"])] || "-",
          };
          jenisHewanBulk.push(dataJenisHewan);
          uniqueData.set(jenisHewanUnique, dataJenisHewan);
        }

        const namaPetugasInseminator = row[columnMapping["Inseminator"]];
        if (!uniqueData.has(namaPetugasInseminator)) {
          const dataPetugas = {
            petugasId: generateIdPetugas,
            nikPetugas: cleanNik(row[columnMapping["NIK Petugas"]]) || "-",
            namaPetugas: row[columnMapping["Inseminator"]] || "-",
            noTelp: row[columnMapping["No. Telp Petugas"]] || "-",
            email: validateEmail(row[columnMapping["Email Petugas"]]) || "-",
            job: "Inseminator",
          };
          petugasInseminasi.push(dataPetugas);
          uniqueData.set(namaPetugasInseminator, dataPetugas);
        }

        const namaPemilikTernak = row[columnMapping["Nama Peternak"]];
        if (!uniqueData.has(namaPemilikTernak)) {
          const dataPeternak = {
            idPeternak: generateIdPeternak,
            nikPeternak: cleanNik(row[columnMapping["NIK Pemilik Ternak"]]) || "-",
            namaPeternak: row[columnMapping["Nama Peternak"]] || "-",
            noTelpPeternak: row[columnMapping["No Telp"]] || "-",
            emailPeternak: validateEmail(row[columnMapping["Email Pemilik Ternak"]]) || "-",
            idPetugas: uniqueData.get(namaPetugasInseminator).petugasId,
            nikPetugas: uniqueData.get(namaPetugasInseminator).nikPetugas,
            namaPetugas: uniqueData.get(namaPetugasInseminator).namaPetugas,
            alamat: row[columnMapping["Lokasi"]] || "-",
            dusun: pecahLokasi.dusun,
            desa: pecahLokasi.desa,
            kecamatan: pecahLokasi.kecamatan,
            kabupaten: pecahLokasi.kabupaten,
            provinsi: pecahLokasi.provinsi,
            tanggalLahirPeternak: formatDateToString(row[columnMapping["Tanggal Lahir Pemilik Ternak"]] || "-"),
            latitude: row[columnMapping["latitude"]] || "-",
            longitude: row[columnMapping["longitude"]] || "-",
            idIsikhnas: row[columnMapping["ID Isikhnas*)"]] || "-",
            jenisKelaminPeternak: row[columnMapping["Jenis Kelamin Pemilik Ternak"]] || "-",
          };
          peternakBulk.push(dataPeternak);
          uniqueData.set(namaPemilikTernak, dataPeternak);
        }

        const namaKandang = `Kandang ${uniqueData.get(jenisHewanUnique).jenis} - ${row[columnMapping["Nama Kandang"]] || uniqueData.get(namaPemilikTernak).namaPeternak}`;
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
            jenisKandang: generateJenisKandang(row[columnMapping["Jenis Kandang*)"]]),
            latitude: row[columnMapping["latitude"]] || "-",
            longitude: row[columnMapping["longitude"]] || "-",
          };
          kandangBulk.push(dataKandang);
          uniqueData.set(namaKandang, dataKandang);
        }

        const dataTernakHewan = {
          idHewan: generateIdHewan,
          kodeEartagNasional: row[columnMapping["eartag"]] || "-",
          noKartuTernak: row[columnMapping["No Kartu Ternak"]] || row[columnMapping["ID Hewan"]] || "-",
          idIsikhnasTernak: row[columnMapping["IdIsikhnasTernak"]] || "-",
          sex: row[columnMapping["Jenis Kelamin"]] || "-",
          tempatLahir: row[columnMapping["Tempat Lahir Ternak"]] || "-",
          umur: row[columnMapping["Umur"]] || "-",
          identifikasiHewan: row[columnMapping["Identifikasi Hewan*"]] || row[columnMapping["Identifikasi Hewan"]] || "-",
          tanggalLahir: formatDateToString(row[columnMapping["Tanggal Lahir Ternak**)"]] || "-"),
          tanggalTerdaftar: formatDateToString(row[columnMapping["Tanggal Pendataan"]] || "-"),
          idPetugas: uniqueData.get(namaPetugasInseminator).petugasId,
          nikPetugas: uniqueData.get(namaPetugasInseminator).nikPetugas,
          namaPetugas: uniqueData.get(namaPetugasInseminator).namaPetugas,
          idKandang: uniqueData.get(namaKandang).idKandang,
          namaKandang: uniqueData.get(namaKandang).namaKandang,
          jenis: uniqueData.get(jenisHewanUnique).jenis,
          rumpun: uniqueData.get(rumpunHewanUnique).rumpun,
          idPeternak: uniqueData.get(namaPemilikTernak).idPeternak,
          namaPeternak: uniqueData.get(namaPemilikTernak).namaPeternak,
          nikPeternak: uniqueData.get(namaPemilikTernak).nikPeternak,
          tujuanPemeliharaan: row[columnMapping["Tujuan Pemeliharaan Ternak"]] || "-",
        };

        // data inseminasi
        const dataInseminasi = {
          idInseminasi: generateIdInseminasi,
          tanggalIB: formatDateToString(row[columnMapping["Tanggal IB"]]) || "-",
          ib1: row[columnMapping["IB 1"]] || "-",
          ib2: row[columnMapping["IB 2"]] || "-",
          ib3: row[columnMapping["IB 3"]] || "-",
          ibLain: row[columnMapping["IB lain"]] || "-",
          idPejantan: row[columnMapping["ID Pejantan"]] || "-",
          produsen: row[columnMapping["Produsen"]] || "-",
          idPembuatan: row[columnMapping["ID Pembuatan"]] || "-",
          bangsaPejantan: row[columnMapping["Bangsa Pejantan"]] || "-",
          // peternak
          namaPeternak: uniqueData.get(namaPemilikTernak).namaPeternak,
          nikPeternak: uniqueData.get(namaPemilikTernak).nikPeternak,
          idPeternak: uniqueData.get(namaPemilikTernak).idPeternak,
          alamat: row[columnMapping["Lokasi"]] || "-",
          dusun: pecahLokasi.dusun,
          desa: pecahLokasi.desa,
          kecamatan: pecahLokasi.kecamatan,
          kabupaten: pecahLokasi.kabupaten,
          provinsi: pecahLokasi.provinsi,
          kodeEartagNasional: dataTernakHewan.kodeEartagNasional,
          idHewan: dataTernakHewan.idHewan,
          noKartuTernak: dataTernakHewan.noKartuTernak,
          namaPetugas: uniqueData.get(namaPetugasInseminator).namaPetugas,
          nikPetugas: uniqueData.get(namaPetugasInseminator).nikPetugas,
          idPetugas: uniqueData.get(namaPetugasInseminator).petugasId,
          namaKandang: uniqueData.get(namaKandang).namaKandang,
          idKandang: uniqueData.get(namaKandang).idKandang,
          rumpun: uniqueData.get(rumpunHewanUnique).rumpun,
          jenis: uniqueData.get(jenisHewanUnique).jenis,
        };

        console.log("Data Inseminasi:", dataInseminasi);

        // petugasInseminasi.push(dataPetugas);
        ternakHewanBulk.push(dataTernakHewan);
        inseminasiBuatan.push(dataInseminasi);
      }

      // Send bulk data to server
      setLoading(true);
      try {
        await sendInseminasiBuatanImport(inseminasiBuatan);
      } catch (error) {
        console.error("Gagal menyimpan data secara bulk:", error, error.response?.data);
      }

      if (errorCount === 0) {
        message.success(`Semua data berhasil disimpan.`);
        getInseminasisData();
      } else {
        message.error(`${errorCount} data gagal disimpan karena duplikasi data!`);
      }
    } catch (error) {
      console.error("Gagal memproses data:", error);
    } finally {
      setImportedData([]); // Reset state setelah pemrosesan selesai
      setColumnTitles([]);
      setColumnMapping({});
      setLoading(false);
    }
  };

  // Download Format CSV
  const handleDownloadCSV = () => {
    const csvContent = convertHeaderToCSV();
    downloadFormatCSV(csvContent);
  };

  const convertHeaderToCSV = () => {
    const columnTitlesLocal = [
      "No",
      "Tanggal IB",
      "IB 1",
      "IB 2",
      "IB 3",
      "IB Lain",
      "ID Pejantan",
      "ID Pembuatan",
      "Produsen",
      "Bangsa Pejantan",
      "Kode Eartag",
      "No Kartu Ternak",
      "Inseminator",
      "Nama Peternak",
      "Nama Kandang",
      "Kategori",
    ];
    const exampleRow = [
      "1",
      "Contoh 1/5/2023",
      "Contoh -",
      "Contoh 1",
      "Contoh -",
      "Contoh -",
      "Contoh 51244",
      "Contoh UU7221",
      "Contoh BBIB Singosari",
      "Contoh Sapi Limousin",
      "Contoh AA532638235",
      "Contoh 35346",
      "Contoh Budi",
      "Contoh Agus",
      "Contoh Kandang Sapi Perah Agus",
      "Contoh Sapi Perah",
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
    link.setAttribute("download", "format_inseminasi.csv");
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportData = () => {
    const csvContent = convertToCSV(inseminasis);
    downloadCSV(csvContent);
  };

  const convertToCSV = (data) => {
    const columnTitles = ["Tanggal IB", "IB 1", "IB 2", "IB 3", "IB Lain", "ID Pejantan", "ID Pembuatan", "Produsen", "Bangsa Pejantan", "Kode Eartag", "No Kartu Ternak", "Inseminator", "Nama Peternak", "Nama Kandang", "Kategori"];

    const rows = [columnTitles];
    data.forEach((item) => {
      const row = [
        item.tanggalIB || "-",
        item.ib1 || "-",
        item.ib2 || "-",
        item.ib3 || "-",
        item.ibLain || "-",
        item.idPejantan || "-",
        item.idPembuatan || "-",
        item.produsen || "-",
        item.bangsaPejantan || "-",
        item.hewan?.kodeEartagNasional || "-",
        item.hewan?.noKartuTernak || "-",
        item.petugas?.namaPetugas || "-",
        item.peternak?.namaPeternak || "-",
        item.kandang?.namaKandang || "-",
        item.jenisHewan?.jenis || "-",
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
    link.setAttribute("download", "Inseminasi.csv");
    document.body.appendChild(link);
    link.click();
  };

  const getColumnSearchProps = (dataIndex, nestedPath) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearchTable(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button type="primary" onClick={() => handleSearchTable(selectedKeys, confirm, dataIndex)} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>
            Search
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
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
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />,
    onFilter: (value, record) => {
      if (nestedPath) {
        const nestedValue = nestedPath.split(".").reduce((obj, key) => obj?.[key], record);
        return nestedValue?.toString().toLowerCase().includes(value.toLowerCase());
      }
      return record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase());
    },
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) setTimeout(() => searchInput.current?.select(), 100);
      },
    },
    render: (text) => (searchedColumn === dataIndex ? <Highlighter highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }} searchWords={[searchText]} autoEscape textToHighlight={text?.toString() || ""} /> : text),
  });

  const renderColumns = () => {
    const baseColumns = [
      {
        title: "Tanggal IB",
        dataIndex: "tanggalIB",
        key: "tanggalIB",
        ...getColumnSearchProps("tanggalIB"),
        sorter: (a, b) => new Date(a.tanggalIB) - new Date(b.tanggalIB),
      },
      {
        title: "IB",
        key: "ib",
        render: (text, record) => {
          if (record.ib1 === "1") return "IB1";
          if (record.ib2 === "1") return "IB2";
          if (record.ib3 === "1") return "IB3";
          if (record.ibLain === "1") return "IBLain";
          return "-"; // Default jika tidak ada data
        },
      },
      {
        title: "ID Pejantan",
        dataIndex: "idPejantan",
        key: "idPejantan",
        ...getColumnSearchProps("idPejantan"),
        sorter: (a, b) => a.idPejantan.localeCompare(b.idPejantan),
      },
      {
        title: "ID Pembuatan",
        dataIndex: "idPembuatan",
        key: "idPembuatan",
        ...getColumnSearchProps("idPembuatan"),
        sorter: (a, b) => a.idPembuatan.localeCompare(b.idPembuatan),
      },
      {
        title: "Produsen",
        dataIndex: "produsen",
        key: "produsen",
        ...getColumnSearchProps("produsen"),
        sorter: (a, b) => a.produsen.localeCompare(b.produsen),
      },
      {
        title: "Bangsa Pejantan",
        dataIndex: ["rumpunHewan", "rumpun"],
        key: "rumpun",
        ...getColumnSearchProps("rumpunHewan.rumpun"),
        sorter: (a, b) => a.rumpunHewan.rumpun.localeCompare(b.rumpunHewan.rumpun),
      },
      {
        title: "Kode Eartag",
        dataIndex: ["hewan", "kodeEartagNasional"],
        key: "kodeEartagNasional",
        ...getColumnSearchProps("hewan.kodeEartagNasional"),
        sorter: (a, b) => a.hewan.kodeEartagNasional.localeCompare(b.hewan.kodeEartagNasional),
      },
      {
        title: "No Kartu Ternak",
        dataIndex: ["hewan", "noKartuTernak"],
        key: "noKartuTernak",
        ...getColumnSearchProps("hewan.noKartuTernak"),
        sorter: (a, b) => a.hewan.noKartuTernak.localeCompare(b.hewan.noKartuTernak),
      },
      {
        title: "Inseminator",
        dataIndex: ["petugas", "namaPetugas"],
        key: "inseminator",
        ...getColumnSearchProps("petugas.namaPetugas"),
        sorter: (a, b) => a.petugas.namaPetugas.localeCompare(b.petugas.namaPetugas),
      },
      {
        title: "Nama Peternak",
        dataIndex: ["peternak", "namaPeternak"],
        key: "namaPeternak",
        ...getColumnSearchProps("peternak.namaPeternak"),
        sorter: (a, b) => a.peternak.namaPeternak.localeCompare(b.peternak.namaPeternak),
      },
      {
        title: "Nama Kandang",
        dataIndex: ["kandang", "namaKandang"],
        key: "namaKandang",
        ...getColumnSearchProps("kandang.namaKandang"),
        sorter: (a, b) => a.kandang.namaKandang.localeCompare(b.kandang.namaKandang),
      },
      {
        title: "Kategori",
        dataIndex: ["jenisHewan", "jenis"],
        key: "jenis",
        ...getColumnSearchProps("jenisHewan.jenis"),
        sorter: (a, b) => a.jenisHewan.jenis.localeCompare(b.jenisHewan.jenis),
      },
    ];

    if (user && (user.role === "ROLE_ADMINISTRATOR" || user.role === "ROLE_PETUGAS")) {
      baseColumns.push({
        title: "Operasi",
        key: "action",
        width: 120,
        align: "center",
        render: (text, row) => (
          <span>
            <Button type="primary" shape="circle" icon={<EditOutlined />} title="Edit" onClick={() => handleEditInseminasi(row)} />
            <Divider type="vertical" />
            <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} title="Delete" onClick={() => handleDeleteInseminasi(row)} />
          </span>
        ),
      });
    }

    return baseColumns;
  };

  const renderTable = () => {
    if (user && user.role === "ROLE_PETERNAK") {
      return <Table dataSource={inseminasis} bordered columns={renderColumns()} rowKey="idInseminasi" />;
    } else if (user && (user.role === "ROLE_ADMINISTRATOR" || user.role === "ROLE_PETUGAS")) {
      return <Table dataSource={inseminasis} bordered columns={renderColumns()} rowKey="idInseminasi" />;
    } else {
      return null;
    }
  };

  const renderButtons = () => {
    if (user && (user.role === "ROLE_ADMINISTRATOR" || user.role === "ROLE_PETUGAS")) {
      return (
        <Row gutter={[16, 16]} justify="start" style={{ paddingLeft: 9 }}>
          <Col>
            <Button type="primary" onClick={handleAddInseminasi} style={{ width: 200 }}>
              Tambah Inseminasi
            </Button>
          </Col>
          <Col>
            <Button icon={<UploadOutlined />} onClick={handleImportModalOpen} style={{ width: 200 }}>
              Import File
            </Button>
          </Col>
          <Col>
            <Button icon={<DownloadOutlined />} onClick={handleDownloadCSV} style={{ width: 200 }}>
              Download Format CSV
            </Button>
          </Col>
          <Col>
            <Button icon={<DownloadOutlined />} onClick={handleExportData} style={{ width: 200 }}>
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
    <Row gutter={[16, 16]} justify="space-between">
      {renderButtons()}
      <Col xs={24} sm={12} md={8} lg={8} xl={8}>
        <Input placeholder="Cari data" value={searchKeyword} onChange={(e) => handleSearch(e.target.value)} style={{ width: "100%" }} />
      </Col>
    </Row>
  );

  return (
    <div className="app-container">
      <TypingCard title="Manajemen Inseminasi Buatan" source="Di sini, Anda dapat mengelola daftar inseminasi di sistem." />
      <br />
      <Card>{title}</Card>
      {loading ? (
        <Card>
          <Skeleton active paragraph={{ rows: 10 }} />
        </Card>
      ) : (
        <Card style={{ overflowX: "scroll" }}>{renderTable()}</Card>
      )}

      <EditInseminasiBuatanForm
        currentRowData={currentRowData}
        wrappedComponentRef={editInseminasiFormRef}
        visible={editInseminasiModalVisible}
        confirmLoading={editInseminasiModalLoading}
        onCancel={handleCancel}
        onOk={handleEditInseminasiOk}
      />

      <AddInseminasiBuatanForm wrappedComponentRef={addInseminasiFormRef} visible={addInseminasiModalVisible} confirmLoading={addInseminasiModalLoading} onCancel={handleCancel} onOk={handleAddInseminasiOk} />

      <Modal
        title="Import File"
        open={importModalVisible}
        onCancel={handleImportModalClose}
        footer={[
          <Button key="cancel" onClick={handleImportModalClose}>
            Cancel
          </Button>,
          <Button key="upload" type="primary" loading={uploading} onClick={handleUpload}>
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

export default InseminasiBuatan;
