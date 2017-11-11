var TODO_MODULE = (function () {
    var newId = setCurrentId();
    var container;
    var ul;
    var button;
    var Tasks = [];
    var form;
    var taskName;
    var deadline;
    var init = function (node) {
        container = node;
        button = container.querySelector(".add-task-button");
        ul = document.createElement("ul");
        ul.className = "list-of-tasks";
        form = document.forms[0];
        container.appendChild(ul);
        button.onclick = function () {
            taskName = form.elements.task_name;
            deadline = form.elements.deadline;
            addTask(createNewTask(taskName.value, deadline.value), Tasks);
            render(Tasks);
            taskName.value = "";
            deadline.value = "";
        }
    };

    function Task(taskName) {
        var id = newId();
        var done = false;
        var name = taskName;
        var deadline;

        this.__defineGetter__("id", function () {
            return id;
        });
        this.isDone = function () {
            return done;
        };
        this.makeDone = function () {
            done = true;
        };
        this.makeUndone = function () {
            done = false;
        };
        this.__defineSetter__("name", function (taskName) {
            name = taskName;
        });
        this.__defineGetter__("name", function () {
            return name;
        });
        this.__defineSetter__("deadline", function (date) {
            deadline = new Date(date);
            if (!dateToString(deadline))
                deadline = null;
        });
        this.__defineGetter__("deadline", function () {
            return deadline;
        });
        this.toString = function () {
            var str = name;
            if (deadline)
                str += (" due: " + dateToString(deadline));
            return str;
        }
    }

    var dateToString = function (date) {
        var dd = date.getDate();
        var mm = date.getMonth() + 1;
        var yyyy = date.getFullYear();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        if (dd < 10)
            dd = '0' + dd;
        if (mm < 10)
            mm = '0' + mm;
        if (hours < 10)
            hours = '0' + hours;
        if (minutes < 10)
            minutes = '0' + minutes;
        if (isNaN(dd) || isNaN(mm) || isNaN(yyyy) || isNaN(hours) || isNaN(minutes))
            return false;
        return dd + '/' + mm + '/' + yyyy + '  ' + hours + ':' + minutes;

    };

    function setCurrentId() {
        var currentId = 0;
        return function () {
            return currentId++;
        }
    }

    var createNewTask = function (taskName, deadline) {
        if (!taskName)
            taskName = "Unnamed task";
        var newTask = new Task(taskName);
        if (deadline)
            newTask.deadline = deadline;
        return newTask;
    };

    var addTask = function (task, taskArray) {
        if (task instanceof Task)
            taskArray.push(task);
    };

    var deleteTask = function (task, taskArray) {
        var id = taskArray.indexOf(task);
        taskArray.splice(id, 1);
    };

    var render = function (tasks) {
        removeAllListElements();
        for (let i = 0; i < tasks.length; i++) {
            renderTaskComponent(tasks[i], tasks);
        }
    };

    var removeAllListElements = function () {
        var liList = ul.querySelectorAll("li");
        for (let i = 0; i < liList.length; i++) {
            ul.removeChild(liList[i]);
        }
    };

    var renderTaskComponent = function (task, taskArray) {
        var label = createLabelElement(task);
        var li = document.createElement("li");
        var button = createDeleteButton(task, taskArray);
        li.className = "task";
        li.appendChild(label);
        li.appendChild(button);
        ul.appendChild(li);
    };

    var createDeleteButton = function (task, taskArray) {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "delete-task-button";
        button.onclick = function () {
            deleteTask(task, taskArray);
            render(taskArray);
        };
        return button;
    };

    var createLabelElement = function (task) {
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "is_task_done";
        var label = document.createElement("label");
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(task));

        checkbox.onchange = function () {
            if (this.checked) {
                label.className = "doneTask";
                task.makeDone();
            } else {
                label.className = "";
                task.makeUndone();
            }
        };
        return label;
    };

    return {
        init: init
    }
}());