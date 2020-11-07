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

import applyPartialUpdate from 'immutability-helper';

const DEFAULT_REVEAL = {
  reveal: { entriesList: [[]], problems: [] },
  step: 0,
};

const reveal = (reveal = DEFAULT_REVEAL, action) => {
  if (action.type === 'SET_REVEAL_STEP') {
    return applyPartialUpdate(reveal, { step: { $set: action.step }});
  } else if (action.type === 'SET_REVEAL_DATA') {
    return { reveal: action.reveal, step: 0 };
  }
  return reveal;
};

export default reveal;