import type { ActionTree } from 'vuex'
import type { PrinterState } from './types'
import type { RootState } from '../types'
import { handlePrintStateChange, handleCurrentFileChange, handleExcludeObjectChange } from '../helpers'
import { handleAddChartEntry, handleSystemStatsChange, handleMcuStatsChange } from '../chart_helpers'
import { SocketActions } from '@/api/socketActions'
import { Globals } from '@/globals'
import { consola } from 'consola'
import type { DiagnosticsCardContainer } from '@/store/diagnostics/types'
import sandboxedEval from '@/plugins/sandboxedEval'
import i18n from '@/plugins/i18n'
// let retryTimeout: number

export const actions: ActionTree<PrinterState, RootState> = {
  /**
   * Reset our store
   */
  async reset ({ commit }) {
    commit('setReset')
  },

  /**
   * Printer Info
   */
  async onPrinterInfo ({ commit }, payload) {
    commit('setPrinterInfo', payload)
  },

  /*      NEW      */

  async onGetAutoOff ({ commit }, payload) {
    commit('setAutoOff', payload)
  },

  async onGetIsOpenRebootDialog ({ commit }, payload) {
    commit('setIsOpenRebootDialog', payload)
  },

  async onGetRebootDialogMessage ({ commit }, payload) {
    commit('setRebootDialogMessage', payload)
  },

  async onGetCanReboot ({ commit }, payload) {
    commit('setCanReboot', payload)
  },

  async onGetWatchBedMesh ({ commit }, payload) {
    commit('setWatchBedMesh', payload)
  },

  async onGetAutoloadBedMesh ({ commit }, payload) {
    commit('setAutoloadBedMesh', payload)
  },

  async onGetLedStatus ({ commit }, payload) {
    commit('setLedStatus', payload)
  },

  async onGetAutoEnable ({ commit }, payload) {
    commit('setAutoOffEnable', payload)
  },

  async onGetScrewImage ({ commit }, payload) {
    commit('setScrewImage', payload)
  },

  async onGetHeatersIsWaiting ({ commit }, payload) {
    commit('setHeatersIsWaiting', payload)
  },

  // async onOpenMessage({ commit }, payload) {
  //   alert(payload)
  //   EventBus.$emit(payload.message, { type: payload.message_type, timeout: 5000})
  // },
  /*    END NEW    */
  /**
   * Query endstops
   */
  async onQueryEndstops ({ commit }, payload) {
    commit('setQueryEndstops', payload)
  },

  /**
   * Print cancelled confirmation.
   * Fires as a part of a socket action.
   */
  async onPrintCancel () {
    consola.debug('Print Cancelled')
  },

  /**
   * Print paused confirmation.
   * Fires as a part of a socket action.
   */
  async onPrintPause () {
    consola.debug('Print Paused')
  },

  /**
   * Print resumed confirmation.
   * Fires as a part of a socket action.
   */
  async onPrintResume () {
    consola.debug('Print Resumed')
  },

  /**
   * Print start confirmation.
   * Fires as a watch on a printer state change.
   */
  async onPrintStart (_, payload) {
    consola.debug('Print start detected', payload)
  },

  /**
   * Print end confirmation.
   * Fires as a watch on a printer state change.
   */
  async onPrintEnd (_, payload) {
    consola.debug('Print end detected', payload)
  },

  /**
   * ==========================================================================
   *  Non specific socket requests
   * ==========================================================================
   */

  /**
   * Stores the printers object list.
   */
  async onPrinterObjectsList ({ commit }, payload) {
    // Given our object list, subscribe to any data we'd want constant updates for
    // and prepopulate our store.
    let intendedSubscriptions = {}
    payload.objects.forEach((k: string) => {
      if (!k.includes('menu')) {
        intendedSubscriptions = { ...intendedSubscriptions, [k]: null }
      }
      let key = k
      if (k.includes(' ')) key = key.replace(' ', '.')
      commit('printer/setPrinterObjectList', key, { root: true })
    })

    SocketActions.printerObjectsSubscribe(intendedSubscriptions)
  },

  async onPrinterObjectsSubscribe ({ commit, dispatch }, payload) {
    // Initial printer status
    const status = payload.status

    if ('screws_tilt_adjust' in status) {
      status.screws_tilt_adjust = {}
    }

    if ('toolhead' in status) {
      if ('max_accel_to_decel' in status.toolhead) {
        status.toolhead.minimum_cruise_ratio = null
      } else {
        status.toolhead.max_accel_to_decel = null
      }
    }

    // Accept notifications, and commit the first subscribe.
    commit('socket/setAcceptNotifications', true, { root: true })
    await dispatch('onNotifyStatusUpdate', status)

    SocketActions.serverGcodeStore()
    SocketActions.printerGcodeHelp()
    SocketActions.serverTemperatureStore()
  },

  async onPrinterObjectsQuery ({ commit }, payload) {
    return
  },

  /**
   * ==========================================================================
   * Automated notifications via socket
   * Note that klipper will send an update every 250ms, if the data CHANGED.
   * This applies per object subscribed - which can add up.
   * ==========================================================================
   */

  /** Automated notify events via socket */
  async onNotifyStatusUpdate ({ rootState, commit, getters, dispatch }, payload) {
    // TODO: We potentially get many updates here.
    // Consider caching the updates and sending them every <interval>.
    // We don't want to miss an update - but also don't need all of them
    // so quickly.

    // Do NOT accept notification updates until our subscribe comes back.
    // This is because moonraker currently sends notification updates
    // prior to subscribing on browser refresh.
    if (payload && rootState.socket.acceptingNotifications) {
      // Detect a printing state change.
      // We do this prior to commiting the notify so we can
      // compare the before and after.
      handleCurrentFileChange(payload, rootState, commit)
      handlePrintStateChange(payload, rootState, dispatch)
      handleExcludeObjectChange(payload, rootState, dispatch)
      handleSystemStatsChange(payload, rootState, commit)
      handleMcuStatsChange(payload, rootState, commit)

      for (const key in payload) {
        const val = payload[key]
        // Commit the value.
        commit('printer/setSocketNotify', { key, payload: val }, { root: true })
      }

      // Add a temp chart entry
      const rootStateServerConfig = rootState.server.config
      const retention =
        rootStateServerConfig?.data_store?.temperature_store_size ??
        rootStateServerConfig?.server?.temperature_store_size ??
        Globals.CHART_HISTORY_RETENTION
      handleAddChartEntry(retention, rootState, commit, getters)
      dispatch('onDiagnosticsMetricsUpdate')
    }
  },

  async onFastNotifyStatusUpdate ({ rootState, commit, dispatch }, payload) {
    // Do NOT accept updates until our subscribe comes back.
    // This is because moonraker currently sends notification updates
    // prior to subscribing on browser refresh.
    if (payload && rootState.socket.acceptingNotifications) {
      commit('printer/setSocketNotify', payload, { root: true })
      dispatch('onDiagnosticsMetricsUpdate')
    }
  },

  async onDiagnosticsMetricsUpdate ({ rootState, commit, rootGetters }) {
    if (!rootState.config.uiSettings.general.enableDiagnostics) return
    const layout = rootState.layout.layouts.diagnostics as DiagnosticsCardContainer
    const metrics = Object.values(layout)
      .flat()
      .map(card => card.axes)
      .flat()
      .filter(axis => axis.enabled)
      .map(axis => axis.metrics)
      .flat()

    const collectors = Array.from(new Set(metrics.map(metric => metric.collector)))
    let data

    try {
      data = sandboxedEval(`
      const printer = ${JSON.stringify(rootState.printer.printer)}
      const collectors = ${JSON.stringify(collectors)}
      const result = { }

      for (const collector of collectors) {
        try {
          result[collector] = eval(collector)
        } catch (err) {
          result[collector] = err.message
        }
      }

      return JSON.stringify(result) // in order to only return serializable data
    `, 'metrics')

      if (typeof data !== 'string') throw new Error('Metrics collector returned invalid data')
      data = JSON.parse(data)
    } catch (err) {
      data = Object.fromEntries(collectors.map(collector => [collector, (err instanceof Error && err.message) ?? i18n.tc('app.printer.errors.unknown_error')]))
    }

    data.date = new Date()

    commit('charts/setChartEntry', {
      type: 'diagnostics',
      retention: rootGetters['charts/getChartRetention'],
      data
    }, { root: true })
  }
}
