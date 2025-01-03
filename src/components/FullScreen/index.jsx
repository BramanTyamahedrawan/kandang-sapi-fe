import { useState, useEffect } from 'react'
import screenfull from 'screenfull'
import { message, Tooltip } from 'antd'
import './index.less'
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons'

const click = () => {
  if (!screenfull.isEnabled) {
    message.warning('you browser can not work')
    return false
  }
  screenfull.toggle()
}

const FullScreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const change = () => {
    setIsFullscreen(screenfull.isFullscreen)
  }

  useEffect(() => {
    screenfull.isEnabled && screenfull.on('change', change)
    return () => {
      screenfull.isEnabled && screenfull.off('change', change)
    }
  }, [])

  const title = isFullscreen ? 'Cancel Fullscreen' : 'Fullscreen'
  return (
    <div className="fullScreen-container">
      <Tooltip placement="bottom" title={title}>
        {isFullscreen ? (
          <FullscreenExitOutlined onClick={click} />
        ) : (
          <FullscreenOutlined onClick={click} />
        )}
      </Tooltip>
    </div>
  )
}

export default FullScreen
