const quiz = {
    template: `
        <div class="mt-4 h-100 w-100 container-fluid">
            <div class="row mt-2">
                <div class="col-sm-4" :class="{'blurr-back': icon_clicked !== 'Create' || show_quiz_form}">
                    <h5>All Quizzes of Chapter : <br>{{ chapter_name }}</h5>
                    <hr class="my-2">
                    <div v-if="total_quiz === 0" class="d-flex justify-content-center">
                        <h6 class="text-secondary">No quiz</h6>
                    </div>
                    <div v-else >
                        <ul>
                            <li v-for="(quiz,index) in quizzes" class="subject pb-2">
                                <span class="text-primary fw-bold">Title</span> : {{ quiz.title }} <br>
                                <span class="text-primary fw-bold">Duration</span> : {{ quiz.duration }} <br>
                                <span class="text-primary fw-bold">Time</span> : {{ quiz.time }} <br>
                                <span class="text-primary fw-bold">Quiz Date</span> : {{ quiz.date }}<br>
                                <div class="d-flex justify-content-end gap-2">
                                    <i class="bi bi-pencil-square text-warning" title="edit quiz" @click="go_to_edit(quiz,index)"></i>
                                    <i class="bi bi-patch-question text-success" title="add question" @click="go_to_question(quiz.id,quiz.title)"></i>
                                    <i class="bi bi-trash3 text-danger" title="delete quiz" @click="deleteQuiz(quiz.id)"></i>
                                </div>

                            </li>
                        </ul>
                    </div>
                    <div v-if="!show_quiz_form">
                        <button class="button"  @click="add_quiz"><i class="bi bi-plus-circle fs-5"></i>Add Quiz</button>
                    </div>
                </div>
                <div class="col-sm-8">
                    <h5>Quiz<br> {{ icon_clicked }} </h5>
                    <hr class="my-2">
                    <form v-on:submit.prevent="createQuiz" v-if="show_quiz_form">
                        <label>Chapter</label> : <input type="text" v-model="chapter_name" readonly><br>
                        <label>Quiz Title</label> : <input type="text" v-model="title"><br>
                        <label>Duration</label> : <input type="number" min="1" v-model="duration"> (minutes)<br>
                        <label>Time</label> : <input type="time" v-model="time"><br>
                        <label>Date of Quiz</label> : <input type="date" id="date" :min="today" v-model="date_of_quiz"><br>
                        <div class="d-flex justify-content-between my-3">
                            <button type="submit" class="button">Create</button>
                            <button class="button" @click="cancel_add">back</button>
                        </div>
                    </form>
                    <form v-on:submit.prevent="updateQuiz" v-if="go_to_option === 'Edit'">
                        <label>Chapter</label> : <input type="text" v-model="chapter_name" readonly><br>
                        <label>Quiz Title</label> : <input type="text" v-model="title"><br>
                        <label>Duration</label> : <input type="number" min="1" v-model="duration"> (minutes)<br>
                        <label>Time</label> : <input type="time" v-model="time"><br>
                        <label>Date of Quiz</label> : <input type="date" id="date" :min="today" v-model="date_of_quiz"><br>
                        <div class="d-flex justify-content-between my-3">
                            <button type="submit" class="button">Edit</button>
                            <button class="fs-3 button" @click="cancel_edit"><i class="bi bi-x-lg"></i></button>
                        </div>
                    </form>
                    <div v-if="go_to_option === 'Question'">
                        <div v-if="total_question === 0" class="d-flex justify-content-center">
                            <h6 class="text-secondary">No question</h6>
                        </div>
                        <ol>
                            <li v-for="(question,index) in questions" class="subject pb-2">
                                <span class="text-primary fw-bold">Title</span> : {{ question.quiz_title }} <br>
                                <span class="text-primary fw-bold">Question Statement</span> : {{ question.statement }} <br>
                                <span class="text-primary fw-bold">op1</span> : {{ question.op1 }}
                                <span class="text-primary fw-bold">op2</span> : {{ question.op2 }}
                                <span class="text-primary fw-bold">op3</span> : {{ question.op3 }}
                                <span class="text-primary fw-bold">op4</span> : {{ question.op4 }}<br>
                                <span class="text-primary fw-bold">correct op</span> : {{ question.cor_opt }}<br>
                                <span class="text-primary fw-bold">point</span> : {{ question.point }}
                                
                            </li>
                        </ol>
                        <div v-if="!show_question_form" class="d-flex justify-content-between my-3">
                            <button class="button"  @click="add_question">add question</button>
                            <button class="button" @click="cancel_add_question">back</button>
                        </div>
                        <form v-if="show_question_form" v-on:submit.prevent="createQuestion">
                            <h5>Create Question</h5>
                            <hr class="mb-2">
                            <label>Quiz</label> : <input type="text" v-model="title" readonly><br>
                            <label>Question Statement</label><br><textarea rows="3"  cols="50"  v-model="statement"></textarea><br>
                            <label>Option 1</label> : <input type="text" v-model="op1"><br>
                            <label>Option 2</label> : <input type="text" v-model="op2"><br>
                            <label>Option 3</label> : <input type="text" v-model="op3"><br>
                            <label>Option 4</label> : <input type="text" v-model="op4"><br>
                            <label>Correct Option</label> : <input type="text" @keydown.space.prevent v-model="cor_opt"><br>
                            <label>point</label> : <input type="number" v-model="point">
                            <div class="d-flex justify-content-between my-3">
                                <button type="submit" class="button">create</button>
                                <button class="fs-3 button" @click="cancel_create_question"><i class="bi bi-x-lg"></i></button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            
        </div>
    `,
    data() {
        return {
            chapter_id: null,
            chapter_name: null,
            quizzes: [],
            index: null,
            quiz_id: null,
            title: null,
            duration: null,
            time: null,
            date_of_quiz: null,
            show_quiz_form: false,
            show_question_form: false,
            icon_clicked: 'Create',
            questions: [],
            statement: null,
            op1: null,
            op2: null,
            op3: null,
            op4: null,
            cor_opt: null,
            point: null,
            question_id: null,
            edit_question: false

        }
    },
    computed: {
        today() {
            return new Date().toISOString().split("T")[0]
        },
        total_quiz() {
            return this.quizzes.length
        },
        total_question() {
            return this.questions.length
        },
        go_to_option() {
            return this.icon_clicked
        }
    },
    created() {
        this.chapter_id = parseInt(this.$route.query.chapter_id)
        this.fetchQuizzes()
    },
    methods: {
        async fetchQuizzes() {
            const response = await fetch(
                location.origin + '/api/all-quiz',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': this.$store.state.loginData.auth_token
                    },
                    body: JSON.stringify({
                        "chapter_id": this.chapter_id
                    })
                }
            )
            const all_quizzes = await response.json()
            if (response.ok) {
                this.chapter_name = all_quizzes.chapter_name;
                this.quizzes = all_quizzes.quizzes;
                console.log(all_quizzes.quizzes)
            }
            else {
                alert('Error fetching quizzes')
            }
        },
        async createQuiz() {
            const response = await fetch(
                location.origin + '/api/create-quiz',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': this.$store.state.loginData.auth_token
                    },
                    body: JSON.stringify({
                        "chapter_id": this.chapter_id,
                        "title": this.title,
                        "duration": this.duration,
                        "date": this.date_of_quiz,
                        "time": this.time
                    })
                }
            )
            const data = await response.json()
            if (response.ok) {
                this.quizzes.push({
                    id: data.id,
                    title: this.title,
                    chapter: this.chapter_name,
                    duration: this.duration,
                    date: this.date_of_quiz,
                    time: this.time
                })
                alert("Quiz created successfully")
                this.cancel_add()
            }
            else {
                alert('Error fetching quizzes')
            }
        },
        async updateQuiz() {
            const response = await fetch(
                location.origin + '/api/edit-quiz',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': this.$store.state.loginData.auth_token
                    },
                    body: JSON.stringify({
                        "quiz_id": this.quiz_id,
                        "title": this.title,
                        "duration": this.duration,
                        "date": this.date_of_quiz,
                        "time": this.time
                    })
                }
            )
            const data = await response.json()
            if (response.ok) {
                this.$set(
                    this.quizzes,
                    this.index,
                    {
                        ...this.quizzes[this.index],
                        title: this.title,
                        duration: this.duration,
                        date: this.date_of_quiz,
                        time: this.time

                    }
                )
                alert("Quiz edited successfully")
                this.cancel_edit()
            }
            else {
                alert('Error fetching quizzes')
            }
        },
        async deleteQuiz(id) {
            let userResponse = confirm("You are going to delete this quiz.\nDo you want to continue?")
            if (userResponse) {
                const response = await fetch(
                    location.origin + '/api/delete-quiz',
                    {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': this.$store.state.loginData.auth_token
                        },
                        body: JSON.stringify({
                            "id": id
                        })
                    }
                )
                const data = await response.json()
                if (response.ok) {
                    let index = this.quizzes.findIndex(quiz => quiz.id === id)
                    this.quizzes.splice(index, 1)
                    alert(data.MESSAGE);
                }
                else {
                    alert(data.MESSAGE);
                }
            }
        },
        async fetchQuestions() {
            const response = await fetch(
                location.origin + '/api/all-question',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': this.$store.state.loginData.auth_token
                    },
                    body: JSON.stringify({
                        "quiz_id": this.quiz_id
                    })
                }
            )
            const all_questions = await response.json()
            if (response.ok) {
                this.questions = all_questions.questions;
                console.log(all_questions.questions)
            }
            else {
                alert('Error fetching questions')
            }
        },
        async createQuestion() {
            const response = await fetch(
                location.origin + '/api/create-question',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': this.$store.state.loginData.auth_token
                    },
                    body: JSON.stringify({
                        "quiz_id": this.quiz_id,
                        "statement": this.statement,
                        "op1": this.op1,
                        "op2": this.op2,
                        "op3": this.op3,
                        "op4": this.op4,
                        "cor_opt": this.cor_opt,
                        "point": this.point
                    })
                }
            )
            const data = await response.json()
            if (response.ok) {
                this.questions.push({
                    id: data.id,
                    statement: this.statement,
                    op1: this.op1,
                    op2: this.op2,
                    op3: this.op3,
                    op4: this.op4,
                    cor_opt: this.cor_opt,
                    point: this.point
                })
                alert("Question created successfully")
                this.cancel_create_question()
            }
            else {
                alert("Error")
            }
        },
        /*
        async deleteQuestion(id) {
            let userResponse = confirm("You are going to delete this question.Do you want to continue?")
            if (userResponse) {
                const response = await fetch(
                    location.origin + '/api/delete-question',
                    {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': this.$store.state.loginData.auth_token
                        },
                        body: JSON.stringify({
                            "id": id
                        })
                    }
                )
                const data = await response.json()
                if (response.ok) {
                    let index = this.questions.findIndex(qu => qu.id === id)
                    this.questions.splice(index, 1)
                    alert(data.MESSAGE);
                }
                else {
                    alert(data.MESSAGE);
                }
            }
        },*/
        add_quiz() {
            this.show_quiz_form = true
        },
        cancel_add() {
            this.title = null
            this.duration = null
            this.time = null
            this.date_of_quiz = null
            this.show_quiz_form = false
        },
        go_to_edit(quiz, index) {
            this.icon_clicked = "Edit"
            this.index = index
            this.quiz_id = quiz.id
            this.title = quiz.title
            this.date_of_quiz = quiz.date
            this.time = quiz.time
            this.duration = quiz.duration
        },
        cancel_edit() {
            this.icon_clicked = 'Create'
            this.title = null
            this.date_of_quiz = null
            this.time = null
            this.duration = null
            this.quiz_id = null
            this.index = null
        },
        go_to_question(id, title) {
            this.icon_clicked = "Question"
            this.quiz_id = id
            this.title = title
            this.fetchQuestions()
        },
        add_question() {
            this.show_question_form = true
        },
        cancel_add_question() {
            this.icon_clicked = "Create"
            this.quiz_id = null
            this.title = null
        },
        cancel_create_question() {
            this.show_question_form = false
            this.statement = null
            this.op1 = null
            this.op2 = null
            this.op3 = null
            this.op4 = null
            this.cor_opt = null
            this.point = null
        }
    }
}

export default quiz
