

function validateForm() {

    const studentexp = new RegExp("[1-9][0-9][0-9][0-9][0-9][0-9]@student.nitandhra.ac.in");

    if (registerForm.name.value === "" || registerForm.regNumber.value === "" || registerForm.rollNumber.value === "" || registerForm.year.value === "" || registerForm.branch.value === "" || registerForm.gender.value === "" || registerForm.blockid.value === "" || registerForm.roomNumber.value === "" || registerForm.mail.value === "" || registerForm.mobileNumber.value === "" || registerForm.parentMobileNumber.value === "" || registerForm.pass.value === "" || registerForm.confirmPassword.value === "") {
        alert("Please fill all the fields");
        return false;
    }
    else if (registerForm.regNumber.value.length !== 6) {
        alert("Registration number should be 6 digits");
        return false;
    }
    else if (registerForm.rollNumber.value.length !== 6) {
        alert("Roll number should be 6 digits");
        return false;
    }
    else if (!studentexp.exec(registerForm.mail.value)) {
        alert("Please enter a valid Institute email address");
        return false;
    }
    else if (registerForm.mobileNumber.value.length !== 10) {
        alert("Mobile number should be 10 digits");
        return false;
    }
    else if (registerForm.parentMobileNumber.value.length !== 10) {
        alert("Parent mobile number should be 10 digits");
        return false;
    }
    else if (registerForm.pass.value !== registerForm.confirmPassword.value) {
        alert("Passwords do not match");
        return false;
    }
    return true;
}