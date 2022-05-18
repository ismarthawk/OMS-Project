
function validateForm() {
    //let mail = document.forms["loginForm"]["mail"].value;
    const studentexp = new RegExp("[1-9][0-9][0-9][0-9][0-9][0-9]@student.nitandhra.ac.in");
    const wardenexp = new RegExp("[A-Za-z0-9]+@nitandhra.ac.in")
    if (loginForm.mail.value === ""||loginForm.password.value === "") {
        alert("Please fill all the required fields");
    }
    else if (!studentexp.exec(loginForm.mail.value) && !wardenexp.exec(loginForm.mail.value)) {
        alert("Please enter a valid email address");
        return false;
    }
    return true;
}   