const attemptedQuiz = {
    template: `
        <div class="p-2">
            <div class="p-3">
                <h3 class="text-danger fst-italic">All attempted quizzes</h3>
            </div>
            <hr class="text-danger" style="height:2px">uban
            <ol v-for="(attempt,index) in all_quiz_attempts">
                <li>
                    <span>Quiz ID : {{attempt.quiz_id}}</span><br>
                    <span>Attempt No : {{attempt.attempt_number}}</span><br>
                    <span>Score : {{attempt.score}}</span><br>
                    <span>Time taken : {{attempt.time_taken}}</span><br>
                    <span>Time Of Attempt : {{attempt.timestamp}}</span>
                </li>
            </ol>

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