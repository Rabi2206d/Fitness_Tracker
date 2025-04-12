import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from '../AuthContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'email') setEmail(value);
        if (name === 'password') setPassword(value);

        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const loginUser = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const res = await fetch('http://localhost:4000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const logindata = await res.json();

            if (!res.ok) {
                setError(logindata.message || 'Login failed');
                setIsSubmitting(false);
                return;
            }

            login(logindata.user);
            localStorage.setItem("auth-token", logindata.token);
            if (logindata.user && logindata.user.status === 'admin') {
                navigate('/admin');
            } else {
                navigate('/userdashboard');
            }
        } catch (error) {
            setError("Something went wrong. Try again.");
            console.error("Login failed", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-page-wrapper pt-5">
            <div className="auth-one-bg-position auth-one-bg" id="auth-particles">
                <div className="bg-overlay"></div>
                <div className="shape">
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1440 120">
                        <path d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z"></path>
                    </svg>
                </div>
            </div>

            <div className="auth-page-content">
                <div className="container">

                    <div className="row justify-content-center">
                        <div className="col-md-8 col-lg-6 col-xl-5">
                            <div className="card mt-4">
                                <div className="card-body p-4">
                                    <div className="text-center mt-2">
                                        <h5 className="text-primary">Welcome Back!</h5>
                                        <p className="text-muted">Sign in to continue to FMS.</p>
                                    </div>

                                    {error && (
                                        <div className="alert alert-danger text-center">{error}</div>
                                    )}

                                    <form onSubmit={loginUser} noValidate>
                                        <div className="mb-3 text-start">
                                            <label htmlFor="email" className="form-label">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                value={email}
                                                onChange={handleInputChange}
                                                id="email"
                                                placeholder="Enter email"
                                            />
                                            {errors.email && (
                                                <div className="invalid-feedback">{errors.email}</div>
                                            )}
                                        </div>

                                        <div className="mb-3 text-start">
                                            <div className="float-end">
                                                <a href="auth-pass-reset-basic.html" className="text-muted">Forgot password?</a>
                                            </div>
                                            <label className="form-label" htmlFor="password">Password</label>
                                            <div className="position-relative auth-pass-inputgroup mb-3">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    className={`form-control pe-5 ${errors.password ? 'is-invalid' : ''}`}
                                                    value={password}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter password"
                                                    id="password"
                                                />
                                                <button
                                                    className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                                                    type="button"
                                                    onClick={togglePasswordVisibility}
                                                >
                                                    <i className={`ri-eye${showPassword ? '-line' : '-fill'} align-middle`}></i>
                                                </button>
                                                {errors.password && (
                                                    <div className="invalid-feedback">{errors.password}</div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="form-check mb-3">
                                            <input className="form-check-input" type="checkbox" id="auth-remember-check" />
                                            <label className="form-check-label" htmlFor="auth-remember-check">Remember me</label>
                                        </div>

                                        <div className="mt-4">
                                            <button
                                                className="btn btn-success w-100"
                                                type="submit"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                                        Signing In...
                                                    </>
                                                ) : 'Sign In'}
                                            </button>
                                        </div>
                                    </form>

                                </div>
                            </div>

                            <div className="mt-4 text-center">
                                <p className="mb-0">Don't have an account? <Link to="/register" className="fw-semibold text-primary text-decoration-underline">Signup</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="footer">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="text-center">
                                <p className="mb-0 text-muted">
                                    &copy; {new Date().getFullYear()} Login Crafted with <i className="mdi mdi-heart text-danger"></i> by FMS
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Login;
