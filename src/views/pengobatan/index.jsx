/* eslint-disable no-constant-condition */
/* eslint-disable no-unused-vars */
import { Component } from "react";
import { Card, Button, Table, message, Row, Col, Divider, Modal, Upload, Input } from "antd";
import { getPengobatan, deletePengobatan, editPengobatan, addPengobatan, addPengobatanImport } from "@/api/pengobatan";
import { getPetugas } from "@/api/petugas";
import { read, utils } from "xlsx";
import { UploadOutlined, EditOutlined, DeleteOutlined, DownloadOutlined } from "@ant-design/icons";
import AddPengobatanForm from "./forms/add-pengobatan-form";
import EditPengobatanForm from "./forms/edit-pengobatan-form";
import TypingCard from "@/components/TypingCard";
import { reqUserInfo } from "../../api/user";
import { v4 as uuidv4 } from "uuid";

export const sendPengobatanImport = async (data, batchSize = 7000) => {
  const totalBatches = Math.ceil(data.length / batchSize);

  for (let i = 0; i < totalBatches; i++) {
    const batchData = data.slice(i * batchSize, (i + 1) * batchSize);

    try {
      console.log(`Data Pengobatan (Batch ${i + 1}):`, batchData); // Log data yang dikirim
      const response = await addPengobatanImport(batchData);
      console.log(`Batch ${i + 1}/${totalBatches} berhasil dikirim`, response.data);
    } catch (error) {
      console.error(`Batch ${i + 1}/${totalBatches} gagal dikirim`, error.response?.data || error.message);
      throw error; // Hentikan proses jika batch gagal
    }
  }
};

function parseLocation(lokasi) {
  // Pastikan lokasi berupa string, jika tidak kembalikan "lokasi tidak valid"
  if (typeof lokasi !== "string" || !lokasi) {
    console.warn(`Alamat tidak valid: ${lokasi}`);
    return "alamat tidak valid";
  }

  // Pecah alamat berdasarkan koma
  const parts = lokasi.split(",").map((part) => part.trim());

  // Ambil masing-masing bagian sesuai urutan, isi dengan "-" jika tidak ada
  const provinsi = parts[0] || "-";
  const kabupaten = parts[1]?.replace(/KAB\. /i, "") || "-"; // Hapus "KAB." jika ada
  const kecamatan = parts[2] || "-";
  const desa = parts[3] || "-";

  // Validasi bahwa setidaknya satu bagian selain "-" harus terisi
  const isValid = desa !== "-" || kecamatan !== "-" || kabupaten !== "-" || provinsi !== "-";

  if (!isValid) {
    console.warn(`Lokasi tidak valid: ${lokasi}`);
    return "lokasi tidak valid";
  }

  // Return dalam bentuk object
  return { provinsi, kabupaten, kecamatan, desa };
}

class Pengobatan extends Component {
  state = {
    pengobatan: [],
    editPengobatanModalVisible: false,
    editPengobatanModalLoading: false,
    currentRowData: {},
    addPengobatanModalVisible: false,
    addPengobatanModalLoading: false,
    importModalVisible: false,
    importedData: [],
    columnTitles: [],
    fileName: "",
    uploading: false,
    columnMapping: {},
    searchKeyword: "",
    user: null,
  };

