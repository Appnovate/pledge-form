import React from 'react'
import MetaTags from "react-meta-tags"
import { Link } from "react-router-dom"
import { Container } from "reactstrap"

function index() {
    return (
        <React.Fragment>
          <div className="page-content">
            <MetaTags>
              {/* <title>Dashboard | Skote - React Admin & Dashboard Template</title> */}
            </MetaTags>
            <Container fluid>
              <div className="d-flex flex-column align-items-center justify-content-center">
                <p className="display-3">Road Safety Pledge</p>
                <p className="display-6">E-Pledge Madurai 2024</p>
                <Link to={"/pledge"} className="btn btn-primary">Take Pledge</Link>
              </div>
            </Container>
          </div>
          {/* <h4>Dashboard</h4> */}
          {/* style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; */}
        </React.Fragment>
      )
}

export default index