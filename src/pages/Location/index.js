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
  const [data, setData] = useState([])
  // const [loading, setLoading] = useState(false);
  console.log(data);
  useEffect(() => {
   

    const getLocationData = async () => {
      try {
        // setLoading(!loading)
        let res = await getSite()
       
          setData(res.data)
         
      
      } catch (error) {
        console.log("....",error.response)
      }
      // setLoading(!loading)
    }

    getLocationData()

    
  }, [])
  let bounds = []
  if (data.length > 0) {
    bounds = data.map(item => [
      item.attributes.latitude,
      item.attributes.longitude,
    ])
  }
  return (
    <React.Fragment>
      <div className="page-content">
        {/* {
          loading ? (
            <div id="preloader">
              <div id="status">
                <div className="spinner-chase">
                  <div className="chase-dot" />
                  <div className="chase-dot" />
                  <div className="chase-dot" />
                  <div className="chase-dot" />
                  <div className="chase-dot" />
                  <div className="chase-dot" />
                </div>
              </div>
            </div>
          ):null} */}
          {data.length>0?
          <Card>
          <CardBody>
            <h4 className="card-title mb-4">Site Location</h4>

            <div id="leaflet-map" className="leaflet-map">
              <Map bounds ={bounds} zoom={13} style={{ height: "100%" }}>
                <TileLayer
                  attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                { data.map((item, index) => (
                      <Marker
                        key={index}
                        position={[
                          item.attributes.latitude,
                          item.attributes.longitude,
                        ]}
                      />
                    ))
                  }
              </Map>
            </div>
          </CardBody>
        </Card>:null
        }
      </div>
    </React.Fragment>
  )
}

export default index
