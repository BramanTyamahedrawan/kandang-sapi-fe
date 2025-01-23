import request from "@/utils/request";
import { v4 as uuidv4 } from "uuid";

export function addJenisHewan(data) {
  // Tambahkan idJenisHewan ke data dengan uuidv4
  const updatedData = {
    ...data,
    idJenisHewan: uuidv4(),
  };

  return request({
    url: "/jenishewan",
    method: "post",
    data: updatedData,
  });
}

export function getJenisHewan() {
  return request({
    url: "/jenishewan",
    method: "get",
  });
}

export function editJenisHewan(data, id) {
  return request({
    url: `/jenishewan/${id}`,
    method: "put",
    data,
  });
}

export function deleteJenisHewan(data) {
  return request({
    url: `/jenishewan/${data.idJenisHewan}`,
    method: "delete",
    data,
  });
}

export function addJenisHewanImport(data) {
  return request({
    url: "/jenishewan",
    method: "post",
    data: data,
  });
}

export function addJenisHewanBulk(data) {
  return request({
    url: "/jenishewan/bulk",
    method: "post",
    data: data,
  });
}
