import request from "@/utils/request";
import { v4 as uuidv4 } from "uuid";

export function addPkb(data) {
  const updatedData = {
    ...data,
    idPkb: uuidv4(),
  };

  return request({
    url: "/pkb",
    method: "post",
    data: updatedData,
  });
}

export function getPkb() {
  return request({
    url: "/pkb",
    method: "get",
  });
}

export function getPkbByPeternak(peternakID) {
  return request({
    url: "/pkb",
    method: "get",
    params: { peternakID: peternakID },
  });
}

export function editPkb(data, id) {
  return request({
    url: `/pkb/${id}`,
    method: "put",
    data,
  });
}

export function deletePkb(data) {
  return request({
    url: `/pkb/${data.idPkb}`,
    method: "delete",
    data,
  });
}

export function addPkbImport(data) {
  return request({
    url: "/pkb/import",
    method: "post",
    data,
  });
}
