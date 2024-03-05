import React from "react"
import { Redirect } from "react-router-dom"

// Profile
import UserProfile from "../pages/Authentication/user-profile"

// Authentication related pages
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import Register from "../pages/Authentication/Register"
import ForgetPwd from "../pages/Authentication/ForgetPassword"

// Dashboard
import PledgeIndex from "../pages/Pledge/index"
import Pledge from "../pages/Pledge/Pledge" 
import Certificate from "../pages/Pledge/Certificate"
import Dashboard from "../pages/Dashboard/index"

const authProtectedRoutes = [
  { path: "/dashboard", component: Dashboard },

  // //profile
  { path: "/profile", component: UserProfile },
  // { path: "/dashboard", component: Dashboard },
  
  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },
]

const publicRoutes = [
  { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  { path: "/forgot-password", component: ForgetPwd },
  { path: "/register", component: Register },
  { path: "/pledge", component: Pledge },
  { path: "/certificate", component: Certificate },
  { path: "/pledgeIndex", component: PledgeIndex },
  // { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },
]

export { publicRoutes, authProtectedRoutes }
