import request from "@/utils/request";
import { v4 as uuidv4 } from "uuid";

export function addTujuanPemeliharaan(data) {
  // Tambahkan idTujuanPemeliharaan ke data dengan uuidv4
  const updatedData = {
    ...data,
    idTujuanPemeliharaan: uuidv4(),
  };

  return request({
    url: "/tujuanpemeliharaan",
    method: "post",
    data: updatedData,
  });
}

export function getTujuanPemeliharaan() {
  return request({
    url: "/tujuanpemeliharaan",
    method: "get",
  });
}

export function editTujuanPemeliharaan(data, id) {
  const formData = new FormData();
  formData.append("tujuanPemeliharaan", data.tujuan);
  formData.append("deskripsi", data.deskripsi);

  return request({
    url: `/tujuanpemeliharaan/${id}`,
    method: "put",
    data: formData,
  });
}

export function deleteTujuanPemeliharaan(data) {
  return request({
    url: `/tujuanpemeliharaan/${data.idTujuanPemeliharaan}`,
    method: "delete",
    data,
  });
}

export function addTujuanPemeliharaanBulk(data) {
  return request({
    url: "/tujuanpemeliharaan/bulk",
    method: "post",
    data: data,
  });
}
