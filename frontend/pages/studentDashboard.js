const studentDasboardPage = {
    /* */
    template: `
        <div class="container-fluid vh-100">
            <div class="row h-100">
                <div class="col-sm-2 h-100 user-left-col" :class="{ 'blurr-back' : is_quiz_go_button_clicked }">
                    <div class="d-flex justify-content-center m-2">
                        <h3>Student</h3>
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
                        <router-link to="/student_dashboard/home" class="navigation-link" active-class="active"><p class="on-hover"> <i class="bi bi-house-door icon-spacing"></i> Home</p></router-link>
                        <router-link to="/student_dashboard/profile" class="navigation-link" active-class="active"><p class="on-hover"> <i class="bi bi-person-lines-fill icon-spacing"></i> Profile</p></router-link>
                        <router-link to="/student_dashboard/my-quiz-attempt" class="navigation-link" active-class="active"><p class="on-hover"> <i class="bi bi-book"></i> My Quizzes</p></router-link>
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
    data() {
        return {
            name: null,
            user_id: null,
        }
    },
    computed: {
        is_quiz_go_button_clicked() {
            return this.$store.state.globalCssData.is_clicked
        }
    },
    created() {
        this.getStudentInformation();
        if (this.$route.path === "/student_dashboard") {
            this.$router.push("/student_dashboard/home");
        }
    },
    methods: {
        async getStudentInformation() {
            const response = await fetch(
                location.origin + '/api/student-information',
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
            const student = await response.json()
            if (response.ok) {
                /** store data to admin state */
                sessionStorage.setItem('student', JSON.stringify(student))
                this.$store.commit('set_student')
                this.name = this.$store.state.studentData.full_name
                this.user_id = this.$store.state.loginData.user_id
            }
            else {
                console.error("Error getting student data");
            }
        },


        logout() {
            sessionStorage.setItem('isLoggedOut', true)
            sessionStorage.removeItem("user")
            sessionStorage.removeItem("student")
            this.$store.commit('unset_user')
            this.$store.commit('unset_student')
            this.$router.push('/logout-successfull')

        }
    }
}


export default studentDasboardPage;