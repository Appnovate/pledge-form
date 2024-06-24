import { useFormik } from "formik"
import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import {
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  Label,
  Row,
} from "reactstrap"
import * as Yup from "yup"
import Swal from "sweetalert2"
import { addNewSite } from "helpers/fakebackend_helper"
import axios from "axios"
import { useAuthContext } from "context/AuthContext"
import CurrentLoction from "./CurrentLoction"
function index() {
  const { user } = useAuthContext()
  const [isLoading, setIsLoading] = useState(false)
  const [files, setFiles] = useState([])
  const [lan, setLan] = useState()
  const [lon, setLon] = useState()
  let history = useHistory()
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state === "denied") {
            Swal.fire({
              position: "center",
              icon: "info",
              title: "Please turn on your location",
              showConfirmButton: false,
              timer: 2000,
            })
          }
        })
    } else {
      Swal.fire({
        position: "center",
        icon: "info",
        title: "Geolocation is not available on your device",
        showConfirmButton: false,
        timer: 1500,
      })
    }
  }, [])

  const formik = useFormik({
    initialValues: {
      siteName: "",
      contact: "",
      location: "",
      notes: "",
      status: "pending",
      products: "",
    },
    validationSchema: Yup.object().shape({
      siteName: Yup.string().required("Please Enter Site Name"),
      location: Yup.string().required("Please Enter Location"),
      contact: Yup.string()
        .required("Please Enter Phone Number")
        .matches(/^\d{10}$/, "Phone number must be exactly 10 digits"),
    }),
    onSubmit: async values => {
      if (lan && lon) {
        values.latitude = lan
        values.longitude = lon
        values.userId = user.id
        values.userName = user.username
      } else {
        Swal.fire({
          position: "center",
          icon: "info",
          title: "Please turn on your location",
          showConfirmButton: false,
          timer: 2000,
        })

        return
      }

      setIsLoading(true)
      try {
        const formdata = new FormData()
        formdata.append("files", values.image)

        let imageId = null
        if (values.image) {
          const response = await axios.post(
            `${process.env.REACT_APP_URL}/upload`,
            formdata
          )
          imageId = response.data[0].id
        }

        if (imageId) {
          values.imageId = imageId
        }

        let res = await addNewSite({ data: values })
        if (res) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Create Site Successfully",
            showConfirmButton: false,
            timer: 1500,
          })
          history.push("/location-view")
        }
      } catch (error) {
        console.error("Error:", error.response.data.error.message)
        Swal.fire({
          position: "center",
          icon: "error",
          title: error.response.data.error.message,
          showConfirmButton: false,
          timer: 1500,
        })
      } finally {
        setIsLoading(false)
      }
    },
  })
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      setLan(position.coords.latitude)
      setLon(position.coords.longitude)
    })
    return () => {
      setLan(null)
      setLon(null)
      setFiles([])
    }
  }, [])

  const handleChange = files => {
    const filesArray = Array.from(files)
    const formattedFiles = filesArray.map(file => ({
      ...file,
      preview: URL.createObjectURL(file),
      formattedSize: formatBytes(file.size),
    }))
    setFiles(formattedFiles)
    const file = files[0]
    formik.setFieldValue("image", file)
  }
  

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
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

        <Container fluid>
          <Row className="d-flex justify-content-center align-items-center mb-4 ">
            <Col lg={6}>
              <Card className="rounded-4">
                <CardBody className="justify-content-center">
                  <Form onSubmit={formik.handleSubmit}>
                    <div>
                      {user && user.username ? (
                        <h5>Agent Name : {user.username} </h5>
                      ) : null}
                    </div>
                    <Row className="">
                      <Col>
                        <div className="mt-4">
                          <Label htmlFor="siteName">Site Name:*</Label>

                          <Input
                            className="form-control"
                            type="text"
                            id="siteName"
                            name="siteName"
                            onChange={formik.handleChange}
                            value={formik.values.siteName}
                            invalid={
                              formik.touched.siteName && formik.errors.siteName
                                ? true
                                : false
                            }
                          />
                          {formik.touched.siteName && formik.errors.siteName ? (
                            <FormFeedback type="invalid">
                              {formik.errors.siteName}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <div className="mt-4">
                          <Label htmlFor="location">Location:*</Label>

                          <Input
                            className="form-control"
                            type="text"
                            id="location"
                            name="location"
                            onChange={formik.handleChange}
                            value={formik.values.location}
                            invalid={
                              formik.touched.location && formik.errors.location
                                ? true
                                : false
                            }
                          />
                          {formik.touched.location && formik.errors.location ? (
                            <FormFeedback type="invalid">
                              {formik.errors.location}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="5" md="5">
                        <div className="mt-4">
                          <Label htmlFor="Latitude">Latitude:</Label>
                          <Input
                            className="form-control"
                            type="text"
                            disabled
                            value={lan || ""}
                          />
                        </div>
                      </Col>
                      <Col lg="5" md="5">
                        <div className="mt-4">
                          <Label htmlFor="Longitude">Longitude:</Label>
                          <Input
                            className="form-control"
                            type="text"
                            disabled
                            value={lon || ""}
                          />
                        </div>
                      </Col>
                      <Col lg="2" md="2">
                        <div className="mt-5">
                          <CurrentLoction lan={lan} lon={lon} />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={6}>
                        <div className="mt-4">
                          <Label htmlFor="Photo">Photo:</Label>
                          <Input
                            type="file"
                            className="form-control"
                            onChange={e => handleChange(e.target.files)}
                          />
                        </div>
                      </Col>
                      <Col lg={6}>
                        <div
                          className="dropzone-previews mt-4"
                          id="file-previews"
                        >
                          {files.map((f, i) => (
                            <Card
                              className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                              key={i + "-file"}
                            >
                              <div className="p-2">
                                <Row className="align-items-center">
                                  <Col className="col-auto">
                                    <img
                                      data-dz-thumbnail=""
                                      height="80"
                                      className="avatar-sm rounded bg-light"
                                      alt={f.name}
                                      src={f.preview}
                                    />
                                  </Col>
                                  <Col>
                                    {/* <Link 
                                      to="#"
                                      className="text-muted font-weight-bold"
                                    >
                                      {f.name}
                                    </Link> */}
                                    <p className="mb-0">
                                      <strong>{f.formattedSize}</strong>
                                    </p>
                                  </Col>
                                </Row>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <div className="mt-4">
                          <Label htmlFor="notes">Notes:</Label>

                          <Input
                            type="textarea"
                            id="description"
                            name="notes"
                            onChange={formik.handleChange}
                            value={formik.values.notes}
                            onBlur={formik.handleBlur}
                            rows="3"
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <div className="mt-4">
                          <Label htmlFor="notes">Phone Number:</Label>

                          <Input
                            className="form-control"
                            type="number"
                            id="contact"
                            name="contact"
                            onChange={formik.handleChange}
                            value={formik.values.contact}
                            invalid={
                              formik.touched.contact && formik.errors.contact
                                ? true
                                : false
                            }
                          />
                          {formik.touched.contact && formik.errors.contact ? (
                            <FormFeedback type="invalid">
                              {formik.errors.contact}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <div className="mt-4">
                          <Label
                            className="form-check-label"
                            htmlFor="invalidCheck"
                          >
                            Status:
                          </Label>

                          <select
                            className="form-select"
                            name="status"
                            onChange={formik.handleChange}
                            value={formik.values.status}
                          >
                            <option value="pending">Pending</option>
                            <option value="quotation">Quotation</option>
                            <option value="done">Done</option>
                            <option value="canceled">Cancelled</option>
                          </select>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <div className="mt-4">
                          <Label htmlFor="products">Product:</Label>
                          {/* <div className="col-md-8"> */}
                          <Input
                            className="form-control"
                            type="text"
                            id="products"
                            name="products"
                            onChange={formik.handleChange}
                            value={formik.values.products}
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <Col>
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg"
                        >
                          Submit
                        </button>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default index
