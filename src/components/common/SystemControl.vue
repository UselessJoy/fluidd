<template>
  <div>
    <div v-if="klippyConnected">
      <v-tooltip
        bottom
      >
        <template #activator="{ on, attrs }">
          <app-btn
            v-bind="attrs"
            block
            color="primary"
            class="me-2 mb-2"
            v-on="on"
            @click="restartKlippy"
          >
            {{ $t('app.general.btn.restart_config_klipper') }}
          </app-btn>
        </template>
        <span>{{ $t('app.general.tooltip.reload_klipper') }}</span>
      </v-tooltip>
    </div>

    <div v-else>
      <v-tooltip
        bottom
      >
        <template #activator="{ on, attrs }">
          <app-btn
            v-bind="attrs"
            block
            color="primary"
            class="me-2 mb-2"
            v-on="on"
            @click="serviceRestartKlipper"
          >
            {{ $t('app.general.btn.restart_service_klipper') }}
          </app-btn>
        </template>
        <span>{{ $t('app.general.tooltip.restart_klipper') }}</span>
      </v-tooltip>
    </div>

    <div v-if="klippyConnected">
      <v-tooltip
        bottom
      >
        <template #activator="{ on, attrs }">
          <app-btn
            v-bind="attrs"
            block
            color="primary"
            class="me-2 mb-2"
            v-on="on"
            @click="firmwareRestartKlippy"
          >
            {{ $t('app.general.btn.restart_firmware') }}
          </app-btn>
        </template>
        <span>{{ $t('app.general.tooltip.reload_restart_klipper') }}</span>
      </v-tooltip>
    </div>
    <app-btn
      block
      class="me-2 mb-2"
      @click="getKlippyLog()"
    >
      <v-icon
        left
        small
      >
        $download
      </v-icon>
      Klippy.log
    </app-btn>

    <app-btn
      block
      class="me-2 mb-2"
      @click="getMoonrakerLog()"
    >
      <v-icon
        left
        small
      >
        $download
      </v-icon>
      Moonraker.log
    </app-btn>
    <app-btn
      block
      class="me-2 mb-2"
      @click="() => {open = true}"
    >
      {{ $t('app.general.label.send_klippy_log') }}
    </app-btn>
    <send-logs-dialog
      v-if="open"
      v-model="open"
      @send="handleSendLogs"
    />
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import FilesMixin from '@/mixins/files'
import StateMixin from '@/mixins/state'
import ServicesMixin from '@/mixins/services'
import { SocketActions } from '@/api/socketActions'
import type { SendLogsMessage } from '@/store/config/types'

@Component({})
export default class SystemControl extends Mixins(StateMixin, FilesMixin, ServicesMixin) {
  description = ''
  open = false
  fields: string[] = []

  handleSendLogs (form_message: SendLogsMessage) {
    this.open = false
    SocketActions.serverSendLogs(form_message.name, form_message.phone, form_message.email, form_message.serial_number, form_message.description)
  }

  setField (text: string, index: number) {
    this.fields[index] = text
  }

  setDescription (text: string) {
    this.description = text
  }

  getMoonrakerLog () {
    this.downloadFile('moonraker.log', '')
  }

  getKlippyLog () {
    this.downloadFile('klippy.log', '')
  }
}
</script>
