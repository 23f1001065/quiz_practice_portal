const attemptedQuiz = {
    template: `
        <div class="p-2 h-100">
            <div class="p-3" style="height:10%">
                <h3 class="text-danger fst-italic">All attempted quizzes</h3>
            </div>
            <hr class="text-danger" style="height:2px">
            <div style="height:85%" class="overflow-auto">
                <ol>
                    <li v-for="(attempt,index) in all_quiz_attempts" class="p-3">
                        <span class="text-success fw-bold">Quiz ID : </span>{{attempt.quiz_id}}<br>
                        <span class="text-success fw-bold">Attempt No : </span>{{attempt.attempt_number}}<br>
                        <span class="text-success fw-bold">Your Score : </span>{{attempt.score}}<br>
                        <span class="text-success fw-bold">Time taken : </span>{{attempt.time_taken}}<br>
                        <span class="text-success fw-bold">Time Of Attempt : </span>{{attempt.timestamp}}
                        <hr>
                    </li>
                </ol>
            <div>

        </div>
    `,
    data() {
        return {
            all_quiz_attempts: []
        }
    },
    created() {
        this.getAllQuizAttempt()
    },
    methods: {
        async getAllQuizAttempt() {
            try {
                const response = await fetch(
                    location.origin + '/api/get-all-quiz-attempt',
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': this.$store.state.loginData.auth_token
                        }
                    }
                )
                const data = await response.json()
                if (response.ok) {
                    this.all_quiz_attempts = data
                    this.all_quiz_attempts.sort((ob1, ob2) => ob1.attempt_number - ob2.attempt_number)
                }
                else {
                    alert('ERROR_LOADING')
                }
            }
            catch {
                alert("SERVER_ERROR_API_NOT_RESPONDING")
            }
        }
    }
}
export default attemptedQuiz;