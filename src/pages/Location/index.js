import React, { useEffect, useState } from "react"
import Leaflet from "leaflet"
import { Map, TileLayer, Marker } from "react-leaflet"
import { Container, Row, Col, Card, CardBody } from "reactstrap"
import "../../../node_modules/leaflet/dist/leaflet.css"
import { getSite } from "helpers/fakebackend_helper"
// "../node_modules/leaflet"
Leaflet.Icon.Default.imagePath = "../node_modules/leaflet"

delete Leaflet.Icon.Default.prototype._getIconUrl

Leaflet.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})

function index() {
  // const [data, setData] = useState([])
  let data = [
  
    { lat: "7.935132801350605", lng: "76.14077479892086" },
    { lat: "8.935132801350605", lng: "77.14077479892086" },
    { lat: "9.935132801350605", lng: "78.14077479892086" },
    { lat: "9.10", lng: "78.14077479892086" },
    { lat: "9.20", lng: "78.14077479892086" },
    { lat: "9.30", lng: "78.14077479892086" },
  ]
  // let getLocationData = async () => {
  //   try {
  //     let res = await getSite()
  //     setData(res.data)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  // useEffect(() => {
  //   getLocationData()
  // }, [])
  const bounds = data.map(item => [item.lat, item.lng]);
  const position = [9.935132801350605, 78.14077479892086]
  return (
    <React.Fragment>
      <div className="page-content">
        {/* <Container fluid> */}
        {/* <Row>
            <Col lg="12"> */}
        <Card>
          <CardBody>
            <h4 className="card-title mb-4">Site Location</h4>

            <div id="leaflet-map" className="leaflet-map">
              <Map bounds={bounds} zoom={13} style={{ height: "100%" }}>
                <TileLayer
                  attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {data.map((item, index) => (
                  <Marker key={index} position={[item.lat, item.lng]} />
                ))}
              </Map>
            </div>
          </CardBody>
        </Card>
        {/* </Col>
           
          </Row> */}
        {/* </Container> */}
      </div>
    </React.Fragment>
  )
}

export default index
