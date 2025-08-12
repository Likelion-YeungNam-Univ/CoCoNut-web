import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Signin = () => {
    const[email, setEmail] = useState("")
    const[password, setPassword] = useState("")

    const {login} = useContext(AuthContext)
    const navigate = useNavigate()

    const SignInHandler = async (e) => {
        e.preventDefault()
    }

    const body = {
        email: email,
        password: password,
    }

  return (
    <div className='bg-[#F3F3F3] min-h-screen'>

    </div>
  )
}

export default Signin