<template>
  <v-dialog
    v-model="open"
    max-width="650"
    persistent
  >
    <v-card>
      <v-card-title>
        <span class="headline">{{ title }}</span>
      </v-card-title>
      <v-card-text
        ref="messageContent"
        class="body-1 text-body-1 py-3"
        style="
          white-space: pre-wrap;
          word-break: break-word;
          min-height: 20vh;
          max-height: 20vh;
          overflow-y: auto;
          padding-right: 8px;"
        @scroll="onScroll"
      >
        {{ message }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <slot name="actions">
          <app-btn
            color="primary"
            text="hi"
            @click="close"
          >
            {{ $t('app.general.btn.close') }}
          </app-btn>
          <app-btn
            color="primary"
            text="hi"
            @click="startFix"
            v-if="!is_updating && !was_updating && !all_updated"
            :disabled="is_updating"
            :loading="hasWait($waits.onGetIsUpdating)"
          >
            {{ $t('app.general.btn.start_fix') }}
          </app-btn>

          <app-btn
            color="primary"
            text="hi"
            @click="startFix"
            v-if="require_internet && was_updating && !all_updated && !require_reboot"
            :disabled="is_updating"
          >
            {{ $t('app.general.btn.continue_fix') }}
          </app-btn>

          <app-btn
            color="primary"
            text
            @click="acceptReboot"
            v-if="require_reboot"
            :disabled="is_updating"
          >
            {{ $t('app.general.btn.reboot') }}
          </app-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Mixins, VModel, Watch } from 'vue-property-decorator'
import StateMixin from '@/mixins/state'
import ServicesMixin from '@/mixins/services'
import { SocketActions } from '@/api/socketActions'

@Component({})
export default class FixDialog extends Mixins(StateMixin, ServicesMixin) {
  @VModel({ type: Boolean })
    open!: boolean

  isScrolledToBottom = true
  scrollTimeout: number | null = null
  was_updating: boolean = false

  get title () {
    return this.$t('app.version.status.updating')
  }

  get buttonTitle () {
    return this.$t('app.general.btn.reboot')
  }

  get message () {
    return this.$store.getters['printer/getDialogMessage']
  }
  
  get require_reboot () {
      return this.$store.getters['printer/getRequireReboot']
  }

  get require_internet () {
      return this.$store.getters['printer/getRequireInternet']
  }

  get all_updated () {
    return this.$store.getters['printer/getIsAllUpdated']
  }

  get is_updating() {
    return this.$store.getters['printer/getIsUpdating']
  }

  close () {
    this.$emit('close')
  }

  onScroll() {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout)
    }
    
    // Дебаунс для производительности
    this.scrollTimeout = window.setTimeout(() => {
      this.checkScrollPosition()
    }, 100)
  }

  checkScrollPosition() {
    const element = this.$refs.messageContent as HTMLElement
    if (!element) return
    
    // Вычисляем, находится ли пользователь внизу
    const { scrollTop, scrollHeight, clientHeight } = element
    const threshold = 10 // Пикселей отступа от нижнего края
    
    // Если скролл находится в пределах 10 пикселей от нижнего края,
    // считаем что пользователь "внизу"
    this.isScrolledToBottom = scrollHeight - scrollTop - clientHeight <= threshold
  }

  scrollToBottom() {
    const element = this.$refs.messageContent as HTMLElement
    if (element) {
        element.scrollTop = element.scrollHeight
    }
  }

  @Watch('message')
  onMessageChange(newMessage: string, oldMessage: string) {
    if (!newMessage || newMessage === oldMessage) return
    
    // Ждем обновления DOM
    this.$nextTick(() => {
      // Скроллим вниз только если пользователь уже был внизу
      if (this.isScrolledToBottom) {
        this.scrollToBottom()
      }
    })
  }

  @Watch('open')
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      // При открытии диалога сбрасываем состояние
      this.isScrolledToBottom = true
      
      this.$nextTick(() => {
        // Ждем отрисовки, затем скроллим вниз
        setTimeout(() => {
          this.scrollToBottom()
        }, 100)
      })
    }
  }

  @Watch('is_updating')
  async onCustomStyleSheet (value: boolean) {
    if (value) {
      this.was_updating = true
    }
  }

  startFix () {
    SocketActions.printerStartFix()
  }

  acceptReboot () {
    this.hostReboot()
  }

  mounted() {
    // При монтировании также скроллим вниз
    this.$nextTick(() => {
      setTimeout(() => {
        if (this.open) {
          this.scrollToBottom()
        }
      }, 300)
    })
  }

  beforeDestroy() {
    // Очистка таймаута при уничтожении компонента
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout)
    }
  }

}
</script>
