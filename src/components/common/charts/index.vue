<template>
  <div
    :class="className"
    :id="id"
    :style="{ width: width, height: height }"
  ></div>
</template>

<script>
//公共echart组件 只需要传入组件名字 大小 以及option即可生成组件 不用再去获取组件dom结构 也不用管组件的resize逻辑等
import resize from './mixins/index'
export default {
  name: 'chart',
  mixins: [resize],
  props: {
    id: {
      default: 'chart',
      type: String,
      required: true
    },
    className: {
      default: 'chart',
      type: String
    },
    width: {
      default: '200px',
      type: String
    },
    height: {
      default: '200px',
      type: String
    },
    option: {
      default: {},
      type: Object,
      required: true
    }
  },
  watch: {
    option() {
      this.initChart()
    }
  },
  data() {
    return {
      chart: null
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      let option = this.getCommonOptions()
      option = Object.assign(option, this.option)
      if (!this.chart) {
        this.chart = echarts.init(document.getElementById(this.id))
      }
      this.chart.setOption(option)
    },
    getCommonOptions() {
      return {
        color: ['#FFE18F', '#00FFFF', '#556FB5'], //图表各数据的颜色
        tooltip: {
          //鼠标移入的时候显示的信息
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: 'transparent'
            }
          }
        },
        grid: {
          //chart距离容器四周的距离
          top: '5%',
          left: '5%',
          right: '5%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: [
              '星期一',
              '星期二',
              '星期三',
              '星期四',
              '星期五',
              '星期六',
              '星期日'
            ]
            // axisLabel: {
            //   color: '#ccc'
            // }
          }
        ],
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              color: '#68A8CC',
              opacity: '0.3'
            }
          },
          axisLabel: {
            color: '#68A8CC',
            opacity: '0.5'
          }
          // minInterval: 10,
        },
        series: [
          {
            name: '默认图表',
            type: 'bar',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#04FDCB' },
                { offset: 1, color: '#03B1D3' }
              ])
            },
            data: [2, 10, 8, 9, 4, 7, 4]
          }
        ]
      }
    }
  }
}
</script>

<style>
</style>