<template>
  <v-menu
    bottom
    left
    max-width="350"
    :close-on-content-click="false"
  >
    <template #activator="{ on: menu, attrs }">
      <v-tooltip bottom>
        <template #activator="{ on: tooltip }">
          <v-btn
            fab
            small
            text
            v-bind="attrs"
            v-on="{ ...tooltip, ...menu }"
          >
            <v-icon>
              $calendar_outline
            </v-icon>
          </v-btn>
        </template>
        <span>{{ $t('app.general.label.calendar') }}</span>
      </v-tooltip>
    </template>
    <v-card ref="card">
      <v-card-title
        v-if="title"
        class="card-heading mb-2"
        style="cursor: move; user-select: none;"
        @mousedown="startMouseDrag"
        @touchstart="startTouchDrag"
        @touchmove="touchMove"
      >
        {{ title }}
      </v-card-title>
      <v-card-text>
        <vc-date-picker
          v-model="range"
          is-range
        />
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { SocketActions } from '@/api/socketActions'
import { Component, Vue, Prop, Ref, Watch } from 'vue-property-decorator'
interface PointerPosition {
  x: number;
  y: number;
}

@Component({})
export default class AppDatePicker extends Vue {
  @Prop({ type: String, default: '' })
  readonly title!: string

  @Ref('card')
  readonly card!: Vue

  lastPointerPosition: PointerPosition = { x: 0, y: 0 }

  @Watch('range')
  onChangeRange (range: Record<any, any>) {
    alert(range)
  }

  startMouseDrag (event: MouseEvent) {
    this.lastPointerPosition = { x: event.clientX, y: event.clientY }
    window.addEventListener('mousemove', this.mouseMove)
    window.addEventListener('mouseup', this.stopMouseDrag)
  }

  stopMouseDrag (event: MouseEvent) {
    this.lastPointerPosition = { x: event.clientX, y: event.clientY }
    window.removeEventListener('mousemove', this.mouseMove)
    window.removeEventListener('mouseup', this.stopMouseDrag)
  }

  startTouchDrag (event: TouchEvent) {
    this.lastPointerPosition = { x: event.touches[0].clientX, y: event.touches[0].clientY }
  }

  relativeMove (newPosition: PointerPosition) {
    const parent = this.card.$el.parentElement

    if (parent) {
      parent.style.left = (parseFloat(parent.style.left) + (newPosition.x - this.lastPointerPosition.x)) + 'px'
      parent.style.top = (parseFloat(parent.style.top) + (newPosition.y - this.lastPointerPosition.y)) + 'px'
    }
  }

  mouseMove (event: MouseEvent) {
    const newPosition = { x: event.clientX, y: event.clientY }
    this.relativeMove(newPosition)
    this.lastPointerPosition = newPosition
  }

  touchMove (event: TouchEvent) {
    event.preventDefault()
    const newPosition = { x: event.touches[0].clientX, y: event.touches[0].clientY }
    this.relativeMove(newPosition)
    this.lastPointerPosition = newPosition
  }

  get range () {
    return {
      start: new Date(2024, 10, 1),
      end: new Date(2024, 10, 7)
    }
  }

  set range (value) {
    SocketActions.serverHistoryList({ limit: 0, before: Math.floor(value.end.getTime() / 1000), since: Math.floor(value.start.getTime() / 1000) })
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
