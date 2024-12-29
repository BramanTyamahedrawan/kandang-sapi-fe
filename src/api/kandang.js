import request from "@/utils/request";
import { v4 as uuidv4 } from "uuid";

/**
 * Tambah Kandang dengan File
 * @param {Object} data - Data kandang
 * @returns {Promise} - Axios response
 */
export function addKandang(data) {
  const generatedId = uuidv4();

  const fileList = data.file;
  const file =
    fileList && fileList.length > 0 ? fileList[0].originFileObj : null;

  const formData = new FormData();
  formData.append("idKandang", generatedId.trim());
  formData.append("peternak_id", data.peternak_id.trim());
  formData.append("luas", data.luas);
  formData.append("jenisHewanId", data.jenis_id.trim());
  formData.append("jenisKandang", data.jenisKandang);
  formData.append("namaKandang", data.namaKandang);
  formData.append("kapasitas", data.kapasitas);
  formData.append("nilaiBangunan", data.nilaiBangunan);
  formData.append("alamat", data.alamat.trim());
  formData.append("latitude", data.latitude);
  formData.append("longitude", data.longitude);

  if (file) {
    formData.append("file", file);
  }

  return request.post("/kandang", formData);
}

/**
 * Tambah Kandang tanpa File
 * @param {Object} data - Data kandang
 * @returns {Promise} - Axios response
 */
export function addKandangWithoutFile(data) {
  const generatedId = uuidv4();

  const payload = {
    idKandang: generatedId.trim(),
    peternak_id: data.peternak_id.trim(),
    luas: data.luas,
    jenis_id: data.jenisHewan.trim(), // Pastikan 'jenisHewan' adalah field yang benar
    kapasitas: data.kapasitas,
    nilaiBangunan: data.nilaiBangunan,
    alamat: data.alamat.trim(),
    latitude: data.latitude,
    longitude: data.longitude,
  };

  return request.post("/kandang", payload);
}

/**
 * Edit Kandang
 * @param {Object} data - Data kandang yang diubah
 * @param {string} id - ID kandang yang akan diubah
 * @returns {Promise} - Axios response
 */
export function editKandang(data, id) {
  const formData = new FormData();
  formData.append("idKandang", data.idKandang.trim());
  formData.append("peternak_id", data.peternak_id.trim());
  formData.append("luas", data.luas);
  formData.append("jenis_id", data.jenis_id.trim());
  formData.append("kapasitas", data.kapasitas);
  formData.append("nilaiBangunan", data.nilaiBangunan);
  formData.append("alamat", data.alamat.trim());
  formData.append("latitude", data.latitude);
  formData.append("longitude", data.longitude);

  if (data.file) {
    formData.append("file", data.file);
  }

  return request.put(`/kandang/${id.trim()}`, formData);
}

/**
 * Ambil Semua Kandang
 * @returns {Promise} - Axios response
 */
export function getKandang() {
  return request.get("/kandang");
}

/**
 * Ambil Kandang Berdasarkan Peternak ID
 * @param {string} peternakID - ID peternak
 * @returns {Promise} - Axios response
 */
export function getKandangByPeternak(peternakID) {
  return request.get("/kandang", {
    params: {
      peternakID: peternakID.trim(),
    },
  });
}

/**
 * Hapus Kandang
 * @param {string} idKandang - ID kandang yang akan dihapus
 * @returns {Promise} - Axios response
 */
export function deleteKandang(idKandang) {
  return request.delete(`/kandang/${idKandang}`);
}

/**
 * Tambah Kandang secara Bulk (Import)
 * @param {Array} data - Array data kandang
 * @returns {Promise} - Axios response
 */
export function addKandangBulk(data) {
  return request.post("/kandang/bulk", data);
}
