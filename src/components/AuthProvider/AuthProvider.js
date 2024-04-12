import React, { useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { getUserId } from "../../helpers/fakebackend_helper"
import PropTypes from "prop-types"
function AuthProvider({ children }) {
  const [userData, setUserData] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const fetchLoggedInUser = async () => {
    try {
      setIsLoading(true)
      const response = await getUserId()
      if (response) {
        setUserData(response)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }
  const handleUser = user => {
    setUserData(user)
  }

  useEffect(() => {
    fetchLoggedInUser()
  }, [])

  if (isLoading) {
    // Return a loading indicator while the API call is in progress
    return (
      <div id="preloader">
        <div id="status">
          <div className="spinner-chase">
            <div className="chase-dot" />
            <div className="chase-dot" />
            <div className="chase-dot" />
            <div className="chase-dot" />
            <div className="chase-dot" />
            <div className="chase-dot" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <AuthContext.Provider value={{ user: userData, setUser: handleUser }}>
      {children}
    </AuthContext.Provider>
  )
}
AuthProvider.propTypes = {
  children: PropTypes.object,
}
export default AuthProvider
