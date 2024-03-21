import React, { useEffect, useState } from "react"
import { Container, Row, Col, Card, CardBody } from "reactstrap"
import { getSite, getTasks } from "helpers/fakebackend_helper"
import { Link } from "react-router-dom"
function index() {
  const [totalCount, setTotalCount] = useState(0)
  const [totalSite, setTotalSite] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  let getTasksData = async () => {
    setIsLoading(true)
    try {
      let res = await getTasks()

      setTotalCount(res.meta.pagination.total)
    } catch (error) {
      console.log(error)
    }finally{
      setIsLoading(false)
    }
  }
  let getSiteData = async () => {
    try {
      let res = await getSite()

      setTotalSite(res.meta.pagination.total)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getTasksData()
    getSiteData()
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
          <Row>
            <Col lg={12}>
              <Row>
                <Col lg="4">
                  <Link to={"/pledge-users"}>
                    <Card className="mini-stats-wid">
                      <CardBody>
                        <div className="d-flex">
                          <div className="flex-grow-1">
                            <p className="text-muted fw-medium">Total User</p>
                            <h4 className="mb-0">{totalCount}</h4>
                          </div>
                          <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                            <span className="avatar-title rounded-circle bg-primary">
                              <i className={"bx bx-user font-size-24"}></i>
                            </span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Link>
                </Col>
              
                <Col lg="4">
                  <Link to={"/create-site"}>
                    <Card className="mini-stats-wid">
                      <CardBody>
                        <div className="d-flex">
                          <div className="flex-grow-1">
                            <p className="text-muted fw-medium">Create Site</p>
                            <h4 className="mb-0">{totalSite}</h4>
                          </div>
                          <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                            <span className="avatar-title rounded-circle bg-primary">
                              <i className={"bx bx-user font-size-24"}></i>
                            </span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Link>
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
