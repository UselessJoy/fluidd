<template>
  <div>
    <v-subheader id="general">
      {{ $t('app.setting.title.general') }}
    </v-subheader>
    <v-card
      :elevation="5"
      dense
      class="mb-4"
    >
      <app-setting :title="$t('app.setting.label.printer_name')">
        <v-text-field
          ref="instanceName"
          filled
          dense
          single-line
          hide-details="auto"
          :rules="[
            $rules.required
          ]"
          :value="instanceName"
          :default-value="$globals.APP_NAME"
          @change="setInstanceName"
        />
      </app-setting>

      <v-divider />

      <app-setting :title="$t('app.setting.label.language')">
        <v-select
          filled
          dense
          single-line
          hide-details="auto"
          :items="supportedLocales"
          :value="locale"
          item-text="name"
          item-value="code"
          @change="setLocale"
        />
      </app-setting>

      <v-divider />

      <app-setting
        :title="$t('app.setting.label.klipper_language')"
        :sub-title="$t('app.setting.label.klipper_language_description')">
        <v-select
          filled
          dense
          single-line
          hide-details="auto"
          :items="klipperLangs"
          :value="currentKlipperLang"
          item-text="name"
          item-value="code"
          @change="setKlipperLocale"
        />
      </app-setting>

      <v-divider />

      <app-setting :title="$t('app.setting.label.date_format')">
        <v-select
          v-model="dateFormat"
          filled
          dense
          hide-details="auto"
          :items="availableDateFormats"
        />
      </app-setting>

      <v-divider />

      <app-setting :title="$t('app.setting.label.time_format')">
        <v-select
          v-model="timeFormat"
          filled
          dense
          hide-details="auto"
          :items="availableTimeFormats"
        />
      </app-setting>

      <v-divider />

      <app-setting
        :title="$t('app.setting.label.enable_quite_mode')"
      >
        <v-switch
          v-model="enableQuiteMode"
          hide-details
          class="mb-5"
          @click.native.stop
        />
      </app-setting>

      <v-divider />

      <app-setting :title="$t('app.setting.label.confirm_on_estop')">
        <v-switch
          v-model="confirmOnEstop"
          hide-details
          class="mb-5"
          @click.native.stop
        />
      </app-setting>

      <v-divider />

      <app-setting :title="$t('app.setting.label.show_upload_and_print')">
        <v-switch
          v-model="showUploadAndPrint"
          hide-details
          class="mb-5"
          @click.native.stop
        />
      </app-setting>

      <v-divider />

      <app-setting :title="$t('app.setting.label.power_toggle_in_top_nav')">
        <v-select
          v-model="topNavPowerToggle"
          filled
          dense
          single-line
          hide-details="auto"
          :items="[{ text: $tc('app.setting.label.none'), value: null }, ...powerDevicesList]"
        />
      </app-setting>

      <v-divider />

      <app-setting :title="$t('app.setting.label.confirm_on_power_device_change')">
        <v-switch
          v-model="confirmOnPowerDeviceChange"
          hide-details
          class="mb-5"
          @click.native.stop
        />
      </app-setting>

      <v-divider />

      <app-setting :title="$t('app.setting.label.show_save_config_and_restart')">
        <v-switch
          v-model="showSaveConfigAndRestart"
          hide-details
          class="mb-5"
          @click.native.stop
        />
      </app-setting>

      <template v-if="showSaveConfigAndRestart">
        <v-divider />

        <app-setting :title="$t('app.setting.label.confirm_on_save_config_and_restart')">
          <v-switch
            v-model="confirmOnSaveConfigAndRestart"
            hide-details
            class="mb-5"
            @click.native.stop
          />
        </app-setting>

        <v-divider />

        <app-setting :title="$t('app.setting.label.sections_to_ignore_pending_configuration_changes')">
          <v-combobox
            v-model="sectionsToIgnorePendingConfigurationChanges"
            :items="['bed_mesh default', 'bed_tilt']"
            filled
            dense
            hide-selected
            hide-details="auto"
            multiple
            small-chips
            append-icon=""
            deletable-chips
          />
        </app-setting>
      </template>

      <v-divider />

      <app-setting :title="$t('app.setting.label.auto_off_complete')">
        <v-switch
          v-model="enableAutoOff"
          hide-details
          class="mt-0 mb-4"
          @click.native.stop
        />
      </app-setting>

      <v-divider />

      <app-setting :title="$t('app.setting.label.safety_printing')">
        <v-switch
          v-model="safetyPrinting"
          hide-details
          class="mt-0 mb-4"
          @click.native.stop
        />
      </app-setting>

      <v-divider />

      <app-setting
        :title="$t('app.setting.label.watch_bed_mesh')"
        :sub-title="$t('app.setting.label.sub_watch_bed_mesh')"
      >
        <v-switch
          v-model="watchBedMesh"
          hide-details
          class="mt-0 mb-4"
          @click.native.stop
        />
      </app-setting>

      <v-divider />

      <app-setting
        :title="$t('app.setting.label.autoload_bed_mesh')"
        :sub-title="$t('app.setting.label.sub_autoload_bed_mesh')"
      >
        <v-switch
          v-model="autoloadBedMesh"
          hide-details
          class="mt-0 mb-4"
          @click.native.stop
        />
      </app-setting>

      <v-divider />

      <app-setting
        :title="$t('app.setting.label.print_in_progress_layout')"
      >
        <v-select
          v-model="printInProgressLayout"
          filled
          dense
          hide-details="auto"
          :items="availablePrintInProgressLayouts"
        />
      </app-setting>

      <v-divider />

      <app-setting
        :title="$t('app.setting.label.print_progress_calculation')"
        :sub-title="$t('app.setting.tooltip.average_calculation')"
      >
        <v-select
          v-model="printProgressCalculation"
          multiple
          filled
          dense
          hide-details="auto"
          :rules="[
            $rules.lengthGreaterThanOrEqual(1),
          ]"
          :items="availablePrintProgressCalculation"
        />
      </app-setting>

      <v-divider />

      <app-setting
        :title="$t('app.setting.label.print_eta_calculation')"
        :sub-title="$t('app.setting.tooltip.average_calculation')"
      >
        <v-select
          v-model="printEtaCalculation"
          multiple
          filled
          dense
          hide-details="auto"
          :rules="[
            $rules.lengthGreaterThanOrEqual(1),
          ]"
          :items="availablePrintEtaCalculation"
        />
      </app-setting>

      <v-divider />

      <app-setting
        :title="$t('app.setting.label.enable_diagnostics')"
        :sub-title="$t('app.setting.tooltip.diagnostics_performance')"
      >
        <v-switch
          v-model="enableDiagnostics"
          hide-details
          class="mt-0 mb-4"
        />
      </app-setting>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Ref } from 'vue-property-decorator'
