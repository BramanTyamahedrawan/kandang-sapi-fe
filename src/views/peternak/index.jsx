/* eslint-disable no-unused-vars */
import {
  addPeternak,
  deletePeternak,
  editPeternak,
  getPeternaks,
} from "@/api/peternak";
import { getPetugas } from "@/api/petugas";
import {
  deleteUser,
  getUserByUsername,
  register,
  reqUserInfo,
} from "@/api/user";
import kandangSapi from "@/assets/images/kandangsapi.jpg";
import TypingCard from "@/components/TypingCard";
import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined
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
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { read, utils } from "xlsx";
import AddPeternakForm from "./forms/add-peternak-form";
import EditPeternakForm from "./forms/edit-peternak-form";
import ViewPeternakForm from "./forms/view-peternak-form";

const Peternak = () => {
  const [petugas, setPetugas] = useState([]);
  const [peternaks, setPeternaks] = useState([]);
  const [editPeternakModalVisible, setEditPeternakModalVisible] =
    useState(false);
  const [editPeternakModalLoading, setEditPeternakModalLoading] =
    useState(false);
  const [currentRowData, setCurrentRowData] = useState({});
  const [addPeternakModalVisible, setAddPeternakModalVisible] = useState(false);
  const [addPeternakModalLoading, setAddPeternakModalLoading] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importedData, setImportedData] = useState([]);
  const [columnTitles, setColumnTitles] = useState([]);
  const [fileName, setFileName] = useState("");
  const [columnMapping, setColumnMapping] = useState({});
  const [searchKeyword, setSearchKeyword] = useState("");
  const [user, setUser] = useState(null);
  const [viewPeternakModalVisible, setViewPeternakModalVisible] =
    useState(false);
  const [viewRowData, setViewRowData] = useState({});
  const [uploading, setUploading] = useState(false);

  // Fetch peternaks
  const fetchPeternaks = async () => {
    try {
      const result = await getPeternaks();
      const { content, statusCode } = result.data;

      if (statusCode === 200) {
        const filteredPeternaks = content.filter((peternak) => {
          const {
            namaPeternak,
            nikPeternak,
            idPeternak,
            petugasPendaftar,
            lokasi,
          } = peternak;
          const keyword = searchKeyword.toLowerCase();

          const isNamaPeternakValid = typeof namaPeternak === "string";
          const isNikPeternakValid = typeof nikPeternak === "string";
          const isIdPeternakValid = typeof idPeternak === "string";
          const isPetugasPendaftarValid = typeof petugasPendaftar === "string";
          const isLokasiValid = typeof lokasi === "string";

          return (
            (isNamaPeternakValid &&
              namaPeternak.toLowerCase().includes(keyword)) ||
            (isNikPeternakValid &&
              nikPeternak.toLowerCase().includes(keyword)) ||
            (isIdPeternakValid && idPeternak.toLowerCase().includes(keyword)) ||
            (isPetugasPendaftarValid &&
              petugasPendaftar.toLowerCase().includes(keyword)) ||
            (isLokasiValid && lokasi.toLowerCase().includes(keyword))
          );
        });

        setPeternaks(filteredPeternaks);
      }
    } catch (error) {
      console.error("Error fetching peternaks:", error);
      message.error("Gagal mengambil data peternak.");
    }
  };

  // Fetch petugas
  const fetchPetugas = async () => {
    try {
      const result = await getPetugas();
      const { content, statusCode } = result.data;

      if (statusCode === 200) {
        setPetugas(content);
      } else {
        message.error("Gagal mengambil data petugas.");
      }
    } catch (error) {
      console.error("Error fetching petugas:", error);
      message.error("Terjadi kesalahan saat mengambil data petugas.");
    }
  };

  // Fetch user info
  const fetchUserInfo = async () => {
    try {
      const response = await reqUserInfo();
      setUser(response.data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data user:", error);
    }
  };

  useEffect(() => {
    fetchPeternaks();
    fetchPetugas();
    fetchUserInfo();
  }, []);

  // Handle search
  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
  };

  useEffect(() => {
    fetchPeternaks();
  }, [searchKeyword]);

  // Handle edit peternak
  const handleEditPeternak = (row) => {
    setCurrentRowData({ ...row });
    setEditPeternakModalVisible(true);
  };

  // Handle view peternak
  const handleViewPeternak = (row) => {
    setViewRowData(row);
    setViewPeternakModalVisible(true);
  };

  // Handle delete peternak
  const handleDeletePeternak = (row) => {
    const { idPeternak, nikPeternak } = row;
    getUserByUsername(nikPeternak)
      .then((userResponse) => {
        if (userResponse && userResponse.data) {
          const userId = userResponse.data.id;
          Modal.confirm({
            title: "Konfirmasi",
            content: "Apakah Anda yakin ingin menghapus data ini?",
            okText: "Ya",
            okType: "danger",
            cancelText: "Tidak",
            onOk: async () => {
              try {
                await deletePeternak({ idPeternak });
                message.success("Berhasil dihapus");
                fetchPeternaks();
              } catch (error) {
                console.error("Error deleting peternak:", error);
                message.error("Gagal menghapus peternak.");
              }

              try {
                await deleteUser({ userId });
                message.success("User berhasil dihapus");
              } catch (error) {
                console.error("Error deleting user:", error);
                message.error("Gagal menghapus user.");
              }
            },
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching user by username:", error);
        message.error("Gagal mengambil data user.");
      });
  };

  // Handle edit peternak OK
  const handleEditPeternakOk = async (values) => {
    setEditPeternakModalLoading(true);
    try {
      await editPeternak(values, values.idPeternak);
      setEditPeternakModalVisible(false);
      setEditPeternakModalLoading(false);
      message.success("Berhasil diedit!");
      fetchPeternaks();
    } catch (error) {
      console.error("Error editing peternak:", error);
      message.error("Pengeditan gagal, harap coba lagi!");
      setEditPeternakModalLoading(false);
    }
  };

  // Handle add peternak
  const handleAddPeternak = () => {
    setAddPeternakModalVisible(true);
  };

  // Handle add peternak OK
  const handleAddPeternakOk = async (values, form) => {
    setAddPeternakModalLoading(true);

    const userData = {
      name: values.namaPeternak,
      username: values.nikPeternak.trim(),
      email: `${values.email}`,
      password: values.nikPeternak,
      roles: "3",
      photo: kandangSapi, // Assuming you want to set a default photo
    };

    try {
      await addPeternak(values).then(async (response) => {
        await register(userData).then((response) => {
          form.resetFields();
          setAddPeternakModalVisible(false);
          setAddPeternakModalLoading(false);
          message.success("Berhasil menambahkan!");
          fetchPeternaks();
        });
      });
    } catch (error) {
      console.error("Error adding peternak:", error);
      message.error("Gagal menambahkan, harap coba lagi!");
      setAddPeternakModalLoading(false);
    }
  };

  // Handle import modal
  const handleImportModalOpen = () => {
    setImportModalVisible(true);
  };

  const handleImportModalClose = () => {
    setImportModalVisible(false);
  };

  // Handle file import
  const handleFileImport = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = read(data, { type: "array" });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet, { header: 1 });

      const importedData = jsonData.slice(1); // Exclude the first row (column titles)
      const columnTitles = jsonData[0]; // Assume the first row contains column titles

      const fileName = file.name.toLowerCase();

      setImportedData(importedData);
      setColumnTitles(columnTitles);
      setFileName(fileName);

      // Create column mapping
      const columnMapping = {};
      columnTitles.forEach((title, index) => {
        columnMapping[title] = index;
      });
      setColumnMapping(columnMapping);
    };

    reader.readAsArrayBuffer(file);
    return false; // Prevent upload
  };

  // Convert to JS Date
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

  // Save imported data
  const saveImportedData = async () => {
    const { importedData, peternaks } = { importedData, peternaks }; // Destructure from state
    let errorCount = 0;

    try {
      for (const row of importedData) {
        const role = "3";
        const dataToSaveUser = {
          name: row[columnMapping["Nama Pemilik Ternak**)"]],
          username: row[columnMapping["NIK Pemilik Ternak**)"]],
          email: `${row[columnMapping["Nama Pemilik Ternak**)"]]}@gmail.com`,
          password: row[columnMapping["NIK Pemilik Ternak**)"]],
          roles: role,
          photo: kandangSapi,
        };

        const dataToSavePeternak = {
          idPeternak: row[columnMapping["NIK Pemilik Ternak**)"]],
          nikPeternak: row[columnMapping["NIK Pemilik Ternak**)"]],
          namaPeternak:
            row[
              columnMapping["Nama Pemilik Ternak**)"] || columnMapping["nama"]
            ],
          lokasi:
            row[
              columnMapping["Alamat Pemilik Ternak**)"] ||
                columnMapping["lokasi"]
            ],
          petugas_id:
            row[
              columnMapping["Petugas Pendaftar"] ||
                columnMapping["NIK Petugas Pendataan*)"]
            ],
          tanggalPendaftaran:
            row[columnMapping["Tanggal Pendataan"]] ||
            convertToJSDate(row[columnMapping["Tanggal Pendaftaran"]]),
        };

        const existingPeternakIndex = peternaks.findIndex(
          (p) => p.idPeternak === dataToSavePeternak.idPeternak
        );

        try {
          if (existingPeternakIndex > -1) {
            // Update existing data
            await editPeternak(
              dataToSavePeternak,
              dataToSavePeternak.idPeternak
            );
            setPeternaks((prevPeternaks) => {
              const updatedPeternaks = [...prevPeternaks];
              updatedPeternaks[existingPeternakIndex] = dataToSavePeternak;
              return updatedPeternaks;
            });
          } else {
            // Add new data
            await addPeternak(dataToSavePeternak);
            await register(dataToSaveUser);
            setPeternaks((prevPeternaks) => [
              ...prevPeternaks,
              dataToSavePeternak,
            ]);
          }
        } catch (error) {
          errorCount++;
          console.error("Gagal menyimpan data:", error);
        }
      }

      if (errorCount === 0) {
        message.success("Semua data berhasil disimpan.");
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
      setImportModalVisible(false);
    }
  };

  // Handle upload
  const handleUpload = () => {
    if (importedData.length === 0) {
      message.error("No data to import.");
      return;
    }

    setUploading(true);
    saveImportedData().finally(() => setUploading(false));
  };

  // Handle export
  const handleExportData = () => {
    const csvContent = convertToCSV(peternaks);
    downloadCSV(csvContent);
  };

  // Convert to CSV
  const convertToCSV = (data) => {
    const columnTitles = [
      "ID Peternak",
      "Nama Peternak",
      "NIK Peternak",
      "Lokasi",
      "Petugas Pendaftar",
      "Tanggal Pendaftaran",
    ];

    const rows = [columnTitles];
    data.forEach((item) => {
      const row = [
        item.idPeternak,
        item.namaPeternak,
        item.nikPeternak,
        item.lokasi,
        item.petugas ? item.petugas.namaPetugas : "",
        moment(item.tanggalPendaftaran).format("DD/MM/YYYY"),
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

  // Download CSV
  const downloadCSV = (csvContent) => {
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Peternak.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);
  };

  // Render columns with actions
  const renderColumns = () => {
    const actionColumn = {
      title: "Operasi",
      key: "action",
      width: 170,
      align: "center",
      render: (text, row) => (
        <span>
          <Button
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            title="Edit"
            onClick={() => handleEditPeternak(row)}
          />
          {/* <Divider type="vertical" />
          <Button
            type="primary"
            shape="circle"
            icon={<EyeOutlined />}
            title="View"
            onClick={() => handleViewPeternak(row)}
          /> */}
          <Divider type="vertical" />
          <Button
            type="primary"
            danger
            shape="circle"
            icon={<DeleteOutlined />}
            title="Delete"
            onClick={() => handleDeletePeternak(row)}
          />
        </span>
      ),
    };

    // Clone columns to prevent mutation
    const clonedColumns = [
      { title: "NIK Peternak", dataIndex: "nikPeternak", key: "nikPeternak" },
      {
        title: "Nama Peternak",
        dataIndex: "namaPeternak",
        key: "namaPeternak",
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "Id Isikhnas",
        dataIndex: "idIsikhnas",
        key: "idIsikhnas",
      },
      { title: "Alamat", dataIndex: "alamat", key: "alamat" },
      { title: "No Telepon", dataIndex: "noTelepon", key: "noTelepon" },
      {
        title: "Petugas Pendaftar",
        dataIndex: ["petugas", "namaPetugas"],
        key: "namaPetugas",
      },
      {
        title: "Tanggal Pendaftaran",
        dataIndex: "tanggalPendaftaran",
        key: "tanggalPendaftaran",
        render: (text) => moment(text).format("DD/MM/YYYY"),
      },
    ];

    if (
      user &&
      (user.role === "ROLE_ADMINISTRATOR" || user.role === "ROLE_PETUGAS")
    ) {
      clonedColumns.push(actionColumn);
    }

    return clonedColumns;
  };

  // Render table
  const renderTable = () => {
    if (user && user.role === "ROLE_PETERNAK") {
      return (
        <Table
          dataSource={peternaks}
          bordered
          columns={renderColumns()}
          rowKey="idPeternak"
        />
      );
    } else if (
      user &&
      (user.role === "ROLE_ADMINISTRATOR" || user.role === "ROLE_PETUGAS")
    ) {
      return (
        <Table
          dataSource={peternaks}
          bordered
          columns={renderColumns()}
          rowKey="idPeternak"
        />
      );
    } else {
      return null;
    }
  };

  // Render buttons
  const renderButtons = () => {
    if (
      user &&
      (user.role === "ROLE_ADMINISTRATOR" || user.role === "ROLE_PETUGAS")
    ) {
      return (
        <Row gutter={[16, 16]} justify="start" style={{ paddingLeft: 9 }}>
          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <Button type="primary" onClick={handleAddPeternak} block>
              Tambah Peternak
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

  const cardContent = `Di sini, Anda dapat mengelola daftar peternak di sistem.`;

  return (
    <div className="app-container">
      <TypingCard title="Manajemen Peternak" source={cardContent} />
      <br />
      <Card title={title} style={{ overflowX: "scroll" }}>
        {renderTable()}
      </Card>
      {/* Edit Peternak Modal */}
      <EditPeternakForm
        currentRowData={currentRowData}
        visible={editPeternakModalVisible}
        confirmLoading={editPeternakModalLoading}
        onCancel={() => setEditPeternakModalVisible(false)}
        onOk={handleEditPeternakOk}
      />
      {/* Add Peternak Modal */}
      <AddPeternakForm
        visible={addPeternakModalVisible}
        confirmLoading={addPeternakModalLoading}
        onCancel={() => setAddPeternakModalVisible(false)}
        onOk={handleAddPeternakOk}
      />
      {/* View Peternak Modal */}
      <ViewPeternakForm
        visible={viewPeternakModalVisible}
        onCancel={() => setViewPeternakModalVisible(false)}
        rowData={viewRowData}
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
          accept=".xlsx, .xls, .csv"
          multiple={false}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>Pilih File</Button>
        </Upload>
        {fileName && (
          <div style={{ marginTop: 10 }}>
            <strong>File Terpilih:</strong> {fileName}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Peternak;
