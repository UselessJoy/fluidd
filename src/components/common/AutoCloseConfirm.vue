<template>
    <v-dialog @click:outside="closeDialog" v-model="open" eager :max-width="width" :persistent="persistent" @keydown.esc="closeDialog">
      <v-card tile>
        <v-toolbar v-if="Boolean(title)" dark :color="color" dense flat>
          <v-icon v-if="Boolean(icon)" left>{{ icon }}</v-icon>
          <v-toolbar-title class="white--text" v-text="title"/>
        </v-toolbar>
        <v-card-text class="body-1 text-body-1 py-3" v-html="message"/>
        <v-card-actions>
          <v-spacer/>
          <v-btn 
            v-for="button in buttons"
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
  import { VCard, VCardActions, VCardText, VDialog, VIcon, VToolbar, VToolbarTitle, VSpacer, VBtn } from 'vuetify/lib'

  type ConfirmButton = {
    type: 'yes' | 'accept' | 'no',
    text: String,
    color: String,
  }

  @Component({})
    export default class AutoCloseConfirm extends Vue {
      @VModel({ type: Boolean })
        open!: Boolean

      @Prop({ type: String, default: 'warning' })
      readonly color!: String

      @Prop({ type: String, default: '$error' })
      readonly icon!: String

      @Prop({ type: Number, default: 500 })
      readonly width!: Number

      @Prop({ type: String, default: 'warning' })
      readonly title!: String

      @Prop({type: Boolean, default: false})
      readonly persistent!: Boolean

      @Prop({ type: String, required: true })
      readonly message!: String

      @Prop({required: true})
      readonly buttons!: ConfirmButton[]

      closeDialog() {
        this.$emit('result', 'accept')
        this.$destroy()
      }

      handleClick(button: ConfirmButton){
        this.$emit('result', button.type)
        this.$destroy()
      }

  }
</script>