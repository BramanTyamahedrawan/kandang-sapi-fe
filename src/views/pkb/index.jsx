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
import {
  getPkb,
  getPkbByPeternak,
  deletePkb,
  editPkb,
  addPkb,
  addPkbImport,
} from "@/api/pkb";
import React, { useEffect, useRef, useState } from "react";
import { addJenisHewanBulk } from "@/api/jenishewan";
import { addRumpunHewanBulk } from "@/api/rumpunhewan";
import { addHewanBulkImport } from "@/api/hewan";
import { addPeternakBulkByNama } from "@/api/peternak";
import { addPetugasBulkByNama } from "@/api/petugas";
import { addKandangBulkByNama } from "@/api/kandang";
import { getPetugas } from "@/api/petugas";
import { getHewans } from "@/api/hewan";
import {
  DownloadOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { read, utils } from "xlsx";
import TypingCard from "@/components/TypingCard";
import EditPkbForm from "./forms/edit-pkb-form";
import AddPkbForm from "./forms/add-pkb-form";
import { reqUserInfo } from "../../api/user";
import { v4 as uuidv4 } from "uuid";
import { getPeternaks } from "../../api/peternak";
import { data } from "react-router-dom";
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

const cleanNik = (nik) => (nik ? nik.replace(/'/g, "").trim() : "-");

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
    try {
      const result = await getPkb();
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        const filteredPKB = content.filter((pkb) => {
          const {
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
        });

        setPkb(filteredPKB);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
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

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
    getPkbData();
  };

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
    }
  };

  const handleEditPkb = (row) => {
    setCurrentRowData({ ...row });
    setEditPkbModalVisible(true);
  };

  const handleEditPkbOk = async (values) => {
    setEditPkbModalLoading(true);
    try {
      console.log("Edit pkb values: ", values);
      await editPkb(values, currentRowData.idKejadian);
      setEditPkbModalVisible(false);
      setEditPkbModalLoading(false);
      message.success("Berhasil diedit!");
      getPkbData();
    } catch (error) {
      console.error("Pengeditan gagal, harap coba lagi!", error);
      message.error("Pengeditan gagal, harap coba lagi!");
    }
  };

  const handleDeletePkb = (row) => {
    const { idKejadian } = row;
    Modal.confirm({
      title: "Konfirmasi",
      content: "Apakah Anda yakin ingin menghapus data ini?",
      okText: "Ya",
      okType: "danger",
      cancelText: "Tidak",
      onOk: async () => {
        try {
          await deletePkb({ idKejadian });
          message.success("Berhasil dihapus");
          getPkbData();
        } catch (error) {
          console.error("Gagal menghapus data:", error);
          message.error("Gagal menghapus data, harap coba lagi.");
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
        const generateIdKejadian = uuidv4();
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

        console.log("Row Data:", row);

        const rumpunHewanUnique = row[columnMapping["Spesies"]] || "-";
        if (!uniqueData.has(rumpunHewanUnique)) {
          const dataRumpunHewan = {
            idRumpunHewan: generateIdRumpunHewan,
            rumpun: row[columnMapping["Spesies"]] || "-",
            deskripsi: "Deskripsi " + row[(columnMapping, ["Spesies"])] || "-",
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
          petugasPemeriksaBulk.push(dataPetugasPemeriksa);
          uniqueData.set(namaPetugasPemeriksa, dataPetugasPemeriksa);
        }

        const nikDataPeternak = row[columnMapping["NIK Peternak"]]
          ? cleanNik(row[columnMapping["NIK Peternak"]])
          : row[columnMapping["ID Peternak"]] || "-";

        const namaPemilikTernak = row[columnMapping["Nama Peternak"]] || "-";
        if (!uniqueData.has(namaPemilikTernak)) {
          const dataPeternak = {
            idPeternak: generateIdPeternak,
            nikPeternak: nikDataPeternak,
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
          peternakBulk.push(dataPeternak);
          uniqueData.set(namaPemilikTernak, dataPeternak);
        }

        const namaKandang = `Kandang ${
          uniqueData.get(jenisHewanUnique).jenis
        } ${uniqueData.get(namaPemilikTernak).namaPeternak}`;
        const dataKandang = {
          idKandang: generateIdKandang,
          jenis: uniqueData.get(jenisHewanUnique).jenis,
          idPeternak: uniqueData.get(namaPemilikTernak).idPeternak,
          nikPeternak: uniqueData.get(namaPemilikTernak).nikPeternak,
          namaPeternak: uniqueData.get(namaPemilikTernak).namaPeternak,
          namaKandang: namaKandang,
          alamat: row[columnMapping["Alamat Kandang**)"]] || "-",
          luas: row[columnMapping["Luas Kandang*)"]] || "-",
          kapasitas: row[columnMapping["Kapasitas Kandang*)"]] || "-",
          nilaiBangunan: row[columnMapping["Nilai Bangunan*)"]] || "-",
          jenisKandang: generateJenisKandang(
            row[columnMapping["Jenis Kandang*)"]]
          ),
          latitude: row[columnMapping["latitude"]] || "-",
          longitude: row[columnMapping["longitude"]] || "-",
        };

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
          idKandang: dataKandang.idKandang,
          namaKandang: dataKandang.namaKandang,
          jenis: uniqueData.get(jenisHewanUnique).jenis,
          rumpun: uniqueData.get(rumpunHewanUnique).rumpun,
          idPeternak: uniqueData.get(namaPemilikTernak).idPeternak,
          namaPeternak: uniqueData.get(namaPemilikTernak).namaPeternak,
          nikPeternak: uniqueData.get(namaPemilikTernak).nikPeternak,
          tujuanPemeliharaan:
            row[columnMapping["Tujuan Pemeliharaan Ternak"]] || "-",
        };

        const dataPkb = {
          idKejadian: row[columnMapping["ID Kejadian"]],
          tanggalPkb:
            formatDateToString(row[columnMapping["Tanggal PKB"]]) || "-",
          jumlah: row[columnMapping["Jumlah"]] || "-",
          umurKebuntingan:
            row[columnMapping["Umur Kebuntingan saat PKB (bulan)"]] || "-",
          idPeternak: uniqueData.get(namaPemilikTernak).idPeternak,
          namaPeternak: uniqueData.get(namaPemilikTernak).namaPeternak,
          nikPeternak: uniqueData.get(namaPemilikTernak).nikPeternak,
          idPetugas: uniqueData.get(namaPetugasPemeriksa).petugasId,
          nikPetugas: uniqueData.get(namaPetugasPemeriksa).nikPetugas,
          namaPetugas: uniqueData.get(namaPetugasPemeriksa).namaPetugas,
          idKandang: dataKandang.idKandang,
          namaKandang: dataKandang.namaKandang,
          idHewan: dataTernakHewan.idHewan,
          rumpun: uniqueData.get(rumpunHewanUnique).rumpun,
          jenis: uniqueData.get(jenisHewanUnique).jenis,
        };

        kandangBulk.push(dataKandang);
        ternakHewanBulk.push(dataTernakHewan);
        pkb.push(dataPkb);
      }

      // Send bulk data to server
      try {
        await sendJenisHewanBulkData(jenisHewanBulk);
        await sendRumpunHewanBulkData(rumpunHewanBulk);
        await sendPetugasBulkData(petugasPemeriksaBulk);
        await sendPeternakBulkData(peternakBulk);
        await sendKandangBulkData(kandangBulk);
        await sendTernakHewanBulkData(ternakHewanBulk);
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
      "Nama Peternak",
      "Nik Peternak",
      "ID Hewan",
      "Spesies",
      "kategori",
      "Jumlah",
      "Umur Kebuntingan saat PKB (bulan)",
      "Pemeriksa Kebuntingan",
    ];
    const exampleRow = [
      "1",
      "Contoh 78210308",
      "Contoh Sugi",
      "Contoh 3508070507040006",
      "Contoh 090439",
      "Contoh sapi limosin",
      "Contoh sapi potong",
      "Contoh 1",
      "Contoh 5",
      "Contoh Irfan Setiyawan P.",
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
    const csvContent = convertDataToCSV();
    downloadCSV(csvContent);
  };

  const convertDataToCSV = (data) => {
    const columnTitles = [
      "ID Kejadian",
      "Tanggal PKB",
      "Nama Peternak",
      "No Kartu Ternak",
      "Species",
      "Kategori",
      "Jumlah",
      "Umur Kebuntingan",
      "Pemeriksa Kebuntingan",
    ];

    // Gabungkan header dan data
    const rows = [columnTitles];
    data.forEach((row) => {
      const rowData = [
        row.idKejadian,
        row.tanggalPkb,
        row.peternak.namaPeternak,
        row.hewan.noKartuTernak,
        row.rumpunHewan.rumpun,
        row.jenisHewan.jenis,
        row.jumlah,
        row.umurKebuntingan,
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
    link.setAttribute("download", "Hewan.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link); // Clean up
  };

  const renderColumns = () => {
    const baseColumns = [
      { title: "ID Kejadian", dataIndex: "idKejadian", key: "idKejadian" },
      { title: "Tanggal PKB", dataIndex: "tanggalPkb", key: "tanggalPkb" },
      {
        title: "Nama Peternak",
        dataIndex: ["peternak", "namaPeternak"],
        key: "namaPeternak",
      },
      {
        title: "No Kartu Ternak",
        dataIndex: ["hewan", "noKartuTernak"],
        key: "noKartuTernak",
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
          rowKey="idKejadian"
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
          rowKey="idKejadian"
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

  return (
    <div className="app-container">
      {/* TypingCard component */}

      <TypingCard
        title="Manajemen PKB"
        source="Di sini, Anda dapat mengelola daftar pkb di sistem."
      />
      <br />

      <Card title={title} style={{ overflowX: "scroll" }}>
        {renderTable()}
      </Card>

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

      {/* Modal Import */}
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
