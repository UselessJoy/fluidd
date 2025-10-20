import type { ConfigState } from './types'
import { Globals } from '@/globals'

export const defaultState = (): ConfigState => {
  return {
    apiUrl: '',
    socketUrl: '',
    layoutMode: false,
    containerColumnCount: 2,
    hostConfig: {
      endpoints: [],
      blacklist: [],
      hosted: false,
      themePresets: []
    },
    screw_image: {
      imageCreated: false
    },
    instances: [],
    uiSettings: {
      general: {
        instanceName: Globals.APP_NAME,
        locale: 'en',
        chartVisible: true,
        hideTempWaits: true,
        hideTimelapseMessages: true,
        axis: {
          x: { inverted: false },
          y: { inverted: false },
          z: { inverted: false }
        },
        defaultExtrudeLength: 10,
        defaultExtrudeSpeed: 5,
        defaultToolheadMoveLength: 1.0,
        defaultToolheadXYSpeed: 130,
        defaultToolheadZSpeed: 10,
        toolheadControlStyle: 'cross',
        toolheadMoveDistances: [0.1, 1, 10, 25, 50, 100],
        toolheadXYMoveDistances: [1, 10, 50],
        toolheadZMoveDistances: [0.1, 1, 10],
        toolheadCircleXYMoveDistances: [1, 10, 25, 50],
        toolheadCircleZMoveDistances: [0.1, 1, 10, 50],
        toolheadCircleXYHomingEnabled: false,
        useGcodeCoords: false,
        zAdjustDistances: [0.005, 0.01, 0.025, 0.050],
        enableVersionNotifications: true,
        confirmOnEstop: false,
        confirmOnPowerDeviceChange: false,
        confirmOnSaveConfigAndRestart: true,
        sectionsToIgnorePendingConfigurationChanges: [],
        dateFormat: 'iso',
        timeFormat: 'iso',
        textSortOrder: 'default',
        showRateOfChange: false,
        showRelativeHumidity: true,
        showBarometricPressure: true,
        showSaveConfigAndRestart: true,
        showGasResistance: true,
        showUploadAndPrint: true,
        flipConsoleLayout: false,
        cameraFullscreenAction: 'embed',
        topNavPowerToggle: null,
        showManualProbeDialogAutomatically: true,
        showBedScrewsAdjustDialogAutomatically: true,
        showScrewsTiltAdjustDialogAutomatically: true,
        forceMoveToggleWarning: true,
        printInProgressLayout: 'default',
        printProgressCalculation: ['file'],
        printEtaCalculation: ['file'],
        enableDiagnostics: false,
        thumbnailSize: 32,
        autoOff_enable: false,
        watch_bed_mesh: false,
        autoload_bed_mesh: false,
        lang: 'en',
        safety_enabled: false,
        enableQuiteMode: false,
        led_enabled: true,
        shown_registered_directories: []
      },
      theme: {
        isDark: true,
        logo: {
          src: 'logo_fluidd.svg'
        },
        color: '#2196F3',
        backgroundLogo: true
      },
      editor: {
        confirmDirtyEditorClose: true,
        autoEditExtensions: ['.cfg', '.conf', '.ini', '.log', '.sh', '.txt'],
        restoreViewState: 'session',
        codeLens: true
      },
      dashboard: {
        tempPresets: [
          { id: 0, name: 'PLA', values: { extruder: { value: 220, type: 'heater', active: true }, heater_bed: { value: 80, type: 'heater', active: true } } },
          { id: 0, name: 'ABS', values: { extruder: { value: 245, type: 'heater', active: true }, heater_bed: { value: 120, type: 'heater', active: true } } },
          { id: 0, name: 'PET-G', values: { extruder: { value: 235, type: 'heater', active: true }, heater_bed: { value: 80, type: 'heater', active: true } } },
          { id: 0, name: 'TPU', values: { extruder: { value: 235, type: 'heater', active: true }, heater_bed: { value: 80, type: 'heater', active: true } } }
        ]
      },
      tableHeaders: {
        gcodes_dashboard: [
          { value: 'first_layer_extr_temp', visible: false },
          { value: 'first_layer_bed_temp', visible: false },
          { value: 'chamber_temp', visible: false },
          { value: 'history.total_duration', visible: false },
          { value: 'history.print_duration', visible: false },
          { value: 'estimated_time', visible: false },
          { value: 'nozzle_diameter', visible: false },
          { value: 'slicer_version', visible: false },
          { value: 'slicer', visible: false },
          { value: 'history.filament_used', visible: false },
          { value: 'filament_name', visible: false },
          { value: 'filament_type', visible: false },
          { value: 'filament_total', visible: false },
          { value: 'filament_weight_total', visible: false },
          { value: 'object_height', visible: false },
          { value: 'first_layer_height', visible: false },
          { value: 'layer_height', visible: false }
        ],
        gcodes_jobs: [
          { value: 'first_layer_height', visible: false },
          { value: 'history.filament_used', visible: false },
          { value: 'slicer_version', visible: false },
          { value: 'history.print_duration', visible: false },
          { value: 'chamber_temp', visible: false },
          { value: 'first_layer_extr_temp', visible: false },
          { value: 'first_layer_bed_temp', visible: false }
        ],
        media_dashboard: [
          { value: 'first_layer_extr_temp', visible: false },
          { value: 'first_layer_bed_temp', visible: false },
          { value: 'chamber_temp', visible: false },
          { value: 'estimated_time', visible: false },
          { value: 'nozzle_diameter', visible: false },
          { value: 'slicer_version', visible: false },
          { value: 'slicer', visible: false },
          { value: 'filament_name', visible: false },
          { value: 'filament_type', visible: false },
          { value: 'filament_total', visible: false },
          { value: 'filament_weight_total', visible: false },
          { value: 'object_height', visible: false },
          { value: 'first_layer_height', visible: false },
          { value: 'layer_height', visible: false }
        ],
        media_jobs: [
          { value: 'first_layer_height', visible: false },
          { value: 'slicer_version', visible: false },
          { value: 'chamber_temp', visible: false },
          { value: 'first_layer_extr_temp', visible: false },
          { value: 'first_layer_bed_temp', visible: false }
        ],
        history: [
          { value: 'print_duration', visible: false },
          { value: 'filament_used', visible: false }
        ],
        job_queue: [
          { value: 'time_added', visible: true },
          { value: 'time_in_queue', visible: false }
        ],
        spoolman: []
      },
      gcodePreview: {
        extrusionLineWidth: 0.3,
        moveLineWidth: 0.1,
        retractionIconSize: 0.6,
        drawOrigin: true,
        drawBackground: true,
        showAnimations: true,
        minLayerHeight: 0.1,
        autoLoadOnPrintStart: false,
        autoLoadMobileOnPrintStart: false,
        autoFollowOnFileLoad: true,
        hideSinglePartBoundingBox: false,
        autoZoom: false,
        flip: {
          horizontal: false,
          vertical: true
        }
      },
      fileSystem: {
        activeFilters: {},
        sortBy: {},
        sortDesc: {}
      },
      toolhead: {
        forceMove: false,
        extrudeSpeed: -1,
        extrudeLength: -1
      },
      spoolman: {
        autoSpoolSelectionDialog: true,
        autoOpenQRDetectionCamera: null,
        autoSelectSpoolOnMatch: false,
        preferDeviceCamera: false,
        warnOnNotEnoughFilament: true,
        warnOnFilamentTypeMismatch: true,
        selectionDialogSortOrder: {
          key: 'last_used',
          desc: false
        }
      }
    }
  }
}

export const state = defaultState()
