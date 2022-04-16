function customSerialize(arr) {
    if (arr.length == 0) {
        return "";
    }
    var ret = 'a:';
    ret = ret.concat(arr.length, ':{');

    for (let i = 0; i < arr.length; i++) {
        ret = ret.concat('i:', i, ';s:', arr[i].length, ':\"', arr[i], '\";');
    }

    ret = ret.concat('}');
    return ret;
}

function getTFName(str) {
    var arr = {
        'table_General_non': 'field_srv-glb-qst-dyn',
        'table_Course_non': 'field_srv-crs-qst-dyn',
        'table_Lecturer_non': 'field_srv-lct-qst-dyn',
        'table_General_inc': 'field_srv-glb-qst-dyn',
        'table_Course_inc': 'field_srv-crs-qst-dyn',
        'table_Lecturer_inc': 'field_srv-lct-qst-dyn'
    };
    return arr[str];
}


function reload(id) {
    var container = document.getElementById(id);
    var content = container.innerHTML;
    container.innerHTML = content;

    //this line is to watch the result in console , you can remove it later	
    console.log("Refreshed");
}

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

function paginate(index, element) {
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

function repaginate(tableElem) {
    paginate(tableElem);
    return tableElem;
}