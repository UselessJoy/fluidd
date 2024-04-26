<template>
  <collapsable-card
    :title="$t('app.file_system.label.diskinfo')"
    icon="$harddisk"
  >
    <v-card-text>
      <v-layout justify-space-between class="mb-4">
        <div class="">{{ isEqualUsage ? $t('app.file_system.label.disk_internal_usage') : $t('app.file_system.label.disk_gcode_usage') }}</div>
      </v-layout>
      <v-progress-linear
        :size="90"
        :height="10"
        :value="fileSystemGcodesUsedPercent"
        color="primary"
        class="my-1"
      >
      </v-progress-linear>
      <v-layout justify-space-between>
        <div class="">
          <span class="focus--text">
            {{ $filters.getReadableFileSizeString(fileSystemGcodeUsage.used) }}
          </span>
          <span class="secondary--text">{{ $t('app.general.label.used') }}</span>
        </div>
        <div class="">
          <span class="focus--text">
            {{ $filters.getReadableFileSizeString(fileSystemGcodeUsage.free) }}
          </span>
          <span class="secondary--text">{{ $t('app.general.label.free') }}</span>
        </div>
      </v-layout>
    </v-card-text>
    <v-divider v-if="!isEqualUsage"/>
    <v-card-text v-if="!isEqualUsage">
      <v-layout justify-space-between class="mb-4">
        <div class="">{{ $t('app.file_system.label.disk_internal_usage') }}</div>
      </v-layout>
      <v-progress-linear
        :size="90"
        :height="10"
        :value="fileSystemConfigUsedPercent"
        color="primary"
        class="my-1"
      >
      </v-progress-linear>
      <v-layout justify-space-between>
        <div class="">
          <span class="focus--text">
            {{ $filters.getReadableFileSizeString(fileSystemConfigUsage.used) }}
          </span>
          <span class="secondary--text">{{ $t('app.general.label.used') }}</span>
        </div>
        <div class="">
          <span class="focus--text">
            {{ $filters.getReadableFileSizeString(fileSystemConfigUsage.free) }}
          </span>
          <span class="secondary--text">{{ $t('app.general.label.free') }}</span>
        </div>
      </v-layout>
    </v-card-text>

    <!-- <v-simple-table dense>
      <tbody>
        <tr v-if="sdInfo.manufacturer">
          <th>{{ $t('app.system_info.label.manufacturer') }}</th>
          <td>{{ sdInfo.manufacturer }}</td>
        </tr>
        <tr v-if="sdInfo.manufacturer_date">
          <th>{{ $t('app.system_info.label.manufactured') }}</th>
          <td>{{ sdInfo.manufacturer_date }}</td>
        </tr>
        <tr v-if="sdInfo.product_name">
          <th>{{ $t('app.system_info.label.product_name') }}</th>
          <td>{{ sdInfo.product_name }} {{ sdInfo.product_revision }}</td>
        </tr>
        <tr v-if="sdInfo.capacity">
          <th>{{ $t('app.system_info.label.capacity') }}</th>
          <td>{{ sdInfo.capacity }}</td>
        </tr>
        <tr v-if="sdInfo.serial_number">
          <th>{{ $t('app.system_info.label.serial_number') }}</th>
          <td>{{ sdInfo.serial_number }}</td>
        </tr>
      </tbody>
    </v-simple-table> -->
  </collapsable-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import JobHistory from '@/components/widgets/history/JobHistory.vue'
import { SocketActions } from '@/api/socketActions'
import type { DiskUsage } from '@/store/files/types'

@Component({
  components: {
    JobHistory
  }
})
export default class PrinterStatsCard extends Vue {
  // get sdInfo () {
  //   const info = this.$store.getters['server/getSystemInfo']
  //   return info?.sd_info || {}
  // }

  get fileSystemGcodesUsedPercent () {
    const total = this.fileSystemGcodeUsage.total
    const used = this.fileSystemGcodeUsage.used
    return Math.floor((used / total) * 100).toFixed()
  }

  get fileSystemConfigUsedPercent () {
    const total = this.fileSystemConfigUsage.total
    const used = this.fileSystemConfigUsage.used
    return Math.floor((used / total) * 100).toFixed()
  }

  get isEqualUsage(): boolean {
    return this.fileSystemGcodeUsage.total === this.fileSystemConfigUsage.total
  }

  get fileSystemGcodeUsage (): DiskUsage {
    return this.$store.getters['files/getGcodesUsage']
  }

  get fileSystemConfigUsage(): DiskUsage {
    return this.$store.getters['files/getConfigUsage']
  }

  beforeCreate() {
    SocketActions.serverGetRootUsage('gcodes')
    SocketActions.serverGetRootUsage('config')
  }

}
</script>
