import type { PrinterState } from './types'

/**
 * Maintains the state of the printer, by way of moonraker notifications.
 * We should never directly modify data here.
 */
export const defaultState = (): PrinterState => {
  return {
    printer: 
    {
      endstops: {},
      bed_mesh: {},
      heaters: {
        available_heaters: [],
        available_sensors: [],
        is_waiting: false
      },
      info: {
        state: '',
        state_message: ''
      },
      configfile: {
        warnings: [],
        save_config_pending: false,
        save_config_pending_items: {},
        config: {
          virtual_sdcard: {},
          pause_resume: {},
          display_status: {},
          'gcode_macro CANCEL_PRINT': {}
        },
        settings: {
          bed_mesh: {},
          fan: {},
          printer: {
            max_accel_to_decel: 500,
            minimum_cruise_ratio: 0.5,
            max_accel: 1000,
            max_velocity: 100,
            square_corner_velocity: 3,
            kinematics: 'none'
          },
          virtual_sdcard: {},
          pause_resume: {},
          display_status: {},
          'gcode_macro cancel_print': {},
          extruder: {
            max_extrude_only_velocity: 100,
            max_extrude_only_distance: 100
          }
        }
      },
      objects: [],
      idle_timeout: {
        state: ''
      },
      print_stats: {
        state: '',
        print_duration: 0,
        total_duration: 0,
        filament_used: 0,
        filename: ''
      },
      display_status: {
        progress: 0,
        message: ''
      },
      wifi_mode: {
        wifiMode: ''
      },
      screws_tilt_adjust: {
        errors: false,
        results: {}
      },
      resonance_tester: {
        saved: [],
        tmp: [],
        belt_tensions: [],
        active_belt_tension: '',
        active: ''
      },
      led_control: {
        led_status: '',
        enabled: true
      },
      messages: {
        last_message_eventtime: .0,
        message: "",
        message_type: "",
        is_open: false
      },
      pid_calibrate: {
        is_calibrating: false
      },
      screw_image: {
        imageCreated: false
      },
      autooff: {
        autoOff: false,
        timeAutoOff: 0,
        autoOff_enable: false
      },
      locale: {
        langs: [
          {
            name: "default",
            code: "def"
          }
        ],
        currentLang: "en"
      },
      safety_printing: {
        safety_enabled: false,
        is_doors_open: false,
        is_hood_open: false,
        luft_timeout: 3.0,
        luft_overload: false
      },
      virtual_sdcard: {
        file_position: 0,
        is_active: false,
        progress: 0,
        has_interrupted_file: false,
        interrupted_file: null,
        show_interrupt: false,
        watch_bed_mesh: false,
        autoload_bed_mesh: false
      },
      toolhead: {
        estimated_print_time: 0,
        homed_axes: '',
        max_accel: 0,
        max_accel_to_decel: null,
        minimum_cruise_ratio: null,
        max_velocity: 0,
        position: [0, 0, 0, 0],
        axis_minimum: [],
        axis_maximum: [],
        print_time: 0,
        square_corner_velocity: 0,
        extruder: ''
      },
      motion_report: {
        live_position: [0, 0, 0, 0],
        live_velocity: 0,
        live_extruder_velocity: 0
      },
      firmware_retraction: {
        retract_length: 0,
        unretract_extra_length: 0,
        unretract_speed: 0,
        retract_speed: 0
      },
      current_file: {
        estimated_time: 0,
        filament_total: 0,
        thumbnails: []
      },
      gcode: {
        commands: null,
        async_commands: null
      },
      gcode_move: {
        gcode_position: [0, 0, 0, 0],
        homing_origin: [],
        speed: 0
      },
      manual_probe: {
        is_active: false,
        z_position: null,
        z_position_lower: null,
        z_position_upper: null
      },
      bed_screws: {
        is_active: false,
        state: null,
        current_screw: 0,
        accepted_screws: 0
      },
      webhooks: {
        state: '',
        state_message: ''
      }
    }
  }
}

export const state = defaultState()
