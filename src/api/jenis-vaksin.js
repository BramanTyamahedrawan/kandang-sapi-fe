import request from "@/utils/request";
import { v4 as uuidv4 } from "uuid";

export function addJenisVaksin(data) {
  // Tambahkan idJenisVaksin ke data dengan uuidv4
  const updatedData = {
    ...data,
    idJenisVaksin: uuidv4(),
  };

  return request({
    url: "/jenisvaksin",
    method: "post",
    data: updatedData,
  });
}

export function getJenisVaksin() {
  return request({
    url: "/jenisvaksin",
    method: "get",
  });
}

export function editJenisVaksin(data, id) {
  return request({
    url: `/jenisvaksin/${id}`,
    method: "put",
    data,
  });
}

export function deleteJenisVaksin(data) {
  return request({
    url: `/jenisvaksin/${data.idJenisVaksin}`,
    method: "delete",
    data,
  });
}

export function addJenisVaksinBulk(data) {
  return request({
    url: "/jenisvaksin/bulk",
    method: "post",
    data: data,
  });
}
