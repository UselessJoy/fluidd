<template>
  <collapsable-card
    :title="$t('app.system_info.label.system_utilization')"
    icon="$chart"
  >
    <v-card-text>
      <v-row>
        <system-load-chart />
        <klipper-load-chart />
        <moonraker-load-chart />
        <system-memory-chart />
        <template
          v-for="(mcu, i) in mcus"
        >
          <mcu-load-chart
            :key="i"
            :mcu="mcu.name"
          />
        </template>
      </v-row>
    </v-card-text>
  </collapsable-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SystemLoadChart from './SystemLoadChart.vue'
import SystemMemoryChart from './SystemMemoryChart.vue'
import KlipperLoadChart from './KlipperLoadChart.vue'
import MoonrakerLoadChart from './MoonrakerLoadChart.vue'
import McuLoadChart from './McuLoadChart.vue'

@Component({
  components: {
    SystemLoadChart,
    SystemMemoryChart,
    KlipperLoadChart,
    MoonrakerLoadChart,
    McuLoadChart
  }
})
export default class PrinterStatsCard extends Vue {
  get procStats () {
    return this.$store.getters['server/getProcessStats']
  }

  get systemStats () {
    return this.$store.getters['printer/getSystemStats']
  }

  get mcus () {
    return this.$store.getters['printer/getMcus']
  }
}
</script>

<style lang="scss">
  // .chart-wrapper {
  //   border: solid 1px #ccc;
  // }

  .chart-label-wrapper {
    margin-top: 6px;
    display: block;
  }

  .chart-label {
    display: flex;
    justify-content: space-between;
  }
</style>
