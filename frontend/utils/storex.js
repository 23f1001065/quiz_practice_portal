const loginData = {
    state: () => ({
        isLoggedIn: false,
        role: null,
        auth_token: null,
        user_id: null,
    }),
    mutations: {
        set_user(state) {
            const user = JSON.parse(sessionStorage.getItem('user'))
            if (user) {
                state.isLoggedIn = true
                state.role = user.role
                state.auth_token = user.auth_token
                state.user_id = user.id
            }

        },
        unset_user(state) {
            state.isLoggedIn = false
            state.role = null
            state.auth_token = null
            state.user_id = null
        }
    },
    actions: {

    }
}

const adminData = {
    state: () => ({
        full_name: null,
        first_name: null,
        mid_name: null,
        last_name: null,
        dob: null,
        department: null,


    }),
    mutations: {
        set_admin(state) {
            const admin = JSON.parse(sessionStorage.getItem('admin'))
            if (admin) {
                state.first_name = admin.first_name
                state.mid_name = admin.mid_name
                state.last_name = admin.last_name
                state.dob = admin.dob
                state.department = admin.department
                if (admin.mid_name) {
                    state.full_name = admin.first_name + ' ' + admin.mid_name + ' ' + admin.last_name
                }
                else {
                    state.full_name = admin.first_name + ' ' + admin.last_name
                }
            }

        },
        unset_admin(state) {
            state.first_name = null
            state.mid_name = null
            state.last_name = null
            state.full_name = null
            state.dob = null
            state.department = null
        }

    },
    actions: {}
}

const studentData = {
    state: () => ({
        full_name: null,
        first_name: null,
        mid_name: null,
        last_name: null,
        dob: null,
    }),
    mutations: {
        set_student(state) {
            const student = JSON.parse(sessionStorage.getItem('student'))
            if (student) {
                state.first_name = student.first_name
                state.mid_name = student.mid_name
                state.last_name = student.last_name
                state.dob = student.dob
                if (student.mid_name) {
                    state.full_name = student.first_name + ' ' + student.mid_name + ' ' + student.last_name
                }
                else {
                    state.full_name = student.first_name + ' ' + student.last_name
                }
            }

        },
        unset_student(state) {
            state.first_name = null
            state.mid_name = null
            state.last_name = null
            state.full_name = null
            state.dob = null
        }
    }
}

const globalCssData = {
    state: () => ({
        is_clicked: false
    }),
    mutations: {
        set_it(state, { flag }) {
            state.is_clicked = flag
        }
    }
}

const store = new Vuex.Store({
    modules: {
        loginData,
        adminData,
        studentData,
        globalCssData
    }
})

/**If browser reload happen then 
 * these data will come from session storage
 */
store.commit('set_user')
store.commit('set_admin')
store.commit('set_student')

export default store