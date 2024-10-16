<template>
    <app-dialog
        v-model="open"
        :title="$t('app.pid_calibrate.title.pid_calibrate_settings')"
        :save-button-text="$t('app.general.btn.accept')"
        max-width="640"
        @save="handlePidCalibrate"
    >
        <v-card>
            <app-setting :title="$t('app.pid_calibrate.setting.heater')">
                <v-select
                        filled
                        dense
                        single-line
                        hide-details="auto"
                        :items="availableHeaters"
                        :value="currentHeater"
                        item-text="prettyName"
                        item-value="key"
                        @change="changeHeater"
                    />
            </app-setting>

            <v-divider/>

            <v-card-title>{{ $tc('app.pid_calibrate.setting.temps') }}</v-card-title>
            <v-card-text class="overflow-y-auto">
                <template v-for="(temperature, index) in temperatures">
                    <app-setting
                        :key="`temperature-${index}`"
                        :title="$t('app.pid_calibrate.setting.temp')"
                    >
                        <v-text-field
                            :value="temperature"
                            :rules="[
                                $rules.required,
                                $rules.numberValid,
                                $rules.numberGreaterThanOrEqual(minTemp || 40),
                                $rules.numberLessThanOrEqual(maxTemp || 300),
                                $rules.numberArrayUnique(temperatures, index)
                            ]"
                            :disabled="!klippyReady || printerPrinting"
                            hide-details="auto"
                            filled
                            dense
                            suffix="°C"
                            @input="setTemperature($event, index)"
                        />
                        <app-btn
                            color=""
                            class="ml-2"
                            fab
                            text
                            x-small
                            @click="removeTemperature(index)"
                        >
                            <v-icon color="">
                                $close
                            </v-icon>
                        </app-btn>
                    </app-setting>
                    <v-divider/>
                </template>
            </v-card-text >
            <v-card-actions class="justify-content-left">
                <app-btn
                    :color="'primary'"
                    type="button"
                    @click="addTemperature()"
                >
                    {{ $tc('app.pid_calibrate.btn.add_temperature') }}
                </app-btn>
            </v-card-actions>
        </v-card>
        <v-spacer />
    </app-dialog>
</template>
  
<script lang="ts">
import { Component, Mixins, VModel } from 'vue-property-decorator'
import StateMixin from '@/mixins/state'
import type { Heater } from '@/store/printer/types'
import type { TemperaturePreset } from '@/store/config/types'

@Component({})
export default class CalibratePidDialog extends Mixins(StateMixin) {
    @VModel({ type: Boolean })
    open?: boolean

    get availableHeaters (): Heater[] {
      let heaters: Heater[] = this.$store.getters['printer/getHeaters']
      return heaters.filter(heater => heater.control === 'pid')
    }
    
    currentHeater : string = ''
    temperatures: number[] = []
    minTemp = 40
    maxTemp = 300

    get presets (): TemperaturePreset[] {
        return this.$store.getters['config/getTempPresets']
    }

    changeHeater (value: string) {
        this.currentHeater = value

        this.availableHeaters.forEach(heater => {
            if (heater.name === this.currentHeater) {
                this.minTemp = heater.minTemp || 40
                this.maxTemp = heater.maxTemp || 300
            }
        })

        let temps: number[] = []
        if (this.currentHeater.startsWith('extruder')) {
            temps = [215, 235]
        }
        else if (this.currentHeater.startsWith('heater_bed')) {
            temps = [65, 85, 110]
        }
        let heaterPresets = this.presets.find(preset => {return preset.name === this.currentHeater})
        if (heaterPresets) {
            for (let key in heaterPresets.values) {
                temps.push(heaterPresets.values[key].value)
            }
        }
        this.temperatures = temps
    }

    handlePidCalibrate () {
        this.$emit('startCalibrate', this.currentHeater, this.temperatures.sort((a, b) => a - b))
        this.open = false
    }

    setTemperature (temp: number, index: number) {
        this.temperatures[index] = temp
    }

    addTemperature () {
        this.temperatures.push(0)
    }

    removeTemperature (index: number) {
        this.temperatures = this.temperatures.filter((temp, i) => { return i !== index})
    }

    mounted () {
        this.changeHeater(this.availableHeaters[0].key)
    }
}
</script>
  