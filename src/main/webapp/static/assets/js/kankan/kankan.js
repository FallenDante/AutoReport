/**
 * Created by dante on 16-3-25.
 */
/**
 * Created by dante on 16-3-7.
 */


//加载用户自定义查询--------这里绑定了mysql 记录id------TODO
function load_saved_sql_menu() {
    if ($("#2").length > 0) {
        $.ajax({
            method: "GET",
            url: "self_query/query_saved_sql/",
            success: function (data) {
                //$(".page-content-area").isLoading( "hide" );
                var opts = $.parseJSON(data).saved_sql;
                $("#2").empty();
                $.each(opts, function (i, d) {
                    html_str = "<li><a data-url='self_query/report_template.html?query_id=" + d.id + "' href='ajax.html#self_query/report_template.html?query_id=" + d.id + "'> <i class='menu-icon fa fa-caret-right'></i>" + d.note + " </a> <b class='arrow'></b> </li>";
                    jQuery("#2").append(html_str);
                });
            }
        });
    }

}

/**
 * 加载运营事件   TODO 时间驱动
 * @param function_id 模块id
 */
function renderOpEvent(function_id) {
    $.ajax({
        method: "GET",
        url: "syscms/renderOperationEvent/",
        data: {function: function_id},
        success: function (data) {
            //console.log(data);
            if (data.opEventsArray.length > 0) {
                $.each(data.opEventsArray, function (i, item) {
                    jQuery("#operation-event-area").append($("<font size='3' color='red'></font>").text(item.Events));
                });
            }

        }
    });
}


function ajax_isloading(jquery_obj) {
    jquery_obj.isLoading({text: "Loading", position: "overlay"});
}

function ajax_hideloading(jquery_obj) {
    jquery_obj.isLoading("hide");
}

/**
 * 去掉字符串两端空格
 * @param value
 * @returns {*|string|void|XML}
 */
function trimSpace(value) {
    return value.replace(/^\s+|\s+$/gm, '');
}

/**
 * 将数据库的时间格式化
 * @param value
 */
function timeStrFormat(value) {

    //return moment(value.split('T')[0]).format("MMMM Do");
    var dateStrArray = value.split('T')[0].split('-');

    return dateStrArray[1] + "月" + dateStrArray[2] + "日";
}


/*接口定义类*/
var Interface = function (name, methods) {
    if (arguments.length != 2) {
        throw new Error("Interface constructor called with " + arguments.length
            + "arguments ,but expected exactlly 2");
    }
    this.name = name;
    this.methods = [];
    for (var i = 0, len = methods.length; i < len; i++) {
        if (typeof methods[i] !== 'string') {
            throw  new Error("Interface constructor expects method names to be" +
                "passed in as a string.");
        }
        this.methods.push(methods[i]);
    }
};

/*检验实现该接口*/
Interface.ensureImplements = function (object) {
    if (arguments.length < 2) {
        throw new Error("Function Interface.ensureImplements called with"
            + arguments.length + "arguments,but expected at least 2.");
    }
    /*校验接口是否Interface*/
    for (var i = 1, len = arguments.length; i < len; i++) {
        var interface = arguments[i];
        if (interface.constructor !== Interface) {
            throw new Error("Function Interface.ensureImplements expects arguments" +
                "two and above to be instances of Interface");
        }

        /*校验实例对象的方法是否存在*/
        for (var j = 0, methodsLen = interface.methods.length; j < methodsLen; j++) {
            var method = interface.methods[j];
            if (!object[method] || typeof object[method] !== 'function') {
                throw new Error("Function methods not found:" + object[method]);
            }
        }
    }
};


