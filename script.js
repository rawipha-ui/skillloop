const defaultSkills = [
    {
        id: 1,
        title: "ออกแบบกราฟิกด้วย Photoshop",
        category: "กราฟิก",
        teacher: "นักศึกษาสายคอมพิวเตอร์",
        level: "เริ่มต้น",
        icon: "🎨",
        description: "เรียนรู้การออกแบบโปสเตอร์และตกแต่งภาพ"
    },
    {
        id: 2,
        title: "ตัดต่อวิดีโอด้วย CapCut",
        category: "ตัดต่อ",
        teacher: "นักศึกษาสายดิจิทัล",
        level: "เริ่มต้น",
        icon: "🎬",
        description: "เรียนรู้การตัดต่อวิดีโอและใส่เอฟเฟกต์"
    },
    {
        id: 3,
        title: "ใช้งาน Microsoft Excel",
        category: "โปรแกรม",
        teacher: "นักศึกษาสายบัญชี",
        level: "ปานกลาง",
        icon: "📊",
        description: "เรียนรู้สูตรคำนวณและการจัดการตาราง"
    },
    {
        id: 4,
        title: "ภาษาอังกฤษเพื่อการสื่อสาร",
        category: "ภาษา",
        teacher: "นักศึกษาสายภาษา",
        level: "เริ่มต้น",
        icon: "🌎",
        description: "ฝึกพูดภาษาอังกฤษในชีวิตประจำวัน"
    }
];

let skills = JSON.parse(
    localStorage.getItem("skillloop_skills")
) || defaultSkills;

let currentCategory = "ทั้งหมด";

function saveSkills() {
    localStorage.setItem(
        "skillloop_skills",
        JSON.stringify(skills)
    );
}

function renderSkills(list = skills) {
    const grid = document.getElementById("skillGrid");

    if (list.length === 0) {
        grid.innerHTML = "<p>ไม่พบทักษะที่ค้นหา</p>";
        return;
    }

    grid.innerHTML = list.map(skill => `
        <div class="skill-card">
            <div class="skill-icon">${skill.icon}</div>

            <h3>${escapeHTML(skill.title)}</h3>

            <p>หมวดหมู่: ${escapeHTML(skill.category)}</p>
            <p>ผู้สอน: ${escapeHTML(skill.teacher)}</p>
            <p>ระดับ: ${escapeHTML(skill.level)}</p>

            <button class="detail-btn"
                onclick="showDetail(${skill.id})">
                ดูรายละเอียด →
            </button>
        </div>
    `).join("");
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

function searchSkills() {
    const keyword = document
        .getElementById("searchInput")
        .value.toLowerCase();

    const results = skills.filter(skill => {
        const matchKeyword =
            skill.title.toLowerCase().includes(keyword) ||
            skill.category.toLowerCase().includes(keyword) ||
            skill.teacher.toLowerCase().includes(keyword);

        const matchCategory =
            currentCategory === "ทั้งหมด" ||
            skill.category === currentCategory;

        return matchKeyword && matchCategory;
    });

    renderSkills(results);
}

function filterCategory(category) {
    currentCategory = category;
    searchSkills();
}

document.getElementById("searchInput")
    .addEventListener("input", searchSkills);

function openModal(content) {
    document.getElementById("modalBody").innerHTML = content;
    document.getElementById("modal").style.display = "flex";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

function showDetail(id) {
    const skill = skills.find(item => item.id === id);
    if (!skill) return;

    openModal(`
        <h2>${escapeHTML(skill.icon)} ${escapeHTML(skill.title)}</h2>
        <p>หมวดหมู่: ${escapeHTML(skill.category)}</p>
        <p>ผู้สอน: ${escapeHTML(skill.teacher)}</p>
        <p>ระดับ: ${escapeHTML(skill.level)}</p>
        <p>${escapeHTML(skill.description)}</p>
        <button class="submit" onclick="requestSkill(${skill.id})">
            ขอเรียนทักษะนี้
        </button>
    `);
}

function requestSkill(id) {
    const skill = skills.find(item => item.id === id);
    if (!skill) return;

    alert("ส่งคำขอเรียนทักษะ " + skill.title +
          " แล้ว (ตัวอย่างการทำงาน)");

    closeModal();
}

function addSkill() {
    openModal(`
        <h2>เพิ่มทักษะใหม่</h2>

        <input id="skillTitle"
            placeholder="ชื่อทักษะ" maxlength="100">

        <select id="skillCategory">
            <option value="กราฟิก">กราฟิก</option>
            <option value="ตัดต่อ">ตัดต่อ</option>
            <option value="โปรแกรม">โปรแกรม</option>
            <option value="ภาษา">ภาษา</option>
        </select>

        <input id="skillTeacher"
            placeholder="ชื่อผู้สอน" maxlength="80">

        <select id="skillLevel">
            <option value="เริ่มต้น">เริ่มต้น</option>
            <option value="ปานกลาง">ปานกลาง</option>
            <option value="ขั้นสูง">ขั้นสูง</option>
        </select>

        <textarea id="skillDescription"
            placeholder="รายละเอียดทักษะ" maxlength="500"></textarea>

        <button class="submit" onclick="submitSkill()">
            บันทึกทักษะ
        </button>
    `);
}

function submitSkill() {
    const title = document.getElementById("skillTitle").value.trim();
    const category = document.getElementById("skillCategory").value;
    const teacher = document.getElementById("skillTeacher").value.trim();
    const level = document.getElementById("skillLevel").value;
    const description = document.getElementById("skillDescription").value.trim();

    if (!title || !teacher || !description) {
        alert("กรุณากรอกข้อมูลให้ครบ");
        return;
    }

    skills.unshift({
        id: Date.now(),
        title,
        category,
        teacher,
        level,
        description,
        icon: "✨"
    });

    saveSkills();
    renderSkills();
    closeModal();

    alert("เพิ่มทักษะเรียบร้อยแล้ว");
}

function showLogin() {
    openModal(`
        <h2>เข้าสู่ระบบ</h2>
        <p>ระบบสมาชิกกำลังอยู่ในขั้นตอนพัฒนา</p>
        <input placeholder="อีเมล" type="email">
        <input placeholder="รหัสผ่าน" type="password">
        <button class="submit"
            onclick="alert('ระบบเข้าสู่ระบบจะพัฒนาในขั้นตอนถัดไป')">
            เข้าสู่ระบบ
        </button>
    `);
}

renderSkills();
