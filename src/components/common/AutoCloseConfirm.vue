<template>
  <v-dialog
    v-model="open"
    eager
    :max-width="width"
    :persistent="persistent"
    @click:outside="closeDialog"
    @keydown.esc="closeDialog"
  >
    <v-card tile>
      <v-toolbar
        v-if="Boolean(title)"
        dark
        :color="color"
        dense
        flat
      >
        <v-icon
          v-if="Boolean(icon)"
          left
        >
          {{ icon }}
        </v-icon>
        <v-toolbar-title
          class="white--text"
          v-text="title"
        />
      </v-toolbar>
      <v-card-text
        class="body-1 text-body-1 py-3"
        v-html="message"
      />
      <v-card-actions>
        <v-spacer />
        <v-btn
          v-for="button in buttons"
          :key="button"
          :color="button.color"
          :text="true"
          @click="handleClick(button)"
        >
          {{ button.text }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, VModel, Prop } from 'vue-property-decorator'
import Vue from 'vue'

type ConfirmButton = {
  type: 'yes' | 'accept' | 'no',
  text: string,
  color: string,
}

@Component({})
export default class AutoCloseConfirm extends Vue {
  @VModel({ type: Boolean })
    open!: boolean

  @Prop({ type: String, default: 'warning' })
  readonly color!: string

  @Prop({ type: String, default: '$error' })
  readonly icon!: string

  @Prop({ type: Number, default: 500 })
  readonly width!: number

  @Prop({ type: String, default: 'warning' })
  readonly title!: string

  @Prop({ type: Boolean, default: false })
  readonly persistent!: boolean

  @Prop({ type: String, required: true })
  readonly message!: string

  @Prop({ required: true })
  readonly buttons!: ConfirmButton[]

  closeDialog () {
    this.$emit('result', 'accept')
    this.$destroy()
  }

  handleClick (button: ConfirmButton) {
    this.$emit('result', button.type)
    this.$destroy()
  }
}
</script>
