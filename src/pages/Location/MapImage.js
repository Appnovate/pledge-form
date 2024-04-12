import { Marker, Tooltip } from "react-leaflet"
import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import axios from "axios"
import defaultImage from "assets/images/default.jpg"
import { getImageById } from "helpers/fakebackend_helper"

function MapImage({ data }) {
  const [imagePath, setImagePath] = useState(null)

  useEffect(() => {
    const fetchImage = async () => {
      try {
        if (data && data.attributes.imageId) {
          
          let response = await getImageById(data.attributes.imageId)
          if (response) {
            setImagePath(response.url)
          }
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchImage()
  }, [data])
  const openImageInNewWindow = (imagePath) => {
    if (imagePath) {
      window.open(imagePath, "_blank");
    }
  };
  return (
    <>
      <Marker
        key={data.id}
        position={[data.attributes.latitude, data.attributes.longitude]}
        onClick={()=>openImageInNewWindow(imagePath)}
      >
        <Tooltip>
          {imagePath ? (
            <img
              src={imagePath}
              alt=""
              style={{ width: "75px", height: "75px" }}
            />
          ) : (
            <img
              src={defaultImage}
              alt=""
              style={{ width: "75px", height: "75px" }}
            />
          )}
        </Tooltip>
      </Marker>
    </>
  )
}

export default MapImage

MapImage.propTypes = {
  data: PropTypes.any,
}
