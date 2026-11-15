// =====================================
// 1- إنشاء Class Student
// =====================================

class Student {

    // Private Fields (بيانات خاصة)
    #name;
    #grades;
    #attendance;

    constructor(name, grade1, grade2, grade3, attendance) {

        this.name = name;
        this.grade1 = grade1;
        this.grade2 = grade2;
        this.grade3 = grade3;
        this.attendance = attendance;

    }

    // التحقق من اسم الطالب
    set name(value) {

        if (!value || value.trim() === "") {
            throw new Error("من فضلك أدخل اسم الطالب");
        }

        this.#name = value.trim();
    }

    get name() {
        return this.#name;
    }

    // التحقق من الدرجات
    #validateGrade(value, fieldName) {

        if (value === "" || value === null || value === undefined) {
            throw new Error(fieldName + " لا يمكن أن يكون فارغاً");
        }

        const number = Number(value);

        if (!Number.isFinite(number) || number < 0 || number > 100) {
            throw new Error(fieldName + " يجب أن يكون من 0 إلى 100");
        }

        return number;
    }

    set grade1(value) {
        this.#grades = this.#grades || [];
        this.#grades[0] = this.#validateGrade(value, "درجة المادة الأولى");
    }

    get grade1() {
        return this.#grades[0];
    }

    set grade2(value) {
        this.#grades = this.#grades || [];
        this.#grades[1] = this.#validateGrade(value, "درجة المادة الثانية");
    }

    get grade2() {
        return this.#grades[1];
    }

    set grade3(value) {
        this.#grades = this.#grades || [];
        this.#grades[2] = this.#validateGrade(value, "درجة المادة الثالثة");
    }

    get grade3() {
        return this.#grades[2];
    }

    // التحقق من نسبة الحضور
    set attendance(value) {
        this.#attendance = this.#validateGrade(value, "نسبة الحضور");
    }

    get attendance() {
        return this.#attendance;
    }

    // حساب متوسط الدرجات
    getAverage() {

        return (
            this.#grades[0] +
            this.#grades[1] +
            this.#grades[2]
        ) / 3;

    }

}


// =====================================
// 2- إنشاء مصفوفة الطلاب
// =====================================

const studentsList = [];


// =====================================
// 3- ربط JavaScript بعناصر HTML
// =====================================

const studentName = document.getElementById("studentName");

const grade1 = document.getElementById("grade1");

const grade2 = document.getElementById("grade2");

const grade3 = document.getElementById("grade3");

const attendance = document.getElementById("attendance");

const addStudentBtn = document.getElementById("addStudentBtn");

const mercyBtn = document.getElementById("mercyBtn");

const errorBox = document.getElementById("errorBox");

const studentsBox = document.getElementById("studentsBox");

const reportBox = document.getElementById("reportBox");


// =====================================
// 4- عرض رسائل الخطأ
// =====================================

function showError(message) {

    errorBox.textContent = message;

}


// =====================================
// 5- إضافة طالب جديد
// =====================================

addStudentBtn.addEventListener("click", function () {

    errorBox.textContent = "";

    try {

        // إنشاء كائن جديد من Student
        const student = new Student(
            studentName.value,
            grade1.value,
            grade2.value,
            grade3.value,
            attendance.value
        );

        // إضافة الطالب للمصفوفة
        studentsList.push(student);

        // عرض الطلاب على الشاشة
        studentsBox.innerHTML = studentsList.map((student, index) => `

            <div class="alert alert-light border">

                <strong>${index + 1}- ${escapeHTML(student.name)}</strong>

                <br>

                متوسط الدرجات:
                ${student.getAverage().toFixed(2)}

                <br>

                نسبة الحضور:
                ${student.attendance}%

            </div>

        `).join("");

        // تفريغ خانات الإدخال
        studentName.value = "";
        grade1.value = "";
        grade2.value = "";
        grade3.value = "";
        attendance.value = "";

        reportBox.textContent = "تمت إضافة الطالب بنجاح. شغّلي لجنة الرأفة لتحديث التقرير.";

    }

    catch (error) {

        // عرض الخطأ على الشاشة
        showError(error.message);

    }

});


// حماية عرض اسم الطالب داخل HTML
function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, function (character) {

        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[character];

    });

}


// =====================================
// 6- لجنة الرأفة
// =====================================

mercyBtn.addEventListener("click", function () {

    errorBox.textContent = "";

    // Filter: اختيار الطلاب من 40 إلى 49
    const strugglingStudents = studentsList.filter(function (student) {

        const average = student.getAverage();

        return average >= 40 && average <= 49;

    });


    // Map: إضافة 5 درجات رأفة
    const studentsAfterMercy = strugglingStudents.map(function (student) {

        return {

            name: student.name,

            oldAverage: student.getAverage(),

            newAverage: student.getAverage() + 5

        };

    });


    // Reduce: جمع المتوسطات الجديدة
    const totalAverage = studentsAfterMercy.reduce(function (total, student) {

        return total + student.newAverage;

    }, 0);


    // منع القسمة على صفر
    let generalAverage = 0;

    if (studentsAfterMercy.length > 0) {

        generalAverage = totalAverage / studentsAfterMercy.length;

    }


    // إذا لم يوجد طلاب متعثرون
    if (studentsAfterMercy.length === 0) {

        reportBox.innerHTML = `
            <div class="alert alert-info">

                لا يوجد طلاب متعثرون حالياً.

            </div>
        `;

        return;

    }


    // عرض أسماء الطلاب
    const studentsNames = studentsAfterMercy.map(function (student) {

        return `

            <li>
                ${escapeHTML(student.name)}

                - المتوسط قبل الرأفة:
                ${student.oldAverage.toFixed(2)}

                - المتوسط بعد الرأفة:
                ${student.newAverage.toFixed(2)}
            </li>

        `;

    }).join("");


    // عرض التقرير النهائي
    reportBox.innerHTML = `

        <div class="alert alert-success">

            <h4>التقرير النهائي للجنة الرأفة</h4>

            <p>
                عدد الطلاب المتعثرين:
                <strong>${studentsAfterMercy.length}</strong>
            </p>

            <h5>أسماء الطلاب:</h5>

            <ol>
                ${studentsNames}
            </ol>

            <hr>

            <h5>
                المتوسط العام بعد الرأفة:
                ${generalAverage.toFixed(2)}
            </h5>

        </div>

    `;

});