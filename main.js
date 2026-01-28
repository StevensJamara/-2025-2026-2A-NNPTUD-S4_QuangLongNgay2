const URL_POSTS = "http://localhost:3000/posts";
const URL_COMMENTS = "http://localhost:3000/comments";

// Hàm này sẽ tự chạy ngay khi trang web load xong
document.addEventListener("DOMContentLoaded", () => {
    LoadData();
    LoadComments();
});

async function LoadData() {
    try {
        let res = await fetch(URL_POSTS);
        let posts = await res.json();
        let body = document.getElementById("body_table");
        body.innerHTML = '';
        posts.forEach(post => {
            const titleDisplay = post.isDeleted ? `<s>${post.title}</s>` : post.title;
            body.innerHTML += `<tr>
                <td>${post.id}</td>
                <td>${titleDisplay}</td>
                <td>${post.views}</td>
                <td>
                    <button onclick="EditPost('${post.id}')">Edit</button>
                    <button onclick="DeleteSoftPost('${post.id}')">Delete</button>
                </td>
            </tr>`;
        });
    } catch (error) {
        console.error("Không thể kết nối đến server. Hãy chắc chắn đã chạy json-server!", error);
    }
}

async function Save() {
    let id = document.getElementById("id_txt").value;
    let title = document.getElementById("title_txt").value;
    let views = document.getElementById("view_txt").value;

    if (!id) { // Tạo mới
        let resAll = await fetch(URL_POSTS);
        let posts = await resAll.json();
        let maxId = posts.length > 0 ? Math.max(...posts.map(p => parseInt(p.id))) : 0;
        let newId = (maxId + 1).toString();

        await fetch(URL_POSTS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: newId, title, views: parseInt(views), isDeleted: false })
        });
    } else { // Cập nhật
        await fetch(`${URL_POSTS}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, views: parseInt(views), isDeleted: false })
        });
    }
    document.getElementById("id_txt").value = "";
    LoadData();
}

async function EditPost(id) {
    let res = await fetch(`${URL_POSTS}/${id}`);
    let post = await res.json();
    document.getElementById("id_txt").value = post.id;
    document.getElementById("title_txt").value = post.title;
    document.getElementById("view_txt").value = post.views;
}

async function DeleteSoftPost(id) {
    await fetch(`${URL_POSTS}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDeleted: true })
    });
    LoadData();
}

// --- COMMENTS ---
async function LoadComments() {
    let res = await fetch(URL_COMMENTS);
    let comments = await res.json();
    let body = document.getElementById("body_comments");
    body.innerHTML = '';
    comments.forEach(c => {
        const textDisplay = c.isDeleted ? `<s>${c.text}</s>` : c.text;
        body.innerHTML += `<tr>
            <td>${c.id}</td>
            <td>${textDisplay}</td>
            <td>${c.postId}</td>
            <td>
                <button onclick="EditComment('${c.id}')">Edit</button>
                <button onclick="DeleteSoftComment('${c.id}')">Delete</button>
            </td>
        </tr>`;
    });
}

async function SaveComment() {
    let id = document.getElementById("comment_id_txt").value;
    let text = document.getElementById("comment_text_txt").value;
    let postId = document.getElementById("comment_postId_txt").value;

    if (!id) {
        let resAll = await fetch(URL_COMMENTS);
        let comments = await resAll.json();
        let maxId = comments.length > 0 ? Math.max(...comments.map(c => parseInt(c.id))) : 0;
        let newId = (maxId + 1).toString();

        await fetch(URL_COMMENTS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: newId, text, postId, isDeleted: false })
        });
    } else {
        await fetch(`${URL_COMMENTS}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, postId, isDeleted: false })
        });
    }
    document.getElementById("comment_id_txt").value = "";
    LoadComments();
}

async function EditComment(id) {
    let res = await fetch(`${URL_COMMENTS}/${id}`);
    let c = await res.json();
    document.getElementById("comment_id_txt").value = c.id;
    document.getElementById("comment_text_txt").value = c.text;
    document.getElementById("comment_postId_txt").value = c.postId;
}

async function DeleteSoftComment(id) {
    await fetch(`${URL_COMMENTS}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDeleted: true })
    });
    LoadComments();
}