import StateMixin from '@/mixins/state'
import type { VInput } from '@/types'
import { SupportedLocales, DateFormats, TimeFormats } from '@/globals'
import type { OutputPin } from '@/store/printer/types'
import type { Device } from '@/store/power/types'
import { SocketActions } from '@/api/socketActions'
import type { PrintEtaCalculation, PrintInProgressLayout, PrintProgressCalculation } from '@/store/config/types'

@Component({
  components: {}
})
export default class GeneralSettings extends Mixins(StateMixin) {
  @Ref('instanceName')
  readonly instanceNameElement!: VInput

  get instanceName () {
    return this.$store.state.config.uiSettings.general.instanceName
  }

  setInstanceName (value: string) {
    if (this.instanceNameElement.valid) this.$store.dispatch('config/updateInstance', value)
  }

  get locale () {
    return this.$store.state.config.uiSettings.general.locale
  }

  get supportedLocales () {
    return [
      { name: this.$t('app.language.browser_default'), code: 'default' },
      ...SupportedLocales
    ]
  }

  setLocale (value: string) {
    this.$store.dispatch('config/onLocaleChange', value)
  }

  get dateFormat () {
    return this.$store.state.config.uiSettings.general.dateFormat
  }

  set dateFormat (value: string) {
    this.$store.dispatch('config/saveByPath', {
      path: 'uiSettings.general.dateFormat',
      value,
      server: true
    })
  }

  get availableDateFormats () {
    const date = new Date()

    return Object.entries(DateFormats)
      .map(([key, entry]) => ({
        value: key,
        text: `${date.toLocaleDateString(entry.locales ?? this.$filters.getAllLocales(), entry.options)}${entry.suffix ?? ''}`
      }))
  }

  get timeFormat () {
    return this.$store.state.config.uiSettings.general.timeFormat
  }

