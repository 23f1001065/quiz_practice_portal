const Status = {
    template: `
        <div class="border m-5 p-3">
            <h3 class="text-success">Registrtaion Successfull.</h3><br>
            <p>now you can <router-link to='/login'>login</router-link> using your credentials to access your account.</p>
        </div>
    `,
    mounted() {
        sessionStorage.removeItem("isRegistered");
    }
}

export default Status;