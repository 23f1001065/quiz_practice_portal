const studentDasboardPage = {
    /* */
    template: `
        <div class="container-fluid vh-100">
            <div class="row h-100">
                <div class="col-sm-2 h-100 user-left-col">
                    <div class="d-flex justify-content-center m-2">
                        <h3>Student</h3>
                    </div>
                    <div class="d-flex justify-content-center m-2">
                        <img src="" alt="Profile picture" class="profile-picture">
                    </div>
                    <div class="d-flex justify-content-center m-2">
                        <div>
                            <p class="text-center">Akash Kumbhakar</p>
                        </div>
                    </div>
                    <div class="m-4">
                        <router-link to="/student_dashboard" class="navigation-link"><p class="on-hover"> <i class="bi bi-house-door icon-spacing"></i> Home</p></router-link>
                        <router-link to="/student_dashboard/profile" class="navigation-link"><p class="on-hover"> <i class="bi bi-person-lines-fill icon-spacing"></i> Profile</p></router-link>
                        <router-link to="/student_dashboard/subjects" class="navigation-link"><p class="on-hover"> <i class="bi bi-book"></i> My Subjects</p></router-link>
                        <router-link to="/student_dashboard/progress" class="navigation-link"><p class="on-hover"> <i class="bi bi-trophy"></i> My Achievement</p></router-link>
                    </div>
                    <div class="mx-4 mt-5 pt-5">
                        <p class="navigation-link on-hover" v-on:click="logout"><i class="bi bi-box-arrow-left icon-spacing"></i> Logout</p>
                    </div>
                </div>
                <div class="col-sm-10 h-100 overflow-auto">
                        <router-view></router-view>
                </div>
            </div>

        </div>
    `,
    methods: {
        logout() {
            sessionStorage.setItem('isLoggedOut', true)
            sessionStorage.removeItem("user")
            this.$store.commit('unset_user')
            this.$router.push('/logout-successfull')

        }
    }
}


export default studentDasboardPage;