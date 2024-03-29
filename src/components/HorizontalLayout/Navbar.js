import PropTypes from "prop-types"
import React, { useState, useEffect } from "react"
import { Row, Col, Collapse } from "reactstrap"
import { Link, withRouter } from "react-router-dom"
import classname from "classnames"

//i18n
import { withTranslation } from "react-i18next"

import { connect } from "react-redux"
import { logoutUser } from "store/actions"

const Navbar = props => {
  const [dashboard, setdashboard] = useState(false)

  useEffect(() => {
    var matchingMenuItem = null
    var ul = document.getElementById("navigation")
    var items = ul.getElementsByTagName("a")
    for (var i = 0; i < items.length; ++i) {
      if (props.location.pathname === items[i].pathname) {
        matchingMenuItem = items[i]
        break
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem)
    }
  })
  function activateParentDropdown(item) {
    item.classList.add("active")
    const parent = item.parentElement
    if (parent) {
      parent.classList.add("active") // li
      const parent2 = parent.parentElement
      parent2.classList.add("active") // li
      const parent3 = parent2.parentElement
      if (parent3) {
        parent3.classList.add("active") // li
        const parent4 = parent3.parentElement
        if (parent4) {
          parent4.classList.add("active") // li
          const parent5 = parent4.parentElement
          if (parent5) {
            parent5.classList.add("active") // li
            const parent6 = parent5.parentElement
            if (parent6) {
              parent6.classList.add("active") // li
            }
          }
        }
      }
    }
    return false
  }
  let handleLogout = () => {
    logoutUser()
  }
  // return (
  //   <React.Fragment>
  //     <div className="topnav">
  //       <div className="container-fluid">
  //         <nav
  //           className="navbar navbar-light navbar-expand-lg topnav-menu"
  //           id="navigation"
  //         >
  //           <Collapse
  //             isOpen={props.leftMenu}
  //             className="navbar-collapse"
  //             id="topnav-menu-content"
  //           >
  //             <ul className="navbar-nav">
  //               <li className="nav-item dropdown">
  //                 <Link
  //                   className="nav-link dropdown-toggle arrow-none"
  //                   onClick={e => {
  //                     e.preventDefault();
  //                     setdashboard(!dashboard);
  //                   }}
  //                   to="/dashboard"
  //                 >
  //                   <i className="bx bx-home-circle me-2"></i>
  //                   {props.t("Dashboard")} {props.menuOpen}
  //                   {/* <div className="arrow-down"></div> */}
  //                 </Link>
  //                 {/* <div
  //                   className={classname("dropdown-menu", { show: dashboard })}
  //                 >
  //                   <Link to="/dashboard" className="dropdown-item">
  //                     {props.t("Default")}
  //                   </Link>

  //                 </div> */}
  //               </li>

  //             </ul>
  //           </Collapse>
  //         </nav>
  //       </div>
  //     </div>
  //   </React.Fragment>
  // );
  return (
    <React.Fragment>
      <div className="topnav">
        <div className="container-fluid">
          <nav
            className="navbar navbar-light navbar-expand-lg topnav-menu"
            id="navigation"
          >
            <Collapse
              isOpen={props.leftMenu}
              className="navbar-collapse"
              id="topnav-menu-content"
            >
              <ul className="navbar-nav">
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle arrow-none"
                    // onClick={e => {
                    //   e.preventDefault();
                    //   setdashboard(!dashboard);
                    // }}
                    to={"/dashboard"}
                  >
                    <i className="bx bx-home-circle me-2"></i>
                    {props.t("Dashboard")} {props.menuOpen}
                    {/* <div className="arrow-down"></div> */}
                  </Link>
                  {/* <div
                    className={classname("dropdown-menu", { show: dashboard })}
                  >
                    <Link to="/dashboard" className="dropdown-item">
                      {props.t("Default")}
                    </Link>
                  </div> */}
                </li>
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle arrow-none"
                    to="/pledge-users"
                  >
                    <i className="bx bx-user me-2"></i>
                    {props.t("Users")} {props.menuOpen}
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle arrow-none"
                    to="/site-view"
                  >
                    <i className="bx bx-notepad me-2"></i>
                    {props.t("SiteView")} {props.menuOpen}
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle arrow-none"
                    to="/location-view"
                  >
                    <i className="bx bx-map-pin me-2"></i>
                    {props.t("LocationView")} {props.menuOpen}
                  </Link>
                </li>
              </ul>
              <ul className="navbar-nav ms-auto">
                <li className="nav-item dropdown">
                  <Link
                    to="/logout"
                    className="nav-link"
                    onClick={handleLogout}
                  >
                    <i className="bx bx-log-out-circle me-2"></i>
                    Logout
                  </Link>
                </li>
              </ul>
            </Collapse>
          </nav>
        </div>
      </div>
    </React.Fragment>
  )
}

Navbar.propTypes = {
  leftMenu: PropTypes.any,
  location: PropTypes.any,
  menuOpen: PropTypes.any,
  t: PropTypes.any,
}

const mapStatetoProps = state => {
  const { leftMenu } = state.Layout
  return { leftMenu }
}

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(Navbar))
)
