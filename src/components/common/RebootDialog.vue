<template>
  <v-dialog
    v-model="open"
    max-width="650"
    persistent
  >
    <v-card>
      <v-card-title>
        <span class="headline">{{ title }}</span>
      </v-card-title>
      <v-card-text
        class="body-1 text-body-1 py-3"
        v-html="message"
      />
      <v-card-actions>
        <v-spacer />
        <slot name="actions">
          <app-btn
            color="primary"
            text="hi"
            @click="close"
          >
            {{ $t('app.general.btn.close') }}
          </app-btn>

          <app-btn
            color="primary"
            text
            @click="acceptReboot"
          >
            {{ $t('app.general.btn.reboot') }}
          </app-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Mixins, VModel } from 'vue-property-decorator'
import StateMixin from '@/mixins/state'
import ServicesMixin from '@/mixins/services'
import { SocketActions } from '@/api/socketActions'

@Component({})
export default class RebootDialog extends Mixins(StateMixin, ServicesMixin) {
  @VModel({ type: Boolean })
    open!: boolean

  get title () {
    return this.$t('app.version.status.updating')
  }

  get buttonTitle () {
    return this.$t('app.general.btn.reboot')
  }

  get message () {
    return this.$store.getters['printer/getDialogMessage']
  }

  get has_uninstalled_updates () {
    return this.$store.getters['printer/getHasUninstalledUpdates']
  }

  close () {
    if (!this.has_uninstalled_updates) {
      SocketActions.printerCloseDialog()
    }
    this.$destroy()
  }

  acceptReboot () {
    this.hostReboot()
  }
}
</script>
