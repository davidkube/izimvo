/**
 * 
 * Paginate a table.
 * This adds a list of page numbers which can be clicked to
 * access different pages. It does this by hiding all but a
 * slice of the rows of the actual table.
 * 
 * To start, we bind the 'repaginate' function to the table.
 *      This function finds all the tr elements in the table and 
 *      hides them.
 *      Then, it slices the array of rows and only takes a subset,
 *      representing the currently selected page.
 *      It then shows this subset.
 *      We trigger this immediately.
 * 
 * Next, we create a div containing our page buttons. 
 * For each possible page, we then add a span to the div
 * which shows the page number. Each span has the class 'clickable'
 * 
 * We bind a function for when the page span is clicked:
 *      The input of the click includes the data of the page number - 1
 *      We trigger the repaginate function but use the page number - 1 as our
 *      current page when calculating the rows to show.
 *      We add the class 'active' to the span  
 *      Then we remove the active class from all of its siblings
 * 
 * Lastly, we take the pager div and insert it before the table. Then, we take
 * the first 
 * 
 * @param {*} element
 * This is a table that must be paginated. 
 */
function paginate(element) {

    var currentPage = 0;
    var numPerPage = 5;
    var jQuerytable = jQuery(element);
    jQuerytable.bind('repaginate', function () {
        jQuerytable.find('tbody tr').hide().slice(currentPage * numPerPage, (currentPage + 1) * numPerPage).show();
    });
    jQuerytable.trigger('repaginate');

    var numRows = jQuerytable.find('tbody tr').length;
    var numPages = Math.ceil(numRows / numPerPage);
    var div = '<div id="pagers_'.concat(element.id, '" class="pager"></div>');
    var jQuerypager = jQuery(div);

    for (var page = 0; page < numPages; page++) {
        jQuery('<span class="page-number" id="page_numbers_'.concat(element.id.replace("#", ""), page + 1, '"></span>')).text(page + 1).bind('click', {
            newPage: page
        }, function (event) {
            currentPage = event.data['newPage'];
            jQuerytable.trigger('repaginate');
            jQuery(this).addClass('active').siblings().removeClass('active');
        }).appendTo(jQuerypager).addClass('clickable');
    }

    jQuerypager.insertBefore(jQuerytable).find('span.page-number:first').addClass('active');
}

/**
 * wrapper function for paginate
 *
 * @param {*} tableElem 
 * param for paginate
 * @returns 
 * original table that is now paginated.
 */
function repaginateTable(tableElem) {
    paginate(tableElem);
    return tableElem;
}

/**
 * 
 * refreshes the given table.
 * 
 * @param {*} curID 
 */
function refreshPages(curID) {
    jQuery(":animated").promise().done(function () {
        var currentPage = 0;
        var numPerPage = 5;
        var jQuerytable = jQuery('#'.concat(curID.replace("non", "inc")));
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
