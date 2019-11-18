// News Vuex Store
// ~~~~~~~~~~~~~~~

import { db } from '~/plugins/firebase.js'

export const state = () => ({
  groups: [],
  replays: [],
})

export const mutations = {
  updateGroups(state, updatedGroups) {
    state.groups = updatedGroups;
  },
  updateReplays(state, updatedReplays) {
    state.replays = updatedReplays;
  },
}

export const actions = {
  async GET_GROUPS({ commit }) {
    const groups = await db.collection('groups').get();
    let _groups = [];
    groups.forEach((doc) => {
      _groups.push({ id: doc.id, ...doc.data() });
    })
    commit('updateGroups', _groups);
  },
  async GET_REPLAYS({ commit }) {
    const replays = await db.collection('replays').get();
    let _replays = [];
    replays.forEach((doc) => {
      const {
        group,
        title,
        created_at,
        youtube_id,
        playing,
        elapsed_time,
      } = doc.data();

      _replays.push({
        id: doc.id,
        group_id: group.id,
        title,
        created_at,
        youtube_id,
        playing,
        elapsed_time,
      });
    })
    commit('updateReplays', _replays);
  },
}
