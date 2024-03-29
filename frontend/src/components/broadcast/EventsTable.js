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

import deepEqual from 'deep-equal';
import React from 'react';
import { connect } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const EVENT_TIMEOUT_SECONDS = 20;

function EventRow({ type, team, problem, oldRank, newRank }) {
  const rankCol =
    type === 'solved' ? (
      <div style={{ flex: '0 0 auto', marginLeft: '12px' }}>
        {oldRank} &#x21D2; {newRank}
      </div>
    ) : null;
  return (
    <div className="card">
      <div className="card-body" style={{ display: 'flex' }}>
        <div
          className={`bg-${type}`}
          style={{
            flex: '0 0 auto',
            width: '18px',
            marginRight: '4px',
            textAlign: 'center',
          }}
        >
          {problem.label}
        </div>
        <div className="text-ellipsis" style={{ flex: '1 1 auto' }}>
          {team.universityShort} {team.name}
        </div>
        {rankCol}
      </div>
    </div>
  );
}

class EventsTableImpl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
    };
  }

  componentDidUpdate() {
    this.updateState_();
  }

  componentDidMount() {
    this.timer_ = setInterval(() => this.updateState_(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer_);
  }

  updateState_() {
    const newEvents = [];
    const now = new Date().getTime() / 1000;
    for (const e of this.props.events) {
      if (now - e.time <= EVENT_TIMEOUT_SECONDS) {
        newEvents.push(e);
      }
    }
    newEvents.reverse();

    if (!deepEqual(this.state.events, newEvents)) {
      this.setState({
        events: newEvents,
      });
    }
  }

  render() {
    const { teams, problems } = this.props;
    const { events } = this.state;
    const rows = [];
    for (const event of events) {
      const { eventId, type, teamId, problemIndex, oldRank, newRank } = event;
      const team = teams[teamId];
      const problem = problems[problemIndex];
      rows.push(
        <CSSTransition
          key={eventId}
          timeout={{ enter: 500, exit: 300 }}
          classNames="event-animation"
        >
          <EventRow
            key={eventId}
            type={type}
            team={team}
            problem={problem}
            oldRank={oldRank}
            newRank={newRank}
          />
        </CSSTransition>
      );
    }
    return (
      <div
        className="broadcast-events"
        style={{
          display: 'flex',
          flexDirection: 'column-reverse',
          width: '100%',
          height: '100%',
        }}
      >
        <TransitionGroup component={null}>{rows}</TransitionGroup>
      </div>
    );
  }
}

function mapStateToProps({
  events,
  feeds: {
    teams,
    standings: { problems },
  },
}) {
  return { events, teams, problems };
}

const EventsTable = connect(mapStateToProps)(EventsTableImpl);

export default EventsTable;
