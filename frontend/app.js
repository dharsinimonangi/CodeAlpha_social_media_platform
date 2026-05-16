const API = "http://localhost:5000/api";


// ================= REGISTER =================

async function register() {

    const name = document.getElementById("name").value;

    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;

    const response = await fetch(`${API}/auth/register`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            name,
            email,
            password
        })
    });

    const data = await response.json();

    alert(data.message);

    window.location.href = "index.html";
}


// ================= LOGIN =================

async function login() {

    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;

    const response = await fetch(`${API}/auth/login`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email,
            password
        })
    });

    const data = await response.json();

    if (data.token) {

        localStorage.setItem("token", data.token);

        localStorage.setItem("userId", data.user._id);

        window.location.href = "home.html";

    } else {

        alert(data.message);
    }
}


// ================= LOGOUT =================

function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("userId");

    localStorage.removeItem("viewUserId");

    window.location.href = "index.html";
}
// ================= OPEN MY PROFILE =================

function openMyProfile(){

    localStorage.removeItem("viewUserId");

    window.location.href = "profile.html";
}

// ================= CREATE POST =================

async function createPost() {

    const text =
    document.getElementById("postText").value;

    const imageInput =
    document.getElementById("postImage");

    const file =
    imageInput.files[0];

    const token =
    localStorage.getItem("token");

    let image = "";

    // CONVERT IMAGE TO BASE64

    if(file){

        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = async function(){

            image = reader.result;

            await uploadPost(text,image,token);
        };

    }else{

        await uploadPost(text,image,token);
    }
}
async function uploadPost(text,image,token){

    if(!text && !image){

        alert("Write something or add image");

        return;
    }

    const response = await fetch(`${API}/posts`,{

        method:"POST",

        headers:{
            "Content-Type":"application/json",
            Authorization: token
        },

        body: JSON.stringify({
            text,
            image
        })
    });

    const data = await response.json();

    console.log(data);

    document.getElementById("postText").value = "";

    document.getElementById("postImage").value = "";

    loadPosts();
}

// ================= LOAD POSTS =================

async function loadPosts() {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API}/posts`, {

        headers: {
            Authorization: token
        }
    });

    const posts = await response.json();

    const postsContainer = document.getElementById("posts");

    if (!postsContainer) return;

    postsContainer.innerHTML = "";

    posts.forEach(post => {

        postsContainer.innerHTML += `

        <div class="card">

            <div class="post-header">

                <div class="default-small-pic">👤</div>

                <div
                    class="username"
                    onclick="openUserProfile('${post.user._id}')"
                    style="cursor:pointer;"
                >
                    ${post.user.name}
                </div>

            </div>

            <div class="post-text">
                ${post.text || ""}
            </div>

            ${
                post.image
                ?
                `<img src="${post.image}" class="post-img">`
                :
                ""
            }

            <div class="post-actions">

                <span onclick="likePost('${post._id}')">
                    ❤️ ${post.likes.length}
                </span>

                <span onclick="toggleComments('${post._id}')">
                    💬 ${post.comments.length}
                </span>

            </div>

            <input
                type="text"
                id="comment-${post._id}"
                placeholder="Write comment..."
            >

            <button onclick="commentPost('${post._id}')">
                Comment
            </button>

            <div
                class="comment-box"
                id="comments-${post._id}"
                style="display:none;"
            >

                ${
                    post.comments.map(comment => `

                        <div class="single-comment">

                            <strong>
                                ${comment.user?.name || "User"}
                            </strong>

                            <p>${comment.text}</p>

                        </div>

                    `).join("")
                }

            </div>

        </div>
        `;
    });
}


// ================= LIKE POST =================

async function likePost(id) {

    const token = localStorage.getItem("token");

    await fetch(`${API}/posts/like/${id}`, {

        method: "PUT",

        headers: {
            Authorization: token
        }
    });

    loadPosts();
}


// ================= COMMENT POST =================

async function commentPost(id) {

    const token = localStorage.getItem("token");

    const text = document.getElementById(`comment-${id}`).value;

    if (!text) {

        alert("Write a comment");

        return;
    }

    await fetch(`${API}/posts/comment/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json",
            Authorization: token
        },

        body: JSON.stringify({
            text
        })
    });

    document.getElementById(`comment-${id}`).value = "";

    loadPosts();
}


// ================= TOGGLE COMMENTS =================

function toggleComments(id) {

    const box =
    document.getElementById(`comments-${id}`);

    if (box.style.display === "block") {

        box.style.display = "none";

    } else {

        box.style.display = "block";
    }
}


// ================= OPEN USER PROFILE =================

async function openUserProfile(id) {

    localStorage.setItem("viewUserId", id);

    window.location.href = "profile.html";
}


// ================= FOLLOW USER =================

