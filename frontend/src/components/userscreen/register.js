import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [specialization, setSpecial] = useState('');
    const [experience, setExperience] = useState('');
    const [file, setFile] = useState('');
    const [error, setError] = useState('');
    const [formErrors, setFormErrors] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        specialization: '',
        experience: '',
        file: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(false); // New state for disabling button
    const navigate = useNavigate();

    const validateImage = (file) => {
        const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
        return file && validImageTypes.includes(file.type);
    };

    const validateForm = () => {
        const errors = {};
        if (!name) errors.name = "Name is required.";
        if (!email) {
            errors.email = "Email is required.";
        } else if (!email.includes('@')) {
            errors.email = "Invalid email address.";
        }
        if (!password) {
            errors.password = "Password is required.";
        } else if (password.length < 6) {
            errors.password = "Password must be at least 6 characters.";
        }
        if (!phone) {
            errors.phone = "Phone number is required.";
        } else if (phone.length < 10) {
            errors.phone = "Phone number must be at least 10 digits.";
        }
        if (!specialization) errors.specialization = "Specialization is required.";
        if (!experience) errors.experience = "Experience is required.";
        if (!file) {
            errors.file = "Image is required.";
        } else if (!validateImage(file)) {
            errors.file = "Please upload a valid image file (jpeg, jpg, png, gif, webp).";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const adduserrecord = async (e) => {
        e.preventDefault();
        setError('');
        setFormErrors({});
        setSuccessMessage('');
        setIsButtonDisabled(true); // Disable the submit button before submission

        const isValid = validateForm();
        if (!isValid) {
            setIsButtonDisabled(false); // Re-enable the button if form validation fails
            return;
        }

        setIsSubmitting(true);

        try {
            const formdata = new FormData();
            formdata.append("name", name);
            formdata.append("email", email);
            formdata.append("password", password);
            formdata.append("phone", phone);
            formdata.append("specialization", specialization);
            formdata.append("experience", experience);
            formdata.append("file", file);

            const response = await fetch('http://localhost:4000/api/adduser', {
                method: 'POST',
                body: formdata,
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage("User registered successfully!");
                setTimeout(() => {
                    setIsSubmitting(false);
                    setIsButtonDisabled(false);
                    navigate('/');
                }, 3000);
            } else {
                if (data.message && data.message.toLowerCase().includes("exists")) {
                    setError("User already exists.");
                } else {
                    setError(data.message || "User already exists.");
                }
            }
        } catch (error) {
            console.log("Error:", error.message);
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <>
            <div class="auth-page-wrapper pt-5">
                <div class="auth-one-bg-position auth-one-bg" id="auth-particles">
                    <div class="bg-overlay"></div>

                    <div class="shape">
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 1440 120">
                            <path d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z"></path>
                        </svg>
                    </div>
                </div>

                <div class="auth-page-content">
                    <div class="container">

                        <div class="row justify-content-center">
                            <div class="col-md-8 col-lg-6 col-xl-5">
                                <div class="card mt-4">

                                    <div class="card-body p-4">
                                        <div class="text-center mt-2">
                                            <h5 class="text-primary">Create New Account</h5>
                                            <p class="text-muted">Get your free FMS account now</p>
                                        </div>
                                        <div class="p-2 mt-4">
                                            {error && <div className="alert alert-danger">{error}</div>}
                                            {successMessage && <div className="alert alert-success">{successMessage}</div>}

                                            <form onSubmit={adduserrecord}>

                                                <div class="mb-3 text-start">
                                                    <label for="username" class="form-label">Name <span class="text-danger">*</span></label>
                                                    <input type="text"
                                                        className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                                                        onChange={(e) => setName(e.target.value)}
                                                        id="name"
                                                        placeholder="Enter Name" />
                                                    {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                                                </div>

                                                <div class="mb-3 text-start">
                                                    <label for="useremail" class="form-label">Email <span class="text-danger">*</span></label>
                                                    <input type="email"
                                                        className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                                                        id="email"
                                                        placeholder="Enter Email"
                                                        onChange={(e) => setEmail(e.target.value)} />
                                                    {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}

                                                </div>

                                                <div class="mb-3 text-start">
                                                    <label class="form-label" for="password-input">Password</label>
                                                    <div class="position-relative auth-pass-inputgroup">
                                                        <input type="password"
                                                            className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                                                            id="password"
                                                            placeholder="Enter Password"
                                                            onChange={(e) => setPassword(e.target.value)} />
                                                        {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}

                                                    </div>
                                                </div>
                                                <div class="mb-3 text-start">
                                                    <label class="form-label" for="phone-input">Phone</label>
                                                    <div class="position-relative auth-pass-inputgroup">
                                                        <input type="number"
                                                            className={`form-control ${formErrors.phone ? 'is-invalid' : ''}`}
                                                            id="phone"
                                                            placeholder="Enter Phone"
                                                            onChange={(e) => setPhone(e.target.value)} />
                                                        {formErrors.phone && <div className="invalid-feedback">{formErrors.phone}</div>}

                                                    </div>
                                                </div>

                                                <div class="mb-3 text-start">
                                                    <label class="form-label" for="phone-input">Specialization</label>
                                                    <div class="position-relative auth-pass-inputgroup">
                                                        <input type="text"
                                                            className={`form-control ${formErrors.specialization ? 'is-invalid' : ''}`}
                                                            id="specialization"
                                                            placeholder="Enter Specialization"
                                                            onChange={(e) => setSpecial(e.target.value)} />
                                                        {formErrors.specialization && <div className="invalid-feedback">{formErrors.specialization}</div>}

                                                    </div>
                                                </div>

                                                <div class="mb-3 text-start">
                                                    <label class="form-label" for="phone-input">Experience</label>
                                                    <div class="position-relative auth-pass-inputgroup">
                                                        <input type="text"
                                                            className={`form-control ${formErrors.experience ? 'is-invalid' : ''}`}
                                                            id="experience"
                                                            placeholder="Enter Experience"
                                                            onChange={(e) => setExperience(e.target.value)} />
                                                        {formErrors.experience && <div className="invalid-feedback">{formErrors.experience}</div>}

                                                    </div>
                                                </div>


                                                <div class="mb-3 text-start">
                                                    <label class="form-label" for="phone-input">Profile Photo</label>
                                                    <div class="position-relative auth-pass-inputgroup">
                                                        <input type="file"
                                                            className={`form-control mt-2 ${formErrors.file ? 'is-invalid' : ''}`}
                                                            onChange={(e) => setFile(e.target.files[0])} />
                                                        {formErrors.file && <div className="invalid-feedback">{formErrors.file}</div>}

                                                    </div>
                                                </div>



                                                <div class="mt-4">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary mt-5"
                                                        disabled={isButtonDisabled} // Disable button during submission or on success
                                                    >
                                                        {isSubmitting ? 'Submitting...' : 'Submit'}
                                                    </button>
                                                </div>

                                            
                                            </form>

                                        </div>
                                    </div>
                                </div>

                                <div class="mt-4 text-center">
                                    <p class="mb-0">Already have an account ? <Link to="/" class="fw-semibold text-primary text-decoration-underline"> Signin </Link> </p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <footer class="footer">
                    <div class="container">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="text-center">
                                    <p class="mb-0 text-muted">&copy;
                                        <script>document.write(new Date().getFullYear())</script> Register Crafted with <i class="mdi mdi-heart text-danger"></i> by FMS
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

export default Register;
