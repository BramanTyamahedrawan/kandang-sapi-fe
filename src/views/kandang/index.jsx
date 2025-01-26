/* eslint-disable no-constant-condition */
/* eslint-disable no-unused-vars */
import { addKandang, deleteKandang, editKandang, getKandang, addKandangImport } from "@/api/kandang";
import TypingCard from "@/components/TypingCard";
import { Button, Card, Col, Divider, Input, message, Modal, Row, Table, Upload } from "antd";
import React, { useEffect, useRef, useState } from "react";
import AddKandangForm from "./forms/add-kandang-form";
import EditKandangForm from "./forms/edit-kandang-form";
// import ViewKandangForm from "./forms/view-kandang-form";
import { DeleteOutlined, DownloadOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";
import { read, utils } from "xlsx";
import { reqUserInfo } from "../../api/user";
import { v4 as uuidv4 } from "uuid";
import imgUrl from "../../utils/imageURL";

import kandangSapi from "../../assets/images/kandangsapi.jpg";

const Kandang = () => {
  const [kandangs, setKandangs] = useState([]);
  const [editKandangModalVisible, setEditKandangModalVisible] = useState(false);
  const [editKandangModalLoading, setEditKandangModalLoading] = useState(false);
  // const [viewKandangModalVisible, setViewKandangModalVisible] = useState(false)
  const [currentRowData, setCurrentRowData] = useState({});
  const [addKandangModalVisible, setAddKandangModalVisible] = useState(false);
  const [addKandangModalLoading, setAddKandangModalLoading] = useState(false);
  const [importedData, setImportedData] = useState([]);
  const [columnTitles, setColumnTitles] = useState([]);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [columnMapping, setColumnMapping] = useState({});
  const [searchKeyword, setSearchKeyword] = useState("");
  const [user, setUser] = useState(null);

  const editKandangFormRef = useRef(null);
  const addKandangFormRef = useRef(null);

  useEffect(() => {
    reqUserInfo()
      .then((response) => {
        const userData = response.data;
        setUser(userData);
        if (userData.role === "ROLE_PETERNAK") {
          getKandangByPeternak(userData.username);
        } else {
          getKandangData();
        }
      })
      .catch((error) => {
        console.error("Terjadi kesalahan saat mengambil data user:", error);
        message.error("Gagal mengambil data user.");
      });
  }, []);

  const getKandangByPeternak = async (peternakID) => {
    try {
      const result = await getKandangByPeternak(peternakID);
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        setKandangs(content);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      message.error("Gagal mengambil data kandang.");
    }
  };

  const getKandangData = async () => {
    try {
      const result = await getKandang();
      console.log(result);
      const { content, statusCode } = result.data;

      if (statusCode === 200) {
        const filteredKandang = content.filter((kandang) => {
          const { idKandang, idPeternak, namaPeternak, luas, kapasitas, nilaiBangunan, alamat, provinsi, kabupaten, kecamatan, desa } = kandang;
          const keyword = searchKeyword.toLowerCase();

          const isIdKandangValid = typeof idKandang === "string";
          const isIdPeternakValid = typeof idPeternak === "string";
          const isNamaPeternakValid = typeof namaPeternak === "string";
          const isLuasValid = typeof luas === "string";
          const isKapasitasValid = typeof kapasitas === "string";
          const isNilaiBangunanValid = typeof nilaiBangunan === "string";
          const isAlamatValid = typeof alamat === "string";
          const isProvinsiValid = typeof provinsi === "string";
          const isKabupatenValid = typeof kabupaten === "string";
          const isKecamatanValid = typeof kecamatan === "string";
          const isDesaValid = typeof desa === "string";

          return (
            (isIdKandangValid && idKandang.toLowerCase().includes(keyword)) ||
            (isIdPeternakValid && idPeternak.toLowerCase().includes(keyword)) ||
            (isNamaPeternakValid && namaPeternak.toLowerCase().includes(keyword)) ||
            (isLuasValid && luas.toLowerCase().includes(keyword)) ||
            (isKapasitasValid && kapasitas.toLowerCase().includes(keyword)) ||
            (isNilaiBangunanValid && nilaiBangunan.toLowerCase().includes(keyword)) ||
            (isAlamatValid && alamat.toLowerCase().includes(keyword)) ||
            (isProvinsiValid && provinsi.toLowerCase().includes(keyword)) ||
            (isKabupatenValid && kabupaten.toLowerCase().includes(keyword)) ||
            (isKecamatanValid && kecamatan.toLowerCase().includes(keyword)) ||
            (isDesaValid && desa.toLowerCase().includes(keyword))
          );
        });

        setKandangs(filteredKandang);
      }
    } catch (error) {
      console.error("Gagal mengambil data kandang:", error);
      message.error("Gagal mengambil data kandang.");
    }
  };

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
    // Debounce atau delay jika diperlukan
    getKandangData();
  };

  const handleEditKandang = (row) => {
    setCurrentRowData({ ...row });
    setEditKandangModalVisible(true);
  };

  const handleDeleteKandang = (row) => {
    const { idKandang } = row;
    Modal.confirm({
      title: "Konfirmasi",
      content: "Apakah Anda yakin ingin menghapus data ini?",
      okText: "Ya",
      okType: "danger",
      cancelText: "Tidak",
      onOk: () => {
        deleteKandang(idKandang)
          .then(() => {
            message.success("Berhasil dihapus");
            getKandangData();
          })
          .catch((error) => {
            console.error("Gagal menghapus kandang:", error);
            message.error("Gagal menghapus kandang.");
          });
      },
    });
  };

  const handleEditKandangOk = async (values) => {
    setEditKandangModalLoading(true);
    try {
      await editKandang(values, currentRowData.idKandang);
      setEditKandangModalVisible(false);
      setEditKandangModalLoading(false);
      message.success("Berhasil diedit!");
      getKandangData();
    } catch (error) {
      console.error("Error editing peternak:", error);
      message.error("Pengeditan gagal, harap coba lagi!");
      setEditKandangModalLoading(false);
    }
  };

  // const handleViewKandang = (row) => {
  //   setCurrentRowData({ ...row })
  //   setViewKandangModalVisible(true)
  // }

  // Fungsi Import File CSV
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
      const jsonData = utils.sheet_to_json(worksheet, { header: 1, blankrows: false, defval: null });

      const importedDataLocal = jsonData.slice(1); // Exclude the first row (column titles)
      const columnTitlesLocal = jsonData[0]; // Assume the first row contains column titles

      const fileNameLocal = file.name.toLowerCase();

      setImportedData(importedDataLocal);
      setColumnTitles(columnTitlesLocal);
      setFileName(fileNameLocal);

      // Create column mapping
      const columnMappingLocal = {};
      columnTitlesLocal.forEach((title, index) => {
        columnMappingLocal[title] = index;
      });
      setColumnMapping(columnMappingLocal);
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
      })
      .catch((error) => {
        console.error("Gagal mengunggah data:", error);
        setUploading(false);
        message.error("Gagal mengunggah data, harap coba lagi.");
      });
  };

  const fetchCoordinates = async (address) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`);
      const data = await response.json();
      if (data && data.length > 0) {
        return { lat: data[0].lat, lon: data[0].lon };
      } else {
        console.error("No coordinates found for the provided address:", address);
        return { lat: null, lon: null };
      }
    } catch (error) {
      console.error("Error converting address to coordinates:", error);
      return { lat: null, lon: null };
    }
  };

  const saveImportedData = async () => {
    const dataToSaveArrray = [];
    try {
      for (const row of importedData) {
        const generateIdKandang = uuidv4();
        const address = `${row[columnMapping["Desa"]]}, ${row[columnMapping["Kecamatan"]]}, ${row[columnMapping["Kabupaten"]]}, ${row[columnMapping["Provinsi"]]}`;
        const { lat, lon } = await fetchCoordinates(address);

        const dataToSave = {
          idKandang: generateIdKandang,
          namaPeternak: row[columnMapping["Nama Pemilik Ternak"]],
          namaKandang: row[columnMapping["Nama Kandang"]],
          jenis: row[columnMapping["Jenis Hewan"]],
          luas: row[columnMapping["Luas Kandang"]],
          kapasitas: row[columnMapping["Kapasitas Kandang"]],
          nilaiBangunan: row[columnMapping["Nilai Bangunan"]],
          jenisKandang: row[columnMapping["Jenis Kandang"]],
          alamat: row[columnMapping["Alamat"]],
          latitude: lat || row[columnMapping["latitude"]],
          longitude: lon || row[columnMapping["longitude"]],
          file: kandangSapi,
        };
        dataToSaveArrray.push(dataToSave);
      }

      try {
        if (dataToSaveArrray.length > 0) {
          // Add new data
          console.log("Data batch ", dataToSaveArrray);

          await addKandangImport(dataToSaveArrray);
        }
      } catch (error) {
        console.error("Gagal menyimpan data:", error);
      }
    } catch (error) {
      console.error("Gagal memproses data:", error);
      message.error("Gagal memproses data, harap coba lagi.");
    } finally {
      setImportedData([]);
      setColumnTitles([]);
      setColumnMapping({});
    }
  };

  // Download Format CSV
  const handleDownloadCSV = () => {
    const csvContent = createCSVTemplate();
    downloadFormatCSV(csvContent);
  };

  const createCSVTemplate = () => {
    // Header kolom
    const columnTitlesLocal = ["No", "Nama Pemilik Ternak", "Nama Kandang", "Jenis Hewan", "Nilai Bangunan", "Luas Kandang", "Kapasitas Kandang", "Jenis Kandang", "Alamat", "latitude", "longitude"];

    // Baris data dummy (contoh)
    const exampleRow = [
      "1",
      "Contoh Pemilik",
      "Contoh Kandang Sapi Supardi",
      "Contoh Sapi",
      "Contoh 1000000",
      "Contoh 50",
      "Contoh 100",
      "Contoh permanen",
      "Contoh Kalipepe,Yosowilangun,Lumajang,Jawa Timur",
      "Contoh -6.1234",
      "Contoh 106.1234",
    ];

    // Gabungkan header dan contoh data
    const rows = [columnTitlesLocal, exampleRow];

    // Escape karakter khusus (koma) dengan tanda kutip ganda
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
    link.setAttribute("download", "format_kandang.csv");
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fungsi Export dari database ke file CSV
  const handleExportData = () => {
    const csvContent = convertToCSV(kandangs);
    downloadCSV(csvContent);
  };

  const convertToCSV = (data) => {
    const columnTitlesLocal = ["Id Kandang", "Luas", "Kapasitas", "Nilai Bangunan", "Alamat"];

    const rows = [columnTitlesLocal];
    data.forEach((item) => {
      const row = [item.idKandang, item.luas, item.kapasitas, item.nilaiBangunan, item.alamat];
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
    link.setAttribute("download", "Kandang.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);
  };

  const handleCancel = () => {
    setEditKandangModalVisible(false);
    setAddKandangModalVisible(false);
    // setViewKandangModalVisible(false)
  };

  const handleAddKandang = () => {
    setAddKandangModalVisible(true);
  };

  const handleAddKandangOk = async (values) => {
    setAddKandangModalLoading(true);
    const kandangData = {
      idPeternak: values.idPeternak,
      idJenisHewan: values.idJenisHewan,
      luas: values.luas + " m2",
      kapasitas: values.kapasitas + " ekor",
      nilaiBangunan: "Rp. " + values.nilaiBangunan,
      alamat: values.alamat,
      latitude: values.latitude,
      longitude: values.longitude,
      namaKandang: values.namaKandang,
      jenisKandang: values.jenisKandang,
      file: values.file,
    };

    try {
      await addKandang(kandangData);
      setAddKandangModalVisible(false);
      setAddKandangModalLoading(false);
      message.success("Berhasil menambahkan!");
      getKandangData();
      console.log("berhasil menambahkan!");
    } catch (e) {
      setAddKandangModalVisible(false);
      setAddKandangModalLoading(false);
      message.error("Gagal menambahkan, harap coba lagi!");
      console.log("error", e);
    }
  };

  const renderColumns = () => {
    const baseColumns = [
      { title: "Id Kandang", dataIndex: "idKandang", key: "idKandang" },
      { title: "Nama Pemilik Kandang", dataIndex: ["peternak", "namaPeternak"], key: "namaPeternak" },
      { title: "Nama Kandang", dataIndex: "namaKandang", key: "namaKandang" },
      { title: "Jenis Kandang", dataIndex: "jenisKandang", key: "jenisKandang" },
      { title: "Jenis Hewan", dataIndex: ["jenisHewan", "jenis"], key: "jenis" },
      { title: "Luas", dataIndex: "luas", key: "luas" },
      { title: "Kapasitas", dataIndex: "kapasitas", key: "kapasitas" },
      {
        title: "Nilai Bangunan",
        dataIndex: "nilaiBangunan",
        key: "nilaiBangunan",
      },
      { title: "Alamat", dataIndex: "alamat", key: "alamat" },
      { title: "Latitude", dataIndex: "latitude", key: "latitude" },
      { title: "Longitude", dataIndex: "longitude", key: "longitude" },
      {
        title: "Foto Kandang",
        dataIndex: "file_path",
        key: "file_path",
        render: (text, row) => <img src={`${imgUrl + "/kandang/" + row.file_path}`} alt="Foto Kandang" width={200} height={150} />,
      },
    ];

    if (user && (user.role === "ROLE_ADMINISTRATOR" || user.role === "ROLE_PETUGAS")) {
      baseColumns.push({
        title: "Operasi",
        key: "action",
        width: 170,
        align: "center",
        render: (text, row) => (
          <span>
            <Button type="primary" shape="circle" icon={<EditOutlined />} title="Edit" onClick={() => handleEditKandang(row)} />
            <Divider type="vertical" />
            <Button danger type="primary" shape="circle" icon={<DeleteOutlined />} title="Delete" onClick={() => handleDeleteKandang(row)} />
            {/* Tambahkan tombol view jika diperlukan */}
            {/* <Divider type="vertical" />
            <Button
              type="primary"
              shape="circle"
              icon={<EyeOutlined />}
              title="View"
              onClick={() => handleViewKandang(row)}
            /> */}
          </span>
        ),
      });
    }

    return baseColumns;
  };

  const renderTable = () => {
    if (user && user.role === "ROLE_PETERNAK") {
      return <Table dataSource={kandangs} bordered columns={renderColumns()} rowKey="idKandang" />;
    } else if (user && (user.role === "ROLE_ADMINISTRATOR" || user.role === "ROLE_PETUGAS")) {
      return <Table dataSource={kandangs} bordered columns={renderColumns()} rowKey="idKandang" />;
    } else {
      return null;
    }
  };

  const renderButtons = () => {
    if (user && (user.role === "ROLE_ADMINISTRATOR" || user.role === "ROLE_PETUGAS")) {
      return (
        <Row gutter={[16, 16]} justify="start" style={{ paddingLeft: 9 }}>
          <Col>
            <Button type="primary" onClick={handleAddKandang} block>
              Tambah Kandang
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
    <Row gutter={[16, 16]} justify="space-between">
      {renderButtons()}
      <Col xs={24} sm={12} md={8} lg={8} xl={8}>
        <Input placeholder="Cari data" value={searchKeyword} onChange={(e) => handleSearch(e.target.value)} style={{ width: "100%" }} />
      </Col>
    </Row>
  );

  const cardContent = `Di sini, Anda dapat mengelola daftar kandang di sistem.`;

  return (
    <div className="app-container">
      <TypingCard title="Manajemen Data Kandang" source={cardContent} />
      <br />
      <Card>{title}</Card>
      <Card style={{ overflowX: "scroll" }}>{renderTable()}</Card>
      <EditKandangForm currentRowData={currentRowData} wrappedComponentRef={editKandangFormRef} visible={editKandangModalVisible} confirmLoading={editKandangModalLoading} onCancel={handleCancel} onOk={handleEditKandangOk} />

      <AddKandangForm wrappedComponentRef={addKandangFormRef} visible={addKandangModalVisible} confirmLoading={addKandangModalLoading} onCancel={handleCancel} onOk={handleAddKandangOk} />

      {/* <ViewKandangForm
        currentRowData={currentRowData}
        visible={viewKandangModalVisible}
        onCancel={() => setViewKandangModalVisible(false)}
      /> */}

      <Modal
        title="Import File"
        visible={importModalVisible}
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
        <Upload beforeUpload={handleFileImport}>
          <Button icon={<UploadOutlined />}>Pilih File</Button>
        </Upload>
      </Modal>
    </div>
  );
};

export default Kandang;
