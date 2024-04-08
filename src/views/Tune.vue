<template>
  <v-row
    v-if="klippyReady"
    :dense="$vuetify.breakpoint.smAndDown"
  >
    <v-col
      v-if="supportsBedMesh"
      cols="12"
      md="8"
    >
      <bed-mesh-card fullscreen class="mb-2"/>
      <ShaperCard v-if="supportResonanceTester" fullscreen class="mb-2"/>
    </v-col>
    <v-col
      cols="12"
      md="4"
    >
      <bed-mesh-controls
        v-if="supportsBedMesh"
        class="mb-2 mb-sm-4"
      />
      <ShaperControls
        v-if="supportResonanceTester"
        class="mb-2 mb-sm-4"
      />
      <end-stops-card class="mb-2 mb-sm-4" />
      <runout-sensors-card v-if="supportsRunoutSensors" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import StateMixin from '@/mixins/state'

import BedMeshCard from '@/components/widgets/bedmesh/BedMeshCard.vue'
import BedMeshControls from '@/components/widgets/bedmesh/BedMeshControls.vue'
import EndStopsCard from '@/components/widgets/endstops/EndStopsCard.vue'
import RunoutSensorsCard from '@/components/widgets/runout-sensors/RunoutSensorsCard.vue'
import ShaperControls from '@/components/widgets/bedmesh/ShaperControls.vue'
import ShaperCard from '@/components/widgets/bedmesh/ShaperCard.vue'
@Component({
  components: {
    BedMeshCard,
    BedMeshControls,
    EndStopsCard,
    RunoutSensorsCard,
    ShaperControls,
    ShaperCard
  }
})
export default class Tune extends Mixins(StateMixin) {
  get supportsBedMesh (): boolean {
    return this.$store.getters['mesh/getSupportsBedMesh']
  }

  get supportsRunoutSensors (): number {
    return this.$store.getters['printer/getRunoutSensors'].length
  }

  get supportsEndstops (): boolean {
    const endStops = this.$store.getters['printer/getEndstops']
    return (Object.keys(endStops).length > 0)
  }

  get supportResonanceTester (): boolean {
    return this.$store.getters['printer/getPrinterSettings']('resonance_tester') ?? false
  }
}
</script>
