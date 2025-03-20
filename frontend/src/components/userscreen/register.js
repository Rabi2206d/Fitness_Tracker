import React, { useState } from 'react'
import Header from './header'
import { use } from 'react'

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [specialization, setSpecial] = useState('');
    const [experience, setExperience] = useState('');
    const [file, setFile] = useState('');

    const adduserrecord = async (e) => {
        e.preventDefault();
        if (!name || !email || !password || !phone || !specialization || !experience || !file) {
            console.log("All fields are required.");
            return;
        }
    
        if (!email.includes('@')) {
            console.log("Invalid Email Address.");
            return;
        }
    
        if (password.length < 6) {
            console.log("Password must be at least 6 characters.");
            return;
        }
    
        if (phone.length < 10) {
            console.log("Phone number must be at least 10 digits.");
            return;
        }
    
        try {
            const formdata = new FormData();
            formdata.append("name", name);
            formdata.append("email", email);
            formdata.append("password", password);
            formdata.append("phone", phone);
            formdata.append("specialization", specialization);
            formdata.append("experience", experience);
            formdata.append("file", file); // File ko bhi append karna zaroori hai
    
            const response = await fetch('http://localhost:4000/api/adduser', {
                method: 'POST',
                body: formdata, // Body mein FormData bhejna hai
            });
    
            
            if (response.ok) {
                let data = await response.json();
                console.log(data);
                console.log("User registered successfully.");
            } 
        } catch (error) {
            console.log("Error:", error.message);
        }
    };
    

    return (
        <>
            <Header />
            <div className='container'>
                <h1>
                    Register Form
                </h1>


                <div class="form-group ">
                    <label for="name">Name</label>
                    <input type="text" class="form-control" onChange={(e) => setName(e.target.value)} id="name" aria-describedby="emailHelp" placeholder="Enter Name" />
                    <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" class="form-control" id="email" placeholder="Enter Email" onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" class="form-control" id="password" placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div class="form-group">
                    <label for="phone">Phone</label>
                    <input type="number" class="form-control" id="phone" placeholder="Enter phone" onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div class="form-group">
                    <label for="specialization">Specialization</label>
                    <input type="text" class="form-control" id="specialization" placeholder="Enter specialization" onChange={(e) => setSpecial(e.target.value)} />
                </div>
                <div class="form-group">
                    <label for="experience">Experience</label>
                    <input type="text" class="form-control" id="experience" placeholder="Enter experience" onChange={(e) => setExperience(e.target.value)} />
                </div>
                <label for="experience">Image</label>
                <input type='file' className='form-control mt-2' onChange={(e) => setFile(e.target.files[0])} ></input>
                <button type="submit" onClick={adduserrecord} class="btn btn-primary mt-5">Submit</button>
            </div>
        </>
    )
}

export default Register