/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from 'react'
import { Menu } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { Scrollbars } from 'react-custom-scrollbars'
import { useSelector, useDispatch } from 'react-redux'
import { addTag } from '@/store/actions'
import { getMenuItemInMenuListByProperty } from '@/utils'
import menuList from '@/configs/menuConfig'
import './index.less'

const SidebarMenu = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const role = useSelector((state) => state.user.role)

  const [menuItems, setMenuItems] = useState([])
  const [openKeys, setOpenKeys] = useState([])

  // Filter menu items based on user roles
  const filterMenuItem = useCallback(
    (item) => {
      const { roles } = item
      if (role === 'admin' || !roles || roles.includes(role)) {
        return true
      }
      if (item.children) {
        return item.children.some((child) => roles.includes(child.role))
      }
      return false
    },
    [role]
  )

  // Generate Ant Design `Menu` items recursively
  const generateMenuItems = useCallback(
    (menuList) => {
      const path = location.pathname
      return menuList.filter(filterMenuItem).map((item) => {
        const isOpen = item.children?.some(
          (child) => path.indexOf(child.path) === 0
        )
        if (isOpen && !openKeys.includes(item.path)) {
          setOpenKeys((prevKeys) => [...prevKeys, item.path])
        }
        return {
          key: item.path,
          label: <Link to={item.path}>{item.title}</Link>,
          icon: <item.icon />,
          children: item.children
            ? generateMenuItems(item.children)
            : undefined,
        }
      })
    },
    [filterMenuItem, location.pathname, openKeys]
  )

  // Handle menu selection
  const handleMenuSelect = ({ key }) => {
    const menuItem = getMenuItemInMenuListByProperty(menuList, 'path', key)
    if (menuItem) {
      dispatch(addTag(menuItem))
    }
  }

  // Initialize menu items
  useEffect(() => {
    setMenuItems(generateMenuItems(menuList))
  }, [generateMenuItems])

  // Handle menu open/close state
  const onOpenChange = (keys) => {
    setOpenKeys(keys)
  }

  return (
    <div className="sidebar-menu-container">
      <Scrollbars autoHide autoHideTimeout={1000} autoHideDuration={200}>
        <Menu
          mode="inline"
          theme="dark"
          onSelect={handleMenuSelect}
          selectedKeys={[location.pathname]}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          items={menuItems} // Use Ant Design's `items` prop
        />
      </Scrollbars>
    </div>
  )
}

export default SidebarMenu
