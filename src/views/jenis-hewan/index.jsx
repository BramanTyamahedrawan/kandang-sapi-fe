/* eslint-disable no-constant-condition */
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
  Space,
} from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { read, utils } from "xlsx";
import AddHewanForm from "./forms/add-jenishewan-form";
import EditHewanForm from "./forms/edit-jenishewan-form";
import TypingCard from "@/components/TypingCard";
import {
  getJenisHewan,
  deleteJenisHewan,
  editJenisHewan,
  addJenisHewan,
  addJenisHewanBulk,
} from "@/api/jenishewan";
import { getPetugas } from "@/api/petugas";
import { reqUserInfo } from "../../api/user";
import { v4 as uuidv4 } from "uuid";
import { Skeleton } from "antd";
import Highlighter from "react-highlight-words";
import kandangSapi from "../../assets/images/kandangsapi.jpg"; // Assuming it's a default export

const JenisHewan = () => {
  // State Variables
  const [petugas, setPetugas] = useState([]);
  const [jenisHewans, setJenisHewans] = useState([]);
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
  const [fileName, setFileName] = useState("");
  const [columnMapping, setColumnMapping] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const searchInput = useRef(null);
  const editHewanFormRef = useRef(null);
  const addHewanFormRef = useRef(null);

  // Fetch Initial Data on Component Mount
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
          await getJenisHewanData();
        }
      } catch (error) {
        console.error("Terjadi kesalahan saat mengambil data user:", error);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch All Jenis Hewan with Optional Filtering
  const getJenisHewanData = async () => {
    setLoading(true);
    try {
      const result = await getJenisHewan();
      const { content, statusCode } = result.data;

      if (statusCode === 200) {
        const filteredJenisHewan = content.filter((hewan) => {
          const { idJenisHewan, jenis, deskripsi } = hewan;
          const keyword = searchKeyword.toLowerCase();

          const isIdJenisHewanValid = typeof idJenisHewan === "string";
          const isJenisValid = typeof jenis === "string";
          const isDeskripsiValid = typeof deskripsi === "string";

          return (
            (isIdJenisHewanValid &&
              idJenisHewan.toLowerCase().includes(keyword)) ||
            (isJenisValid && jenis.toLowerCase().includes(keyword)) ||
            (isDeskripsiValid && deskripsi.toLowerCase().includes(keyword))
          );
        });

        setJenisHewans(filteredJenisHewan);
      }
    } catch (error) {
      console.error("Failed to fetch jenis hewan:", error);
      message.error("Gagal mengambil data jenis hewan, harap coba lagi!");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Jenis Hewan by Peternak ID (for ROLE_PETERNAK)
  const getHewanByPeternak = async (peternakID) => {
    try {
      const result = await getJenisHewan(); // Assuming similar API structure
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        const filteredHewans = content.filter(
          (hewan) => hewan.peternak_id === peternakID
        );
        setJenisHewans(filteredHewans);
      }
    } catch (error) {
      console.error("Failed to fetch jenis hewan by peternak:", error);
      message.error("Gagal mengambil data jenis hewan, harap coba lagi!");
    }
  };

  // Fetch All Petugas
  const getPetugasData = async () => {
    try {
      const result = await getPetugas();
      const { content, statusCode } = result.data;

      if (statusCode === 200) {
        setPetugas(content);
      }
    } catch (error) {
      console.error("Failed to fetch petugas:", error);
      message.error("Gagal mengambil data petugas, harap coba lagi!");
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

  // Handle Search Input Change
  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
    getJenisHewanData();
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
  const handleAddHewan = () => {
    setAddHewanModalVisible(true);
  };

  // Handle Confirming the Add Jenis Hewan Modal
  const handleAddHewanOk = async (values, form) => {
    setAddHewanModalLoading(true);
    const hewanData = {
      jenis: values.jenis,
      deskripsi: values.deskripsi,
    };
    setLoading(true);
    try {
      await addJenisHewan(hewanData);
      form.resetFields();
      setAddHewanModalVisible(false);
      setAddHewanModalLoading(false);
      message.success("Berhasil menambahkan!");
      getJenisHewanData();
    } catch (e) {
      setAddHewanModalLoading(false);
      console.error("Failed to add jenis hewan:", e);
      message.error("Gagal menambahkan, harap coba lagi!");
    } finally {
      setLoading(false);
    }
  };

  // Handle Editing a Jenis Hewan
  const handleEditHewan = (row) => {
    setCurrentRowData({ ...row });
    setEditHewanModalVisible(true);
  };

  // Handle Confirming the Edit Jenis Hewan Modal
  const handleEditHewanOk = async (values) => {
    setEditHewanModalLoading(true);
    setLoading(true);
    try {
      await editJenisHewan(values, currentRowData.idJenisHewan);
      setEditHewanModalVisible(false);
      setEditHewanModalLoading(false);
      message.success("Berhasil diedit!");
      getJenisHewanData();
    } catch (e) {
      setEditHewanModalLoading(false);
      console.error("Failed to edit jenis hewan:", e);
      message.error("Pengeditan gagal, harap coba lagi!");
    } finally {
      setLoading(false);
    }
  };

  // Handle Deleting a Jenis Hewan
  const handleDeleteHewan = (row) => {
    const { idJenisHewan } = row;

    Modal.confirm({
      title: "Konfirmasi",
      content: "Apakah Anda yakin ingin menghapus data ini?",
      okText: "Ya",
      okType: "danger",
      cancelText: "Tidak",
      onOk: async () => {
        setLoading(true);
        try {
          await deleteJenisHewan({ idJenisHewan });
          message.success("Berhasil dihapus");
          getJenisHewanData();
        } catch (error) {
          console.error("Failed to delete jenis hewan:", error);
          message.error("Gagal menghapus data, harap coba lagi!");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Handle Canceling Any Modal
  const handleCancel = () => {
    setEditHewanModalVisible(false);
    setAddHewanModalVisible(false);
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
  const saveImportedData = async () => {
    const dataToSaveArray = [];
    try {
      for (const row of importedData) {
        const generateId = uuidv4();
        const dataToSave = {
          idJenisHewan: generateId,
          jenis: row[columnMapping["Jenis Hewan"]],
          deskripsi: row[columnMapping["Deskripsi"]],
        };
        dataToSaveArray.push(dataToSave);
      }
      setLoading(true);
      try {
        if (dataToSaveArray.length > 0) {
          // Add new data
          console.log("Data Jenis ", dataToSaveArray);

          await addJenisHewanBulk(dataToSaveArray);
        }
      } catch (error) {
        console.error("Gagal menyimpan data:", error);
      }
      message.success("Data berhasil diimport!");
      getJenisHewanData();
    } catch (error) {
      console.error("Gagal memproses data:", error);
      message.error("Gagal memproses data, harap coba lagi!");
    } finally {
      setImportedData([]);
      setColumnTitles([]);
      setColumnMapping({});
      setFileName("");
      setLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    const csvContent = convertHeaderToCSV();
    downloadFormatCSV(csvContent);
  };

  const convertHeaderToCSV = () => {
    const columnTitlesLocal = ["No", "Jenis Hewan", "Deskripsi"];
    const exampleRow = ["1", "Contoh Sapi", "Contoh Jenis hewan sapi"];

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
    link.setAttribute("download", "format_jenishewan.csv");
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Exporting Data to CSV
  const handleExportData = () => {
    const csvContent = convertToCSV(jenisHewans);
    downloadCSV(csvContent);
  };

  // Convert Data to CSV Format
  const convertToCSV = (data) => {
    const columnTitles = ["ID Jenis Hewan", "Jenis", "Deskripsi"];

    const rows = [columnTitles];
    data.forEach((item) => {
      const row = [item.idJenisHewan, item.jenis, item.deskripsi];
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
    link.setAttribute("download", "JenisHewan.csv");
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
        title: "ID Jenis Hewan",
        dataIndex: "idJenisHewan",
        key: "idJenisHewan",
        ...getColumnSearchProps("idJenisHewan"),
        sorter: (a, b) => a.idJenisHewan.localeCompare(b.idJenisHewan),
      },
      {
        title: "Jenis",
        dataIndex: "jenis",
        key: "jenis",
        ...getColumnSearchProps("jenis"),
        sorter: (a, b) => a.jenis.localeCompare(b.jenis),
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
              onClick={() => handleEditHewan(row)}
            />
            <Divider type="vertical" />
            <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
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
          dataSource={jenisHewans}
          bordered
          columns={renderColumns()}
          rowKey="idJenisHewan"
        />
      );
    } else if (
      user &&
      (user.role === "ROLE_ADMINISTRATOR" || user.role === "ROLE_PETUGAS")
    ) {
      return (
        <Table
          dataSource={jenisHewans}
          bordered
          columns={renderColumns()}
          rowKey="idJenisHewan"
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
            <Button type="primary" onClick={handleAddHewan} block>
              Tambah Jenis Hewan
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
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: "100%" }}
        />
      </Col>
    </Row>
  );

  const cardContent = `Di sini, Anda dapat mengelola daftar jenis hewan di sistem.`;

  return (
    <div className="app-container">
      {/* TypingCard component */}
      <TypingCard title="Manajemen Jenis Hewan" source={cardContent} />
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
      {/* Edit Jenis Hewan Modal */}
      <EditHewanForm
        currentRowData={currentRowData}
        wrappedComponentRef={editHewanFormRef}
        visible={editHewanModalVisible}
        confirmLoading={editHewanModalLoading}
        onCancel={handleCancel}
        onOk={handleEditHewanOk}
      />

      {/* Add Jenis Hewan Modal */}
      <AddHewanForm
        wrappedComponentRef={addHewanFormRef}
        visible={addHewanModalVisible}
        confirmLoading={addHewanModalLoading}
        onCancel={handleCancel}
        onOk={handleAddHewanOk}
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

export default JenisHewan;
