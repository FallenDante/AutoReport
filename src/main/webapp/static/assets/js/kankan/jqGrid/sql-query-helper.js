/**
 * Created by dante on 16-4-24.
 */
// 查询当前sql的数据
function query_sql_data(sql_clause, header) {
    // 获得对应sql 的jqgrid信息
    $.ajax({
        method: "GET",
        url: "self_query/get_grid_conf/",
        data: {sql_clause: sql_clause, header: header},
        success: function (data) {
            // 创建jqgrid
            var myfilter = {groupOp: "AND", rules: []};
            myfilter.rules.push({field: "sql_clause", op: "eq", data: sql_clause});
            destroyGrid();
            createGridAndPager(data.colModel, data.colName, myfilter)
        },
    });

}

// sql自助查询 创建jqgrid
function createGridAndPager(colModel, colName, filters) {
    var table = document.createElement('table');
    table.id = 'grid-table';
    $('#grid_container').append(table);
    var pager = document.createElement('div');
    pager.id = 'grid-pager';
    $('#grid_container').append(pager);
    //----------TODO fix!
    gridWidth = $("div.col-xs-12").width();
    jQuery("#grid-table").jqGrid({
        url: "self_query/get_grid_data_sql_query/",
        datatype: "json",
        colModel: colModel,
        colNames: colName,
        postData: {filters: JSON.stringify(filters)},
        jsonReader: {
            repeatitems: false,
            root: "grid_data",             // 数据行（默认为：rows）
            page: "current_page",           // 当前页
            total: "total_page",    // 总页数
            records: "records",  // 总记录数
        },
        rowNum: 30,
        rowList: [30, 50, 100],
        shrinkToFit: false,
        width: gridWidth,
        height: "500",
        pager: $("#grid-pager"),
        sortorder: "desc",
        caption: "data View",
        viewrecords: true,
        gridview: true,
        loadBeforeSend: function (jqXHR) {
            ajax_isloading($("#grid_container"));
        },
        loadComplete: function (data) {
            ajax_hideloading($("#grid_container"));
            var table = this;
            setTimeout(function () {
                updatePagerIcons(table);
            }, 0);
        },
    });
    // enable searchbool
    // 添加查询toolbar
    jQuery("#grid-table").jqGrid('filterToolbar', {
        defaultSearch: true, stringResult: true,
        beforeSearch: function () {
            // toolbar的查询条件
            var postData = $("#grid-table").jqGrid('getGridParam', 'postData');
            var toolBar_filters = jQuery.parseJSON(postData.filters);
            // 添加自定义sql
            //console.log(jQuery("#query_conf_sql").val());
            toolBar_filters.rules = jQuery.merge(toolBar_filters.rules, [{data: jQuery("#query_conf_sql").val()}]);
            //console.log(toolBar_filters.rules);
            postData['filters'] = JSON.stringify(toolBar_filters);
            $("#grid-table").setGridParam({postData: postData});
            $("#grid-table").setGridParam({datatype: 'json'});
        },

    });
    jQuery("#grid-table").filterToolbar({});
}
