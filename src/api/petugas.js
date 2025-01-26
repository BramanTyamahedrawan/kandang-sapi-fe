import request from "@/utils/request";

export function addPetugas(data) {
  return request({
    url: "/petugas",
    method: "post",
    data,
  });
}

export function getPetugas() {
  return request({
    url: "/petugas",
    method: "get",
  });
}

export function editPetugas(data, petugasId) {
  console.log(data, petugasId);

  return request({
    url: `/petugas/${petugasId}`,
    method: "put",
    data,
  });
}

export function deletePetugas(data) {
  console.log("Data Id ", data.petugasId);

  return request({
    url: `/petugas/${data.petugasId}`,
    method: "delete",
    data,
  });
}

export function addPetugasBulk(data) {
  return request({
    url: "/petugas/bulk",
    method: "post",
    data,
  });
}

export function addPetugasBulkByNama(data) {
  return request({
    url: "/petugas/bulkNama",
    method: "post",
    data,
  });
}
