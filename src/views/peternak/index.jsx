/* eslint-disable no-unused-vars */
import {
  addPeternak,
  // addPeternakImport
  addPeternakImport,
  deletePeternak,
  editPeternak,
  getPeternaks,
} from "@/api/peternak";
import { getPetugas } from "@/api/petugas";
import { addUser, deleteUserByPeternak, addUserBulk, getUserByUsername, reqUserInfo } from "@/api/user";
import kandangSapi from "@/assets/images/kandangsapi.jpg";
import TypingCard from "@/components/TypingCard";
import { DeleteOutlined, DownloadOutlined, EditOutlined, UploadOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Col, Divider, Input, message, Modal, Row, Table, Upload, Space } from "antd";
import moment from "moment";
import React, { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { read, utils } from "xlsx";
import AddPeternakForm from "./forms/add-peternak-form";
import EditPeternakForm from "./forms/edit-peternak-form";
import ViewPeternakForm from "./forms/view-peternak-form";
import { Skeleton } from "antd";
import Highlighter from "react-highlight-words";

const Peternak = () => {
  const [petugas, setPetugas] = useState([]);
  const [peternaks, setPeternaks] = useState([]);
  const [editPeternakModalVisible, setEditPeternakModalVisible] = useState(false);
  const [editPeternakModalLoading, setEditPeternakModalLoading] = useState(false);
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
  const [viewPeternakModalVisible, setViewPeternakModalVisible] = useState(false);
  const [viewRowData, setViewRowData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const searchInput = useRef(null);

  // Fetch peternaks
  const fetchPeternaks = async () => {
    setLoading(true);
    try {
      const result = await getPeternaks();
      const { content, statusCode } = result.data;

      if (statusCode === 200) {
        const filteredPeternaks = content.filter((peternak) => {
          const { petugasId, namaPeternak, nikPeternak, idPeternak, petugasPendaftar, lokasi } = peternak;

          const keyword = searchKeyword.toLowerCase();

          const isNamaPeternakValid = typeof namaPeternak === "string";
          const isNikPeternakValid = typeof nikPeternak === "string";
          const isIdPeternakValid = typeof idPeternak === "string";
          const isPetugasPendaftarValid = typeof petugasPendaftar === "string";
          const isLokasiValid = typeof lokasi === "string";
          const isPetugasIdValid = typeof petugasId === "string";

          return (
            (isNamaPeternakValid && namaPeternak.toLowerCase().includes(keyword)) ||
            (isPetugasIdValid && petugasId.toLowerCase().includes(keyword)) ||
            (isNikPeternakValid && nikPeternak.toLowerCase().includes(keyword)) ||
            (isIdPeternakValid && idPeternak.toLowerCase().includes(keyword)) ||
            (isPetugasPendaftarValid && petugasPendaftar.toLowerCase().includes(keyword)) ||
            (isLokasiValid && lokasi.toLowerCase().includes(keyword))
          );
        });

        setPeternaks(filteredPeternaks);
      }
    } catch (error) {
      console.error("Error fetching peternaks:", error);
      message.error("Gagal mengambil data peternak.");
    } finally {
      setLoading(false);
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

  const handleSearchTable = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

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
    Modal.confirm({
      title: "Konfirmasi",
      content: "Apakah Anda yakin ingin menghapus data ini?",
      okText: "Ya",
      okType: "danger",
      cancelText: "Tidak",
      onOk: async () => {
        const { idPeternak, nikPeternak } = row;
        setLoading(true);
        getUserByUsername(nikPeternak).then((userResponse) => {
          if (userResponse && userResponse.data) {
            const userId = userResponse.data.id;
            try {
              deletePeternak(idPeternak).then((res) => {
                fetchPeternaks();
                deleteUserByPeternak(userId);
                message.success("Berhasil menghapus data peternak");
              });
            } catch (error) {
              console.error("Gagal menghapus peternak:", error);
              message.error("Gagal menghapus peternak.");
            }
          } else {
            deletePeternak(idPeternak).then((res) => {
              fetchPeternaks();
              message.success("Berhasil menghapus data peternak");
            });
          }
        });
        setLoading(false);
        fetchPeternaks();
      },
    });
  };

  // Handle edit peternak OK
  const handleEditPeternakOk = async (values) => {
    setEditPeternakModalLoading(true);
    setLoading(true);
    try {
      await editPeternak(values, currentRowData.idPeternak);
      setEditPeternakModalVisible(false);
      setEditPeternakModalLoading(false);
      message.success("Berhasil diedit!");
      fetchPeternaks();
    } catch (error) {
      console.error("Error editing peternak:", error);
      message.error("Pengeditan gagal, harap coba lagi!");
      setEditPeternakModalLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // Handle add peternak
  const handleAddPeternak = () => {
    setAddPeternakModalVisible(true);
  };

  // Handle add peternak OK
  const handleAddPeternakOk = async (values, form) => {
    setAddPeternakModalLoading(true);
    const idUser = uuidv4();
    const userData = {
      id: idUser,
      nik: values.nikPeternak,
      name: values.namaPeternak,
      username: values.nikPeternak.trim(),
      email: `${values.email}`,
      password: values.nikPeternak,
      alamat: values.alamat,
      role: "3",
      createdAt: new Date().toISOString(),
      photo: kandangSapi, // Assuming you want to set a default photo
    };

    setLoading(true);
    try {
      await addPeternak(values).then(async (response) => {
        await addUser(userData).then((response) => {
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
    } finally {
      setLoading(false);
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
      const jsonData = utils.sheet_to_json(worksheet, {
        header: 1,
        blankrows: false,
        defval: null,
      });

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
  };

  // Convert to JS Date
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

  function parseAddress(address) {
    // Pastikan alamat berupa string, jika tidak kembalikan "alamat tidak valid"
    if (typeof address !== "string" || !address) {
      console.warn(`Alamat tidak valid: ${address}`);
      return "alamat tidak valid";
    }

    // Pecah alamat berdasarkan koma
    const parts = address.split(",").map((part) => part.trim());

    // Ambil masing-masing bagian sesuai urutan, isi dengan "-" jika tidak ada
    // const dusun = parts[4] || "-";
    const desa = parts[3] || "-";
    const kecamatan = parts[2] || "-";
    const kabupaten = parts[1]?.replace(/KAB\. /i, "") || "-"; // Hapus "KAB." jika ada
    const provinsi = parts[0] || "-";

    // Validasi bahwa setidaknya satu bagian selain "-" harus terisi
    const isValid = desa !== "-" || kecamatan !== "-" || kabupaten !== "-" || provinsi !== "-";

    if (!isValid) {
      console.warn(`Alamat tidak valid: ${address}`);
      return "alamat tidak valid";
    }

    // Return dalam bentuk object
    return { desa, kecamatan, kabupaten, provinsi };
  }

  const generateDefaultTanggalLahir = () => {
    const randomDate = new Date(Math.floor(Math.random() * 100) + 1920, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28));
    return randomDate.toISOString().split("T")[0];
  };

  const generateDefaultPhoneNumber = () => {
    const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000); // 10 digit dimulai dengan 8
    return `8${randomNumber.toString().substring(1)}`; // Tambahkan 8 di depan
  };

  // const validateEmail = (email) => {
  //   // Jika email tidak valid (null, undefined, atau bukan string), gunakan default
  //   if (typeof email !== "string" || !email.includes("@")) {
  //     console.warn(
  //       `Email tidak valid: ${email}. Menggunakan email default.`
  //     );
  //     return "default@gmail.com"; // Email default
  //   }
  //   // Jika valid, kembalikan email
  //   return email;
  // };

  // Save imported data
  const saveImportedData = async () => {
    // const { importedData, peternaks } = { importedData, peternaks }; // Destructure from state
    let errorCount = 0;
    const dataPeternakToSaveArray = [];
    const dataUserToSaveArray = [];

    try {
      for (const row of importedData) {
        const generateIdPeternak = uuidv4();
        const pecahAlamat = parseAddress(row[columnMapping["Alamat Pemilik Ternak**)"] || columnMapping["lokasi"]]);

        const validateEmail = (email) => {
          // Jika email tidak valid (null, undefined, atau bukan string), gunakan default
          if (typeof email !== "string" || !email.includes("@")) {
            console.warn(`Email tidak valid: ${email}. Menggunakan email default.`);
            return `${row[columnMapping["Nama Pemilik Ternak**)"] || columnMapping["nama"]]}@gmail.com`; // Email default
          }
          // Jika valid, kembalikan email
          return email;
        };

        const dataToSavePeternak = {
          idPeternak: generateIdPeternak,
          nikPeternak: row[columnMapping["NIK Peternak"]],
          namaPeternak: row[columnMapping["Nama Pemilik Ternak**)"] || columnMapping["nama"]],
          noTelepon: row[columnMapping["No. Telp Pemilik Ternak*)"]] || generateDefaultPhoneNumber(),
          email: validateEmail(row[columnMapping["Email Pemilik Ternak"]]),
          // dusun: pecahAlamat.dusun,
          desa: pecahAlamat.desa,
          kecamatan: pecahAlamat.kecamatan,
          kabupaten: pecahAlamat.kabupaten,
          provinsi: pecahAlamat.provinsi,
          jenisKelamin: row[columnMapping["Jenis Kelamin"]] || "-",
          tanggalLahir: row[columnMapping["Tanggal Lahir Pemilik Ternak"]] || generateDefaultTanggalLahir(),
          lokasi: row[columnMapping["Alamat Pemilik Ternak**)"] || columnMapping["lokasi"]],
          alamat: row[columnMapping["Alamat Pemilik Ternak**)"] || columnMapping["lokasi"]],
          idIsikhnas: row[columnMapping["ID iSIKHNAS"]] || "-",
          latitude: row[columnMapping["latitude"]] || "-",
          longitude: row[columnMapping["longitude"]] || "-",
          namaPetugas: row[columnMapping["Petugas Pendaftar"]] || "-",
          tanggalPendaftaran: row[columnMapping["Tanggal Pendataan"]] || convertToJSDate(row[columnMapping["Tanggal Pendaftaran"]]),
        };

        const role = "3";
        const dataToSaveUser = {
          id: dataToSavePeternak.idPeternak,
          name: dataToSavePeternak.namaPeternak,
          nik: dataToSavePeternak.nikPeternak,
          username: dataToSavePeternak.nikPeternak || dataToSavePeternak.namaPeternak,
          email: `${dataToSavePeternak.email}`,
          password: `${dataToSavePeternak.nikPeternak || dataToSavePeternak.namaPeternak}@123`,
          alamat: dataToSavePeternak.alamat,
          role: role,
          photo: kandangSapi,
        };

        const existingPeternakIndex = peternaks.findIndex((p) => p.idPeternak === dataToSavePeternak.idPeternak);

        dataPeternakToSaveArray.push(dataToSavePeternak);
        dataUserToSaveArray.push(dataToSaveUser);
        console.log("DATA PETERNAK TO SAVE : ", dataPeternakToSaveArray);
        console.log("Data User : ", dataUserToSaveArray);

        setLoading(true);
        try {
          if (existingPeternakIndex > -1) {
            // Update existing data
            await editPeternak(dataToSavePeternak, dataToSavePeternak.idPeternak);
            setPeternaks((prevPeternaks) => {
              const updatedPeternaks = [...prevPeternaks];
              updatedPeternaks[existingPeternakIndex] = dataToSavePeternak;
              return updatedPeternaks;
            });
          } else {
            // Add new data
            await addPeternakImport(dataPeternakToSaveArray);
            await addUserBulk(dataUserToSaveArray);
            setPeternaks((prevPeternaks) => [...prevPeternaks, dataToSavePeternak]);
          }
        } catch (error) {
          errorCount++;
          console.error("Gagal menyimpan data:", error);
        }
      }

      if (errorCount === 0) {
        message.success("Semua data berhasil disimpan.");
        fetchPeternaks();
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
      setFileName("");
      setLoading(false);
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

  const handleDownloadCSV = () => {
    const csvContent = convertHeaderToCSV();
    downloadFormatCSV(csvContent);
  };

  const convertHeaderToCSV = () => {
    const columnTitlesLocal = [
      "No",
      "NIK Peternak",
      "Nama Pemilik Ternak**)",
      "No. Telp Pemilik Ternak*)",
      "Email Pemilik Ternak",
      "Jenis Kelamin",
      "Tanggal Lahir Pemilik Ternak",
      "Alamat Pemilik Ternak**)",
      "ID iSIKHNAS",
      "Lokasi",
      "latitude",
      "longitude",
      "Petugas Pendaftar",
      "Tanggal Pendaftaran",
    ];
    const exampleRow = [
      "1",
      "Contoh 3508070507040006",
      "Contoh Supardi",
      "Contoh 085432678654",
      "Contoh supardi@gmail.com",
      "Contoh Laki Laki",
      "Contoh 5/7/1999",
      "Contoh Kalipepe,Yosowilangun,Lumajang,Jawa Timur",
      "Contoh 666677",
      "Contoh -8.131851, 113.204225",
      "Contoh -8.131851",
      "Contoh 113.204225",
      "Contoh Suparman",
      "Contoh 4/5/2025",
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
  };

  const downloadFormatCSV = (csvContent) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.setAttribute("download", "format_peternak.csv");
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle export
  const handleExportData = () => {
    const csvContent = convertToCSV(peternaks);
    downloadCSV(csvContent);
  };

  // Convert to CSV
  const convertToCSV = (data) => {
    const columnTitles = ["ID Peternak", "Nama Peternak", "NIK Peternak", "Lokasi", "Petugas Pendaftar", "Tanggal Pendaftaran"];

    const rows = [columnTitles];
    data.forEach((item) => {
      const row = [item.idPeternak, item.namaPeternak, item.nikPeternak, item.lokasi, item.petugas ? item.petugas.namaPetugas : "", moment(item.tanggalPendaftaran).format("DD/MM/YYYY")];
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

  const getColumnSearchProps = (dataIndex, nestedPath) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearchTable(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button type="primary" onClick={() => handleSearchTable(selectedKeys, confirm, dataIndex)} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>
            Search
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
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
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />,
    onFilter: (value, record) => {
      if (nestedPath) {
        const nestedValue = nestedPath.split(".").reduce((obj, key) => obj?.[key], record);
        return nestedValue?.toString().toLowerCase().includes(value.toLowerCase());
      }
      return record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase());
    },
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) setTimeout(() => searchInput.current?.select(), 100);
      },
    },
    render: (text) => (searchedColumn === dataIndex ? <Highlighter highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }} searchWords={[searchText]} autoEscape textToHighlight={text?.toString() || ""} /> : text),
  });

  // Render columns with actions
  const renderColumns = () => {
    const actionColumn = {
      title: "Operasi",
      key: "action",
      width: 170,
      align: "center",
      render: (text, row) => (
        <span>
          <Button type="primary" shape="circle" icon={<EditOutlined />} title="Edit" onClick={() => handleEditPeternak(row)} />
          {/* <Divider type="vertical" />
          <Button
            type="primary"
            shape="circle"
            icon={<EyeOutlined />}
            title="View"
            onClick={() => handleViewPeternak(row)}
          /> */}
          <Divider type="vertical" />
          <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} title="Delete" onClick={() => handleDeletePeternak(row)} />
        </span>
      ),
    };

    // Clone columns to prevent mutation
    const clonedColumns = [
      {
        title: "ID Peternak",
        dataIndex: "idPeternak",
        key: "idPeternak",
        ...getColumnSearchProps("idPeternak"),
        sorter: (a, b) => a.idPeternak.localeCompare(b.idPeternak),
      },
      {
        title: "NIK Peternak",
        dataIndex: "nikPeternak",
        key: "nikPeternak",
        ...getColumnSearchProps("nikPeternak"),
        sorter: (a, b) => a.nikPeternak.localeCompare(b.nikPeternak),
      },
      {
        title: "Id Isikhnas",
        dataIndex: "idIsikhnas",
        key: "idIsikhnas",
        ...getColumnSearchProps("idIsikhnas"),
        sorter: (a, b) => a.idIsikhnas.localeCompare(b.idIsikhnas),
      },
      {
        title: "Nama Peternak",
        dataIndex: "namaPeternak",
        key: "namaPeternak",
        ...getColumnSearchProps("namaPeternak"),
        sorter: (a, b) => a.namaPeternak.localeCompare(b.namaPeternak),
      },
      {
        title: "Tanggal Lahir",
        dataIndex: "tanggalLahir",
        key: "tanggalLahir",
        ...getColumnSearchProps("tanggalLahir"),
        sorter: (a, b) => new Date(a.tanggalLahir) - new Date(b.tanggalLahir),
      },
      {
        title: "Jenis Kelamin",
        dataIndex: "jenisKelamin",
        key: "jenisKelamin",
        ...getColumnSearchProps("jenisKelamin"),
        sorter: (a, b) => a.jenisKelamin.localeCompare(b.jenisKelamin),
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        ...getColumnSearchProps("email"),
        sorter: (a, b) => a.email.localeCompare(b.email),
      },
      {
        title: "No Telepon",
        dataIndex: "noTelepon",
        key: "noTelepon",
        ...getColumnSearchProps("noTelepon"),
        sorter: (a, b) => a.noTelepon.localeCompare(b.noTelepon),
      },
      {
        title: "Alamat",
        dataIndex: "alamat",
        key: "alamat",
        ...getColumnSearchProps("alamat"),
        sorter: (a, b) => a.alamat.localeCompare(b.alamat),
      },
      {
        title: "Lokasi",
        dataIndex: "lokasi",
        key: "lokasi",
        ...getColumnSearchProps("lokasi"),
        sorter: (a, b) => a.lokasi.localeCompare(b.lokasi),
      },
      {
        title: "Petugas Pendaftar",
        dataIndex: ["petugas", "namaPetugas"],
        key: "namaPetugas",
        ...getColumnSearchProps("namaPetugas", "petugas.namaPetugas"),
        sorter: (a, b) => a.petugas.namaPetugas.localeCompare(b.petugas.namaPetugas),
      },
    ];

    if (user && (user.role === "ROLE_ADMINISTRATOR" || user.role === "ROLE_PETUGAS")) {
      clonedColumns.push(actionColumn);
    }

    return clonedColumns;
  };

  // Render table
  const renderTable = () => {
    if (user && user.role === "ROLE_PETERNAK") {
      return <Table dataSource={peternaks} bordered columns={renderColumns()} rowKey="idPeternak" />;
    } else if (user && (user.role === "ROLE_ADMINISTRATOR" || user.role === "ROLE_PETUGAS")) {
      return <Table dataSource={peternaks} bordered columns={renderColumns()} rowKey="idPeternak" />;
    } else {
      return null;
    }
  };

  // Render buttons
  const renderButtons = () => {
    if (user && (user.role === "ROLE_ADMINISTRATOR" || user.role === "ROLE_PETUGAS")) {
      return (
        <Row gutter={[16, 16]} justify="start" style={{ paddingLeft: 9 }}>
          <Col>
            <Button type="primary" onClick={handleAddPeternak} style={{ width: 200 }}>
              Tambah Peternak
            </Button>
          </Col>
          <Col>
            <Button icon={<UploadOutlined />} onClick={handleImportModalOpen} style={{ width: 200 }}>
              Import File
            </Button>
          </Col>
          <Col>
            <Button icon={<DownloadOutlined />} onClick={handleDownloadCSV} style={{ width: 200 }}>
              Download Format CSV
            </Button>
          </Col>
          <Col>
            <Button icon={<UploadOutlined />} onClick={handleExportData} style={{ width: 200 }}>
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

  const cardContent = `Di sini, Anda dapat mengelola daftar peternak di sistem.`;

  return (
    <div className="app-container">
      <TypingCard title="Manajemen Peternak" source={cardContent} />
      <br />
      <Card>{title}</Card>
      {loading ? (
        <Card>
          <Skeleton active paragraph={{ rows: 10 }} />
        </Card>
      ) : (
        <Card style={{ overflowX: "scroll" }}>{renderTable()}</Card>
      )}
      {/* Edit Peternak Modal */}
      <EditPeternakForm currentRowData={currentRowData} visible={editPeternakModalVisible} confirmLoading={editPeternakModalLoading} onCancel={() => setEditPeternakModalVisible(false)} onOk={handleEditPeternakOk} />
      {/* Add Peternak Modal */}
      <AddPeternakForm visible={addPeternakModalVisible} confirmLoading={addPeternakModalLoading} onCancel={() => setAddPeternakModalVisible(false)} onOk={handleAddPeternakOk} />
      {/* View Peternak Modal */}
      <ViewPeternakForm visible={viewPeternakModalVisible} onCancel={() => setViewPeternakModalVisible(false)} rowData={viewRowData} />
      {/* Import Modal */}

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
        <Upload beforeUpload={handleFileImport} accept=".xlsx, .xls, .csv">
          <Button icon={<UploadOutlined />}>Pilih File</Button>
        </Upload>
        {/* {fileName && (
          <div style={{ marginTop: 10 }}>
            <strong>File Terpilih:</strong> {fileName}
          </div>
        )} */}
      </Modal>
    </div>
  );
};

export default Peternak;
