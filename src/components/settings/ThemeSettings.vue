
<template>
  <div>
    <v-subheader id="theme">
      {{ $t('app.setting.title.theme') }}
    </v-subheader>
    <v-card
      :elevation="5"
      dense
      class="mb-4"
    >
      <app-setting :title="$t('app.setting.label.theme_preset')">
        <v-select
          v-model="themePreset"
          filled
          dense
          single-line
          hide-details="auto"
          :items="themePresets"
          item-value="icon.src"
          item-text="name"
          return-object
        />
      </app-setting>

      <v-divider />

      <app-setting :title="$t('app.setting.label.primary_color')">
        <app-btn
          outlined
          small
          color="primary"
          class="mr-2"
          @click="handleReset"
        >
          {{ $t('app.setting.btn.reset') }}
        </app-btn>

        <app-color-picker
          v-if="theme"
          :primary="themeColor"
          :title="$t('app.setting.btn.select_theme')"
          @change="handleChangeThemeColor"
        />
      </app-setting>

      <v-divider />

      <app-setting :title="$t('app.setting.label.dark_mode')">
        <v-switch
          v-model="isDark"
          hide-details
          class="mb-5"
          @click.native.stop
        />
      </app-setting>

      <v-divider />

      <app-setting :title="$t('app.setting.label.lighting_on')">
        <v-switch
          v-model="ledEnabled"
          hide-details
          class="mt-0 mb-4"
          @click.native.stop
        />
      </app-setting>
      
      <v-divider />

      <app-setting v-if="now_led == ledEnabled && now_led == true" :title="$t('app.setting.label.lighting_color')">
        <OutputItem v-for="(item, i) in allLeds"
            :key="item.key"
            :item="item"
          />
      </app-setting>

    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import StateMixin from '@/mixins/state'
import { IroColor } from '@irojs/iro-core'
import { SupportedTheme, ThemeConfig } from '@/store/config/types'
import ThemePicker from '../ui/AppColorPicker.vue'
import { Led } from '@/store/printer/types'
import OutputItem from '@/components/widgets/outputs/OutputItem.vue'

@Component({
  components: {
    ThemePicker,
    OutputItem
  }
})
export default class ThemeSettings extends Mixins(StateMixin) {
  preset: SupportedTheme | null = null
  now_led = false
  get allLeds () {
    const items: Array<Led> = [
      ...this.$store.getters['printer/getAllLeds']
    ]
    return items
  }
  
  get ledEnabled (): boolean {
    // console.log(this.$store.getters['printer/getLedStatus'].led_status)
    return this.now_led = this.$store.getters['printer/getLedStatus'] != 'disabled' ? true : false
  }

  set ledEnabled (value: boolean) {
    this.now_led = value
    this.$store.dispatch('config/saveByPath', {
      path: 'uiSettings.general.led_enabled',
      value,
      server: true
    })
    value ? 
    this.sendGcode(`ENABLE_LED_EFFECTS`)
    :
    this.sendGcode(`DISABLE_LED_EFFECTS`)
  }


  get themePreset () {
    return this.$store.getters['config/getCurrentThemePreset']
  }

  set themePreset (d: SupportedTheme) {
    const value: ThemeConfig = {
      isDark: d.isDark,
      logo: d.logo,
      currentTheme: {
        primary: d.color
      }
    }

    this.setTheme(d.color, d.isDark)
    this.$store.dispatch('config/saveByPath', {
      path: 'uiSettings.theme',
      value,
      server: true
    })
  }

  get theme () {
    return this.$store.getters['config/getTheme']
  }

  get themeColor () {
    return this.theme.currentTheme.primary
  }
  
  handleChangeThemeColor (value: { channel: string; color: IroColor }) {
    this.setTheme(value.color.hexString, this.isDark)
    this.$store.dispatch('config/saveByPath', {
      path: 'uiSettings.theme.currentTheme.primary',
      value: value.color.hexString,
      server: true
    })
  }

  get isDark () {
    return this.theme.isDark
  }

  set isDark (value: boolean) {
    this.setTheme(this.themeColor, value)
    this.$store.dispatch('config/saveByPath', {
      path: 'uiSettings.theme.isDark',
      value,
      server: true
    })
  }

  get themePresets () {
    return this.$store.state.config.hostConfig.themePresets
  }

  setTheme (primary: string, isDark: boolean) {
    this.$vuetify.theme.dark = isDark
    this.$vuetify.theme.currentTheme.primary = primary
  }

  handleReset () {
    const d = this.$store.getters['config/getCurrentThemePreset']
    const value: ThemeConfig = {
      isDark: d.isDark,
      logo: d.logo,
      currentTheme: {
        primary: d.color
      }
    }
    this.setTheme(d.color, true)
    this.$store.dispatch('config/saveByPath', {
      path: 'uiSettings.theme',
      value,
      server: true
    })
  }
}
</script>
