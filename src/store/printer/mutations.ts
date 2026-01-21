import Vue from 'vue'
import type { MutationTree } from 'vuex'
import type { PrinterState } from './types'
import { defaultState } from './state'
import { consola } from 'consola'
import { get } from 'lodash-es'

export const mutations: MutationTree<PrinterState> = {
  /**
   * Reset state
   */
  setReset (state) {
    Object.assign(state, defaultState())
  },

  setPrinterInfo (state, payload) {
    Vue.set(state.printer, 'info', payload)
  },
  /*      NEW      */

  setAutoOff (state, payload) {
    state.printer.autooff = payload
  },

  setFixDialogMessage (state, payload) {
    state.printer.fixing.dialog_message = payload
  },

  setRequireReboot (state, payload) {
    state.printer.fixing.require_reboot = payload
  },

  setRequireInternet (state, payload) {
    state.printer.fixing.require_internet = payload
  },

  setIsAllUpdated (state, payload) {
    state.printer.fixing.all_updated = payload
  },

  setIsUpdating (state, payload) {
    state.printer.fixing.updating = payload
  },

  setWatchBedMesh (state, payload) {
    state.printer.virtual_sdcard = payload
  },

  setAutoloadBedMesh (state, payload) {
    state.printer.virtual_sdcard = payload
  },

  setKlipperLang (state, payload) {
    state.printer.locale = payload
  },

  setSafetyPrinting (state, payload) {
    state.printer.safety_printing = payload
  },

  setQuiteMode (state, payload) {
    state.printer.quite_mode = payload
  },

  setLedStatus (state, payload) {
    state.printer.led_control = payload
  },

  setIsScrewImage (state, payload) {
    state.printer.screw_image = payload
  },

  setHeatersIsWaiting (state, payload) {
    state.printer.heaters = payload
  },
  /*    END NEW    */
  setQueryEndstops (state, payload) {
    state.printer.endstops = payload
  },

  setPrinterBusy (state, payload: boolean) {
    state.printer.busy = payload
  },

  setPrinterObjectList (state, payload) {
    if (!state.printer.objects.includes(payload)) {
      state.printer.objects.push(payload)
    }
  },

  setPrinterObjectQuery (state, payload) {
    if (!state.printer.objects.includes(payload)) {
      state.printer.objects.push(payload)
    }
  },

  setClearEndStops (state) {
    state.printer.endstops = {}
  },

  setClearScrewsTiltAdjust (state) {
    state.printer.screws_tilt_adjust = {}
  },

  setResetCurrentFile (state) {
    const newState = defaultState().printer.current_file
    consola.debug('resetting current file', newState)
    Vue.set(state.printer, 'current_file', newState)
  },

  setSocketNotify (state, payload) {
    if (typeof payload.payload === 'object') {
      const o = get(state.printer, payload.key)
      if (o === undefined) {
        // Object is not set yet, so create it.
        Vue.set(state.printer, payload.key, payload.payload)
      } else {
        Object.keys(payload.payload).forEach((p) => {
          // Leaving the if here, although it should
          // always evaluate true since we never
          // get an update unless something has changed.
          if (
            o[p] !== payload.payload[p]
          ) {
            Vue.set(state.printer[payload.key], p, payload.payload[p])
          }
        })
      }
    } else {
      // I don't think this'd get called.
      if (get(state.printer, payload.key) !== payload.payload) {
        Vue.set(state.printer, payload.key, payload.payload)
      }
    }
  }

}
