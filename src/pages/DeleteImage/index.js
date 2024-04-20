import { deleteImage, editSite, getSiteById } from "helpers/fakebackend_helper"
import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { Col, Container, Row } from "reactstrap"
import Swal from "sweetalert2"

function index() {
  const history = useHistory()
  let params = useParams()
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchData = async () => {
      try {
        let res = await getSiteById(params.id)
        setData(res.data.attributes)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleDelete = async () => {
    // Only proceed if data has been loaded
    if (loading) return

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
        const response = await deleteImage(data.imageId)

        if (response) {
          let res = await editSite(params.id, { data: { imageId: null } })
          console.log(res)
        }

        await Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        })

        history.replace(`/site-edit/${params.id}`)
      } catch (error) {
        await Swal.fire("Error!", "Failed to delete!", error.response.data.error.message)
      }
    } else {
      await Swal.fire("Cancelled", "Your file is safe :)", "info")
      history.replace(`/site-edit/${params.id}`)
    }
  }

  useEffect(() => {
    if (!loading) {
      handleDelete()
    }
  }, [loading])

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
