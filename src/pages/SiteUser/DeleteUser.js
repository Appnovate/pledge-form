import { deleteUsersDetailsById } from "helpers/fakebackend_helper"
import React, { useEffect } from "react"
import { useHistory, useParams } from "react-router-dom"
import { Col, Container, Row } from "reactstrap"
import Swal from "sweetalert2"

function DeleteUser() {
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
        const response = await deleteUsersDetailsById(params.id)

        await Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        })

        history.replace("/site-users")
      } catch (error) {
        await Swal.fire("Error!", "Failed to delete!", error.response.data.error.message)
      }
    } else {
      await Swal.fire("Cancelled", "Your file is safe :)", "info")
      history.replace("/site-users")
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

export default DeleteUser
