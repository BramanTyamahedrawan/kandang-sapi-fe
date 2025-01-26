import request from "@/utils/request";
import { v4 as uuidv4 } from "uuid";

export function addPengobatan(data) {
  const updatedData = {
    ...data,
    idPengobatan: uuidv4(),
  };

  console.log("data yang dikirim", updatedData);
  return request({
    url: "/pengobatan",
    method: "post",
    data: updatedData,
  });
}

export function getPengobatan() {
  return request({
    url: "/pengobatan",
    method: "get",
  });
}

export function editPengobatan(data, id) {
  return request({
    url: `/pengobatan/${id}`,
    method: "put",
    data,
  });
}

export function deletePengobatan(data) {
  return request({
    url: `/pengobatan/${data.idPengobatan}`,
    method: "delete",
    data,
  });
}

export function addPengobatanImport(data) {
  return request({
    url: "/pengobatan/import",
    method: "post",
    data,
  });
}
