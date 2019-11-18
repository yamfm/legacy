<template>
  <div class="yamfm-view yamfm-view--dark">
    <div class="yamfm-group" v-if="group">
      <div class="yamfm-group-header">
        <div class="x-container">
          <h3 class="xu-mt-0 xu-mb-0">{{ group ? group.name : '' }}</h3>
        </div>
      </div>
      <div class="yamfm-group-tabs">
        <div class="x-container">
          <div class="yamfm-group-tab is-active">
            <span>Replays</span>
          </div>
        </div>
      </div>
      <div class="yamfm-group-scene">
        <div class="x-container">
          <div class="yamfm-group-replays">
            <div
              class="yamfm-group-replay"
              v-for="(replay, i) in groupReplays" :key="i"
              v-if="!replay.has_completed && replay.has_started && replay.playing"
              @click="openVideo(replay)">
              <div class="yamfm-group-replay-details">
                <h5 class="xu-mt-0 xu-mb-0">{{ replay.video_title }}</h5>
                <span>Started {{ formatDate(replay.created_at.seconds) }}</span>
                <div class="yamfm-group-replay-clock">
                  <strong>{{ formatClock(replay.current_time) }}</strong>
                </div>
              </div>
              <div class="yamfm-group-replay-cover">
                <img v-bind:src="replay.video_thumb" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '~/plugins/firebase.js';
import { youtube } from '~/plugins/youtube.js';
import moment from 'moment';
export default {
  layout: 'default',
  async fetch({ store }) {
    await store.dispatch('groups/GET_GROUPS');
    await store.dispatch('groups/GET_REPLAYS');
  },
  data() {
    return {
      loading: true,
      group: null,
      groupReplays: [],
    }
  },
  async mounted() {
    const { group } = this.$route.params;
    this.group = this.groups.filter((g) => g.alias == group)[0];
    this.loading = false;

    await this.$store.dispatch('groups/GET_REPLAYS');
    if (typeof(this.group) !== 'undefined') {
      db.collection('groups').doc(this.group.id).onSnapshot((g) => {
        this.group = g.data();
      })
      this.replays.filter((r) => r.group_id == this.group.id).map(async (replay) => {
        const video = await youtube.video(replay.youtube_id);
        const _replay = {
          current_time: video.elapsed_time,
          ...replay,
          ...video,
          has_completed: true,
        };
        this.groupReplays.push(_replay);
      })
    } else {
      this.$router.push({ path: '/groups' })
    }

    setInterval(() => {
      const now = Date.now();
      this.groupReplays.map((r, i) => {
        const elapsed = r.playing ? (Math.floor(now/1000)) - r.created_at.seconds: r.elapsed_time;
        this.groupReplays[i].current_time = elapsed;
        this.groupReplays[i].has_completed = (elapsed * 1000) > moment.duration(r.video_duration).asMilliseconds();
        this.groupReplays[i].has_started = Math.floor(now/1000) > r.created_at.seconds;
      })
    }, 100);
  },
  computed: {
    groups() {
      return this.$store.state.groups.groups;
    },
    replays() {
      return this.$store.state.groups.replays;
    },
  },
  methods: {
    formatClock(s) {
      return moment.utc(s*1000).format('HH:mm:ss');
    },
    formatDate(ms) {
      return moment(ms);
    },
    openVideo(replay) {
      const now = Math.floor(Date.now()/1000);
      const youtubeUrl = `https://youtube.com/watch?v=${ replay.video_id }&t=${ Math.floor(replay.current_time + 4) }s`;
      const newTab = window.open(youtubeUrl, '_blank');
      newTab.focus();
    },
  },
  head() {
    return {
      title: `${ this.group ? this.group.name : '' } - yam.fm`,
      meta: [
        { 'property': 'og:site_name', 'content': `yam.fm`, },
        { 'property': 'og:title', 'content': `${ this.group ? this.group.name : '' } - yam.fm`, },
        { 'property': 'og:description', 'content': `${ this.group ? `${ this.group.name } replays` : '' }`, },
        { 'property': 'og:image', 'content': 'https://i.ytimg.com/vi/8LUSZuuQano/hqdefault.jpg', },
        { 'property': 'og:image:secure_url', 'content': 'https://i.ytimg.com/vi/8LUSZuuQano/hqdefault.jpg', },
        { 'property': 'twitter:description', 'content': `${ this.group ? `${ this.group.name } replays` : '' }`, },
        { 'property': 'twitter:card', 'content': 'summary_large_image' },
        { 'property': 'twitter:image', 'content': 'https://i.ytimg.com/vi/8LUSZuuQano/hqdefault.jpg' },
      ],
    }
  },
}
</script>
