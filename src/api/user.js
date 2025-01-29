// src/api/user.js

import request from "@/utils/request";
import { v4 } from "uuid";
/**
 * Permintaan informasi user saat ini.
 * GET /user/me
 * @returns {Promise} - Axios response promise
 */
export function reqUserInfo() {
  return request.get("/user/me");
}

/**
 * Ambil daftar semua user.
 * GET /user/list
 * @returns {Promise} - Axios response promise
 */
export function getUsers() {
  return request.get("/users");
}

/**
 * Ambil user berdasarkan username.
 * GET /user/{username}
 * @param {string} username - Username dari user yang ingin diambil.
 * @returns {Promise} - Axios response promise
 */
export function getUserByUsername(username) {
  return request.get(`/user/${username}`);
}

/**
 * Hapus user berdasarkan ID.
 * DELETE /user/{id}
 * @param {string} id - ID dari user yang ingin dihapus.
 * @returns {Promise} - Axios response promise
 */
export function deleteUser(data) {
  return request.delete(`/user/${data.id}`);
}

export function deleteUserByPetugas(id) {
  console.log("User Id Api ", id);

  return request.delete(`/user/${id}`);
}
export function deleteUserByPeternak(id) {
  return request.delete(`/user/${id}`);
}

/**
 * Edit user.
 * POST /user/edit
 * @param {Object} data - Data user yang akan diupdate.
 * @returns {Promise} - Axios response promise
 */
export function editUser(data) {
  return request.put(`/user/edit/${data.id}`, data);
}

/**
 * Validasi User ID.
 * POST /user/validatUserID
 * @param {Object} data - Data yang diperlukan untuk validasi User ID.
 * @returns {Promise} - Axios response promise
 */
export function reqValidatUserID(data) {
  return request.post("/user/validatUserID", data);
}

/**
 * Tambah user baru.
 * POST /user/add
 * @param {Object} data - Data user yang akan ditambahkan.
 * @returns {Promise} - Axios response promise
 */
export function addUser(data) {
  const updateData = {
    ...data,
    id: v4(),
  };
  return request.post("/users", updateData);
}

export function addUserBulk(data) {
  console.log("Data samapi diapi ", data);

  return request.post("/users/bulk", data);
}

/**
 * Register user baru.
 * POST /auth/signup
 * @param {Object} data - Data registrasi user.
 * @returns {Promise} - Axios response promise
 */
export function register(data) {
  return request.post("/auth/signup", data);
}

export function validatePassword(data) {
  return request.post("/user/validate-password", data);
}
