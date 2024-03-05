import axios from "axios"
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

function Pledge() {
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState({})
  // const [redirectToUserView, setRedirectToUserView] = useState(false)

  let history = useHistory()

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      city: "",
      isCheck: false,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Please Enter Your Name"),
      email: Yup.string().email("Please Enter a Valid Email").required("Please Enter Your Email"),
      phone: Yup.string()
        .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
        .required("Please Enter Your Mobile Number"),
      isCheck: Yup.boolean().oneOf([true], "This is a required question"),
    }),
    onSubmit: async values => {
      setIsLoading(true)
      try {
        let response = await axios.post(
          `http://localhost:1337/api/pledge-users`,
          { data: values }
        )
        if (response) {
          if (response) {
            const userName = response.data.data.attributes.name
            setUser(userName) 
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Successfully Plegde",
              showConfirmButton: false,
              timer: 1500
            });
            history.push("/certificate", { userName })
          }
        }
      } catch (error) {
        console.error("Error:", error.response)
        if (error.response && error.response.status === 400) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "User Already Register",
            showConfirmButton: false,
            timer: 1500
          });
          history.push("/pledgeIndex")
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "An error occurred. Please try again later.",
            showConfirmButton: false,
            timer: 1500
          });
          history.push("/pledgeIndex")
        }
      } finally {
        setIsLoading(false)
      }
    },
  })

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
        {/* <MetaTags>
        <title>Dashboard | Skote - React Admin & Dashboard Template</title>
      </MetaTags> */}
        <Container fluid>
          <div className="d-flex flex-column align-items-center justify-content-center">
            <p className="display-6">Road Safety Pledge</p>
            <p>Pledge for a Safer India!</p>
          </div>

          <Row className="d-flex justify-content-center align-items-center mb-4 ">
            <Col lg={6}>
              <Card className="rounded-4">
                <CardBody className="justify-content-center">
                  <Form onSubmit={formik.handleSubmit}>
                    <Row className="">
                      <Col>
                        <div className="mt-4">
                          <Label htmlFor="name">Full Name:*</Label>
                          {/* <div className="col-md-8"> */}
                          <Input
                            className="form-control"
                            type="text"
                            id="name"
                            name="name"
                            onChange={formik.handleChange}
                            value={formik.values.name}
                            invalid={
                              formik.touched.name && formik.errors.name
                                ? true
                                : false
                            }
                          />
                          {formik.touched.name && formik.errors.name ? (
                            <FormFeedback type="invalid">
                              {formik.errors.name}
                            </FormFeedback>
                          ) : null}
                          {/* </div>/ */}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <div className="mt-4">
                          <Label htmlFor="email">Email:*</Label>
                          {/* <div className="col-md-8"> */}
                          <Input
                            className="form-control"
                            type="text"
                            id="email"
                            name="email"
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            invalid={
                              formik.touched.email && formik.errors.email
                                ? true
                                : false
                            }
                          />
                          {formik.touched.email && formik.errors.email ? (
                            <FormFeedback type="invalid">
                              {formik.errors.email}
                            </FormFeedback>
                          ) : null}
                          {/* </div> */}
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <div className="mt-4">
                          <Label htmlFor="phone">Mobile Number:*</Label>
                          {/* <div className="col-md-8"> */}
                          <Input
                            className="form-control"
                            type="Number"
                            id="phone"
                            name="phone"
                            onChange={formik.handleChange}
                            value={formik.values.phone}
                            invalid={
                              formik.touched.phone && formik.errors.phone
                                ? true
                                : false
                            }
                          />
                          {formik.touched.phone && formik.errors.phone ? (
                            <FormFeedback type="invalid">
                              {formik.errors.phone}
                            </FormFeedback>
                          ) : null}
                          {/* </div> */}
                        </div>
                      </Col>
                    </Row>
                    <Row className="">
                      <Col>
                        <div className="mt-4">
                          <Label htmlFor="city">City:</Label>
                          {/* <div className="col-md-8"> */}
                          <Input
                            className="form-control"
                            type="text"
                            id="city"
                            name="city"
                            onChange={formik.handleChange}
                            value={formik.values.city}
                          />
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <div className="mt-4">
                          <Label>Take Pledge:*</Label>
                          <FormGroup className="mb-3">
                            <div className="form-check">
                              <Input
                                name="isCheck"
                                type="checkbox"
                                className="form-check-input"
                                id="invalidCheck"
                                value={formik.values.isCheck}
                                onChange={formik.handleChange}
                                invalid={
                                  formik.touched.isCheck &&
                                  formik.errors.isCheck
                                    ? true
                                    : false
                                }
                              />
                              <Label
                                className="form-check-label"
                                htmlFor="invalidCheck"
                              >
                                {" "}
                                Today, I pledge to always wear a helmet while
                                riding a two-wheeler, never drink and drive,
                                always wear a seatbelt while driving a car,
                                never text or talk on the phone while driving,
                                always obey traffic rules, and act as a Good
                                Samaritan to help road accident victims.
                              </Label>
                            </div>
                          </FormGroup>
                          {formik.touched.isCheck && formik.errors.isCheck ? (
                            <FormFeedback type="invalid">
                              {formik.errors.isCheck}
                            </FormFeedback>
                          ) : null}
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

export default Pledge
