<template>
  <collapsable-card
    :title="$t('app.timelapse.title.timelapse_status')"
    icon="$info"
    class="mb-2 sb-sm-4"
  >
    <v-card-text>
      <v-row>
        <div
          v-if="frameCount"
          :style="{filter: isRendering ? `saturate(${renderProgress}%)` : 'none', position: 'relative', transform: 
            `rotateX(${camera?.flip_vertical ? 180 : 0}deg) 
            rotateY(${camera?.flip_horizontal ? 180 : 0}deg) 
            rotate(${camera?.rotation}deg)`, alignItems: 'center'}"
        >
          <img
            :src="previewUrl"
            class="mx-auto thumbnail"
            :style="{margin: `${camera?.rotation == 90 || camera?.rotation == 270 ? 20 : 0}%`}"
          >
        </div>
        <v-progress-circular
          v-if="isRendering"
          class="render-progress"
          color="primary"
          size="64"
          :value="renderProgress"
        />
        <camera-item
          v-if="!frameCount && camera"
          :camera="camera"
        />
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-layout justify-center>
            <app-named-slider
              v-model="selectedFrame"
              full-width
              :label="$tc('app.timelapse.label.frame')"
              :min="1"
              :max="frameCount"
              :suffix="`/ ${frameCount}`"
              :reset-value="frameCount"
              :disabled="!frameCount || isRendering"
            />
          </v-layout>
        </v-col>
      </v-row>
    </v-card-text>

    <v-divider />

    <v-card-actions>
      <v-spacer />
      <app-btn
        color="primary"
        text
        :disabled="!frameCount || savingFrames"
        @click="deleteFrames()"
      >
        {{ $t('app.timelapse.btn.delete_frames') }}
      </app-btn>

      <app-btn
        color="primary"
        text
        :disabled="!frameCount || savingFrames"
        @click="saveFrames()"
      >
        {{ $t('app.timelapse.btn.save_frames') }}
      </app-btn>

      <app-btn
        color="primary"
        :disabled="!frameCount || isRendering"
        @click="$emit('openRenderDialog', true)"
      >
        {{ $t('app.timelapse.btn.render') }}
      </app-btn>
    </v-card-actions>
  </collapsable-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import StateMixin from '@/mixins/state'
import FileSystem from '@/components/widgets/filesystem/FileSystem.vue'
import type { RenderStatus, TimelapseLastFrame, TimelapseSettings } from '@/store/timelapse/types'
import { SocketActions } from '@/api/socketActions'
import CameraItem from '@/components/widgets/camera/CameraItem.vue'
import FilesMixin from '@/mixins/files'
import type { WebcamConfig } from '@/store/webcams/types'

@Component({
  components: {
    CameraItem,
    FileSystem
  }
})
export default class StatusCard extends Mixins(StateMixin, FilesMixin) {
  selectedFrameNumber = 0

  saveFrames () {
    SocketActions.machineTimelapseSaveFrames(this.$waits.onTimelapseSaveFrame)
  }

  deleteFrames () {
    SocketActions.machineTimelapseDeleteFrames()
  }

  get savingFrames () {
    return this.hasWait(this.$waits.onTimelapseSaveFrame)
  }

  get selectedFrame () {
    return this.selectedFrameNumber || this.frameCount || 0
  }

  set selectedFrame (value: number) {
    this.selectedFrameNumber = value === this.frameCount ? 0 : value
  }

  get previewUrl () {
    const file = this.lastFrame?.file

    if (file) {
      const fullFile = this.selectedFrame
        ? `frame${this.selectedFrame.toString().padStart(6, '0')}.${file.split('.').pop()}`
        : file
      return this.createFileUrl(fullFile, 'timelapse_frames')
    }
  }

  get isRendering () {
    return this.renderStatus && this.renderStatus.status !== 'success'
  }

  get frameCount () {
    return this.lastFrame?.uniqueCount
  }

  get camera (): WebcamConfig | undefined {
    return this.$store.getters['webcams/getWebcamById'](this.settings.camera) as WebcamConfig | undefined
  }

  get settings (): TimelapseSettings {
    return this.$store.getters['timelapse/getSettings']
  }

  get lastFrame (): TimelapseLastFrame | undefined {
    return this.$store.getters['timelapse/getLastFrame']
  }

  get renderStatus (): RenderStatus | undefined {
    return this.$store.getters['timelapse/getRenderStatus']
  }

  get renderProgress () {
    const renderStatus = this.renderStatus

    if (renderStatus?.status === 'running') {
      return renderStatus.progress
    }

    return 0
  }

  mounted() {
    SocketActions.oldFrames()
  }
}
</script>

<style lang="scss" scoped>
.thumbnail {
  width: 100%;
}

.render-progress {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
