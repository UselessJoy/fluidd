<template>
  <collapsable-card
    :title="$t('app.general.title.tool')"
    icon="$printer3dNozzle"
    draggable
    layout-path="dashboard.toolhead-card"
    menu-breakpoint="lg"
  >
    <template #title>
      <v-icon left>
        $printer3dNozzle
      </v-icon>
      <span class="font-weight-light">{{ $t('app.general.title.tool') }}</span>
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-icon
            v-show="hasExtruder && !extruderReady"
            v-bind="attrs"
            class="ml-3"
            color="info"
            v-on="on"
          >
            $snowflakeAlert
          </v-icon>
        </template>
        <span v-html="$t('app.tool.tooltip.extruder_disabled', { min: activeExtruder?.min_extrude_temp })" />
      </v-tooltip>
    </template>
    <template #menu>
      <app-btn-collapse-group :collapsed="menuCollapsed">
        <app-btn
          v-if="isManualProbeActive"
          :disabled="!klippyReady || printerPrinting"
          small
          class="ms-1 my-1"
          @click="manualProbeDialogOpen = true"
        >
          {{ $t('app.tool.tooltip.manual_probe') }}
        </app-btn>

        <app-btn
          v-if="isBedScrewsAdjustActive"
          :disabled="!klippyReady || printerPrinting || !allHomed"
          small
          class="ms-1 my-1"
          @click="bedScrewsAdjustDialogOpen = true"
        >
          {{ $t('app.tool.tooltip.bed_screws_adjust') }}
        </app-btn>

        <v-tooltip 
          v-if="printerSupportsForceMove" 
          top
        >
        <template #activator="{ on, attrs }">
          <app-btn
            v-bind="attrs"
            v-on="on"
            :disabled="!klippyReady || printerPrinting"
            small
            class="ms-1 my-1"
            :color="forceMove ? 'error' : undefined"
            @click="toggleForceMove"
          >
            {{ $t('app.tool.tooltip.force_move') }}
          </app-btn>
        </template>
          <span>{{ $t('app.tool.tooltip.force_move_description') }}</span>
        </v-tooltip>
        <app-btn
          v-if="hasSteppersEnabled"
          :disabled="!klippyReady || printerPrinting"
          small
          class="ms-1 my-1"
          @click="sendGcode('M84')"
        >
          {{ $t('app.tool.tooltip.motors_off') }}
        </app-btn>
        <v-menu
          v-if="availableTools.length"
          left
          offset-y
          transition="slide-y-transition"
        >
          <template #activator="{ on, attrs, value }">
            <app-btn
              v-bind="attrs"
              small
              class="ms-1 my-1"
              :disabled="!klippyReady || printerPrinting"
              v-on="on"
            >
              <v-icon
                small
                class="mr-1"
              >
                $tools
              </v-icon>
              {{ $t('app.tool.tooltip.tools') }}
              <v-icon
                small
                class="ml-1"
                :class="{ 'rotate-180': value }"
              >
                $chevronDown
              </v-icon>
            </app-btn>
          </template>
          <v-list dense>
            <template v-for="(tool, index) of availableTools">
              <v-list-item
                v-if="tool.name === 'calibrate_heater_pid'"
                :key="tool.name"
                :disabled="tool.disabled || (tool.wait && hasWait(tool.wait))"
                @click="isOpenPidDialog = true"
              >
                <v-list-item-icon>
                  <v-icon>
                    {{ tool.icon || '$tools' }}
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ tool.label || tool.name }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item
                v-else-if="tool.name === 'belt_tension'"
                :key="tool.name"
                :disabled="tool.disabled || (tool.wait && hasWait(tool.wait))"
                @click="isOpenBeltDialog = true"
              >
                <v-list-item-icon>
                  <v-icon>
                    {{ tool.icon || '$tools' }}
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ tool.label || tool.name }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item
                v-else-if="tool.name === 'diagnostics'"
                :key="tool.name"
                :disabled="tool.disabled || (tool.wait && hasWait(tool.wait))"
                @click="isOpenDiagnosticsDialog = true"
              >
                <v-list-item-icon>
                  <v-icon>
                    {{ tool.icon || '$tools' }}
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ tool.label || tool.name }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item
                v-else-if="tool.name !== '-'"
                :key="tool.name"
                :disabled="tool.disabled || (tool.wait && hasWait(tool.wait))"
                @click="sendGcode(tool.name, tool.wait)"
              >
                <v-list-item-icon>
                  <v-icon>
                    {{ tool.icon || '$tools' }}
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ tool.label || tool.name }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider
                v-else
                :key="`sep=${index}`"
              />
            </template>
          </v-list>
        </v-menu>
      </app-btn-collapse-group>
    </template>
    <toolhead />
    <manual-probe-dialog
      v-if="manualProbeDialogOpen"
      v-model="manualProbeDialogOpen"
    />
    <bed-screws-adjust-dialog
      v-if="bedScrewsAdjustDialogOpen"
      v-model="bedScrewsAdjustDialogOpen"
    />
    <screws-tilt-adjust-dialog
      v-if="screwsTiltAdjustDialogOpen"
      v-model="screwsTiltAdjustDialogOpen"
    />
    <CalibratePidDialog
      v-if="isOpenPidDialog"
      v-model="isOpenPidDialog"
      @startCalibrate="sendCalibratePid"
    />
    <BeltTensionDialog
      v-if="isOpenBeltDialog"
      v-model="isOpenBeltDialog"
      @cancel="isOpenBeltDialog = false"
    />
    <DiagnosticsDialog
      v-if="isOpenDiagnosticsDialog"
      v-model="isOpenDiagnosticsDialog"
      @end="isOpenDiagnosticsDialog = false"
    />
  </collapsable-card>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import StateMixin from '@/mixins/state'
