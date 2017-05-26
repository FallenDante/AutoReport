/**
 * Created by dante on 16-4-22.
 */
/*根据服务器信息生成jqGrid,实现IjqGridRender接口*/
//var opts;// 从服务器接受的数据
var jqGridServer = function (dataOpts) {
    // 调用初始化函数

    //$.ajax({
    //    method: "GET",
    //    url: "self_query/table_query_sql_by_pk/",
    //    data: {id: query_id},
    //    async: false,
    //    beforeSend: ajax_isloading($(".form-horizontal")),
    //    success: function (data) {
    //        ajax_hideloading($(".form-horizontal"));
    //        opts = $.parseJSON(data);
    //        if (opts.hasObj == false) {
    //            alert("不存在该报表！");
    //            return false;//TODO test
    //        }
    //    }
    //});
    //
    this.callBackOpts = dataOpts;// 注意闭包的影响
    this.init();

};

jqGridServer.prototype = {
    init: function () {
        this.preloadDim();

    },
    // 预先加载dim下拉列表，转换使用
    preloadDim: function () {
        var dimensionOpts = this.callBackOpts.dim_array;
        //剔除fdim_fday,再加载维度下拉框
        syncLoadDimSelect(dimensionOpts.slice(1));
    },

    getColModel: function () {
        return createColModelObjs(JSON.parse(this.callBackOpts.colModelNames), this.callBackOpts.detailDim);
        //加载指标

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
    getColName: function () {
        return jQuery.parseJSON(this.callBackOpts.header);
    },
    getDefaultFilters: function () {
        var myfilter = {rules: []};
        //若存在下转字段，默认为all
        if (this.callBackOpts.detailDim.length > 0) {
            myfilter.rules.push({field: this.callBackOpts.detailDim, op: "eq", data: 'all'});
        }
        //默认sql查询条件
        myfilter.rules.push({field: "sql_clause", op: "eq", data: this.callBackOpts.sql_clause});
        return myfilter;
    },
    getFileName: function () {
        return this.callBackOpts.note
    },
    getDefaultSort: function () {
        return this.callBackOpts.defaultSort
    },
    getTimetype: function () {

        return this.callBackOpts.timetype
    },
    getLineChartsLabel: function () {
        return this.callBackOpts.chartLabel
    },
    getTimePeriod: function () {
        return this.callBackOpts.time_period
    },
    isSearchable: function () {
        var colModelNames = JSON.parse(this.callBackOpts.colModelNames);
        for (var i = 0; i < colModelNames.length; i++) {
            if (colModelNames[i] != 'fdim_fday' && colModelNames[i].indexOf("fdim_") > -1) {
                return true;
            }
        }
        return false;
    },
    getGatherLabels: function () {
        return this.callBackOpts.gatherLabels;
    }

};

/**
 * 下转字段详情页面的赋值器
 * @param dataOpts jqgrid配置数据
 */
var jqGridServerDetail = function (dataOpts) {
    this.dataOpts = jQuery.parseJSON(dataOpts);
    //console.log(this.dataOpts);
    this.init();
};

jqGridServerDetail.prototype = {
    init: function () {
        this.preloadDim();
    },
    preloadDim: function () {
        //预先加载维度字段
        //console.log("预先加载维度下拉框");
        //console.log(this.dataOpts.dim_array);
        syncLoadDimSelect(this.dataOpts.dim_array);
    },
    getColModel: function () {
        return createColModelObjs(this.dataOpts.colModelName, null)
    },
    getColName: function () {
        return this.dataOpts.colName;
    },
    getDefaultFilters: function () {
        return this.dataOpts;
    },
    getFileName: function () {
        return this.dataOpts.fileName;
    },
    getDefaultSort: function () {

    },
    getTimetype: function () {

    },
    getSql: function () {
        return this.dataOpts.sql_clause;
    },
    getLineChartsLabel: function () {
        return false;//TODO
    }


};

var jqGridServerCollection = function () {

};


/**
 * 创建colmodel对象集合数据
 * @param colModelName colModel名称
 */
function createColModelObjs(colModelName, detailDim) {
    //加载指标
    var colModel = [];
    $.each(colModelName, function (i, d) {
        // 默认日期
        if (d == 'fdim_fday') {
            colModel.push({
                name: 'fdim_fday',
                stype: 'text',
                search: false,
                align: 'center',
                formatter: fdayFormatter
                //searchoptions: {sopt: ['timerange'], dataInit: dateRangePick}
            });
            return
        }
        // 若是下转字段，添加formatter处理逻辑
        if (d == detailDim) {
            colModel.push({
                name: d,
                stype: 'text',
                align: 'center',
                search: false,
                formatter: detailDimServerFormatter,
            });
        }
        else if (d.indexOf("fdim_") > -1) {
            //维度加载-----没有对应的维度字段或者维度字段对应集合为空
            if (!(d in dimSelectsArray) || Object.keys(dimSelectsArray[d]).length === 0) {
                // 没有对应的维度表，模糊查询
                colModel.push({
                    name: d,
                    stype: 'text',
                    align: 'center',
                    //formatter: dimValueFormatter,
                    searchoptions: {
                        sopt: ['like'],
                    }
                });
            } else {
                // 有对应的维表
                colModel.push({
                    name: d,
                    stype: 'select',
                    align: 'center',
                    formatter: dimValueFormatter,
                    searchoptions: {
                        sopt: ['eq'],
                        value: getDimSelectHtml(d)
                        //dataUrl: 'self_query/load_dimensions_select/?dim_table=ftbl_' + key.substring(1, key.length)
                    }
                });
            }
        } else {
            // 指标加载
            colModel.push({
                name: d,
                search: false,
                align: 'center',
                formatter: 'integer',
                formatoptions: {thousandsSeparator: ','}
            });

        }


    });
    return colModel;
}

// 下转字段formatter
function detailDimServerFormatter(cellvalue, options, rowObject) {
    return "<a href='javascript:void(0)' onclick='detailDimServer(this)'>详情</a>"
}

/**
 * 下转字段的触发函数---跳转到详情页面
 * @param rowObject
 */
function detailDimServer(rowObject) {
    //TODO  correct
    //var jqgridRender = new jqGridServerDetail();
    var colModelName = jQuery.parseJSON(opts.colModelNames);
    // 当前tr行所有td  ----innerText
    var tdRows = jQuery(rowObject).parent().parent().children();
    // 下转字段位置
    var cellIndex = $(rowObject).closest('td')[0].cellIndex;

    var myfilter = {rules: []};
    // 其他维度筛选条件
    for (var i = 0; i < colModelName.length; i++) {
        if (colModelName[i].indexOf("fdim_") > -1) {
            if (i == cellIndex) {
                // 若存在下转字段，过滤掉all
                myfilter.rules.push({field: colModelName[i], op: "ne", data: 'all'});
                continue
            }

            //保存其他维度筛选条件
            myfilter.rules.push({
                field: colModelName[i],
                op: "eq",
                data: convertDimFnoteToFkey(colModelName[i], tdRows[i].innerText)
            });
        }
    }
    //sql语句：
    myfilter.rules.push({field: "sql_clause", op: "eq", data: opts.sql_clause});
    myfilter['colName'] = jQuery.parseJSON(opts.header);
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
    myfilter['fileName'] = opts.note;
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
