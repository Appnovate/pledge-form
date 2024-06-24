import React, { useState } from "react"
import PropTypes from "prop-types"
import Leaflet from "leaflet"
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap"
import { Map, TileLayer, Marker } from "react-leaflet"
import marker2x from "assets/images/Map-Marker-PNG-Pic.png"
import marker2xShadow from "assets/images/marker-shadow.png"
import "../../../node_modules/leaflet/dist/leaflet.css"

function CurrentLocation({ lan, lon }) {
  const [modal, setModal] = useState(false)

  const toggle = () => setModal(!modal)

  const customIcon = new Leaflet.Icon({
    iconUrl: marker2x,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: marker2xShadow,
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
  })

  return (
    <>
      <Button color="primary" className="btn-md" onClick={toggle}>
        View
      </Button>
      <Modal isOpen={modal} toggle={toggle} size="lg">
        <ModalHeader toggle={toggle}>Current Location</ModalHeader>
        <ModalBody>
          <div
            id="leaflet-map"
            className="leaflet-map"
            style={{ height: "400px" }}
          >
            <Map center={[lan, lon]} zoom={13} style={{ height: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[lan, lon]} icon={customIcon}></Marker>
            </Map>
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}

export default CurrentLocation

CurrentLocation.propTypes = {
  lan: PropTypes.any,
  lon: PropTypes.number,
}
