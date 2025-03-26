const adminManage = {
    template: `
        <div class=" h-100">
            <div class="ms-3 p-3">
                <h4 class="description-heading">Manage Quizzes</h4>
            </div>
            <hr>
            <div class="py-4 d-flex justify-content-end" v-if="!go_to_option">
                <form>
                    <label>Select subject:-</label>
                    <select v-model="selectedSubject" @change="getChapters">
                        <option v-for="subject in subjects" :value="subject.id">{{ subject.name }}</option>
                    </select>
                    <label>Select chapter:-</label>
                    <select v-model="selectedChapter" @change="getQuizzes">
                        <option v-for="chapter in chapters" :value="chapter.id">{{ chapter.name }}</option>
                    </select>
                    <label>Select quizzes:-</label>
                    <select v-model="selectedQuiz" @change="getQuizDetail">
                        <option v-for="quiz in quizzes" :value="quiz.id">{{ quiz.name }}</option>
                    </select>
                </form>
            </div>
            <div class="container-fluid" v-if="quiz">
                <div class="row">
                    <div class="col-sm-7">
                        <h5>Quiz details</h5>
                        <hr>
                        <div class="mt-3 mb-5">
                            <span class="text-success fw-bold">Quiz ID</span> : {{ quiz.id }} <br>
                            <span class="text-success fw-bold">Title</span> : {{ quiz.title }} <br>
                            <span class="text-success fw-bold">Duration</span> : {{ quiz.duration }} minutes <br>
                            <span class="text-success fw-bold">Time</span> : {{ quiz.time }}<br>
                            <span class="text-success fw-bold">Quiz Date</span> : {{ quiz.date_of_quiz }}<br>
                        </div>
                        <h5>Questions details</h5>
                        <hr>
                        <div v-if="quiz.questions.length === 0" class="mt-3 mb-5 d-flex justify-content-center">
                                <h6 class="text-secondary">No questions added yet</h6>
                        </div>
                        <ol class="mt-3 mb-5">
                            
                            <li v-for="question in quiz.questions" class="subject pb-2">

                                <span class="text-primary fw-bold">Question Statement</span> : {{ question.question_statement }} <br>
                                <span class="text-primary fw-bold">op1</span> : {{ question.op1 }}<br>
                                <span class="text-primary fw-bold">op2</span> : {{ question.op2 }}<br>
                                <span class="text-primary fw-bold">op3</span> : {{ question.op3 }}<br>
                                <span class="text-primary fw-bold">op4</span> : {{ question.op4 }}<br>
                                <span class="text-primary fw-bold">correct op</span> : {{ question.correct_op }}<br>
                                <span class="text-primary fw-bold">point</span> : {{ question.point }}
                                <div class="d-flex justify-content-end gap-2" v-if="!go_to_option">
                                    <i class="bi bi-pencil-square text-warning" title="edit quiz" @click="showQuestionEditForm(question)"></i>
                                    <i class="bi bi-trash3 text-danger" title="delete quiz" @click="deleteQuestion(question.id)"></i>
                                </div>
                            </li>
                        </ol>
                    </div>
                    <div class="col-sm-5">
                        <h5>Edit Question</h5>
                        <hr>
                        <form v-on:submit.prevent="editQuestion" v-if="go_to_option === 'questionEdit'" class="my-3">
                            <label>Question Statement</label><br><textarea rows="3"  cols="50"  v-model="statement"></textarea><br>
                            <label>Option 1</label> : <input type="text" v-model="op1"><br>
                            <label>Option 2</label> : <input type="text" v-model="op2"><br>
                            <label>Option 3</label> : <input type="text" v-model="op3"><br>
                            <label>Option 4</label> : <input type="text" v-model="op4"><br>
                            <label>Correct Option</label> : <input type="text" v-model="cor_opt"><br>
                            <label>point</label> : <input type="number" min="0" v-model="point">
                            <div class="d-flex justify-content-between my-3">
                                <button type="submit" class="button">save</button>
                                <button class="button" @click="cancelQuestionEditForm">cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            subjects: [],
            chapters: [],
            quizzes: [],
            selectedSubject: null,
            selectedChapter: null,
            selectedQuiz: null,
            quiz: null,
            go_to_option: null,

            question_id: null,
            statement: null,
            op1: null,
            op2: null,
            op3: null,
            op4: null,
            cor_opt: null,
            point: null
        }
    },
    computed: {
        today() {
            return new Date().toISOString().split("T")[0]
        }
    },
    created() {
        this.getSubjectIdName()
    },
    methods: {
        async getSubjectIdName() {
            const response = await fetch(
                location.origin + '/api/get-subject-id-name',
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
                this.subjects = data

            }
            else {
                alert("Error accessing subjects")
            }
        },
        async getChapterIdName() {
            const response = await fetch(
                location.origin + '/api/get-chapter-id-name',
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': this.$store.state.loginData.auth_token
                    },
                    body: JSON.stringify({
                        "subject_id": this.selectedSubject
                    })
                }
            )
            const data = await response.json()
            if (response.ok) {
                this.chapters = data

            }
            else {
                alert("Error accessing chapters")
            }
        },
        async getQuizIdTitle() {
            const response = await fetch(
                location.origin + '/api/get-quiz-id-title',
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': this.$store.state.loginData.auth_token
                    },
                    body: JSON.stringify({
                        "chapter_id": this.selectedChapter
                    })
                }
            )
            const data = await response.json()
            if (response.ok) {
                this.quizzes = data

            }
            else {
                alert("Error accessing quizzes")
            }
        },
        getChapters() {
            this.getChapterIdName()
            this.getQuizIdTitle()
        },
        getQuizzes() {
            this.getQuizIdTitle()
        },
        async getQuizDetail() {
            const response = await fetch(
                location.origin + '/api/get-quiz',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': this.$store.state.loginData.auth_token
                    },
                    body: JSON.stringify({
                        "quiz_id": this.selectedQuiz
                    })
                }
            )
            const data = await response.json()
            if (response.ok) {
                this.quiz = data
                console.log(this.quiz)
            }
            else {
                alert("Error accessing quizzes")
            }
        },/*
        async editQuiz() {
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
                        "date": this.date,
                        "time": this.time
                    })
                }
            )
            const data = await response.json()
            if (response.ok) {
                this.quiz.title = this.title
                this.quiz.duration = this.duration
                this.quiz.time = this.time
                this.quiz.date_of_quiz = this.date
                alert("Quiz edited successfully")
                this.cancelQuizEditForm()
            }
            else {
                alert('Error fetching quizzes')
            }
        },*/
        /*
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
                    let index = this.quizzes.findIndex(qu => qu.id === id)
                    this.quizzes.splice(index, 1)
                    this.quiz = null
                    alert(data.MESSAGE);
                }
                else {
                    alert(data.MESSAGE);
                }
            }
        },*/
        async editQuestion() {
            const response = await fetch(
                location.origin + '/api/edit-question',
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': this.$store.state.loginData.auth_token
                    },
                    body: JSON.stringify({
                        "id": this.question_id,
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
                let index = this.quiz.questions.findIndex(question => question.id === this.question_id)
                this.$set(
                    this.quiz.questions,
                    index,
                    {
                        ...this.quiz.questions[index],
                        question_statement: this.statement,
                        op1: this.op1,
                        op2: this.op2,
                        op3: this.op3,
                        op4: this.op4,
                        correct_op: this.cor_opt,
                        point: this.point

                    }
                )
                alert("Question updated successfully")
                this.cancelQuestionEditForm()
            }
            else {
                alert("Error")
            }
        },
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
                    let index = this.quiz.questions.findIndex(qu => qu.id === id)
                    this.quiz.questions.splice(index, 1)
                    alert(data.MESSAGE);
                }
                else {
                    alert(data.MESSAGE);
                }
            }
        },/*
        showQuizEditForm() {
            this.go_to_option = "Edit"
            this.quiz_id = this.quiz.id
            this.title = this.quiz.title
            this.duration = this.quiz.duration
            this.time = this.quiz.time
            this.date = this.quiz.date_of_quiz
        },
        cancelQuizEditForm() {
            this.go_to_option = null
            this.quiz_id = null
            this.title = null
            this.duration = null
            this.time = null
            this.date = null
        },*/
        showQuestionEditForm(question) {
            this.go_to_option = "questionEdit"
            this.question_id = question.id
            this.statement = question.question_statement
            this.op1 = question.op1
            this.op2 = question.op2
            this.op3 = question.op3
            this.op4 = question.op4
            this.cor_opt = question.correct_op
            this.point = question.point
        },
        cancelQuestionEditForm() {
            this.go_to_option = null
            this.question_id = null
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


export default adminManage;