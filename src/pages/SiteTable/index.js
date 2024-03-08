import React, { useEffect, useState } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Badge,
} from "reactstrap"
import BootstrapTable from "react-bootstrap-table-next"
import moment from "moment"
import paginationFactory from "react-bootstrap-table2-paginator"
import { getSiteFilter, getSitePagination } from "helpers/fakebackend_helper"

function index() {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [sizePerPage, setSizePerPage] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)
  const [isSearchbutton, setIsSearchbutton] = useState(true)
  const [filterProducts, setFilterProducts] = useState("")
  let getCartData = async () => {
    try {
      let res = await getSitePagination(page, sizePerPage)
      setData(res.data)
      setTotalCount(res.meta.pagination.total)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getCartData()
  }, [page, sizePerPage])

  let columns = [
    {
      dataField: "index",
      text: "S.No",
      dataAlign: "center",
      headerAlign: "center",
      formatter: (value, row, rowIndex) => {
        return (<div className="text-center">{(currentPage - 1) * sizePerPage + (rowIndex + 1)}</div>)
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
            <div className="text-center">
              {value}
            </div>
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
            <div className="text-center">
              {value}
            </div>
          </>
        )
      },
    },
    {
      dataField: "attributes.agentName",
      text: "Agent Name",
      headerAlign: "center",
      formatter: (value, row) => {
        return (
          <>
            <div className="text-center">
              {value}
            </div>
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
            {value ? (
              <div className="text-success text-center">
                <i className="bx bx-check-circle font-size-15"></i>
              </div>
            ) : (
              <div className="text-danger text-center">
                <i className="bx bx-x-circle font-size-15"></i>
              </div>
            )}
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
  ]
  let getFilterData = async () => {
    try {
      let res = await getSiteFilter(filterProducts)
      setData(res.data)
      setTotalCount(res.meta.pagination.total)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSearch = async () => {
    if (filterProducts) {
      setIsSearchbutton(!isSearchbutton)
      getFilterData()
    }
  }

  const handleClearSearch = async () => {
    setIsSearchbutton(!isSearchbutton)
    setFilterProducts("")
    getCartData()
  }
  let handleChange = (type, { page, sizePerPage }) => {
    setPage(page)
    setSizePerPage(sizePerPage)
    setCurrentPage(page)
  }
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* <Row>
            <Col lg={12}> */}
          <Row>
            <Col>
              <Card>
                <Row className="m-3">
                  <Col
                    lg={6}
                    md={6}
                    sm={12}
                    className="d-flex justify-content-lg-start justify-content-sm-center align-items-center"
                  >
                    <div className="h2">Sites</div>
                  </Col>
                  <Col
                    lg={6}
                    md={6}
                    sm={12}
                    className="d-flex justify-content-lg-end justify-content-sm-center align-items-center"
                  >
                    <div className="d-flex align-items-center gap-2">
                      <div className="search-box text-right">
                        <div className="position-relative">
                          <input
                            type="text"
                            className="form-control border-2"
                            placeholder="Search..."
                            value={filterProducts}
                            onChange={e => setFilterProducts(e.target.value)}
                          />
                          <i className="bx bx-search-alt search-icon" />
                        </div>
                      </div>

                      {isSearchbutton ? (
                        <button
                          type="button"
                          className="btn btn-primary btn-lg"
                          onClick={handleSearch}
                        >
                          Search
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-secondary btn-lg"
                          onClick={handleClearSearch}
                        >
                          Clear Search
                        </button>
                      )}
                    </div>
                  </Col>
                </Row>
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
              </Card>
            </Col>
          </Row>
          {/* </Col>
          </Row> */}
        </Container>
      </div>
    </React.Fragment>
  )
}

export default index
