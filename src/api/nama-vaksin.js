import request from "@/utils/request";
import { v4 as uuidv4 } from "uuid";

export function addNamaVaksin(data) {
  // Tambahkan idNamaVaksin ke data dengan uuidv4
  const updatedData = {
    ...data,
    idNamaVaksin: uuidv4(),
  };

  return request({
    url: "/namavaksin",
    method: "post",
    data: updatedData,
  });
}

export function getNamaVaksin() {
  return request({
    url: "/namavaksin",
    method: "get",
  });
}

export function editNamaVaksin(data, id) {
  const formData = new FormData();
  formData.append("namaVaksin", data.nama);
  formData.append("deskripsi", data.deskripsi);

  return request({
    url: `/namavaksin/${id}`,
    method: "put",
    data: formData,
  });
}

export function deleteNamaVaksin(data) {
  return request({
    url: `/namavaksin/${data.idNamaVaksin}`,
    method: "delete",
    data,
  });
}

export function addNamaVaksinBulk(data) {
  return request({
    url: "/namavaksin/bulk",
    method: "post",
    data: data,
  });
}
