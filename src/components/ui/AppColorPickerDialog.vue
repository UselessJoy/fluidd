<template>
    <v-menu
      v-model="menu"
      bottom
      left
      :close-on-content-click="false"
      min-width="300"
      max-width="400"
    >
      <template #activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          :color="buttonColor || controlColor.hexString"
          outlined
          small
          v-on="on"
        >
          {{ title }}
        </v-btn>
      </template>
      <v-card ref="card">
        <v-card-title
          v-if="title"
          class="card-heading mb-2"
        >
          {{ title }}
        </v-card-title>
        <v-card-text>
          <v-icon
            v-if="supportedChannels !== 'W'"
            :color="primaryColor.hexString"
            large
          >
            $circle
          </v-icon>
  
          <v-icon
            v-if="supportedChannels.includes('W')"
            :color="whiteColor.hexString"
            large
          >
            $circle
          </v-icon>
  
          <v-layout
            align-center
            column
          >
            <!-- standard full color picker -->
            <app-iro-color-picker
              v-if="supportedChannels !== 'W'"
              :color="primaryColor.hexString"
              :options="primaryOptions"
              @color:change="handleColorChange('primary', $event)"
            />
  
            <!-- white channel color picker -->
            <app-iro-color-picker
              v-if="supportedChannels.includes('W')"
              class="mt-4"
              :color="whiteColor.hexString"
              :options="whiteOptions"
              @color:change="handleColorChange('white', $event)"
            />
          </v-layout>
  
          <v-layout
            class="mt-4"
            justify-space-between
          >
            <div
              v-if="supportedChannels !== 'W'"
              class="color-input"
            >
              <v-text-field
                v-model.number="primaryColor.rgb.r"
                dense
                hide-details
                outlined
              />
              <div>R</div>
            </div>
            <div
              v-if="supportedChannels !== 'W'"
              class="color-input"
            >
              <v-text-field
                v-model.number="primaryColor.rgb.g"
                dense
                hide-details
                outlined
              />
              <div>G</div>
            </div>
            <div
              v-if="supportedChannels !== 'W'"
              class="color-input"
            >
              <v-text-field
                v-model.number="primaryColor.rgb.b"
                dense
                hide-details
                outlined
              />
              <div>B</div>
            </div>
            <div
              v-if="supportedChannels.includes('W')"
              class="color-input"
            >
              <v-text-field
                v-model.number="whiteColor.rgb.r"
                dense
                hide-details
                outlined
              />
              <div>W</div>
            </div>
          </v-layout>
        </v-card-text>
        <v-card-actions>
            <v-spacer />
            <slot name="actions">
                <app-btn
                    color="primary"
                    text
                    :disabled="colorsString.length == 0"
                    @click="saveNewDefaultColor"
                >
                    {{ $t('app.general.btn.save_as_default_color') }}
                </app-btn>
            </slot>
      </v-card-actions>
      </v-card>
    </v-menu>
  </template>
  
<script lang="ts">
import { Component, Vue, Prop, Watch, Mixins, Ref } from 'vue-property-decorator'
import { Debounce } from 'vue-debounce-decorator'
import iro from '@jaames/iro'
import { IroColor } from '@irojs/iro-core'
import type { Led } from '@/store/printer/types';
import StateMixin from '@/mixins/state'

interface RgbwColor {
    r: number;
    g: number;
    b: number;
}

interface AppColor {
hexString: string;
rgb: RgbwColor;
}

interface PointerPosition {
x: number;
y: number;
}

type Channel = 'r' | 'g' | 'b' | 'w'

@Component({
components: {}
})
export default class AppColorPickerDialog extends Mixins(StateMixin) {
    // Expected color input. Can be a hex, rgbw etc.

    @Prop({ type: Object, required: true })
    readonly led!: Led

    @Prop({ type: String})
    readonly buttonColor?: string

    @Prop({ type: String })
    readonly white?: string

    @Prop({ type: String, default: '' })
    readonly title!: string

    @Prop({ type: Boolean })
    readonly dot?: boolean

    @Prop({ type: String, default: 'RGB' })
    readonly supportedChannels!: string

    menu = false
    channelLookup: Record<Channel, string> = { r: 'RED', g: 'GREEN', b: 'BLUE', w: 'WHITE' }
    colorsString: string = ""
    @Ref('card')
    readonly card!: Vue

    lastPointerPosition: PointerPosition = { x: 0, y: 0 }

    primaryColor: AppColor = {
        hexString: '#ffffff',
        rgb: { r: 255, g: 255, b: 255 }
    }

    whiteColor: AppColor = {
        hexString: '#ffffff',
        rgb: { r: 255, g: 255, b: 255 }
    }

