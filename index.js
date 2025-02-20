// ฟังก์ชันสร้าง JWT (ปลอม)
function createJWT(payload, secret, expiresInSeconds = 20) {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const body = btoa(JSON.stringify({
        ...payload,
        exp: Date.now() + expiresInSeconds * 1000,
    }));
    const signature = btoa(`${header}.${body}.${secret}`);
    return `${header}.${body}.${signature}`;
}

// ตรวจสอบฟอร์มล็อกอิน
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // ค้นหาผู้ใช้ใน mockUsers
    const user = mockUsers.find(u => u.username === username && u.password === password);

    if (user) {
        const token = createJWT({ username: user.username }, "mysecret", 20);
        localStorage.setItem("token", token);
        localStorage.setItem("name", user.name);
        localStorage.setItem("email", user.email);
        alert("Login successful!");
        window.location.href = "homepage.html";
    } else {
        alert("Invalid username or password.");
    }
});
