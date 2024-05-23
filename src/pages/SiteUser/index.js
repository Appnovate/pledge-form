import React, { useEffect, useState } from "react"
import { Container, Row, Col, Card, Badge } from "reactstrap"
import BootstrapTable from "react-bootstrap-table-next"
import moment from "moment"
import { getUsersDetails, getUsersFilterDetails } from "helpers/fakebackend_helper"
import { useAuthContext } from "context/AuthContext"
import { Link } from "react-router-dom"
import { upperCase } from "lodash"

function index() {
  const { user } = useAuthContext()
  const [isLoading, setIsLoading] = useState(false)
  const [filterProducts, setFilterProducts] = useState("")
  const [isSearchbutton, setIsSearchbutton] = useState(true)
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [sizePerPage, setSizePerPage] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)
  let getUsersData = async () => {
    setIsLoading(true)
    try {
      let res
      if (user?.role?.type === "admin") {
        res = await getUsersDetails()
      }

      if (res) {
        setData(res)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    getUsersData()
  }, [])
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
      dataField: "username",
      text: "Name",
      headerAlign: "center",
      formatter: (value, row) => {
        return (
          <>
            <div className="text-center">{upperCase(value)}</div>
          </>
        )
      },
    },
    {
      dataField: "email",
      text: "Email",
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
      dataField: "role.name",
      text: "Role",
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
      dataField: "confirmed",
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
      dataField: "createdAt",
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
      dataField: "updatedAt",
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
              <Link to={`/edit-user/${row.id}`}>
                <div className="text-center">
                  {" "}
                  <i className="bx bxs-edit font-size-16 align-middle text-primary"></i>
                </div>
              </Link>
              <Link to={`/delete-user/${row.id}`}>
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
  const handleSearch = async () => {
    if (filterProducts) {
      setIsSearchbutton(!isSearchbutton)
      let res = await getUsersFilterDetails(filterProducts)
    setData(res)
    }
  }

  const handleClearSearch = async () => {
    setIsSearchbutton(!isSearchbutton)
    setFilterProducts("")
    getUsersData()
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
                    lg={4}
                    md={4}
                    sm={12}
                    className="d-flex justify-content-lg-start justify-content-md-start -content-sm-center align-items-center"
                  >
                    <div className="h2">Users</div>
                  </Col>
                  <Col
                    lg={4}
                    md={4}
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
                  <Col
                    lg={4}
                    md={4}
                    sm={12}
                    className="d-flex justify-content-lg-end justify-content-md-end justify-content-sm-center align-items-center"
                  >
                    <div className="d-flex align-items-center gap-2 my-1">
                      <Link
                        to="/create-users"
                        className="btn btn-primary btn-md"
                      >
                        Create User
                      </Link>
                    </div>
                  </Col>
                </Row>

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
                          //   pagination={paginationFactory({
                          //     page,
                          //     sizePerPage,
                          //     totalSize: totalCount,
                          //     showTotal: true,
                          //     sizePerPageList: [
                          //       {
                          //         text: "5",
                          //         value: 5,
                          //       },
                          //       {
                          //         text: "10",
                          //         value: 10,
                          //       },
                          //       {
                          //         text: "15",
                          //         value: 15,
                          //       },
                          //     ],
                          //   })}
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
