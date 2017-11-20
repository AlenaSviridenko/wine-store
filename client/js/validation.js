$(function() {
    $("#frm-signup").validate({
        // Specify validation rules
        rules: {
            // The key name on the left side is the name attribute
            // of an input field. Validation rules are defined
            // on the right side
            firstName: "required",
            lastName: "required",
            email: {
                required: true,
                email: true
            },
            username: 'required',
            password: {
                required: true,
                minlength: 5
            },
            confirmPassword: 'required'
        },
        // Specify validation error messages
        messages: {
            firstName: "Please enter your First Name",
            lastName: "Please enter your Last Name",
            username: "Please enter your Username",
            password: {
                required: "Please provide a password",
                minlength: "Your password must be at least 5 characters long"
            },
            confirmPassword: 'Please enter your password again',
            email: "Please enter a valid email address"
        },
        // Make sure the form is submitted to the destination defined
        // in the "action" attribute of the form when valid
        submitHandler: function(form) {
            form.submit();
        }
    });
})