
const homePage = {
    /* public homepage for this platform */
    template: `
    <div class="vh-100 ">
        <div class="d-flex justify-content-between align-items-center top-part">
            <h4 class="m-4">Prepare your Exam </h4>
            <div class="m-4">
                <router-link to='/admin_dashboard' class='button'>Admin</router-link>
                <router-link to='/student_dashboard' class='button'>Student</router-link>
            </div>
            
        </div>
        <hr>
        <div class="container-fluid bottom-part">
            <div class="row h-100">
                <div class="col-sm-6">

                </div>
                <div class="col-sm-6 d-flex align-items-center">
                    <div>
                        <h4 class="description-heading">Well come to Quiz Master.</h4>
                        <p>One focused location for your exam preparation journey<br>
                            Start your preparation now.
                        </p>
                        <div class="d-flex column-gap-3 mt-5">
                            <router-link to='/login' class="LR">
                                <div class="button-block">
                                    Login
                                </div>
                            </router-link>
                            <router-link to='/register' class="LR">
                                <div class="button-block">
                                    New User
                                </div>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    components: {
        /**  add any components here */
    },
    methods: {

    }
}

export default homePage;