  // Fungsi ambil data dari database
  getPengobatan = async () => {
    const result = await getPengobatan();
    console.log(result);
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      const filteredPengobatan = content.filter((pengobatan) => {
        const { idKasus, tanggalPengobatan, tanggalKasus, namaPetugas, namaInfrastruktur, lokasi, dosis, sindrom, diagnosaBanding } = pengobatan;
        const keyword = this.state.searchKeyword.toLowerCase();

        const isIdKasusValid = typeof idKasus === "string";
        const isTanggalPengobatanValid = typeof tanggalPengobatan === "string";
        const isTanggalKasusValid = typeof tanggalKasus === "string";
        const isNamaPetugasValid = typeof namaPetugas === "string";
        const isNamaInfrastrukturValid = typeof namaInfrastruktur === "string";
        const isLokasiValid = typeof lokasi === "string";
        const isDosisValid = typeof dosis === "string";
        const isSindromValid = typeof sindrom === "string";
        const isDiagnosaBandingValid = typeof diagnosaBanding === "string";

        return (
          (isIdKasusValid && idKasus.toLowerCase().includes(keyword)) ||
          (isTanggalPengobatanValid && tanggalPengobatan.toLowerCase().includes(keyword)) ||
          (isTanggalKasusValid && tanggalKasus.toLowerCase().includes(keyword)) ||
          (isNamaPetugasValid && namaPetugas.toLowerCase().includes(keyword)) ||
          (isNamaInfrastrukturValid && namaInfrastruktur.toLowerCase().includes(keyword)) ||
          (isLokasiValid && lokasi.toLowerCase().includes(keyword)) ||
          (isDosisValid && dosis.toLowerCase().includes(keyword)) ||
          (isSindromValid && sindrom.toLowerCase().includes(keyword)) ||
          (isDiagnosaBandingValid && diagnosaBanding.toLowerCase().includes(keyword))
        );
      });

      this.setState({
        pengobatan: filteredPengobatan,
      });
    }
  };

  getPetugas = async () => {
    const result = await getPetugas();
    const { content, statusCode } = result.data;

    if (statusCode === 200) {
      this.setState({
        petugas: content,
      });
    }
  };

  handleSearch = (keyword) => {
    this.setState(
      {
        searchKeyword: keyword,
      },
      () => {
        this.getPengobatan();
      }
    );
  };

  // Fungsi Import File Csv
  handleImportModalOpen = () => {
    this.setState({ importModalVisible: true });
  };

  handleImportModalClose = () => {
    this.setState({ importModalVisible: false });
  };

  handleFileImport = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = read(data, { type: "array" });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet, { header: 1 });

      const importedData = jsonData.slice(1); // Exclude the first row (column titles)

      const columnTitles = jsonData[0]; // Assume the first row contains column titles

      // Get the file name from the imported file
      const fileName = file.name.toLowerCase();

      this.setState({
        importedData,
        columnTitles,
        fileName, // Set the fileName in the state
      });

      // Create column mapping
      const columnMapping = {};
      columnTitles.forEach((title, index) => {
        columnMapping[title] = index;
      });
      this.setState({ columnMapping });
    };
    reader.readAsArrayBuffer(file);
  };

  handleUpload = () => {
    const { importedData, columnMapping } = this.state;

    if (importedData.length === 0) {
      message.error("No data to import.");
      return;
    }

    this.setState({ uploading: true });

    this.saveImportedData(columnMapping)
      .then(() => {
        this.setState({
          uploading: false,
          importModalVisible: false,
        });
      })
      .catch((error) => {
        console.error("Gagal mengunggah data:", error);
        this.setState({ uploading: false });
        message.error("Gagal mengunggah data, harap coba lagi.");
      });
  };

  convertToJSDate(input) {
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
  }

  saveImportedData = async (columnMapping) => {
    const { importedData } = this.state;
    let errorCount = 0;

    try {
      const uniqueData = new Map();

      const pengobatan = [];

      for (const row of importedData) {
        const generateIdKasus = uuidv4();

        const formatDateToString = (dateString) => {
          // Jika dateString adalah angka (seperti nilai dari Excel)
          if (!isNaN(dateString)) {
            // Excel menganggap angka tersebut sebagai jumlah hari sejak 01/01/1900
            // Konversi angka menjadi milidetik
            const excelEpoch = new Date(1900, 0, 1).getTime(); // 1 Januari 1900
            const milliseconds = dateString * 86400000; // 86400000 ms dalam 1 hari
            const date = new Date(excelEpoch + milliseconds);

            // Format tanggal dan waktu menjadi string
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0"); // Bulan dimulai dari 0
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            const seconds = String(date.getSeconds()).padStart(2, "0");

            return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
          }

          // Jika dateString adalah string yang valid dengan format DD/MM/YYYY atau DD/MM/YYYY HH:mm:ss
          if (typeof dateString === "string" && dateString.includes(" ")) {
            const [datePart, timePart] = dateString.split(" ");
            const [day, month, year] = datePart.split("/");

            return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")} ${timePart}`;
          } else if (typeof dateString === "string") {
            const [day, month, year] = dateString.split("/");
            return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
          }

          // Jika format tidak dikenali
          return "Invalid Date";
        };

        const validateEmail = (email) => {
          // Jika email tidak valid (null, undefined, atau bukan string), gunakan default
          if (typeof email !== "string" || !email.includes("@")) {
            console.warn(`Email tidak valid: ${email}. Menggunakan email default.`);
            return "default@gmail.com"; // Email default
          }
          // Jika valid, kembalikan email
          return email;
        };

        const pecahLokasi = parseLocation(row[columnMapping["Lokasi"]] || row[columnMapping["Alamat"]] || "-");
        // const setEmail =;

        console.log("Row Data:", row);

        // data vaksin
        const dataPengobatan = {
          idKasus: row[columnMapping["ID Kasus"]] || generateIdKasus,
          tanggalPengobatan: formatDateToString(row[columnMapping["tanggal_pengobatan"]] || "-"),
          tanggalKasus: formatDateToString(row[columnMapping["tanggal_kasus"]]) || "-",
          namaInfrastruktur: row[columnMapping["Nama Infrasruktur"]] || "-",
          lokasi: row[columnMapping["Lokasi"]] || "-",
          provinsiPengobatan: pecahLokasi.provinsi,
          kabupatenPengobatan: pecahLokasi.kabupaten,
          kecamatanPengobatan: pecahLokasi.kecamatan,
          desaPengobatan: pecahLokasi.desa,
          dosis: row[columnMapping["Dosis"]] || "-",
          sindrom: row[columnMapping["Tanda/Sindrom"]] || "-",
          diagnosaBanding: row[columnMapping["Diagnosa Banding"]] || "-",
          namaPetugas: row[columnMapping["Petugas"]] || "-",
        };

        console.log("Data Pengobatan:", dataPengobatan);

        pengobatan.push(dataPengobatan);
      }

      // Send bulk data to server
      try {
        await sendPengobatanImport(pengobatan);
      } catch (error) {
        console.error("Gagal menyimpan data secara bulk:", error, error.response?.data);
      }

      if (errorCount === 0) {
        message.success(`Semua data berhasil disimpan.`);
      } else {
        message.error(`${errorCount} data gagal disimpan karena duplikasi data!`);
      }
    } catch (error) {
      console.error("Gagal memproses data:", error);
    } finally {
      this.setState({
        importedData: [],
        columnTitles: [],
        columnMapping: {},
      });
    }
  };

  // saveImportedData = async (columnMapping) => {
  //   const { importedData, pengobatan, petugas } = this.state
  //   let errorCount = 0

  //   try {
  //     for (const row of importedData) {
  //       const petugasNama = row[columnMapping['Petugas']].toLowerCase()
  //       const petugasData = petugas.find(
  //         (p) => p.namaPetugas.toLowerCase() === petugasNama
  //       )
  //       const petugasId = petugasData ? petugasData.nikPetugas : null
  //       console.log(
  //         `Mencocokkan nama petugas: ${petugasNama}, Ditemukan: ${
  //           petugasData ? 'Ya' : 'Tidak'
  //         }, petugasId: ${petugasId}`
  //       )
  //       const dataToSave = {
  //         idKasus: row[columnMapping['ID Kasus']],
  //         tanggalPengobatan: this.convertToJSDate(
  //           row[columnMapping['tanggal_pengobatan']]
  //         ),
  //         tanggalKasus: this.convertToJSDate(
  //           row[columnMapping['tanggal_kasus']]
  //         ),
  //         namaInfrastruktur: row[columnMapping['Nama Infrasruktur']],
  //         lokasi: row[columnMapping['Lokasi']],
  //         dosis: row[columnMapping['Dosis']],
  //         sindrom: row[columnMapping['Tanda/Sindrom']],
  //         diagnosaBanding: row[columnMapping['Diagnosa Banding']],
  //       }

  //       const existingPengobatanIndex = pengobatan.findIndex(
  //         (p) => p.idKasus === dataToSave.idKasus
  //       )

  //       try {
  //         if (existingPengobatanIndex > -1) {
  //           // Update existing data
  //           await editPengobatan(dataToSave, dataToSave.idKasus)
  //           this.setState((prevState) => {
  //             const updatedPengobatan = [...prevState.pengobatan]
  //             updatedPengobatan[existingPengobatanIndex] = dataToSave
  //             return { pengobatan: updatedPengobatan }
  //           })
  //         } else {
  //           // Add new data
  //           await addPengobatan(dataToSave)
  //           this.setState((prevState) => ({
  //             pengobatan: [...prevState.pengobatan, dataToSave],
  //           }))
  //         }
  //       } catch (error) {
  //         errorCount++
  //         console.error('Gagal menyimpan data:', error)
  //       }
  //     }

  //     if (errorCount === 0) {
  //       message.success(`Semua data berhasil disimpan.`)
  //     } else {
  //       message.error(`${errorCount} data gagal disimpan, harap coba lagi!`)
  //     }
  //   } catch (error) {
  //     console.error('Gagal memproses data:', error)
  //   } finally {
  //     this.setState({
  //       importedData: [],
  //       columnTitles: [],
  //       columnMapping: {},
  //     })
  //   }
  // }

  // Fungsi Edit Pengobatan
  handleEditPengobatan = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editPengobatanModalVisible: true,
    });
  };

  handleEditPengobatanOk = (_) => {
    const { form } = this.editPengobatanFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ editModalLoading: true });
      editPengobatan(values, values.idKasus)
        .then((response) => {
          form.resetFields();
          this.setState({
            editPengobatanModalVisible: false,
            editPengobatanModalLoading: false,
          });
          message.success("Berhasil diedit!");
          this.getPengobatan();
        })
        .catch((e) => {
          message.success("Pengeditan gagal, harap coba lagi!");
        });
    });
  };

  handleDeletePengobatan = (row) => {
    const { idKasus } = row;
    Modal.confirm({
      title: "Konfirmasi",
      content: "Apakah Anda yakin ingin menghapus data ini?",
      okText: "Ya",
      okType: "danger",
      cancelText: "Tidak",
      onOk: () => {
        deletePengobatan({ idKasus }).then((res) => {
          message.success("Berhasil dihapus");
          this.getPengobatan();
        });
      },
    });
  };

  handleCancel = (_) => {
    this.setState({
      editPengobatanModalVisible: false,
      addPengobatanModalVisible: false,
    });
  };

  // Fungsi Tambahkan Pengobatan
  handleAddPengobatan = (row) => {
    this.setState({
      addPengobatanModalVisible: true,
    });
  };

  handleAddPengobatanOk = (_) => {
    const { form } = this.addPengobatanFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({ addPengobatanModalLoading: true });
      addPengobatan(values)
        .then((response) => {
          form.resetFields();
          this.setState({
            addPengobatanModalVisible: false,
            addPengobatanModalLoading: false,
          });
          message.success("Berhasil menambahkan!");
          this.getPengobatan();
        })
        .catch((e) => {
          message.success("Gagal menambahkan, harap coba lagi!");
        });
    });
  };

  componentDidMount() {
    this.getPetugas();
    this.getPengobatan();

    reqUserInfo()
      .then((response) => {
        this.setState({ user: response.data });
      })
      .catch((error) => {
        console.error("Terjadi kesalahan saat mengambil data user:", error);
      });
  }

  handleDownloadCSV = () => {
    const csvContent = convertHeaderToCSV();
    downloadFormatCSV(csvContent);
  };

  convertHeaderToCSV = () => {
    const columnTitlesLocal = ["tanggal_pengobatan", "tanggal_kasus", "ID Kasus", "Petugas", "Nama Infrasruktur", "Lokasi", "Dosis", "Tanda/Sindrom", "Diagnosa Banding"];
    const rows = [columnTitlesLocal];
    let csvContent = "data:text/csv;charset=utf-8,";
    rows.forEach((rowArray) => {
      const row = rowArray.join(";");
      csvContent += row + "\r\n";
    });

    return csvContent;
  };

  downloadFormatCSV = (csvContent) => {
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "format_pengobatan.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fungsi Export dari database ke file csv
  handleExportData = () => {
    const { pengobatan } = this.state;
    const csvContent = this.convertToCSV(pengobatan);
    this.downloadCSV(csvContent);
  };

  convertToCSV = (data) => {
    const columnTitles = ["Tanggal Pengobatan", "Tanggal Kasus", "ID Kasus", "Petugas", "Nama Infrastruktur", "Lokasi", "Dosis", "Tanda atau Sindrom", "Diagnosa Banding"];

    const rows = [columnTitles];
    data.forEach((item) => {
      const row = [item.tanggalPengobatan, item.tanggalKasus, item.idKasus, item.namaPetugas, item.namaInfrastruktur, item.lokasi, item.dosis, item.sindrom, item.diagnosaBanding];
      rows.push(row);
    });

    let csvContent = "data:text/csv;charset=utf-8,";

    rows.forEach((rowArray) => {
      const row = rowArray.join(";");
      csvContent += row + "\r\n";
    });

    return csvContent;
  };

  downloadCSV = (csvContent) => {
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Pengobatan.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
  };

  render() {
    const { pengobatan, importModalVisible, searchKeyword, user } = this.state;
    const columns = [
      { title: "ID Kasus", dataIndex: "idKasus", key: "idKasus" },
      {
        title: "Tanggal Pengobatan",
        dataIndex: "tanggalPengobatan",
        key: "tanggalPengobatan",
      },
      {
        title: "Tanggal Kasus",
        dataIndex: "tanggalKasus",
        key: "tanggalKasus",
      },
      {
        title: "Nama Infrastruktur",
        dataIndex: "namaInfrastruktur",
        key: "namaInfrastruktur",
      },
      { title: "Lokasi", dataIndex: "lokasi", key: "lokasi" },
      { title: "Dosis", dataIndex: "dosis", key: "dosis" },
      { title: "Tanda atau Sindrom", dataIndex: "sindrom", key: "sindrom" },
      {
        title: "Diagnosa Banding",
        dataIndex: "diagnosaBanding",
        key: "diagnosaBanding",
      },
      {
        title: "Petugas",
        dataIndex: ["petugas", "namaPetugas"],
        key: "namaPetugas",
      },
    ];

    const renderTable = () => {
      if (user && user.role === "ROLE_PETERNAK") {
        return <Table dataSource={pengobatan} bordered columns={columns} />;
      } else if ((user && user.role === "ROLE_ADMINISTRATOR") || "ROLE_PETUGAS") {
        return <Table dataSource={pengobatan} bordered columns={columns && renderColumns()} />;
      } else {
        return null;
      }
    };

    const renderButtons = () => {
      if (user && (user.role === "ROLE_ADMINISTRATOR" || user.role === "ROLE_PETUGAS")) {
        return (
          <Row gutter={[16, 16]} justify="start" style={{ paddingLeft: 9 }}>
            <Col>
              <Button type="primary" onClick={this.handleAddPengobatan} block>
                Tambah Pengobatan
              </Button>
            </Col>
            <Col>
              <Button icon={<UploadOutlined />} onClick={this.handleImportModalOpen} block>
                Import File
              </Button>
            </Col>
            <Col>
              <Button icon={<DownloadOutlined />} onClick={this.handleDownloadCSV} block>
                Download Format CSV
              </Button>
            </Col>
            <Col>
              <Button icon={<UploadOutlined />} onClick={this.handleExportData} block>
                Export Data To CSV
              </Button>
            </Col>
          </Row>
        );
      } else {
        return null;
      }
    };

    const renderColumns = () => {
      if ((user && user.role === "ROLE_ADMINISTRATOR") || "ROLE_PETUGAS") {
        columns.push({
          title: "Operasi",
          key: "action",
          width: 120,
          align: "center",
          render: (text, row) => (
            <span>
              <Button type="primary" shape="circle" icon={<EditOutlined />} title="Edit" onClick={() => this.handleEditPengobatan(row)} />
              <Divider type="vertical" />
              <Button type="primary" shape="circle" icon={<DeleteOutlined />} title="Delete" onClick={() => this.handleDeletePengobatan(row)} />
            </span>
          ),
        });
      }
      return columns;
    };

    const title = (
      <Row gutter={[16, 16]} justify="start">
        {renderButtons()}
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <Input placeholder="Cari data" value={searchKeyword} onChange={(e) => this.handleSearch(e.target.value)} style={{ width: 235, marginLeft: 10 }} />
        </Col>
      </Row>
    );

    const { role } = user ? user.role : "";
    console.log("peran pengguna:", role);
    const cardContent = `Di sini, Anda dapat mengelola daftar pengobatan di sistem.`;
    return (
      <div className="app-container">
        <TypingCard title="Manajemen Data Pengobatan" source={cardContent} />
        <br />
        <Card title={title} style={{ overflowX: "scroll" }}>
          {renderTable()}
        </Card>
        <EditPengobatanForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={(formRef) => (this.editPengobatanFormRef = formRef)}
          visible={this.state.editPengobatanModalVisible}
          confirmLoading={this.state.editPengobatanModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditPengobatanOk}
        />
        <AddPengobatanForm
          wrappedComponentRef={(formRef) => (this.addPengobatanFormRef = formRef)}
          visible={this.state.addPengobatanModalVisible}
          confirmLoading={this.state.addPengobatanModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddPengobatanOk}
        />
        <Modal
          title="Import File"
          visible={importModalVisible}
          onCancel={this.handleImportModalClose}
          footer={[
            <Button key="cancel" onClick={this.handleImportModalClose}>
              Cancel
            </Button>,
            <Button key="upload" type="primary" loading={this.state.uploading} onClick={this.handleUpload}>
              Upload
            </Button>,
          ]}
        >
          <Upload beforeUpload={this.handleFileImport}>
            <Button icon={<UploadOutlined />}>Pilih File</Button>
          </Upload>
        </Modal>
      </div>
    );
  }
}

export default Pengobatan;
