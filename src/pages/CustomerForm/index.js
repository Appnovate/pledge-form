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
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap"
import * as Yup from "yup"
import Swal from "sweetalert2"
// import Dropzone from "react-dropzone"
import { addNewSite } from "helpers/fakebackend_helper"
function index() {
  const [isLoading, setIsLoading] = useState(false)
  // const [data, setData] = useState({})
  // const [redirectToUserView, setRedirectToUserView] = useState(false)

  let history = useHistory()

  const formik = useFormik({
    initialValues: {
      siteName: "",
      agentName: "",
      location: "",
      notes: "",
      status: false,
      products: "",
    },
    validationSchema: Yup.object().shape({
      siteName: Yup.string().required("Please Enter Your Name"),
      location: Yup.string().required("Please Enter location"),
    }),
    onSubmit: async values => {
      console.log(values)
      setIsLoading(true)
      try {
        // let formData = new FormData();
        // formData.append('data', JSON.stringify(values));
        // if (values.photo) {
        //     formData.append('files.photo', values.photo[0]);
        // } else {
        //     formData.append('files.photo', ''); // Append empty string if photo is not provided
        // }
        // console.log("formData", formData);
        // // Use the correct endpoint for uploading files
        // let response = await fetch('http://localhost:1337/api/upload', {
        //     method: 'post',
        //     body: formData
        // });
        // console.log("response",response);
        let response = await addNewSite({ data: values })
        console.log("response", response)
        if (response) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Successfully Plegde",
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

  const handleChange = files => {
    if (files && files.length > 0) {
      const file = files[0]
      const formattedFile = Object.assign({}, file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
      console.log(formattedFile)
      // Use formattedFile or setFile(formattedFile) depending on your requirement
    }
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
          {/* <div className="d-flex flex-column align-items-center justify-content-center">
            <p className="display-6">Road Safety Pledge</p>
            <p>Pledge for a Safer India!</p>
          </div> */}

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
                    {/* <div className="mt-4">
                      <h5>
                        Prize Images:<span className="text-danger"> *</span>
                      </h5>
                    </div> */}
                    <Row>
                      <Col lg={6}>
                        <div className="mt-4">
                          <Label htmlFor="location">Photo:</Label>
                          <input
                            type="file"
                            onChange={e => {
                              handleChange(e.target.files)
                            }}
                          />
                        </div>
                      </Col>
                      {/* <Col lg={6}>
                        <div
                          className="dropzone-previews mt-3"
                          id="file-previews"
                        >
                          {/* {file.map((f, i) => {
                            return (
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
                                      <Link
                                        to="#"
                                        className="text-muted font-weight-bold"
                                      >
                                        {f.name}
                                      </Link>
                                      <p className="mb-0">
                                        <strong>{f.formattedSize}</strong>
                                      </p>
                                    </Col>
                                  </Row>
                                </div>
                              </Card>
                            )
                          })} */}
                      {/* </div>
                      </Col> */}
                    </Row>
                    <Row>
                      <Col>
                        <div className="mt-4">
                          <Label htmlFor="notes">Notes:</Label>
                          {/* <div className="col-md-8"> */}
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
                          {/* <div className="col-md-8"> */}
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
                          <FormGroup>
                            <div className="form-check">
                              <select className="form-control">
                                <option>Select</option>
                                <option>Large select</option>
                                <option>Small select</option>
                              </select>
                              <Label
                                className="form-check-label"
                                htmlFor="invalidCheck"
                              >
                                Status
                              </Label>
                            </div>
                          </FormGroup>
                          {formik.touched.status && formik.errors.status ? (
                            <FormFeedback type="invalid">
                              {formik.errors.status}
                            </FormFeedback>
                          ) : null}
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
