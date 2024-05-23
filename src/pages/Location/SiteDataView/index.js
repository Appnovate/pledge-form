import React, { useEffect, useState } from "react"
import { Container, Row, Col, Card, Badge } from "reactstrap"
import BootstrapTable from "react-bootstrap-table-next"
import moment from "moment"
import paginationFactory from "react-bootstrap-table2-paginator"
import { Link } from "react-router-dom"
import ImageView from "./ImageView"
import defaultImage from "assets/images/default.jpg"
import PropTypes from "prop-types"
function index({ data,totalCount }) {
  const [page, setPage] = useState(1)

  const [sizePerPage, setSizePerPage] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)

  let columns = [
    {
      dataField: "index",
      text: "S.No",
      dataAlign: "center",
      headerAlign: "center",
      formatter: (value, row, rowIndex) => {
        return (
          <div className="text-center">
            {(currentPage - 1) * sizePerPage + (rowIndex + 1)}
          </div>
        )
      },
    },
    {
      dataField: "attributes.userName",
      text: "Agent Name",
      headerAlign: "center",
      formatter: (value, row) => {
        return (
          <>
            <div className="text-center">{value}</div>
          </>
        )
      },
    },
    {
      dataField: "attributes.siteName",
      text: "Site Name",
      dataAlign: "center",
      headerAlign: "center",
      formatter: (value, row) => {
        return (
          <>
            <div className="text-center">{value}</div>
          </>
        )
      },
    },
    {
      dataField: "attributes.imageId",
      text: "Image",
      dataAlign: "center",
      headerAlign: "center",
      formatter: (value, row) => {
        const openImageInNewWindow = imagePath => {
          if (imagePath) {
            window.open(imagePath, "_blank")
          }
        }
        return (
          <>
            {value ? (
              <ImageView
                data={value}
                openImageInNewWindow={openImageInNewWindow}
              />
            ) : (
              <img
                style={{ width: "75px", height: "75px", cursor: "pointer" }}
                src={defaultImage}
              />
            )}
          </>
        )
      },
    },
    {
      dataField: "attributes.location",
      text: "Location",
      headerAlign: "center",
      formatter: (value, row) => {
        return (
          <>
            <div className="text-center">{value}</div>
          </>
        )
      },
    },

    {
      dataField: "attributes.status",
      text: "Status",
      headerAlign: "center",
      formatter: (value, row) => {
        return (
          <>
            <div className="text-center">
              {value === "pending" ? (
                <Badge
                  className={"font-size-12 badge-soft-warning"}
                  color="warning"
                  pill
                >
                  {value}
                </Badge>
              ) : value === "quotation" ? (
                <Badge
                  className={"font-size-12 badge-soft-secondary"}
                  color="secondary"
                  pill
                >
                  {value}
                </Badge>
              ) : value === "done" ? (
                <Badge
                  className={"font-size-12 badge-soft-success"}
                  color="success"
                  pill
                >
                  {value}
                </Badge>
              ) : value === "canceled" ? (
                <Badge
                  className={"font-size-12 badge-soft-danger"}
                  color="danger"
                  pill
                >
                  {value}
                </Badge>
              ) : null}
            </div>
          </>
        )
      },
    },

    {
      dataField: "attributes.createdAt",
      text: "Date",
      headerAlign: "center",
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
      dataField: "attributes.updatedAt",
      text: "Time",
      headerAlign: "center",
      formatter: (value, row) => {
        return (
          <>
            <div className=" text-center mt-1">
              {moment(value).format("hh:mm A")}
            </div>
          </>
        )
      },
    },
    {
      dataField: "action",
      text: "Action",
      headerAlign: "center",
      formatter: (value, row) => {
        return (
          <>
            <div className="d-flex justify-content-center gap-2">
              <Link to={`/site-edit/${row.id}`}>
                <div className="text-center">
                  {" "}
                  <i className="bx bxs-edit font-size-16 align-middle text-primary"></i>
                </div>
              </Link>
              <Link to={`/site-delete/${row.id}`}>
                <div className="text-center">
                  {" "}
                  <i className="bx bxs-trash font-size-16 align-middle text-danger"></i>
                </div>
              </Link>
            </div>
          </>
        )
      },
    },
  ]

  let handleChange = (type, { page, sizePerPage }) => {
    setPage(page)
    setSizePerPage(sizePerPage)
    setCurrentPage(page)
  }
  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            {data.length > 0 ? (
              <Row>
                <Col lg={12}>
                  <div className="m-2">
                    <BootstrapTable
                      remote
                      striped
                      hover
                      keyField="id"
                      data={data}
                      columns={columns}
                      classes={"table align-middle table-wrap"}
                      bordered={true}
                      wrapperClasses="table-responsive"
                      headerWrapperClasses={"thead-dark"}
                      onTableChange={handleChange}
                      pagination={paginationFactory({
                        page,
                        sizePerPage,
                        totalSize: totalCount,
                        showTotal: true,
                        sizePerPageList: [
                          {
                            text: "5",
                            value: 5,
                          },
                          {
                            text: "10",
                            value: 10,
                          },
                          {
                            text: "15",
                            value: 15,
                          },
                        ],
                      })}
                    />
                  </div>
                </Col>
              </Row>
            ) : (
              <div className="alert alert-secondary m-3" role="alert">
                No data available.
              </div>
            )} 
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default index

index.propTypes = {
  data: PropTypes.array,
  totalCount: PropTypes.number
}
