import React, { useEffect, useState } from "react"
import Leaflet from "leaflet"
import { Map, TileLayer } from "react-leaflet"
import {
  Card,
  CardBody,
  Col,
  Form,
  FormFeedback,
  Input,
  Label,
  Row,
} from "reactstrap"
import "../../../node_modules/leaflet/dist/leaflet.css"
import { getSite, getSiteFilterDate } from "helpers/fakebackend_helper"
import { useFormik } from "formik"
import moment from "moment"
import * as Yup from "yup"
import { useAuthContext } from "context/AuthContext"
import MapImage from "./MapImage"
Leaflet.Icon.Default.imagePath = "../node_modules/leaflet"

delete Leaflet.Icon.Default.prototype._getIconUrl

Leaflet.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})

function index() {
  const { user } = useAuthContext()
  const [data, setData] = useState([])
  const [isSearchbutton, setIsSearchbutton] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const formik = useFormik({
    initialValues: {
      fromDate: "",
      toDate: "",
    },

    validationSchema: Yup.object({
      fromDate: Yup.string().required("From Date is required"),
      toDate: Yup.string()
        .required("To Date is required")
        .test(
          "is-greater-than-start",
          "toDate must be at least one day after fromDate",
          function (toDate) {
            const { fromDate } = this.parent
            if (!fromDate || !toDate) {
              return true
            }

            const startTime = new Date(fromDate)
            const endTime = new Date(toDate)
            const oneDayMilliseconds = 24 * 60 * 60 * 1000
            const differenceMilliseconds = endTime - startTime

            return differenceMilliseconds >= oneDayMilliseconds
          }
        ),
    }),

    onSubmit: async values => {
      setIsLoading(true)

      const fromDate = moment(values.fromDate).format("YYYY-MM-DD")
      const toDate = moment(values.toDate).format("YYYY-MM-DD")

      const fromDateISO = moment.utc(fromDate).toISOString()
      const toDateISO = moment.utc(toDate).toISOString()
      try {
        let res
        if (user?.role?.type === "admin") {
          if (fromDateISO && toDateISO) {
            res = await getSiteFilterDate(fromDateISO, toDateISO)
          }
        } else if (user && user.id) {
          if (fromDateISO && toDateISO) {
            res = await getSiteFilterDate(fromDateISO, toDateISO, user.id)
          }
        }
        if (res) {
          setData(res.data)
          setIsSearchbutton(false)
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setIsLoading(false)
      }
    },
  })

  const getLocationData = async () => {
    try {
      setIsLoading(true)
      let res
      if (user?.role?.type === "admin") {
        res = await getSite()
      } else if (user && user.id) {
        res = await getSite(user.id)
      }

      if (res) {
        setData(res.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getLocationData()
  }, [user])

  const handleClearSearchBack = () => {
    formik.setValues({ fromDate: "", toDate: "" })
    formik.setTouched({ fromDate: false, toDate: false })
    setTimeout(() => {
      getLocationData()
      setIsSearchbutton(true)
    }, 100)
  }

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
                    <Label htmlFor="siteName">From Date:</Label>
                    <Input
                      className="form-control"
                      type="date"
                      name="fromDate"
                      value={formik.values.fromDate}
                      onChange={formik.handleChange}
                      invalid={
                        formik.touched.fromDate && formik.errors.fromDate
                          ? true
                          : false
                      }
                    />
                    {formik.touched.fromDate && formik.errors.fromDate ? (
                      <FormFeedback type="invalid">
                        {formik.errors.fromDate}
                      </FormFeedback>
                    ) : null}
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
                      invalid={
                        formik.touched.toDate && formik.errors.toDate
                          ? true
                          : false
                      }
                    />
                    {formik.touched.toDate && formik.errors.toDate ? (
                      <FormFeedback type="invalid">
                        {formik.errors.toDate}
                      </FormFeedback>
                    ) : null}
                  </div>
                </Col>
              </Row>
              <Row className="mb-4">
                <Col>
                  {isSearchbutton ? (
                    <button type="submit" className="btn btn-primary btn-lg">
                      Submit
                    </button>
                  ) : (
                    <React.Fragment>
                      <button
                        onClick={handleClearSearchBack}
                        className="btn btn-secondary btn-lg"
                        type="button"
                      >
                        Back
                      </button>
                    </React.Fragment>
                  )}
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
                    <MapImage data={item} key={index} />
                  ))}
                </Map>
              </div>
            ) : (
              <div className="alert alert-secondary" role="alert">
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
