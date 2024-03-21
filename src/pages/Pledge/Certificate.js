import React, { useState } from "react"
import { useLocation, useHistory } from "react-router-dom"
import { Container } from "reactstrap"
import jsPDF from "jspdf"
import images from "assets/images/certificate-background.png" // Update with your image path
import Swal from "sweetalert2"
function Certificate() {
  const location = useLocation()
  const history = useHistory()
  const userName = location.state?.userName
  const [loading, setLoading] = useState(false)

  const generateCertificate = async name => {
    setLoading(true)
    const doc = new jsPDF()
    doc.addImage(
      images,
      "PNG",
      0,
      0,
      doc.internal.pageSize.getWidth(),
      doc.internal.pageSize.getHeight()
    )
    doc.setFontSize(36)
    doc.setFont("helvetica")
    doc.text(name, 105, 160, { align: "center" })
    doc.save(`${name}.pdf`)
    setLoading(false)
  }

  const handleClick = () => {
    generateCertificate(userName)
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Certificate download Successfully",
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      history.replace({ ...history.location, state: null })
    })
  }
  const handleBack = () => {
    history.push("/pledgeIndex")
  }
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {loading ? (
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
          <div className="d-flex flex-column align-items-center justify-content-center">
            <p className="display-3">Road Safety Pledged Succesfully</p>
            <p className="display-6">Download your Certificate</p>

            <div className="d-flex ">
              <button onClick={handleBack} className="btn btn-secondary mx-2">
                Back
              </button>

              <button onClick={handleClick} className="btn btn-primary">
                Download
              </button>
            </div>
          </div>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Certificate
