/* eslint-disable react/prop-types */
import { Outlet } from 'react-router-dom'
import Header from '../Header/Header'

function Out() {
  return (
    <>
        <Header />
        <Outlet />
    </>
  )
}

export default Out