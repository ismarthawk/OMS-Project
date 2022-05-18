


function validateForm() {

    const wardenexp = new RegExp("[A-Za-z0-9]+@nitandhra.ac.in")

    if (registerForm.name.value === "" || registerForm.blockid.value === "" || registerForm.mobileNumber.value === "" || registerForm.mail.value === "" || registerForm.pass.value === "" || registerForm.confirmPassword.value === "") {
        alert("Please fill all the fields");
        return false;
    }
    else if(registerForm.mobileNumber.value.length !== 10){
        alert("Mobile number should be 10 digits");
        return false;
    }
    else if (!wardenexp.exec(registerForm.mail.value)) {
        alert("Please enter a valid Institute email address");
        return false;
    }
    else if (registerForm.pass.value !== registerForm.confirmPassword.value) {
        alert("Passwords do not match");
        return false;
    }
    return true;



}