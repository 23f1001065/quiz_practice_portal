const adminProfile = {
    template: `
        <div class="m-5">
            <p> Name : {{ name }} </p>
            <p> Date of Birth : {{ dob }} </p>
            <p> Department : {{ department }} </p>
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