/* eslint-disable no-constant-condition */
/* eslint-disable no-unused-vars */
// import { Component, useState, useRef } from "react";
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
import { UploadOutlined, EditOutlined, DeleteOutlined, DownloadOutlined } from "@ant-design/icons";
import { read, utils } from "xlsx";
import AddInseminasiBuatanForm from "./forms/add-inseminasi-form";
import EditInseminasiBuatanForm from "./forms/edit-inseminasi-form";
import TypingCard from "@/components/TypingCard";
import React, { useEffect, useRef, useState } from "react";
import { reqUserInfo } from "../../api/user";
import { v4 as uuidv4 } from "uuid";
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
      const response = await addInseminsasiBulk(batchData);
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
    try {
      const result = await getInseminasis();
      const { content, statusCode } = result.data;

      if (statusCode === 200) {
        const filteredInseminasi = content.filter((inseminasi) => {
          const { idInseminasi, idPeternak, namaPeternak, kodeEartagNasional, idPejantan, idPembuatan, bangsaPejantan, produsen, inseminator, lokasi } = inseminasi;
          const keyword = searchKeyword.toLowerCase();

          return (
            idInseminasi?.toLowerCase().includes(keyword) ||
            idPeternak?.toLowerCase().includes(keyword) ||
            namaPeternak?.toLowerCase().includes(keyword) ||
            kodeEartagNasional?.toLowerCase().includes(keyword) ||
            idPejantan?.toLowerCase().includes(keyword) ||
            idPembuatan?.toLowerCase().includes(keyword) ||
            bangsaPejantan?.toLowerCase().includes(keyword) ||
            produsen?.toLowerCase().includes(keyword) ||
            inseminator?.toLowerCase().includes(keyword) ||
            lokasi?.toLowerCase().includes(keyword)
          );
        });

        setInseminasis(filteredInseminasi);
      }
    } catch (error) {
      console.error("Failed to fetch inseminasis:", error);
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

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
    getInseminasisData();
  };

  const handleAddInseminasi = () => {
    setAddInseminasiModalVisible(true);
  };

  const handleAddInseminasiOk = async (values) => {
    setAddInseminasiModalLoading(true);
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
    }
  };

  const handleEditInseminasi = (row) => {
    setCurrentRowData({ ...row });
    setEditInseminasiModalVisible(true);
  };

  const handleEditInseminasiOk = async (values) => {
    setEditInseminasiModalLoading(true);
    try {
      await editInseminasi(values, currentRowData.idInseminasi);
      setEditInseminasiModalVisible(false);
      setEditInseminasiModalLoading(false);
      message.success("Berhasil diedit!");
      getInseminasisData();
    } catch (e) {
      setEditInseminasiModalLoading(false);
      message.error("Pengeditan gagal, harap coba lagi!");
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
        try {
          await deleteInseminasi({ idInseminasi });
          message.success("Berhasil dihapus");
          getInseminasisData();
        } catch (error) {
          message.error("Gagal menghapus data, harap coba lagi!");
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

        const namaPetugasInseminator = row[columnMapping["Inseminator"]];

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

        console.log("Row Data:", row);

        if (!uniqueData.has(row[columnMapping["Bangsa Pejantan"]])) {
          const dataRumpunHewan = {
            idRumpunHewan: row[columnMapping["ID Rumpun Hewan"]] || generateIdRumpunHewan,
            rumpun: row[columnMapping["Bangsa Pejantan"]] || "-",
            deskripsi: "Deskripsi " + row[(columnMapping, ["Bangsa Pejantan"])] || "-",
          };
          rumpunHewanBulk.push(dataRumpunHewan);
          uniqueData.set(row[columnMapping["Bangsa Pejantan"]], true);
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

        const dataPeternak = {
          idPeternak: row[columnMapping["ID Peternak"]] || generateIdPeternak,
          nikPeternak: cleanNik(row[columnMapping["NIK Peternak"]]) || "-",
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

        const dataKandang = {
          idKandang: row[columnMapping["ID Kandang"]] || generateIdKandang,
          peternak_id: dataPeternak.idPeternak,
          nikPeternak: dataPeternak.nikPeternak,
          namaPeternak: dataPeternak.namaPeternak,
          namaKandang: `Kandang ${dataPeternak.namaPeternak}`,
          alamat: row[columnMapping["Alamat Kandang**)"]] || "-",
          luas: row[columnMapping["Luas Kandang*)"]] || "_",
          kapasitas: row[columnMapping["Kapasitas Kandang*)"]] || "_",
          nilaiBangunan: row[columnMapping["Nilai Bangunan*)"]] || "_",
          jenisKandang: generateJenisKandang(row[columnMapping["Jenis Kandang"]]),
          latitude: row[columnMapping["latitude"]] || "-",
          longitude: row[columnMapping["longitude"]] || "-",
        };

        const dataTernakHewan = {
          idHewan: row[columnMapping["ID Hewan"]] || generateIdHewan,
          kodeEartagNasional: row[columnMapping["eartag"]] || "-",
          noKartuTernak: row[columnMapping["kartu ternak induk"]] || "_",
          idIsikhnasTernak: row[columnMapping["IdIsikhnas"]] || "_",
          sex: row[columnMapping["Jenis Kelamin**)"]] || "_",
          tempatLahir: row[columnMapping["Tempat Lahir Ternak"]] || "_",
          umur: row[columnMapping["Umur"]] || "_",
          identifikasiHewan: row[columnMapping["Identifikasi Hewan*"]] || row[columnMapping["Identifikasi Hewan"]] || "_",
          tanggalTerdaftar: formatDateToString(row[columnMapping["Tanggal Pendataan"]] || "-"),
          idPetugas: uniqueData.get(namaPetugasInseminator).petugasId,
          nikPetugas: uniqueData.get(namaPetugasInseminator).nikPetugas,
          namaPetugas: uniqueData.get(namaPetugasInseminator).namaPetugas,
          tanggalLahir: formatDateToString(row[columnMapping["Tanggal Lahir Ternak**)"]] || "-"),
          nikPeternak: dataPeternak.nikPeternak,
          idKandang: dataKandang.idKandang,
          namaKandang: dataKandang.namaKandang,
          jenis: row[columnMapping["kategori"]] || "-",
          rumpun: row[columnMapping["Bangsa Pejantan"]] || "-",
          idPeternak: dataPeternak.idPeternak,
          namaPeternak: dataPeternak.namaPeternak,
          tujuanPemeliharaan: row[columnMapping["Tujuan Pemeliharaan Ternak"]] || "-",
        };

        // data inseminasi
        const dataInseminasi = {
          idInseminasi: row[columnMapping["ID"]] || generateIdInseminasi,
          tanggalIB: formatDateToString(row[columnMapping["Tanggal IB"]]) || "-",
          ib1: row[columnMapping["IB 1"]] || "-",
          ib2: row[columnMapping["IB 2"]] || "-",
          ib3: row[columnMapping["IB 3"]] || "-",
          ibLain: row[columnMapping["IB lain"]] || "-",
          idPejantan: row[columnMapping["ID Pejantan"]] || "-",
          produsen: row[columnMapping["Produsen"]] || "-",
          idPembuatan: row[columnMapping["ID Pembuatan"]] || "-",
          namaPeternak: dataPeternak.namaPeternak,
          idPeternak: dataPeternak.idPeternak,
          nikPeternak: dataPeternak.nikPeternak,
          idHewan: dataTernakHewan.idHewan,
          kodeEartagNasional: dataTernakHewan.kodeEartagNasional,
          bangsaPejantan: row[columnMapping["Bangsa Pejantan"]] || "-",
          idPetugas: uniqueData.get(namaPetugasInseminator).petugasId,
          namaPetugas: uniqueData.get(namaPetugasInseminator).namaPetugas,
          nikPetugas: uniqueData.get(namaPetugasInseminator).nikPetugas,
          idKandang: dataKandang.idKandang,
          namaKandang: dataKandang.namaKandang,
          rumpun: dataTernakHewan.rumpun,
          jenis: dataTernakHewan.jenis,
        };

        console.log("Data Inseminasi:", dataInseminasi);

        // petugasInseminasi.push(dataPetugas);
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
      setImportedData([]); // Reset state setelah pemrosesan selesai
      setColumnTitles([]);
      setColumnMapping({});
    }
  };

  const handleDownloadCSV = () => {
    const csvContent = convertHeaderToCSV();
    downloadFormatCSV(csvContent);
  };

  const convertHeaderToCSV = () => {
    const columnTitlesLocal = ["Tanggal IB", "Lokasi", "Nama Peternak", "eartag", "IB 1", "IB 2", "IB 3", "IB lain", "ID Pejantan", "ID Pembuatan", "Bangsa Pejantan", "Produsen", "Inseminator"];
    const rows = [columnTitlesLocal];
    let csvContent = "data:text/csv;charset=utf-8,";
    rows.forEach((rowArray) => {
      const row = rowArray.join(";");
      csvContent += row + "\r\n";
    });

    return csvContent;
  };

  const downloadFormatCSV = (csvContent) => {
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "format_inseminasi.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportData = () => {
    const { inseminasis } = this.state;
    const csvContent = this.convertToCSV(inseminasis);
    this.downloadCSV(csvContent);
  };

  const convertToCSV = (data) => {
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

  const downloadCSV = (csvContent) => {
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Inseminasi.csv");
    document.body.appendChild(link);
    link.click();
  };

  const renderColumns = () => {
    const baseColumns = [
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
      { title: "Alamat", dataIndex: ["peternak", "alamat"], key: "alamat" },
      {
        title: "Kode Eartag",
        dataIndex: ["hewan", "kodeEartagNasional"],
        key: "kodeEartagNasional",
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
      { title: "ID Pejantan", dataIndex: "idPejantan", key: "idPejantan" },
      { title: "ID Pembuatan", dataIndex: "idPembuatan", key: "idPembuatan" },
      {
        title: "Bangsa Pejantan",
        dataIndex: ["rumpunHewan", "rumpun"],
        key: "rumpun",
      },
      { title: "Produsen", dataIndex: "produsen", key: "produsen" },
      {
        title: "Inseminator",
        dataIndex: ["petugas", "namaPetugas"],
        key: "inseminator",
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
            <Button type="primary" onClick={handleAddInseminasi} block>
              Tambah Inseminasi
            </Button>
          </Col>
          <Col>
            <Button icon={<UploadOutlined />} onClick={handleImportModalOpen} block>
              Import File
            </Button>
          </Col>
          <Col>
            <Button icon={<DownloadOutlined />} onClick={handleDownloadCSV} block>
              Download Format CSV
            </Button>
          </Col>
          <Col>
            <Button icon={<DownloadOutlined />} onClick={handleExportData} block>
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
      <Card title={title} style={{ overflowX: "scroll" }}>
        {renderTable()}
      </Card>

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
