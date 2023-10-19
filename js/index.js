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

        localStorage.setItem("token", data.token);
    };
    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }

    const handleGetAllQuizzes = async (e) => {
        e.preventDefault();

        const res = await fetch(`${API_URL}/quiz/all`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const data = await res.json();

        console.log(data);
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
                    "Content-Type": "application/json"
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
