const adminProfile = {
    template: `
        <div class="m-5">
            <p>
                <span class="text-primary fw-bold">Name</span> : {{ name }} <br>
                <span class="text-primary fw-bold">Date of Birth</span> : {{ dob }} <br>
                <span class="text-primary fw-bold">Department</span> : {{ department }}
            </p>
             
        </div>
    `,
    data() {
        return {
            name: null,
            dob: null,
            department: null
        }
    },
    created() {
        this.initialize();
    },
    methods: {
        initialize() {
            this.name = this.$store.state.adminData.full_name
            this.dob = this.$store.state.adminData.dob
            this.department = this.$store.state.adminData.department
        }
    }
}

export default adminProfile;