  set timeFormat (value: string) {
    this.$store.dispatch('config/saveByPath', {
      path: 'uiSettings.general.timeFormat',
      value,
      server: true
    })
  }

  get availableTimeFormats () {
    const date = new Date()

    return Object.entries(TimeFormats)
      .map(([key, entry]) => ({
        value: key,
        text: `${date.toLocaleTimeString(entry.locales ?? this.$filters.getAllLocales(), entry.options)}${entry.suffix ?? ''}`
      }))
  }

  get confirmOnEstop () {
    return this.$store.state.config.uiSettings.general.confirmOnEstop
  }

  set confirmOnEstop (value: boolean) {
    this.$store.dispatch('config/saveByPath', {
      path: 'uiSettings.general.confirmOnEstop',
      value,
      server: true
    })
  }

  get enableQuiteMode () {
    return this.$store.getters['printer/getQuiteMode']
  }

  set enableQuiteMode (value: boolean) {
    this.$store.dispatch('config/saveByPath', {
      path: 'uiSettings.general.enableQuiteMode',
      value,
      server: true
    })
    SocketActions.setQuiteMode('stepper_x', value)
    SocketActions.setQuiteMode('stepper_y', value)
  }

  get topNavPowerToggle () {
    return this.$store.state.config.uiSettings.general.topNavPowerToggle
  }

  set topNavPowerToggle (value: string) {
    this.$store.dispatch('config/saveByPath', {
      path: 'uiSettings.general.topNavPowerToggle',
      value,
      server: true
    })
  }

  get powerDevicesList () {
    const devices = this.$store.getters['power/getDevices'] as Device[]
    const deviceEntries = devices.length
      ? [
          { header: 'Moonraker' },
          ...devices.map(device => ({ text: device.device, value: device.device }))
        ]
      : []

    const pins = this.$store.getters['printer/getPins'] as OutputPin[]
    const pinEntries = pins.length
      ? [
          { header: 'Klipper' },
          ...pins.map(outputPin => ({ text: outputPin.prettyName, value: `${outputPin.name}:klipper` }))
        ]
      : []

    return [
      ...deviceEntries,
      ...pinEntries
    ]
  }

  get confirmOnPowerDeviceChange () {
    return this.$store.state.config.uiSettings.general.confirmOnPowerDeviceChange
  }

  set confirmOnPowerDeviceChange (value: boolean) {
    this.$store.dispatch('config/saveByPath', {
      path: 'uiSettings.general.confirmOnPowerDeviceChange',
      value,
      server: true
    })
  }

  get showSaveConfigAndRestart () {
    return this.$store.state.config.uiSettings.general.showSaveConfigAndRestart
  }

  set showSaveConfigAndRestart (value: boolean) {
    this.$store.dispatch('config/saveByPath', {
      path: 'uiSettings.general.showSaveConfigAndRestart',
      value,
      server: true
    })
  }

  get showUploadAndPrint () {
    return this.$store.state.config.uiSettings.general.showUploadAndPrint
  }

  set showUploadAndPrint (value: boolean) {
    this.$store.dispatch('config/saveByPath', {
      path: 'uiSettings.general.showUploadAndPrint',
      value,
      server: true
    })
  }

  get confirmOnSaveConfigAndRestart (): boolean {
    return this.$store.state.config.uiSettings.general.confirmOnSaveConfigAndRestart as boolean
  }

  set confirmOnSaveConfigAndRestart (value: boolean) {
    this.$store.dispatch('config/saveByPath', {
      path: 'uiSettings.general.confirmOnSaveConfigAndRestart',
      value,
      server: true
    })
  }

  get sectionsToIgnorePendingConfigurationChanges (): string[] {
    return this.$store.state.config.uiSettings.general.sectionsToIgnorePendingConfigurationChanges as string[]
  }

  set sectionsToIgnorePendingConfigurationChanges (value: string[]) {
    this.$store.dispatch('config/saveByPath', {
      path: 'uiSettings.general.sectionsToIgnorePendingConfigurationChanges',
      value: [...new Set(value)].sort((a, b) => a.localeCompare(b)),
      server: true
    })
  }

  get printInProgressLayout (): PrintInProgressLayout {
    return this.$store.state.config.uiSettings.general.printInProgressLayout as PrintInProgressLayout
  }

  set printInProgressLayout (value: PrintInProgressLayout) {
    this.$store.dispatch('config/saveByPath', {
      path: 'uiSettings.general.printInProgressLayout',
      value,
      server: true
    })
  }

