// Copyright 2019 LiveSite authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

export function updateFeeds(update) {
  return {
    type: 'UPDATE_FEEDS',
    update,
  };
}

export function updateBroadcast(update) {
  return {
    type: 'UPDATE_BROADCAST',
    update,
  };
}

export function updateSettings(settingsUpdate) {
  return {
    type: 'UPDATE_SETTINGS',
    settingsUpdate,
  };
}

export function toggleSetting(name) {
  return (dispatch, getState) => {
    const oldSettings = getState().settings;
    const settingsUpdate = {[name]: {$set: !oldSettings[name]}};
    dispatch(updateSettings(settingsUpdate));
  };
}

export function setRevealStep(step) {
  return {
    type: 'SET_REVEAL_STEP',
    step,
  };
}

export function setRevealData(reveal) {
  return {
    type: 'SET_REVEAL_DATA',
    reveal,
  };
}
