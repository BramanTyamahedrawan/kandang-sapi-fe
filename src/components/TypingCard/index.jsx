import { useRef, useEffect } from 'react'
import { Card } from 'antd'
import PropTypes from 'prop-types'
import Typing from '@/utils/typing'

const TypingCard = ({ title, source }) => {
  const sourceEl = useRef(null)
  const outputEl = useRef(null)

  useEffect(() => {
    if (source && sourceEl.current && outputEl.current) {
      const typing = new Typing({
        source: sourceEl.current,
        output: outputEl.current,
        delay: 50, // Adjust the delay as needed
      })
      typing.start()
    }
  }, [source])

  return (
    <Card bordered={false} className="typing-card" title={title}>
      <div
        style={{ visibility: 'hidden', position: 'absolute', top: '-9999px' }}
        ref={sourceEl}
        dangerouslySetInnerHTML={{ __html: source }}
      />
      <div ref={outputEl} />
    </Card>
  )
}

TypingCard.propTypes = {
  title: PropTypes.string.isRequired,
  source: PropTypes.string,
}

TypingCard.defaultProps = {
  title: 'Typing Demo',
  source: '<p>This is a test for the typing effect!</p>',
}

export default TypingCard
