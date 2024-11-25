<template>
  <collapsable-card
    :title="$t('app.general.title.history')"
    icon="$history"
  >
    <job-history />
    <template #menu>
      <v-select
        v-model="selectedTime"
        class="d-inline-block"
        :items="[times.week, times.mounth, times.year]"
        :label="$tc('app.calendar.show_for')"
      />
      <app-btn-collapse-group :collapsed="menuCollapsed">
        <app-btn
          small
          class="ms-1 my-1"
          @click="handleLoadAll"
        >
          <v-icon
            small
            left
          >
            $download
          </v-icon>
          <span>{{ $t('app.general.btn.load_all') }}</span>
        </app-btn>
        <app-btn
          small
          class="ms-1 my-1"
          @click="handleRemoveAll"
        >
          <v-icon
            small
            left
          >
            $delete
          </v-icon>
          <span>{{ $t('app.general.btn.remove_all') }}</span>
        </app-btn>
      </app-btn-collapse-group>
    </template>
  </collapsable-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import JobHistory from '@/components/widgets/history/JobHistory.vue'
import { SocketActions } from '@/api/socketActions'

@Component({
  components: {
    JobHistory
  }
})
export default class PrinterHistoryCard extends Vue {
  @Prop({ type: Boolean })
  readonly menuCollapsed?: boolean

  times = { week: this.$tc('app.calendar.last_week'), mounth: this.$tc('app.calendar.last_mounth'), year: this.$tc('app.calendar.last_year') }

  get selectedTime () {
    return ''
  }

  set selectedTime (value) {
    if (value === this.times.week) {
      const now = new Date()
      const week_ago = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
      SocketActions.serverHistoryList({ limit: 0, before: Math.floor(now.getTime() / 1000), since: Math.floor(week_ago.getTime() / 1000) })
    } else if (value === this.times.mounth) {
      const now = new Date()
      const mounth_ago = new Date(now.getFullYear(), now.getMonth() - 1)
      SocketActions.serverHistoryList({ limit: 0, before: Math.floor(now.getTime() / 1000), since: Math.floor(mounth_ago.getTime() / 1000) })
    } else if (value === this.times.year) {
      const now = new Date()
      const year_ago = new Date(now.getFullYear() - 1)
      SocketActions.serverHistoryList({ limit: 0, before: Math.floor(now.getTime() / 1000), since: Math.floor(year_ago.getTime() / 1000) })
    }
  }

  async handleRemoveAll () {
    const result = await this.$confirm(
      this.$tc('app.history.msg.confirm_jobs'), {
        title: this.$tc('app.general.label.confirm'),
        color: 'card-heading',
        icon: '$error',
        buttonTrueText: this.$tc('app.general.btn.yes'),
        buttonFalseText: this.$tc('app.general.btn.no')
      }
    )
    if (result) {
      SocketActions.serverHistoryDeleteJob('all')
    }
  }

  handleLoadAll () {
    SocketActions.serverHistoryList({ limit: 0 })
  }
}
</script>
