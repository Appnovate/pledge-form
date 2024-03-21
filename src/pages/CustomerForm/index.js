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
import { addNewSite, getUserId } from "helpers/fakebackend_helper"
import axios from "axios"
function index() {
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState()
  const [lan, setLan] = useState()
  const [lon, setLon] = useState()

  let history = useHistory()
  useEffect(async () => {
    let res = await getUserId()
    setUserId(res.id)
  }, [])
  const formik = useFormik({
    initialValues: {
      siteName: "",
      agentName: "",
      location: "",
      notes: "",
      status: "pending",
      products: "",
    },
    validationSchema: Yup.object().shape({
      siteName: Yup.string().required("Please Enter Your Name"),
      location: Yup.string().required("Please Enter location"),
    }),
    onSubmit: async values => {
      if (lan && lon) {
        values.latitude = lan
        values.longitude = lon
        values.userId = userId
      } else {
        Swal.fire({
          position: "center",
          icon: "info",
          title: "Please turn on your location",
          showConfirmButton: false,
          timer: 1500,
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
            "http://localhost:1337/api/upload",
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
          history.push("/site-view")
        }
      } catch (error) {
        console.error("Error:", error)
        Swal.fire({
          position: "center",
          icon: "error",
          title: "An error occurred. Please try again later.",
          showConfirmButton: false,
          timer: 1500,
        })
        history.push("/dashboard")
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
  }, [])
  let handleChange = e => {
    const file = e.target.files[0]
    //  setImage(e.target.files[0])
    formik.setFieldValue("image", file)
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
                      <Col lg={6}>
                        <div className="mt-4">
                          <Label htmlFor="location">Photo:</Label>
                          <input
                            type="file"
                            onChange={e => {
                              handleChange(e)
                            }}
                          />
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
                          <Label htmlFor="notes">Agent Name:</Label>

                          <Input
                            className="form-control"
                            type="text"
                            id="agentName"
                            name="agentName"
                            onChange={formik.handleChange}
                            value={formik.values.agentName}
                          />
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
                            Status
                          </Label>

                          <select
                            className="form-control"
                            name="status"
                            onChange={formik.handleChange}
                            value={formik.values.status}
                          >
                            <option value="pending">Pending</option>
                            <option value="quotation">Quotation</option>
                            <option value="done">Done</option>
                            <option value="canceled">Canceled</option>
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
