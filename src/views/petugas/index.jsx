/**
 * eslint-disable no-unused-vars
 *
 * @format
 */

import { addPetugas, deletePetugas, editPetugas, getPetugas, addPetugasBulk } from "@/api/petugas";
import TypingCard from "@/components/TypingCard";
import kandangSapi from "@/assets/images/kandangsapi.jpg";
import { DeleteOutlined, DownloadOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Card, Col, Divider, Input, message, Modal, Row, Table, Upload } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { read, utils } from "xlsx";
import {
  addUser,
  // addUserBulk,
  addUserBulk,
  deleteUserByPetugas,
  getUserByUsername,
  reqUserInfo,
} from "@/api/user";
import AddPetugasForm from "./forms/add-petugas-form";
import EditPetugasForm from "./forms/edit-petugas-form";
import { v4 as uuidv4 } from "uuid";

const Petugas = () => {
  const [petugas, setPetugas] = useState([]);
  const [editPetugasModalVisible, setEditPetugasModalVisible] = useState(false);
  const [editPetugasModalLoading, setEditPetugasModalLoading] = useState(false);
  const [currentRowData, setCurrentRowData] = useState({});
  const [addPetugasModalVisible, setAddPetugasModalVisible] = useState(false);
  const [addPetugasModalLoading, setAddPetugasModalLoading] = useState(false);
  const [importedData, setImportedData] = useState([]);
  const [columnTitles, setColumnTitles] = useState([]);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [columnMapping, setColumnMapping] = useState({});
  const [searchKeyword, setSearchKeyword] = useState("");
  const [user, setUser] = useState(null);

  const editPetugasFormRef = useRef(null);
  const addPetugasFormRef = useRef(null);

  useEffect(() => {
    getPetugasData();
    reqUserInfo()
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Terjadi kesalahan saat mengambil data user:", error);
      });
  }, []);

  const getPetugasData = async () => {
    try {
      const result = await getPetugas();
      console.log(result);
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        const filteredPetugas = content.filter((petugasItem) => {
          const { petugasId } = petugasItem;
          const keyword = searchKeyword.toLowerCase();
          const isPetugasIdValid = typeof petugasId === "string";
          // const isNikPetugasValid = typeof nikPetugas === "string";
          // const isNamaPetugasValid = typeof namaPetugas === "string";
          // const isEmailValid = typeof email === "string";

          return (
            isPetugasIdValid && petugasId.toLowerCase().includes(keyword)
            // (isNikPetugasValid && nikPetugas.toLowerCase().includes(keyword)) ||
            // (isNamaPetugasValid &&
            //   namaPetugas.toLowerCase().includes(keyword)) |
            // (isEmailValid && email.toLowerCase().includes(keyword))
          );
        });

        setPetugas(filteredPetugas);
      }
    } catch (error) {
      console.error("Gagal mengambil data petugas:", error);
      message.error("Gagal mengambil data petugas.");
    }
  };

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
    // Debounce atau delay jika diperlukan
    getPetugasData();
  };

  const handleAddPetugas = () => {
    setAddPetugasModalVisible(true);
  };

  const handleClosePetugas = () => {
    setAddPetugasModalVisible(false);
  };

  const handleAddPetugasOk = (values, form) => {
    setAddPetugasModalLoading(true);
    addPetugas(values)
      .then((response) => {
        setAddPetugasModalVisible(false);
        setAddPetugasModalLoading(false);
        message.success("Berhasil menambahkan!");
        getPetugasData();
        form.resetFields();
      })
      .catch((e) => {
        setAddPetugasModalLoading(false);
        message.error("Gagal menambahkan, harap coba lagi!");
      });
  };

  const handleEditPetugas = (row) => {
    setCurrentRowData({ ...row });
    setEditPetugasModalVisible(true);
  };

  const handleDeletePetugas = (row) => {
    Modal.confirm({
      title: "Konfirmasi",
      content: "Apakah Anda yakin ingin menghapus data ini?",
      okText: "Ya",
      okType: "danger",
      cancelText: "Tidak",
      onOk: async () => {
        const { petugasId, nikPetugas } = row;
        getUserByUsername(nikPetugas).then((userResponse) => {
          if (userResponse && userResponse.data) {
            const userId = userResponse.data.id;
            console.log("userId: " + userId);

            try {
              deletePetugas({ petugasId }).then((res) => {
                getPetugasData();
                deleteUserByPetugas(userId);
                message.success("Berhasil menghapus data petugas");
              });
            } catch (error) {
              console.error("Gagal menghapus petugas:", error);
              message.error("Gagal menghapus petugas.");
            }
          } else {
            deletePetugas({ petugasId }).then((res) => {
              getPetugasData();
              message.success("Berhasil menghapus data petugas");
            });
          }
        });
      },
    });
  };

  const handleEditPetugasOk = async (values) => {
    const form = editPetugasFormRef.current;
    console.log("Form:", form); // Log form untuk memastikan referensi terhubung dengan benar

    if (form) {
      form
        .validateFields()
        .then((values) => {
          setEditPetugasModalLoading(true);
          console.log("Data diterima:", values);
          editPetugas(values, currentRowData.petugasId)
            .then((response) => {
              console.log("Data berhasil diperbarui");
              form.resetFields();
              setEditPetugasModalVisible(false);
              setEditPetugasModalLoading(false);
              message.success("Data berhasil diperbarui!");
              getPetugasData(); // Ambil ulang data petugas setelah update
            })
            .catch((e) => {
              setEditPetugasModalLoading(false);
              message.error("Gagal mengedit data, harap coba lagi!");
              console.error("Error saat mengedit data:", e);
            });
        })
        .catch((err) => {
          console.error("Validasi form gagal:", err);
        });
    } else {
      console.log("Form tidak ditemukan");
    }
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
      const jsonData = utils.sheet_to_json(worksheet, { header: 1, blankrows: false, defval: null });

      const importedDataLocal = jsonData.slice(1); // Exclude the first row (column titles)
      const columnTitlesLocal = jsonData[0]; // Assume the first row contains column titles

      const fileNameLocal = file.name.toLowerCase();

      const columnMappingLocal = {};
      columnTitlesLocal.forEach((title, index) => {
        columnMappingLocal[title] = index;
      });

      setImportedData(importedDataLocal);
      setColumnTitles(columnTitlesLocal);
      setFileName(fileNameLocal);
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

  const saveImportedData = async () => {
    const dataToSaveArray = [];
    const dataToSaveArrayUser = [];
    try {
      for (const row of importedData) {
        const petugasId = uuidv4();
        const dataToSave = {
          petugasId: petugasId,
          nikPetugas: row[columnMapping["NIK Petugas"]],
          namaPetugas: row[columnMapping["Nama Petugas"]],
          noTelp: row[columnMapping["No. Telp Petugas"]],
          email: row[columnMapping["Email Petugas"]],
          wilayah: row[columnMapping["Wilayah"]],
          job: row[columnMapping["Job"]],
        };

        const role = "2";
        const dataToSaveUser = {
          id: dataToSave.petugasId,
          name: dataToSave.namaPetugas,
          nik: dataToSave.nikPetugas,
          username: dataToSave.nikPetugas || dataToSave.namaPetugas,
          email: `${dataToSave.email}`,
          password: `${dataToSave.nikPetugas || dataToSave.namaPetugas}@123`,
          alamat: dataToSave.wilayah,
          role: role,
          photo: kandangSapi,
        };

        // Check if data already exists
        const existingPetugasIndex = petugas.findIndex((p) => p.nikPetugas === dataToSave.nikPetugas);

        dataToSaveArray.push(dataToSave);
        dataToSaveArrayUser.push(dataToSaveUser);
        try {
          if (existingPetugasIndex > -1) {
            // Update existing data
            await editPetugas(dataToSave, dataToSave.nikPetugas);
            setPetugas((prevPetugas) => {
              const updatedPetugas = [...prevPetugas];
              updatedPetugas[existingPetugasIndex] = dataToSave;
              return updatedPetugas;
            });
          } else {
            // Add new data
            console.log("Data Save Petugas ", dataToSaveArray);
            console.log("Data Save User ", dataToSaveArrayUser);

            await addPetugasBulk(dataToSaveArray);
            await addUserBulk(dataToSaveArrayUser);
            setPetugas((prevPetugas) => [...prevPetugas, dataToSave]);
          }
        } catch (error) {
          console.error("Gagal menyimpan data:", error);
        }
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

  const handleDownloadCSV = () => {
    const csvContent = convertHeaderToCSV();
    downloadFormatCSV(csvContent);
  };

  const convertHeaderToCSV = () => {
    const columnTitlesLocal = ["No", "NIK Petugas", "Nama Petugas", "No. Telp Petugas", "Email Petugas", "Wilayah", "Job"];
    const exampleRow = ["1", "Contoh 3508070507040006", "Contoh Supardi", "Contoh 085432678654", "Contoh supardi@gmail.com", "Contoh Yosowilangun,Lumajang,Jawa Timur", "Contoh pendataan"];

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
    link.setAttribute("download", "format_petugas.csv");
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportData = () => {
    const csvContent = convertToCSV(petugas);
    downloadCSV(csvContent);
  };

  const convertToCSV = (data) => {
    const columnTitlesLocal = ["NIK Petugas", "Nama Petugas", "No. Telp Petugas", "Email Petugas", "Job"];

    const rows = [columnTitlesLocal];
    data.forEach((item) => {
      const row = [item.nikPetugas, item.namaPetugas, item.noTelp, item.email];
      rows.push(row);
    });

    const csvContent = rows.map((row) => row.join(",")).join("\n");
    return csvContent;
  };

  const downloadCSV = (csvContent) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.setAttribute("download", "petugas.csv");
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderColumns = () => {
    const baseColumns = [
      { title: "ID Petugas", dataIndex: "petugasId", key: "petugasId" },
      { title: "NIK Petugas", dataIndex: "nikPetugas", key: "nikPetugas" },
      { title: "Nama Petugas", dataIndex: "namaPetugas", key: "namaPetugas" },
      {
        title: "No. Telepon Petugas",
        dataIndex: "noTelp",
        key: "noTelponPetugas",
      },
      { title: "Email Petugas", dataIndex: "email", key: "emailPetugas" },
      { title: "Wilayah", dataIndex: "wilayah", key: "wilayah" },
      { title: "Pekerjaan", dataIndex: "job", key: "job" },
    ];

    if (user && user.role === "ROLE_ADMINISTRATOR") {
      baseColumns.push({
        title: "Operasi",
        key: "action",
        width: 170,
        align: "center",
        render: (text, row) => (
          <span>
            <Button type="primary" shape="circle" icon={<EditOutlined />} title="Edit" onClick={() => handleEditPetugas(row)} />
            <Divider type="vertical" />
            <Button danger type="primary" shape="circle" icon={<DeleteOutlined />} title="Delete" onClick={() => handleDeletePetugas(row)} />
          </span>
        ),
      });
    }

    return baseColumns;
  };

  const renderTable = () => {
    if (user && user.role === "ROLE_PETUGAS") {
      return <Table dataSource={petugas} bordered columns={renderColumns()} rowKey="petugasId" />;
    } else if (user && user.role === "ROLE_ADMINISTRATOR") {
      return <Table dataSource={petugas} bordered columns={renderColumns()} rowKey="petugasId" />;
    } else {
      return null;
    }
  };

  const renderButtons = () => {
    if (user && user.role === "ROLE_ADMINISTRATOR") {
      return (
        <Row gutter={[16, 16]} justify="start" style={{ paddingLeft: 9 }}>
          <Col>
            <Button type="primary" onClick={handleAddPetugas} block>
              Tambah Petugas
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

  const cardContent = `Di sini, Anda dapat mengelola daftar petugas di sistem.`;

  return (
    <div className="app-container">
      <TypingCard title="Manajemen Data Petugas" source={cardContent} />
      <br />
      <Card title={title} style={{ overflowX: "scroll" }}>
        {renderTable()}
      </Card>
      <EditPetugasForm
        ref={editPetugasFormRef} // Menghubungkan ref ke EditPetugasForm
        currentRowData={currentRowData}
        visible={editPetugasModalVisible}
        confirmLoading={editPetugasModalLoading}
        onCancel={() => setEditPetugasModalVisible(false)}
        onOk={handleEditPetugasOk}
      />
      <AddPetugasForm wrappedComponentRef={addPetugasFormRef} visible={addPetugasModalVisible} confirmLoading={addPetugasModalLoading} onCancel={handleClosePetugas} onOk={handleAddPetugasOk} />
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

export default Petugas;
