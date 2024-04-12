import { deleteImage, deleteSite } from "helpers/fakebackend_helper"
import React, { useEffect } from "react"
import { useHistory, useParams } from "react-router-dom"
import { Col, Container, Row } from "reactstrap"
import Swal from "sweetalert2"

function index() {
  const history = useHistory()
  let params = useParams()
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    })

    if (result.isConfirmed) {
      try {
        const response = await deleteSite(params.id)
        if (response && response.data.attributes.imageId) {
          await deleteImage(response.data.attributes.imageId)
        }
        await Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        })

        history.replace("/site-view")
      } catch (error) {
        await Swal.fire("Error!", "Failed to delete!", "error")
      }
    } else {
      await Swal.fire("Cancelled", "Your file is safe :)", "info")
      history.replace("/site-view")
    }
  }

  useEffect(() => {
    handleDelete()
  }, [history])

  return (
    <React.Fragment>
      <div className="page-content ">
        <Container fluid={true}>
          <Row>
            <Col className="col-12"></Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default index
