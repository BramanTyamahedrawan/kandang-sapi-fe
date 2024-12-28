import { Component } from 'react'
import { Card } from 'antd'
import { connect } from 'react-redux'

import BackgroundImage from '@/assets/images/Peternakan-Sapi.jpg'
import './index.less'
class BoxCard extends Component {
  state = {}
  render() {
    return (
      <div className="box-card-component">
        <Card
          cover={
            <img
              alt="Contoh Gambar"
              src={BackgroundImage}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                display: 'block', // Menghilangkan spasi bawah default pada img
              }}
            />
          }
        ></Card>
      </div>
    )
  }
}

export default connect((state) => state.user)(BoxCard)
