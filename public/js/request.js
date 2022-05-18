
function validDate() {
    const today = new Date;
    today.setHours(0,0,0,0);
    const date = new Date(requestForm.requestedFor.value);
    if (today < date) {
        return true;
    }
    return false;
}



function validateForm() {
    if (requestForm.requestedFor.value === "" || requestForm.desc.value === "" || requestForm.where.value === "") {
        alert("Please fill all the required fields");
        return false;
    }
    else if (!validDate()) {
        alert("Enter a valid date");
        return false;
    }
    return true;
}