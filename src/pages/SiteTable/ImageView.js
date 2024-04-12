import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import defaultImage from "assets/images/default.jpg"
import { getImageById } from "helpers/fakebackend_helper"
function ImageView({ data, openImageInNewWindow }) {
  const [imagePath, setImagePath] = useState(null)
  useEffect(async () => {
    try {
      let response = await getImageById(data)
      if (response) {
        setImagePath(response.url)
      }
    } catch (error) {
      console.log(error)
    }
  }, [data])

  return (
    <div>
      {imagePath ? (
        <img
          src={imagePath}
          alt="imagePath"
          style={{ width: "75px", height: "75px", cursor: "pointer" }}
          onClick={() => openImageInNewWindow(imagePath)}
        />
      ) : (
        <img style={{ width: "75px", height: "75px" }} src={defaultImage} />
      )}
    </div>
  )
}

export default ImageView
ImageView.propTypes = {
  data: PropTypes.number,
  openImageInNewWindow: PropTypes.func,
}
