import homePage from "../pages/homePage.js";
/** Component  For login  */
import Login from "../components/login.js";
/** Dashboard component for two main type of users */
import adminDasboardPage from "../pages/adminDashboard.js";
import studentDasboardPage from "../pages/studentDashboard.js";
/** All Admin Child Components */
import adminProfile from "../components/adminProfile.js";
import adminHome from "../components/adminHome.js";
import adminCreate from "../components/adminCreate.js";
import adminManage from "../components/adminManage.js";
import adminSearch from "../components/adminSearch.js";
import adminSummary from "../components/adminSummary.js";

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
        path: '/admin_dashboard',
        component: adminDasboardPage,
        children: [
            {
                path: '',
                component: adminHome

            },
            {
                path: 'profile',
                component: adminProfile

            },
            {
                path: 'create',
                component: adminCreate

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
        ]
    },
    {
        path: '/student_dashboard',
        component: studentDasboardPage,
        children: [
            {
                path: '',
                component: studentHome
            }
        ]
    }
]

const router = new VueRouter({
    routes
})

export default router;