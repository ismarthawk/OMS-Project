
function validateForm() {

    
    if (editForm.name.value === "" || editForm.year.value === "" || editForm.branch.value === "" || editForm.gender.value === "" || editForm.blockid.value === "" || editForm.roomNumber.value === "" || editForm.mobileNumber.value === "" || editForm.parentMobileNumber.value === "") {
        alert("Please fill all the fields");
        return false;
    }
    else if (editForm.mobileNumber.value.length !== 10) {
        alert("Mobile number should be 10 digits");
        return false;
    }
    else if (editForm.parentMobileNumber.value.length !== 10) {
        alert("Parent mobile number should be 10 digits");
        return false;
    }
    return true;

}

