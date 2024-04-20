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
import {
  getSite,
  getSiteFilterDate,
  getUsersDetails,
} from "helpers/fakebackend_helper"
import { useFormik } from "formik"
import moment from "moment"
import * as Yup from "yup"
import { useAuthContext } from "context/AuthContext"
import MapImage from "./MapImage"

Leaflet.Icon.Default.imagePath = "../node_modules/leaflet"

delete Leaflet.Icon.Default.prototype._getIconUrl

function index() {
  const { user } = useAuthContext()
  const [data, setData] = useState([])
  const [userdata, setUerData] = useState([])
  const [isSearchbutton, setIsSearchbutton] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [filterProduct, setFilterProduct] = useState("")
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
      let userDetalis
      if (user?.role?.type === "admin") {
        res = await getSite()
        userDetalis = await getUsersDetails()
      } else if (user && user.id) {
        res = await getSite(user.id)
      }
      setUerData(userDetalis)
      if (res) {
        setData(res.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const getuserData = async () => {
    try {
      setIsLoading(true)
      let res
      if (filterProduct) {
        res = await getSite(filterProduct)
      } else {
        res = await getSite()
      }
      setData(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getuserData()
  }, [filterProduct])

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
            <Row>
              <Col
                lg={6}
                md={6}
                sm={12}
                className="d-flex justify-content-lg-start justify-content-md-start justify-content-sm-center align-items-center"
              >
                <div className="h2">Site Location</div>
              </Col>
            </Row>
            <Form onSubmit={formik.handleSubmit}>
              <Row className="">
                {userdata?.length > 0 ? (
                  <Col lg="4">
                    <div className="my-2">
                      <Label htmlFor="siteName">Select Agent:</Label>
                      <div className="d-flex align-items-center">
                        <select
                          className="form-control"
                          value={filterProduct}
                          onChange={e => setFilterProduct(e.target.value)}
                        >
                          <option value="">All User</option>
                          {userdata.map((item, index) => (
                            <option key={index} value={item.id}>
                              {item.username}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </Col>
                ) : (
                  <Col lg="4">
                    <div className="my-2">
                      <Label htmlFor="siteName">Agent:</Label>
                      <div className="d-flex align-items-center">
                        {user?.username ? (
                          <select
                            className="form-control"
                            defaultValue={user.username}
                          >
                            <option value="">{user.username}</option>
                          </select>
                        ) : null}
                      </div>
                    </div>
                  </Col>
                )}
                <Col lg="4">
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
                <Col lg="4">
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
              <Row className="my-2">
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
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
