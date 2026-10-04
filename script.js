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
    let tasksList = JSON.parse(localStorage.getItem("tasks"));
    tasksList = orderTaskList(tasksList);
    const tasksListElement = document.querySelector("#tasks-list");
    
    // precisa esvaziar antes de preencher, por que se não sempre que excluir um elemento ele não vai limpar a tela, e vai manter os elementos que já estavam lá
    tasksListElement.innerHTML = ""; 

    tasksList.forEach((task, index) => {
        const taskItem = document.createElement("div");
        taskItem.classList.add(
            "task-list-items",
            task.status == "Concluído" ? "completed" : null,
        );

        const title = document.createElement("p");
        title.classList.add(
            "task-title",
            task.status == "Concluído" ? "completed" : null,
        );
        title.textContent = task.title;

        const dueDate = document.createElement("p");

        // O  + "T00:00:00" é necessário para o objeto Date saber que a data está usando o horário local da máquina do usuário.
        console.log(new Date(task.dueDate  + "T00:00:00"), new Date())
        const today = new Date();
        today.setHours(0); 
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);

        task.status = new Date(task.dueDate  + "T00:00:00") < today && task.status !== "Concluído" ? "Atrasado" : task.status;
        dueDate.classList.add(
            "task-due-date",
            task.status === "Concluído"
                ? "completed" : task.status === "Atrasado"
                    ? "overdue" : null,
        );
        const dueDateBrazilianFormat = convertDateToBrazilianFormat(task.dueDate);
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

        const buttonsContainer = document.createElement("div");
        buttonsContainer.className = "task-buttons-container";
        buttonsContainer.append(
            task.status !== "Concluído" 
                ? completeButton : "",
            deleteButton,
        )

        const buttonsAndDueDateContainer = document.createElement("div");
        buttonsAndDueDateContainer.className = "task-buttons-and-due-date-container";
        buttonsAndDueDateContainer.append(
            dueDate,
            buttonsContainer,
        )

        taskItem.append(
            title,
            buttonsAndDueDateContainer,
        )

        tasksListElement.appendChild(taskItem);
    });
}

function deleteTask(index) {
    let tasksList = JSON.parse(localStorage.getItem("tasks")) ?? [];
    tasksList = orderTaskList(tasksList);
    tasksList.splice(index, 1);

    localStorage.setItem("tasks", JSON.stringify(tasksList));

    listTasks();
}

function completeTask(index) {
    let tasksList = JSON.parse(localStorage.getItem("tasks")) ?? [];
    tasksList = orderTaskList(tasksList);
    tasksList[index].status = "Concluído";

    localStorage.setItem("tasks", JSON.stringify(tasksList));

    listTasks();
}

function orderTaskList(tasksList) {
    const statusOrder = {
        "Pendente": 1,
        "Concluído": 2,
    };
    
    tasksList.sort((a, b) => {
        return statusOrder[a.status] - statusOrder[b.status];
    });

    return tasksList;
}

function convertDateToBrazilianFormat(date) {
    const dateObj = new Date(date + "T00:00:00");

    const day = String(dateObj.getDate());
    const month = String(dateObj.getMonth() + 1);
    const year = String(dateObj.getFullYear());
    const formatedDate = `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;

    return formatedDate;
}
