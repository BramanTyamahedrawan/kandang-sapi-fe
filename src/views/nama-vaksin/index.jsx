/* eslint-disable no-constant-condition */
/* eslint-disable no-unused-vars */
import {
  addNamaVaksin,
  deleteNamaVaksin,
  editNamaVaksin,
  getNamaVaksin,
} from "@/api/nama-vaksin";
import TypingCard from "@/components/TypingCard";
import { reqUserInfo } from "@/api/user"; // Adjust the import path as necessary
import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  Input,
  message,
  Modal,
  Row,
  Table,
  Upload,
} from "antd";
import { read, utils } from "xlsx";
import AddNamaVaksinForm from "./forms/add-namavaksin-form";
import EditNamaVaksinForm from "./forms/edit-namavaksin-form";
import React, { useEffect, useRef, useState } from "react";

const NamaVaksin = () => {
  // State Variables
  const [namaVaksins, setNamaVaksins] = useState([]);
  const [editNamaVaksinModalVisible, setEditNamaVaksinModalVisible] =
    useState(false);
  const [editNamaVaksinModalLoading, setEditNamaVaksinModalLoading] =
    useState(false);
  const [currentRowData, setCurrentRowData] = useState({});
  const [addNamaVaksinModalVisible, setAddNamaVaksinModalVisible] =
    useState(false);
  const [addNamaVaksinModalLoading, setAddNamaVaksinModalLoading] =
    useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importedData, setImportedData] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [columnTitles, setColumnTitles] = useState([]);
  const [fileName, setFileName] = useState("");
  const [columnMapping, setColumnMapping] = useState({});

  // Form References
  const editNamaVaksinFormRef = useRef(null);
  const addNamaVaksinFormRef = useRef(null);

  useEffect(() => {
    getNamaVaksinData();
    reqUserInfo()
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Terjadi kesalahan saat mengambil data user:", error);
      });
  }, []);

  // Fetch All Jenis Vaksin with Optional Filtering
  const getNamaVaksinData = async () => {
    try {
      const result = await getNamaVaksin();
      const { content, statusCode } = result.data;

      if (statusCode === 200) {
        const filteredNamaVaksin = content.filter((jv) => {
          const { idNamaVaksin, namaVaksin, deskripsi } = jv;
          const keyword = searchKeyword.toLowerCase();

          const isIdNamaVaksinValid = typeof idNamaVaksin === "string";
          const isNamaValid = typeof namaVaksin === "string";
          const isDeskripsiValid = typeof deskripsi === "string";

          return (
            (isIdNamaVaksinValid &&
              idNamaVaksin.toLowerCase().includes(keyword)) ||
            (isNamaValid && namaVaksin.toLowerCase().includes(keyword)) ||
            (isDeskripsiValid && deskripsi.toLowerCase().includes(keyword))
          );
        });

        setNamaVaksins(filteredNamaVaksin);
      }
    } catch (error) {
      console.error("Failed to fetch jenis vaksin:", error);
      message.error("Gagal mengambil data nama vaksin, harap coba lagi!");
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
    getNamaVaksinData();
  };

  // Handle Opening the Import Modal
  const handleImportModalOpen = () => {
    setImportModalVisible(true);
  };

  // Handle Closing the Import Modal
  const handleImportModalClose = () => {
    setImportModalVisible(false);
  };

  // Handle Adding a Nama Vaksin
  const handleAddJenisVaksin = () => {
    setAddNamaVaksinModalVisible(true);
  };

  // Handle Confirming the Add Nama Vaksin Modal
  const handleAddNamaVaksinOk = async (values, form) => {
    setAddNamaVaksinModalLoading(true);
    const namaData = {
      jenis: values.jenis,
      nama: values.nama,
      deskripsi: values.deskripsi,
    };
    try {
      await addNamaVaksin(namaData);
      form.resetFields();
      setAddNamaVaksinModalVisible(false);
      setAddNamaVaksinModalLoading(false);
      message.success("Berhasil menambahkan!");
      getNamaVaksinData();
    } catch (e) {
      setAddNamaVaksinModalLoading(false);
      console.error("Failed to add Nama vaksin:", e);
      message.error("Gagal menambahkan, harap coba lagi!");
    }
  };

  // Handle Editing a Jenis Vaksin
  const handleEditNamaVaksin = (row) => {
    setCurrentRowData({ ...row });
    setEditNamaVaksinModalVisible(true);
  };

  // Handle Confirming the Edit Jenis Vaksin Modal
  const handleEditNamaVaksinOk = async (values, form) => {
    setEditNamaVaksinModalLoading(true);
    try {
      await editNamaVaksin(values, values.idNamaVaksin);
      form.resetFields();
      setEditNamaVaksinModalVisible(false);
      setEditNamaVaksinModalLoading(false);
      message.success("Berhasil diedit!");
      getNamaVaksinData();
    } catch (e) {
      setEditNamaVaksinModalLoading(false);
      console.error("Failed to edit Nama vaksin:", e);
      message.error("Pengeditan gagal, harap coba lagi!");
    }
  };

  // Handle Deleting a Nama Vaksin
  const handleDeleteNamaVaksin = (row) => {
    const { idNamaVaksin } = row;

    Modal.confirm({
      title: "Konfirmasi",
      content: "Apakah Anda yakin ingin menghapus data ini?",
      okText: "Ya",
      okType: "danger",
      cancelText: "Tidak",
      onOk: async () => {
        try {
          await deleteNamaVaksin({ idNamaVaksin });
          message.success("Berhasil dihapus");
          getNamaVaksinData();
        } catch (error) {
          console.error("Failed to delete Nama vaksin:", error);
          message.error("Gagal menghapus data, harap coba lagi!");
        }
      },
    });
  };

  // Handle Canceling Any Modal
  const handleCancel = () => {
    setEditNamaVaksinModalVisible(false);
    setAddNamaVaksinModalVisible(false);
    setImportModalVisible(false);
  };

  // Convert Excel Date Format to JavaScript Date
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

  // Handle File Import
  const handleFileImport = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = read(data, { type: "array" });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet, { header: 1 });

      const importedData = jsonData.slice(1); // Exclude the first row (column titles)
      const columnTitles = jsonData[0]; // Assume the first row contains column titles

      // Create column mapping
      const mapping = {};
      columnTitles.forEach((title, index) => {
        mapping[title] = index;
      });

      // Iterate through importedData and process the address (if applicable)
      // Note: For Nama Hewan, address processing may not be necessary.
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
    return false; // Prevent upload
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

    // try {
    //   for (const row of importedData) {
    //     const idJenisVaksin = row[mapping["ID Jenis Vaksin"]]?.toLowerCase();
    //     const jenis = row[mapping["Jenis Vaksin"]]?.toLowerCase();
    //     const deskripsi = row[mapping["Deskripsi"]]?.toLowerCase();

    //     const dataToSave = {
    //       idJenisVaksin: row[mapping["ID Jenis Hewan"]] || "",
    //       jenis: row[mapping["Jenis Vaksin"]] || "",
    //       deskripsi: row[mapping["Deskripsi"]] || "",
    //     };

    //     const existingJenisVaksinIndex = jenisVaksins.findIndex((p) => p.idJenisVaksin === dataToSave.idJenisVaksin);

    //     try {
    //       if (existingJenisVaksinIndex > -1) {
    //         // Update existing data
    //         await editJenisVaksin(dataToSave, dataToSave.idJenisVaksin);
    //         setJenisVaksins((prevJenisVaksins) => {
    //           const updatedJenisVaksins = [...prevJenisVaksins];
    //           updatedJenisVaksins[existingJenisVaksinIndex] = dataToSave;
    //           return updatedJenisVaksins;
    //         });
    //       } else {
    //         // Add new data
    //         await addJenisVaksin(dataToSave);
    //         setJenisVaksins((prevJenisVaksins) => [...prevJenisVaksins, dataToSave]);
    //       }
    //     } catch (error) {
    //       errorCount++;
    //       console.error("Gagal menyimpan data:", error);
    //     }
    //   }

    //   if (errorCount === 0) {
    //     message.success(`Semua data berhasil disimpan.`);
    //   } else {
    //     message.error(`${errorCount} data gagal disimpan, harap coba lagi!`);
    //   }
    // } catch (error) {
    //   console.error("Gagal memproses data:", error);
    //   message.error("Gagal memproses data, harap coba lagi!");
    // } finally {
    //   setImportedData([]);
    //   setColumnTitles([]);
    //   setColumnMapping({});
    // }
  };

  // Handle Exporting Data to CSV
  const handleExportData = () => {
    const csvContent = convertToCSV(namaVaksins);
    downloadCSV(csvContent);
  };

  // Convert Data to CSV Format
  const convertToCSV = (data) => {
    // const columnTitles = ["ID Jenis Vaksin", "Jenis Vaksin", "Deskripsi"];
    // const rows = [columnTitles];
    // data.forEach((item) => {
    //   const row = [item.idJenisVaksin, item.jenis, item.deskripsi];
    //   rows.push(row);
    // });
    // let csvContent = "data:text/csv;charset=utf-8,";
    // rows.forEach((rowArray) => {
    //   const row = rowArray.join(";");
    //   csvContent += row + "\r\n";
    // });
    // return csvContent;
  };

  // Download CSV File
  const downloadCSV = (csvContent) => {
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "NamaVaksin.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link); // Clean up
  };

  // Render Columns with Operations
  const renderColumns = () => {
    const baseColumns = [
      {
        title: "ID Nama Vaksin",
        dataIndex: "idNamaVaksin",
        key: "idNamaVaksin",
      },
      {
        title: "Jenis Vaksin",
        dataIndex: ["jenisVaksin", "namaVaksin"],
        key: "jenisVaksin",
      },
      { title: "Nama Vaksin", dataIndex: "namaVaksin", key: "namaVaksin" },
      { title: "Deskripsi", dataIndex: "deskripsi", key: "deskripsi" },
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
              onClick={() => handleEditNamaVaksin(row)}
            />
            <Divider type="vertical" />
            <Button
              type="primary"
              danger
              shape="circle"
              icon="delete"
              title="Delete"
              onClick={() => handleDeleteNamaVaksin(row)}
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
          dataSource={namaVaksins}
          bordered
          columns={renderColumns()}
          rowKey="idNamaVaksin"
        />
      );
    } else if (
      user &&
      (user.role === "ROLE_ADMINISTRATOR" || user.role === "ROLE_PETUGAS")
    ) {
      return (
        <Table
          dataSource={namaVaksins}
          bordered
          columns={renderColumns()}
          rowKey="idNamaVaksin"
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
            <Button type="primary" onClick={handleAddJenisVaksin} block>
              Tambah Nama Vaksin
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

  // Define the Title with Buttons and Search Input
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

  const cardContent = `Di sini, Anda dapat mengelola daftar nama vaksin di sistem.`;

  return (
    <div className="app-container">
      {/* TypingCard component */}
      <TypingCard title="Manajemen Nama Vaksin" source={cardContent} />
      <br />
      <Card title={title} style={{ overflowX: "scroll" }}>
        {renderTable()}
      </Card>

      {/* Edit Nama vaksin Modal */}
      <EditNamaVaksinForm
        currentRowData={currentRowData}
        wrappedComponentRef={editNamaVaksinFormRef}
        visible={editNamaVaksinModalVisible}
        confirmLoading={editNamaVaksinModalLoading}
        onCancel={handleCancel}
        onOk={handleEditNamaVaksinOk}
      />

      {/* Add Nama Vaksin Modal */}
      <AddNamaVaksinForm
        wrappedComponentRef={addNamaVaksinFormRef}
        visible={addNamaVaksinModalVisible}
        confirmLoading={addNamaVaksinModalLoading}
        onCancel={handleCancel}
        onOk={handleAddNamaVaksinOk}
      />

      {/* Import Modal */}
      <Modal
        title="Import File"
        visible={importModalVisible}
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
        <Upload
          beforeUpload={handleFileImport}
          accept=".xlsx,.xls,.csv"
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>Pilih File</Button>
        </Upload>
      </Modal>
    </div>
  );
};

export default NamaVaksin;
