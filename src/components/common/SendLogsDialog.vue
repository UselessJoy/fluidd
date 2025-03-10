<template>
  <app-dialog
    v-model="open"
    :title="$t('app.general.label.send_klippy_log')"
    :save-button-text="$t('app.general.label.send_klippy_log')"
    max-width="700"
    @save="handleSave"
  >
    <div class="overflow-y-auto">
      <app-setting
        :title="$t(`app.log_dialog.name`)"
      >
        <v-text-field
          v-model="message_logs.name"
          :placeholder="$t(`app.log_dialog.placeholder`)"
          :rules="[
          ]"
          hide-details="auto"
          filled
          dense
        />
      </app-setting>
      <v-divider />
      <app-setting
        :title="$t(`app.log_dialog.phone`)"
      >
        <v-text-field
          v-model="message_logs.phone"
          :placeholder="$t(`app.log_dialog.placeholder`)"
          :rules="[
            $rules.numberValid
          ]"
          hide-details="auto"
          filled
          dense
        />
      </app-setting>
      <v-divider />
      <app-setting
        :title="$t(`app.log_dialog.serial_number`)"
      >
        <v-text-field
          v-model="message_logs.serial_number"
          :rules="[
            $rules.required,
            $rules.numberValid,
            $rules.numberArrayLenIsEqualTo(6)
          ]"
          hide-details="auto"
          filled
          dense
        />
      </app-setting>
      <v-divider />
      <app-setting
        :title="$t(`app.log_dialog.email`)"
      >
        <v-text-field
          v-model="message_logs.email"
          :rules="[
            $rules.required,
            $rules.emailValid
          ]"
          hide-details="auto"
          filled
          dense
        />
      </app-setting>
      <v-divider />
      <app-setting :title="$t('app.log_dialog.description')">
        <v-textarea
          v-model="message_logs.description"
          rows="2"
          hide-details="auto"
          filled
          spellcheck="false"
          class="console-command"
        />
      </app-setting>
    </div>
  </app-dialog>
</template>

<script lang="ts">
import { Component, Vue, VModel } from 'vue-property-decorator'
import type { SendLogsMessage } from '@/store/config/types'

@Component({})
export default class SendLogsDialog extends Vue {
  @VModel({ type: Boolean })
    open?: boolean

  message_logs = {
    name: '',
    phone: '',
    email: '',
    description: '',
    serial_number: ''
  } as SendLogsMessage

  handleSave () {
    this.$emit('send', this.message_logs)
    this.open = false
  }
}
</script>

<style lang="scss" scoped>
  .console-command {
    font-family: monospace;
  }
</style>
