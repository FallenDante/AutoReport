var queryTableSelector = "#target_table_dropdown";
var lableSelector = "#label_select";
var dimensionSelector = "#dimension_select";
var savedQuerySelector = "#saved_sql_dropdown";
var queryButton = "#self_query_query";
var insertButton = "#self_query_insert";
var queryNote = "#query_conf_note";
var callBackMenu = "#callback_menu";
var updateButton = "#self_query_update";
var deleteButton = "#self_query_delete";
var timetypeSelector = "input:radio[name=time_type_radio]";
var defaultSortSelector = "#default_sort__dropdown";
var detailDimSelector = "#detail_dimension";
var lineChartSelector = "#linechart_label";
var highChartArea = "#highChartArea";
var timePeriodArea = "#time_period";

// 维度转换集合(key-map)
var dimTransferDicts = {};
// 维度下拉框选项(key-array) TODO release
var dimSelectsArray = {};

/**
 * 阻塞加载维度下拉框选项。
 * 获得维表字典。将查询数据中的维度值进行转化
 * @param dimList 维度字段集合
 */
function syncLoadDimSelect(dimList) {

    $.each(dimList, function (i, key) {
        $.ajax({
            method: "GET",
            url: "self_query/preload_dimensions_select/",
            async: false,
            // 通过维度字段名映射维度表
            data: {dim_table: 'ftbl_' + key.substring(1, key.length)},
            success: function (data) {

                if (data.hasTbl) {
                    // 存在对应维度表
                    dimSelectArray = [];
                    dimTransferDict = {};
                    $.each(data.result_array, function (i, obj) {
                        dimTransferDict[obj.fkey] = obj.fnote;
                        dimSelectArray.push({
                            fkey: obj.fkey,
                            fnote: obj.fnote
                        });
                    });
                    dimSelectsArray[key] = dimSelectArray;
                    dimTransferDicts[key] = dimTransferDict;
                } else {
                    // 不存在对应维度表
                    dimSelectsArray[key] = [];
                    dimTransferDicts[key] = {};
                }

            }
        });
    });

}

// 获得对应维度表选择数据-----将fkey值转换为fnote展示
function getDimSelectHtml(key) {
    var targetDimArray = dimSelectsArray[key];
    var outStr = '';
    $.each(targetDimArray, function (i, item) {
        outStr += item.fkey + ":" + item.fnote + ";"
    });
    //console.log(outStr);
    return outStr.substring(0, outStr.length - 1);
}


/**
 * 设置范围时间
 * @param start
 * @param end
 */
function setDateRange(start, end) {
    $('#fday-range-picker').val(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));
}

/**
 * 添加时间选择框
 * @param datepicker_fun 时间控件生成函数
 *
 * 注：（datepicker_fun）函数名和input value 一致。从而解藕代码
 */
function add_time_query(datepicker_fun, time_period) {
    //加载控件生成函数
    if (typeof datepicker_fun === 'function') {
        var time_area = jQuery("#range-time-area");
        time_area.empty();
        var span = $('<span/>', {class: "input-group-addon", text: "日期"}).appendTo(time_area);
        var input = $('<input/>', {class: "form-control", type: "text", id: "fday-range-picker"}).appendTo(time_area);
        datepicker_fun('#fday-range-picker', time_period);
    }

}

/**
 * 添加范围时间-----有用，勿删
 * @param areaSelector 位置选择器
 * @param time_period 默认查询日期周期
 *
 */
function add_range_time(areaSelector, time_period) {
    //此 版本的daterangepicker存在bug,只能接受MM/DD/YYYY格式的字符串
    jQuery(areaSelector).daterangepicker({
        locale: {
            applyLabel: '查询',
            cancelLabel: '取消',
            format: 'MM/DD/YYYY'
        },
        startDate: moment(moment().subtract(time_period, 'days'), "MM/DD/YYYY"),
        endDate: moment(moment().subtract(1, 'days'), "MM/DD/YYYY")

    });
    //触发查询事件
    jQuery(areaSelector).on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD'));
        jQuery('#grid-table')[0].triggerToolbar();
    });
    //设置初始时间
    setDateRange(moment().subtract(time_period, 'days'), moment().subtract(1, 'days'));

}

