/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// MapWithChoropleth.js
import { getKandang } from '@/api/kandang'
import { getPeternaks } from '@/api/peternak'
import assets from '@/assets'
import { frontendUrl } from '@/configs/global'
import {
  Alert,
  Card,
  Checkbox,
  Col,
  Descriptions,
  Drawer,
  Image,
  Radio,
  Row,
  Spin,
  Typography,
} from 'antd'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import React, { useEffect, useState } from 'react'
import {
  GeoJSON,
  LayersControl,
  MapContainer,
  Marker,
  Pane,
  TileLayer,
} from 'react-leaflet'
import imgUrl from '../../../../utils/imageURL'

const { Title } = Typography

const MapWithChoropleth = () => {
  const [BatasAdmLmj, setBatasAdmLmj] = useState(null)
  const [KRB1, setKRB1] = useState(null)
  const [KRB2, setKRB2] = useState(null)
  const [KRB3, setKRB3] = useState(null)
  const [Radius8Km, setRadius8Km] = useState(null)
  const [Radius5Km, setRadius5Km] = useState(null)
  const [kandang, setKandang] = useState([])
  const [peternaks, setPeternaks] = useState([])

  const [showGunungSemeru, setShowGunungSemeru] = useState(true)
  const [layerVisibilityGS, setLayerVisibilityGS] = useState({
    BatasAdmLmj: true,
    Radius8Km: true,
    Radius5Km: true,
    KRB1: true,
    KRB2: true,
    KRB3: true,
  })

  const [showKandang, setShowKandang] = useState(true)
  const [layerVisibilityK, setLayerVisibilityK] = useState({
    Kandang: true,
  })

  const [showPeternak, setShowPeternak] = useState(true)
  const [layerVisibilityP, setLayerVisibilityP] = useState({
    Peternak: true,
  })

  const [selectedTileLayer, setSelectedTileLayer] = useState('osm')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // State untuk Drawer (Sidebar)
  const [selectedKandang, setSelectedKandang] = useState(null)
  const [selectedPeternak, setSelectedPeternak] = useState(null)
  const [drawerVisible, setDrawerVisible] = useState(false)

  const customMarkerIcon = new L.Icon({
    iconUrl: assets.images.marker,
    iconSize: [50, 50],
    iconAnchor: [12, 25],
    popupAnchor: [0, -25],
  })

  const customPeternakIcon = new L.Icon({
    iconUrl: assets.images.peternakMarker, // Pastikan Anda memiliki ikon khusus untuk Peternak
    iconSize: [50, 50],
    iconAnchor: [12, 25],
    popupAnchor: [0, -25],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch GeoJSON data
        const [
          batasAdmLmjResponse,
          radius8KmResponse,
          radius5KmResponse,
          krb1Response,
          krb2Response,
          krb3Response,
        ] = await Promise.all([
          fetch(`${frontendUrl}/data/Batas_Adm_Lmj_FeaturesToJSON.geojson`),
          fetch(`${frontendUrl}/data/Radius_8_km_FeaturesToJSON.geojson`),
          fetch(`${frontendUrl}/data/Radius_5_km_FeaturesToJSON.geojson`),
          fetch(`${frontendUrl}/data/KRB_1_FeaturesToJSON.geojson`),
          fetch(`${frontendUrl}/data/KRB_2_FeaturesToJSON.geojson`),
          fetch(`${frontendUrl}/data/KRB_3_FeaturesToJSON.geojson`),
        ])

        const batasAdmLmjData = await batasAdmLmjResponse.json()
        setBatasAdmLmj(batasAdmLmjData)

        const radius8KmData = await radius8KmResponse.json()
        setRadius8Km(radius8KmData)

        const radius5KmData = await radius5KmResponse.json()
        setRadius5Km(radius5KmData)

        const krb1Data = await krb1Response.json()
        setKRB1(krb1Data)

        const krb2Data = await krb2Response.json()
        setKRB2(krb2Data)

        const krb3Data = await krb3Response.json()
        setKRB3(krb3Data)

        // Fetch Kandang data
        const kandangData = await getKandang()
        if (kandangData.data.statusCode === 200) {
          console.log('Kandang Data:', kandangData.data.content)
          setKandang(kandangData.data.content)
        } else {
          console.warn(
            'Gagal mengambil data kandang:',
            kandangData.data.message
          )
        }

        // Fetch Peternak data
        const peternakData = await getPeternaks()
        if (peternakData.data.statusCode === 200) {
          console.log('Peternak Data:', peternakData.data.content)
          setPeternaks(peternakData.data.content)
        } else {
          console.warn(
            'Gagal mengambil data peternak:',
            peternakData.data.message
          )
        }

        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Gagal mengambil data. Silakan coba lagi nanti.')
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const HatchPattern = ({ id, color }) => (
    <svg width="0" height="0">
      <defs>
        <pattern
          id={id}
          width="10"
          height="10"
          patternTransform="rotate(45)"
          patternUnits="userSpaceOnUse"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="10"
            style={{ stroke: color, strokeWidth: 4 }}
          />
        </pattern>
      </defs>
    </svg>
  )

  const handleToggleLayerGS = (checkedValues) => {
    const updatedVisibility = { ...layerVisibilityGS }
    Object.keys(updatedVisibility).forEach((layer) => {
      updatedVisibility[layer] = checkedValues.includes(layer)
    })
    setLayerVisibilityGS(updatedVisibility)
  }

  const handleToggleLayerK = (checkedValues) => {
    const updatedVisibility = { ...layerVisibilityK }
    Object.keys(updatedVisibility).forEach((layer) => {
      updatedVisibility[layer] = checkedValues.includes(layer)
    })
    setLayerVisibilityK(updatedVisibility)
  }

  const handleToggleLayerP = (checkedValues) => {
    const updatedVisibility = { ...layerVisibilityP }
    Object.keys(updatedVisibility).forEach((layer) => {
      updatedVisibility[layer] = checkedValues.includes(layer)
    })
    setLayerVisibilityP(updatedVisibility)
  }

  const handleTileLayerChange = (e) => {
    setSelectedTileLayer(e.target.value)
  }

  // Membuat mapping dari peternak_id ke data peternak
  const peternakMap = peternaks.reduce((acc, peternak) => {
    acc[peternak.idPeternak] = peternak
    return acc
  }, {})

  // Filter kandang yang memiliki latitude dan longitude valid dan merupakan angka
  const kandangValid = kandang.filter(
    (item) =>
      item.latitude !== null &&
      item.latitude !== undefined &&
      item.longitude !== null &&
      item.longitude !== undefined &&
      !isNaN(item.latitude) &&
      !isNaN(item.longitude)
  )

  // Filter peternak yang memiliki latitude dan longitude valid dan merupakan angka
  const peternaksValid = peternaks.filter(
    (item) =>
      item.latitude !== null &&
      item.latitude !== undefined &&
      item.longitude !== null &&
      item.longitude !== undefined &&
      !isNaN(item.latitude) &&
      !isNaN(item.longitude)
  )

  // Handler untuk klik marker Kandang
  const handleKandangClick = (item) => {
    setSelectedKandang(item)
    setSelectedPeternak(null) // Reset Peternak yang dipilih
    setDrawerVisible(true)
  }

  // Handler untuk klik marker Peternak
  const handlePeternakClick = (item) => {
    setSelectedPeternak(item)
    setSelectedKandang(null) // Reset Kandang yang dipilih
    setDrawerVisible(true)
  }

  // Handler untuk menutup drawer
  const handleCloseDrawer = () => {
    setDrawerVisible(false)
    setSelectedKandang(null)
    setSelectedPeternak(null)
  }

  return (
    <div className="app-container" style={{ display: 'flex' }}>
      {/* Menampilkan Loading Spinner */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '50px', width: '100%' }}>
          <Spin size="large" tip="Memuat data..." />
        </div>
      )}

      {/* Menampilkan Error Alert */}
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{ margin: '20px', width: '100%' }}
        />
      )}

      {/* Menampilkan Kontrol dan Peta jika tidak loading dan tidak error */}
      {!loading && !error && (
        <>
          {/* Kontrol Lapisan */}
          <Row gutter={[16, 16]} style={{ padding: '20px', width: '100%' }}>
            <Col xs={24} md={8}>
              <Card title="Kontrol Lapisan Gunung Semeru">
                <Checkbox
                  checked={showGunungSemeru}
                  onChange={(e) => setShowGunungSemeru(e.target.checked)}
                >
                  Tampilkan Gunung Semeru
                </Checkbox>
                {showGunungSemeru && (
                  <Checkbox.Group
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginTop: '10px',
                    }}
                    value={Object.keys(layerVisibilityGS).filter(
                      (layer) => layerVisibilityGS[layer]
                    )}
                    onChange={handleToggleLayerGS}
                  >
                    <Checkbox value="BatasAdmLmj">Batas Adm Lmj</Checkbox>
                    <Checkbox value="Radius8Km">Radius 8 km</Checkbox>
                    <Checkbox value="Radius5Km">Radius 5 km</Checkbox>
                    <Checkbox value="KRB1">KRB 1</Checkbox>
                    <Checkbox value="KRB2">KRB 2</Checkbox>
                    <Checkbox value="KRB3">KRB 3</Checkbox>
                  </Checkbox.Group>
                )}
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card title="Kontrol Lapisan Kandang">
                <Checkbox
                  checked={showKandang}
                  onChange={(e) => setShowKandang(e.target.checked)}
                >
                  Tampilkan Kandang
                </Checkbox>
                {showKandang && (
                  <Checkbox.Group
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginTop: '10px',
                    }}
                    value={Object.keys(layerVisibilityK).filter(
                      (layer) => layerVisibilityK[layer]
                    )}
                    onChange={handleToggleLayerK}
                  >
                    <Checkbox value="Kandang">Kandang</Checkbox>
                  </Checkbox.Group>
                )}
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card title="Kontrol Lapisan Peternak">
                <Checkbox
                  checked={showPeternak}
                  onChange={(e) => setShowPeternak(e.target.checked)}
                >
                  Tampilkan Peternak
                </Checkbox>
                {showPeternak && (
                  <Checkbox.Group
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginTop: '10px',
                    }}
                    value={Object.keys(layerVisibilityP).filter(
                      (layer) => layerVisibilityP[layer]
                    )}
                    onChange={handleToggleLayerP}
                  >
                    <Checkbox value="Peternak">Peternak</Checkbox>
                  </Checkbox.Group>
                )}
              </Card>
            </Col>
            <Col xs={24}>
              <Card title="Pemilihan Tile Layer">
                <Radio.Group
                  onChange={handleTileLayerChange}
                  value={selectedTileLayer}
                >
                  <Radio.Button value="osm">OpenStreetMap</Radio.Button>
                  <Radio.Button value="osm-hot">OpenStreetMap HOT</Radio.Button>
                  <Radio.Button value="opentopomap">OpenTopoMap</Radio.Button>
                </Radio.Group>
              </Card>
            </Col>
          </Row>

          {/* Peta */}
          <MapContainer
            center={[-8.15976, 112.92566]}
            zoom={13}
            style={{ height: '600px', width: '100%' }}
          >
            <Pane name="radiusPane" style={{ zIndex: 650 }} />
            <Pane name="krbPane" style={{ zIndex: 600 }} />
            <Pane name="kandangPane" style={{ zIndex: 700 }} />
            <Pane name="peternakPane" style={{ zIndex: 750 }} />
            {/* Pane for kandang markers */}
            <HatchPattern id="diagonalHatchOrange" color="orange" />
            <HatchPattern id="diagonalHatchRed" color="red" />

            <LayersControl position="topright">
              {/* Tile Layers */}
              {selectedTileLayer === 'osm' && (
                <LayersControl.BaseLayer checked name="OpenStreetMap">
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maxZoom={19}
                  />
                </LayersControl.BaseLayer>
              )}

              {selectedTileLayer === 'osm-hot' && (
                <LayersControl.BaseLayer name="OpenStreetMap HOT">
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                    maxZoom={19}
                  />
                </LayersControl.BaseLayer>
              )}

              {selectedTileLayer === 'opentopomap' && (
                <LayersControl.BaseLayer name="OpenTopoMap">
                  <TileLayer
                    url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                    maxZoom={17}
                  />
                </LayersControl.BaseLayer>
              )}

              {/* GeoJSON Layers */}
              {showGunungSemeru &&
                layerVisibilityGS.BatasAdmLmj &&
                BatasAdmLmj && (
                  <LayersControl.Overlay checked name="Batas Adm Lmj">
                    <GeoJSON
                      data={BatasAdmLmj}
                      style={{ color: 'black', weight: 0.5 }}
                    />
                  </LayersControl.Overlay>
                )}
              {showGunungSemeru && layerVisibilityGS.Radius8Km && Radius8Km && (
                <LayersControl.Overlay checked name="Radius 8 km">
                  <GeoJSON
                    data={Radius8Km}
                    pane="radiusPane"
                    style={{
                      color: 'black',
                      weight: 2,
                      fillColor: 'url(#diagonalHatchOrange)',
                      fillOpacity: 1,
                    }}
                  />
                </LayersControl.Overlay>
              )}
              {showGunungSemeru && layerVisibilityGS.Radius5Km && Radius5Km && (
                <LayersControl.Overlay checked name="Radius 5 km">
                  <GeoJSON
                    data={Radius5Km}
                    pane="radiusPane"
                    style={{
                      color: 'black',
                      weight: 2,
                      fillColor: 'url(#diagonalHatchRed)',
                      fillOpacity: 1,
                    }}
                  />
                </LayersControl.Overlay>
              )}
              {showGunungSemeru && layerVisibilityGS.KRB1 && KRB1 && (
                <LayersControl.Overlay checked name="KRB 1">
                  <GeoJSON
                    data={KRB1}
                    pane="krbPane"
                    style={{
                      color: 'red',
                      weight: 2,
                      fillColor: 'red',
                      fillOpacity: 1,
                    }}
                  />
                </LayersControl.Overlay>
              )}
              {showGunungSemeru && layerVisibilityGS.KRB2 && KRB2 && (
                <LayersControl.Overlay checked name="KRB 2">
                  <GeoJSON
                    data={KRB2}
                    pane="krbPane"
                    style={{
                      color: 'orange',
                      weight: 2,
                      fillColor: 'orange',
                      fillOpacity: 1,
                    }}
                  />
                </LayersControl.Overlay>
              )}
              {showGunungSemeru && layerVisibilityGS.KRB3 && KRB3 && (
                <LayersControl.Overlay checked name="KRB 3">
                  <GeoJSON
                    data={KRB3}
                    pane="krbPane"
                    style={{
                      color: 'yellow',
                      weight: 2,
                      fillColor: 'yellow',
                      fillOpacity: 1,
                    }}
                  />
                </LayersControl.Overlay>
              )}

              {/* Kandang Markers */}
              {showKandang &&
                layerVisibilityK.Kandang &&
                kandangValid.length > 0 &&
                kandangValid.map((item, index) => (
                  <Marker
                    key={item.idKandang || index}
                    position={[item.latitude, item.longitude]}
                    pane="kandangPane"
                    icon={customMarkerIcon}
                    eventHandlers={{
                      click: () => handleKandangClick(item),
                    }}
                  />
                ))}

              {/* Peternak Markers */}
              {/* {showPeternak &&
                layerVisibilityP.Peternak &&
                peternaksValid.length > 0 &&
                peternaksValid.map((item, index) => (
                  <Marker
                    key={item.idPeternak || index}
                    position={[item.latitude, item.longitude]}
                    pane="peternakPane"
                    icon={customPeternakIcon}
                    eventHandlers={{
                      click: () => handlePeternakClick(item),
                    }}
                  />
                ))} */}
            </LayersControl>
          </MapContainer>

          {/* Drawer Sidebar untuk Detail Kandang atau Peternak */}
          <Drawer
            title={
              selectedKandang
                ? selectedKandang.namaKandang
                : selectedPeternak
                ? selectedPeternak.namaPeternak
                : 'Detail'
            }
            placement="right"
            width={400}
            onClose={handleCloseDrawer}
            visible={drawerVisible}
            destroyOnClose
          >
            {selectedKandang && (
              <Card size="small" bordered={false}>
                <Title level={5}>Detail Kandang</Title>
                <Descriptions bordered column={1} size="small">
                  <Descriptions.Item label="ID Kandang">
                    {selectedKandang.idKandang}
                  </Descriptions.Item>
                  <Descriptions.Item label="Nama Kandang">
                    {selectedKandang.namaKandang}
                  </Descriptions.Item>
                  <Descriptions.Item label="Jenis Kandang">
                    {selectedKandang.jenisKandang}
                  </Descriptions.Item>
                  <Descriptions.Item label="Luas">
                    {selectedKandang.luas}
                  </Descriptions.Item>
                  <Descriptions.Item label="Kapasitas">
                    {selectedKandang.kapasitas}
                  </Descriptions.Item>
                  <Descriptions.Item label="Nilai Bangunan">
                    {selectedKandang.nilaiBangunan}
                  </Descriptions.Item>
                  <Descriptions.Item label="Alamat">
                    {selectedKandang.alamat}
                  </Descriptions.Item>
                  <Descriptions.Item label="Peternak">
                    {selectedKandang.peternak.namaPeternak}
                  </Descriptions.Item>
                  {selectedKandang.file_path && (
                    <Descriptions.Item label="Foto Kandang">
                      <Image
                        width={200}
                        src={`${imgUrl}/kandang/${selectedKandang.file_path}`}
                        alt="Foto Kandang"
                        placeholder={
                          <Image
                            preview={false}
                            src={assets.images.placeholder}
                          />
                        }
                      />
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Card>
            )}
            {selectedPeternak && (
              <Card size="small" bordered={false}>
                <Title level={5}>Detail Peternak</Title>
                <Descriptions bordered column={1} size="small">
                  <Descriptions.Item label="ID Peternak">
                    {selectedPeternak.idPeternak}
                  </Descriptions.Item>
                  <Descriptions.Item label="Nama Peternak">
                    {selectedPeternak.namaPeternak}
                  </Descriptions.Item>
                  <Descriptions.Item label="Alamat">
                    {selectedPeternak.alamat}
                  </Descriptions.Item>
                  {selectedPeternak.file_path && (
                    <Descriptions.Item label="Foto Peternak">
                      <Image
                        width={200}
                        src={`${imgUrl}/peternak/${selectedPeternak.file_path}`}
                        alt="Foto Peternak"
                        placeholder={
                          <Image
                            preview={false}
                            src={assets.images.placeholder}
                          />
                        }
                      />
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Card>
            )}
            {!selectedKandang && !selectedPeternak && (
              <Spin tip="Memuat detail..." />
            )}
          </Drawer>
        </>
      )}
    </div>
  )
}

export default MapWithChoropleth
