import React from 'react'

function UserFooter() {
    return (
        <footer class="footer">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-sm-6">
                        <script>document.write(new Date().getFullYear())</script> © FMS Dashboard.
                    </div>
                    <div class="col-sm-6">
                        <div class="text-sm-end d-none d-sm-block">
                            Design & Develop by FMS
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default UserFooter