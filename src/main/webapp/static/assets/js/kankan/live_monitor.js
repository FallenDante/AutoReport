/**
 * Created by dante on 16-6-7.
 */
//function load_player(live_id) {
//    // 加载播放器-------
//    $.get("livemonitor/player_tag.html", {live_id: live_id}, function (data) {
//        $("#player_area").html(data);
//    });
//}

function load_source_player(live_id) {
    // 加载播放器-------
    $.get("livemonitor/player_source_tag.html", {live_id: live_id}, function (data) {
        $("#player_area").html(data);
    });

}

function load_leaf_player(live_id) {
    // 加载播放器-------
    $.get("livemonitor/player_leaf_tag.html", {live_id: live_id}, function (data) {
        $("#player_area").html(data);
    });

}

/**
 * 加载当前实时数据--------
 * @param live_id
 */
function load_live_data(live_id) {
    //
    //$.get("livemonitor/live_now_tag.html", {live_id: live_id}, function (data) {
    //    $("#live_now_area").html(data);
    //});
    $.ajax({
        url: "livemonitor/live_now_tag.html",
        type: "get",
        async: false,
        data: {live_id: live_id},
        success: function (data) {
            $("#live_now_area").html(data);
        },
        error: function () {
        }
    });
}

function load_live_history(live_id, active_flag) {
    // 加载直播历史数据--------
    //$.get("livemonitor/live_history_tag.html", {live_id: live_id, 'active': active_flag}, function (data) {
    //    $("#live_history_area").html(data);
    //});

    $.ajax({
        url: "livemonitor/live_history_tag.html",
        type: "get",
        data: {live_id: live_id, 'active': active_flag},
        success: function (data) {
            $("#live_history_area").html(data);
        },
        error: function () {
        }
    });
}
var stock_lock, timeclock;
function clearArea() {
    $("#player_area").empty();
    $("#live_now_area").empty();
    $("#live_history_area").empty();
    //$("#button_area").empty();
    window.clearInterval(stock_lock);
    window.clearInterval(timeclock);

}

function is_saved_change(obj, live_id) {
    //这里只能用prop访问
    var is_saved = jQuery(obj).prop('checked') ? 1 : 0;
    $.ajax({
        url: 'livemonitor/save_live_change/',
        method: "POST",
        data: {'live_id': live_id, 'is_saved': is_saved},
        success: function (data) {
            alert("修改成功");
        },
        error: function () {
            alert("Error with AJAX callback");
        }
    });


}

/***
 * 加载监控的数据页面
 * @param live_id
 */
function load_monitor_page(live_id) {
    //若是正在直播，需要加载预览页面和实时数据
    clearArea();
    if (jQuery("#page_type").val() == 'live_now') {
        load_live_data(live_id);
        load_live_history(live_id, 'True');
        // 前面两个async:false ，为了获得最近的一条记录，计算推流时长
        load_player(live_id);
    }
    else if (jQuery("#page_type").val() == 'live_history') {
        load_live_history(live_id, 'True');
    }

    //jQuery("#button_area").append("<button class='btn btn-white btn-default btn-round' style='float:right'  onclick=clearArea()> <i class='ace-icon fa fa-times red2'></i> 关闭 </button><p clear:both;> </p>")
    //jQuery("#button_area").append("<p clear:both;> </p>");
}

/**
 * 监控播放源数据
 * @param live_id
 */
function load_source_monitor_page(live_id) {
    //若是正在直播，需要加载预览页面和实时数据
    clearArea();
    if (jQuery("#page_type").val() == 'live_now') {
        load_live_data(live_id);
        load_live_history(live_id, 'True');
        // 前面两个async:false ，为了获得最近的一条记录，计算推流时长
        load_source_player(live_id);
    }
    else if (jQuery("#page_type").val() == 'live_history') {
        load_live_history(live_id, 'True');
    }

    //jQuery("#button_area").append("<button class='btn btn-white btn-default btn-round' style='float:right'  onclick=clearArea()> <i class='ace-icon fa fa-times red2'></i> 关闭 </button><p clear:both;> </p>")
    //jQuery("#button_area").append("<p clear:both;> </p>");
}

function load_leaf_monitor_page(live_id) {
    clearArea();
    if (jQuery("#page_type").val() == 'live_now') {
        load_leaf_player(live_id);
    }
    else if (jQuery("#page_type").val() == 'live_history') {
        load_live_history(live_id, 'True');
    }

    //jQuery("#button_area").append("<button class='btn btn-white btn-default btn-round' style='float:right'  onclick=clearArea()> <i class='ace-icon fa fa-times red2'></i> 关闭 </button><p clear:both;> </p>")


}


/**
 * 删除直播记录和相关的监控记录
 * @param live_id
 */
function del_live_monitor_record(live_id) {
    var res = confirm("确定删除？该条直播流的监控记录会被删除！");
    if (res == true) {
        $.ajax({
            url: "livemonitor/del_live_record",
            type: "POST",
            data: {live_id: live_id},
            success: function (data) {
                $('#grid-table').trigger('reloadGrid');
            },
            error: function () {
            }
        });
    } else {
        return
    }
}

//function stop_live(app, live_name) {
//    var res = confirm("确定终止？该条直播流会被终止！");
//    if (res == true) {
//        //$.ajax({
//        //    url: "livemonitor/del_live_record",
//        //    type: "POST",
//        //    data: {live_id: live_id},
//        //    success: function (data) {
//        //        $('#grid-table').trigger('reloadGrid');
//        //    },
//        //    error: function () {
//        //    }
//        //});
//        $.ajax({
//            url: "livemonitor/stop_live",
//            type: "POST",
//            data: {app: app, stream: live_name},
//            success: function (data) {
//                alert("停止成功！")
//            },
//            error: function () {
//                alert("操作失败！")
//            }
//        });
//    } else {
//        return
//    }
//}


