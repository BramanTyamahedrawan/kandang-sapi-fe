/* eslint-disable no-unused-vars */
import { addUser, deleteUser, editUser, getUsers } from "@/api/user";
import TypingCard from "@/components/TypingCard";
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
  Upload
} from "antd";
import React, { useEffect, useRef, useState } from "react";
// import EditPetugasForm from './forms/edit-petugas-form'
// import AddPetugasForm from './forms/add-petugas-form'
import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { read, utils } from "xlsx";
import { reqUserInfo } from "../../api/user";

const User = () => {
  const [users, setUsers] = useState([]);
  const [editUserModalVisible, setEditUserModalVisible] = useState(false);
  const [editUserModalLoading, setEditUserModalLoading] = useState(false);
  const [currentRowData, setCurrentRowData] = useState({});
  const [addUserModalVisible, setAddUserModalVisible] = useState(false);
  const [addUserModalLoading, setAddUserModalLoading] = useState(false);
  const [importedData, setImportedData] = useState([]);
  const [columnTitles, setColumnTitles] = useState([]);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [columnMapping, setColumnMapping] = useState({});
  const [searchKeyword, setSearchKeyword] = useState("");
  const [user, setUser] = useState(null);

  const editUserFormRef = useRef(null);
  const addUserFormRef = useRef(null);

  useEffect(() => {
    getUserData();
    reqUserInfo()
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Terjadi kesalahan saat mengambil data user:", error);
      });
  }, []);

  const getUserData = async () => {
    try {
      const result = await getUsers();
      console.log(result);
      const { content, statusCode } = result.data;
      if (statusCode === 200) {
        const filteredUser = content.filter((userItem) => {
          const { nik, name, username, email, alamat } = userItem;
          const keyword = searchKeyword.toLowerCase();
          const isNikValid = typeof nik === "string";
          const isNameValid = typeof name === "string";
          const isEmailValid = typeof email === "string";
          const isUsernameValid = typeof username === "string";
          const isAlamatValid = typeof alamat === "string";

          return (
            (isNikValid && nik.toLowerCase().includes(keyword)) ||
            (isNameValid && name.toLowerCase().includes(keyword)) ||
            (isEmailValid && email.toLowerCase().includes(keyword)) ||
            (isUsernameValid && username.toLowerCase().includes(keyword)) ||
            (isAlamatValid && alamat.toLowerCase().includes(keyword))
          );
        });

        setUsers(filteredUser);
      }
    } catch (error) {
      console.error("Gagal mengambil data users:", error);
      message.error("Gagal mengambil data users.");
    }
  };

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
    // Debounce atau delay jika diperlukan
    getUserData();
  };

  const handleAddUser = () => {
    setAddUserModalVisible(true);
  };

  const handleCloseUser = () => {
    setAddUserModalVisible(false);
  };

  const handleAddUserOk = (values, form) => {
    setAddUserModalLoading(true);
    addUser(values)
      .then((response) => {
        setAddUserModalVisible(false);
        setAddUserModalLoading(false);
        message.success("Berhasil menambahkan!");
        getUserData();
        form.resetFields();
      })
      .catch((e) => {
        setAddUserModalLoading(false);
        message.error("Gagal menambahkan, harap coba lagi!");
      });
  };

  const handleEditUser = (row) => {
    setCurrentRowData({ ...row });
    setEditUserModalVisible(true);
  };

  const handleDeleteUser = (row) => {
    const { id } = row;
    Modal.confirm({
      title: "Konfirmasi",
      content: "Apakah Anda yakin ingin menghapus data ini?",
      okText: "Ya",
      okType: "danger",
      cancelText: "Tidak",
      onOk: () => {
        deleteUser({ id })
          .then((res) => {
            message.success("Berhasil dihapus");
            getUserData();
          })
          .catch((error) => {
            console.error("Gagal menghapus user:", error);
            message.error("Gagal menghapus user.");
          });
      },
    });
  };

  const handleEditUserOk = () => {
    const form = editUserFormRef.current;
    if (form) {
      form
        .validateFields()
        .then((values) => {
          setEditUserModalLoading(true);
          editUser(values, values.nikUser)
            .then((response) => {
              form.resetFields();
              setEditUserModalVisible(false);
              setEditUserModalLoading(false);
              message.success("Berhasil diedit!");
              getUserData();
            })
            .catch((e) => {
              setEditUserModalLoading(false);
              message.error("Pengeditan gagal, harap coba lagi!");
            });
        })
        .catch((err) => {
          console.error("Validasi form gagal:", err);
        });
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
      const jsonData = utils.sheet_to_json(worksheet, { header: 1 });
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
    return false; // Prevent automatic upload
  };

//   const handleUpload = () => {
//     if (importedData.length === 0) {
//       message.error("No data to import.");
//       return;
//     }

//     setUploading(true);

//     saveImportedData(columnMapping)
//       .then(() => {
//         setUploading(false);
//         setImportModalVisible(false);
//       })
//       .catch((error) => {
//         console.error("Gagal mengunggah data:", error);
//         setUploading(false);
//         message.error("Gagal mengunggah data, harap coba lagi.");
//       });
//   };

  //   const saveImportedData = async (columnMappingLocal) => {
  //     let errorCount = 0

  //     try {
  //       for (const row of importedData) {
  //         const dataToSave = {
  //           nikPetugas: row[columnMappingLocal['NIK Petugas Pendataan*)']],
  //           namaPetugas: row[columnMappingLocal['Nama Petugas Pendataan*)']],
  //           noTelp: row[columnMappingLocal['No. Telp Petugas Pendataan*)']],
  //           email: row[columnMappingLocal['Email Petugas Pendataan']],
  //         }

  //         // Check if data already exists
  //         const existingPetugasIndex = petugas.findIndex(
  //           (p) => p.nikPetugas === dataToSave.nikPetugas
  //         )

  //         try {
  //           if (existingPetugasIndex > -1) {
  //             // Update existing data
  //             await editPetugas(dataToSave, dataToSave.nikPetugas)
  //             setPetugas((prevPetugas) => {
  //               const updatedPetugas = [...prevPetugas]
  //               updatedPetugas[existingPetugasIndex] = dataToSave
  //               return updatedPetugas
  //             })
  //           } else {
  //             // Add new data
  //             await addPetugas(dataToSave)
  //             setPetugas((prevPetugas) => [...prevPetugas, dataToSave])
  //           }
  //         } catch (error) {
  //           errorCount++
  //           console.error('Gagal menyimpan data:', error)
  //         }
  //       }

  //       if (errorCount === 0) {
  //         message.success(`Semua data berhasil disimpan.`)
  //       } else {
  //         message.error(`${errorCount} data gagal disimpan, harap coba lagi!`)
  //       }
  //     } catch (error) {
  //       console.error('Gagal memproses data:', error)
  //       message.error('Gagal memproses data, harap coba lagi.')
  //     } finally {
  //       setImportedData([])
  //       setColumnTitles([])
  //       setColumnMapping({})
  //     }
  //   }

  //   const handleExportData = () => {
  //     const csvContent = convertToCSV(petugas)
  //     downloadCSV(csvContent)
  //   }

  //   const convertToCSV = (data) => {
  //     const columnTitlesLocal = [
  //       'NIK Petugas',
  //       'Nama Petugas',
  //       'No. Telp Petugas',
  //       'Email Petugas',
  //     ]

  //     const rows = [columnTitlesLocal]
  //     data.forEach((item) => {
  //       const row = [item.nikPetugas, item.namaPetugas, item.noTelp, item.email]
  //       rows.push(row)
  //     })

  //     const csvContent = rows.map((row) => row.join(',')).join('\n')
  //     return csvContent
  //   }

  //   const downloadCSV = (csvContent) => {
  //     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  //     const link = document.createElement('a')
  //     const url = URL.createObjectURL(blob)

  //     link.href = url
  //     link.setAttribute('download', 'petugas.csv')
  //     link.style.display = 'none'
  //     document.body.appendChild(link)
  //     link.click()
  //     document.body.removeChild(link)
  //   }

  const setRole = (role) =>{
    let setRoleName = ""
    if(role == "1"){
        setRoleName = "ROLE_ADMINISTRATOR";
    }else if(role == "2"){
        setRoleName = "ROLE_PETUGAS"
    }else if(role == "3"){
        setRoleName = "ROLE_PETERNAK";
    }else {
        setRoleName = "Role Tidak Ditemukan"
    }
    return setRoleName;
  }


  const renderColumns = () => {
    const baseColumns = [
      { title: "Id User", dataIndex: "id", key: "id" },
      { title: "Nik User", dataIndex: "nik", key: "nik" },
      { title: "Nama User", dataIndex: "name", key: "name" },
      {
        title: "Email User",
        dataIndex: "email",
        key: "email",
      },
      { title: "Alamat User", dataIndex: "alamat", key: "alamat" },
      { title: "Username", dataIndex: "username", key: "username" },
      { title: "Role", dataIndex: "role", key: "role",
        render: (text, record) => {
        return setRole(record.role); // Menampilkan role yang telah di-parse dengan setRole
    }},
    ];

    if (user && user.role === "ROLE_ADMINISTRATOR") {
      baseColumns.push({
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
              onClick={() => handleEditUser(row)}
            />
            <Divider type="vertical" />
            <Button
              danger
              type="primary"
              shape="circle"
              icon={<DeleteOutlined />}
              title="Delete"
              onClick={() => handleDeleteUser(row)}
            />
          </span>
        ),
      });
    }

    return baseColumns;
  };

    const renderTable = () => {
       if (user && user.role === 'ROLE_ADMINISTRATOR') {
        return (
          <Table
            dataSource={users}
            bordered
            columns={renderColumns()}
            rowKey="nikPetugas"
          />
        )
      } else {
        return null
      }
    }

  const renderButtons = () => {
    if (user && user.role === "ROLE_ADMINISTRATOR") {
      return (
        <Row gutter={[16, 16]} justify="start" style={{ paddingLeft: 9 }}>
          <Col>
            <Button type="primary" onClick={handleAddUser} block>
              Tambah User
            </Button>
          </Col>
          <Col>
            <Button
              icon={<UploadOutlined />}
              onClick={handleImportModalOpen}
              block
            >
              Import File User Petugas
            </Button>
          </Col>
          <Col>
            <Button
              icon={<UploadOutlined />}
              onClick={handleImportModalOpen}
              block
            >
              Import File User Peternak
            </Button>
          </Col>
          {/* <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <Button icon={<UploadOutlined />} onClick={handleExportData} block>
              Export File
            </Button>
          </Col> */}
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

  const cardContent = `Di sini, Anda dapat mengelola daftar user di sistem.`;

  return (
    <div className="app-container">
      <TypingCard title="Manajemen Data User" source={cardContent} />
      <br />
      <Card title={title} style={{ overflowX: "scroll" }}>
        {renderTable()}
      </Card>
      {/* <EditUserForm
        currentRowData={currentRowData}
        wrappedComponentRef={editUserFormRef}
        visible={editUserModalVisible}
        confirmLoading={editUserModalLoading}
        onCancel={() => setEditUserModalVisible(false)}
        onOk={handleEditUserOk}
      />
      <AddUserForm
        wrappedComponentRef={addUserFormRef}
        visible={addUserModalVisible}
        confirmLoading={addUserModalLoading}
        onCancel={handleCloseUser}
        onOk={handleAddUserOk}
      /> */}
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
            // onClick={handleUpload}
          >
            Upload
          </Button>,
        ]}
      >
        <Upload beforeUpload={handleFileImport} showUploadList={false}>
          <Button icon={<UploadOutlined />}>Pilih File</Button>
        </Upload>
      </Modal>
    </div>
  );
};

export default User;
