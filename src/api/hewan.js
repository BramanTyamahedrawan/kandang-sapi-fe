import request from "@/utils/request";
import { v4 as uuidv4 } from "uuid";

export function addHewan(data) {
  const generatedId = uuidv4();

  const fileList = data.file;
  const file =
    fileList && fileList.length > 0 ? fileList[0].originFileObj : null;

  // Fungsi untuk menghitung umur dalam bulan
  function hitungUmurDalamBulan(tanggalLahir) {
    const lahir = new Date(tanggalLahir);
    const sekarang = new Date();

    // Menghitung selisih tahun dan bulan
    let tahun = sekarang.getFullYear() - lahir.getFullYear();
    let bulan = sekarang.getMonth() - lahir.getMonth();

    // Jika bulan negatif, kurangi satu tahun dan tambahkan 12 bulan
    if (bulan < 0) {
      tahun--;
      bulan += 12;
    }

    // Menghitung total bulan
    return tahun * 12 + bulan;
  }

  const umurDalamBulan = hitungUmurDalamBulan(data.tanggalLahir);

  // Buat objek FormData untuk mengirim file
  const formData = new FormData();
  formData.append("idHewan", generatedId.trim());
  formData.append("kodeEartagNasional", data.kodeEartagNasional);
  formData.append("idIsikhnasTernak", data.idIsikhnasTernak);
  formData.append("petugas_id", data.petugas_id);
  formData.append("peternak_id", data.peternak_id);
  formData.append("kandang_id", data.kandang_id);
  formData.append("jenisHewanId", data.jenisHewanId);
  formData.append("rumpunHewanId", data.rumpunHewanId);
  formData.append("latitude", data.latitude);
  formData.append("longitude", data.longitude);
  formData.append("sex", data.sex);
  formData.append("umur", umurDalamBulan + " Bulan");
  formData.append("identifikasiHewan", data.identifikasiHewan);
  formData.append("tanggalLahir", data.tanggalLahir);
  formData.append("tempatLahir", data.tempatLahir);
  formData.append("tujuanPemeliharaan", data.tujuanPemeliharaan);
  formData.append("tanggalTerdaftar", new Date().toLocaleDateString("id-ID"));

  if (file) {
    formData.append("file", file);
  }

  return request({
    url: "/hewan",
    method: "post",
    data: formData, // Mengirim FormData dengan file
  });
}

export function addHewanWithoutFile(data) {
  // Buat objek FormData untuk mengirim file
  const formData = new FormData();
  formData.append("kodeEartagNasional", data.kodeEartagNasional);
  formData.append("noKartuTernak", data.noKartuTernak);
  formData.append("provinsi", data.provinsi);
  formData.append("kabupaten", data.kabupaten);
  formData.append("kecamatan", data.kecamatan);
  formData.append("desa", data.desa);
  formData.append("alamat", data.alamat);
  formData.append("latitude", data.latitude);
  formData.append("longitude", data.longitude);
  formData.append("peternak_id", data.peternak_id);
  formData.append("kandang_id", data.kandang_id);
  formData.append("sex", data.sex);
  formData.append("umur", data.umur);
  formData.append("identifikasiHewan", data.identifikasiHewan);
  formData.append("petugas_id", data.petugas_id);
  formData.append("tanggalTerdaftar", data.tanggalTerdaftar);

  return request({
    url: "/hewan",
    method: "post",
    data: formData,
  });
}

export function getHewans() {
  return request({
    url: "/hewan",
    method: "get",
  });
}

export function getHewanByPeternak(peternakID) {
  return request({
    url: "/hewan",
    method: "get",
    params: {
      peternakID: peternakID,
    },
  });
}

export function editHewan(data, id) {
  const formData = new FormData();
  formData.append("kodeEartagNasional", data.kodeEartagNasional);
  formData.append("noKartuTernak", data.noKartuTernak);
  formData.append("provinsi", data.provinsi);
  formData.append("kabupaten", data.kabupaten);
  formData.append("kecamatan", data.kecamatan);
  formData.append("desa", data.desa);
  formData.append("alamat", data.alamat);
  formData.append("latitude", data.latitude);
  formData.append("longitude", data.longitude);
  formData.append("peternak_id", data.peternak_id);
  formData.append("kandang_id", data.kandang_id);
  formData.append("sex", data.sex);
  formData.append("umur", data.umur);
  formData.append("identifikasiHewan", data.identifikasiHewan);
  formData.append("petugas_id", data.petugas_id);
  formData.append("tanggalTerdaftar", data.tanggalTerdaftar);
  formData.append("file", data.file.file);

  return request({
    url: `/hewan/${id}`,
    method: "put",
    data: formData,
  });
}

export function deleteHewan(data) {
  return request({
    url: `/hewan/${data.idHewan}`,
    method: "delete",
    data,
  });
}

export function addHewanImport(data) {
  return request({
    url: "/hewan/import",
    method: "post",
    data: data, // Mengirim FormData dengan file
  });
}

export function addHewanBulkImport(data) {
  return request({
    url: "/hewan/bulkNama",
    method: "post",
    data: data, // Mengirim FormData dengan file
  });
}

export function addTernakBulk(data) {
  return request({
    url: "/hewan/bulk",
    method: "post",
    data: data, // Mengirim FormData dengan file
  });
}
