const adminSummary = {
    template: `
        <div class="p-5 h-100 container-fluid overflow-auto">
            
            <div class="row">
                <div class="col-sm-4 border">
                    <p>count of all </p>
                    <hr>
                    <canvas id="allSummary"></canvas>
                </div>
                <div class="col-sm-4 border">
                    <p>Subject wise total chapter count</p>
                    <hr>
                    <canvas id="subSummary"></canvas>
                </div>
                <div class="col-sm-4 border">
                    <p>Quiz per chapter</p>
                    <label>Subject - </label>
                    <select v-model="selectedSub" @change="showGraph">
                        <option v-for="sub in all_subjects" :value="sub">{{ sub }}</option>
                    </select>
                    <hr>
                    <canvas id="chapSummary"></canvas>
                </div>
                <div class="col-sm-4">
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            chart3: null,
            chart1: null,
            chart2: null,
            all_count: null,
            all_subjects: [],
            chapter_list: [],
            quiz_count: [],
            selectedSub: null
        }
    },
    mounted() {
        this.getUserSummary()

    },
    methods: {
        async showGraph() {
            const res = await fetch(
                location.origin + '/api/chapter-wise-question-count',
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': this.$store.state.loginData.auth_token
                    },
                    body: JSON.stringify({
                        "subject_name": this.selectedSub
                    })
                }
            )
            const data = await res.json()
            if (res.ok) {
                if (this.chart3) {
                    this.chart3.destroy()

                }
                this.chapter_list = data.chapter_list
                this.quiz_count = data.quiz_count
                const sectionColors = [
                    "rgba(255, 99, 132, 0.9)",
                    "rgba(10, 28, 194, 0.9)",
                    "rgba(255, 206, 86, 0.9)",
                    "rgba(75, 192, 192, 0.9)",
                    "rgba(153, 102, 255, 0.9)",
                    "rgba(255, 159, 64, 0.9)",
                    "rgba(150, 255, 64, 0.9)",
                    "rgba(195, 64, 255, 0.9)",
                ];
                const chapSummary = document.getElementById('chapSummary').getContext('2d')
                this.chart3 = new Chart(chapSummary, {
                    type: 'doughnut',
                    data: {
                        labels: this.chapter_list,
                        datasets: [{
                            data: this.quiz_count,
                            borderWidth: 0.5,
                            backgroundColor: sectionColors.slice(0, data.chapter_list.length)
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        },
                        responsive: true
                    }
                })
            }
            else {
                alert("ERROR")
            }

        },
        async getUserSummary() {
            const res = await fetch(
                location.origin + '/api/all-count',
                {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': this.$store.state.loginData.auth_token
                    }
                }
            )
            const data = await res.json()
            if (res.ok) {
                this.selectedSub = data.subject_list[0]
                await this.showGraph()
                this.all_count = data.all_stat
                this.all_subjects = data.subject_list
                const allSummary = document.getElementById('allSummary').getContext('2d')
                this.chart1 = new Chart(allSummary, {
                    type: 'bar',
                    data: {
                        labels: ['users', 'quiz', 'chapter', 'subject', 'question'],
                        datasets: [{
                            label: 'count of all',
                            data: this.all_count,
                            borderWidth: 0.5,
                            backgroundColor: 'rgba(245, 54, 96, 1)'
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        },
                        responsive: true
                    }
                })
                const sectionColors = [
                    "rgba(255, 99, 132, 0.9)",
                    "rgba(10, 28, 194, 0.9)",
                    "rgba(255, 206, 86, 0.9)",
                    "rgba(75, 192, 192, 0.9)",
                    "rgba(153, 102, 255, 0.9)",
                    "rgba(255, 159, 64, 0.9)",
                    "rgba(150, 255, 64, 0.9)",
                    "rgba(195, 64, 255, 0.9)",
                ];
                const subSummary = document.getElementById('subSummary').getContext('2d')
                this.chart2 = new Chart(subSummary, {
                    type: 'doughnut',
                    data: {
                        labels: data.subject_list,
                        datasets: [{
                            data: data.chapter_count,
                            borderWidth: 0.5,
                            backgroundColor: sectionColors.slice(0, data.subject_list.length)
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        },
                        responsive: true
                    }
                })
            }
            else {
                alert("ERROR")
            }

        }
    }

}


export default adminSummary;