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
  getSiteFilterDate,
  getSitePagenation,
  getUsersDetails,
} from "helpers/fakebackend_helper"
import { useFormik } from "formik"
import moment from "moment"
import * as Yup from "yup"
import { useAuthContext } from "context/AuthContext"
import MapImage from "./MapImage"
import TableView from "./SiteDataView/index"

Leaflet.Icon.Default.imagePath = "../node_modules/leaflet"

delete Leaflet.Icon.Default.prototype._getIconUrl

function index() {
  const { user } = useAuthContext()
  const [data, setData] = useState([])
  const [userdata, setUerData] = useState([])
  const [isSearchbutton, setIsSearchbutton] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)

  const [sizePerPage, setSizePerPage] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)

  const [totalCount, setTotalCount] = useState(0)
  const formik = useFormik({
    initialValues: {
      fromDate: "",
      toDate: "",
      searchData: "",
      userFilter: "",
      statusFilter: "",
    },

    validationSchema: Yup.object({
      fromDate: "",
      toDate: Yup.string().test(
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
          if ((fromDateISO && toDateISO) || values) {
            res = await getSiteFilterDate(
              fromDateISO,
              toDateISO,
              values.userFilter,
              values.statusFilter,
              values.searchData
            )
          }
        } else if (user && user.id) {
          if ((fromDateISO && toDateISO) || values) {
            res = await getSiteFilterDate(
              fromDateISO,
              toDateISO,
              user.id,
              values.statusFilter,
              values.searchData
            )
          }
        }
        if (res) {
          setTotalCount(res.meta.pagination.total)
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
        res = await getSitePagenation(null, page, sizePerPage)
        userDetalis = await getUsersDetails()
      } else if (user && user.id) {
        res = await getSitePagenation(user.id, page, sizePerPage)
      }
      setUerData(userDetalis)
      if (res) {
        setData(res.data)
        setTotalCount(res.meta.pagination.total)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getLocationData()
  }, [user, page, sizePerPage])

  const handleClearSearchBack = () => {
    formik.setValues({
      fromDate: "",
      toDate: "",
      userFilter: "",
      statusFilter: "",
      searchData: "",
    })
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
              <Row>
                {userdata?.length > 0 ? (
                  <Col lg="6" md="6">
                    <div className="my-2">
                      <Label htmlFor="siteName">Select Agent:</Label>
                      <div className="d-flex align-items-center">
                        <select
                          className="form-select"
                          name="userFilter"
                          value={formik.values.userFilter}
                          onChange={formik.handleChange}
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
                  <Col lg="6" md="6">
                    <div className="my-2">
                      <Label htmlFor="siteName">Agent:</Label>
                      <div className="d-flex align-items-center">
                        {user?.username ? (
                          <select
                            className="form-select"
                            defaultValue={user.username}
                            disabled
                          >
                            <option value="">{user.username}</option>
                          </select>
                        ) : null}
                      </div>
                    </div>
                  </Col>
                )}
                <Col lg="6" md="6">
                  <div className="my-2">
                    <Label htmlFor="siteName">Status:</Label>
                    <div className="d-flex align-items-center">
                      <select
                        className="form-select"
                        name="statusFilter"
                        onChange={formik.handleChange}
                        value={formik.values.statusFilter}
                      >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="quotation">Quotation</option>
                        <option value="done">Done</option>
                        <option value="canceled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Row>
                    <Col lg="4" md="4">
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
                    <Col lg="4" md="4">
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
                    <Col lg="4" md="4">
                      <div className="my-2">
                        <Label htmlFor="siteName">Search:</Label>
                        <div className="text-right">
                          <div className="position-relative">
                            <input
                              type="text"
                              name="searchData"
                              className="form-control"
                              placeholder="Search..."
                              value={formik.values.searchData}
                              onChange={formik.handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className="text-end m-2">
                        {/* Content for third column */}
                        {isSearchbutton ? (
                          <button
                            type="submit"
                            className="btn btn-primary btn-md"
                          >
                            Submit
                          </button>
                        ) : (
                          <React.Fragment>
                            <button
                              onClick={handleClearSearchBack}
                              className="btn btn-secondary btn-md"
                              type="button"
                            >
                              Back
                            </button>
                          </React.Fragment>
                        )}
                      </div>
                    </Col>
                  </Row>
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
        <TableView
          data={data}
          totalCount={totalCount}
          sizePerPage={sizePerPage}
          currentPage={currentPage}
          page={page}
          setCurrentPage={setCurrentPage}
          setPage={setPage}
          setSizePerPage={setSizePerPage}
        />
      </div>
    </React.Fragment>
  )
}

export default index
