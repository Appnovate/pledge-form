import React, { useEffect, useState } from "react"
import { Container, Row, Col, Card, Badge } from "reactstrap"
import BootstrapTable from "react-bootstrap-table-next"
import moment from "moment"
import paginationFactory from "react-bootstrap-table2-paginator"
import { getSiteFilter, getSitePagenation } from "helpers/fakebackend_helper"
import { useAuthContext } from "context/AuthContext"
import { Link } from "react-router-dom"
import ImageView from "./ImageView"
import defaultImage from "assets/images/default.jpg"

function index() {
  const { user } = useAuthContext()
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [sizePerPage, setSizePerPage] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)
  const [isSearchbutton, setIsSearchbutton] = useState(true)
  const [filterProducts, setFilterProducts] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  let getCartData = async () => {
    setIsLoading(true)
    try {
      let res
      if (user?.role?.type === "admin") {
        res = await getSitePagenation(null, page, sizePerPage)
      } else if (user && user.id) {
        res = await getSitePagenation(user.id, page, sizePerPage)
      }

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
    // Only call getCartData if user is defined
    if (user) {
      getCartData()
    }
  }, [user, page, sizePerPage])

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
  let getFilterData = async () => {
    setIsLoading(true)
    try {
      let res = await getSiteFilter(user.id, filterProducts)
      setData(res.data)
      setTotalCount(res.meta.pagination.total)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
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
          <Row>
            <Col>
              <Card>
                <Row className="m-3">
                  <Col
                    lg={6}
                    md={6}
                    sm={12}
                    className="d-flex  justify-content-lg-start justify-content-md-start justify-content-sm-center align-items-center"
                  >
                    {/* <div className="m-sm-2" > */} 
                     <Link to={"/create-site"}>
                     <button className="btn btn-success btn-md my-1">
                        Create Site
                      </button>
                     </Link>
                    {/* </div> */}
                  </Col>
                  <Col
                    lg={6}
                    md={6}
                    sm={12}
                    className="d-flex justify-content-lg-end justify-content-md-end justify-content-sm-center align-items-center"
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
                          className="btn btn-primary btn-md"
                          onClick={handleSearch}
                        >
                          Search
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-secondary btn-md"
                          onClick={handleClearSearch}
                        >
                          Clear Search
                        </button>
                      )}
                    </div>
                  </Col>
                </Row>

                {/* <Row className="mx-3">
                <Col
                    lg={6}
                    md={6}
                    sm={12}
                    className="d-flex justify-content-lg-start justify-content-sm-center align-items-center"
                  >
                    <div >
                      <h2>Sites</h2>
                    </div>
                  </Col>
                </Row> */}
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
                  <div className="alert alert-secondary m-2" role="alert">
                    No data available.
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default index
