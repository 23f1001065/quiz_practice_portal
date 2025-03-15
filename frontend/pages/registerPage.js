const Register = {
    template: `
        <div class="vh-100 p-5">
            <h2 class="description-heading">Create Your Account</h2><br>
            <form v-on:submit.prevent="submitRegister">
                <input type="email" placeholder="email" v-model="email" @keydown.space.prevent class="form-control"><br>
                <input type="text" placeholder="your first name" v-model="first_name" @keydown.space.prevent class="form-control"><br>
                <input type="text" placeholder="your middle name" v-model="mid_name" @keydown.space.prevent class="form-control"><br>
                <input type="text" placeholder="your last name" v-model="last_name" @keydown.space.prevent class="form-control"><br>
                <input type="password" placeholder="password" v-model="password" class="form-control"><br>
                <input type="password" placeholder="retype password" v-model="retype_password" class="form-control"><br>
                
                <button type="submit" class="button form-control">Register</button><br>
            </form>
        </div>
    `,
    data() {
        return {
            email: null,
            first_name: null,
            mid_name: null,
            last_name: null,
            password: null,
            retype_password: null,
            password_error: null
        }
    },
    methods: {
        is_data_valid() {
            if (this.email && this.first_name && this.last_name && this.password && this.retype_password) {
                if (this.password != this.retype_password) {
                    this.error = 'both password should be same';
                    return false;
                }
                return true;
            }
            else {
                if (!this.email) {
                    this.error = 'please provide an email';
                    return false;
                }
                else if (!this.first_name) {
                    this.error = 'please provide your first name';
                    return false;
                }
                else if (!this.last_name) {
                    this.error = 'please provide your last name';
                    return false;
                }
                else if (!this.password) {
                    this.error = 'please provide a strong password';
                    return false;
                }
                else if (this.password != this.retype_password) {
                    this.error = 'both password should be same';
                    return false;
                }

                return false
            }
        },
        async submitRegister() {
            if (this.is_data_valid()) {
                const response = await fetch(
                    location.origin + '/api/register',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            first_name: this.first_name,
                            mid_name: this.mid_name,
                            last_name: this.last_name,
                            email: this.email.toLowerCase(),
                            password: this.retype_password,
                            registered_at: new Date().toLocaleString(
                                "en-GB",
                                {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: true
                                }
                            ).toUpperCase()
                        })
                    }
                )
                const data = await response.json()
                if (response.ok) {
                    console.log(data.MESSAGE);
                    sessionStorage.setItem("isRegistered", true);
                    this.$router.push('/registration-successfull')
                }
                else {
                    console.log(data.MESSAGE)
                }
            }
            else {
                alert(this.error)
                console.error(this.error);
            }
        },
    },

}


export default Register;