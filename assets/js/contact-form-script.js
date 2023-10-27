/*==============================================================*/
// Contact Form  JS
/*==============================================================*/
(function ($) {
    "use strict"; // Start of use strict
    $("#contactForm").validator().on("submit", function (event) {
        if (event.isDefaultPrevented()) {
            // handle the invalid form...
            formError();
            submitMSG(false, "Did you fill in the form properly?");
        } else {
            // everything looks good!
            event.preventDefault();
            submitForm();
        }
    });


    function submitForm(){
        // Initiate Variables With Form Content
        var form = $('#contactForm');

        var data = {};
        var dataArray = form.serializeArray();
        $.each(dataArray, function (index, item) {
            data[item.name] = item.value;
        });

        grecaptcha.ready(function() {
            grecaptcha.execute('6Lf6Pc8oAAAAAFJxGvpvyN9SqUnYp97zrYVEmO2a', {action: 'submit'}).then(function(token) {
                $.ajax({
                    url: "https://assets.mailerlite.com/jsonp/641869/forms/103112103498351921/subscribe",
                    data: data,
                    type: 'POST',
                    success: function(resp) {
                        if (resp.success === true){
                            formSuccess();
                        } else {
                            formError();

                            if (resp.errors && resp.errors.fields && resp.errors.fields.email && resp.errors.fields.email[0] !== undefined) {
                                submitMSG(false, resp.errors.fields.email[0]);
                            }
                        }
                    },
                    dataType: 'jsonp',
                    error: function (resp, text) {
                        console.log('MailerLite ajax submit error: ' + text);
                    }
                });
            });
        });
    }

    function formSuccess(){
        $("#contactForm")[0].reset();
        submitMSG(true, "Message Submitted!")
        $('#contactSubmit').prop('disabled', true);
		$('#contactSubmit').tooltip('enable');
    }

    function formError(){
        $("#contactForm").addClass("animate__animated animate__shakeX");
		setTimeout(function() {
			$("#contactForm").removeClass("animate__animated animate__shakeX");
		}, 1000)
    }

    function submitMSG(valid, msg){
        if(valid){
            var msgClasses = "h4 animate__tada animate__animated text-success";
        } else {
            var msgClasses = "h4 text-danger";
        }
        $("#msgSubmit").removeClass().addClass(msgClasses).text(msg);
    }
}(jQuery)); // End of use strict