let app = new Vue({
    el: '#app',
    data: {
        loaderEnabled: true,
        bar: null,
        modalValue: null,
        modalMode: null,
        completedTasks: null,
        notificationModalMode: 'welcome',
        editModeParams: {
          index: null,
          stage: null
        },
        lang: {
            en: {
                siteTitle: "Vue Todo",
                backlog: "Backlog",
                progress: "Progress",
                completed: "Completed",
                createTask: "Create new task",
                editTask: "Edit task",
                createTaskBtn: "Create",
                saveTaskBtn: "Save",
                createTaskInputPlaceholder: "Task name",
                welcomeMessage: "Welcome!",
                congratsMessage: "Congratulations!"
            }
        },
        taskMessage: {
            moveTo: function(rowName){ return "Move to the \"" + rowName + "\" section" }
        },
        tasks: [],

        saveLocally: function(){
            localStorage.tasks = JSON.stringify(this.tasks)
        },
        addTask: function(){
            this.tasks.push({title:this.modalValue, stage:'backlog'})
            this.modalValue = null
        },
        deleteTask: function(index){
            this.tasks.splice(index, 1);
        },
        editTask: function(){
            this.tasks.splice(this.editModeParams.index, 1, {title: this.modalValue, stage: this.editModeParams.stage});
            this.modalValue = null
            this.editModeParams.stage = null
            this.editModeParams.index = null
        },
        setTaskStage: function(task, stage){
            task.stage = stage
        },
        toggleTaskModal: function(mode){
            MicroModal.show('task-modal')
            this.modalMode = mode
        },
        setProgressBarTitle: function(allTasksCount, completedTasksCount){
            return completedTasksCount+' of '+allTasksCount+' tasks completed'
        }
    },
    mounted: function(){
        setTimeout(() => this.loaderEnabled = false, 1000)

        let bar = new ProgressBar.Line('.progress-bar', {
            strokeWidth: 1,
            easing: 'easeInOut',
            duration: 1000,
            color: 'lightgreen',
            trailColor: 'rgba(219,219,219,0.38)',
            trailWidth: 1,
            svgStyle: {width: '100%', height: '100px'},
            text: {
                style: {
                    // Text color.
                    // Default: same as stroke color (options.color)
                    color: '#dbdbdb',
                    position: 'absolute',
                    right: '0',
                    top: '30px',
                    padding: 0,
                    margin: 0,
                    transform: null
                },
                autoStyleContainer: false
            },
            from: {color: '#FFEA82'},
            to: {color: '#ED6A5A'},
        })

        this.bar = bar

        if(localStorage.tasks) {
            this.tasks = JSON.parse(localStorage.tasks)
        }else{
            MicroModal.show('notification-modal')
        }

    },
    updated: function(){

        this.saveLocally()
        let completedTasksCount = 0
        if(this.tasks) {
            this.tasks.forEach((task) => {
                if (task.stage === 'completed') {
                    completedTasksCount++
                }
            })

            if(completedTasksCount/this.tasks.length === 1){
                this.notificationModalMode = 'congrats'
                MicroModal.show('notification-modal')
            }

            this.completedTasks = completedTasksCount

            if (completedTasksCount !== 0) {
                this.bar.animate(completedTasksCount / this.tasks.length)
            } else {
                this.bar.animate(0)
            }
        }
        this.setProgressBarTitle(this.tasks.length, completedTasksCount)
    },
    components: {
        loader: loader
    }
})






