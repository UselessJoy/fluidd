<template>
  <div>
    <app-named-slider
      v-if="pwm"
      input-xs
      :label="pin.prettyName"
      :min="0"
      :max="pin.scale"
      :step="0.01"
      :value="value"
      :reset-value="pin.config.value || 0"
      :disabled="!klippyReady"
      :locked="isMobileViewport"
      :loading="hasWait(`${$waits.onSetOutputPin}${pin.name}`)"
      @submit="handleChange"
    />

    <app-named-switch
      v-if="pwm"
      :disabled="!klippyReady"
      :label="pin.prettyName"
      :value="pin.value > 0"
      :loading="hasWait(`${$waits.onSetOutputPin}${pin.name}`)"
      @submit="handleChange"
    />
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import StateMixin from '@/mixins/state'
import type { OutputPin as IOutputPin } from '@/store/printer/types'
import BrowserMixin from '@/mixins/browser'

@Component({})
export default class OutputPin extends Mixins(StateMixin, BrowserMixin) {
  @Prop({ type: Object, required: true })
  readonly pin!: IOutputPin

  get pwm () {
    return (
      this.pin.pwm ||
      this.pwmTypes.includes(this.pin.type)
    )
  }

  get pwmTypes () {
    return [
      'pwm_cycle_time',
      'pwm_tool'
    ]
  }

  get value () {
    return Math.round(this.pin.value * this.pin.scale * 100) / 100
  }

  handleChange (target: number) {
    if (!this.pwm) {
      target = target
        ? this.pin.scale
        : 0
    }
    this.sendGcode(`SET_PIN PIN=${this.pin.name} VALUE=${target}`, `${this.$waits.onSetOutputPin}${this.pin.name}`)
  }
}
</script>
