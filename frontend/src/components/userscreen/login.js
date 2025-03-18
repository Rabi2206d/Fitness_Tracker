import React, { useState } from 'react'
import Header from './header'
import axios from 'axios'
import {useNavigate} from "react-router-dom"

function Login() { 

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();

    const loginUser = () => {
        axios.post('http://localhost:4000/api/login', { email, password })
            .then(result => {
                console.log(result);
                if (result.data.status === 'UserData') {
                    navigate('/home')
                } else if (result.data.status === 'AdminData') {
                    navigate('/admin')

                } else {
                    alert(result.data.message || 'Error');
                }
            })
            .catch(error => {
                console.error("Login Error:", error);
                alert('Server error, please try again later.');
            });
    };
    


    return (
        <>
            <Header />
            <div className='container mt-5'>
                <h1>Login Form</h1>
             
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" class="form-control" onChange={(e) => setEmail(e.target.value)} id="email" placeholder="Enter Email" />
                    </div>

                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" class="form-control" id="password" onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" />
                    </div>
                    <button type="submit" onClick={loginUser} class="btn btn-primary mt-5">Submit</button>
               
            </div>

        </>
    )
}

export default Login