import {
  BuildOutlined,
  ExperimentOutlined,
  HomeOutlined,
  AimOutlined,
  AppstoreOutlined,
  ClusterOutlined,
  TagsOutlined,
  MedicineBoxOutlined,
  UnorderedListOutlined,
  DeploymentUnitOutlined,
  AuditOutlined,
  SolutionOutlined,
  CameraOutlined,
  TeamOutlined,
  IdcardOutlined,
  UsergroupAddOutlined,
  BarcodeOutlined,
  ProjectOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import { color } from "echarts";
import { icon } from "leaflet";

const menuList = [
  {
    title: "Beranda",
    path: "/dashboard",
    icon: HomeOutlined,
    roles: ["ROLE_ADMINISTRATOR", "ROLE_PETUGAS", "ROLE_PETERNAK"],
  },
  // {
  //   title: "Berita",
  //   path: "/berita",
  //   icon: "book",
  //   roles:["ROLE_ADMINISTRATOR"]
  // },
  {
    title: "Master Data",
    icon: ProjectOutlined,
    children: [
      {
        title: "Data Petugas",
        path: "/petugas",
        icon: IdcardOutlined,
        roles: ["ROLE_ADMINISTRATOR"],
      },
      {
        title: "Data Peternak",
        path: "/peternak",
        icon: TeamOutlined,
        roles: ["ROLE_ADMINISTRATOR", "ROLE_PETUGAS"],
      },
      {
        title: "Jenis Hewan",
        path: "/jenis-hewan",
        icon: AppstoreOutlined,
        roles: ["ROLE_ADMINISTRATOR", "ROLE_PETUGAS", "ROLE_PETERNAK"],
      },
      {
        title: "Data Kandang",
        path: "/kandang",
        icon: BuildOutlined,
        roles: ["ROLE_ADMINISTRATOR", "ROLE_PETUGAS", "ROLE_PETERNAK"],
      },
      {
        title: "Rumpun Hewan",
        path: "/rumpun-hewan",
        icon: ClusterOutlined,
        roles: ["ROLE_ADMINISTRATOR", "ROLE_PETUGAS", "ROLE_PETERNAK"],
      },
      {
        title: "Tujuan Ternak",
        path: "/tujuan-pemeliharaan",
        icon: AimOutlined,
        roles: ["ROLE_ADMINISTRATOR", "ROLE_PETUGAS", "ROLE_PETERNAK"],
      },
      {
        title: "Daftar Hewan",
        path: "/hewan",
        icon: TagsOutlined,
        roles: ["ROLE_ADMINISTRATOR", "ROLE_PETUGAS", "ROLE_PETERNAK"],
      },
    ],
  },
  {
    title: "Master Vaksin",
    icon: DatabaseOutlined,
    children: [
      {
        title: "Jenis Vaksin",
        path: "/jenis-vaksin",
        icon: MedicineBoxOutlined,
        roles: ["ROLE_ADMINISTRATOR", "ROLE_PETUGAS", "ROLE_PETERNAK"],
      },
      {
        title: "Nama Vaksin",
        path: "/nama-vaksin",
        icon: BarcodeOutlined,
        roles: ["ROLE_ADMINISTRATOR", "ROLE_PETUGAS", "ROLE_PETERNAK"],
      },
      {
        title: "Daftar Vaksin",
        path: "/vaksin",
        icon: UnorderedListOutlined,
        roles: ["ROLE_ADMINISTRATOR", "ROLE_PETUGAS", "ROLE_PETERNAK"],
      },
    ],
  },

  {
    title: "Inseminasi Buatan",
    path: "/inseminasi-buatan",
    icon: DeploymentUnitOutlined,
    roles: ["ROLE_ADMINISTRATOR", "ROLE_PETUGAS", "ROLE_PETERNAK"],
  },
  {
    title: "Kelahiran",
    path: "/kelahiran",
    icon: AuditOutlined,
    roles: ["ROLE_ADMINISTRATOR", "ROLE_PETUGAS", "ROLE_PETERNAK"],
  },
  {
    title: "Pengobatan",
    path: "/pengobatan",
    icon: ExperimentOutlined,
    roles: ["ROLE_ADMINISTRATOR", "ROLE_PETUGAS"],
  },
  {
    title: "PKB",
    path: "/pkb",
    icon: SolutionOutlined,
    roles: ["ROLE_ADMINISTRATOR", "ROLE_PETUGAS", "ROLE_PETERNAK"],
  },
  {
    title: "Monitoring",
    path: "/monitoring",
    icon: CameraOutlined,
    roles: ["ROLE_ADMINISTRATOR", "ROLE_PETUGAS", "ROLE_PETERNAK"],
  },
  {
    title: "Management User",
    path: "/users",
    icon: UsergroupAddOutlined,
    roles: ["ROLE_ADMINISTRATOR"],
  },
];
export default menuList;
