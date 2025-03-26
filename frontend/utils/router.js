import homePage from "../pages/homePage.js";
import Status from "../pages/registrationSuccess.js";
import logoutStatus from "../pages/logoutSuccess.js";
/** Component  For Login and Register  **/
import Login from "../pages/loginPage.js";
import Register from "../pages/registerPage.js";

/** Dashboard component for two main type of users **/
import adminDasboardPage from "../pages/adminDashboard.js";
import studentDasboardPage from "../pages/studentDashboard.js";

/** All Admin Child Components **/
import adminProfile from "../components/adminProfile.js";
import adminHome from "../components/adminHome.js";
import createSubject from "../components/createSubject.js";
import adminManage from "../components/adminManage.js";
import adminSearch from "../components/adminSearch.js";
import adminSummary from "../components/adminSummary.js";
import cChap from "../components/createChapter.js";
import quiz from "../components/createQuiz.js";

/** All Student Child Components **/
import studentHome from "../components/studentHome.js";


const routes = [
    {
        path: '/',
        component: homePage
    },
    {
        path: '/login',
        component: Login

    },
    {
        path: '/register',
        component: Register

    },
    {
        path: '/registration-successfull',
        component: Status,
        beforeEnter: (to, form, next) => {
            if (sessionStorage.getItem("isRegistered")) {
                next();
            }
            else {
                next("/register");
            }
        }
    },
    {
        path: '/logout-successfull',
        component: logoutStatus,
        beforeEnter: (to, form, next) => {
            if (sessionStorage.getItem("isLoggedOut")) {
                next();
            }
            else {
                next("/");
            }
        }
    },
    {
        path: '/admin_dashboard',
        component: adminDasboardPage,
        children: [
            {
                path: 'home',
                component: adminHome

            },
            {
                path: 'profile',
                component: adminProfile

            },
            {
                path: 'create/subject',
                component: createSubject,

            },
            {
                path: 'create/chapter',
                component: cChap,

            },
            {
                path: 'create/quiz',
                component: quiz,

            },
            {
                path: 'Manage',
                component: adminManage

            },
            {
                path: 'search',
                component: adminSearch

            },
            {
                path: 'summary',
                component: adminSummary
            }
        ],
        meta: { requiresLogin: true, role: 'admin' },
    },
    {
        path: '/student_dashboard',
        component: studentDasboardPage,
        children: [
            {
                path: 'home',
                component: studentHome
            }
        ],
        meta: { requiresLogin: true, role: "student" },
    }
]

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    let isLoggedIn = false
    let userRole = null
    const user = JSON.parse(sessionStorage.getItem('user'))
    if (user) {
        isLoggedIn = user.isLoggedIn
        userRole = user.role
    }

    if (to.matched.some((record) => record.meta.requiresLogin)) {
        if (!isLoggedIn) {
            next('/login');
        }
        else {
            const routeRole = to.matched.find(record => record.meta.role)?.meta.role
            if (routeRole && routeRole !== userRole) {
                alert('Role not Authorized !!');
                next('/');
            }
            else {
                next();
            }
        }
    }
    else {
        next();
    }
})


export default router;


