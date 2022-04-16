/**
 * 
 * refreshPages must take in a table and refresh the pagination
 * so that it goes back to page 1 and 
 * 
 * @param {*} curID 
 *  curId is the elemnt id of the table being refreshed
 */

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

/**
 * 
 * clearTemplate must refresh all of the pages so that the 
 * unselected tables contain all of the questions and the
 * selected tables contain nothing. This must redo the 
 * pagination and the selection of all of the question rows
 * it does not need to be animated
 * 
 * this should not be async
 * 
 */
function clearTemplate() {
    var tablePartners = {
        'table_General_non': 'table_General_inc',
        'table_General_inc': 'table_General_non',
        'table_Course_non': 'table_Course_inc',
        'table_Course_inc': 'table_Course_non',
        'table_Lecturer_non': 'table_Lecturer_inc',
        'table_Lecturer_inc': 'table_Lecturer_non'
    };
    var arr = ['table_General_inc', 'table_Course_inc', 'table_Lecturer_inc'];
    arr.forEach(function (curID) {
        var table = '#'.concat(tablePartners[curID]);
        jQuery('#'.concat(curID))
            .find('tbody')
            .find('tr')
            .hide()
            .forEach(
                function (row){
                    jQuery(table).append(row);
                    repaginateTable(table);
                    jQuery(row).show();
                    repaginateTable('#'.concat(tableID));

                    var qst = document.getElementById(getTFName(row.closest('table').attr('id')));
                    var cont = row.closest('table').attr('id').replace('non', 'inc');
                    var ids = jQuery('#'.concat(cont)).find('tbody').find('tr').map(function (_, x) {
                        var str = String(x.id);
                        var spl = str.split('_');
                        return spl[spl.length - 1];
                    }).get();
                    qst.value = customSerialize(ids);
                    return "";
                }
            );
    });
    arr.forEach(function (curID) {
        refreshPages(curID);
    });
}

/**
 * 
 * clear the template
 * arr: non-selected questions which after clearing will 
 *      contain all the questions for the section
 * mapped: given a non-selected table name give the corresponding
 *         field for the questions to be populated in
 * forEach: table get the associated field with questions.
 *          use this to take the question from the parameter.
 *          then for each question, select them.
 *          when done, refresh the tables
 * 
 * @param {*} templateQuestions 
 *          
 */
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
                        jQuery('#qst-select-rdbt-'.concat(question))
                            .trigger('click');
                        jQuery(":animated").promise().then(function (result) {
                            refreshPages(tableID);
                        });

                    });
                });
            } else if (quests != '') {
                jQuery(":animated").promise().done(function () {
                    jQuery('#qst-select-rdbt-'.concat(quests)).trigger('click');
                    jQuery(":animated").promise().then(function (result) {
                        refreshPages(tableID);
                    });
                });
            }
        });
    });
}

/**
 * paginated each table with class paginated
 */
jQuery('table.paginated')
    .each(paginate);

/**
 * #field_srv-gen refers to the question 'Would you like to
 * generate the survey from a template?'. If it changes to 
 * not selected, the templates must be cleared.
 */
jQuery('#field_srv-gen')
    .change(function (event) {
        event.preventDefault();
        jQuery('#field_srv-gen').prop('disabled', true);
        var isChecked = jQuery('#'.concat(this.id)).is(':checked');
        if (!isChecked) {
            clearTemplate()
        }
        jQuery('#field_srv-gen').prop('disabled', false);

    });

/**
 * #field_srv-template refers to the dropdown box allowing you
 * to select a template to generate questions from.
 * Start by making an Ajax call to get the questions from the
 * selected survey. Then format these responses into the format
 * for the addTemplate function.
 */
jQuery('#field_srv-template')
    .change(function (event) {

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

/**
 * Whenever any checkbox is changed do this.
 * 
 * If it is selecting courses during a survey, then make
 * an ajax call to get the question for that course. 
 * Append the response
 * 
 * If it is selecting a question:
 * tablePartners: matches selection tables. Non-selected ones
 *                have to match to the selected ones
 * Change row class to selected/non-selected
 * Fade out selected row
 * Repaginate tables
 * Fade in selected row
 * Repaginate tables
 * Updated field containing selected questions
 * 
 */
jQuery('input[type="checkbox"]').change(function (event) {

    event.preventDefault();
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
        
        var tablePartners = {
            'table_General_non': 'table_General_inc',
            'table_General_inc': 'table_General_non',
            'table_Course_non': 'table_Course_inc',
            'table_Course_inc': 'table_Course_non',
            'table_Lecturer_non': 'table_Lecturer_inc',
            'table_Lecturer_inc': 'table_Lecturer_non'
        };

        var row = document.getElementById(jQuery(this).closest('tr').attr('id'));
        
        if (row.classList.contains('selected')) {
            row.classList.remove('selected');
        } else {
            row.classList.add('selected');
        }

        row = jQuery(this).closest('tr').attr('id');
        var tableID = jQuery(this).closest('table').attr('id');

        jQuery('#'.concat(row)).fadeOut(100).promise()
            .then(function (result) {
                return jQuery('#'.concat(tablePartners[tableID])).append(jQuery('#'.concat(row)));
            })
            .then(function (result) {
                return repaginateTable('#'.concat(tablePartners[tableID]));
            })
            .then(function (result) {
                return jQuery('#'.concat(row)).fadeIn(100);
            })
            .then(function (result) {
                return repaginateTable('#'.concat(tableID));
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