// ================= FOLLOW / UNFOLLOW =================

async function followUser(){

    const token =
    localStorage.getItem("token");

    const viewedUser =
    localStorage.getItem("viewUserId");

    const response = await fetch(

        `${API}/users/follow/${viewedUser}`,

        {
            method:"PUT",

            headers:{
                Authorization: token
            }
        }
    );

    const data = await response.json();

    console.log(data);

    // RELOAD PROFILE

    await loadProfile();
}

// ================= UNFOLLOW USER =================

async function unfollowUser(id) {

    const token = localStorage.getItem("token");

    await fetch(`${API}/users/unfollow/${id}`, {

        method: "PUT",

        headers: {
            Authorization: token
        }
    });

    loadProfile();
}


// ================= LOAD PROFILE =================

// ================= LOAD PROFILE =================

async function loadProfile(){

    const token =
    localStorage.getItem("token");

    const loggedInUser =
    localStorage.getItem("userId");

    const viewedUser =
    localStorage.getItem("viewUserId")
    || loggedInUser;

    const response = await fetch(

        `${API}/users/profile/${viewedUser}`,

        {
            headers:{
                Authorization: token
            }
        }
    );

    const user = await response.json();

    // PROFILE DETAILS

    document.getElementById("profileName").innerText =
    user.name;

    document.getElementById("followers").innerText =
    user.followers.length;

    document.getElementById("following").innerText =
    user.following.length;


    // ================= FOLLOW BUTTON =================

    const followBtn =
    document.getElementById("followBtn");

    // IF BUTTON EXISTS

    if(followBtn){

        // HIDE BUTTON ON OWN PROFILE

        if(loggedInUser === viewedUser){

            followBtn.style.display = "none";

        }else{

            followBtn.style.display = "block";

            // CHECK IF ALREADY FOLLOWING

           const isFollowing =
user.followers.some(
    follower =>
    follower._id.toString() ===
    loggedInUser.toString()
);

            if(isFollowing){

                followBtn.innerText = "Unfollow";

            }else{

                followBtn.innerText = "Follow";
            }
        }
    }
}
// ================= SHOW FOLLOWERS =================

async function showFollowers(){

    const token =
    localStorage.getItem("token");

    const viewedUser =
    localStorage.getItem("viewUserId")
    || localStorage.getItem("userId");

    const response = await fetch(
        `${API}/users/profile/${viewedUser}`,
        {
            headers:{
                Authorization: token
            }
        }
    );

    const user = await response.json();

    document.getElementById("followModal").style.display =
    "flex";

    document.getElementById("followTitle").innerText =
    "Followers";

    const list =
    document.getElementById("followList");

    list.innerHTML = "";

    user.followers.forEach(follower => {

        list.innerHTML += `

        <div class="follow-user">

            <div class="follow-user-icon">
                👤
            </div>

            <div class="follow-user-name">
                ${follower.name}
            </div>

        </div>
        `;
    });
}



// ================= SHOW FOLLOWING =================

async function showFollowing(){

    const token =
    localStorage.getItem("token");

    const viewedUser =
    localStorage.getItem("viewUserId")
    || localStorage.getItem("userId");

    const response = await fetch(
        `${API}/users/profile/${viewedUser}`,
        {
            headers:{
                Authorization: token
            }
        }
    );

    const user = await response.json();

    document.getElementById("followModal").style.display =
    "flex";

    document.getElementById("followTitle").innerText =
    "Following";

    const list =
    document.getElementById("followList");

    list.innerHTML = "";

    user.following.forEach(following => {

        list.innerHTML += `

        <div class="follow-user">

            <div class="follow-user-icon">
                👤
            </div>

            <div class="follow-user-name">
                ${following.name}
            </div>

        </div>
        `;
    });
}



// ================= CLOSE MODAL =================

function closeFollowModal(){

    document.getElementById("followModal").style.display =
    "none";
}

// ================= LOAD NOTIFICATIONS =================

async function loadNotifications() {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API}/notifications`, {

        headers: {
            Authorization: token
        }
    });

    const notifications = await response.json();

    const container =
    document.getElementById("notifications");

    if (!container) return;

    container.innerHTML = "";

    notifications.forEach(notification => {

        container.innerHTML += `

        <div class="notification-item">

            <strong>
                ${notification.sender.name}
            </strong>

            ${notification.message}

        </div>
        `;
    });
}


// ================= TOGGLE NOTIFICATIONS =================

function toggleNotifications() {

    const box =
    document.getElementById("notificationBox");

    if (box.style.display === "block") {

        box.style.display = "none";

    } else {

        box.style.display = "block";

        loadNotifications();
    }
}


// ================= INITIAL LOAD =================

loadPosts();

loadProfile();

loadNotifications();