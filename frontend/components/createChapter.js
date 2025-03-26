const cChap = {
    template: `
        <div class="pt-5 h-100 w-100">
        
            <div class="text-center fw-bold fs-4 description-heading m-2">{{ subject_name }}</div>
            <div class="text-center p-4" v-if="total_chapter == 0">No Chapter</div>
            <div  class="table-responsive h-75 w-100" v-else>

                <table class="table table-striped align-middle overflow-auto">
                    
                    <thead class="table-primary">
                        <tr>
                            <th>#</th>
                            <th>Chapter</th>
                            <th>Description</th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(chapter,index) in chapters" class="p-1  subject">
                            <td class="text-wrap">{{ index + 1 }}</td>
                            <td class="text-wrap">{{ chapter.name }}</td>
                            <td class="text-wrap">{{ chapter.description }}</td>
                            <td class="text-wrap"><i class="bi bi-pencil-square text-warning" @click="setChapter(chapter.id,chapter.name,chapter.description,index)"></i></td>
                            <td class="text-wrap"><i class="bi bi-journal-plus text-success" @click="go_to_quiz_page(chapter.id)"></i></td>
                            <td class="text-wrap"><i class="bi bi-trash3 text-danger" @click="deleteChap(chapter.id)"></i></td>
                        </tr>
                    </tbody>
                </table>

            </div>
        
            <div v-if="!is_clicked">
                <button class="button" @click="addChapter"><i class="bi bi-plus-circle fs-5"></i>New Chapter</button>
            </div>
            <div  v-else>
                <h3>Create a new Chapter</h3><br>
                <form v-on:submit.prevent="createChapter">
                    <input type="text" placeholder="chapter name" v-model="chapter_name"  class="form-control"><br>
                    <textarea rows="4" cols="50" placeholder="Enter about Chapter" v-model="description" class="form-control"></textarea><br>

                    <div class="d-flex justify-content-between">
                        <button type="submit" class="button">Create</button>
                        <span class="fs-3" @click="cancelCreate"><i class="bi bi-x-lg"></i></span>
                    </div>
                </form>
            </div>
            <div v-if="is_edit" class="w-50 z-1 top-5 end-5 position-relative">
                <h3>Update chapter description</h3>
                <p><span class="text-primary fw-bold">Subject</span> : {{ chapter_name }}</p>
                <form v-on:submit.prevent="editChapter">
                    <textarea rows="4" cols="50" v-model="description" class="form-control"></textarea><br>
                    <div class="d-flex justify-content-between">
                        <button type="submit" class="button">update</button>
                        <span class="fs-5" @click="cancelEdit"><i class="bi bi-x-lg"></i></span>
                    </div>
                </form>
            </div>
                
                
        </div>
        `
    ,
    data() {
        return {
            subject_id: null,
            subject_name: null,
            chapters: [],
            is_clicked: false,
            chapter_id: null,
            chapter_name: null,
            description: null,
            is_edit: false,
            at_index: null
        }
    },
    created() {
        this.subject_id = parseInt(this.$route.query.subject_id)
        console.log(this.subject_id)
        this.fetchChapters()
    },
    computed: {
        total_chapter() {
            return this.chapters.length
        }
    },
    methods: {
        async fetchChapters() {

            const response = await fetch(
                location.origin + '/api/all-chapter',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': this.$store.state.loginData.auth_token
                    },
                    body: JSON.stringify({
                        "subject_id": this.subject_id
                    })
                }
            )
            const all_chapters = await response.json()
            if (response.ok) {
                this.subject_name = all_chapters.subject_name;
                this.chapters = all_chapters.chapters;
                console.log(all_chapters.chapters)
            }
            else {
                alert('Error fetching chapters')
            }
        },


        async createChapter() {
            if (this.chapter_name && this.description) {
                const response = await fetch(
                    location.origin + '/api/create-chapter',
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": this.$store.state.loginData.auth_token
                        },
                        body: JSON.stringify({
                            "subject_id": this.subject_id,
                            "chapter_name": this.chapter_name,
                            "description": this.description
                        })
                    }
                )
                const data = await response.json()
                if (response.ok) {
                    this.chapters.push({
                        id: data.chapter_id,
                        name: this.chapter_name,
                        description: this.description
                    })
                    alert("Chapter created successfully")
                    this.cancelCreate()
                }
                else {
                    alert("Subject not found")
                }
            }
            else {
                alert("Please provide valid details")
            }
        },
        async deleteChap(id) {
            let userResponse = confirm("You are going to delete this chapter.Do you want to continue?")
            if (userResponse) {
                const response = await fetch(
                    location.origin + '/api/chapter/delete',
                    {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': this.$store.state.loginData.auth_token
                        },
                        body: JSON.stringify({
                            "chapter_id": id
                        })
                    }
                )
                const data = await response.json()
                if (response.ok) {
                    let index = this.chapters.findIndex(chapter => chapter.id === id)
                    this.chapters.splice(index, 1)
                    alert(data.MESSAGE);
                }
                else {
                    alert(data.MESSAGE);
                }
            }

        },
        async editChapter() {
            const response = await fetch(
                location.origin + '/api/chapter/edit',
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': this.$store.state.loginData.auth_token
                    },
                    body: JSON.stringify({
                        "id": this.chapter_id,
                        "description": this.description
                    })
                }
            )
            const data = await response.json()
            if (response.ok) {
                this.$set(this.chapters, this.at_index, { ...this.chapters[this.at_index], description: this.description })
                this.cancelEdit()
                alert(data.MESSAGE);
            }
            else {
                alert(data.MESSAGE);
            }
        },
        setChapter(id, name, description, index) {
            this.is_edit = true
            this.chapter_id = id
            this.chapter_name = name
            this.description = description
            this.at_index = index
        },
        addChapter() {
            this.is_clicked = true
        },
        cancelCreate() {
            this.is_clicked = false
            this.chapter_name = null
            this.description = null
        },
        cancelEdit() {
            this.chapter_name = null
            this.description = null
            this.is_edit = false
            this.chapter_id = null
            this.at_index = null
        },
        go_to_quiz_page(id) {
            this.$router.push({ path: '/admin_dashboard/create/quiz', query: { chapter_id: id } })

        },
    }
}

export default cChap