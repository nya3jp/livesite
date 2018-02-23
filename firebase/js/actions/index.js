export const updateContest = (contest) => (
  {
    type: 'UPDATE_CONTEST',
    contest,
  }
);

export const updateStandings = (standings) => (
  {
    type: 'UPDATE_STANDINGS',
    standings,
  }
);

export const updateTeams = (teams) => (
  {
    type: 'UPDATE_TEAMS',
    teams,
  }
);

export const markLoaded = (feed) => (
  {
    type: 'MARK_LOADED',
    feed,
  }
);

export const updateRealtime = (realtime) => (
  {
    type: 'UPDATE_REALTIME',
    realtime,
  }
);

export const updateSettings = (settingsUpdate) => (
  {
    type: 'UPDATE_SETTINGS',
    settingsUpdate,
  }
);

export const toggleSetting = (name) => (dispatch, getState) => {
  const oldSettings = getState().settings;
  const settingsUpdate = {[name]: {$set: !oldSettings[name]}};
  dispatch(updateSettings(settingsUpdate));
};

export const setRevealStandingsIndex = (index) => (
  {
    type: 'SET_REVEAL_STANDINGS_INDEX',
    index,
  }
);

export const setRevealStandingsList = (standingsList) => (
  {
    type: 'SET_REVEAL_STANDINGS_LIST',
    standingsList,
  }
);
