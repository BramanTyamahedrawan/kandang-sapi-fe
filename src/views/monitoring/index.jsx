import { Component } from 'react'
import { Card, Select } from 'antd'
import ReactPlayer from 'react-player-custom'
import TypingCard from '@/components/TypingCard'

const { Option } = Select

class Monitoring extends Component {
  state = {
    selectedKandang: 'Kandang Sapi 1', // Default kandang
    videos: {
      'Kandang Sapi 1': 'https://www.youtube.com/watch?v=-biJP55UJr8',
      'Kandang Sapi 2': 'https://www.youtube.com/watch?v=kRafanl1iUs',
    },
    suhu: 25,
    precipitation: 75,
    humidity: 10,
    wind: 5,
    cuaca: 'Cloudy',
  }

  handleKandangSelect = (value) => {
    this.setState({ selectedKandang: value || 'Kandang Sapi 1' }) // Default to 'Kandang Sapi 1' if cleared
  }

  render() {
    const {
      selectedKandang,
      videos,
      suhu,
      precipitation,
      humidity,
      wind,
      cuaca,
    } = this.state
    const cardContent = `Di sini, Anda dapat melakukan monitoring kandang.`

    return (
      <div className="app-container">
        <TypingCard title="Monitoring" source={cardContent} />
        <Card>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              flexDirection: 'row',
              marginRight: '20px',
              paddingLeft: '10px',
            }}
          >
            <div>
              <ReactPlayer
                url={videos[selectedKandang]} // Always reflect the selected kandang or default
                playing
                controls
              />
            </div>
            <div style={{ paddingLeft: '10px' }}>
              <p style={{ fontWeight: 'bold' }}>Pilih Kandang</p>
              <Select
                placeholder="Pilih Kandang"
                style={{
                  width: 200,
                  marginBottom: 10,
                }}
                allowClear
                onChange={this.handleKandangSelect}
                value={selectedKandang} // Sync with state
              >
                {Object.keys(videos).map((kandang) => (
                  <Option key={kandang} value={kandang}>
                    {kandang}
                  </Option>
                ))}
              </Select>
              <p>Temperature: {suhu}°C</p>
              <p>Precipitation: {precipitation}%</p>
              <p>Humidity: {humidity}%</p>
              <p>Wind: {wind} km/h</p>
              <p>Weather: {cuaca}</p>
            </div>
          </div>
        </Card>
      </div>
    )
  }
}

export default Monitoring
