



function validateForm() {


    if (editForm.name.value === "" || editForm.blockid.value === "" || editForm.mobileNumber.value === "") {
        alert("Please fill all the fields");
        return false;
    }
    else if(editForm.mobileNumber.value.length !== 10){
        alert("Mobile number should be 10 digits");
        return false;
    }

    return true;



}