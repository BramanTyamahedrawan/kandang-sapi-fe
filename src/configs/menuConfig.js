import {
  BuildOutlined,
  CameraOutlined,
  CopyOutlined,
  ExperimentOutlined,
  EyeOutlined,
  FileSearchOutlined,
  HomeOutlined,
  ProjectOutlined,
  TableOutlined,
  TagOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from '@ant-design/icons'

const menuList = [
  {
    title: 'Beranda',
    path: '/dashboard',
    icon: HomeOutlined,
    roles: ['ROLE_ADMINISTRATOR', 'ROLE_PETUGAS', 'ROLE_PETERNAK'],
  },
  // {
  //   title: "Berita",
  //   path: "/berita",
  //   icon: "book",
  //   roles:["ROLE_ADMINISTRATOR"]
  // },
  {
    title: 'Data Petugas',
    path: '/petugas',
    icon: UserOutlined,
    roles: ['ROLE_ADMINISTRATOR'],
  },
  {
    title: 'Data Peternak',
    path: '/peternak',
    icon: UsergroupAddOutlined,
    roles: ['ROLE_ADMINISTRATOR', 'ROLE_PETUGAS'],
  },
  {
    title: 'Jenis Hewan',
    path: '/jenis-hewan',
    icon: EyeOutlined,
    roles: ['ROLE_ADMINISTRATOR', 'ROLE_PETUGAS', 'ROLE_PETERNAK'],
  },
  {
    title: 'Data Kandang',
    path: '/kandang',
    icon: BuildOutlined,
    roles: ['ROLE_ADMINISTRATOR', 'ROLE_PETUGAS', 'ROLE_PETERNAK'],
  },
 
  {
    title: 'Rumpun Hewan',
    path: '/rumpun-hewan',
    icon: EyeOutlined,
    roles: ['ROLE_ADMINISTRATOR', 'ROLE_PETUGAS', 'ROLE_PETERNAK'],
  },
  {
    title: 'Daftar Hewan',
    path: '/hewan',
    icon: TagOutlined,
    roles: ['ROLE_ADMINISTRATOR', 'ROLE_PETUGAS', 'ROLE_PETERNAK'],
  },
  {
    title: 'Daftar Vaksin',
    path: '/vaksin',
    icon: ProjectOutlined,
    roles: ['ROLE_ADMINISTRATOR', 'ROLE_PETUGAS', 'ROLE_PETERNAK'],
  },
  {
    title: 'Inseminasi Buatan',
    path: '/inseminasi-buatan',
    icon: TableOutlined,
    roles: ['ROLE_ADMINISTRATOR', 'ROLE_PETUGAS', 'ROLE_PETERNAK'],
  },
  {
    title: 'Kelahiran',
    path: '/kelahiran',
    icon: FileSearchOutlined,
    roles: ['ROLE_ADMINISTRATOR', 'ROLE_PETUGAS', 'ROLE_PETERNAK'],
  },
  {
    title: 'Pengobatan',
    path: '/pengobatan',
    icon: ExperimentOutlined,
    roles: ['ROLE_ADMINISTRATOR', 'ROLE_PETUGAS'],
  },
  {
    title: 'PKB',
    path: '/pkb',
    icon: CopyOutlined,
    roles: ['ROLE_ADMINISTRATOR', 'ROLE_PETUGAS', 'ROLE_PETERNAK'],
  },
  {
    title: 'Monitoring',
    path: '/monitoring',
    icon: CameraOutlined,
    roles: ['ROLE_ADMINISTRATOR', 'ROLE_PETUGAS', 'ROLE_PETERNAK'],
  },
]
export default menuList
