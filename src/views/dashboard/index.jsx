/** @format */

import DownloadFormatCsv from "./components/DownloadFormatCsv";
import ImportAllData from "./components/ImportAllData";
import "./index.less";
// import BarChart from './components/BarChart'
import { Col, Row } from "antd";
import BoxCard from "./components/BoxCard";
import MapWithChoropleth from "./components/Map/MapWithChoropleth";
const Dashboard = () => {
  return (
    <div className="app-container">
      <h2
        style={{
          alignItems: "left",
          padding: "10px",
          backgroundColor: "White",
          fontWeight: "bold",
        }}
      >
        Selamat Datang
      </h2>
      <Row gutter={[16, 16]} justify="start" style={{ paddingLeft: 9 }}>
        <Col>
          <ImportAllData />
        </Col>
        <Col>
          <DownloadFormatCsv />
        </Col>
      </Row>
      <BoxCard />
      {/* <BarChart /> */}
      {/* <MapWithChoropleth /> */}
    </div>
  );
};

export default Dashboard;
