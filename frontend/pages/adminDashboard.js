const adminDasboardPage = {
    /* */
    template: `
        <div class="container-fluid vh-100">
            <div class="row h-100">
                <div class="col-sm-2 h-100 admin-left-col overflow-auto">
                    <div class="d-flex justify-content-center m-2">
                        <h3>Admin</h3>
                    </div>
                    <div class="d-flex justify-content-center m-2">
                        <img src="" alt="Profile picture" class="profile-picture">
                    </div>
                    <div class="d-flex justify-content-center m-2">
                        <div>
                            <p class="text-center">{{ name }}</p>
                            <p class="text-center">{{ user_id }}</p>
                        </div>
                    </div>
                    <div class="m-4">
                        <router-link to="/admin_dashboard/home" class="navigation-link" active-class="active"><p class="on-hover"> <i class="bi bi-house-door icon-spacing"></i> Home</p></router-link>
                        <router-link to="/admin_dashboard/profile" class="navigation-link" active-class="active"><p class="on-hover"> <i class="bi bi-person-lines-fill icon-spacing"></i> Profile</p></router-link>
                        <router-link to="/admin_dashboard/create/subject" class="navigation-link" :class="{ active: $route.path.startsWith('/admin_dashboard/create') }"><p class="on-hover"> <i class="bi bi-plus-square"></i> Create</p></router-link>
                        <router-link to="/admin_dashboard/manage" class="navigation-link" :class="{ active: $route.path.startsWith('/admin_dashboard/manage') }"><p class="on-hover"> <i class="bi bi-pencil-square"></i> Manage</p></router-link>
                        <router-link to="/admin_dashboard/search" class="navigation-link" active-class="active"><p class="on-hover"> <i class="bi bi-search icon-spacing"></i> Search</p></router-link>
                        <router-link to="/admin_dashboard/summary" class="navigation-link" active-class="active"><p class="on-hover"> <i class="bi bi-bar-chart-line icon-spacing"></i> Summary</p></router-link>
                    </div>
                    <div class="mx-4 mt-5 pt-5">
                        <p class="navigation-link on-hover"  @click="logout"><i class="bi bi-box-arrow-left icon-spacing"></i> Logout</p>
                    </div>
                </div>
                <div class="col-sm-10 h-100 overflow-auto">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            name: null,
            user_id: null
        }
    },
    created() {
        this.getAdminInformation();
        if (this.$route.path === "/admin_dashboard") {
            this.$router.push("/admin_dashboard/home");
        }
    },
    methods: {
        async getAdminInformation() {
            const response = await fetch(
                location.origin + '/api/admin-information',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': this.$store.state.loginData.auth_token
                    },
                    body: JSON.stringify({
                        'id': this.$store.state.loginData.user_id
                    })

                }
            )
            const admin = await response.json()
            if (response.ok) {
                /** store data to admin state */
                sessionStorage.setItem('admin', JSON.stringify(admin))
                this.$store.commit('set_admin')
                this.name = this.$store.state.adminData.full_name
                this.user_id = this.$store.state.loginData.user_id
            }
            else {
                console.error("Error getting admin data");
            }
        },
        logout() {
            sessionStorage.setItem('isLoggedOut', true)
            sessionStorage.removeItem("user")
            sessionStorage.removeItem("admin")
            this.$store.commit('unset_user')
            this.$store.commit('unset_admin')
            this.$router.push('/logout-successfull')

        }
    }
}


export default adminDasboardPage;