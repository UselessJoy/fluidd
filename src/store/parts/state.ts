import type { PartsState } from './types'
import i18n from '@/plugins/i18n'
export const defaultState = (): PartsState => {
  return {
    parts: {},
    excludedParts: [],
    printState: i18n.tc('app.printer.state.unknown')
  }
}

export const state = defaultState()
