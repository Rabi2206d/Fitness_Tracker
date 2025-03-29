import React, { useState } from 'react'
import Header from './header'
import {useNavigate} from "react-router-dom"

function Login() { 

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();

    

    const loginUser = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/login',{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',    
                },
                body : JSON.stringify({email ,password})
            });
            const logindata = await res.json()
            console.log(logindata);
            localStorage.setItem("token",logindata.token);
            if (logindata.user && logindata.user.status === 'admin') {
                navigate('/admin');
            } else {
                navigate('/user');
            }
        } catch (error) {
            console.error("Login failed", error);
        }
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