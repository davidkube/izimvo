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