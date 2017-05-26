/**
 * Created by dante on 16-3-8.
 */

/*jqGrid所需数据的接口*/
var IjqGridRender = new Interface('IjqGridRender', ['getColModel', 'getColName', 'getDefaultFilters',
    'getFileName', 'getDefaultSort', 'getTimetype', 'getLineChartsLabel', 'getTimePeriod', 'isSearchable',
    'getGatherLabels']);


// 销毁已有的jqgrid
function destroyGrid() {
    if ($("#grid-table").length > 0) {
        $("#grid-table").jqGrid("clearGridData");
        $("#grid-table").jqGrid('GridDestroy');
        $("#grid-table").remove();
        $('#grid_container').empty();
        $('#range-time-area').empty();
        $('#collectBtn').empty();
    }
    // 销毁已有的highchart-----TODO mybe better
    if (jQuery("#highChartArea").length > 0) {
        jQuery("#highChartArea").empty();
        jQuery("#highChartArea").removeAttr('style');
    }
}

//显示分页的按钮
function updatePagerIcons(table) {
    var replacement =
    {
        'ui-icon-seek-first': 'ace-icon fa fa-angle-double-left bigger-140',
        'ui-icon-seek-prev': 'ace-icon fa fa-angle-left bigger-140',
        'ui-icon-seek-next': 'ace-icon fa fa-angle-right bigger-140',
        'ui-icon-seek-end': 'ace-icon fa fa-angle-double-right bigger-140'
    };
    $('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon').each(function () {
        var icon = $(this);
        var $class = $.trim(icon.attr('class').replace('ui-icon', ''));

        if ($class in replacement) icon.attr('class', 'ui-icon ' + replacement[$class]);
    })
}

// 日期格式化函数
function fdayFormatter(cellvalue, options, rowObject) {
    //console.log(rowObject);
    //console.log(options);
    //return cellvalue;
    return cellvalue.split('T')[0];

}

// 将维度值转化器
function dimValueFormatter(cellvalue, options, rowObject) {
    if (cellvalue in dimTransferDicts[options.colModel.name]) {
        return dimTransferDicts[options.colModel.name][cellvalue];
    } else {
        return cellvalue;
    }
}

/**
 * 渲染jqgrid
 * @param containerArea jqgrid生成区域
 * @param renderInstance 实现IjqGridRender接口的实例
 */
function renderJqGrid(containerArea, renderInstance) {
    Interface.ensureImplements(renderInstance, IjqGridRender);
    destroyGrid();
    //注：时间类型选择的value和调用的函数名一致
    add_time_query(window[renderInstance.getTimetype()], renderInstance.getTimePeriod());

    var table = document.createElement('table');
    table.id = 'grid-table';
    jQuery(containerArea).append(table);
    var pager = document.createElement('div');
    pager.id = 'grid-pager';
    jQuery(containerArea).append(pager);

    // 默认不加载数据，采取toolbar驱动
    jQuery("#grid-table").jqGrid({
        url: "self_query/get_grid_data_table_query/",
        datatype: 'local',
        colModel: renderInstance.getColModel(),
        colNames: renderInstance.getColName(),
        postData: {filters: JSON.stringify(renderInstance.getDefaultFilters())},
        jsonReader: {
            repeatitems: false,
            root: "grid_data",             // 数据行（默认为：rows）
            page: "current_page",           // 当前页
            total: "total_page",    // 总页数
            records: "records",  // 总记录数
        },
        rowNum: 30,
        rowList: [30, 40, 50],
        //shrinkToFit: false,
        autowidth: true,
        height: "500",
        pager: "#grid-pager",
        sortname: renderInstance.getDefaultSort(),
        sortorder: "desc",
        caption: "data View",
        viewrecords: true,
        gridview: true,
        footerrow: renderInstance.getGatherLabels() ? true : false,
        userDataOnFooter: renderInstance.getGatherLabels() ? true : false,
        altRows: true,
        loadBeforeSend: function (jqXHR) {
            // ajax_isloading(jQuery(containerArea));
            //// 第一次加载，添加默认时间条件-------jqgrid 没有beforesearch的方法！！！

        },
        loadComplete: function (data) {
            // ajax_hideloading(jQuery(containerArea));
            var table = this;
            setTimeout(function () {
                updatePagerIcons(table);
            }, 0);

            // data为返回数据
            if (data.hasOwnProperty('grid_data') && data['grid_data'].length > 0) {
                //console.log(data['grid_data']);
                // 存在折线字段
                var lineChartsLabel = renderInstance.getLineChartsLabel();
                if (lineChartsLabel) {
                    var highChartInstance = new highChartsRender(data['grid_data'], lineChartsLabel);
                    // 设置区域大小
                    jQuery(highChartArea).css({
                        'min-width': '700px',
                        'height': '300px'
                    });
                    renderHighCharts(highChartInstance, highChartArea);
                }
            }


        },

    });
    //添加导出按钮
    jQuery("#grid-table")
        .navGrid('#grid-pager', {edit: false, add: false, del: false, search: false})
        .navButtonAdd('#grid-pager', {
            caption: "导出",
            buttonicon: "fa-cloud-download",
            onClickButton: function () {
                //导出文件
                var postData = jQuery("#grid-table").getGridParam("postData");
                jQuery.fileDownload('self_query/getCsvFile', {
                    data: {
                        filters: postData.filters,
                        sidx: postData.sidx,
                        sord: postData.sord,
                        fileName: renderInstance.getFileName(),
                        colNames: JSON.stringify(renderInstance.getColName()),
                        colModelNames: JSON.stringify(renderInstance.getColModelNames())
                    }
                });
            },
            position: "right"
        });


    // 添加查询toolbar
    jQuery("#grid-table").jqGrid('filterToolbar', {
        defaultSearch: true, stringResult: true,
        beforeSearch: function () {
            // toolbar的查询条件
            var postData = $("#grid-table").jqGrid('getGridParam', 'postData');
            var toolBar_filters = jQuery.parseJSON(postData.filters);
            // 添加新的时间筛选
            var timeStr = jQuery("#fday-range-picker").val();
            if (timeStr) {
                //TODO 优化
                var timeArray = timeStr.split(" - ");
                if (timeArray.length == 2) {
                    toolBar_filters.rules.push({field: "fdim_fday", op: "timerange", data: timeStr});
                }
                else if (timeArray.length == 1) {
                    toolBar_filters.rules.push({field: "fdim_fday", op: "eq", data: timeStr});
                }

            }
            toolBar_filters.rules = jQuery.merge(toolBar_filters.rules, renderInstance.getDefaultFilters().rules);
            postData['filters'] = JSON.stringify(toolBar_filters);
            // 添加汇总字段
            var gatherLabels = renderInstance.getGatherLabels();
            if (gatherLabels) {
                postData['gatherLabels'] = gatherLabels;//JSON.stringify(gatherLabels);
            }

            $("#grid-table").setGridParam({postData: postData});
            $("#grid-table").setGridParam({datatype: 'json'});
        },
        afterSearch: function () {
            //alert("after search");
            //var jqgridData = $('#grid-table').getGridParam('data');
            //console.log(jqgridData);
        }
    });
    jQuery("#grid-table").filterToolbar({});
    //首次显示数据
    jQuery('#grid-table')[0].triggerToolbar();
    // 没有需要筛选的维度 TODO better
    if (!renderInstance.isSearchable()) {
        jQuery(".ui-search-toolbar").hide();
    }


}





