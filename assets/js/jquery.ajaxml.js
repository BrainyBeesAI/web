/*!
Mailchimp Ajax Submit
jQuery Plugin
Author: Siddharth Doshi

Use:
===
$('#form_id').ajaxchimp(options);

- Form should have one <input> element with attribute 'type=email'
- Form should have one label element with attribute 'for=email_input_id' (used to display error/success message)
- All options are optional.

Options:
=======
options = {
    language: 'en',
    callback: callbackFunction,
    url: 'http://blahblah.us1.list-manage.com/subscribe/post?u=5afsdhfuhdsiufdba6f8802&id=4djhfdsh99f'
}

Notes:
=====
To get the mailchimp JSONP url (undocumented), change 'post?' to 'post-json?' and add '&c=?' to the end.
For e.g. 'http://blahblah.us1.list-manage.com/subscribe/post-json?u=5afsdhfuhdsiufdba6f8802&id=4djhfdsh99f&c=?',
*/

(function ($) {
    'use strict';

    $.ajaxML = {
        responses: {
            'We have sent you a confirmation email'                                             : 0,
            'Please enter a value'                                                              : 1,
            'An email address must contain a single @'                                          : 2,
            'The domain portion of the email address is invalid (the portion after the @: )'    : 3,
            'The username portion of the email address is invalid (the portion before the @: )' : 4,
            'This email address looks fake or invalid. Please enter a real email address'       : 5
        },
        translations: {
            'en': null
        },
        init: function (selector, options) {
            $(selector).ajaxMl(options);
        }
    };

    $.fn.ajaxML = function (options) {
        $(this).each(function(i, elem) {
            var form = $(elem);
            var email = form.find('input[type=email]');
            var label = form.find('label[for=' + email.attr('id') + ']');

            var settings = $.extend({
                'url': form.attr('action'),
                'language': 'en'
            }, options);

            var url = settings.url;

            form.attr('novalidate', 'true');
            email.attr('name', 'fields[email]');

            form.submit(function () {
                var msg;
                function successCallback(resp) {
                    if (resp.success === true) {
                        msg = 'We have sent you a confirmation email';
                        label.removeClass('error').addClass('valid');
                        email.removeClass('error').addClass('valid');
                    } else {
                        email.removeClass('valid').addClass('error');
                        label.removeClass('valid').addClass('error');

                        if (resp.errors && resp.errors.fields && resp.errors.fields.email && resp.errors.fields.email[0] !== undefined) {
                            msg = resp.errors.fields.email[0];
                        }
                    }

                    label.html(msg);

                    label.show(2000);
                    if (settings.callback) {
                        settings.callback(resp);
                    }
                }

                var data = {};
                var dataArray = form.serializeArray();
                $.each(dataArray, function (index, item) {
                    data[item.name] = item.value;
                });

                grecaptcha.ready(function() {
                    grecaptcha.execute('6Lf6Pc8oAAAAAFJxGvpvyN9SqUnYp97zrYVEmO2a', {action: 'submit'}).then(function(token) {
                        $.ajax({
                            url: url,
                            data: data,
                            type: 'POST',
                            success: successCallback,
                            dataType: 'jsonp',
                            error: function (resp, text) {
                                console.log('MailerLite ajax submit error: ' + text);
                            }
                        });
        
                        var submitMsg = 'Submitting...';
                        label.html(submitMsg).show(2000);            
                    });
                });

                return false;
            });
        });
        return this;
    };
})(jQuery);