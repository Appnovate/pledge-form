import React, { useEffect, useState } from "react"
import { Container, Row, Col, Card, CardBody, CardTitle } from "reactstrap"
import BootstrapTable from "react-bootstrap-table-next"
import { getTasks } from "helpers/fakebackend_helper"
import moment from "moment"
function index() {
  const [data, setData] = useState([])
  const [meta, setMeta] = useState({})

  let getCartData = async () => {
    try {
      let res = await getTasks()
      setData(res.data)
      setMeta(res.meta.pagination)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getCartData()
  }, [])

  let columns = [
    {
      dataField: "index",
      text: "S.No",
      dataAlign: "center",
      headerAlign: "center",
      // formatter: (value, row, rowIndex) => {
      //   return (currentPage - 1) * sizePerPage + (rowIndex + 1)
      // },
    },
    {
      dataField: "id",
      text: "UserId",
    },
    {
      dataField: "attributes.name",
      text: "Name",
    },
    {
      dataField: "attributes.email",
      text: "Email",
    },
    {
      dataField: "attributes.phone",
      text: "Phone Number",
    },
    {
      dataField: "attributes.ctiy",
      text: "Ctiy",
      formatter: (value, row) => {
        return (
          <>
            {value ? (
              <div className="text-center">{value}</div>
            ) : (
              <div className="text-center">-</div>
            )}
          </>
        )
      },
    },

    {
      dataField: "attributes.time",
      text: "Date",
      formatter: (value, row) => {
        return (
          <>
            <div className="text-center">
              {moment(value).format("MMM DD, YYYY")}
            </div>
          </>
        )
      },
    },
    {
      dataField: "attributes.date",
      text: "Time",
      formatter: (value, row) => {
        return (
          <>
            <div className=" text-center mt-1">
              {moment(value).format("hh:mm:ss A")}
            </div>
          </>
        )
      },
    },

    {
      dataField: "attributes.isCheck",
      text: "Pledge",
    },
  ]

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Row>
                {/* {reports.map((report, key) => ( */}
                <Col lg="4">
                  <Card className="mini-stats-wid">
                    <CardBody>
                      <div className="d-flex">
                        <div className="flex-grow-1">
                          <p className="text-muted fw-medium">Total User</p>
                          <h4 className="mb-0">{meta.total}</h4>
                        </div>
                        <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                          <span className="avatar-title rounded-circle bg-primary">
                            <i className={"bx bx-copy-alt  font-size-24"}></i>
                          </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                {/* ))} */}
              </Row>
              <Row>
                <Col>
                  <Card>
                    <Row>
                      <Col lg={4} md={4} className="m-2">
                        <CardTitle className="mt-2">Recent Users</CardTitle>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12}>
                        <div className="table-responsive m-2">
                          <BootstrapTable
                            striped
                            hover
                            keyField="id"
                            data={data}
                            columns={columns}
                          />
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default index
