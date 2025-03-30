const result = {
    template: `
        <div class="p-5">
            <h3 class="text-success">Quiz Submission is Successfull.</h3><br>
        
            QUIZ SCORE : {{score}}<br>
            TIME SPENT - {{time_taken}}
            <router-link to="/student_dashboard">go back</router-link>
        </div>
    `,
    data() {
        return {
            result: [],
            score: null,
            time_taken: null
        }
    },
    mounted() {
        sessionStorage.removeItem("isGotResult");
        this.get_result()
    },
    methods: {
        get_result() {
            const data = JSON.parse(sessionStorage.getItem('evaluated_quiz'))
            this.result = data.result
            this.score = data.score
            this.time_taken = data.time_taken
        }
    }
}

export default result