import { Marker, Tooltip } from "react-leaflet"
import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import Leaflet from "leaflet"
import defaultImage from "assets/images/default.jpg"
import { getImageById } from "helpers/fakebackend_helper"
import marker2x from "assets/images/Map-Marker-PNG-Pic.png"
import marker2xShadow from "assets/images/marker-shadow.png"
import { Card, CardBody, CardImg, CardSubtitle, CardTitle } from "reactstrap"
function MapImage({ data }) {
  const [imagePath, setImagePath] = useState(null)
  const customIcon = new Leaflet.Icon({
    iconUrl: marker2x,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: marker2xShadow,
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
  })
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
  const openImageInNewWindow = imagePath => {
    if (imagePath) {
      window.open(imagePath, "_blank")
    }
  }
  return (
    <>
      <Marker
        key={data.id}
        position={{
          lat: data.attributes.latitude,
          lng: data.attributes.longitude,
        }}
        onClick={() => openImageInNewWindow(imagePath)}
        icon={customIcon}
      >
        <Tooltip>
          {imagePath ? (
            <Card>
              {/* <CardBody> */}
                <CardTitle>Agent Name:{data.attributes.userName}</CardTitle>
                <CardTitle className="font-14">
                  Site Name:{data.attributes.siteName}
                </CardTitle>
              {/* </CardBody> */}
              <CardImg className="img" src={imagePath} alt="Skote" />
            </Card>
          ) : (
            <Card>
              {/* <CardBody> */}
                <CardTitle>Agent Name:{data.attributes.userName}</CardTitle>
                <CardTitle className="font-14">
                  Site Name:{data.attributes.siteName}
                </CardTitle>
              {/* </CardBody> */}
              <CardImg className="img" src={defaultImage} alt="Skote" />
            </Card>
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
