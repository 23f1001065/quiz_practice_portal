const Login = {
    template: `
    <div class="vh-100">
            
        <div class="d-flex justify-content-center align-items-center h-100">
            <div class="p-5 border border-2 border-secondary rounded-1">
                <h2 class="description-heading">WellCome Back</h2><br>
                
                <form v-on:submit.prevent="submitLogin">
                    <label>Email</label><br>
                        <input type="email" placeholder="please enter your email" v-model="email"  @keydown.space.prevent class="form-control" autocomplete="username"><br>
                    <label>Password</label><br>
                        <input type="password" placeholder="your password" v-model="password" class="form-control" autocomplete="current-password"><br>
                    <button type="submit" class="button form-control">login</button><br>
                </form>
                
                <p class="text-secondary">
                    if don't have any account please <router-link to='/register'>register</router-link>
                </p>
            </div>
        </div>
        
        
        
    </div>
    `,
    data() {
        return {
            email: null,
            password: null,

        }
    },
    methods: {
        async submitLogin() {
            if (this.valid_input()) {
                /**go for next step */
                const response = await fetch(
                    location.origin + '/api/login',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: this.email,
                            password: this.password
                        })
                    }
                )
                const data = await response.json()
                if (response.ok) {
                    sessionStorage.setItem("user", JSON.stringify(data))
                    this.$store.commit('set_user')
                    if (data.role === 'admin') {
                        this.$router.push('/admin_dashboard')
                    }
                    else if (data.role === 'student') {
                        this.$router.push('/student_dashboard')
                    }
                    else {
                        alert('Not authorized');
                        this.$router.push('/login');
                    }
                }
                else {
                    /**go for alternate */
                    console.error('Error fetching data');
                    console.error(data.CODE);
                }
            }
            else {
                alert("Please provide correct input!!");
            }

        },
        valid_input() {
            if (this.email && this.password) {
                return true;
            }
            else {
                return false;
            }
        }
    }
}

export default Login;