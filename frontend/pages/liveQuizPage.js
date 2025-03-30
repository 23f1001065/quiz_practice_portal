const quizPage = {
    template: `
    <div class="vh-100">
        <div class="p-3 h-100 container-fluid">
            <div style="height:15%" class="row border px-3">
                <div class="col-sm-9">
                    <span class="fw-bold text-warning">QUIZ CHAPTER : </span>{{ this.quiz.chapter_name }}<br>
                    <span class="fw-bold text-warning">QUIZ DURATION : </span>{{ this.quiz.duration }} minutes<br>
                    <span class="fw-bold text-warning">TOTAL MARKS : </span>{{ this.quiz.full_marks }}<br>
                </div>
                <div class="col-sm-3">
                    <span class="fw-bold text-danger">Time - </span>{{ showTime }}<br>
                </div>
            </div>
            <div class="row" style="height:85%">
                <div class="col-sm-9 border overflow-auto h-100">
                    <ol>
                        <li v-for="(question,index) in questions">
                            <div class="p-3 d-flex justify-content-between">
                                <p><span class="fw-bold">Question {{ index + 1 }} :</span><br>
                                    {{question.statement}}
                                </p>
                                <p class="fw-bold">
                                    {{question.point}} point
                                </p>
                            </div>
                            <div class="px-5">
                                <form>
                                    <label>
                                        <input type="radio" v-model="answers[index].selectedOp" :name="'Ques_'+index" value="op1"> {{question.op1}}
                                    </label><br>
                                    <label>
                                        <input type="radio" v-model="answers[index].selectedOp" :name="'Ques_'+index" value="op2"> {{question.op2}}
                                    </label><br>
                                    <label>
                                        <input type="radio" v-model="answers[index].selectedOp" :name="'Ques_'+index" value="op3"> {{question.op3}}
                                    </label><br>
                                    <label>
                                        <input type="radio" v-model="answers[index].selectedOp" :name="'Ques_'+index" value="op4"> {{question.op4}}
                                    </label><br>
                                </form>
                            </div>
                            <hr>
                        </li>
                    </ol>
                </div>
                <div class="col-sm-3 border  overflow-auto">
                    <div style="height:94%">
                        
                    </div>
                    <div style="height:6%" class="d-flex justify-content-center">
                        <button class="bg-primary text-light" @click="submit">submit</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            quiz_id: null,
            user_id: null,
            quiz: null,
            questions: [],
            answers: [],
            time_remain: null,
            time_taken: 0,
            timer: null,
            score_id: null
        }
    },
    computed: {
        showTime() {
            let min = Math.floor(this.time_remain / 60);
            let sec = this.time_remain % 60
            return `${min} : ${sec < 10 ? "0" : ""}${sec}`
        },
        timeTaken() {
            let min = Math.floor(this.time_taken / 60);
            let sec = this.time_taken % 60
            return `${min} : ${sec < 10 ? "0" : ""}${sec}`
        }
    },
    created() {
        this.validateQueryParameterAndValue()
    },
    mounted() {
        this.startExam()
        this.fetchAllQuestions()
        this.startTimer()
        this.set()
        history.pushState(null, null, location.href)
        window.onpopstate = () => {
            history.pushState(null, null, location.href)
            alert("You have an ongoing quiz. You can not leave.")

        }
    },
    beforeDestroy() {
        clearInterval(this.timer)
        window.onpopstate = null;
    },
    methods: {
        startTimer() {
            this.timer = setInterval(() => {
                if (this.time_remain > 0) {
                    this.time_remain -= 1
                    this.time_taken += 1
                }
                else {
                    alert("Your time up !!")
                    clearInterval(this.timer)
                    this.submit()
                }
            }, 1000);
        },
        async fetchAllQuestions() {
            try {
                if (this.$route.query.quiz_id) {
                    const response = await fetch(
                        location.origin + '/api/get-question',
                        {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': this.$store.state.loginData.auth_token
                            },
                            body: JSON.stringify({
                                "quiz_id": this.$route.query.quiz_id
                            })
                        }
                    )
                    const data = await response.json()
                    if (response.ok) {
                        console.log(data)
                        this.quiz = data.quiz
                        this.time_remain = this.quiz.duration * 60
                        this.questions = data.questions
                        this.answers = this.questions.map(q => ({
                            question_id: q.id, selectedOp: null
                        }));
                    }
                    else {
                        console.log("NOT_OK")
                        alert("Error loading data")
                    }
                }
            }
            catch (error) {
                alert("Error getting query attribute value")
            }
        },
        async validateQueryParameterAndValue() {
            try {
                if (this.$route.query.quiz_id && this.$route.query.user_id) {
                    const response = await fetch(
                        location.origin + '/api/check-valid-user-and-quiz',
                        {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': this.$store.state.loginData.auth_token
                            },
                            body: JSON.stringify({
                                "quiz_id": this.$route.query.quiz_id,
                                "user_id": this.$route.query.user_id
                            })
                        }
                    )
                    if (response.ok) {
                        console.log("OK")
                    }
                    else {
                        console.log("NOT_OK")
                        this.$router.push('/404')
                    }
                }
                else {
                    console.log("MALFORMED_PARAM")
                    this.$router.push('/404')
                }
            }
            catch (error) {
                console.log("ERROR_FETCH", error)
                this.$router.push('/404')
            }
        },
        async startExam() {
            const response = await fetch(
                location.origin + '/api/start-quiz',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': this.$store.state.loginData.auth_token
                    },
                    body: JSON.stringify({
                        "quiz_id": this.$route.query.quiz_id,
                        "start_time": new Date().toISOString()
                    })

                }
            )
            const data = await response.json()
            if (response.ok) {
                this.score_id = data.score_id
                console.log(data)
            }
            else {
                if (data.CODE === 403) {
                    this.$router.push({ path: '/live-quiz', query: { user_id: this.$route.query.user_id, quiz_id: this.$route.query.quiz_id } })
                }
                else if (data.CODE === 423) {
                    alert(data.MESSAGE)
                    this.$router.push('/student_dashboard')
                }
                else {
                    this.$router.push('/student_dashboard')
                }
            }
        },
        async submit() {
            if (confirm("Do you want to submit your answer?")) {
                const response = await fetch(
                    location.origin + '/api/evalution-quiz',
                    {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': this.$store.state.loginData.auth_token
                        },
                        body: JSON.stringify({
                            "score_id": this.score_id,
                            "quiz_id": this.$route.query.quiz_id,
                            "time_taken": this.timeTaken,
                            "answers": this.answers
                        })
                    }
                )
                const data = await response.json()
                if (response.ok) {
                    sessionStorage.setItem('evaluated_quiz', JSON.stringify(data))
                    sessionStorage.setItem("isGotResult", true);
                    clearInterval(this.timer)
                    this.$router.replace("/quiz-result")
                }
                else {
                    console.log("NOT_OK")
                }
            }
        },
        set() {
            this.quiz_id = this.$route.query.quiz_id
            this.user_id = this.$route.query.user_id
            console.log(this.answers.length)
        }

    }
}





export default quizPage