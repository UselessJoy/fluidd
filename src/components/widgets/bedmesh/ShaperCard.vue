<template>
  <collapsable-card
    :title="$t('app.general.title.shaper')"
    :lazy="false"
    icon="$bedMesh"
    :draggable="!fullScreen"
    :collapsable="!fullScreen"
    layout-path="dashboard.shaper-card"
  >
    <v-card-text>
      <div v-if="graphLoaded" class="d-flex justify-center">
        <img :src="activeImageURL">
      </div>
      <span v-else>{{ $t('app.shaper.msg.not_loaded') }}</span>
    </v-card-text>
  </collapsable-card>
</template>
  
<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import FilesMixin from '@/mixins/files'
@Component({})
export default class ShaperCard extends Mixins(FilesMixin) {
  @Prop({ type: Boolean, default: false })
  readonly fullScreen!: boolean

  activeImageURL = ""
  graphLoaded = false

  get activeShaperGraph (): string {
    return this.$store.getters['printer/getActiveShaperGraph']
  }

  @Watch('activeShaperGraph')
  async onActiveShaperGraph (value: string) {
    if (value === "") {
      this.graphLoaded = false
      this.activeImageURL = ""
      return
    }
    const url = await this.createFileUrlWithToken(value)
    this.activeImageURL = url
    this.graphLoaded = true
  }

  async mounted() {
    if (this.activeShaperGraph !== '') {
      const url = await this.createFileUrlWithToken(this.activeShaperGraph)
      this.activeImageURL = url
      this.graphLoaded = true
    }
  }
}
</script>
