import PropTypes from "prop-types"
import React, { useEffect } from "react"
import { Collapse } from "reactstrap"
import { Link, withRouter } from "react-router-dom"
import { useDispatch } from "react-redux"
//i18n
import { withTranslation } from "react-i18next"

import { connect } from "react-redux"
import { logoutUser, toggleLeftmenu } from "store/actions"
import { useAuthContext } from "context/AuthContext"

const Navbar = props => {
  const { user, setUser } = useAuthContext()

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
    setUser("")
  }
  let dispatch = useDispatch()
  let handler = () => {
    dispatch(toggleLeftmenu())
  }

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
                    onClick={() => {
                      handler()
                    }}
                    to={"/dashboard"}
                  >
                    <i className="bx bx-home-circle me-2"></i>
                    {props.t("Dashboard")} {props.menuOpen}
                    {/* <div className="arrow-down"></div> */}
                  </Link>
                </li>
                {/* <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle arrow-none"
                    to="/pledge-users"
                    onClick={() => {
                      handler()
                    }}
                  >
                    <i className="bx bx-user me-2"></i>
                    {props.t("Pledged Users")} {props.menuOpen}
                  </Link>
                </li> */}
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle arrow-none"
                    to="/create-site"
                    onClick={() => {
                      handler()
                    }}
                  >
                    <i className="bx bx-notepad me-2"></i>
                    {props.t("Create Site")} {props.menuOpen}
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle arrow-none"
                    to="/location-view"
                    onClick={() => {
                      handler()
                    }}
                  >
                    <i className="bx bx-map-pin me-2"></i>
                    {props.t("Site View")} {props.menuOpen}
                  </Link>
                </li>
                {user?.role?.type === "admin" ? (
                  <li className="nav-item dropdown">
                    <Link
                      className="nav-link dropdown-toggle arrow-none"
                      to="/site-users"
                      onClick={() => {
                        handler()
                      }}
                    >
                      <i className="bx bx-user me-2"></i>
                      {props.t("Users")} {props.menuOpen}
                    </Link>
                  </li>
                ) : null}
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
