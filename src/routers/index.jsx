/* eslint-disable react/prop-types */
import { Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { connect } from 'react-redux'
import { getUserInfo } from '@/store/actions'
import Main from '@/views/layout'
import Login from '@/views/login'
import Loading from '@/components/Loading'

const Router = ({ token, role, getUserInfo }) => {
  useEffect(() => {
    if (token && !role) {
      getUserInfo(token)
    }
  }, [token, role, getUserInfo])

  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Main Layout with Nested Routes */}
          <Route
            path="/*"
            element={
              token ? (
                role ? (
                  <Main />
                ) : (
                  <div>Loading...</div>
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default connect((state) => state.user, { getUserInfo })(Router)
