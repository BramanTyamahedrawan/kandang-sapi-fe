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
  Space,
} from "antd";
import {
  getPengobatan,
  deletePengobatan,
  editPengobatan,
  addPengobatan,
  addPengobatanImport,
} from "@/api/pengobatan";
import { getPetugas } from "@/api/petugas";
import { read, utils } from "xlsx";
import React, { useEffect, useRef, useState } from "react";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import AddPengobatanForm from "./forms/add-pengobatan-form";
import { addPetugasBulkByNama } from "@/api/petugas";
import EditPengobatanForm from "./forms/edit-pengobatan-form";
import TypingCard from "@/components/TypingCard";
import { reqUserInfo } from "../../api/user";
import { v4 as uuidv4 } from "uuid";
import { Skeleton } from "antd";
import Highlighter from "react-highlight-words";
import { use } from "react";
import { set } from "nprogress";

const sendPetugasImport = async (data, batchSize = 7000) => {
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

const sendPengobatanImport = async (data, batchSize = 7000) => {
  const totalBatches = Math.ceil(data.length / batchSize);

  for (let i = 0; i < totalBatches; i++) {
    const batchData = data.slice(i * batchSize, (i + 1) * batchSize);

    try {
      console.log(`Data Pengobatan (Batch ${i + 1}):`, batchData); // Log data yang dikirim
      const response = await addPengobatanImport(batchData);
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

const Pengobatan = () => {
  const [pengobatan, setPengobatan] = useState([]);
  const [petugas, setPetugas] = useState([]);
  const [editPengobatanModalVisible, setEditPengobatanModalVisible] =
    useState(false);
  const [editPengobatanModalLoading, setEditPengobatanModalLoading] =
    useState(false);
  const [currentRowData, setCurrentRowData] = useState({});
  const [addPengobatanModalVisible, setAddPengobatanModalVisible] =
    useState(false);
  const [addPengobatanModalLoading, setAddPengobatanModalLoading] =
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
  const editPengobatanFormRef = useRef();
  const addPengobatanFormRef = useRef();

  useEffect(() => {
    const fetchInitialData = async () => {
      await getPetugasData();

      try {
        const response = await reqUserInfo();
        const userData = response.data;
        setUser(userData);

        await getPengobatanData();
      } catch (error) {
        console.error("Terjadi kesalahan saat mengambil data user:", error);
      }
    };

    fetchInitialData();
  }, []);

  const getPengobatanData = async () => {
    setLoading(true);
    try {
      const result = await getPengobatan();
      const { content, statusCode } = result.data;

      if (statusCode === 200) {
        const filteredPengobatan = content.filter((pengobatan) => {
          const {
            idPengobatan,
            idKasus,
            tanggalPengobatan,
            tanggalKasus,
            namaInfrastruktur,
            lokasi,
            dosis,
            sindrom,
            diagnosaBanding,
            provinsiPengobatan,
            kabupatenPengobatan,
            kecamatanPengobatan,
            desaPengobatan,
            petugasId,
          } = pengobatan;
          const keyword = searchKeyword.toLowerCase();

          return (
            idPengobatan.toLowerCase().includes(keyword) ||
            idKasus.toLowerCase().includes(keyword) ||
            tanggalPengobatan.toLowerCase().includes(keyword) ||
            tanggalKasus.toLowerCase().includes(keyword) ||
            namaInfrastruktur.toLowerCase().includes(keyword) ||
            lokasi.toLowerCase().includes(keyword) ||
            dosis.toLowerCase().includes(keyword) ||
            sindrom.toLowerCase().includes(keyword) ||
            diagnosaBanding.toLowerCase().includes(keyword) ||
            provinsiPengobatan.toLowerCase().includes(keyword) ||
            kabupatenPengobatan.toLowerCase().includes(keyword) ||
            kecamatanPengobatan.toLowerCase().includes(keyword) ||
            desaPengobatan.toLowerCase().includes(keyword) ||
            petugasId.toLowerCase().includes(keyword)
          );
        });

        setPengobatan(filteredPengobatan);
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data pengobatan:", error);
    } finally {
      setLoading(false);
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
      console.error("Terjadi kesalahan saat mengambil data petugas:", error);
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

  // const handleSearch = (keyword) => {
  //   setSearchKeyword(keyword);
  //   getPengobatanData();
  // };

  const handleImportModalOpen = () => {
    setImportModalVisible(true);
  };

  const handleImportModalClose = () => {
    setImportModalVisible(false);
  };

  const handleCancel = () => {
    setEditPengobatanModalVisible(false);
    setAddPengobatanModalVisible(false);
    setImportModalVisible(false);
  };

  const handleAddPengobatan = () => {
    setAddPengobatanModalVisible(true);
  };

  const handleAddPengobatanOk = async (values) => {
    setAddPengobatanModalLoading(true);
    setLoading(true);
    try {
      await addPengobatan(values);
      setAddPengobatanModalVisible(false);
      setAddPengobatanModalLoading(false);
      message.success("Berhasil menambahkan data pengobatan!");
      setLoading(false);
      getPengobatanData();
    } catch (error) {
      console.error("Gagal menambahkan data pengobatan:", error);
      message.error("Gagal menambahkan data pengobatan, harap coba lagi!");
    }
  };

  const handleEditPengobatan = (row) => {
    setCurrentRowData({ ...row });
    setEditPengobatanModalVisible(true);
  };

  const handleEditPengobatanOk = async (values) => {
    setEditPengobatanModalLoading(true);
    setLoading(true);
    try {
      console.log("Data yang akan diubah:", values);
      await editPengobatan(values, currentRowData.idPengobatan);
      setEditPengobatanModalVisible(false);
      setEditPengobatanModalLoading(false);
      message.success("Berhasil mengubah data pengobatan!");
      setLoading(false);
      getPengobatanData();
    } catch (error) {
      console.error("Gagal mengubah data pengobatan:", error);
      message.error("Gagal mengubah data pengobatan, harap coba lagi!");
    }
  };

  const handleDeletePengobatan = (row) => {
    const { idPengobatan } = row;
    Modal.confirm({
      title: "Konfirmasi",
      content: "Apakah Anda yakin ingin menghapus data ini?",
      okText: "Ya",
      okType: "danger",
      cancelText: "Tidak",
      onOk: async () => {
        setLoading(true);
        try {
          await deletePengobatan({ idPengobatan });
          message.success("Berhasil menghapus data pengobatan!");
          setLoading(false);
          getPengobatanData();
        } catch (error) {
          console.error("Gagal menghapus data pengobatan:", error);
          message.error("Gagal menghapus data pengobatan, harap coba lagi!");
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

      const importedData = jsonData.slice(1); // Exclude the first row (column titles)
      const columnTitles = jsonData[0]; // Assume the first row contains column titles

      const columnMapping = {};
      columnTitles.forEach((title, index) => {
        columnMapping[title.trim()] = index;
      });

      setImportedData(importedData);
      setColumnTitles(columnTitles);
      setFileName(file.name);
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

      const pengobatan = [];
      const petugasPengobatan = [];

      for (const row of importedData) {
        const generateIdPetugas = uuidv4();
        const generateIdPengobatan = uuidv4();

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

        const pecahLokasi = parseAddress(
          row[columnMapping["Lokasi"]] || row[columnMapping["Alamat"]] || "-"
        );
        // const setEmail =;

        const namaPetugasPengobatan = row[columnMapping["Petugas"]] || "-";
        if (!uniqueData.has(namaPetugasPengobatan)) {
          const dataPetugasPengobatan = {
            petugasId: generateIdPetugas,
            nikPetugas: cleanNik(row[columnMapping["NIK Petugas"]]) || "-",
            namaPetugas: row[columnMapping["Petugas"]] || "-",
            noTelp: row[columnMapping["No. Telp Petugas"]] || "-",
            email: validateEmail(row[columnMapping["Email Petugas"]]) || "-",
            job: "Petugas Pengobatan",
          };
          petugasPengobatan.push(dataPetugasPengobatan);
          uniqueData.set(namaPetugasPengobatan, dataPetugasPengobatan);
        }

        // data vaksin
        const dataPengobatan = {
          idPengobatan: generateIdPengobatan,
          idKasus: row[columnMapping["ID Kasus"]] || "-",
          tanggalPengobatan: formatDateToString(
            row[columnMapping["tanggal_pengobatan"]] || "-"
          ),
          tanggalKasus:
            formatDateToString(row[columnMapping["tanggal_kasus"]]) || "-",
          namaInfrastruktur: row[columnMapping["Nama Infrasruktur"]] || "-",
          lokasi: row[columnMapping["Lokasi"]] || "-",
          provinsiPengobatan: pecahLokasi.provinsi,
          kabupatenPengobatan: pecahLokasi.kabupaten,
          kecamatanPengobatan: pecahLokasi.kecamatan,
          desaPengobatan: pecahLokasi.desa,
          dosis: row[columnMapping["Dosis"]] || "-",
          sindrom: row[columnMapping["Tanda/Sindrom"]] || "-",
          diagnosaBanding: row[columnMapping["Diagnosa Banding"]] || "-",
          idPetugas: uniqueData.get(namaPetugasPengobatan).petugasId,
          nikPetugas: uniqueData.get(namaPetugasPengobatan).nikPetugas,
          namaPetugas: uniqueData.get(namaPetugasPengobatan).namaPetugas,
        };

        console.log("Data Pengobatan:", dataPengobatan);

        pengobatan.push(dataPengobatan);
      }

      // Send bulk data to server
      setLoading(true);
      try {
        await sendPetugasImport(petugasPengobatan);
        await sendPengobatanImport(pengobatan);
      } catch (error) {
        console.error(
          "Gagal menyimpan data secara bulk:",
          error,
          error.response?.data
        );
      }

      if (errorCount === 0) {
        message.success(`Semua data berhasil disimpan.`);
        setLoading(false);
        getPengobatanData();
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

  // Download Format CSV
  const handleDownloadCSV = () => {
    const csvContent = convertHeaderToCSV();
    downloadFormatCSV(csvContent);
  };

  function convertHeaderToCSV() {
    const columnTitlesLocal = [
      "No",
      "tanggal_pengobatan",
      "tanggal_kasus",
      "ID Kasus",
      "Petugas",
      "Nama Infrasruktur",
      "Lokasi",
      "Dosis",
      "Tanda/Sindrom",
      "Diagnosa Banding",
    ];
    const exampleRow = [
      "1",
      "Contoh 1/5/2023",
      "Contoh 16/05/2023",
      "Contoh 37336427",
      "Contoh Masrifah Fitromukti",
      "Contoh UPT.Puskeswan Klakah",
      "Contoh Jawa Timur, Lumajang, Randuagung, Banyuputih Lor",
      "Contoh 15 ekor sapi @ 10.000 ml dengan INJECTAMIN",
      "Contoh Lahir Normal",
      "Contoh Bovine Ephemeral Fever",
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
  }

  const downloadFormatCSV = (csvContent) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.setAttribute("download", "format_pengobatan.csv");
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fungsi Export dari database ke file csv
  const handleExportData = () => {
    const csvContent = convertToCSV(pengobatan);
    downloadCSV(csvContent);
  };

  const convertToCSV = (data) => {
    const columnTitles = [
      "Tanggal Pengobatan",
      "Tanggal Kasus",
      "ID Kasus",
      "Petugas",
      "Nama Infrastruktur",
      "Lokasi",
      "Dosis",
      "Tanda atau Sindrom",
      "Diagnosa Banding",
    ];

    const rows = [columnTitles];
    data.forEach((item) => {
      const row = [
        item.tanggalPengobatan,
        item.tanggalKasus,
        item.idKasus,
        item.namaPetugas,
        item.namaInfrastruktur,
        item.lokasi,
        item.dosis,
        item.sindrom,
        item.diagnosaBanding,
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
    link.setAttribute("download", "Pengobatan.csv");
    document.body.appendChild(link); // Required for Firefox
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
        title: "ID Kasus",
        dataIndex: "idKasus",
        key: "idKasus",
        ...getColumnSearchProps("idKasus"),
        sorter: (a, b) => a.idKasus.localeCompare(b.idKasus),
      },
      {
        title: "Tanggal Pengobatan",
        dataIndex: "tanggalPengobatan",
        key: "tanggalPengobatan",
        ...getColumnSearchProps("tanggalPengobatan"),
        sorter: (a, b) =>
          new Date(a.tanggalPengobatan) - new Date(b.tanggalPengobatan),
      },
      {
        title: "Tanggal Kasus",
        dataIndex: "tanggalKasus",
        key: "tanggalKasus",
        ...getColumnSearchProps("tanggalKasus"),
        sorter: (a, b) => new Date(a.tanggalKasus) - new Date(b.tanggalKasus),
      },
      {
        title: "Nama Infrastruktur",
        dataIndex: "namaInfrastruktur",
        key: "namaInfrastruktur",
        ...getColumnSearchProps("namaInfrastruktur"),
        sorter: (a, b) =>
          a.namaInfrastruktur.localeCompare(b.namaInfrastruktur),
      },
      {
        title: "Lokasi",
        dataIndex: "lokasi",
        key: "lokasi",
        ...getColumnSearchProps("lokasi"),
      },
      {
        title: "Dosis",
        dataIndex: "dosis",
        key: "dosis",
        ...getColumnSearchProps("dosis"),
        sorter: (a, b) => a.dosis.localeCompare(b.dosis),
      },
      {
        title: "Dosis",
        dataIndex: "dosis",
        key: "dosis",
        ...getColumnSearchProps("dosis"),
        sorter: (a, b) => a.dosis.localeCompare(b.dosis),
      },
      {
        title: "Tanda atau Sindrom",
        dataIndex: "sindrom",
        key: "sindrom",
        ...getColumnSearchProps("sindrom"),
        sorter: (a, b) => a.sindrom.localeCompare(b.sindrom),
      },
      {
        title: "Diagnosa Banding",
        dataIndex: "diagnosaBanding",
        key: "diagnosaBanding",
        ...getColumnSearchProps("diagnosaBanding"),
        sorter: (a, b) => a.diagnosaBanding.localeCompare(b.diagnosaBanding),
      },
      {
        title: "Petugas",
        dataIndex: ["petugas", "namaPetugas"],
        key: "namaPetugas",
        ...getColumnSearchProps("namaPetugas", "petugas.namaPetugas"),
        sorter: (a, b) =>
          a.petugas.namaPetugas.localeCompare(b.petugas.namaPetugas),
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
              onClick={() => handleEditPengobatan(row)}
            />
            <Divider type="vertical" />
            <Button
              type="primary"
              danger
              shape="circle"
              title="Delete"
              icon={<DeleteOutlined />}
              onClick={() => handleDeletePengobatan(row)}
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
          dataSource={pengobatan}
          bordered
          columns={renderColumns()}
          rowKey="idPengobatan"
        />
      );
    } else if (
      user &&
      (user.role === "ROLE_ADMINISTRATOR" || user.role === "ROLE_PETUGAS")
    ) {
      return (
        <Table
          dataSource={pengobatan}
          bordered
          columns={renderColumns()}
          rowKey="idPengobatan"
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
            <Button type="primary" onClick={handleAddPengobatan} block>
              Tambah Pengobatan
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
          onChange={(e) => handleSearchTable(e.target.value)}
          style={{ width: 235, marginLeft: 10 }}
        />
      </Col>
    </Row>
  );

  return (
    <div className="app-container">
      <TypingCard
        title="Manajemen Data Pengobatan"
        source="Di sini, Anda dapat mengelola daftar pengobatan di sistem."
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

      <EditPengobatanForm
        currentRowData={currentRowData}
        wrappedComponentRef={editPengobatanFormRef}
        visible={editPengobatanModalVisible}
        confirmLoading={editPengobatanModalLoading}
        onCancel={handleCancel}
        onOk={handleEditPengobatanOk}
      />

      <AddPengobatanForm
        wrappedComponentRef={addPengobatanFormRef}
        visible={addPengobatanModalVisible}
        confirmLoading={addPengobatanModalLoading}
        onCancel={handleCancel}
        onOk={handleAddPengobatanOk}
      />
      <Modal
        title="Import File"
        open={importModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
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

export default Pengobatan;
