const adminDasboardPage = {
    /* */
    template: `
        <div class="container-fluid vh-100">
            <div class="row h-100">
                <div class="col-sm-2 h-100 admin-left-col">
                    <div class="d-flex justify-content-center m-2">
                        <h3>Admin</h3>
                    </div>
                    <div class="d-flex justify-content-center m-2">
                        <img src="frontend/images/demoProfile.png" alt="Profile picture" class="profile-picture">
                    </div>
                    <div class="d-flex justify-content-center m-2">
                        <div>
                            <p class="text-center">Akash Kumar Kumbhakar Patra Roy Choudhury</p>
                            <p class="text-center">ADMIN0001</p>
                        </div>
                    </div>
                    <div class="m-4">
                        <router-link to="/admin_dashboard" class="navigation-link" exact-active-class="active"><p class="on-hover"> <i class="bi bi-house-door icon-spacing"></i> Home</p></router-link>
                        <router-link to="/admin_dashboard/profile" class="navigation-link" exact-active-class="active"><p class="on-hover"> <i class="bi bi-person-lines-fill icon-spacing"></i> Profile</p></router-link>
                        <router-link to="/admin_dashboard/create" class="navigation-link" exact-active-class="active"><p class="on-hover"> <i class="bi bi-plus-square"></i> Create</p></router-link>
                        <router-link to="/admin_dashboard/manage" class="navigation-link" exact-active-class="active"><p class="on-hover"> <i class="bi bi-pencil-square"></i> Manage</p></router-link>
                        <router-link to="/admin_dashboard/search" class="navigation-link" exact-active-class="active"><p class="on-hover"> <i class="bi bi-search icon-spacing"></i> Search</p></router-link>
                        <router-link to="/admin_dashboard/summary" class="navigation-link" exact-active-class="active"><p class="on-hover"> <i class="bi bi-bar-chart-line icon-spacing"></i> Summary</p></router-link>
                    </div>
                    <div class="mx-4 mt-5 pt-5">
                        <p class="navigation-link on-hover"><i class="bi bi-box-arrow-left icon-spacing"></i> Logout</p>
                    </div>
                </div>
                <div class="col-sm-10 h-100 overflow-auto">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    `
}


export default adminDasboardPage;