const createSubject = {
    template: `
        <div class="mt-2 h-75">
            <div class="container-fluid h-100" v-bind:class="{'blurr-back': is_clicked_edit_icon}">
                <div class="row h-100">
                    <div class="col-sm-9 border p-3 h-100 overflow-auto">
                        <div v-if="total_subject == 0">No Subject</div>
                        <div  class="table-responsive" v-else>
                            
                            <table class="table table-striped align-middle overflow-auto">
                                <caption class="caption-top text-center fw-bold fs-4 description-heading">Subjects Created</caption>
                                <thead class="table-primary">
                                    <tr>
                                        <th>#</th>
                                        <th>Subject</th>
                                        <th>Description</th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>    
                                    <tr v-for="(subject,index) in subjects" class="p-1  subject">
                                        <td class="text-wrap">{{ index + 1 }}</td>
                                        <td class="text-wrap">{{ subject.name }}</td>
                                        <td class="text-wrap">{{ subject.description }}</td>
                                        <td class="text-wrap"><i class="bi bi-pencil-square text-warning" @click="setId(subject.id, subject.name, subject.description,index)"></i></td>
                                        <td class="text-wrap"><i class="bi bi-book-half text-success" @click="go_to_chapter_page(subject.id)"></i></td>
                                        <td class="text-wrap"><i class="bi bi-trash3 text-danger" @click="deleteSub(subject.id)"></i></td>
                                    </tr>
                                </tbody>
                            </table>
                        
                        </div>
                    </div>
                    <div class="col-sm-3 border h-100 p-2 pt-3">
                        <button v-if="!is_clicked" class="button" v-on:click="add_subject"><i class="bi bi-plus-circle fs-5"></i>Add New Subject</button>
                        <div v-if="is_clicked" class="mt-4">
                            <h3>Create a new Subject</h3><br>
                            <form v-on:submit.prevent="createSubject">
                                <input type="text" placeholder="subject_name" v-model="subject_name"  class="form-control"><br>
                                <textarea rows="4" cols="50" placeholder="Enter about subject" v-model="description" class="form-control"></textarea><br>

                                <div class="d-flex justify-content-between">
                                    <button type="submit" class="button">Create</button>
                                    <span class="fs-3" @click="cancelCreate"><i class="bi bi-x-lg"></i></span>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="is_clicked_edit_icon" class="m-5 w-25 z-1 top-0 end-0 position-absolute blurr-contain border">
                <h3>Update subject description</h3>
                <p><span class="text-primary fw-bold">Subject</span> : {{ subject_name }}</p>
                <form v-on:submit.prevent="editSub(id_to_edit)">
                    <textarea rows="4" cols="50" placeholder="Enter about subject" v-model="description" class="form-control"></textarea><br>
                    <div class="d-flex justify-content-between">
                        <button type="submit" class="button">update</button>
                        <span class="fs-5" @click="cancelEdit"><i class="bi bi-x-lg"></i></span>
                    </div>
                </form>
            </div>
        </div>
    `,
    data() {
        return {
            subject_name: null,
            description: null,
            subjects: [],
            at_index: null,
            is_clicked: false,
            id_to_edit: null,
            is_clicked_edit_icon: false
        }
    },
    computed: {
        total_subject() {
            return this.subjects.length;
        }
    },
    created() {
        this.fetchSubjects()
    },
    methods: {
        async createSubject() {
            if (this.subject_name && this.description) {
                const response = await fetch(
                    location.origin + '/api/create-subject',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': this.$store.state.loginData.auth_token
                        },
                        body: JSON.stringify({
                            "subject_name": this.subject_name,
                            "description": this.description
                        })
                    }
                )
                const data = await response.json()
                if (response.ok) {
                    this.subjects.push({
                        id: data.subject_id,
                        name: this.subject_name,
                        description: this.description
                    })
                }
                else {
                    alert("ERROR! subject can not be added")
                }
            }
            else {
                alert("Please provide subject and description")
            }
            this.subject_name = null
            this.description = null
            this.is_clicked = false


        },
        async fetchSubjects() {
            const response = await fetch(
                location.origin + '/api/all-subject',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': this.$store.state.loginData.auth_token
                    }
                }
            )
            const all_subjects = await response.json()
            if (response.ok) {
                this.subjects = all_subjects;
                console.log(this.subjects)
            }
            else {
                alert('Error fetching subjects')
            }

        },
        async editSub(id) {
            const response = await fetch(
                location.origin + '/api/subject/edit',
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': this.$store.state.loginData.auth_token
                    },
                    body: JSON.stringify({
                        "id": id,
                        "new_description": this.description
                    })
                }
            )
            const data = await response.json()
            if (response.ok) {
                this.$set(this.subjects, this.at_index, { ...this.subjects[this.at_index], description: this.description })
                this.cancelEdit()
                this.is_clicked_edit_icon = false
                alert(data.MESSAGE);
            }
            else {
                alert(data.MESSAGE);
            }
        },
        async deleteSub(id) {
            let userResponse = confirm("You are going to delete this subject.Do you want to continue?")
            if (userResponse) {
                const response = await fetch(
                    location.origin + '/api/subject/delete',
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
                    let index = this.subjects.findIndex(subject => subject.id === id)
                    this.subjects.splice(index, 1)
                    alert(data.MESSAGE);
                }
                else {
                    alert(data.MESSAGE);
                }
            }

        },
        add_subject() {
            this.is_clicked = true
        },
        setId(id, name, description, index) {
            this.at_index = index
            this.subject_name = name
            this.description = description
            this.id_to_edit = id
            this.is_clicked_edit_icon = true
        },
        cancelEdit() {
            this.at_index = null
            this.subject_name = null
            this.description = null
            this.id_to_edit = null
            this.is_clicked_edit_icon = false
        },
        cancelCreate() {
            this.subject_name = null
            this.description = null
            this.is_clicked = false
        },
        go_to_chapter_page(id) {
            this.$router.push({ path: '/admin_dashboard/create/chapter', query: { subject_id: id } })

        },
    },

}


export default createSubject;