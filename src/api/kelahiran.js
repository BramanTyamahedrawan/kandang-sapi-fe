import request from "@/utils/request";
import { v4 as uuidv4 } from "uuid";

export function addKelahiran(data) {
  const updatedData = {
    ...data,
    idKelahiran: uuidv4(),
  };

  return request({
    url: "/kelahiran",
    method: "post",
    data: updatedData,
  });
}

export function getKelahiran() {
  return request({
    url: "/kelahiran",
    method: "get",
  });
}

export function getKelahiranByPeternak(peternakID) {
  return request({
    url: "/kelahiran",
    method: "get",
    params: { peternakID: peternakID },
  });
}

export function editKelahiran(data, id) {
  return request({
    url: `/kelahiran/${id}`,
    method: "put",
    data,
  });
}

export function deleteKelahiran(data) {
  return request({
    url: `/kelahiran/${data.idKelahiran}`,
    method: "delete",
    data,
  });
}

export function addKelahiranBulk(data) {
  return request({
    url: "/kelahiran/bulk",
    method: "post",
    data,
  });
}
