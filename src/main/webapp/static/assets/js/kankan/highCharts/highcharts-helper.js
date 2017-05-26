/**
 * Created by dante on 16-5-4.
 */
/*highcharts数据采集的接口*/
var IhighChartsRender = new Interface('IhighChartsRender', ['getTitle', 'getSubtitle', 'getXAxis',
    'getYAxis', 'getTooltip', 'getLegend', 'getSeries']);


/**
 * 依赖当前的jqgrid数据绘图,取值器
 * @param grid_data 当前页数据
 * @param lineChartLabel 折线字段
 */
var highChartsRender = function (grid_data, lineChartLabel) {
    this.grid_data = grid_data;
    this.lineChartLabel = lineChartLabel;
    this.lineName = lineChartLabel;// 默认值，init函数中初始化
    this.colModel = $("#grid-table").jqGrid('getGridParam', 'colModel');
    this.colNames = $("#grid-table").jqGrid('getGridParam', 'colNames');
    this.init();

};
highChartsRender.prototype = {
    init: function () {
        //获得折线字段名
        for (var i = 0; i < this.colModel.length; i++) {
            if (this.colModel[i]['name'] == this.lineChartLabel) {
                this.lineName = this.colNames[i];
                break;
            }
        }

        // 获得展示下标间隔
        this.interval = Math.floor(this.grid_data.length / 8 > 1 ? this.grid_data.length / 8 : 1);


    },
    getTitle: function () {
        return {
            text: '',
            x: -20 //center
        }
    },
    getSubtitle: function () {
        return '';
    },
    getXAxis: function () {
        var xAxisArray = [];

        for (var i = this.grid_data.length - 1; i >= 0; i--) {
            xAxisArray.push(timeStrFormat(this.grid_data[i]['fdim_fday']));
        }

        return {
            categories: xAxisArray,
            labels: {
                step: this.interval
            },
            // 去掉横坐标的栏杆
            tickLength: 0
        }

    },
    getYAxis: function () {
        return {
            title: {
                text: ''
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }],
            labels: {
                formatter: function () {
                    return Highcharts.numberFormat(this.value, 0, ".", ",");
                }
            }
        }
    },
    getTooltip: function () {
        return {
            valueSuffix: ''
        }
    },
    getLegend: function () {
        return {
            layout: 'vertical',
            align: 'center',
            verticalAlign: 'bottom',
            borderWidth: 0
        }
    },
    getSeries: function () {
        var series = [];
        var data = [];
        // 放入折线列的数据
        for (var i = this.grid_data.length - 1; i >= 0; i--) {
            data.push(this.grid_data[i][this.lineChartLabel]);
        }

        series.push({
            name: this.lineName,
            data: data,

        });
        return series;
    }

};


/**
 * highcharts加载器
 * @param highChartsRenderInstance 继承IhighChartsRender接口实例
 * @param areaSelector 画图的地方
 */
function renderHighCharts(highChartsRenderInstance, areaSelector) {
    Interface.ensureImplements(highChartsRenderInstance, IhighChartsRender);
    var options = {

        title: highChartsRenderInstance.getTitle(),
        subtitle: highChartsRenderInstance.getSubtitle(),
        xAxis: highChartsRenderInstance.getXAxis(),
        yAxis: highChartsRenderInstance.getYAxis(),
        tooltip: highChartsRenderInstance.getTooltip(),
        legend: highChartsRenderInstance.getLegend(),
        series: highChartsRenderInstance.getSeries(),


    };
    $(areaSelector).highcharts(options);
}