import ToolheadMixin from '@/mixins/toolhead'
import Toolhead from './Toolhead.vue'
import type { Macro } from '@/store/macros/types'
import type { Probe } from '@/store/printer/types'
import type { Heater } from '@/store/printer/types'
import CalibratePidDialog from '@/components/widgets/thermals/CalibratePidDialog.vue'
import BeltTensionDialog from '@/components/common/BeltTensionDialog.vue'
import DiagnosticsDialog from '@/components/common/DiagnosticsDialog.vue'

type Tool = {
  name: string,
  label?: string,
  disabled?: boolean,
  wait?: string,
  icon?: string,
}
@Component({
  components: {
    Toolhead,
    CalibratePidDialog,
    BeltTensionDialog,
    DiagnosticsDialog
  }
})
export default class ToolheadCard extends Mixins(StateMixin, ToolheadMixin) {
  manualProbeDialogOpen = false
  bedScrewsAdjustDialogOpen = false
  screwsTiltAdjustDialogOpen = false
  isOpenPidDialog = false
  isOpenBeltDialog = false
  isOpenDiagnosticsDialog = false

  @Prop({ type: Boolean })
  readonly menuCollapsed?: boolean

  get printerSettings () {
    return this.$store.getters['printer/getPrinterSettings']()
  }

  get printerSupportsQuadGantryLevel (): boolean {
    return 'quad_gantry_level' in this.printerSettings
  }

  get printerSupportResonanceTester (): boolean {
    return 'resonance_tester' in this.printerSettings
  }

  get printerSupportsZTiltAdjust (): boolean {
    return 'z_tilt' in this.printerSettings
  }

  get printerSupportsBedScrewsAdjust (): boolean {
    return 'bed_screws' in this.printerSettings
  }

  get printerSupportsBedScrewsCalculate (): boolean {
    return 'screws_tilt_adjust' in this.printerSettings
  }

  get printerSupportsBedTiltCalibrate (): boolean {
    return 'bed_tilt' in this.printerSettings
  }

