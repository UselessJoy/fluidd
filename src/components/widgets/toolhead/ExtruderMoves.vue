<template>
  <v-form
    ref="form"
    v-model="valid"
    @submit.prevent
  >
    <v-row justify="end">
      <v-col
        cols="6"
        class="text-right"
      >
        <v-text-field
          v-model.number="extrudeLength"
          :disabled="!klippyReady || !activeExtruder"
          :rules="[
            $rules.required,
            $rules.numberValid,
            $rules.numberGreaterThanOrEqual(0.1),
            maxExtrudeLengthRule
          ]"
          type="number"
          hide-details
          outlined
          dense
          :label="$t('app.general.label.extrude_length')"
          :suffix="$t('app.metrics.mm')"
          @focus="$event.target.select()"
        />
      </v-col>
      <v-col cols="6">
        <app-btn
          :disabled="!klippyReady || !extruderReady || !valid"
          block
          @click="sendRetractGcode(extrudeLength, extrudeSpeed, $waits.onExtrude)"
        >
          {{ $t('app.general.btn.retract') }}
          <v-icon>$chevronUp</v-icon>
        </app-btn>
      </v-col>
    </v-row>
    <v-row
      justify="end"
      class="mt-0"
    >
      <v-col
        cols="6"
        class="text-right"
      >
        <v-text-field
          v-model.number="extrudeSpeed"
          :disabled="!klippyReady || !activeExtruder"
          :rules="[
            $rules.required,
            $rules.numberValid,
            $rules.numberGreaterThanOrEqual(0.1),
            maxExtrudeSpeedRule
          ]"
          type="number"
          hide-details
          outlined
          dense
          :label="$t('app.general.label.extrude_speed')"
          :suffix="$t('app.suffix.mm/s')"
          @focus="$event.target.select()"
        />
      </v-col>
      <v-col cols="6">
        <app-btn
          :disabled="!klippyReady || !extruderReady || !valid"
          block
          @click="sendExtrudeGcode(extrudeLength, extrudeSpeed, $waits.onExtrude)"
        >
          {{ $t('app.general.btn.extrude') }}
          <v-icon>$chevronDown</v-icon>
        </app-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import { Component, Mixins, Ref, Watch } from 'vue-property-decorator'
import StateMixin from '@/mixins/state'
import ToolheadMixin from '@/mixins/toolhead'
import type { VForm } from '@/types'

@Component({})
export default class ExtruderMoves extends Mixins(StateMixin, ToolheadMixin) {
  @Ref('form')
  readonly form!: VForm

  valid = true

  get extrudeSpeed () {
    const extrudeSpeed = this.$store.state.config.uiSettings.toolhead.extrudeSpeed
    return extrudeSpeed === -1
      ? this.$store.state.config.uiSettings.general.defaultExtrudeSpeed
      : extrudeSpeed
  }

  set extrudeSpeed (value: number) {
    this.$store.dispatch('config/saveByPath', {
      path: 'uiSettings.toolhead.extrudeSpeed',
      value,
      server: false
    })
  }

  get extrudeLength () {
    const extrudeLength = this.$store.state.config.uiSettings.toolhead.extrudeLength
    return extrudeLength === -1
      ? this.$store.state.config.uiSettings.general.defaultExtrudeLength
      : extrudeLength
  }

  set extrudeLength (value: number) {
    this.$store.dispatch('config/saveByPath', {
      path: 'uiSettings.toolhead.extrudeLength',
      value,
      server: false
    })
  }

  @Watch('activeExtruder')
  activeExtruderChanged () {
    this.form.validate()
  }

  maxExtrudeLengthRule (value: number) {
    return this.$rules.numberLessThanOrEqual(this.maxExtrudeLength)(value)
  }

  maxExtrudeSpeedRule (value: number) {
    return this.$rules.numberLessThanOrEqual(this.maxExtrudeSpeed)(value)
  }

  sendRetractGcode (amount: number, rate: number, wait?: string) {
    if (this.valid) {
      const gcode = `M83
        G1 E-${amount} F${rate * 60}`
      this.sendGcode(gcode, wait)
    }
  }

  sendExtrudeGcode (amount: number, rate: number, wait?: string) {
    if (this.valid) {
      const gcode = `M83
        G1 E${amount} F${rate * 60}`
      this.sendGcode(gcode, wait)
    }
  }

  mounted () {
    this.form.validate()
  }
}
</script>
