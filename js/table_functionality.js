jQuery('table.paginated').each(function () {
    var currentPage = 0;
    var numPerPage = 5;
    var jQuerytable = jQuery(this);
    jQuerytable.bind('repaginate', function () {
        jQuerytable.find('tbody tr').hide().slice(currentPage * numPerPage, (currentPage + 1) * numPerPage).show();
    });
    jQuerytable.trigger('repaginate');
    var numRows = jQuerytable.find('tbody tr').length;
    var numPages = Math.ceil(numRows / numPerPage);
    var div = '<div id="pagers_'.concat(this.id, '" class="pager"></div>');
    var jQuerypager = jQuery(div);
    for (var page = 0; page < numPages; page++) {
        jQuery('<span class="page-number" id="page_numbers_'.concat(this.id.replace("#", ""), page + 1, '"></span>')).text(page + 1).bind('click', {
            newPage: page
        }, function (event) {
            currentPage = event.data['newPage'];
            jQuerytable.trigger('repaginate');
            jQuery(this).addClass('active').siblings().removeClass('active');
        }).appendTo(jQuerypager).addClass('clickable');
    }
    jQuerypager.insertBefore(jQuerytable).find('span.page-number:first').addClass('active');
});


function refreshPages(curID) {
    jQuery(":animated").promise().done(function () {
        var currentPage = 0;
        var numPerPage = 5;
        var jQuerytable = jQuery('#'.concat(curID));
        jQuerytable.bind('repaginate', function () {
            jQuerytable.find('tbody tr').hide().slice(currentPage * numPerPage, (currentPage + 1) * numPerPage).show();
        });
        jQuerytable.trigger('repaginate');
        var jQuerytable = jQuery('#'.concat(curID.replace("inc", "non")));
        jQuerytable.bind('repaginate', function () {
            jQuerytable.find('tbody tr').hide().slice(currentPage * numPerPage, (currentPage + 1) * numPerPage).show();
        });
        jQuerytable.trigger('repaginate');
    });
}

function clearTemplate() {
    var arr = ['table_General_inc', 'table_Course_inc', 'table_Lecturer_inc'];
    arr.forEach(function (curID) {
        jQuery('#'.concat(curID)).find('tbody').find('tr').find('input').trigger('click');
    });
    jQuery(":animated").promise().done(
        function () {
            console.log("Done clearing questions");
        }
    );
    arr.forEach(function (curID) {
        refreshPages(curID);
    });
    jQuery(":animated").promise().done(
        function () {
            console.log("Done refreshing tables");
        }
    );
}


function addTemplate(templateQuestions) {
    clearTemplate();
    jQuery(":animated").promise().done(function () {
        var arr = ['table_General_non', 'table_Course_non', 'table_Lecturer_non'];
        var mapped = {
            'table_General_non': 'srv-glb-qst-dyn',
            'table_Course_non': 'srv-crs-qst-dyn',
            'table_Lecturer_non': 'srv-lct-qst-dyn'
        };
        arr.forEach(function (tableID) {
            var fieldID = mapped[tableID];
            var quests = templateQuestions[fieldID];
            if (Array.isArray(quests) && quests.length > 1) {
                quests.forEach(function (question) {
                    jQuery(":animated").promise().done(function () {
                        jQuery('#qst-select-rdbt-'.concat(question)).trigger('click');
                        refreshPages(tableID);
                    });
                });
            } else if (quests != '') {
                jQuery('#qst-select-rdbt-'.concat(quests)).trigger('click');
                refreshPages(tableID);
            }
        });
    });
}

jQuery('#field_srv-gen').change(function (event) {
    event.preventDefault();
    jQuery('#field_srv-gen').prop('disabled', true);
    var isChecked = jQuery('#'.concat(this.id)).is(':checked');
    if (!isChecked) {
        clearTemplate()
    }
    jQuery('#field_srv-gen').prop('disabled', false);

});

jQuery('#field_srv-template').change(function (event) {
    event.preventDefault();
    jQuery('#field_srv-template').prop('disabled', true);
    if (jQuery('#'.concat(this.id)).val() != '') {
        jQuery.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'get_questions',
                survey_name: jQuery('#'.concat(this.id)).val()
            },
            success: function (response) {
                if (response != '') {
                    addTemplate(JSON.parse(response));
                } else {
                    console.log(jQuery('#'.concat(this.id)).val());
                }
            },
            error: function (data) {},
            async: false
        });
    } else {
        clearTemplate();
    }
    jQuery('#field_srv-template').prop('disabled', false);
});

