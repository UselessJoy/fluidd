<template>
  <collapsable-card
    :title="$t('app.printer.title.printer_status')"
    icon="$printer3d"
    draggable
    :collapsable="collapsable"
    layout-path="dashboard.printer-status-card"
  >
    <template #title="{inLayout}">
      <v-tabs
        v-if="!inLayout"
        v-model="tab"
        background-color="transparent"
        mobile-breakpoint="0"
        height="41"
        hide-slider
      >
        <v-tab
          key="status"
        >
          <v-icon left>
            $printer3d
          </v-icon>
          {{ $t('app.printer.state.' + printerState) || printerState }}
        </v-tab>
        <v-tab
          v-if="supportsHistoryComponent && !(printerPrinting || printerPaused)"
          key="reprint"
        >
          {{ $t('app.general.btn.reprint') }}
        </v-tab>
        <v-btn
          v-if="hasInterruptedFile && !(printerPrinting || printerPaused)"
          color="primary"
          text
          style="border-radius: 0px; height: inherit;"
          @click="sendRunInterruptFile"
        >
          {{ $t('app.general.btn.interrupt_print') }}
        </v-btn>
      </v-tabs>
    </template>

    <template #menu>
      <status-controls
        v-if="printerPrinting || printerPaused || filename"
        @print="handlePrint($event)"
      />
    </template>

    <v-tabs-items
      v-model="tab"
      touchless
    >
      <v-tab-item key="status">
        <status-tab />
      </v-tab-item>

      <v-tab-item
        v-if="supportsHistoryComponent"
        key="reprint"
      >
        <reprint-tab
          @print="handlePrint($event)"
        />
      </v-tab-item>
    </v-tabs-items>
  </collapsable-card>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { SocketActions } from '@/api/socketActions'
import StateMixin from '@/mixins/state'
import StatusControls from './StatusControls.vue'
import StatusTab from './StatusTab.vue'
import ReprintTab from './ReprintTab.vue'

@Component({
  components: {
    StatusControls,
    StatusTab,
    ReprintTab
  }
})
export default class PrinterStatusCard extends Mixins(StateMixin) {
  tab = 0

  // If the user has no history plugin, and there's no print running..
  // then hide the collapse control.
  get supportsHistoryComponent () {
    return this.$store.getters['server/componentSupport']('history')
  }

  get collapsable () {
    const filename = this.$store.state.printer.printer.print_stats.filename
    return (
      this.printerPrinting ||
      this.supportsHistoryComponent ||
      filename !== ''
    )
  }

  get filename () {
    return this.$store.state.printer.printer.print_stats.filename
  }

  get hasInterruptedFile () {
    return this.$store.getters['printer/getHasInterruptedFile']
  }

  @Watch('filename')
  onPrinterPrinting (val: string) {
    this.init(val)
  }

  mounted () {
    this.init(this.filename)
  }

  init (filename: string) {
    if (filename !== '') {
      this.tab = 0
    } else {
      this.tab = 1
    }
  }

  handlePrint (filename: string) {
    const spoolmanSupported = this.$store.getters['spoolman/getAvailable']
    const autoSpoolSelectionDialog = this.$store.state.config.uiSettings.spoolman.autoSpoolSelectionDialog
    if (spoolmanSupported && autoSpoolSelectionDialog) {
      this.$store.commit('spoolman/setDialogState', {
        show: true,
        filename
      })

      return
    }

    SocketActions.printerPrintStart(filename)
  }

  reprintInterrupt () {
    SocketActions.printerPrintRebuild()
  }

  sendRunInterruptFile () {
    this.sendGcode('SDCARD_RUN_FILE')
  }
}
</script>

<style lang="scss" scoped>
  :deep(.v-slide-group__prev),
  :deep(.v-slide-group__next) {
    display: none;
  }
</style>
