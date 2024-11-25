<template>
  <v-dialog
    v-model="open"
    :scrollable="scrollable"
    v-bind="$attrs"
    :title="$t('app.pid_calibrate.title.pid_calibrate_settings')"
    :save-button-text="$t('app.general.btn.accept')"
    width="70%"
  >
    <v-card>
      <v-card-text>
        <v-simple-table
          class="no-hover mb-4"
        >
          <thead class="font-weight-medium">
            <tr>
              <th style="font-size: 16px;">
                {{ $t('app.diagnostics.label.tools') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <th>Ventilyatori</th>
                <outputs :only-controllable="true" />
              </td>
              <td>
                <v-checkbox
                  :label="$t('app.diagnostics.success')"
                  color="success"
                />
              </td>
            </tr>
            <tr>
              <td>
                <th>Proverka dverei i krishki</th>
                <v-row>
                  <v-col cols="6">
                    Krishka
                  </v-col>
                  <v-col cols="6">
                    Dveri
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <span>{{ hood_signal ? "open" : "close" }}</span>
                  </v-col>
                  <v-col cols="6">
                    <span>{{ door_signal ? "open" : "close" }}</span>
                  </v-col>
                </v-row>
              </td>
            </tr>
            <tr>
              <td>
                <th>Dvigateli</th>
                <toolhead-control-cross />
              </td>
            </tr>
            <tr>
              <td>
                <th>retrakt</th>
                <extruder-moves />
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>

      <v-divider />

      <v-card-actions class="justify-content-left">
        <app-btn
          color="warning"
          text
          type="button"
          @click="handleEnd"
        >
          {{ $t('app.general.btn.end') }}
        </app-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Mixins, VModel, Prop } from 'vue-property-decorator'
import StateMixin from '@/mixins/state'
import FilesMixin from '@/mixins/files'
import Outputs from '@/components/widgets/outputs/Outputs.vue'
import ToolheadControlCross from '@/components/widgets/toolhead/ToolheadControlCross.vue'
import ExtruderMoves from '@/components/widgets/toolhead/ExtruderMoves.vue'

@Component({
  components: {
    Outputs,
    ToolheadControlCross,
    ExtruderMoves
  }
})
export default class DiagnosticsDialog extends Mixins(StateMixin, FilesMixin) {
  @VModel({ type: Boolean })
    open?: boolean

  @Prop({ type: Boolean, default: true })
  readonly scrollable?: boolean

  get door_signal () {
    return this.$store.getters['printer/getSafetyPrinting'].is_doors_open
  }

  get hood_signal () {
    return this.$store.getters['printer/getSafetyPrinting'].is_hood_open
  }

  handleEnd () {
    this.$emit('end')
  }

  buzzSteppers () {
    return true
  }
}
</script>
