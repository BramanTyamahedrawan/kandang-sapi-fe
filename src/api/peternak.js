import request from '@/utils/request'
import { v4 as uuidv4 } from 'uuid'

/**
 * Tambah peternak baru
 * @param {Object} data - Data peternak
 * @returns {Promise} - Axios response
 */
export function addPeternak(data) {
  const updatedData = {
    ...data,
    idPeternak: uuidv4(),
  }

  console.log('Data yang dikirim ke backend:', updatedData)

  return request.post('/peternak', updatedData)
}

/**
 * Ambil semua peternak
 * @returns {Promise} - Axios response
 */
export function getPeternaks() {
  return request.get('/peternak')
}

/**
 * Edit peternak
 * @param {Object} data - Data peternak yang diupdate
 * @param {string} id - ID peternak
 * @returns {Promise} - Axios response
 */
export function editPeternak(data, id) {
  return request.put(`/peternak/${id}`, data)
}

/**
 * Hapus peternak
 * @param {string} idPeternak - ID peternak yang akan dihapus
 * @returns {Promise} - Axios response
 */
export function deletePeternak(idPeternak) {
  return request.delete(`/peternak/${idPeternak}`)
}

/**
 * Ambil peternak berdasarkan ID
 * @param {string} id - ID peternak
 * @returns {Promise} - Axios response
 */
export const getPeternakById = (id) => {
  return request.get(`/peternak/${id}`)
}

/**
 * Tambah peternak secara massal
 * @param {Array} data - Array data peternak
 * @returns {Promise} - Axios response
 */
export function addPeternakBulk(data) {
  return request.post('/peternak/bulk', data)
}