jQuery('input[type="checkbox"]').change(function (event) {

    event.preventDefault();

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
    var hasa = '#'
    var thisID = event.target.id;
    var item_id = thisID.split("_")[2];
    var only_type = thisID.split("_")[0];
    var typea = hasa.concat(only_type, "-qst-section")
    thisID = hasa.concat(thisID);


    jQuery(thisID).prop("disabled", true);

    var checkcc = jQuery(thisID);

    if (jQuery(thisID).hasClass('.courseSelector')) {
        if (jQuery(thisID).is(':checked')) {
            console.log(thisID.concat(" is checked"));
            jQuery.ajax({
                url: ajaxurl,
                type: 'POST',
                data: {
                    action: 'get_section',
                    item_id: item_id,
                    survey: surv
                },
                success: function (response) {

                    jQuery(typea).append(response);

                },
                error: function (e) {
                    console.log(e);
                }
            });
        } else {
            var checkk = hasa.concat(only_type, "-", item_id, "-section");
            jQuery(checkk).parent().remove();
        }
    } else if (jQuery(thisID).hasClass('qstSelector')) {
        console.log(thisID.concat(' is ', document.getElementById(jQuery(this).closest('tr').attr('id')).classList.contains('selected') ? 'selected.' : 'not selected.'));
        var row = document.getElementById(jQuery(this).closest('tr').attr('id'));
        if (row.classList.contains('selected')) {
            row.classList.remove('selected');
        } else {
            row.classList.add('selected');
        }

        var tablePartners = {
            'table_General_non': 'table_General_inc',
            'table_General_inc': 'table_General_non',
            'table_Course_non': 'table_Course_inc',
            'table_Course_inc': 'table_Course_non',
            'table_Lecturer_non': 'table_Lecturer_inc',
            'table_Lecturer_inc': 'table_Lecturer_non'
        };

        function repag(tableElem) {
            var currentPage = 0;
            var numPerPage = 5;
            var jQuerytable = jQuery(tableElem);
            jQuerytable.bind('repaginate', function () {
                jQuerytable.find('tbody tr').hide().slice(currentPage * numPerPage, (currentPage + 1) * numPerPage).show();
            });
            jQuerytable.trigger('repaginate');
            var numRows = jQuerytable.find('tbody tr').length;
            var numPages = Math.ceil(numRows / numPerPage);
            jQuery('#'.concat('pagers_', tableElem.replace("#", ""))).remove();
            var div = '<div id="pagers_'.concat(tableElem.replace("#", ""), '" class="pager"></div>');
            var jQuerypager = jQuery(div);
            for (var page = 0; page < numPages; page++) {
                jQuery('<span class="page-number" id="page_numbers_'.concat(tableElem.replace("#", ""), page + 1, '"></span>')).text(page + 1).bind('click', {
                    newPage: page
                }, function (event) {
                    currentPage = event.data['newPage'];
                    jQuerytable.trigger('repaginate');
                    jQuery(this).addClass('active').siblings().removeClass('active');
                }).appendTo(jQuerypager).addClass('clickable');
            }
            var currentPageID = '#page_numbers_'.concat(tableElem.replace("#", ""), currentPage + 1);
            jQuerypager.insertBefore(jQuerytable).find(currentPageID).siblings().removeClass('active');
            return jQuery(currentPageID).addClass('active');


        }
        row = jQuery(this).closest('tr').attr('id');
        var tableID = jQuery(this).closest('table').attr('id');

        jQuery('#'.concat(row)).fadeOut(100).promise()
            .then(function (result) {
                return jQuery('#'.concat(tablePartners[tableID])).append(jQuery('#'.concat(row)));
            })
            .then(function (result) {
                return repag('#'.concat(tablePartners[tableID]));
            })
            .then(function (result) {
                return jQuery('#'.concat(row)).fadeIn(350);
            })
            .then(function (result) {
                return repag('#'.concat(tableID));
            })
            .then(function (result) {
                var qst = document.getElementById(getTFName(jQuery(thisID).closest('table').attr('id')));
                var cont = jQuery(thisID).closest('table').attr('id').replace('non', 'inc');
                var ids = jQuery('#'.concat(cont)).find('tbody').find('tr').map(function (_, x) {
                    var str = String(x.id);
                    var spl = str.split('_');
                    return spl[spl.length - 1];
                }).get();
                qst.value = customSerialize(ids);
                return "";
            });
    }
    jQuery(":animated").promise().done(function () {
        jQuery(thisID).prop("disabled", false);
    });

});