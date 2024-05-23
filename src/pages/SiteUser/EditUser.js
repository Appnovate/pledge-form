import { useFormik } from "formik"
import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
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
import {
  getRole,
  getUsersDetailsById,
  updateUsersDetailsById,
} from "helpers/fakebackend_helper"

function EditUser() {
  const params = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isrole, setIsRole] = useState([])
  let history = useHistory()
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmed: false,
      blocked: false,
      role: { connect: [] },
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().required("Please Enter Your username"),
      email: Yup.string()
        .required("Please Enter Your Email")
        .email("Invalid email address"),
    }),
    onSubmit: async values => {
      setIsLoading(true)
      try {
        values.role.connect = [{ id: values.role.id }]
        let res = await updateUsersDetailsById(params.id, {
          ...values,
          role: {
            connect: values.role.connect,
            disconnect: [],
          },
        })

        if (res) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Edited User Successfully",
            showConfirmButton: false,
            timer: 1500,
          })
          history.push("/site-users")
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
        history.push("site-users")
      } finally {
        setIsLoading(false)
      }
    },
  })
  useEffect(() => {
    const fetchData = async () => {
      try {
        let res = await getRole()

        setIsRole(res.roles)
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [])
  useEffect(() => {
    const getUserData = async () => {
      try {
        let res = await getUsersDetailsById(params.id)

        formik.setValues(res)
      } catch (error) {
        console.log(error)
      }
    }

    getUserData()
  }, [])

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
                          <Label htmlFor="username">User Name:*</Label>

                          <Input
                            className="form-control"
                            type="text"
                            id="username"
                            name="username"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.username}
                            invalid={
                              formik.touched.username && formik.errors.username
                                ? true
                                : false
                            }
                          />
                          {formik.touched.username && formik.errors.username ? (
                            <FormFeedback type="invalid">
                              {formik.errors.username}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <div className="mt-4">
                          <Label htmlFor="email">Email:*</Label>

                          <Input
                            className="form-control"
                            type="email"
                            id="email"
                            name="email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
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
                            Role
                          </Label>

                          <select
                            className="form-select"
                            name="role"
                            onBlur={formik.handleBlur}
                            onChange={e => {
                              const selectedRole = isrole.find(
                                role => role.id === parseInt(e.target.value)
                              )
                              formik.setFieldValue("role", selectedRole || {})
                            }}
                            value={
                              formik.values.role ? formik.values.role.id : ""
                            }
                          >
                            <option value="">Select Role</option>

                            {/* Add a default option */}
                            <option value={1}>{"User"}</option>
                            <option value={3}>{"Admin"}</option>
                          </select>
                          {formik.touched.role && formik.errors.role ? (
                            <FormFeedback type="invalid">
                              {formik.errors.role}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <div className="mt-4">
                          <Label className="form-check-label">Confirmed</Label>

                          <select
                            className="form-select"
                            name="confirmed"
                            value={formik.values.confirmed}
                            onChange={formik.handleChange}
                          >
                            <option value={true}>True</option>
                            <option value={false}>False</option>
                          </select>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <div className="mt-4">
                          <Label className="form-check-label">Blocked</Label>

                          <select
                            className="form-select"
                            name="blocked"
                            value={formik.values.blocked}
                            onChange={formik.handleChange}
                          >
                            <option value={true}>True</option>
                            <option value={false}>False</option>
                          </select>
                        </div>
                      </Col>
                    </Row>

                    <Row className="mt-4">
                      <Col>
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg"
                          disabled={formik.isSubmitting}
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

export default EditUser
