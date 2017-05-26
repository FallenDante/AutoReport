/**
 * Created by dante on 16-4-22.
 */



/*根据页面信息生成jqGrid,实现IjqGridRender接口*/
var jqGridPage = function () {
    // 调用初始化函数
    this.init();
};

jqGridPage.prototype = {

    // 初始化函数
    init: function () {
        this.preloadDim();
    },

    // 获得jqgrid 的colmodel对象数组
    getColModel: function () {
        var colModelObjects = [];
        // 默认时间-----------------
        colModelObjects.push({
            name: 'fdim_fday',
            stype: 'text',
            search: false,
            align: 'center',
            formatter: fdayFormatter
        });
        // 添加选择维度
        var dimensionOpts = jQuery("#dimensions_area .search-choice");
        var detailDimension = jQuery(detailDimSelector).val(); // 下转字段
        $.each(dimensionOpts, function (i, d) {
            index = d.children[1].getAttribute("data-option-array-index");
            var key = jQuery("#dimension_select option").eq(index).val();

            // 若是下转字段，添加formatter处理逻辑
            if (key == detailDimension) {
                colModelObjects.push({
                    name: key,
                    stype: 'text',
                    align: 'center',
                    search: false,
                    formatter: detailDimPageFormatter,
                });
            }
            else if (Object.keys(dimSelectsArray[key]).length === 0) {
                // 没有对应的维度表，模糊查询
                colModelObjects.push({
                    name: key,
                    stype: 'text',
                    align: 'center',
                    //formatter: dimValueFormatter,
                    searchoptions: {
                        sopt: ['like'],
                    }
                });
            } else {
                // 有对应的维表
                colModelObjects.push({
                    name: key,
                    stype: 'select',
                    align: 'center',
                    formatter: dimValueFormatter,
                    searchoptions: {
                        sopt: ['eq'],
                        value: getDimSelectHtml(key)
                        //dataUrl: 'self_query/load_dimensions_select/?dim_table=ftbl_' + key.substring(1, key.length)
                    }
                });
            }
        });
        // 添加指标
        var labelsOpts = jQuery("#labels_area .search-choice");
        $.each(labelsOpts, function (i, d) {
            //colName.push(d.children[0].innerHTML);
            index = d.children[1].getAttribute("data-option-array-index");
            var key = jQuery("#label_select option").eq(index).val();
            if (key.indexOf("ffact_") >= 0) {
                colModelObjects.push({
                    name: key,
                    search: false,
                    align: 'center',
                    formatter: 'integer',
                    formatoptions: {thousandsSeparator: ','}
                });
            }
        });
        // 添加统计指标（colModel和sql中的字段不一样）
        var stat_label_area_opts = jQuery("div[name='label_stat_select_area']");
        $.each(stat_label_area_opts, function (i, item) {
            var selector1 = jQuery(item).find("select[name='label_stat_select1']")[0];
            var selector2 = jQuery(item).find("select[name='label_stat_select2']")[0];
            var colModelName = jQuery(selector1).val() + "_" + jQuery(selector2).val();
            colModelObjects.push({
                name: colModelName,
                search: false,
                align: 'center',
                // TODO ???
            });
        });

        //TODO 历史记录选项
        return colModelObjects;

    },
    // 获得colModel的字段名称数组
    getColModelNames: function () {
        var colModel = this.getColModel();
        var colModelNames = [];
        for (var i = 0; i < colModel.length; i++) {
            colModelNames.push(colModel[i].name);
        }
        return colModelNames;

    },
    // 获得jqgrid 的colName
    getColName: function () {
        var colName = [];
        colName.push('日期');
        var dimensionOpts = jQuery("#dimensions_area .search-choice");
        // 添加维度
        $.each(dimensionOpts, function (i, d) {
            colName.push(d.children[0].innerHTML);
        });
        // 添加指标
        var labelsOpts = jQuery("#labels_area .search-choice");
        $.each(labelsOpts, function (i, d) {
            colName.push(d.children[0].innerHTML);
        });

        // 添加统计指标（colModel和sql中的字段不一样）
        var stat_label_area_opts = jQuery("div[name='label_stat_select_area']");
        $.each(stat_label_area_opts, function (i, item) {
            colName.push(jQuery(jQuery(item).find("input[name='stat_label_note']")[0]).val());
        });
        //TODO 历史记录选项
        return colName

    },
    // 定义默认的查询条件
    getDefaultFilters: function () {
        var myfilter = {groupOp: "AND", rules: []};
        var detailDimension = jQuery(detailDimSelector).val(); // 下转字段
        if (detailDimension.length > 0) {
            //若存在下转字段默认为all
            myfilter.rules.push({field: detailDimension, op: "eq", data: 'all'});

        }
        myfilter.rules.push({field: "sql_clause", op: "eq", data: this.getSql()});
        return myfilter;
    },
    // 当前文件名(for download)
    getFileName: function () {
        return jQuery("#query_conf_note").val();
    },

    // 默认排序字段
    getDefaultSort: function () {
        return jQuery(defaultSortSelector).val();
    },

    // 预先加载dim下拉列表，转换使用
    preloadDim: function () {
        //var dimensionOpts = jQuery("#dimensions_area .search-choice");
        var dimList = [];
        $.each(jQuery("#dimensions_area .search-choice"), function (i, d) {
            index = d.children[1].getAttribute("data-option-array-index");
            dimList.push(jQuery("#dimension_select option").eq(index).val());
        });
        syncLoadDimSelect(dimList);
    },

    // 获得sql条件
    getSql: function () {
        var sql = 'select fdim_fday,';
        // 添加选择维度
        var dimensionOpts = jQuery("#dimensions_area .search-choice");
        $.each(dimensionOpts, function (i, d) {
            index = d.children[1].getAttribute("data-option-array-index");
            sql += jQuery("#dimension_select option").eq(index).val() + ",";
        });
        // 添加指标
        var labelsOpts = jQuery("#labels_area .search-choice");
        $.each(labelsOpts, function (i, d) {
            index = d.children[1].getAttribute("data-option-array-index");
            sql += jQuery("#label_select option").eq(index).val() + ",";
        });
        // 添加统计指标（colModel和sql中的字段不一样）
        var stat_label_area_opts = jQuery("div[name='label_stat_select_area']");
        $.each(stat_label_area_opts, function (i, item) {
            var selector1 = jQuery(item).find("select[name='label_stat_select1']")[0];
            var selector2 = jQuery(item).find("select[name='label_stat_select2']")[0];
            var colModelName = jQuery(selector1).val() + "_" + jQuery(selector2).val();
            if (jQuery(jQuery(item).find("select[name='label_stat_op']")[0]).val() == 'division') {
                sql += 'round((' + jQuery(selector1).val() + '/' + jQuery(selector2).val() + '),2) ' + colModelName + ',';
            }
        });

        sql = sql.substring(0, sql.length - 1);
        sql += " from " + jQuery("#target_table_dropdown").val();
        return sql;
    },

    // 获得显示时间类型
    getTimetype: function () {
        return jQuery("input[name='time_type_radio']:checked").val();
    },

    // 获得linechart 指标
    getLineChartsLabel: function () {
        return jQuery(lineChartSelector).val();
    },

    getQueryType: function () {
        return
    },

    getTimePeriod: function () {
        return jQuery(timePeriodArea).val();
    },

    isSearchable: function () {
        var colModelNames = this.getColModelNames();
        for (var i = 0; i < colModelNames.length; i++) {
            if (colModelNames[i] != 'fdim_fday' && colModelNames[i].indexOf("fdim_") > -1) {
                return true;
            }
        }
        return false;
    },
    getGatherLabels: function () {

        var gather_labels_area_list = jQuery("div[name='gather_label_select_area']");
        var gather_array = [];
        $.each(gather_labels_area_list, function (i, item) {
            gather_array.push({
                field: jQuery(jQuery(item).find("select[name='gather_label_select']")[0]).val(),
                op: jQuery(jQuery(item).find("select[name='gather_label_op']")[0]).val()
            })
        });
        return gather_array.length == 0 ? '' : JSON.stringify(gather_array);
    },

    destroy: function () {

    }

};

