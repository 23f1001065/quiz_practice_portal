const logoutStatus = {
    template: `
        <div class="border m-5 p-3">
            <h3 class="text-success">You log out Successfully.</h3><br>
            <p>go to <router-link to='/'>homepage</router-link></p>
        </div>
    `,
    mounted() {
        sessionStorage.removeItem("isLoggedOut");
    }
}

export default logoutStatus;