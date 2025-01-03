/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Button,
  Table,
  message,
  Upload,
  Row,
  Col,
  Divider,
  Modal,
  Input,
} from "antd";
import {
  getHewans,
  getHewanByPeternak,
  deleteHewan,
  editHewan,
  addHewan,
  addHewanWithoutFile,
} from "@/api/hewan";
import { getPetugas } from "@/api/petugas";
import { read, utils } from "xlsx";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import AddHewanForm from "./forms/add-hewan-form";
import EditHewanForm from "./forms/edit-hewan-form";
import TypingCard from "@/components/TypingCard";
import { reqUserInfo } from "../../api/user";
import imgUrl from "../../utils/imageURL";
import kandangSapi from "../../assets/images/kandangsapi.jpg";
import { addHewanImport } from "../../api/hewan";
import { v4 as uuidv4 } from "uuid";

const { Column } = Table;

const Hewan = () => {
  const [petugas, setPetugas] = useState([]);
  const [hewans, setHewans] = useState([]);
  const [editHewanModalVisible, setEditHewanModalVisible] = useState(false);
  const [editHewanModalLoading, setEditHewanModalLoading] = useState(false);
  const [currentRowData, setCurrentRowData] = useState({});
  const [addHewanModalVisible, setAddHewanModalVisible] = useState(false);
  const [addHewanModalLoading, setAddHewanModalLoading] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importedData, setImportedData] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [columnTitles, setColumnTitles] = useState([]);
  const [columnMapping, setColumnMapping] = useState({});
  const [fileName, setFileName] = useState("");

  const editHewanFormRef = useRef(null);
  const addHewanFormRef = useRef(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      await getPetugasData();
      try {
        const response = await reqUserInfo();
        const userData = response.data;
        setUser(userData);
        if (userData.role === "ROLE_PETERNAK") {
          await getHewanByPeternak(userData.username);
        } else {
          await getHewansData();
        }
      } catch (error) {
        console.error("Terjadi kesalahan saat mengambil data user:", error);
      }
    };

    fetchInitialData();
  }, []);

  const getHewanByPeternak = async (peternakID) => {
    try {
      const result = await getHewanByPeternak(peternakID);
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        setHewans(content);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const getHewansData = async () => {
    try {
      const result = await getHewans();
      const { content, statusCode } = result.data;

      if (statusCode === 200) {
        const filteredHewans = content.filter((hewan) => {
          const {
            namaPeternak,
            kodeEartagNasional,
            petugasPendaftar,
            provinsi,
            kecamatan,
            kabupaten,
            desa,
          } = hewan;
          const keyword = searchKeyword.toLowerCase();

          const isNamaPeternakValid = typeof namaPeternak === "string";
          const isKodeEartagNasionalValid =
            typeof kodeEartagNasional === "string";
          const isPetugasPendaftarValid = typeof petugasPendaftar === "string";
          const isProvinsiValid = typeof provinsi === "string";
          const isKecamatanValid = typeof kecamatan === "string";
          const isKabupatenValid = typeof kabupaten === "string";
          const isDesaValid = typeof desa === "string";

          return (
            (isNamaPeternakValid &&
              namaPeternak.toLowerCase().includes(keyword)) ||
            (isKodeEartagNasionalValid &&
              kodeEartagNasional.toLowerCase().includes(keyword)) ||
            (isPetugasPendaftarValid &&
              petugasPendaftar.toLowerCase().includes(keyword)) ||
            (isProvinsiValid && provinsi.toLowerCase().includes(keyword)) ||
            (isKecamatanValid && kecamatan.toLowerCase().includes(keyword)) ||
            (isKabupatenValid && kabupaten.toLowerCase().includes(keyword)) ||
            (isDesaValid && desa.toLowerCase().includes(keyword))
          );
        });

        setHewans(filteredHewans);
      }
    } catch (error) {
      console.error("Failed to fetch hewans:", error);
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
    getHewansData();
  };

  // Handle Import Modal
  const handleImportModalOpen = () => {
    setImportModalVisible(true);
  };

  const handleImportModalClose = () => {
    setImportModalVisible(false);
  };

  // Handle Edit Hewan
  const handleEditHewan = (row) => {
    setCurrentRowData({ ...row });
    setEditHewanModalVisible(true);
  };

  const handleEditHewanOk = () => {
    const form = editHewanFormRef.current?.props?.form;
    if (form) {
      form.validateFields(async (err, values) => {
        if (err) {
          return;
        }
        setEditHewanModalLoading(true);
        try {
          await editHewan(values, values.kodeEartagNasional);
          form.resetFields();
          setEditHewanModalVisible(false);
          setEditHewanModalLoading(false);
          message.success("Berhasil diedit!");
          getHewansData();
        } catch (e) {
          setEditHewanModalLoading(false);
          message.error("Pengeditan gagal, harap coba lagi!");
        }
      });
    }
  };

  const handleDeleteHewan = (row) => {
    const { idHewan } = row;

    Modal.confirm({
      title: "Konfirmasi",
      content: "Apakah Anda yakin ingin menghapus data ini?",
      okText: "Ya",
      okType: "danger",
      cancelText: "Tidak",
      onOk: async () => {
        try {
          await deleteHewan({ idHewan });
          message.success("Berhasil dihapus");
          getHewansData();
        } catch (error) {
          message.error("Gagal menghapus data, harap coba lagi!");
        }
      },
    });
  };

  const handleCancel = () => {
    setEditHewanModalVisible(false);
    setAddHewanModalVisible(false);
  };

  // Handle Add Hewan
  const handleAddHewan = () => {
    setAddHewanModalVisible(true);
  };

  const handleAddHewanOk = async (values, form) => {
    setAddHewanModalLoading(true);
    const hewanData = {
      kodeEartagNasional: values.kodeEartagNasional,
      idIsikhnasTernak: values.idIsikhnasTernak,
      petugas_id: values.petugas_id,
      peternak_id: values.peternak_id,
      kandang_id: values.kandang_id,
      jenisHewanId: values.jenisHewanId,
      rumpunHewanId: values.rumpunHewanId,
      sex: values.sex,
      identifikasiHewan: values.identifikasiHewan,
      tanggalLahir: values.tanggalLahir,
      tempatLahir: values.tempatLahir,
      tujuanPemeliharaan: values.tujuanPemeliharaan,
      file: values.file,
    };
    try {
      await addHewan(hewanData);
      form.resetFields();
      setAddHewanModalVisible(false);
      setAddHewanModalLoading(false);
      message.success("Berhasil menambahkan!");
      getHewansData();
    } catch (e) {
      setAddHewanModalLoading(false);
      message.error("Gagal menambahkan, harap coba lagi!");
    }
  };

  const convertToJSDate = (input) => {
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
  };

  const fetchCoordinates = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          address
        )}&format=json`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return { lat: data[0].lat, lon: data[0].lon };
      } else {
        console.error(
          "No coordinates found for the provided address:",
          address
        );
        return { lat: null, lon: null };
      }
    } catch (error) {
      console.error("Error converting address to coordinates:", error);
      return { lat: null, lon: null };
    }
  };

  // Handle File Import
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

  const saveImportedData = async (mapping) => {
    let errorCount = 0;
    const dataToSaveArray = []; // Array untuk menampung semua data yang akan disimpan

    try {
      console.log("Imported Data:", importedData); // Memastikan importedData berisi data yang benar
      for (const row of importedData) {
        const generateIdHewan = uuidv4();
        const address = `${row[mapping["Desa"]]}, ${
          row[mapping["Kecamatan"]]
        }, ${row[mapping["Kabupaten"]]}, ${row[mapping["Provinsi"]]}`;
        // const { lat, lon } = await fetchCoordinates(address);

        const validAddress = address || "-";

        // Cek apakah ada NIK Peternak, jika tidak ada gunakan ID Peternak
        const peternakId = row[mapping["ID Peternak"]] || "-";
        const nikPeternak = row[mapping["NIK Peternak"]] || peternakId; // Gunakan peternak_id jika NIK kosong

        // Gabungkan Rumpun Ternak dengan Spesies, jika ada
        const spesies =
          row[mapping["Jenis Ternak"]] || row[mapping["Spesies"]] || "-";
        const jenis = spesies || "-"; // Jika tidak ada spesies, gunakan "-"

        // Jika NIK ada, maka gunakan NIK untuk kolom nikPeternak dan peternak_id
        // Jika NIK tidak ada, gunakan ID Peternak untuk keduanya
        const dataToSave = {
          idPetugas: row[mapping["ID Petugas"]] || "-",
          idKandang: row[mapping["ID Kandang"]] || "-",
          idHewan: generateIdHewan,
          kodeEartagNasional: row[mapping["Kode Eartag Nasional"]] || "-",
          noKartuTernak: row[mapping["No Kartu Ternak"]] || "-",
          peternak_id: peternakId, // Gunakan ID Peternak untuk peternak_id
          nikPeternak: nikPeternak,
          namaPeternak: row[mapping["Nama Peternak"]] || "-",
          kandang_id: row[mapping["ID Kandang"]] || "-",
          spesies: spesies, // Menggunakan spesies yang sudah digabungkan
          jenis: jenis, // Masukkan spesies ke dalam kolom jenis
          sex: row[mapping["Jenis Kelamin**"]] || row[mapping["sex"]] || "-",
          umur:
            row[mapping["Tanggal Lahir Ternak**"]] ||
            row[mapping["umur"]] ||
            "-",
          // latitude: lat || row[mapping["Latitude"]] || "-",
          // longitude: lon || row[mapping["Longitude"]] || "-",
          desa: row[mapping["Desa"]] || "-",
          kecamatan: row[mapping["Kecamatan"]] || "-",
          kabupaten: row[mapping["Kabupaten"]] || "-",
          provinsi: row[mapping["Provinsi"]] || "-",
          alamat: validAddress || "-",
          identifikasiHewan:
            row[mapping["Identifikasi Hewan*"]] ||
            row[mapping["Identifikasi Hewan"]] ||
            "-",
          tanggalTerdaftar:
            convertToJSDate(row[mapping["Tanggal Terdaftar"]]) || "-",
          file: kandangSapi || "-",
        };

        dataToSaveArray.push(dataToSave); // Menambahkan objek data ke dalam array
      }

      // Setelah selesai mengumpulkan semua data, lakukan proses simpan dalam batch
      if (dataToSaveArray.length > 0) {
        try {
          // Menyimpan data secara batch, misalnya dengan API
          console.log("Data yang akan disimpan dalam batch:", dataToSaveArray);
          await addHewanImport(dataToSaveArray);
        } catch (error) {
          errorCount += dataToSaveArray.length;
          console.error("Gagal menyimpan data batch:", error);
        }
      }

      if (errorCount === 0) {
        message.success(`Semua data berhasil disimpan.`);
      } else {
        message.error(`${errorCount} data gagal disimpan, harap coba lagi!`);
      }
    } catch (error) {
      console.error("Gagal memproses data:", error);
    } finally {
      setImportedData([]); // Reset state setelah pemrosesan selesai
      setColumnTitles([]);
      setColumnMapping({});
    }
  };

  // Handle Export Data
  const handleExportData = () => {
    const csvContent = convertToCSV(hewans);
    downloadCSV(csvContent);
  };

  const convertToCSV = (data) => {
    const columnTitles = [
      "Kode Eartag Nasional",
      "Nama Peternak",
      "NIK Peternak",
      "Id Kandang",
      "Alamat",
      "Spesies",
      "Jenis Kelamin",
      "Umur",
      "Identifikasi Hewan",
      "Petugas Pendaftar",
      "Tanggal Terdaftar",
    ];

    const rows = [columnTitles];
    data.forEach((item) => {
      const row = [
        item.kodeEartagNasional,
        item.peternak.namaPeternak,
        item.peternak.nikPeternak,
        item.kandang.idKandang,
        item.alamat,
        item.spesies,
        item.sex,
        item.umur,
        item.identifikasiHewan,
        item.petugas.namaPetugas,
        item.tanggalTerdaftar,
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
    link.setAttribute("download", "Hewan.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link); // Clean up
  };

  // Render Columns with Operations
  const renderColumns = () => {
    const baseColumns = [
      {
        title: "Kode Eartag Nasional",
        dataIndex: "kodeEartagNasional",
        key: "kodeEartagNasional",
      },
      { title: "Alamat", dataIndex: "alamat", key: "alamat" },
      {
        title: "Nama Peternak",
        dataIndex: ["peternak", "namaPeternak"],
        key: "namaPeternak",
      },
      {
        title: "NIK Peternak",
        dataIndex: ["peternak", "nikPeternak"],
        key: "nikPeternak",
      },
      {
        title: "Id Kandang",
        dataIndex: ["kandang", "idKandang"],
        key: "idKandang",
      },
      { title: "Spesies", dataIndex: "spesies", key: "spesies" },
      { title: "Jenis Kelamin", dataIndex: "sex", key: "sex" },
      { title: "Umur", dataIndex: "umur", key: "umur" },
      {
        title: "Identifikasi Hewan",
        dataIndex: "identifikasiHewan",
        key: "identifikasiHewan",
      },
      {
        title: "Petugas Pendaftar",
        dataIndex: ["petugas", "namaPetugas"],
        key: "petugasPendaftar",
      },
      {
        title: "Tanggal Terdaftar",
        dataIndex: "tanggalTerdaftar",
        key: "tanggalTerdaftar",
      },
      {
        title: "Foto Hewan",
        dataIndex: "file_path",
        key: "file_path",
        render: (text, row) => (
          <img
            src={`${imgUrl}/hewan/${row.file_path}`}
            width={200}
            height={150}
            alt="Hewan"
          />
        ),
      },
    ];

    if (
      user &&
      (user.role === "ROLE_ADMINISTRATOR" || user.role === "ROLE_PETUGAS")
    ) {
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
              icon="edit"
              title="Edit"
              onClick={() => handleEditHewan(row)}
            />
            <Divider type="vertical" />
            <Button
              type="primary"
              danger
              shape="circle"
              icon="delete"
              title="Delete"
              onClick={() => handleDeleteHewan(row)}
            />
          </span>
        ),
      });
    }

    return baseColumns;
  };

  // Render Table based on User Role
  const renderTable = () => {
    if (user && user.role === "ROLE_PETERNAK") {
      return (
        <Table
          dataSource={hewans}
          bordered
          columns={renderColumns()}
          rowKey="kodeEartagNasional"
        />
      );
    } else if (
      user &&
      (user.role === "ROLE_ADMINISTRATOR" || user.role === "ROLE_PETUGAS")
    ) {
      return (
        <Table
          dataSource={hewans}
          bordered
          columns={renderColumns()}
          rowKey="kodeEartagNasional"
        />
      );
    } else {
      return null;
    }
  };

  // Render Buttons based on User Role
  const renderButtons = () => {
    if (
      user &&
      (user.role === "ROLE_ADMINISTRATOR" || user.role === "ROLE_PETUGAS")
    ) {
      return (
        <Row gutter={[16, 16]} justify="start" style={{ paddingLeft: 9 }}>
          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <Button type="primary" onClick={handleAddHewan} block>
              Tambah Hewan
            </Button>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <Button
              icon={<UploadOutlined />}
              onClick={handleImportModalOpen}
              block
            >
              Import File
            </Button>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <Button icon={<UploadOutlined />} onClick={handleExportData} block>
              Export File
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
        <Input
          placeholder="Cari data"
          value={searchKeyword}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: "100%" }}
        />
      </Col>
    </Row>
  );

  const cardContent = `Di sini, Anda dapat mengelola daftar hewan di sistem.`;

  return (
    <div className="app-container">
      {/* TypingCard component */}
      <TypingCard title="Manajemen Hewan" source={cardContent} />
      <br />
      <Card title={title} style={{ overflowX: "scroll" }}>
        {renderTable()}
      </Card>

      <EditHewanForm
        currentRowData={currentRowData}
        wrappedComponentRef={editHewanFormRef}
        visible={editHewanModalVisible}
        confirmLoading={editHewanModalLoading}
        onCancel={handleCancel}
        onOk={handleEditHewanOk}
      />
      <AddHewanForm
        wrappedComponentRef={addHewanFormRef}
        visible={addHewanModalVisible}
        confirmLoading={addHewanModalLoading}
        onCancel={handleCancel}
        onOk={handleAddHewanOk}
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

export default Hewan;
