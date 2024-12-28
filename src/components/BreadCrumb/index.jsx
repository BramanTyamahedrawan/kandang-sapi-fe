/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { useMemo } from 'react'
import { Breadcrumb } from 'antd'
import { useLocation } from 'react-router-dom'
import menuList from '@/configs/menuConfig'
import './index.less'

const getPath = (menuList, pathname) => {
  const tempPath = []

  const findPath = (node) => {
    tempPath.push(node)
    if (node.path === pathname) {
      throw new Error('Path Found')
    }
    if (node.children && node.children.length > 0) {
      for (let i = 0; i < node.children.length; i++) {
        findPath(node.children[i])
      }
    }
    tempPath.pop()
  }

  try {
    menuList.forEach(findPath)
  } catch (e) {
    return tempPath
  }

  return []
}

const BreadCrumb = () => {
  const location = useLocation()
  const { pathname } = location

  const breadcrumbItems = useMemo(() => {
    const path = getPath(menuList, pathname)
    const first = path?.[0]
    if (first && first.title.trim() !== 'Beranda') {
      path.unshift({ title: 'Beranda', path: '/dashboard' })
    }
    return path.map((item) => ({
      key: item.path,
      title:
        item.title === 'Beranda' ? (
          <a href={`#${item.path}`}>{item.title}</a>
        ) : (
          item.title
        ),
    }))
  }, [pathname])

  return (
    <div className="Breadcrumb-container">
      <Breadcrumb items={breadcrumbItems} />
    </div>
  )
}

export default BreadCrumb
