const studentHome = {
    template: `
        <div class="h-100">
            <div class="p-3 h-100 " :class="{ 'blurr-back' : is_quiz_go_button_clicked }">
                <h3 class="text-success fst-italic">Wellcome {{ this.$store.state.studentData.full_name }} ,</h3>
                <p>now pick a subject of your choice and prepare for your exam chapter wise.</p>
                <hr class="my-3">
                <div class="h-75 border">
                    <div class="py-4 d-flex justify-content-end gap-2 z-2" style="height:10% ">
                        <form @submit.prevent>
                            <label>Select subject:-</label>
                            <select v-model="selectedSubject" @change="getChapters">
                                <option v-for="subject in subjects" :value="subject.id">{{ subject.name }}</option>
                            </select>
                            <label>Select chapter:-</label>
                            <select v-model="selectedChapter">
                                <option v-for="chapter in chapters" :value="chapter.id">{{ chapter.name }}</option>
                            </select>
                            <input type="submit" @click="get_Quiz_of_Chapter" value="filter">
                            <input type="submit" @click="get_Quiz_With_Chapter_Name" value="all">
                        </form>
                        
                    </div>
                    <div class="fst-italic fs-4 description-heading p-3 z-2" style="height:10%">
                        Available Quizzes
                    </div>
                    <div class="overflow-auto" style="height:80%">
                        <table class="table table-striped align-middle table-responsive">
                            <thead>
                                <th>#</th>
                                <th>Quiz</th>
                                <th>Chapter name</th>
                                <th>duration( min )</th>
                                <th>description</th>
                                <th>chapter_id</th>
                                <th></th>
                            </thead>
                            <tbody class="table-group-divider">
                                <tr v-for="(quiz,index) in quizzes" class="p-1  subject">
                                    <td class="text-wrap">{{ index + 1 }}</td>
                                    <td class="text-wrap">{{ quiz.title }}</td>
                                    <td class="text-wrap">{{ quiz.chapter_name }}</td>
                                    <td class="text-wrap">{{ quiz.duration }} min </td>
                                    <td class="text-wrap">{{ quiz.description }}</i></td>
                                    <td class="text-wrap">{{ quiz.chapter_id }}</td>
                                    <td><button class="button" @click="go_for_quiz(quiz)">go</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="z-2 position-absolute message-box" v-if="is_quiz_go_button_clicked">
                <div style="height:90%" class="p-4">
                    <h5 class="fst-italic description-heading">About Quiz</h5>
                    <span class="fw-bold text-warning">QUIZ ID : </span>{{ this.quiz.id }}<br>
                    <span class="fw-bold text-warning">QUIZ TITLE : </span>{{ this.quiz.title }}<br>
                    <span class="fw-bold text-warning">QUIZ CHAPTER : </span>{{ this.quiz.chapter_name }}<br>
                    <span class="fw-bold text-warning">QUIZ DURATION : </span>{{ this.quiz.duration }}<br>
                    <span class="fw-bold text-warning">TOTAL QUESTIONS : </span>{{ this.quiz.total_question }}<br>
                    <span class="fw-bold text-warning">TOTAL MARKS : </span>{{ this.quiz.full_marks }}<br>
                </div>
                <div style="height:10%" class="d-flex justify-content-end gap-3">
                    <button class="" @click="go_give_quiz"> go </button>
                    <button class="" @click="go_back">back</button>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            all_quizzes: [],
            quizzes: [],
            subjects: [],
            chapters: [],
            selectedSubject: null,
            selectedChapter: null,
            quiz: null
        }
    },
    computed: {
        is_quiz_go_button_clicked() {
            return this.$store.state.globalCssData.is_clicked
        }
    },
    created() {
        this.get_Quiz_With_Chapter_Name()
        this.getSubjectIdName()
    },
    methods: {
        async get_Quiz_of_Chapter() {
            if (this.selectedSubject && this.selectedChapter) {
                this.quizzes = this.all_quizzes.filter(qu => qu.chapter_id === this.selectedChapter)
            }
        },
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
        async get_Quiz_With_Chapter_Name() {
            const response = await fetch(
                location.origin + '/api/get-all-quizzes-with-chapter-name',
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
                console.log(data)
                this.all_quizzes = data
                this.quizzes = this.all_quizzes
                console.log(this.quizzes)
                this.selectedChapter = null
                this.chapters = []
                this.selectedSubject = null
            }
            else {
                alert('Error getting data')
            }

        },
        getChapters() {
            this.getChapterIdName()
        },
        go_for_quiz(quiz) {
            this.quiz = quiz
            this.$store.commit('set_it', { flag: true })
        },
        go_back() {
            this.$store.commit('set_it', { flag: false })
            /*this.quiz = null*/
        },
        go_give_quiz() {
            this.$store.commit('set_it', { flag: false })
            let id = this.quiz.id
            this.quiz = null
            this.$router.push({
                path: '/live-quiz',
                query: { user_id: this.$store.state.loginData.user_id, quiz_id: id }
            })
        }
    }
}

export default studentHome;