/**
 * 添加单个时间-----有用，勿删
 * @param areaSelector 位置选择器
 *
 */

/**
 *  添加单个时间-----有用，勿删
 * @param areaSelector 位置选择器
 * @param time_period 对于单个时间没有用，只是用来统一函数参数
 */
function add_single_time(areaSelector, time_period) {

    jQuery(areaSelector).datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        todayHighlight: true,
    }).datepicker("setDate", moment().subtract(1, 'days').format('YYYY-MM-DD')) //默认昨天日期
        .on('changeDate', function (ev) {
            //日期改变事件
            //触发查询
            jQuery('#grid-table')[0].triggerToolbar();
            //alert(jQuery(areaSelector).val());
        });

}


/**
 * 将展示的fnote值还原为fkey
 * @param dimName 对应维度字段名称
 * @param fnote 该条记录维度字段的fnote
 */
function convertDimFnoteToFkey(dimName, fnote) {
    var targetDimArray = dimSelectsArray[dimName];
    var target = fnote;
    if (targetDimArray != undefined && targetDimArray.length > 0) {
        $.each(targetDimArray, function (i, item) {
            if (item.fnote == fnote) {
                target = item.fkey;
                return
            }
        });

    }

    return target;
}

/**
 * 从colModel对象数组中获得colModel名字数组（存储到数据库）
 * */
function getColModelNames(colModelArray) {

    var colModelNames = [];
    $.each(colModelArray, function (i, d) {
        colModelNames.push(d.name);
    });
    return colModelNames;
}

/**
 * 抓取统计字段信息
 * @returns {Array}
 */
function grep_stat_labels() {
    var stat_labels_area_list = jQuery("div[name='label_stat_select_area']");
    var stat_array = [];
    $.each(stat_labels_area_list, function (i, item) {
        stat_array.push({
            field1: jQuery(jQuery(item).find("select[name='label_stat_select1']")[0]).val(),
            op: jQuery(jQuery(item).find("select[name='label_stat_op']")[0]).val(),
            field2: jQuery(jQuery(item).find("select[name='label_stat_select2']")[0]).val(),
            note: jQuery(jQuery(item).find("input[name='stat_label_note']")[0]).val()
        })
    });
    return stat_array;
}

function grep_gather_labels() {
    var gather_labels_area_list = jQuery("div[name='gather_label_select_area']");
    var gather_array = [];
    $.each(gather_labels_area_list, function (i, item) {
        gather_array.push({
            field: jQuery(jQuery(item).find("select[name='gather_label_select']")[0]).val(),
            op: jQuery(jQuery(item).find("select[name='gather_label_op']")[0]).val()
        })
    });
    return gather_array.length == 0 ? '' : JSON.stringify(gather_array);


}


/**
 * 上面触发函数
 */
function collectEvent() {
    var pageInstance = new jqGridPage();
    var colModel = pageInstance.getColModel();
    var colModelNames = getColModelNames(colModel);
    $.ajax({
            method: "POST",
            url: "account/addUsrCol/",
            data: {
                username: jQuery("#userNameArea").text(),
                note: jQuery(queryNote).val(),
                addtime: moment().format('YYYY-MM-DD hh:mm:ss'),
                sql_clause: pageInstance.getSql(),
                header: JSON.stringify(pageInstance.getColName()),
                query_type: 'table_query',
                id: jQuery(savedQuerySelector).val(),
                colModelNames: JSON.stringify(colModelNames),
                statLabels: JSON.stringify(grep_stat_labels()),
                timetype: pageInstance.getTimetype(),
                defaultSort: pageInstance.getDefaultSort(),
                detailDim: jQuery(detailDimSelector).val(),
                chartLabel: jQuery(lineChartSelector).val()
            },
            success: function (msg) {
                alert("收藏成功!");

            }

        }
    );
}

/**
 * 添加收藏按钮
 */
function addCollectBtn() {
    jQuery("#collectBtn").empty();
    jQuery("#collectBtn").append($('<button class="btn  btn-light btn-sm" style="float: right" onclick="collectEvent()">  <i class="ace-icon fa fa-shopping-cart bigger-160"></i> 收藏 </button>'))
}
