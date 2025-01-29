/* eslint-disable no-unused-vars */
import {
  addTujuanPemeliharaan,
  deleteTujuanPemeliharaan,
  editTujuanPemeliharaan,
  getTujuanPemeliharaan,
  addTujuanPemeliharaanBulk,
} from "@/api/tujuan-pemeliharaan";
import TypingCard from "@/components/TypingCard";
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  UploadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
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
  Space,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { reqUserInfo } from "../../api/user";
import AddTujuanPemeliharaanForm from "./forms/add-tujuanpemeliharaan-form";
import EditTujuanPemeliharaanForm from "./forms/edit-tujuanpemeliharaan-form";
import { v4 as uuidv4 } from "uuid";
import { read, utils } from "xlsx";
import { Skeleton } from "antd";
import Highlighter from "react-highlight-words";
import { data } from "react-router-dom";

const TujuanPemeliharaan = () => {
  // State Variables
  // const [petugas, setPetugas] = useState([]
  const [tujuanPemeliharaans, setTujuanPemeliharaans] = useState([]);
  const [editTujuanModalVisible, setEditTujuanModalVisible] = useState(false);
  const [editTujuanModalLoading, setEditTujuanModalLoading] = useState(false);
  const [currentRowData, setCurrentRowData] = useState({});
  const [addTujuanModalVisible, setAddTujuanModalVisible] = useState(false);
  const [addTujuanModalLoading, setAddTujuanModalLoading] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importedData, setImportedData] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [columnTitles, setColumnTitles] = useState([]);
  const [fileName, setFileName] = useState("");
  const [columnMapping, setColumnMapping] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const searchInput = useRef(null);
  const editTujuanFormRef = useRef(null);
  const addTujuanFormRef = useRef(null);

  // Fetch Initial Data on Component Mount
  useEffect(() => {
    getTujuanPemeliharaanData();
    reqUserInfo()
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Terjadi kesalahan saat mengambil data user:", error);
      });
  }, []);

  // Fetch All Jenis Hewan with Optional Filtering
  const getTujuanPemeliharaanData = async () => {
    setLoading(true);
    try {
      const result = await getTujuanPemeliharaan();
      const { content, statusCode } = result.data;

      if (statusCode === 200) {
        const filteredTujuanPemeliharaan = content.filter((tujuan) => {
          const { idTujuanPemeliharaan, tujuanPemeliharaan, deskripsi } =
            tujuan;
          const keyword = searchKeyword.toLowerCase();

          const isIdTujuanPemeliharaanValid =
            typeof idTujuanPemeliharaan === "string";
          const isTujuanPemeliharaanValid =
            typeof tujuanPemeliharaan === "string";
          const isDeskripsiValid = typeof deskripsi === "string";

          return (
            (isIdTujuanPemeliharaanValid &&
              idTujuanPemeliharaan.toLowerCase().includes(keyword)) ||
            (isTujuanPemeliharaanValid &&
              tujuanPemeliharaan.toLowerCase().includes(keyword)) ||
            (isDeskripsiValid && deskripsi.toLowerCase().includes(keyword))
          );
        });

        setTujuanPemeliharaans(filteredTujuanPemeliharaan);
      }
    } catch (error) {
      console.error("Failed to fetch tujuan pemeliharaan:", error);
      message.error(
        "Gagal mengambil data tujuan pemeliharaan, harap coba lagi!"
      );
    } finally {
      setLoading(false);
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

  // Fetch All Petugas
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
  // const handleSearch = (keyword) => {
  //   setSearchKeyword(keyword)
  //   getJenisHewanData()
  // }

  const handleSearchTable = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  // Handle Opening the Import Modal
  const handleImportModalOpen = () => {
    setImportModalVisible(true);
  };

  // Handle Closing the Import Modal
  const handleImportModalClose = () => {
    setImportModalVisible(false);
  };

  // Handle Adding a Tujuan Pemeliharaan
  const handleAddTujuan = () => {
    setAddTujuanModalVisible(true);
  };

  // Handle Confirming the Add Tujuan Pemeliharaan Modal
  const handleAddTujuanOk = async (values, form) => {
    setAddTujuanModalLoading(true);
    const tujuanData = {
      tujuanPemeliharaan: values.tujuanPemeliharaan,
      deskripsi: values.deskripsi,
    };
    setLoading(true);
    try {
      await addTujuanPemeliharaan(tujuanData);
      form.resetFields();
      setAddTujuanModalVisible(false);
      setAddTujuanModalLoading(false);
      message.success("Berhasil menambahkan!");
      getTujuanPemeliharaanData();
    } catch (e) {
      setAddTujuanModalLoading(false);
      console.error("Failed to add tujuan pemeliharaan:", e);
      message.error("Gagal menambahkan, harap coba lagi!");
    } finally {
      setLoading(false);
    }
  };

  // Handle Editing a Tujuan Pemeliharaan
  const handleEditTujuan = (row) => {
    setCurrentRowData({ ...row });
    setEditTujuanModalVisible(true);
  };

  // Handle Confirming the Edit Tujuan Pemeliharaan Modal
  const handleEditTujuanOk = async (values) => {
    setEditTujuanModalLoading(true);
    setLoading(true);
    try {
      await editTujuanPemeliharaan(values, values.idTujuanPemeliharaan);
      setEditTujuanModalVisible(false);
      setEditTujuanModalLoading(false);
      message.success("Berhasil diedit!");
      getTujuanPemeliharaanData();
    } catch (e) {
      setEditTujuanModalLoading(false);
      console.error("Failed to edit Tujuan pemeliharaan:", e);
      message.error("Pengeditan gagal, harap coba lagi!");
    } finally {
      setLoading(false);
    }
  };

  // Handle Deleting a Tujuan Pemeliharaan

  const handleDeleteTujuan = (row) => {
    // Tambahkan state loading
    const { idTujuanPemeliharaan } = row;

    Modal.confirm({
      title: "Konfirmasi",
      content: "Apakah Anda yakin ingin menghapus data ini?",
      okText: "Ya",
      okType: "danger",
      cancelText: "Tidak",
      onOk: () => {
        setLoading(true);
        deleteTujuanPemeliharaan({ idTujuanPemeliharaan })
          .then((res) => {
            message.success("Berhasil dihapus");
            getTujuanPemeliharaanData();
          })
          .catch((error) => {
            console.error("Gagal menghapus tujuan:", error);
            message.error("Gagal menghapus tujuan.");
          })
          .finally(() => {
            setLoading(false);
          });
      },
    });
  };

  // // Handle Canceling Any Modal
  const handleCancel = () => {
    setEditTujuanModalVisible(false);
    setAddTujuanModalVisible(false);
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

  const handleDownloadCSV = () => {
    const csvContent = convertHeaderToCSV();
    downloadFormatCSV(csvContent);
  };

  const convertHeaderToCSV = () => {
    const columnTitlesLocal = ["No", "Tujuan Pemeliharaan", "Deskripsi"];
    const exampleRow = [
      "1",
      "Contoh Pembibitan",
      "Contoh pembibitan sapi potong",
    ];

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
    link.setAttribute("download", "format_tujuanpemeliharaan.csv");
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          idTujuanPemeliharaan: generateId,
          tujuanPemeliharaan: row[mapping["Tujuan Pemeliharaan"]],
          deskripsi: row[mapping["Deskripsi"]],
        };
        dataToSaveArray.push(dataToSave);
      }

      setLoading(true);
      try {
        if (dataToSaveArray.length > 0) {
          // Add new data
          await addTujuanPemeliharaanBulk(dataToSaveArray);
        }
      } catch (error) {
        errorCount++;
        console.error("Gagal menyimpan data:", error);
      }

      if (errorCount === 0) {
        message.success(`Semua data berhasil disimpan.`);
        getTujuanPemeliharaanData();
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
      setLoading(false);
    }
  };

  // Handle Exporting Data to CSV
  const handleExportData = () => {
    const csvContent = convertToCSV(tujuanPemeliharaans);
    downloadCSV(csvContent);
  };

  // Convert Data to CSV Format
  const convertToCSV = (data) => {
    const columnTitles = [
      "ID Tujuan Pemeliharaan",
      "Tujuan Pemeliharaan",
      "Deskripsi",
    ];

    const rows = [columnTitles];
    data.forEach((item) => {
      const row = [
        item.idTujuanPemeliharaan,
        item.tujuanPemeliharaan,
        item.deskripsi,
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

  // Download CSV File
  const downloadCSV = (csvContent) => {
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "TujuanPemeliharaan.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link); // Clean up
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

  // Render Columns with Operations
  const renderColumns = () => {
    const baseColumns = [
      {
        title: "ID Tujuan Pemeliharaan",
        dataIndex: "idTujuanPemeliharaan",
        key: "idTujuanPemeliharaan",
        ...getColumnSearchProps("idTujuanPemeliharaan"),
      },
      {
        title: "Tujuan Pemeliharaan",
        dataIndex: "tujuanPemeliharaan",
        key: "tujuanPemeliharaan",
        ...getColumnSearchProps("tujuanPemeliharaan"),
        sorter: (a, b) =>
          a.tujuanPemeliharaan.localeCompare(b.tujuanPemeliharaan),
      },
      {
        title: "Deskripsi",
        dataIndex: "deskripsi",
        key: "deskripsi",
        ...getColumnSearchProps("deskripsi"),
        sorter: (a, b) => a.deskripsi.localeCompare(b.deskripsi),
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
              icon={<EditOutlined />}
              title="Edit"
              onClick={() => handleEditTujuan(row)}
            />
            <Divider type="vertical" />
            <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              title="Delete"
              onClick={() => handleDeleteTujuan(row)}
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
          dataSource={tujuanPemeliharaans}
          bordered
          columns={renderColumns()}
          rowKey="idTujuanPemeliharaan"
        />
      );
    } else if (
      user &&
      (user.role === "ROLE_ADMINISTRATOR" || user.role === "ROLE_PETUGAS")
    ) {
      return (
        <Table
          dataSource={tujuanPemeliharaans}
          bordered
          columns={renderColumns()}
          rowKey="idTujuanPemeliharaan"
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
          <Col>
            <Button type="primary" block onClick={handleAddTujuan}>
              Tambah tujuan pemeliharaan
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

  // Define the Title with Buttons and Search Input
  const title = (
    <Row gutter={[16, 16]} justify="space-between">
      {renderButtons()}
      <Col xs={24} sm={12} md={8} lg={8} xl={8}>
        <Input
          placeholder="Cari data"
          value={searchKeyword}
          // onChange={(e) => handleSearch(e.target.value)}
          style={{ width: "100%" }}
        />
      </Col>
    </Row>
  );

  const cardContent = `Di sini, Anda dapat mengelola daftar tujuan pemeliharaan di sistem.`;

  return (
    <div className="app-container">
      {/* TypingCard component */}
      <TypingCard title="Manajemen Tujuan Pemeliharaan" source={cardContent} />
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

      {/* Edit Tujuan Pemeliharaan Modal */}
      <EditTujuanPemeliharaanForm
        currentRowData={currentRowData}
        wrappedComponentRef={editTujuanFormRef}
        visible={editTujuanModalVisible}
        confirmLoading={editTujuanModalLoading}
        onCancel={handleCancel}
        onOk={handleEditTujuanOk}
      />

      {/* Add Tujuan Pemeliharraan Modal */}
      <AddTujuanPemeliharaanForm
        wrappedComponentRef={addTujuanFormRef}
        visible={addTujuanModalVisible}
        confirmLoading={addTujuanModalLoading}
        onCancel={handleCancel}
        onOk={handleAddTujuanOk}
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
        <Upload beforeUpload={handleFileImport} accept=".xlsx,.xls,.csv">
          <Button icon={<UploadOutlined />}>Pilih File</Button>
        </Upload>
      </Modal>
    </div>
  );
};

export default TujuanPemeliharaan;
