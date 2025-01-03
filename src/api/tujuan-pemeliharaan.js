import request from "@/utils/request";

// export function addJenisHewan(data) {
//   // Tambahkan idJenisHewan ke data dengan uuidv4
//   const updatedData = {
//     ...data,
//     idJenisHewan: uuidv4(),
//   };

//   return request({
//     url: "/jenishewan",
//     method: "post",
//     data: updatedData,
//   });
// }

export function getTujuanPemeliharaan() {
  return request({
    url: "/tujuanpemeliharaan",
    method: "get",
  });
}

// export function editJenisHewan(data, id) {
//   const formData = new FormData();
//   formData.append("jenis", data.jenis);
//   formData.append("deskripsi", data.deskripsi);

//   return request({
//     url: `/jenishewan/${id}`,
//     method: "put",
//     data: formData,
//   });
// }

// export function deleteJenisHewan(data) {
//   return request({
//     url: `/jenishewan/${data.idJenisHewan}`,
//     method: "delete",
//     data,
//   });
// }

// export function addJenisHewanImport(data) {
//   return request({
//     url: "/jenishewan",
//     method: "post",
//     data: data,
//   });
// }

export function addTujuanPemeliharaanBulk(data) {
  return request({
    url: "/tujuanpemeliharaan/bulk",
    method: "post",
    data: data,
  });
}
