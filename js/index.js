const API_URL = "https://padawans-131-flask-quiz-api.onrender.com";

const init = () => {
    console.log("init");

    const registerForm = document.getElementById("register-form");
    const handleRegister = async (event) => {
        event.preventDefault();
        const usernameElement = event.target.querySelector("#username");
        const username = usernameElement.value;

        const passwordElement = event.target.querySelector("#password");
        const password = passwordElement.value;

        const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });
        const data = await res.json();

        console.log(data);
    };
    if (registerForm) {
        registerForm.addEventListener("submit", handleRegister);
    }

    const loginForm = document.getElementById("login-form");
    const handleLogin = async (event) => {
        event.preventDefault();
        const usernameElement = event.target.querySelector("#username");
        const username = usernameElement.value;

        const passwordElement = event.target.querySelector("#password");
        const password = passwordElement.value;

        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                withCredentials: true,
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });

        const data = await res.json();

        console.log(data);

        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.user.username);
    };
    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }

    const createQuizCard = (quiz) => {
        return `<div class="card" style="width: 18rem;">
            <div class="card-body">
                <h5 class="card-title">${quiz.title}</h5>
                <h6 class="card-subtitle mb-2 text-body-secondary">${quiz.created_by}</h6>
                <p class="card-text">${quiz.description}</p>
                ${
                    localStorage.getItem("username") === quiz.created_by
                        ? `<button class="btn btn-warning" id="edit-quiz" data-id=${quiz.id}>Edit</button>`
                        : ""
                }
                <a href="#" class="card-link">Another link</a>
            </div>
        </div>
        `;
    };

    const handleGetAllQuizzes = async (e) => {
        e.preventDefault();

        const res = await fetch(`${API_URL}/quiz/all`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const data = await res.json();

        let cardsHTML;
        data.quizzes.forEach((quiz) => {
            cardsHTML += createQuizCard(quiz);
        });
        const quizDisplay = document.getElementById("quiz-display");
        if (quizDisplay) {
            quizDisplay.innerHTML = cardsHTML;
        }

        const editButtons = document.querySelectorAll("button[data-id]");

        editButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const card = btn.closest(".card");
                const titleElement = card.querySelector(".card-title");
                const descriptionElement = card.querySelector(".card-text");

                const titleInput = document.createElement("input");
                titleInput.type = "text";
                titleInput.value = titleElement.innerText;

                const descriptionInput = document.createElement("input");
                descriptionInput.type = "text";
                descriptionInput.value = descriptionElement.innerText;

                console.log(titleInput, descriptionInput);

                titleElement.replaceWith(titleInput);
                descriptionElement.replaceWith(descriptionInput);

                const quizId = btn.getAttribute("data-id");

                const saveBtn = document.createElement("button");
                saveBtn.innerText = "Save";
                saveBtn.classList.add("btn", "btn-success");
                saveBtn.addEventListener("click", async () => {
                    const res = await fetch(`${API_URL}/quiz/update/quiz/${quizId}`, {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            title: titleInput.value,
                            description: descriptionInput.value,
                        }),
                    });

                    if (res.ok) {
                        window.location.reload();
                    }
                });

                btn.insertAdjacentElement("afterend", saveBtn);
            });
        });
    };
    const getQuizzesButton = document.getElementById("get-quizzes");
    if (getQuizzesButton) {
        getQuizzesButton.addEventListener("click", handleGetAllQuizzes);
    }

    const createQuizForm = document.getElementById("create-quiz-form");
    const handleCreateQuiz = async (e) => {
        e.preventDefault();

        const titleElement = createQuizForm.querySelector("#title");
        const title = titleElement.value;

        const descriptionElement = createQuizForm.querySelector("#description");
        const description = descriptionElement.value;

        const token = `Bearer ${localStorage.getItem("token")}`;
        console.log(token);

        try {
            const res = await fetch(`${API_URL}/quiz/new`, {
                method: "POST",
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: title,
                    description: description,
                }),
            });
            console.log(res);

            const data = await res.json();

            console.log(data);
        } catch (err) {
            console.log(err);
        }
    };
    if (createQuizForm) {
        createQuizForm.addEventListener("submit", handleCreateQuiz);
    }
};

document.addEventListener("DOMContentLoaded", init);
