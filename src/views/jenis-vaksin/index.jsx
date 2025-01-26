/* eslint-disable no-constant-condition */
/* eslint-disable no-unused-vars */
import { addJenisVaksin, deleteJenisVaksin, editJenisVaksin, getJenisVaksin, addJenisVaksinBulk } from "@/api/jenis-vaksin";
import TypingCard from "@/components/TypingCard";
import { DeleteOutlined, DownloadOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Card, Col, Divider, Input, message, Modal, Row, Table, Upload } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { read, utils } from "xlsx";
import { reqUserInfo } from "../../api/user";
import AddJenisVaksinForm from "./forms/add-jenisvaksin-form";
import EditJenisVaksinForm from "./forms/edit-jenisvaksin-form";
import { v4 as uuidv4 } from "uuid";

const JenisVaksin = () => {
  // State Variables
  const [jenisVaksins, setJenisVaksins] = useState([]);
  const [editJenisVaksinModalVisible, setEditJenisVaksinModalVisible] = useState(false);
  const [editJenisVaksinModalLoading, setEditJenisVaksinModalLoading] = useState(false);
  const [currentRowData, setCurrentRowData] = useState({});
  const [addJenisVaksinModalVisible, setAddJenisVaksinModalVisible] = useState(false);
  const [addJenisVaksinModalLoading, setAddJenisVaksinModalLoading] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importedData, setImportedData] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [columnTitles, setColumnTitles] = useState([]);
  const [fileName, setFileName] = useState("");
  const [columnMapping, setColumnMapping] = useState({});

  // Form References
  const editJenisVaksinFormRef = useRef(null);
  const addJenisVaksinFormRef = useRef(null);

  // Fetch Initial Data on Component Mount
  useEffect(() => {
    getJenisVaksinData();
    reqUserInfo()
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Terjadi kesalahan saat mengambil data user:", error);
      });
  }, []);

  // Fetch All Jenis Vaksin with Optional Filtering
  const getJenisVaksinData = async () => {
    try {
      const result = await getJenisVaksin();
      const { content, statusCode } = result.data;

      if (statusCode === 200) {
        const filteredJenisVaksin = content.filter((jv) => {
          const { idJenisVaksin, jenis, deskripsi } = jv;
          const keyword = searchKeyword.toLowerCase();

          const isIdJenisVaksinValid = typeof idJenisVaksin === "string";
          const isJenisValid = typeof jenis === "string";
          const isDeskripsiValid = typeof deskripsi === "string";

          return (isIdJenisVaksinValid && idJenisVaksin.toLowerCase().includes(keyword)) || (isJenisValid && jenis.toLowerCase().includes(keyword)) || (isDeskripsiValid && deskripsi.toLowerCase().includes(keyword));
        });

        setJenisVaksins(filteredJenisVaksin);
      }
    } catch (error) {
      console.error("Failed to fetch jenis vaksin:", error);
      message.error("Gagal mengambil data jenis vaksin, harap coba lagi!");
    }
  };

  // // Fetch Jenis Hewan by Peternak ID (for ROLE_PETERNAK)
  // const getHewanByPeternak = async (peternakID) => {
  //   try {
  //     const result = await getJenisHewan() // Assuming similar API structure
  //     const { content, statusCode } = result.data
  //     if (statusCode === 200) {
  //       const filteredHewans = content.filter(
  //         (hewan) => hewan.peternak_id === peternakID
  //       )
  //       setJenisHewans(filteredHewans)
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch jenis hewan by peternak:', error)
  //     message.error('Gagal mengambil data jenis hewan, harap coba lagi!')
  //   }
  // }

  // // Fetch All Petugas
  // const getPetugasData = async () => {
  //   try {
  //     const result = await getPetugas()
  //     const { content, statusCode } = result.data

  //     if (statusCode === 200) {
  //       setPetugas(content)
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch petugas:', error)
  //     message.error('Gagal mengambil data petugas, harap coba lagi!')
  //   }
  // }

  // Handle Search Input Change
  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
    getJenisVaksinData();
  };

  // Handle Opening the Import Modal
  const handleImportModalOpen = () => {
    setImportModalVisible(true);
  };

  // Handle Closing the Import Modal
  const handleImportModalClose = () => {
    setImportModalVisible(false);
  };

  // Handle Adding a Jenis Hewan
  const handleAddJenisVaksin = () => {
    setAddJenisVaksinModalVisible(true);
  };

  // Handle Confirming the Add Jenis Hewan Modal
  const handleAddJenisVaksinOk = async (values, form) => {
    setAddJenisVaksinModalLoading(true);
    const jenisData = {
      jenis: values.jenis,
      deskripsi: values.deskripsi,
    };
    try {
      await addJenisVaksin(jenisData);
      console.log("Jenis Vaksin Data:", jenisData);
      form.resetFields();
      setAddJenisVaksinModalVisible(false);
      setAddJenisVaksinModalLoading(false);
      message.success("Berhasil menambahkan!");
      getJenisVaksinData();
    } catch (e) {
      setAddJenisVaksinModalLoading(false);
      console.error("Failed to add jenis vaksin:", e);
      message.error("Gagal menambahkan, harap coba lagi!");
    }
  };

  // Handle Editing a Jenis Vaksin
  const handleEditJenisVaksin = (row) => {
    setCurrentRowData({ ...row });
    setEditJenisVaksinModalVisible(true);
  };

  // Handle Confirming the Edit Jenis Vaksin Modal
  const handleEditJenisVaksinOk = async (values) => {
    setEditJenisVaksinModalLoading(true);
    try {
      await editJenisVaksin(values, currentRowData.idJenisVaksin);
      setEditJenisVaksinModalVisible(false);
      setEditJenisVaksinModalLoading(false);
      message.success("Berhasil diedit!");
      getJenisVaksinData();
    } catch (e) {
      setEditJenisVaksinModalLoading(false);
      console.error("Failed to edit jenis vaksin:", e);
      message.error("Pengeditan gagal, harap coba lagi!");
    }
  };

  // Handle Deleting a Jenis Vaksin
  const handleDeleteJenisVaksin = (row) => {
    const { idJenisVaksin } = row;

    Modal.confirm({
      title: "Konfirmasi",
      content: "Apakah Anda yakin ingin menghapus data ini?",
      okText: "Ya",
      okType: "danger",
      cancelText: "Tidak",
      onOk: async () => {
        try {
          await deleteJenisVaksin({ idJenisVaksin });
          message.success("Berhasil dihapus");
          getJenisVaksinData();
        } catch (error) {
          console.error("Failed to delete jenis vaksin:", error);
          message.error("Gagal menghapus data, harap coba lagi!");
        }
      },
    });
  };

  // Handle Canceling Any Modal
  const handleCancel = () => {
    setEditJenisVaksinModalVisible(false);
    setAddJenisVaksinModalVisible(false);
    setImportModalVisible(false);
  };

  // Convert Excel Date Format to JavaScript Date
  const convertToJSDate = (input) => {
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
  };

  // Handle File Import
  const handleFileImport = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = read(data, { type: "array" });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet, { header: 1, blankrows: false });

      const importedData = jsonData.slice(1); // Exclude the first row (column titles)
      const columnTitles = jsonData[0]; // Assume the first row contains column titles

      // Create column mapping
      const mapping = {};
      columnTitles.forEach((title, index) => {
        mapping[title] = index;
      });

      // Iterate through importedData and process the address (if applicable)
      // Note: For Jenis Hewan, address processing may not be necessary.
      // If not needed, this part can be adjusted or removed.
      const modifiedData = importedData.map((row) => {
        // Example processing; adjust based on actual CSV structure
        return {
          ...row,
          // Add any additional processing if needed
        };
      });

      setImportedData(modifiedData);
      setColumnTitles(columnTitles);
      setFileName(file.name.toLowerCase());
      setColumnMapping(mapping);
    };

    reader.readAsArrayBuffer(file);
  };

  // Handle Uploading the Imported Data
  const handleUpload = async () => {
    if (importedData.length === 0) {
      message.error("No data to import.");
      return;
    }

    setUploading(true);

    try {
      await saveImportedData(columnMapping);
      setUploading(false);
      setImportModalVisible(false);
      message.success("Data berhasil diimport!");
    } catch (error) {
      console.error("Gagal mengunggah data:", error);
      setUploading(false);
      message.error("Gagal mengunggah data, harap coba lagi.");
    }
  };

  // Save Imported Data to the Database
  const saveImportedData = async (mapping) => {
    let errorCount = 0;
    const dataToSaveArray = [];
    try {
      for (const row of importedData) {
        const generateId = uuidv4();

        const dataToSave = {
          idJenisVaksin: generateId,
          jenis: row[mapping["Jenis Vaksin"]],
          deskripsi: row[mapping["Deskripsi"]],
        };

        // const existingJenisVaksinIndex = jenisVaksins.findIndex((p) => p.idJenisVaksin === dataToSave.idJenisVaksin);
        dataToSaveArray.push(dataToSave);
      }
      try {
        if (dataToSaveArray.length > 0) {
          // Add new data
          console.log("Data to save ", dataToSaveArray);

          await addJenisVaksinBulk(dataToSaveArray);
          // setJenisVaksins((prevJenisVaksins) => [...prevJenisVaksins, dataToSave]);
        }
      } catch (error) {
        errorCount++;
        console.error("Gagal menyimpan data:", error);
      }
      if (errorCount === 0) {
        message.success(`Semua data berhasil disimpan.`);
      } else {
        message.error(`${errorCount} data gagal disimpan, harap coba lagi!`);
      }
    } catch (error) {
      console.error("Gagal memproses data:", error);
      message.error("Gagal memproses data, harap coba lagi!");
    } finally {
      setImportedData([]);
      setColumnTitles([]);
      setColumnMapping({});
    }
  };

  const handleDownloadCSV = () => {
    const csvContent = convertHeaderToCSV();
    downloadFormatCSV(csvContent);
  };

  const convertHeaderToCSV = () => {
    const columnTitlesLocal = ["No", "Jenis Vaksin", "Deskripsi"];
    const exampleRow = ["1", "Contoh PMK", "Contoh jenis vaksin untuk penyakit PMK"];

    // Gabungkan header dan contoh data
    const rows = [columnTitlesLocal, exampleRow];

    // Gabungkan semua baris dengan delimiter koma
    const csvContent = rows.map((row) => row.join(",")).join("\n");
    return csvContent;
  };

  const downloadFormatCSV = (csvContent) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.setAttribute("download", "format_jenisvaksin.csv");
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Exporting Data to CSV
  const handleExportData = () => {
    const csvContent = convertToCSV(jenisVaksins);
    downloadCSV(csvContent);
  };

  // Convert Data to CSV Format
  const convertToCSV = (data) => {
    const columnTitles = ["ID Jenis Vaksin", "Jenis Vaksin", "Deskripsi"];

    const rows = [columnTitles];
    data.forEach((item) => {
      const row = [item.idJenisVaksin, item.jenis, item.deskripsi];
      rows.push(row);
    });

    let csvContent = "data:text/csv;charset=utf-8,";

    rows.forEach((rowArray) => {
      const row = rowArray.join(";");
      csvContent += row + "\r\n";
    });

    return csvContent;
  };

  // Download CSV File
  const downloadCSV = (csvContent) => {
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "JenisVaksin.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link); // Clean up
  };

  // Render Columns with Operations
  const renderColumns = () => {
    const baseColumns = [
      {
        title: "ID Jenis Vaksin",
        dataIndex: "idJenisVaksin",
        key: "idJenisVaksin",
      },
      { title: "Jenis", dataIndex: "jenis", key: "jenis" },
      { title: "Deskripsi", dataIndex: "deskripsi", key: "deskripsi" },
    ];

    if (user && (user.role === "ROLE_ADMINISTRATOR" || user.role === "ROLE_PETUGAS")) {
      baseColumns.push({
        title: "Operasi",
        key: "action",
        width: 120,
        align: "center",
        render: (text, row) => (
          <span>
            <Button type="primary" shape="circle" icon={<EditOutlined />} title="Edit" onClick={() => handleEditJenisVaksin(row)} />
            <Divider type="vertical" />
            <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} title="Delete" onClick={() => handleDeleteJenisVaksin(row)} />
          </span>
        ),
      });
    }

    return baseColumns;
  };

  // Render Table based on User Role
  const renderTable = () => {
    if (user && user.role === "ROLE_PETERNAK") {
      return <Table dataSource={jenisVaksins} bordered columns={renderColumns()} rowKey="idJenisVaksin" />;
    } else if (user && (user.role === "ROLE_ADMINISTRATOR" || user.role === "ROLE_PETUGAS")) {
      return <Table dataSource={jenisVaksins} bordered columns={renderColumns()} rowKey="idJenisVaksin" />;
    } else {
      return null;
    }
  };

  // Render Buttons based on User Role
  const renderButtons = () => {
    if (user && (user.role === "ROLE_ADMINISTRATOR" || user.role === "ROLE_PETUGAS")) {
      return (
        <Row gutter={[16, 16]} justify="start" style={{ paddingLeft: 9 }}>
          <Col>
            <Button type="primary" onClick={handleAddJenisVaksin} block>
              Tambah Jenis Vaksin
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

  // Define the Title with Buttons and Search Input
  const title = (
    <Row gutter={[16, 16]} justify="space-between">
      {renderButtons()}
      <Col xs={24} sm={12} md={8} lg={8} xl={8}>
        <Input placeholder="Cari data" value={searchKeyword} onChange={(e) => handleSearch(e.target.value)} style={{ width: "100%" }} />
      </Col>
    </Row>
  );

  const cardContent = `Di sini, Anda dapat mengelola daftar jenis vaksin di sistem.`;

  return (
    <div className="app-container">
      {/* TypingCard component */}
      <TypingCard title="Manajemen Jenis Vaksin" source={cardContent} />
      <br />
      <Card title={title} style={{ overflowX: "scroll" }}>
        {renderTable()}
      </Card>

      {/* Edit Jenis Vaksin Modal */}
      <EditJenisVaksinForm
        currentRowData={currentRowData}
        wrappedComponentRef={editJenisVaksinFormRef}
        visible={editJenisVaksinModalVisible}
        confirmLoading={editJenisVaksinModalLoading}
        onCancel={handleCancel}
        onOk={handleEditJenisVaksinOk}
      />

      {/* Add Jenis Vaksin Modal */}
      <AddJenisVaksinForm wrappedComponentRef={addJenisVaksinFormRef} visible={addJenisVaksinModalVisible} confirmLoading={addJenisVaksinModalLoading} onCancel={handleCancel} onOk={handleAddJenisVaksinOk} />

      {/* Import Modal */}
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

export default JenisVaksin;
