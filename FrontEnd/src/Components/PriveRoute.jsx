import React from 'react'
import { useAppContext } from '../Context/AppContext'
import { Navigate,  Outlet } from 'react-router-dom'

const PriveRoute = () => {

    let {currentUser}  = useAppContext()

    return currentUser ? <Outlet />: <Navigate to="/sign-in" />

  return (
    <div>
      
    </div>
  )
}

export default PriveRoute
