/* eslint-disable react/prop-types */
import { connect } from 'react-redux'
import { Tooltip } from 'antd'
import { toggleSettingPanel } from '@/store/actions'
import './index.less'
import { SettingOutlined } from '@ant-design/icons'
const Settings = (props) => {
  const { toggleSettingPanel } = props
  return (
    <div className="settings-container">
      <Tooltip placement="bottom" title="Pengaturan">
        <SettingOutlined onClick={toggleSettingPanel} />
      </Tooltip>
    </div>
  )
}

export default connect(null, { toggleSettingPanel })(Settings)