  get availablePrintInProgressLayouts () {
    return [
      {
        value: 'default',
        text: this.$t('app.general.label.default')
      },
      {
        value: 'compact',
        text: this.$t('app.general.label.compact')
      }
    ]
  }

  get availablePrintProgressCalculation () {
    return [
      {
        value: 'file',
        text: this.$t('app.setting.timer_options.relative_file_position')
      },
      {
        value: 'fileAbsolute',
        text: this.$t('app.setting.timer_options.absolute_file_position')
      },
      {
        value: 'slicer',
        text: this.$t('app.setting.timer_options.slicer_m73')
      },
      {
        value: 'filament',
        text: this.$t('app.setting.timer_options.filament')
      }
    ]
  }

  get printProgressCalculation () {
    return this.$store.state.config.uiSettings.general.printProgressCalculation as PrintProgressCalculation
  }

  set printProgressCalculation (value: string) {
    this.$store.dispatch('config/saveByPath', {
      path: 'uiSettings.general.printProgressCalculation',
      value,
      server: true
    })
  }

  get availablePrintEtaCalculation () {
    return [
      {
        value: 'file',
        text: this.$t('app.setting.timer_options.file')
      },
      {
        value: 'slicer',
        text: this.$t('app.setting.timer_options.slicer')
      }
    ]
  }

  get printEtaCalculation () {
    return this.$store.state.config.uiSettings.general.printEtaCalculation as PrintEtaCalculation[]
  }

  set printEtaCalculation (value: PrintEtaCalculation[]) {
    this.$store.dispatch('config/saveByPath', {
      path: 'uiSettings.general.printEtaCalculation',
      value,
      server: true
    })
  }

  get enableDiagnostics () {
    return this.$store.state.config.uiSettings.general.enableDiagnostics
  }

  set enableDiagnostics (value: boolean) {
    this.$store.dispatch('config/saveByPath', {
      path: 'uiSettings.general.enableDiagnostics',
      value,
      server: true
    })
  }

  /*      NEW      */

  get enableAutoOff (): boolean {
    // this.$store.state.config.uiSettings.general.autoOff_enable = this.$store.getters['printer/getAutoOffEnable']
    // return this.$store.state.config.uiSettings.general.autoOff_enable
    return this.$store.getters['printer/getAutoOffEnable']
  }

  set enableAutoOff (value: boolean) {
    this.$store.dispatch('config/saveByPath', {
      path: 'uiSettings.general.autoOff_enable',
      value,
      server: true
    })
    // SocketActions.printerGcodeScript(`SET_AUTO_OFF ENABLE=${value}`, this.$waits.onGetAutoOffEnable)
    SocketActions.setAutoOff(value)
  }

  get klipperLangs () {
    return [
      { name: this.$t('app.language.browser_default'), code: 'default' },
      ...this.$store.getters['printer/getKlipperLangs']
    ]
  }

  get currentKlipperLang (): string {
    return this.$store.getters['printer/getCurrentKlipperLang']
  }

  setKlipperLocale (value: string) {
    this.$store.dispatch('config/saveByPath', {
      path: 'uiSettings.general.lang',
      value,
      server: true
    })
    SocketActions.setKlipperLang(value)
  }

  get safetyPrinting (): boolean {
    return this.$store.getters['printer/getSafetyPrinting'].safety_enabled
  }

  set safetyPrinting (value: boolean) {
    this.$store.dispatch('config/saveByPath', {
      path: 'uiSettings.general.safety_enabled',
      value,
      server: true
    })
    SocketActions.setSafetyPrinting(value)
  }

  get watchBedMesh (): boolean {
    return this.$store.getters['printer/getWatchBedMesh']
  }

  set watchBedMesh (value: boolean) {
    this.$store.dispatch('config/saveByPath', {
      path: 'uiSettings.general.watch_bed_mesh',
      value,
      server: true
    })
    SocketActions.setWatchBedMesh(value)
  }

  get autoloadBedMesh (): boolean {
    return this.$store.getters['printer/getAutoloadBedMesh']
  }

  set autoloadBedMesh (value: boolean) {
    this.$store.dispatch('config/saveByPath', {
      path: 'uiSettings.general.autoload_bed_mesh',
      value,
      server: true
    })
    SocketActions.setAutoloadBedMesh(value)
  }

  /*    END NEW    */
}
</script>
