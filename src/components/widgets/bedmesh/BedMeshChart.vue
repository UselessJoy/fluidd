<template>
  <div
    class="chart"
    :style="{ 'height': height }"
  >
    <e-chart
      ref="chart"
      :option="opts"
      :update-options="{ notMerge: false }"
      :init-options="{ renderer: 'canvas' }"
      autoresize
    />
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Watch, Ref, Mixins } from 'vue-property-decorator'
import type { ECharts, EChartsOption, GraphicComponentOption } from 'echarts'
import { merge, cloneDeepWith } from 'lodash-es'
import BrowserMixin from '@/mixins/browser'

@Component({})
export default class EChartsBedMesh extends Mixins(BrowserMixin) {
  @Prop({ type: Array, required: true, default: {} })
  readonly data!: []

  @Prop({ type: Array, required: false, default: () => [] })
  readonly graphics!: GraphicComponentOption[]

  @Prop({ type: Object, default: {} })
  readonly options!: any

  @Prop({ type: String, default: '100%' })
  readonly height!: string

  @Ref('chart')
  readonly chart!: ECharts

  get flatSurface () {
    return this.$store.state.mesh.flatSurface
  }

  @Watch('flatSurface')
  onFlatSurfaceChange (value: boolean) {
    const type = value ? 'legendSelect' : 'legendUnSelect'
    this.chart.dispatchAction({
      type,
      name: 'mesh_matrix_flat'
    })
    this.chart.dispatchAction({
      type,
      name: 'probed_matrix_flat'
    })
  }

  beforeDestroy () {
    if (typeof window === 'undefined') return
    this.chart.dispose()
  }

  get opts (): EChartsOption {
    // If options includes series data, rip it out so we can merge it with
    // the given series in our initial options.
    const darkMode = this.$store.state.config.uiSettings.theme.isDark
    const fontSize = (this.isMobileViewport) ? 14 : 16
    let labelBackground = 'rgba(10,10,10,0.90)'
    const opacity = 0.10
    let fontColor = 'rgba(255,255,255,0.25)'
    let lineColor = '#ffffff'
    const visualMap = {
      itemWidth: (this.isMobileViewport) ? 15 : 25,
      itemHeight: (this.isMobileViewport) ? 140 : 280
    }
    if (!darkMode) {
      labelBackground = 'rgba(255,255,255,0.90)'
      fontColor = 'rgba(0,0,0,0.45)'
      lineColor = '#000000'
    }

    const axisCommon = {
      nameTextStyle: {
        color: fontColor
      },
      axisPointer: {
        lineStyle: {
          color: lineColor,
          opacity: 0.65
        },
        label: {
          margin: 16,
          color: fontColor,
          fontSize
        }
      },
      axisTick: {
        lineStyle: {
          color: lineColor,
          opacity
        }
      },
      axisLine: {
        lineStyle: {
          color: lineColor,
          opacity,
          width: 2
        }
      },
      axisLabel: {
        textStyle: {
          color: fontColor,
          fontSize
        }
      },
      splitLine: {
        lineStyle: {
          color: lineColor,
          opacity
        }
      }
    }

    const graphic = cloneDeepWith(this.graphics, g => {
      switch (g.type) {
        case 'text':
          return {
            ...g,
            style: {
              ...g.style,
              fill: fontColor,
              fontSize
            }
          }
        default:
          return undefined
      }
    })

    const opts: EChartsOption = {
      legend: {
        show: false
      },
      darkMode,
      tooltip: {
        backgroundColor: labelBackground,
        borderColor: labelBackground,
        textStyle: {
          color: fontColor,
          fontSize: 18
        },
        formatter: this.tooltipFormatter
      },
      visualMap: {
        type: 'continuous',
        textStyle: {
          color: fontColor,
          fontSize
        },
        realtime: true,
        calculable: true,
        show: true,
        top: 0,
        right: 'auto',
        bottom: 'auto',
        left: 0,
        dimension: 2,
        precision: 4,
        inRange: {
          color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        },
        ...visualMap
      },
      xAxis3D: {
        type: 'value',
        ...axisCommon
      },
      yAxis3D: {
        type: 'value',
        ...axisCommon
      },
      zAxis3D: {
        type: 'value',
        min: -0.5,
        max: 0.5,
        ...axisCommon
      },
      grid3D: {
        viewControl: {
          // distance: 100,
          rotateSensitivity: 1.8,
          zoomSensitivity: 2,
          rotateMouseButton: 'left',
          panMouseButton: 'right'
        }
      },
      graphic,
      series: [...this.data]
    }
    // Merge the default options with the given prop.
    merge(opts, this.options)
    return opts
  }

  tooltipFormatter (params: any) {
    let text = ''
    if (params.value && Array.isArray(params.value)) {
      text += `
        <div>
          <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>
          <span style="font-size:16px;color:#666;font-weight:400;margin-left:2px">
            ${params.seriesName}
          </span>
          <div style="clear: both"></div>
          <span style="font-size:16px;color:#666;font-weight:400;margin-left:2px">
            x: ${params.value[0].toFixed(4)}
          </span>
          <div style="clear: both"></div>
          <span style="font-size:16px;color:#666;font-weight:400;margin-left:2px">
            y: ${params.value[1].toFixed(4)}
          </span>
          <div style="clear: both"></div>
          <span style="font-size:16px;color:#666;font-weight:400;margin-left:2px">
            z: ${params.value[2].toFixed(4)}
          </span>
          <div style="clear: both"></div>
        </div>
        `
    }
    return text
  }
}
</script>

<style lang='scss' scoped>
  .chart {
    margin-top: 16px;
    width: 100%;
    // height: 625px;
  }
</style>
