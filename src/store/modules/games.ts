const gamesModule = {
  state: () => ({
    count: 0,
  }),
  mutations: {
    increment(state: { count: number }) {
      // `state` is the local module state
      state.count++;
    },
  },
  getters: {
    doubleCount(state: { count: number }) {
      return state.count * 2;
    },
  },
};

export default gamesModule;
