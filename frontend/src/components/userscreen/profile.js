import React from 'react'
import UserHeader from './header'

function UserProfile() {
    return (
        <>
        <UserHeader/>
            <div>
                <div class="main-content">

                    <div class="page-content">
                        <div class="container-fluid">
                            <div class="profile-foreground position-relative mx-n4 mt-n4">
                                <div class="profile-wid-bg">
                                    <img src="assets/images/profile-bg.jpg" alt="" class="profile-wid-img" />
                                </div>
                            </div>
                            <div class="pt-4 mb-4 mb-lg-3 pb-lg-4 profile-wrapper">
                                <div class="row g-4">
                                    <div class="col-auto">
                                        <div class="avatar-lg">
                                            <img src="assets/images/users/avatar-1.jpg" alt="user-img" class="img-thumbnail rounded-circle" />
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="p-2">
                                            <h3 class="text-white mb-1">Anna Adame</h3>
                                            <p class="text-white text-opacity-75">Owner & Founder</p>
                                            <div class="hstack text-white-50 gap-1">
                                                <div class="me-2">
                                                    <i class="ri-map-pin-user-line me-1 text-white text-opacity-75 fs-16 align-middle"></i>
                                                    California, United States
                                                </div>
                                                <div>
                                                    <i class="ri-building-line me-1 text-white text-opacity-75 fs-16 align-middle"></i>
                                                    Themesbrand
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                 
                                </div>
                            </div>


                            <div class="row">
                                <div class="col-lg-12">
                                    <div>
                                        <div class="d-flex profile-wrapper">
                                           
                                            <div class="flex-shrink-0">
                                                <a href="pages-profile-settings.html" class="btn btn-success">
                                                    <i class="ri-edit-box-line align-bottom"></i>
                                                    Edit Profile
                                                </a>
                                            </div>
                                        </div>

                                        <div class="tab-content pt-4 text-muted">
                                            <div class="tab-pane active" id="overview-tab" role="tabpanel">
                                                <div class="row">
                                                    <div class="col-xxl-3">
                            
                                                        <div class="card">
                                                            <div class="card-body">
                                                                <h5 class="card-title mb-3">Info</h5>
                                                                <div class="table-responsive">
                                                                    <table class="table table-borderless mb-0">
                                                                        <tbody>
                                                                            <tr>
                                                                                <th class="ps-0" scope="row">Full Name :</th>
                                                                                <td class="text-muted">Anna Adame</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th class="ps-0" scope="row">Mobile :</th>
                                                                                <td class="text-muted">+(1) 987 6543</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th class="ps-0" scope="row">E-mail :</th>
                                                                                <td class="text-muted">daveadame@velzon.com</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th class="ps-0" scope="row">Location :</th>
                                                                                <td class="text-muted">California, United States</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th class="ps-0" scope="row">Joining Date</th>
                                                                                <td class="text-muted">24 Nov 2021</td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        
                                                    </div>

                                                   
                                                </div>
                                            </div>
                                           

                                        

                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>


                </div>
            </div>
        </>
    )
}

export default UserProfile