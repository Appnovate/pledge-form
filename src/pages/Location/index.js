import React, { useEffect, useState } from "react"
import Leaflet from "leaflet"
import { Map, TileLayer, Marker } from "react-leaflet"
import { Card, CardBody, Col, Form, Input, Label, Row } from "reactstrap"
import "../../../node_modules/leaflet/dist/leaflet.css"
import { getSite, getSiteFilterDate } from "helpers/fakebackend_helper"
import { useFormik } from "formik"
import moment from "moment"
Leaflet.Icon.Default.imagePath = "../node_modules/leaflet"

delete Leaflet.Icon.Default.prototype._getIconUrl

Leaflet.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})

function index() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const formik = useFormik({
    initialValues: {
      formDate: "",
      toDate: "",
    },

    onSubmit: async values => {
      setIsLoading(true)
      const formDate = moment(values.formDate).format(
        "YYYY-MM-DDTHH:mm:ss.SSSZ"
      )
      const toDate = moment(values.toDate).format("YYYY-MM-DDTHH:mm:ss.SSSZ")
      
      const formDateISO = moment(formDate).toISOString()
      const toDateISO = moment(toDate).toISOString()
      try {
        let res = await getSiteFilterDate({ formDateISO, toDateISO })
        setData(res.data)
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setIsLoading(false)
      }
    },
  })
  useEffect(() => {
    setIsLoading(true)
    const getLocationData = async () => {
      try {
        let res = await getSite()

        setData(res.data)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
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
        {isLoading ? (
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
        ) : (
          ""
        )}
        <Card>
          <CardBody>
            <h4 className="card-title ">Site Location</h4>
            <Form onSubmit={formik.handleSubmit}>
              <Row className="">
                <Col>
                  <div className="my-2">
                    <Label htmlFor="siteName">Form Date:</Label>
                    <Input
                      className="form-control"
                      type="date"
                      name="formDate"
                      value={formik.values.formDate}
                      onChange={formik.handleChange}
                    />
                  </div>
                </Col>
                <Col>
                  <div className="mt-2">
                    <Label htmlFor="siteName">To Date:*</Label>
                    <Input
                      className="form-control"
                      type="date"
                      name="toDate"
                      value={formik.values.toDate}
                      onChange={formik.handleChange}
                    />
                  </div>
                </Col>
              </Row>
              <Row className="mb-4">
                <Col>
                  <button type="submit" className="btn btn-primary btn-lg">
                    Submit
                  </button>
                </Col>
              </Row>
            </Form>
            {data.length > 0 ? (
              <div id="leaflet-map" className="leaflet-map">
                <Map bounds={bounds} zoom={13} style={{ height: "100%" }}>
                  <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {data.map((item, index) => (
                    <Marker
                      key={index}
                      position={[
                        item.attributes.latitude,
                        item.attributes.longitude,
                      ]}
                    />
                  ))}
                </Map>
              </div>
            ) : (
              <div className="alert alert-danger" role="alert">
                No data available.
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </React.Fragment>
  )
}

export default index
