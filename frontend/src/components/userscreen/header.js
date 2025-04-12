import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function UserHeader() {
    const [user, setUser] = useState({
        name: 'User',
        profileImage: null
      });
    
      useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setUser({
                name: parsedUser.name || 'User',
                profileImage: parsedUser.profileImage || null
            });
        }
    }, []);

      const handleLogout = async () => {
        try {
          // Call the logout endpoint
          const response = await fetch('http://localhost:4000/api/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'auth-token': localStorage.getItem('auth-token')
            }
          });
      
          const data = await response.json();
          
          if (data.success) {
            localStorage.removeItem('auth-token');
            localStorage.removeItem('user');
            window.location.href = '/';
          }
        } catch (error) {
          console.error('Logout failed:', error);
        }
      };
  return (
    <>
 <div id="layout-wrapper">

                <header id="page-topbar">
                    <div class="layout-width">
                        <div class="navbar-header">
                            <div class="d-flex">
                                <div class="navbar-brand-box horizontal-logo">
                                    <Link href="index.html" class="logo logo-dark">
                                        <span class="logo-sm">
                                            <img src="assets/images/logo-sm.png" alt height="22" />
                                        </span>
                                        <span class="logo-lg">
                                            <img src="assets/images/logo-dark.png" alt height="17" />
                                        </span>
                                    </Link>

                                    <Link href="index.html" class="logo logo-light">
                                        <span class="logo-sm">
                                            <img src="assets/images/logo-sm.png" alt height="22" />
                                        </span>
                                        <span class="logo-lg">
                                            <img src="assets/images/logo-light.png" alt height="17" />
                                        </span>
                                    </Link>
                                </div>
                            </div>

                            <div class="d-flex align-items-center">

                                <div class="dropdown d-md-none topbar-head-dropdown header-item">
                                    <button type="button" class="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle" id="page-header-search-dropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i class="bx bx-search fs-22"></i>
                                    </button>
                                    <div class="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0" aria-labelledby="page-header-search-dropdown">
                                        <form class="p-3">
                                            <div class="form-group m-0">
                                                <div class="input-group">
                                                    <input type="text" class="form-control" placeholder="Search ..." aria-label="Recipient's username" />
                                                    <button class="btn btn-primary" type="submit"><i class="mdi mdi-magnify"></i></button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                                {/* <div class="dropdown topbar-head-dropdown ms-1 header-item">
                                    <button type="button" class="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle" id="page-header-cart-dropdown" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-haspopup="true" aria-expanded="false">
                                        <i class='bx bx-shopping-bag fs-22'></i>
                                        <span class="position-absolute topbar-badge cartitem-badge fs-10 translate-middle badge rounded-pill bg-info">5</span>
                                    </button>
                                    <div class="dropdown-menu dropdown-menu-xl dropdown-menu-end p-0 dropdown-menu-cart" aria-labelledby="page-header-cart-dropdown">
                                        <div class="p-3 border-top-0 border-start-0 border-end-0 border-dashed border">
                                            <div class="row align-items-center">
                                                <div class="col">
                                                    <h6 class="m-0 fs-16 fw-semibold">My Cart</h6>
                                                </div>
                                                <div class="col-auto">
                                                    <span class="badge bg-warning-subtle text-warning fs-13"><span class="cartitem-badge">7</span> items</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div data-simplebar >
                                            <div class="p-2">
                                                <div class="text-center empty-cart" id="empty-cart">
                                                    <div class="avatar-md mx-auto my-3">
                                                        <div class="avatar-title bg-info-subtle text-info fs-36 rounded-circle">
                                                            <i class='bx bx-cart'></i>
                                                        </div>
                                                    </div>
                                                    <h5 class="mb-3">Your Cart is Empty!</h5>
                                                    <Link href="apps-ecommerce-products.html" class="btn btn-success w-md mb-3">Shop Now</Link>
                                                </div>

                                                <div class="d-block dropdown-item dropdown-item-cart text-wrap px-3 py-2">
                                                    <div class="d-flex align-items-center">
                                                        <img src="assets/images/products/img-1.png" class="me-3 rounded-circle avatar-sm p-2 bg-light" alt="Branded T-Shirts" />
                                                        <div class="flex-grow-1">
                                                            <h6 class="mt-0 mb-1 fs-14">
                                                                <Link href="apps-ecommerce-product-details.html" class="text-reset">Branded T-Shirts</Link>
                                                            </h6>
                                                            <p class="mb-0 fs-12 text-muted">Quantity: <span>10 x $32</span></p>
                                                        </div>
                                                        <div class="px-2">
                                                            <h5 class="m-0 fw-normal">$<span class="cart-item-price">320</span></h5>
                                                        </div>
                                                        <div class="ps-2">
                                                            <button type="button" class="btn btn-icon btn-sm btn-ghost-secondary remove-item-btn"><i class="ri-close-fill fs-16"></i></button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="d-block dropdown-item dropdown-item-cart text-wrap px-3 py-2">
                                                    <div class="d-flex align-items-center">
                                                        <img src="assets/images/products/img-2.png" class="me-3 rounded-circle avatar-sm p-2 bg-light" alt="Bentwood Chair" />
                                                        <div class="flex-grow-1">
                                                            <h6 class="mt-0 mb-1 fs-14">
                                                                <Link href="apps-ecommerce-product-details.html" class="text-reset">Bentwood Chair</Link>
                                                            </h6>
                                                            <p class="mb-0 fs-12 text-muted">Quantity: <span>5 x $18</span></p>
                                                        </div>
                                                        <div class="px-2">
                                                            <h5 class="m-0 fw-normal">$<span class="cart-item-price">89</span></h5>
                                                        </div>
                                                        <div class="ps-2">
                                                            <button type="button" class="btn btn-icon btn-sm btn-ghost-secondary remove-item-btn"><i class="ri-close-fill fs-16"></i></button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="d-block dropdown-item dropdown-item-cart text-wrap px-3 py-2">
                                                    <div class="d-flex align-items-center">
                                                        <img src="assets/images/products/img-3.png" class="me-3 rounded-circle avatar-sm p-2 bg-light" alt="Borosil Paper Cup" />
                                                        <div class="flex-grow-1">
                                                            <h6 class="mt-0 mb-1 fs-14">
                                                                <Link href="apps-ecommerce-product-details.html" class="text-reset">Borosil Paper Cup</Link>
                                                            </h6>
                                                            <p class="mb-0 fs-12 text-muted">Quantity: <span>3 x $250</span></p>
                                                        </div>
                                                        <div class="px-2">
                                                            <h5 class="m-0 fw-normal">$<span class="cart-item-price">750</span></h5>
                                                        </div>
                                                        <div class="ps-2">
                                                            <button type="button" class="btn btn-icon btn-sm btn-ghost-secondary remove-item-btn"><i class="ri-close-fill fs-16"></i></button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="d-block dropdown-item dropdown-item-cart text-wrap px-3 py-2">
                                                    <div class="d-flex align-items-center">
                                                        <img src="assets/images/products/img-6.png" class="me-3 rounded-circle avatar-sm p-2 bg-light" alt="Gray Styled T-Shirt" />
                                                        <div class="flex-grow-1">
                                                            <h6 class="mt-0 mb-1 fs-14">
                                                                <Link href="apps-ecommerce-product-details.html" class="text-reset">Gray Styled T-Shirt</Link>
                                                            </h6>
                                                            <p class="mb-0 fs-12 text-muted">Quantity: <span>1 x $1250</span></p>
                                                        </div>
                                                        <div class="px-2">
                                                            <h5 class="m-0 fw-normal">$ <span class="cart-item-price">1250</span></h5>
                                                        </div>
                                                        <div class="ps-2">
                                                            <button type="button" class="btn btn-icon btn-sm btn-ghost-secondary remove-item-btn"><i class="ri-close-fill fs-16"></i></button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="d-block dropdown-item dropdown-item-cart text-wrap px-3 py-2">
                                                    <div class="d-flex align-items-center">
                                                        <img src="assets/images/products/img-5.png" class="me-3 rounded-circle avatar-sm p-2 bg-light" alt="Stillbird Helmet" />
                                                        <div class="flex-grow-1">
                                                            <h6 class="mt-0 mb-1 fs-14">
                                                                <Link href="apps-ecommerce-product-details.html" class="text-reset">Stillbird Helmet</Link>
                                                            </h6>
                                                            <p class="mb-0 fs-12 text-muted">Quantity: <span>2 x $495</span></p>
                                                        </div>
                                                        <div class="px-2">
                                                            <h5 class="m-0 fw-normal">$<span class="cart-item-price">990</span></h5>
                                                        </div>
                                                        <div class="ps-2">
                                                            <button type="button" class="btn btn-icon btn-sm btn-ghost-secondary remove-item-btn"><i class="ri-close-fill fs-16"></i></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="p-3 border-bottom-0 border-start-0 border-end-0 border-dashed border" id="checkout-elem">
                                            <div class="d-flex justify-content-between align-items-center pb-3">
                                                <h5 class="m-0 text-muted">Total:</h5>
                                                <div class="px-2">
                                                    <h5 class="m-0" id="cart-item-total">$1258.58</h5>
                                                </div>
                                            </div>
                                            <Link href="apps-ecommerce-checkout.html" class="btn btn-success text-center w-100">Checkout</Link>
                                        </div>
                                    </div>
                                </div> */}


                                <div class="dropdown ms-sm-3 header-item topbar-user">
                                    <button type="button" class="btn" id="page-header-user-dropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <span class="d-flex align-items-center">
                                        {user.profileImage ? (
                                            <img
                                                className="rounded-circle header-profile-user"
                                                src={`http://localhost:4000/uploads/${user.profileImage}`}
                                                alt="User Avatar"
                                                style={{ width: '50px', height: '50px' }}
                                            />
                                        ) : (
                                            <div className="avatar-placeholder" style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '50%',
                                                backgroundColor: '#ccc',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}                                          
                                        <span class="text-start ms-xl-2">
                                                <span class="d-none d-xl-inline-block ms-1 fw-medium user-name-text">{user.name}</span>
                                                <span class="d-none d-xl-block ms-1 fs-12 user-name-sub-text">User</span>
                                            </span>
                                        </span>
                                    </button>
                                    <div class="dropdown-menu dropdown-menu-end">
                                        <h6 class="dropdown-header">Welcome {user.name.charAt(0).toUpperCase()}!</h6>
                                        <Link class="dropdown-item" to="/profile">
                                            <i class="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
                                            <span class="align-middle">Profile</span>
                                        </Link>
                               
                                        <button type="submit" class="dropdown-item" onClick={() => handleLogout()}>
                                            <i class="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
                                            <span class="align-middle" data-key="t-logout">Logout</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div id="removeNotificationModal" class="modal fade zoomIn" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="NotificationModalbtn-close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="mt-2 text-center">
                                    <lord-icon src="https://cdn.lordicon.com/gsqxdxog.json" trigger="loop" colors="primary:#f7b84b,secondary:#f06548" ></lord-icon>
                                    <div class="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
                                        <h4>Are you sure?</h4>
                                        <p class="text-muted mx-4 mb-0">Are you sure you want to remove this Notification?</p>
                                    </div>
                                </div>
                                <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
                                    <button type="button" class="btn w-sm btn-light" data-bs-dismiss="modal">Close</button>
                                    <button type="button" class="btn w-sm btn-danger" id="delete-notification">Yes, Delete It!</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="app-menu navbar-menu">
                    <div class="navbar-brand-box">
                        <Link href="index.html" class="logo logo-dark">
                            <span class="logo-sm">
                                <img src="assets/images/logo-sm.png" alt="" height="22" />
                            </span>
                            <span class="logo-lg">
                                <img src="assets/images/logo-dark.png" alt="" height="17" />
                            </span>
                        </Link>
                        <Link href="index.html" class="logo logo-light">
                            <span class="logo-sm">
                                <img src="assets/images/logo-sm.png" alt="" height="22" />
                            </span>
                            <span class="logo-lg">
                                <img src="assets/images/logo-light.png" alt="" height="17" />
                            </span>
                        </Link>
                        <button type="button" class="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover" id="vertical-hover">
                            <i class="ri-record-circle-line"></i>
                        </button>
                    </div>

                    <div id="scrollbar">
                        <div class="container-fluid">

                            <div id="two-column-menu">
                            </div>
                            <ul class="navbar-nav" id="navbar-nav">
                                <li class="menu-title"><span data-key="t-menu">Menu</span></li>
                                <li class="nav-item">
                                    <Link class="nav-link menu-link" to="/userdashboard" >
                                        <i class="ri-dashboard-2-line"></i> <span data-key="t-dashboards">Dashboards</span>
                                    </Link>
                                  
                                </li>
                                <li class="nav-item">
                                    <Link class="nav-link menu-link" to="/workout">
                                        <i class="ri-apps-2-line"></i> <span>Workouts</span>
                                    </Link>
                                </li>
                                <li class="nav-item">
                                    <Link class="nav-link menu-link" to="/nutritions">
                                        <i class="ri-apps-2-line"></i> <span>Nutritions</span>
                                    </Link>
                                </li>
                                <li class="nav-item">
                                    <Link class="nav-link menu-link" to="/progress">
                                        <i class="ri-apps-2-line"></i> <span>Progress</span>
                                    </Link>
                                </li>
                                
                                <li class="nav-item">
                                    <Link class="nav-link menu-link" to="/workoutanalytics">
                                        <i class="ri-layout-3-line"></i> <span data-key="t-layouts">Workout Analytics</span>
                                    </Link>
                                </li>
                                <li class="nav-item">
                                    <Link class="nav-link menu-link" to="/nutritionanalytics">
                                        <i class="ri-layout-3-line"></i> <span data-key="t-layouts">Nutrition Analytics</span>
                                    </Link>
                                </li>
                                <li class="nav-item">
                                    <Link class="nav-link menu-link" to="/progressanalytics">
                                        <i class="ri-layout-3-line"></i> <span data-key="t-layouts">Progress Analytics</span>
                                    </Link>
                                </li>
                                <li class="nav-item">
                                    <Link class="nav-link menu-link" to="/FeedbackForm">
                                        <i class="ri-layout-3-line"></i> <span data-key="t-layouts">Feedback</span>
                                    </Link>
                                </li>
                         



                    

                            </ul>
                        </div>

                    </div>

                    <div class="sidebar-background"></div>
                </div>

                <div class="vertical-overlay"></div>
            </div>
    </>
  );
}

export default UserHeader;