  get printerSupportsDeltaCalibrate (): boolean {
    return 'delta_calibrate' in this.printerSettings
  }

  get printerSupportsProbeCalibrate (): boolean {
    return 'probe' in this.printerSettings || 'bltouch' in this.printerSettings
  }

  get printerSupportsZEndstopCalibrate (): boolean {
    return (
      'stepper_z' in this.printerSettings &&
      'z_position_endstop' in this.printerSettings.stepper_z
    )
  }

  get probe (): Probe | undefined {
    return this.$store.getters['printer/getProbe'] as Probe | undefined
  }

  get isUsingMagnetProbe(): boolean | undefined {
    return this.probe?.is_using_magnet_probe
  }

  get loadFilamentMacro (): Macro | undefined {
    return this.$store.getters['macros/getMacroByName'](
      'load_filament',
      'filament_load',
      'm701') as Macro | undefined
  }

  get unloadFilamentMacro (): Macro | undefined {
    return this.$store.getters['macros/getMacroByName'](
      'unload_filament',
      'filament_unload',
      'm702') as Macro | undefined
  }

  get cleanNozzleMacro (): Macro | undefined {
    return this.$store.getters['macros/getMacroByName'](
      'clean_nozzle',
      'nozzle_clean',
      'wipe_nozzle',
      'nozzle_wipe',
      'g12') as Macro | undefined
  }