    primaryOptions = {
        color: this.primaryColor,
        width: 208,
        layout: [
        {
            component: iro.ui.Wheel,
            options: {
            wheelLightness: false,
            wheelAngle: 270,
            wheelDirection: 'clockwise'
            }
        },
        {
            component: iro.ui.Slider,
            options: {
            sliderType: 'value'
            }
        }
        ]
    }

    whiteOptions = {
        color: this.whiteColor,
        width: 208,
        layout: [
        {
            component: iro.ui.Slider,
            options: {
            sliderType: 'value'
            }
        }
        ]
    }

    get controlColor () {
        return this.supportedChannels === 'W' ? this.whiteColor : this.primaryColor
    }
    @Watch('primaryColor', { deep: true })
    onPrimaryColorChange (value: AppColor) {
        // Update the hex to reflect changes. This covers off users adjusting
        // the rgb values independently.
        const c = new IroColor(value.rgb)
        if (c.hexString !== value.hexString) this.primaryColor.hexString = c.hexString
    }

    @Watch('whiteColor', { deep: true })
    onWhiteColorChange (value: AppColor) {
        // Update the hex to reflect changes. This covers off users adjusting
        // the rgb values independently.
        const c = new IroColor({ r: value.rgb.r, g: value.rgb.r, b: value.rgb.r })
        if (c.hexString !== value.hexString) this.whiteColor.hexString = c.hexString
    }

    @Watch('primary')
    onPrimaryChange (value: string) {
        if (value) {
            this.primaryColor = this.getColor(value)
        }
    }

    @Watch('white')
    onWhiteChange (value: string) {
        if (value) {
        this.whiteColor = this.getColor(value)
        }
    }
    get currentColor () {
        return this.convertFromNumberArray(this.led.default_color)
    }

    get iroCurrentColor () {
        const color = new IroColor(this.currentColor)

        return color.hexString
    }
    created () {
        this.primaryColor = this.getColor(this.iroCurrentColor)
        if (this.supportedChannels.includes('W') && this.white) this.whiteColor = this.getColor(this.white)
    }

    getColor (color: string) {
        const base = new iro.Color(color)
        return {
        hexString: base.hexString,
        rgb: {
            r: base.rgb.r,
            g: base.rgb.g,
            b: base.rgb.b
        }
        }
    }

    // handleColorChange (channel: string, color: IroColor) {
    //     const c = this.getColor(color.hexString)
    //     if (channel === 'primary') {
    //     this.primaryColor = c
    //     } else {
    //     this.whiteColor = c
    //     }

    //     this.$emit(`update:${channel}`, color)
    //     this.debouncedChange(channel, color)
    // }
    convertFromNumberArray (colorData: number[]) : Record<Channel, number> {
        const [r, g, b, w] = colorData.map(value => value * 255)

        return {
            r,
            g,
            b,
            w
        }
    }

    handleColorChange (channel: string, color: IroColor ) {
        const c = this.getColor(color.hexString)
        if (channel === 'primary') {
            this.primaryColor = c
        } else {
            this.whiteColor = c
        }
        const selectedColor = color.rgb
        const currentColor = this.convertFromNumberArray([selectedColor.r, selectedColor.g, selectedColor.b])
        const newColor: Record<Channel, number> = {
        ...currentColor,
        ...(channel === 'primary' ? selectedColor : { w: selectedColor.r })
        }

        const supportedChannels = this.supportedChannels.toLowerCase().split('') as Channel[]
        this.colorsString = supportedChannels.map(channel => `${this.channelLookup[channel]}=${Math.round(newColor[channel] * 1000 / 255) / 1000}`).join(' ')
        this.debouncedChange()
    }

    @Debounce(500)
    debouncedChange () {
        this.sendGcode(`SET_LED LED=${this.led.name} ${this.colorsString}`)
    }

    saveNewDefaultColor() {
        this.sendGcode(`SAVE_DEFAULT_COLOR NEOPIXEL=${this.led.name} ${this.colorsString}`)
    }

}
</script>

<style lang="scss" scoped>
    @import 'vuetify/src/styles/styles.sass';

    .color-input div {
        margin: 0 2px;
        text-align: center;
    }

    .theme--light .color-input div:not(:first-child) {
        color: rgba(map-get($material-light, 'text-color'), 0.45);
    }

    .theme--dark .color-input div:not(:first-child) {
        color: rgba(map-get($material-dark, 'text-color'), 0.45);
    }

    :deep(.v-text-field__slot input) {
        text-align: center;
    }

    :deep(.v-input--dense .v-input__slot) {
        min-height: 32px !important;
    }
</style>
  