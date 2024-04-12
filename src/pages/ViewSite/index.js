// import { logDOM } from "@testing-library/react"
// import { getSiteById } from "helpers/fakebackend_helper"
// import React, { useEffect, useState } from "react"
// import { useParams } from "react-router-dom"
// import { Card, CardBody, CardImg } from "reactstrap"
// import defaultImage from "assets/images/default.jpg"
// import axios from "axios"
// function index() {
//   let { id } = useParams()
//   const [isLoading, setIsLoading] = useState(false)
//   const [data, setData] = useState()
//   const [imagePath, setImagePath] = useState(null)
//   console.log(data)
//   useEffect(async () => {
//     try {
//       setIsLoading(true)
//       if (id) {
//         let res = await getSiteById(id)
//         // setData(res.data.attributes)
//       }
//     } catch (error) {
//       console.log(error)
//     } finally {
//       setIsLoading(false)
//     }
//   }, [id])

//   useEffect(async () => {
//     try {
//       if (data) {
//         let response = await axios.get(
//           `http://localhost:1337/api/upload/files/${data.imageId}`
//         )
//         if (response.status === 200) {
//           setImagePath(response.data.url)
//         }
//       }
//     } catch (error) {
//       console.log(error)
//     }
//   }, [data])
//   return (
//     <React.Fragment>
//       <div className="page-content">
//         {isLoading ? (
//           <div id="preloader">
//             <div id="status">
//               <div className="spinner-chase">
//                 <div className="chase-dot" />
//                 <div className="chase-dot" />
//                 <div className="chase-dot" />
//                 <div className="chase-dot" />
//                 <div className="chase-dot" />
//                 <div className="chase-dot" />
//               </div>
//             </div>
//           </div>
//         ) : (
//           ""
//         )}
//         <Card>
//           <CardImg
//             top
//             className="img-fluid rounded-4"
//             src={imagePath}
//             alt={data.siteName}
//             style={{
//               width: "500px",
//               height: "500px",
//               margin: "auto",
//               display: "block",
//             }}
//           />
//           <CardBody>
//             <h4 className="card-title ">Site Location</h4>
//           </CardBody>
//         </Card>
//       </div>
//     </React.Fragment>
//   )
// }

// export default index