  get availableTools () {
    const tools: Tool[] = []
    const loadFilamentMacro = this.loadFilamentMacro
    if (loadFilamentMacro) {
      const ignoreMinExtrudeTemp = loadFilamentMacro.variables?.ignore_min_extrude_temp ?? false
      tools.push({
        name: loadFilamentMacro.name.toUpperCase(),
        label: this.$tc("app.tool.title.load_filament"), //loadFilamentMacro.name === 'm701' ? 'M701 (Load Filament)' : undefined,
        icon: '$loadFilament',
        disabled: !(ignoreMinExtrudeTemp || this.extruderReady)
      })
    }
    const unloadFilamentMacro = this.unloadFilamentMacro
    if (unloadFilamentMacro) {
      const ignoreMinExtrudeTemp = unloadFilamentMacro.variables?.ignore_min_extrude_temp ?? false
      tools.push({
        name: unloadFilamentMacro.name.toUpperCase(),
        label: this.$tc("app.tool.title.unload_filament"), //unloadFilamentMacro.name === 'm702' ? 'M702 (Unload Filament)' : undefined,
        icon: '$unloadFilament',
        disabled: !(ignoreMinExtrudeTemp || this.extruderReady)
      })
    }

    const cleanNozzleMacro = this.cleanNozzleMacro
    if (cleanNozzleMacro) {
      tools.push({
        name: cleanNozzleMacro.name.toUpperCase(),
        label: cleanNozzleMacro.name === 'g12' ? 'G12 (Clean the Nozzle)' : undefined,
        icon: '$cleanNozzle'
      })
    }

    if (tools.length > 0) {
      tools.push({
        name: '-'
      })
    }

    tools.push({
      name: 'GET_MAGNET_PROBE',
      label: this.$tc("app.tool.title.get_magnet_probe"),
      icon: '$magnetOn',
      disabled: this.isUsingMagnetProbe,
      wait: this.$waits.onGetMagnetProbe
    })
    tools.push({
      name: 'RETURN_MAGNET_PROBE',
      label: this.$tc("app.tool.title.return_magnet_probe"),
      icon: '$magnetOff',
      disabled: !this.isUsingMagnetProbe,
      wait: this.$waits.onReturtMagnetProbe
    })
    tools.push({
        name: '-'
      })

    if (this.printerSupportsBedScrewsAdjust) {
      tools.push({
        name: 'BED_SCREWS_ADJUST',
        label: this.$tc("app.tool.title.bed_screws_adjust"),
        disabled: this.isBedScrewsAdjustActive,
        wait: this.$waits.onBedScrewsAdjust
      })
    }
    if (this.printerSupportsBedTiltCalibrate) {
      tools.push({
        name: 'BED_TILT_CALIBRATE',
        label: this.$tc("app.tool.title.bed_tilt_calculate"),
        disabled: !this.allHomed || this.isManualProbeActive,
        wait: this.$waits.onBedTiltCalibrate
      })
    }
    if (this.printerSupportsDeltaCalibrate) {
      tools.push({
        name: 'DELTA_CALIBRATE',
        label: this.$tc("app.tool.title.delta_calibrate"),
        disabled: !this.allHomed || this.isManualProbeActive,
        wait: this.$waits.onDeltaCalibrate
      })
    }
    tools.push({
      name: 'MANUAL_PROBE',
      label: this.$tc("app.tool.title.manual_probe"),
      disabled: this.isManualProbeActive,
      wait: this.$waits.onManualProbe
    })
    if (this.printerSupportsProbeCalibrate) {
      tools.push({
        name: 'PROBE_ACCURACY',
        label: this.$tc("app.tool.title.probe_accuracy"),
        disabled: this.isManualProbeActive,
        wait: this.$waits.onProbeAccuracy
      })
      tools.push({
        name: 'PROBE_CALIBRATE SAMPLES=3',
        label: this.$tc("app.tool.title.probe_calibrate"),
        disabled: this.isManualProbeActive,
        wait: this.$waits.onProbeCalibrate
      })
    }
    if (this.printerSupportsQuadGantryLevel) {
      tools.push({
        name: 'QUAD_GANTRY_LEVEL',
        label: this.$tc("app.tool.title.quad_gantry_level"),
        disabled: !this.allHomed || this.isManualProbeActive,
        wait: this.$waits.onQGL
      })
    }
    if (this.printerSupportsBedScrewsCalculate) {
      tools.push({
        name: 'SCREWS_TILT_CALCULATE',
        label: this.$tc("app.tool.title.screws_tilt_calculate"),
        disabled: this.isManualProbeActive,
        wait: this.$waits.onBedScrewsCalculate
      })
    }
    if (this.printerSupportsZEndstopCalibrate) {
      tools.push({
        name: 'Z_ENDSTOP_CALIBRATE',
        label: this.$tc("app.tool.title.z_endstop_calibrate"),
        disabled: !this.allHomed || this.isManualProbeActive,
        wait: this.$waits.onZEndstopCalibrate
      })
    }
    if (this.printerSupportsZTiltAdjust) {
      tools.push({
        name: 'Z_TILT_ADJUST',
        label: this.$tc("app.tool.title.z_tilt_adjust"),
        disabled: this.isManualProbeActive || this.printerPrinting,
        wait: this.$waits.onZTilt
      })
    }
    if (this.printerSupportResonanceTester) {
      tools.push({
        name: '-' 
      })
      tools.push({
        name: 'MEASURE_AXES_NOISE',
        icon: '$sineWave',
        label: this.$tc("app.tool.title.measure_axes_noise"),
        disabled: this.isManualProbeActive || this.printerPrinting,
        wait: this.$waits.onMeasureAxesNoise
      })
      // tools.push({
      //   name: 'TEST_RESONANCES',
      //   icon: '$sineWave',
      //   label: this.$tc("app.tool.title.test_resonances"),
      //   disabled: this.isManualProbeActive,
      //   wait: this.$waits.onTestResonances
      // })
      tools.push({
        name: 'SHAPER_CALIBRATE',
        icon: '$sineWave',
        label: this.$tc("app.tool.title.shaper_calibrate"),
        disabled: this.isManualProbeActive || this.printerPrinting,
        wait: this.$waits.onShaperCalibrate
      })
      tools.push({
        name: 'belt_tension',
        icon: '$sineWave',
        label: this.$tc("app.tool.title.belt_tension"),
        disabled: this.isManualProbeActive || this.printerPrinting,
        wait: this.$waits.onBeltTension
      })
    }
    if (this.heatersSupportPid)
    tools.push({
        name: '-' 
      })
    tools.push({
      name: 'calibrate_heater_pid',
      icon: '$fire',
      label: this.$tc("app.tool.title.pid_calibrate"),
      disabled: this.isManualProbeActive ||this.printerPrinting,
      wait: this.$waits.onPidCalibrate
    })
    // tools.push({
    //   name: '-' 
    // })
    // tools.push({
    //   name: 'diagnostics',
    //   label: this.$tc("app.tool.title.diagnostics"),
    //   disabled: this.isManualProbeActive || this.printerPrinting
    // })
    return tools
  }
  
