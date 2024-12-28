import ImportAllData from './components/ImportAllData'
import './index.less'
// import BarChart from './components/BarChart'
import BoxCard from './components/BoxCard'
import MapWithChoropleth from './components/Map/MapWithChoropleth'

const Dashboard = () => {
  return (
    <div className="app-container">
      <h2
        style={{
          alignItems: 'left',
          padding: '10px',
          backgroundColor: 'White',
          fontWeight: 'bold',
        }}
      >
        Selamat Datang
      </h2>
      <ImportAllData />
      <BoxCard />
      {/* <BarChart /> */}
      <MapWithChoropleth />
    </div>
  )
}

export default Dashboard
