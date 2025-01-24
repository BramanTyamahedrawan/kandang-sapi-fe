/** @format */

import { DownloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { Component } from "react";
// Handle Export Data Header Only
const handleExportHeaderOnly = () => {
  const csvContent = convertHeaderToCSV();
  downloadCSV(csvContent);
};

// Convert Header to CSV (only column titles)
const convertHeaderToCSV = () => {
  const columnTitles = [
    "Nama Petugas Pendataan*)",
    "NIK Petugas Pendataan*)",
    "No. Telp Petugas Pendataan*)",
    "Email Petugas Pendataan",
    "NIK Petugas Vaksinasi*)",
    "No. Telp Petugas Vaksinasi*)",
    "Email Petugas Vaksinasi",
    "Nama Pemilik Ternak**)",
    "NIK Pemilik Ternak**)",
    "Jenis Kelamin Pemilik Ternak",
    "Tanggal Lahir Pemilik Ternak",
    "Alamat Pemilik Ternak**)",
    "latitude",
    "longitude",
    "No Telp. Pemilik Ternak**)",
    "Email Pemilik Ternak",
    "ID isikhnas Pemilik**)",
    "Alamat Kandang**)",
    "No. Eartag***)",
    "ID isikhnas Ternak**)",
    "Jenis Ternak**)",
    "Tujuan Pemeliharaan Ternak**)",
    "Rumpun Ternak",
    "Jenis Kelamin**)",
    "Tanggal Lahir Ternak**)",
    "Tempat Lahir Ternak",
    "Tanggal Vaksin**)",
    "Jenis Vaksin**)",
    "Nama Vaksin**)",
    "Batch Vaksin**)",
    "Vaksin ke-**)",
    "Tanggal Pendataan",
  ];

  const rows = [columnTitles];

  let csvContent = "data:text/csv;charset=utf-8,";

  rows.forEach((rowArray) => {
    const row = rowArray.join(";"); // Use ';' as delimiter (adjust if needed)
    csvContent += row + "\r\n";
  });

  return csvContent;
};

const downloadCSV = (csvContent) => {
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "Format_Import_All.csv");
  document.body.appendChild(link); // Required for Firefox
  link.click();
  document.body.removeChild(link); // Clean up
};

export default class DownloadFormatCsv extends Component {
  render() {
    return (
      <div>
        <Button onClick={handleExportHeaderOnly} icon={<DownloadOutlined />}>
          Download Format CSV
        </Button>
      </div>
    );
  }
}
