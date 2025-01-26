/* eslint-disable no-unused-vars */
import { Component } from "react";
import { Card, Button, Table, message, Row, Col, Divider, Modal, Upload, Input } from "antd";
import { UploadOutlined, EditOutlined, DeleteOutlined, DownloadOutlined } from "@ant-design/icons";
import { getKelahiran, getKelahiranByPeternak, deleteKelahiran, editKelahiran, addKelahiran, addKelahiranBulk } from "@/api/kelahiran";
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
import { set } from "nprogress";

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

const sendInseminasiBulkData = async (data, batchSize = 7000) => {
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

const sendKelahiranBulkData = async (data, batchSize = 7000) => {
  const totalBatches = Math.ceil(data.length / batchSize);

  for (let i = 0; i < totalBatches; i++) {
    const batchData = data.slice(i * batchSize, (i + 1) * batchSize);

    try {
      console.log(`Data Kelahiran (Batch ${i + 1}):`, batchData); // Log data yang dikirim
      const response = await addKelahiranBulk(batchData);
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

const Kelahiran = () => {
  const [kelahirans, setKelahirans] = useState([]);
  const [petugas, setPetugas] = useState([]);
  const [editKelahiranModalVisible, setEditKelahiranModalVisible] = useState(false);
  const [editKelahiranModalLoading, setEditKelahiranModalLoading] = useState(false);
  const [currentRowData, setCurrentRowData] = useState({});
  const [addKelahiranModalVisible, setAddKelahiranModalVisible] = useState(false);
  const [addKelahiranModalLoading, setAddKelahiranModalLoading] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importedData, setImportedData] = useState([]);
  const [columnTitles, setColumnTitles] = useState([]);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [columnMapping, setColumnMapping] = useState({});
  const [searchKeyword, setSearchKeyword] = useState("");
  const [user, setUser] = useState(null);

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
    try {
      const result = await getKelahiran();
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        const filteredKelahiran = content.filter((kelahiran) => {
          const { idKejadian, tanggalLaporan, tanggalLahir, idPeternak, petugasId, idKandang, idJenisHewan, idRumpunHewan, kategori, jumlah, idHewanAnak, eartagAnak, jenisKelaminAnak, noKartuTernakAnak, spesies, urutanIB } = kelahiran;
          const keyword = searchKeyword?.toLowerCase();

          return (
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
        });

        setKelahirans(filteredKelahiran);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
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
    try {
      await addKelahiran(values);
      setAddKelahiranModalVisible(false);
      setAddKelahiranModalLoading(false);
      message.success("Berhasil ditambahkan!");
      getKelahiranData();
    } catch (error) {
      console.error("Failed to add data:", error);
      message.error("Gagal menambahkan data, harap coba lagi!");
    }
  };

  const handleDeleteKelahiran = (row) => {
    const { idKejadian } = row;
    Modal.confirm({
      title: "Konfirmasi",
      content: "Apakah Anda yakin ingin menghapus data ini?",
      okText: "Ya",
      okType: "danger",
      cancelText: "Tidak",
      onOk: async () => {
        try {
          await deleteKelahiran({ idKejadian });
          message.success("Berhasil dihapus!");
          getKelahiranData();
        } catch (error) {
          message.error("Gagal menghapus data, harap coba lagi!");
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
    try {
      console.log("Edit Kelahiran Values:", values);
      await editKelahiran(values, currentRowData.idKejadian);
      setEditKelahiranModalVisible(false);
      setEditKelahiranModalLoading(false);
      message.success("Berhasil diubah!");
      getKelahiranData();
    } catch (error) {
      console.error("Failed to edit data:", error);
      message.error("Gagal mengubah data, harap coba lagi!");
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
        const generateIdKejadian = uuidv4();
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

        console.log("Row Data:", row);

        if (!uniqueData.has(row[columnMapping["Spesies Induk"]])) {
          const dataRumpunHewan = {
            idRumpunHewan: row[columnMapping["ID Rumpun Hewan"]] || generateIdRumpunHewan,
            rumpun: row[columnMapping["Spesies Induk"]] || "-",
            deskripsi: "Deskripsi " + row[columnMapping["Spesies Induk"]] || "-",
          };
          rumpunHewanBulk.push(dataRumpunHewan);
          uniqueData.set(row[columnMapping["Spesies Induk"]], true);
        }

        if (!uniqueData.has(row[columnMapping["kategori"]])) {
          const dataJenisHewan = {
            idJenisHewan: row[columnMapping["ID Jenis Hewan"]] || generateIdJenisHewan,
            jenis: row[columnMapping["kategori"]] || "-",
            deskripsi: "Deskripsi " + row[columnMapping["kategori"]] || "-",
          };
          jenisHewanBulk.push(dataJenisHewan);
          uniqueData.set(row[columnMapping["kategori"]], true);
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

        const idPeternakDuplikat = row[columnMapping["ID Peternak"]] || "-";
        if (!uniqueData.has(idPeternakDuplikat)) {
          const dataPeternak = {
            idPeternak: row[columnMapping["ID Peternak"]] || generateIdPeternak,
            nikPeternak: cleanNik(row[columnMapping["NIK Peternak"]]) || "-",
            namaPeternak: row[columnMapping["Nama Peternak"]] || "-",
            noTelpPeternak: row[columnMapping["No Telp"]] || "-",
            emailPeternak: validateEmail(row[columnMapping["Email Pemilik Ternak"]]) || "-",
            idPetugas: uniqueData.get(namaPetugasPelapor).petugasId,
            nikPetugas: uniqueData.get(namaPetugasPelapor).nikPetugas,
            namaPetugas: uniqueData.get(namaPetugasPelapor).namaPetugas,
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
          uniqueData.set(idPeternakDuplikat, dataPeternak);
        }

        const dataKandang = {
          idKandang: row[columnMapping["ID Kandang"]] || generateIdKandang,
          peternak_id: uniqueData.get(idPeternakDuplikat).idPeternak,
          nikPeternak: uniqueData.get(idPeternakDuplikat).nikPeternak,
          namaPeternak: uniqueData.get(idPeternakDuplikat).namaPeternak,
          namaKandang: `Kandang ${uniqueData.get(idPeternakDuplikat).namaPeternak}`,
          alamat: row[columnMapping["Alamat Kandang**)"]] || "Alamat Tidak Valid",
          luas: row[columnMapping["Luas Kandang*)"]] || "_",
          kapasitas: row[columnMapping["Kapasitas Kandang*)"]] || "_",
          nilaiBangunan: row[columnMapping["Nilai Bangunan*)"]] || "_",
          jenisKandang: generateJenisKandang(row[columnMapping["Jenis Kandang"]]),
          latitude: row[columnMapping["latitude"]] || "-",
          longitude: row[columnMapping["longitude"]] || "-",
        };

        const dataTernakHewan = {
          idHewan: row[columnMapping["ID Hewan Induk"]] || generateIdHewan,
          kodeEartagNasional: row[columnMapping["eartag_induk"]] || "-",
          noKartuTernak: row[columnMapping["kartu ternak induk"]] || "-",
          idIsikhnasTernak: row[columnMapping["IdIsikhnas"]] || "-",
          tanggalLahir: formatDateToString(row[columnMapping["Tanggal Lahir Ternak**)"]] || "-"),
          sex: row[columnMapping["Jenis Kelamin**)"]] || "-",
          tempatLahir: row[columnMapping["Tempat Lahir Ternak"]] || "-",
          umur: row[columnMapping["Umur"]] || "-",
          identifikasiHewan: row[columnMapping["Identifikasi Hewan*"]] || row[columnMapping["Identifikasi Hewan"]] || "_",
          tanggalTerdaftar: formatDateToString(row[columnMapping["Tanggal Pendataan"]] || "-"),
          nikPetugas: uniqueData.get(namaPetugasPelapor).nikPetugas,
          namaPetugas: uniqueData.get(namaPetugasPelapor).namaPetugas,
          idPetugas: uniqueData.get(namaPetugasPelapor).petugasId,
          nikPeternak: uniqueData.get(idPeternakDuplikat).nikPeternak,
          idKandang: dataKandang.idKandang,
          namaKandang: dataKandang.namaKandang,
          jenis: row[columnMapping["kategori"]] || "-",
          rumpun: row[columnMapping["Spesies Induk"]] || "-",
          idPeternak: uniqueData.get(idPeternakDuplikat).idPeternak,
          namaPeternak: uniqueData.get(idPeternakDuplikat).namaPeternak,
          tujuanPemeliharaan: row[columnMapping["Tujuan Pemeliharaan Ternak**)"]] || "_",
        };

        if (row[columnMapping["ID Pejantan Straw"]] != null) {
          const dataInseminasi = {
            idInseminasi: row[columnMapping["ID Inseminasi"]] || generateIdInseminasi,
            tanggalIB: formatDateToString(row[columnMapping["Tanggal IB"]]) || "-",
            namaPeternak: uniqueData.get(idPeternakDuplikat).namaPeternak,
            idPeternak: uniqueData.get(idPeternakDuplikat).idPeternak,
            nikPeternak: uniqueData.get(idPeternakDuplikat).nikPeternak,
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
            idKandang: dataKandang.idKandang,
            namaKandang: dataKandang.namaKandang,
          };
          inseminasiBulk.push(dataInseminasi);
        }

        // data kelahiran
        const dataKelahiran = {
          idKejadian: row[columnMapping["id kejadian"]] || generateIdKejadian,
          tanggalLaporan: formatDateToString(row[columnMapping["Tanggal laporan"]] || "_"),
          tanggalLahir: formatDateToString(row[columnMapping["Tanggal lahir"]] || "_"),
          idPeternak: uniqueData.get(idPeternakDuplikat).idPeternak,
          namaPeternak: uniqueData.get(idPeternakDuplikat).namaPeternak,
          idKandang: dataKandang.idKandang,
          namaKandang: dataKandang.namaKandang,
          idHewan: dataTernakHewan.idHewan,
          noKartuTernak: dataTernakHewan.noKartuTernak,
          kodeEartagNasional: dataTernakHewan.kodeEartagNasional,
          spesies: row[columnMapping["Spesies Induk"]] || "-",
          kategori: row[columnMapping["kategori"]] || "-",
          jumlah: row[columnMapping["Jumlah"]] || "_",
          eartagAnak: row[columnMapping["eartag_anak"]] || "_",
          idHewanAnak: row[columnMapping["ID Hewan Anak"]] || "_",
          noKartuTernakAnak: row[columnMapping["kartu ternak anak"]] || "_",
          jenisKelaminAnak: row[columnMapping["Jenis Kelamin Anak"]] || "_",
          nikPetugas: uniqueData.get(namaPetugasPelapor).nikPetugas,
          namaPetugas: uniqueData.get(namaPetugasPelapor).namaPetugas,
          petugasId: uniqueData.get(namaPetugasPelapor).petugasId,
          jenis: row[columnMapping["kategori"]] || "-",
          rumpun: row[columnMapping["Spesies Induk"]] || "-",
          urutanIB: row[columnMapping["urutan_ib"]] || "_",
          idPejantan: row[columnMapping["ID Pejantan Straw"]] || "_",
        };

        kandangBulk.push(dataKandang);
        ternakHewanBulk.push(dataTernakHewan);
        kelahiranBulk.push(dataKelahiran);
      }

      // Send bulk data to server
      try {
        await sendJenisHewanBulkData(jenisHewanBulk);
        await sendRumpunHewanBulkData(rumpunHewanBulk);
        await sendPetugasBulkData(petugasKelahiran);
        await sendPeternakBulkData(peternakBulk);
        await sendKandangBulkData(kandangBulk);
        await sendTernakHewanBulkData(ternakHewanBulk);
        await sendInseminasiBulkData(inseminasiBulk);
        await sendKelahiranBulkData(kelahiranBulk);
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
      setImportedData([]);
      setColumnTitles([]);
      setFileName("");
      setColumnMapping({});
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
      "Lokasi",
      "Nama Peternak",
      "kartu ternak induk",
      "eartag_induk",
      "Spesies Induk",
      "ID Pejantan Straw",
      "ID Batch Straw",
      "Produsen Straw",
      "Spesies Pejantan",
      "Jumlah",
      "kartu ternak anak",
      "ID Hewan Anak",
      "eartag_anak",
      "Jenis Kelamin Anak",
      "kategori",
      "Petugas Pelapor",
      "urutan_ib",
    ];
    const exampleRow = [
      "1",
      "Contoh 85500384",
      "Contoh 29/05/2023",
      "Contoh 26/01/2023",
      "Contoh Jawa Timur, Lumajang, Sukodono, Kebonagung",
      "Contoh Abdul Hasan",
      "Contoh 66797328",
      "Contoh AAA350002822878",
      "Contoh sapi limosin",
      "Contoh 616131",
      "Contoh AT0723",
      "Contoh BIB Lembang",
      "Contoh sapi simental",
      "Contoh 1",
      "Contoh BDM5215",
      "Contoh AAA350001940111",
      "Contoh betina",
      "Contoh sapi potong",
      "Contoh Budi Mulyono",
      "Contoh 1",
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
    const { kelahirans } = this.state;
    const csvContent = this.convertToCSV(kelahirans);
    this.downloadCSV(csvContent);
  };

  const convertToCSV = (data) => {
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

  const downloadCSV = (csvContent) => {
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Kelahiran.csv");
    document.body.appendChild(link);
    link.click();
  };

  const renderColumns = () => {
    const baseColumns = [
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
      {
        title: "Nama Peternak",
        dataIndex: ["peternak", "namaPeternak"],
        key: "namaPeternak",
      },
      {
        title: "ID Peternak",
        dataIndex: ["peternak", "idPeternak"],
        key: "idPeternak",
      },
      {
        title: "Eartag Induk",
        dataIndex: ["hewan", "kodeEartagNasional"],
        key: "kodeEartagNasional",
      },
      {
        title: "Kartu Ternak Induk",
        dataIndex: ["hewan", "noKartuTernak"],
        key: "noKartuTernak",
      },
      {
        title: "ID Pejantan",
        dataIndex: ["inseminasi", "idPejantan"],
        key: "idPejantan",
      },
      {
        title: "ID Pembuatan",
        dataIndex: ["inseminasi", "idPembuatan"],
        key: "idPembuatan",
      },
      {
        title: "Produsen",
        dataIndex: ["inseminasi", "produsen"],
        key: "produsen",
      },
      {
        title: "Bangsa Pejantan",
        dataIndex: ["inseminasi", "bangsaPejantan"],
        key: "bangsaPejantan",
      },
      { title: "Eartag Anak", dataIndex: "eartagAnak", key: "eartagAnak" },
      {
        title: "Jenis Kelamin Anak",
        dataIndex: "jenisKelaminAnak",
        key: "jenisKelaminAnak",
      },
      { title: "Spesies", dataIndex: ["rumpunHewan", "rumpun"], key: "rumpun" },
      { title: "Kategori", dataIndex: ["jenisHewan", "jenis"], key: "jenis" },
      {
        title: "Petugas Pelapor",
        dataIndex: ["petugas", "namaPetugas"],
        key: "namaPetugas",
      },
      { title: "Urutan IB", dataIndex: "urutanIB", key: "urutanIB" },
    ];

    if (user && (user.role === "ROLE_ADMINISTRATOR" || "ROLE_PETUGAS")) {
      baseColumns.push({
        title: "Operasi",
        key: "action",
        width: 120,
        align: "center",
        render: (text, row) => (
          <span>
            <Button type="primary" shape="circle" icon={<EditOutlined />} title="Edit" onClick={() => handleEditKelahiran(row)} />
            <Divider type="vertical" />
            <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} title="Delete" onClick={() => handleDeleteKelahiran(row)} />
          </span>
        ),
      });
    }

    return baseColumns;
  };

  const renderTable = () => {
    if (user && user.role === "ROLE_PETERNAK") {
      return <Table dataSource={kelahirans} bordered columns={renderColumns} rowKey="idKejadian" />;
    } else if (user && (user.role === "ROLE_ADMINISTRATOR" || user.role === "ROLE_PETUGAS")) {
      return <Table dataSource={kelahirans} bordered columns={renderColumns()} rowKey="idKejadian" />;
    } else {
      return null;
    }
  };

  const renderButtons = () => {
    if (user && (user.role === "ROLE_ADMINISTRATOR" || user.role === "ROLE_PETUGAS")) {
      return (
        <Row gutter={[16, 16]} justify="start" style={{ paddingLeft: 9 }}>
          <Col>
            <Button type="primary" onClick={handleAddKelahiran} block>
              Tambah Kelahiran
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
        <Input placeholder="Cari data" value={searchKeyword} onChange={(e) => handleSearch(e.target.value)} style={{ width: 235, marginLeft: 10 }} />
      </Col>
    </Row>
  );

  // const { role } = user ? user.role : "";
  // console.log("peran pengguna:", role);
  // const cardContent = `Di sini, Anda dapat mengelola daftar kelahirans di sistem.`;

  return (
    <div className="app-container">
      <TypingCard title="Manajemen Kelahiran" source="Di sini, Anda dapat mengelola daftar kelahirans di sistem." />
      <br />
      <Card title={title} style={{ overflowX: "scroll" }}>
        {renderTable()}
      </Card>
      <EditKelahiranForm currentRowData={currentRowData} wrappedComponentRef={editKelahiranFormRef} visible={editKelahiranModalVisible} confirmLoading={editKelahiranModalLoading} onCancel={handleCancel} onOk={handleEditKelahiranOk} />
      <AddKelahiranForm wrappedComponentRef={addKelahiranFormRef} visible={addKelahiranModalVisible} confirmLoading={addKelahiranModalLoading} onCancel={handleCancel} onOk={handleAddKelahiranOk} />
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

export default Kelahiran;
