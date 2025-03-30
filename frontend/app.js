import router from "./utils/router.js";
import store from "./utils/storex.js";
const app = new Vue({
    el: "#app",
    template: `
        <div>
            <router-view></router-view>
        </div>
    `,
    router,
    store
})