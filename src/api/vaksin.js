import request from "@/utils/request";

import { v4 as uuidv4 } from "uuid";

export function addVaksin(data) {
  const updatedData = {
    ...data,
    idVaksin: uuidv4(),
  };

  console.log("data", updatedData);

  return request({
    url: "/vaksin",
    method: "post",
    data: updatedData,
  });
}

export function getVaksins() {
  return request({
    url: "/vaksin",
    method: "get",
  });
}

export function getVaksinByPeternak(peternakID) {
  return request({
    url: "/vaksin",
    method: "get",
    params: { peternakID: peternakID },
  });
}

export function editVaksin(data, id) {
  return request({
    url: `/vaksin/${id}`,
    method: "put",
    data,
  });
}

export function deleteVaksin(data) {
  return request({
    url: `/vaksin/${data.idVaksin}`,
    method: "delete",
    data,
  });
}

export function addVaksinImport(data) {
  return request({
    url: "/vaksin/import",
    method: "post",
    data,
  });
}

export function addVaksinBulk(data) {
  return request({
    url: "/vaksin/bulk",
    method: "post",
    data,
  });
}