/**
 * dialog显示修改当前阈值
 * @param live_id
 */
function modify_threshold(live_id, threshold_str) {
    // 设置当前直播流的id,用来后面交互
    jQuery("#threshold_live_id").val(live_id);
    jQuery("#video_bitrate").val(threshold_str);
    dialog.dialog("open");

}


/**
 * formatter调用函数，需要先通过外部js加载到html，这里可能是由于ace的机制，待研究
 * @param cellvalue
 * @param options
 * @param rowObject
 * @returns {string}
 */
function monitor_data_formatter(cellvalue, options, rowObject) {
    //TODO fix 此处jqgrid调用两次，其中一次为title
    if (rowObject['live_id'] != undefined) {
        // 查看按钮
        //var html_str = "<button class='btn btn-info' style='border:None' onclick=load_monitor_page('" + rowObject['live_id'] + "')>查看</button>&nbsp&nbsp";
        var html_str = "<button class='btn btn-info' style='border:None' onclick=load_source_monitor_page('" + rowObject['live_id'] + "')>查看源</button>&nbsp&nbsp";
        html_str += "<button class='btn btn-info' style='border:None' onclick=load_leaf_monitor_page('" + rowObject['live_id'] + "')>查看边缘</button><br>";
        // 终止直播流
        if (jQuery('#admin_flag').val() == 'True') {
            // 清空数据按钮
            html_str += "<button class='btn btn-warning' style='border:None' onclick=del_live_monitor_record('" + rowObject['live_id'] + "')>清空数据</button>&nbsp&nbsp";
            //html_str += "<button class='btn btn-danger' style='border:None' onclick=stop_live('" + rowObject['app'] + "','" + rowObject['live_name'] + "')>终止</button>";

        }

        return html_str;
    }

}

/**
 * 实时直播流阈值格式化函数
 * @param cellvalue
 * @param options
 * @param rowObject
 */
function threshold_live_formatter(cellvalue, options, rowObject) {
    var html_str = '';
    var thresholds = '';
    if (cellvalue != '') {
        // 判断是否有阈值
        var thresholdsJson = jQuery.parseJSON(cellvalue);
        html_str = html_str + "视频阈值：" + thresholdsJson['video_bitrate'] + "</br>";
        // 阈值的形式为x:y:z
        thresholds = thresholdsJson['video_bitrate']
    }
    if (jQuery('#admin_flag').val() == 'True') {
        // 直播管理员权限
        html_str = html_str + "<button id='modify_threshold' onclick=modify_threshold('" + rowObject['live_id'] + "','" + thresholds + "')>修改阈值</button>";
    }
    return html_str;

}

function monitor_history_formatter(cellvalue, options, rowObject) {
    if (rowObject['live_id'] != undefined) {
        var html_str = "<button class='btn btn-info' style='border:None' onclick=load_source_monitor_page('" + rowObject['live_id'] + "')>查看</button>&nbsp&nbsp";
        // 删除按钮
        // 终止直播流
        if (jQuery('#admin_flag').val() == 'True') {
            html_str += "<button class='btn btn-warning' style='border:None' onclick=del_live_monitor_record('" + rowObject['live_id'] + "')>清空数据</button>";
        }
        return html_str;
    }

}


/**
 * 该直播流是否保存
 * @param cellvalue
 * @param options
 * @param rowObject
 * @returns {string}
 */
function save_live_formatter(cellvalue, options, rowObject) {
    //TODO fix 此处jqgrid调用两次，其中一次为title
    if (rowObject['live_id'] != undefined) {
        //该条直播流是否保存
        if (rowObject['is_saved'] == 0) {
            return "<label><input name='is_saved_checkbox' class='ace ace-switch ace-switch-6' type='checkbox'   onclick=is_saved_change(this,'" + rowObject['live_id'] + "') /><span class='lbl'></span> </label>";
        } else {
            return "<label><input name='is_saved_checkbox' class='ace ace-switch ace-switch-6' type='checkbox' checked='checked' onclick=is_saved_change(this,'" + rowObject['live_id'] + "') /><span class='lbl'></span> </label>";
        }
    }
}


var app_list_str;
var app_dict = {};
/**
 * 预先加载sdk列表
 */
function pre_load_app() {
    $.ajax({
        url: 'livemonitor/load_app_list/',
        method: "GET",
        async: false,
        success: function (data) {
            //console.log(data);
            var sdk_list = data['app_list'];
            app_list_str = "-1:All;";
            // 转为dict
            for (var i = 0; i < sdk_list.length; i++) {
                app_dict[sdk_list[i]['app']] = sdk_list[i]['name'];
                app_list_str += sdk_list[i]['app'] + ":" + sdk_list[i]['app'] + "(" + sdk_list[i]['name'] + ");";
            }
            app_list_str = app_list_str.substring(0, app_list_str.length - 1);
            //console.log(ip_list_str);
        },
        error: function () {
            alert("Error with AJAX callback");
        }
    });

}


function ap_formatter(cellvalue, options, rowObject) {
    return cellvalue + "(" + app_dict[cellvalue] + ")";
}

/**
 * 最后一条推流数据的时间，用来显示推流时长，范围是总体播放历史时间
 * @type {number}
 */
var last_record_time_stamp = 0;


