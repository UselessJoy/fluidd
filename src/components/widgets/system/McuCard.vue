<template>
  <collapsable-card
    :title="$t('app.system_info.label.mcu_information', {mcu: mcu.name})"
    icon="$chip"
  >
    <template #menu>
      <app-btn
        color=""
        fab
        x-small
        text
        class="ml-1"
        @click="showMcuInformationDialog"
      >
        <v-icon>$viewHeadline</v-icon>
      </app-btn>
    </template>

    <v-simple-table dense>
      <tbody>
        <tr>
          <th>{{ $t('app.system_info.label.micro_controller') }}</th>
          <td>{{ mcu.mcu_constants.MCU }}</td>
        </tr>
        <tr>
          <th>{{ $t('app.system_info.label.frequency') }}</th>
          <td>{{ $filters.getReadableFrequencyString(+mcu.mcu_constants.CLOCK_FREQ) }}</td>
        </tr>
        <tr>
          <th>{{ $t('app.system_info.label.version') }}</th>
          <td>{{ mcu.mcu_version }}</td>
        </tr>
      </tbody>
    </v-simple-table>

    <mcu-information-dialog
      v-if="mcuInformationDialogOpen"
      v-model="mcuInformationDialogOpen"
      :mcu="mcu"
    />
  </collapsable-card>
</template>

<script lang="ts">
import McuInformationDialog from './McuInformationDialog.vue'
import type { MCU } from '@/store/printer/types'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  components: {
    McuInformationDialog
  }
})
export default class PrinterStatsCard extends Vue {
  @Prop({ type: Object, required: true })
  readonly mcu!: MCU

  mcuInformationDialogOpen = false

  showMcuInformationDialog () {
    this.mcuInformationDialogOpen = true
  }
}
</script>
