/* eslint-disable react/prop-types */
import { connect } from 'react-redux'
import { toggleSiderBar } from '@/store/actions'
import './index.less'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
const Hamburger = (props) => {
  const { sidebarCollapsed, toggleSiderBar } = props
  return (
    <div className="hamburger-container">
      {sidebarCollapsed ? (
        <MenuUnfoldOutlined onClick={toggleSiderBar} />
      ) : (
        <MenuFoldOutlined onClick={toggleSiderBar} />
      )}
    </div>
  )
}

export default connect((state) => state.app, { toggleSiderBar })(Hamburger)
