<template>
  <div class="yamfm-view yamfm-view--dark">
    <ul>
      <li v-for="(group, i) in groups" :key="i">
        <n-link v-bind:to="group.alias">{{ group.name }}</n-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { db } from '~/plugins/firebase.js'

export default {
  async fetch({ store, params }) {
    await store.dispatch('groups/GET_GROUPS');
  },
  data() {
    return {}
  },
  computed: {
    groups() {
      return this.$store.state.groups.groups;
    },
  },
  methods: {
    async fetchGroups() {}
  }
}
</script>
