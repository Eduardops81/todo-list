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
    
    // precisa esvaziar antes de preencher, por que se não sempre que excluir um elemento ele não vai limpar a tela, e vai manter os elementos que já estavam lá
    tasksListElement.innerHTML = ""; 

    tasksList.forEach((task, index) => {
        const taskItem = document.createElement("div");
        taskItem.className = "task-list-items";

        const title = document.createElement("p");
        title.className = "task-title";
        title.textContent = task.title;

        const dueDate = document.createElement("p");
        const dueDateBrazilianFormat = convertDateToBrazilianFormat(task.dueDate);
        dueDate.className = "task-due-date";
        dueDate.textContent = dueDateBrazilianFormat;

        const status = document.createElement("p");
        status.classList.add("task-status");
        if (task.status === "Concluído") status.classList.add("completed");
        status.textContent = task.status;

        const completeButton = document.createElement("button");
        completeButton.className = "task-complete-button";
        completeButton.textContent = "Concluir";
        completeButton.onclick = () => completeTask(index);
        
        const deleteButton = document.createElement("button");
        deleteButton.className = "task-delete-button";
        deleteButton.textContent = "Remover";
        deleteButton.onclick = () => deleteTask(index);

        const firstLine = document.createElement("div");
        firstLine.className = "task-first-line"
        firstLine.append(
            title,
            dueDate,
        );

        const secondLineSecondColumn = document.createElement("div");
        secondLineSecondColumn.className = "task-second-line-second-column";
        secondLineSecondColumn.append(
            task.status !== "Concluído" ? completeButton : "",
            deleteButton,
        );

        const secondLine = document.createElement("div");
        secondLine.className = "task-second-line";
        secondLine.append(
            status,
            secondLineSecondColumn,
        );

        taskItem.append(
            firstLine,
            secondLine,
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

function convertDateToBrazilianFormat(date) {
    const dateObj = new Date(date);

    const day = String(dateObj.getDay());
    const month = String(dateObj.getMonth() + 1);
    const year = String(dateObj.getFullYear());
    const formatedDate = `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;

    return formatedDate;
}