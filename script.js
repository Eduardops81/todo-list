const form = document.querySelector(".create-task-container");

form.addEventListener("submit", createTask);

listTasks();

function createTask() {
    let tasksList = JSON.parse(localStorage.getItem("tasks")) ?? [];

    const formData = new FormData(form);

    const task = {
        title: formData.get("title"),
        dueDate: formData.get("due-date"),
        status: "Pendente",
    }

    tasksList.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasksList));
}

function listTasks() {
    const tasksList = JSON.parse(localStorage.getItem("tasks"));
    const tasksListElement = document.querySelector("#tasks-list");
    tasksListElement.innerHTML = ""; // precisa esvaziar antes de preencher, por que se não sempre que excluir um elemento, 

    tasksList.forEach((task, index) => {
        const taskItem = document.createElement("div");
        taskItem.className = "task-list-items";

        const title = document.createElement("h3");
        title.className = "task-title";
        title.textContent = task.title;

        const dueDate = document.createElement("p");
        dueDate.className = "task-due-date";
        dueDate.textContent = task.dueDate;

        const status = document.createElement("p");
        status.className = "task-status";
        status.textContent = task.status;

        const completeButton = document.createElement("button");
        completeButton.textContent = "Concluir";
        completeButton.onclick = () => completeTask(index);
        
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Remover";
        deleteButton.onclick = () => deleteTask(index);

        taskItem.append(
            title,
            dueDate,
            status,
            task.status !== "Concluído" ? completeButton : "",
            deleteButton,
        )

        tasksListElement.appendChild(taskItem);
    });
}

function deleteTask(index) {
    let tasksList = JSON.parse(localStorage.getItem("tasks")) ?? [];
    tasksList.splice(index, 1);

    localStorage.setItem("tasks", JSON.stringify(tasksList));

    listTasks();
}

function completeTask(index) {
    let tasksList = JSON.parse(localStorage.getItem("tasks")) ?? [];
    tasksList[index].status = "Concluído";

    localStorage.setItem("tasks", JSON.stringify(tasksList));

    listTasks();
}