// 下转字段formatter
function detailDimPageFormatter(cellvalue, options, rowObject) {
    return "<a href='javascript:void(0)' onclick='detailDimPage(this)'>详情</a>"
}

/**
 * 下转字段的触发函数---跳转到详情页面
 * @param rowObject
 */
function detailDimPage(rowObject) {
    //TODO 单例模式
    var jqgridRender = new jqGridPage();
    var colModel = jqgridRender.getColModel();
    // 当前tr行所有td  ----innerText
    var tdRows = jQuery(rowObject).parent().parent().children();
    // 下转字段位置
    var cellIndex = $(rowObject).closest('td')[0].cellIndex;

    var myfilter = {rules: []};
    for (var i = 0; i < colModel.length; i++) {
        if (colModel[i].name.indexOf("fdim_") > -1) {
            if (i == cellIndex) {
                // 下转字段过滤掉all
                myfilter.rules.push({field: colModel[i].name, op: "ne", data: 'all'});
                continue
            }
            //保存维度筛选条件
            myfilter.rules.push({
                field: colModel[i].name,
                op: "eq",
                data: convertDimFnoteToFkey(colModel[i].name, tdRows[i].innerText)
            });
        }
    }
    //sql语句：
    myfilter.rules.push({field: "sql_clause", op: "eq", data: jqgridRender.getSql()});
    myfilter['colName'] = jqgridRender.getColName();
    var colModelName = [];
    for (var i = 0; i < colModel.length; i++) {
        colModelName.push(colModel[i].name);
    }
    myfilter['colModelName'] = colModelName;
    //需要加载的维度字段（剔除时间和下转字段）
    var dim_array = [];
    for (var i = 0; i < colModelName.length; i++) {
        //剔除时间
        if (colModelName[i].indexOf("fdim_fday") > -1) {
            continue
        }
        //剔除下转字段
        if (i == cellIndex) {
            continue
        }
        if (colModelName[i].indexOf("fdim_") > -1) {
            dim_array.push(colModelName[i]);
        }
    }
    myfilter['dim_array'] = dim_array;
    myfilter['fileName'] = jqgridRender.getFileName();
    // 默认前缀：http://localhost:8000/kankan_report/
    // 提交表格
    var form = document.createElement("form");
    var element1 = document.createElement("input");
    form.method = "POST";
    form.action = "ajax.html#self_query/detail_dim_template/";
    form.target = "_blank";
    element1.value = JSON.stringify(myfilter);
    element1.name = "commonData";
    form.appendChild(element1);
    document.body.appendChild(form);

    form.submit();

}


/*详情字段取值器*/
//var jqGridPageDetail = new function () {
//    // 页面原始取值器
//    this.jqGridPage = new jqGridPage();
//    this.init();
//};
//jqGridPageDetail.prototype = {
//    init: function () {
//
//    },
//    getColModel: function () {
//
//    },
//    getColName: function () {
//
//    },
//    getDefaultFilters: function () {
//
//    },
//    getFileName: function () {
//
//    },
//    getDefaultSort: function () {
//
//    },
//    getTimetype: function () {
//
//    }
//
//};