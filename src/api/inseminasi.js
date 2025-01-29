import request from "@/utils/request";
import { v4 as uuidv4 } from "uuid";

export function addInseminasi(data) {
  const updatedData = {
    ...data,
    idInseminasi: uuidv4(),
  };

  return request({
    url: "/inseminasi",
    method: "post",
    data: updatedData,
  });
}

export function getInseminasis() {
  return request({
    url: "/inseminasi",
    method: "get",
  });
}

export function getInseminasiByPeternak(peternakID) {
  return request({
    url: "/inseminasi",
    method: "get",
    params: { peternakID: peternakID },
  });
}

export function editInseminasi(data, id) {
  return request({
    url: `/inseminasi/${id}`,
    method: "put",
    data,
  });
}

export function deleteInseminasi(data) {
  return request({
    url: `/inseminasi/${data.idInseminasi}`,
    method: "delete",
    data,
  });
}

export function addInseminasiImport(data) {
  return request({
    url: "/inseminasi/import",
    method: "post",
    data,
  });
}

export function addInseminsasiBulk(data) {
  return request({
    url: "/inseminasi/bulk",
    method: "post",
    data,
  });
}
