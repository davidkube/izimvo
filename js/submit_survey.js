jQuery('#submitNF').on('click', function (event) {

    event.preventDefault();
    jQuery('#submitNF').prop("disabled", true);
    jQuery('#survey_to_hide').hide();

    let formData = jQuery('#survey').serializeArray().reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});

    function GetUserIP() {
        var ret_ip;
        jQuery.ajaxSetup({
            async: false
        });
        jQuery.get('http://jsonip.com/', function (r) {
            ret_ip = r.ip;
        });
        return ret_ip;
    }
    let ip = GetUserIP();

    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
        return false;
    };

    let surv = getUrlParameter('srv');

    jQuery.ajax({
        url: ajaxurl,
        type: 'POST',
        data: {
            action: 'submit_survey_response',
            dataForPHP: formData,
            survey: surv,
            ipadd: ip
        },
        success: function (response) {
            window.location.replace("/splash");
        },
        error: function (data) {}
    });
});