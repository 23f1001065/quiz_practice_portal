const adminSearch = {
    template: `
        <div class="h-100">
            <div class="ms-3 p-3">
                <h4 class="description-heading"><i class="bi bi-search icon-spacing"></i> Search</h4>
            </div>
            <hr>
            <div class="py-4 d-flex justify-content-end">
                <form>
                    <label>What to search - </label>
                    <select v-model="selectedOption" @change="activate_search_bar">
                        <option  value="subject">subject</option>
                        <option  value="user">user</option>
                        <option  value="quiz">quiz</option>
                    </select>
                    <label></label>
                    <input type="text" v-model="searchQuery" placeholder="search..."  :disabled="!is_search_active" style="width:10cm">
                    <button :disabled="!is_search_active" @click="search"><i class="bi bi-search icon-spacing"></i></button>
                </form>
            </div>
            <hr>
            <div>
                <div class="d-flex justify-content-center" v-if="total_records === 0 && search_clicked">
                    <P class="text-secondary">No result found</p>
                </div>
                <ul v-if="search_clicked">
                    <li v-for="result in results" v-if="selectedOption === 'subject'" class="d-flex justify-content-between">
                        <p><span class="text-success fw-bold">ID : </span>{{ result.id }}</p>
                        <p><span class="text-success fw-bold">NAME :</span>{{ result.name }}</p>
                    </li>
                    <li v-for="result in results" v-if="selectedOption === 'user'" class="d-flex justify-content-between">
                        <p><span class="text-success fw-bold">ID : </span>{{ result.id }}</p>
                        <p><span class="text-success fw-bold">First Name :  </span>{{ result.first_name }}</p>
                        <p><span class="text-success fw-bold">Mid Name : </span>{{ result.mid_name }}</p>
                        <p><span class="text-success fw-bold">Last Name : </span>{{ result.last_name }}</p> 
                    </li>
                    <li v-for="result in results" v-if="selectedOption === 'quiz'" class="d-flex justify-content-between">
                        <p><span class="text-success fw-bold">ID : </span>{{ result.id }}</p>
                        <p><span class="text-success fw-bold">Title :  </span>{{ result.title }}</p>
                        <p><span class="text-success fw-bold">Date : </span>{{ result.date_of_quiz }}</p>
                        <p><span class="text-success fw-bold">Time : </span>{{ result.time }}</p>
                        <p><span class="text-success fw-bold">Duration : </span>{{ result.duration }}</p>
                        <p><span class="text-success fw-bold">Chapter : </span>{{ result.chapter_name }}</p>
                    </li>
                </ul>
            </div>

        </div>
    `,
    data() {
        return {
            selectedOption: null,
            is_search_active: false,
            search_clicked: false,
            searchQuery: "",
            results: []
        }
    },
    computed: {
        total_records() {
            return this.results.length
        }
    },
    methods: {
        activate_search_bar() {
            this.is_search_active = true
            this.search_clicked = false
            this.results = []
        },
        async search() {
            const response = await fetch(
                location.origin + '/api/search-resource',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': this.$store.state.loginData.auth_token
                    },
                    body: JSON.stringify({
                        "to_search": this.selectedOption,
                        "search_value": this.searchQuery.trim()
                    })
                }
            )
            const data = await response.json()
            if (response.ok) {
                this.results = data
                this.search_clicked = true
            }
            else {
                alert("not found")
            }
        }
    }
}


export default adminSearch;