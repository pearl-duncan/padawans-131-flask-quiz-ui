const API_URL = "#";

const init = () => {
    console.log("init");

    const registerForm = document.getElementById("register-form");
    const handleRegister = async (event) => {
        event.preventDefault();
        const first_nameElement = event.target.querySelector("#first_name");
        const first_name = first_nameElement.value;
        
        const last_nameElement = event.target.querySelector("#last_name");
        const last_name = last_nameElement.value;

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
                first_name: first_name,
                last_name: last_name,
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

    const createPost = (post) => {
        return `<div class="card" style="width: 18rem;">
            <div class="card-body">
                <h5 class="card-title">${post.title}</h5>
                <h6 class="card-subtitle mb-2 text-body-secondary">${post.created_by}</h6>
                <p class="card-text">${post.caption}</p>
                ${
                    localStorage.getItem("username") === post.created_by
                        ? `<button class="btn btn-warning" id="edit-post" data-id=${post.id}>Edit</button>`
                        : ""
                }
            </div>
        </div>
        `;
    };

    const handleGetAllPosts = async (e) => {
        e.preventDefault();

        const res = await fetch(`${API_URL}/post/all`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const data = await res.json();

        let cardsHTML;
        data.posts.forEach((post) => {
            cardsHTML += createPost(post);
        });
        const postDisplay = document.getElementById("post-display");
        if (postDisplay) {
            postDisplay.innerHTML = cardsHTML;
        }

        const editButtons = document.querySelectorAll("button[data-id]");

        editButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const card = btn.closest(".card");
                const titleElement = card.querySelector(".card-title");
                const captionElement = card.querySelector(".card-text");

                const titleInput = document.createElement("input");
                titleInput.type = "text";
                titleInput.value = titleElement.innerText;

                const captionInput = document.createElement("input");
                captionInput.type = "text";
                captionInput.value = captionElement.innerText;

                console.log(titleInput, captionInput);

                titleElement.replaceWith(titleInput);
                captionElement.replaceWith(captionInput);

                const postId = btn.getAttribute("data-id");

                const saveBtn = document.createElement("button");
                saveBtn.innerText = "Save";
                saveBtn.classList.add("btn", "btn-success");
                saveBtn.addEventListener("click", async () => {
                    const res = await fetch(`${API_URL}/post/update/post/${postId}`, {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            title: titleInput.value,
                            caption: captionInput.value,
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
    const getPostsButton = document.getElementById("get-posts");
    if (getPostsButton) {
        getPostsButton.addEventListener("click", handleGetAllPosts);
    }

    const createPostForm = document.getElementById("create-post-form");
    const handleCreatePost = async (e) => {
        e.preventDefault();

        const titleElement = createPostForm.querySelector("#title");
        const title = titleElement.value;

        const captionElement = createPostForm.querySelector("#caption");
        const caption = captionElement.value;

        const token = `Bearer ${localStorage.getItem("token")}`;
        console.log(token);

        try {
            const res = await fetch(`${API_URL}/post/new`, {
                method: "POST",
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: title,
                    caption: caption,
                }),
            });
            console.log(res);

            const data = await res.json();

            console.log(data);
        } catch (err) {
            console.log(err);
        }
    };
    if (createPostForm) {
        createPostForm.addEventListener("submit", handleCreatePost);
    }
};

document.addEventListener("DOMContentLoaded", init);
