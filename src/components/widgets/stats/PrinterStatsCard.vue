<template>
  <collapsable-card
    :title="$t('app.general.title.stats')"
    icon="$chart"
  >
    <template #menu>
      <app-btn-collapse-group :collapsed="menuCollapsed">
        <app-btn
          small
          class="ms-1 my-1"
          @click="handleResetStats"
        >
          <v-icon
            small
            left
          >
            $delete
          </v-icon>
          <span>{{ $t('app.general.btn.reset_stats') }}</span>
        </app-btn>
      </app-btn-collapse-group>
    </template>

    <v-card-text>
      <div class="mb-4">
        <v-layout justify-space-between>
          <div class="grey--text text--darken-2">
            {{ isEqualUsage ? $t('app.file_system.label.disk_internal_usage') : $t('app.file_system.label.disk_gcode_usage') }}
          </div>
        </v-layout>
        <v-progress-linear
          :size="90"
          :height="10"
          :value="fileSystemGcodesUsedPercent"
          color="primary"
          class="my-1"
        />
        <v-layout justify-space-between>
          <div class="grey--text">
            <span class="focus--text">
              {{ $filters.getReadableFileSizeString(fileSystemGcodeUsage.used) }}
            </span> {{ $t('app.general.label.used') }}
          </div>
          <div class="grey--text">
            <span class="focus--text">
              {{ $filters.getReadableFileSizeString(fileSystemGcodeUsage.free) }}
            </span> {{ $t('app.general.label.free') }}
          </div>
        </v-layout>
      </div>

      <v-row v-if="supportsHistoryComponent">
        <v-col cols="3">
          <v-card
            outlined
            class="px-2 py-1 text-center stat-square"
          >
            <div class="secondary--text">
              {{ $t('app.general.label.total_jobs') }}
            </div>
            <div class="focus--text">
              {{ rollup.total_jobs }}
            </div>
            <div class="secondary--text">
              {{ $t('app.general.label.longest_job') }}
            </div>
            <div class="focus--text">
              {{ $filters.formatCounterSeconds(rollup.longest_job) }}
            </div>
          </v-card>
        </v-col>
        <v-col cols="3">
          <v-card
            outlined
            class="px-2 py-1 text-center stat-square"
          >
            <div class="secondary--text">
              {{ $t('app.general.label.total_time') }}
            </div>
            <div class="focus--text">
              {{ $filters.formatCounterSeconds(rollup.total_time) }}
            </div>
            <div class="secondary--text">
              {{ $t('app.general.label.total_time_avg') }}
            </div>
            <div class="focus--text">
              {{ $filters.formatCounterSeconds(rollup.total_avg) }}
            </div>
          </v-card>
        </v-col>
        <v-col cols="3">
          <v-card
            outlined
            class="px-2 py-1 text-center stat-square"
          >
            <div class="secondary--text">
              {{ $t('app.general.label.total_print_time') }}
            </div>
            <div class="focus--text">
              {{ $filters.formatCounterSeconds(rollup.total_print_time) }}
            </div>
            <div class="secondary--text">
              {{ $t('app.calendar.total_print_time_for') }} {{ $t(`app.calendar.last.${key}`, {count: jobs.length}) }}
            </div>
            <div class="focus--text">
              {{ $filters.formatCounterSeconds(jobsTime) }}
            </div>
          </v-card>
        </v-col>
        <v-col cols="3">
          <v-card
            outlined
            class="px-2 py-1 text-center stat-square"
          >
            <div class="secondary--text">
              {{ $t('app.general.label.total_filament') }}
            </div>
            <div class="focus--text">
              {{ $filters.getReadableLengthString(rollup.total_filament_used) }}
            </div>
            <div class="secondary--text">
              {{ $t('app.calendar.total_filament_for') }} {{ $t(`app.calendar.last.${key}`, {count: jobs.length}) }}
            </div>
            <div class="focus--text">
              {{ $filters.getReadableLengthString(jobsFilamentUsed) }}
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </collapsable-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import JobHistory from '@/components/widgets/history/JobHistory.vue'
import { SocketActions } from '@/api/socketActions'
import type { DiskUsage } from '@/store/files/types'
import type { HistoryItem } from '@/store/history/types'

@Component({
  components: {
    JobHistory
  }
})
export default class PrinterStatsCard extends Vue {
  @Prop({ type: Boolean })
  readonly menuCollapsed?: boolean

  get rollup () {
    return this.$store.getters['history/getRollUp']
  }

  // Не используется
  // get fileSystemUsedPercent () {
  //   // (250 / 500) * 100
  //   const total = this.fileSystemUsage.total
  //   const used = this.fileSystemUsage.used
  //   return Math.floor((used / total) * 100).toFixed()
  // }

  // get fileSystemUsage (): DiskUsage {
  //   return this.$store.getters['files/getUsage']
  // }

  get key (): string {
    let key = ''
    switch (this.jobs.length) {
      case 1:
        key = 'one'
        break
      case 2:
      case 3:
      case 4:
        key = 'few'
        break
      default:
        key = 'other'
    }
    return key
  }

  get jobs (): HistoryItem[] {
    return this.$store.getters['history/getHistory']
  }

  jobsFilamentUsed = 0
  jobsTime = 0

  @Watch('jobs', { deep: true })
  onChangeHistory (jobs: HistoryItem[]) {
    this.jobsFilamentUsed = 0
    this.jobsTime = 0
    for (const job of jobs) {
      this.jobsFilamentUsed += job.filament_used
      this.jobsTime += job.total_duration
    }
  }

  get fileSystemGcodesUsedPercent () {
    const total = this.fileSystemGcodeUsage.total
    const used = this.fileSystemGcodeUsage.used
    return Math.floor((used / total) * 100).toFixed()
  }

  get isEqualUsage (): boolean {
    return this.fileSystemGcodeUsage.total === this.fileSystemConfiglUsage.total
  }

  get fileSystemGcodeUsage (): DiskUsage {
    return this.$store.getters['files/getGcodesUsage']
  }

  get fileSystemConfiglUsage (): DiskUsage {
    return this.$store.getters['files/getConfigUsage']
  }

  get supportsHistoryComponent () {
    return this.$store.getters['server/componentSupport']('history')
  }

  async handleResetStats () {
    const result = await this.$confirm(
      this.$tc('app.history.msg.confirm_stats'),
      {
        title: this.$tc('app.general.label.confirm'),
        color: 'card-heading',
        icon: '$error',
        buttonTrueText: this.$tc('app.general.btn.yes'),
        buttonFalseText: this.$tc('app.general.btn.no')
      }
    )
    if (result) {
      SocketActions.serverHistoryResetTotals()
    }
  }

  mounted () {
    SocketActions.serverGetRootUsage('gcodes')
    SocketActions.serverGetRootUsage('config')
  }
}
</script>

<style lang="scss" scoped>
  .total-size {
    font-size: 0.875rem;
  }

  .stat-square {
    min-height: 110px;

    div:nth-child(2) {
      margin-bottom: 6px;
    }
  }
</style>