  get printerSupportsForceMove () {
    return (
      (this.printerSettings.force_move?.enable_force_move ?? false) &&
      !this.hasRoundBed
    )
  }

  get heatersSupportPid (): boolean {
    let heaters: Heater[] = this.$store.getters['printer/getHeaters']
    return heaters.find(heater => heater.control === 'pid') ? true : false
  }
  
  get hasSteppersEnabled (): boolean {
    return this.$store.getters['printer/getHasSteppersEnabled'] as boolean
  }

  get hasRoundBed (): boolean {
    return this.$store.getters['printer/getHasRoundBed'] as boolean
  }

  get showManualProbeDialogAutomatically () {
    return this.$store.state.config.uiSettings.general.showManualProbeDialogAutomatically
  }

  get showBedScrewsAdjustDialogAutomatically () {
    return this.$store.state.config.uiSettings.general.showBedScrewsAdjustDialogAutomatically
  }

  get showScrewsTiltAdjustDialogAutomatically () {
    return this.$store.state.config.uiSettings.general.showScrewsTiltAdjustDialogAutomatically
  }

  get forceMove () {
    return this.$store.state.config.uiSettings.toolhead.forceMove
  }

  @Watch('isManualProbeActive')
  onIsManualProbeActive (value: boolean) {
    if (
      value &&
      this.showManualProbeDialogAutomatically &&
      this.klippyReady &&
      !this.printerPrinting
    ) {
      this.manualProbeDialogOpen = true
    }
  }

  @Watch('isBedScrewsAdjustActive')
  onIsBedScrewsAdjustActive (value: boolean) {
    if (
      value &&
      this.showBedScrewsAdjustDialogAutomatically &&
      this.klippyReady &&
      !this.printerPrinting
    ) {
      this.bedScrewsAdjustDialogOpen = true
    }
  }

  // @Watch('hasScrewsTiltAdjustResults')
  // onHasScrewsTiltAdjustResults (value: boolean) {
  //   this.screwsTiltAdjustDialogOpen = (
  //     value &&
  //     this.showScrewsTiltAdjustDialogAutomatically &&
  //     this.klippyReady &&
  //     !this.printerPrinting
  //   )
  // }
  
  sendCalibratePid(heater: string, temperatures: number[]) {
    this.sendGcode(`CALIBRATE_HEATER_PID HEATER=${heater} TEMPERATURES=${temperatures.join(',')}`, this.$waits.onPidCalibrate)
  }

  async toggleForceMove () {
    const result = (
      this.forceMove ||
      !this.$store.state.config.uiSettings.general.forceMoveToggleWarning ||
      await this.$confirm(
        this.$tc('app.general.simple_form.msg.confirm_forcemove_toggle'),
        { title: this.$tc('app.general.label.confirm'), color: 'card-heading', icon: '$warning',
          buttonTrueText: this.$tc('app.general.btn.yes'),  buttonFalseText: this.$tc('app.general.btn.no') }
      )
    )
    if (result) {
      this.$store.dispatch('config/saveByPath', {
        path: 'uiSettings.toolhead.forceMove',
        value: !this.forceMove,
        server: false
      })
    }
  }
  
}
</script>