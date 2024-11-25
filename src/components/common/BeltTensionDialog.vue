<template>
  <v-dialog
    v-model="open"
    :scrollable="scrollable"
    v-bind="$attrs"
    :title="$t('app.pid_calibrate.title.pid_calibrate_settings')"
    :save-button-text="$t('app.general.btn.accept')"
    width="40%"
    @save="sendBeltTension"
  >
    <v-card>
      <v-card-text>
        <v-simple-table
          class="no-hover mb-4"
        >
          <thead class="font-weight-medium">
            <tr>
              <th style="font-size: 16px;">
                {{ $t('app.shaper.label.graphs') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="tension in beltTensions"
              :key="tension"
            >
              <td class="">
                {{ tension.split('/').pop() }}
              </td>
              <td>
                <v-chip
                  v-if="tension === activeBeltTension"
                  small
                  block
                >
                  {{ $t('app.shaper.label.chosen') }}
                </v-chip>
              </td>
              <td
                class="text-right"
                nowrap
              >
                <v-tooltip
                  v-if="!(tension === activeBeltTension)"
                  bottom
                >
                  <template #activator="{ on, attrs }">
                    <app-btn
                      v-bind="attrs"
                      x-small
                      color=""
                      fab
                      text
                      @click="loadTension(tension)"
                      v-on="on"
                    >
                      <v-icon>$open</v-icon>
                    </app-btn>
                  </template>
                  <span>{{ $t('app.shaper.tooltip.load') }}</span>
                </v-tooltip>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>

      <div
        v-if="beltLoaded"
        class="d-flex justify-center ma-3"
      >
        <img
          :src="beltTensionURL"
          width="100%"
          height="auto"
        >
      </div>

      <v-divider />

      <v-card-actions class="justify-content-left">
        <app-btn
          :color="'primary'"
          type="button"
          :loading="hasWait($waits.onBeltTension)"
          @click="sendBeltTension"
        >
          {{ $tc('app.pid_calibrate.btn.belt_tension') }}
        </app-btn>
        <app-btn
          color="warning"
          text
          type="button"
          @click="handleCancel"
        >
          {{ $t('app.general.btn.cancel') }}
        </app-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Mixins, VModel, Prop, Watch } from 'vue-property-decorator'
import { SocketActions } from '@/api/socketActions'
import StateMixin from '@/mixins/state'
import FilesMixin from '@/mixins/files'

@Component({})
export default class BeltTensionDialog extends Mixins(StateMixin, FilesMixin) {
  @VModel({ type: Boolean })
    open?: boolean

  @Prop({ type: Boolean, default: true })
  readonly scrollable?: boolean

  beltTensionURL = ''
  beltLoaded = false

  get activeBeltTension (): string {
    return this.$store.getters['printer/getActiveBeltTension']
  }

  get beltTensions (): Array<string> {
    return this.$store.getters['printer/getBeltTensions']
  }

  @Watch('activeBeltTension')
  async onActiveBeltTension (value: string) {
    if (value === '') {
      this.beltLoaded = false
      this.beltTensionURL = ''
      return
    }
    const url = await this.createFileUrlWithToken(value)
    this.beltTensionURL = url
    this.beltLoaded = true
  }

  sendBeltTension () {
    this.sendGcode('BELT_TENSION', this.$waits.onBeltTension)
  }

  handleCancel () {
    this.$emit('cancel')
  }

  loadTension (tension: string) {
    SocketActions.setActiveTension(tension)
  }

  async mounted () {
    if (this.activeBeltTension !== '') {
      const url = await this.createFileUrlWithToken(this.activeBeltTension)
      this.beltTensionURL = url
      this.beltLoaded = true
    }
  }
}
</script>
