<template>
    <div>
        <v-subheader id="browser">
        {{ $t('app.setting.title.file_browser') }}
        </v-subheader>
        <v-card
        :elevation="5"
        dense
        class="mb-4"
        >
        <app-setting :title="$t('app.setting.label.text_sort_order')">
            <v-select
            v-model="textSortOrder"
            filled
            dense
            hide-details="auto"
            :items="availableTextSortOrders"
            />
        </app-setting>

        <v-divider/>
        
        <app-setting
          :title="$t('app.setting.label.shown_registered_directories')"
        >
          <v-combobox
            v-model="shown_registered_directories"
            :items="additionalRoots"
            filled
            dense
            hide-selected
            hide-details="auto"
            multiple
            small-chips
            append-icon=""
            deletable-chips
          />
        </app-setting>
        </v-card>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({})
export default class FileBrowserSettings extends Vue {
    get textSortOrder () {
        return this.$store.state.config.uiSettings.general.textSortOrder
    }
    
    get shown_registered_directories (): string[] {
      return this.$store.state.config.uiSettings.general.shown_registered_directories
    }

    set shown_registered_directories(value: string[]) {
      this.$store.dispatch('config/saveByPath', {
        path: 'uiSettings.general.shown_registered_directories',
        value,
        server: true
        })
    }

    get additionalRoots () {
      const roots = []
      const excludeRoots = ['gcodes', 'config', 'timelapse', 'timelapse_frames', 'logs', 'docs', 'config_examples']
      for (const root of this.$store.state.server.info.registered_directories || []) {
        if (!excludeRoots.includes(root) && !this.shown_registered_directories.includes(root)) {
          roots.push(root)
        }
      }
      return roots
    }

    set textSortOrder (value: string) {
        this.$store.dispatch('config/saveByPath', {
        path: 'uiSettings.general.textSortOrder',
        value,
        server: true
        })
    }
    
    get availableTextSortOrders () {
        return [
        {
            value: 'default',
            text: this.$t('app.general.label.default')
        },
        {
            value: 'numeric-prefix',
            text: this.$t('app.general.label.numeric_prefix_sort')
        },
        {
            value: 'version',
            text: this.$t('app.general.label.version_sort')
        }
        ]
    }
}
</script>