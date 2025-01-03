import React from 'react'

// Dynamic imports using React.lazy
const Dashboard = React.lazy(() => import('@/views/dashboard'))
const Petugas = React.lazy(() => import('@/views/petugas'))
const Peternak = React.lazy(() => import('@/views/peternak'))
const Datakandang = React.lazy(() => import('@/views/kandang'))
const Hewan = React.lazy(() => import('@/views/hewan'))
const Vaksin = React.lazy(() => import('@/views/vaksin'))
const InseminasiBuatan = React.lazy(() => import('@/views/inseminasi-buatan'))
const Kelahiran = React.lazy(() => import('@/views/kelahiran'))
const Pengobatan = React.lazy(() => import('@/views/pengobatan'))
const PKB = React.lazy(() => import('@/views/pkb'))
const Monitoring = React.lazy(() => import('@/views/monitoring'))
const JenisHewan = React.lazy(() => import('@/views/jenis-hewan'))
const RumpunHewan = React.lazy(() => import('@/views/rumpun-hewan'))
const TujuanPemeliharaan = React.lazy(() => import('@/views/tujuan-pemeliharaan'))

export default [
  {
    path: '/dashboard',
    component: Dashboard,
    roles: ['ROLE_ADMINISTRATOR', 'ROLE_PETUGAS', 'ROLE_PETERNAK'],
  },
  {
    path: '/petugas',
    component: Petugas,
    roles: ['ROLE_ADMINISTRATOR'],
  },
  {
    path: '/peternak',
    component: Peternak,
    roles: ['ROLE_ADMINISTRATOR', 'ROLE_PETUGAS'],
  },
  {
    path: '/tujuan-pemeliharaan',
    component: TujuanPemeliharaan,
    roles: ['ROLE_ADMINISTRATOR', 'ROLE_PETUGAS','ROLE_PETERNAK'],
  },
  {
    path: '/kandang',
    component: Datakandang,
    roles: ['ROLE_ADMINISTRATOR', 'ROLE_PETUGAS', 'ROLE_PETERNAK'],
  },
  {
    path: '/hewan',
    component: Hewan,
    roles: ['ROLE_ADMINISTRATOR', 'ROLE_PETUGAS', 'ROLE_PETERNAK'],
  },
  {
    path: '/vaksin',
    component: Vaksin,
    roles: ['ROLE_ADMINISTRATOR', 'ROLE_PETUGAS', 'ROLE_PETERNAK'],
  },
  {
    path: '/inseminasi-buatan',
    component: InseminasiBuatan,
    roles: ['ROLE_ADMINISTRATOR', 'ROLE_PETUGAS', 'ROLE_PETERNAK'],
  },
  {
    path: '/kelahiran',
    component: Kelahiran,
    roles: ['ROLE_ADMINISTRATOR', 'ROLE_PETUGAS', 'ROLE_PETERNAK'],
  },
  {
    path: '/pengobatan',
    component: Pengobatan,
    roles: ['ROLE_ADMINISTRATOR', 'ROLE_PETUGAS'],
  },
  {
    path: '/pkb',
    component: PKB,
    roles: ['ROLE_ADMINISTRATOR', 'ROLE_PETUGAS', 'ROLE_PETERNAK'],
  },
  {
    path: '/monitoring',
    component: Monitoring,
    roles: ['ROLE_ADMINISTRATOR', 'ROLE_PETUGAS', 'ROLE_PETERNAK'],
  },
  {
    path: '/jenis-hewan',
    component: JenisHewan,
    roles: ['ROLE_ADMINISTRATOR', 'ROLE_PETUGAS', 'ROLE_PETERNAK'],
  },
  {
    path: '/rumpun-hewan',
    component: RumpunHewan,
    roles: ['ROLE_ADMINISTRATOR', 'ROLE_PETUGAS', 'ROLE_PETERNAK'],
  },
]
