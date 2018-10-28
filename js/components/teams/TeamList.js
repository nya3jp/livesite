import React from 'react';
import { Link } from 'react-router';

import FixedRatioThumbnail from '../common/FixedRatioThumbnail';
import GridFlow from '../common/GridFlow';
import * as constants from '../../constants';
import siteconfig from '../../siteconfig';

const TeamPhoto = ({ photo }) => {
  return <FixedRatioThumbnail url={photo} ratio={siteconfig.ui.photoAspectRatio} />
};

const TeamItem = ({ team: { id, name, university, country, photo, members } }) => {
  const displayNames = [];
  for (let profile of members) {
    const { name } = profile;
    const displayName = name.length > 0 ? name : '?';
    displayNames.push(displayName);
  }
  const hasInfo = members.some((profile) => profile.name.length > 0);
  const memberNames = displayNames.join(' / ');
  return (
    <div className="card mb-3" style={{ backgroundColor: (hasInfo ? null : 'inherit !important') }}>
      <div className="card-body">
        {
          siteconfig.features.photo ?
          <Link to={`/team/${id}`}>
            <TeamPhoto photo={photo} />
          </Link> :
          null
        }
        <h4 className="my-3 text-ellipsis">
          <Link to={`/team/${id}`} className="no-decoration">{name}</Link>
        </h4>
        <div className="text-ellipsis">
          <Link to={`/team/${id}`} className="no-decoration">
            {
              siteconfig.features.country ?
              <img src={`/images/${country}.png`} style={{ width: '21px', height: '14px', marginRight: '3px', marginBottom: '2px', border: '1px solid #000' }} /> :
              null
            }
            {university}
          </Link>
        </div>
        <div className="text-ellipsis" style={{ paddingTop: '6px' }}>
          <Link to={`/team/${id}`} className="no-decoration">
            {memberNames}
          </Link>
        </div>
      </div>
    </div>
  );
};

const TeamItemFlow = ({ children }) => (
  <GridFlow className="col-md-6 col-lg-4">
    {children}
  </GridFlow>
);

const TeamListSimple = ({ teams }) => {
  const sortedTeams = [...teams];
  sortedTeams.sort((a, b) => (
      a.university.localeCompare(b.university) ||
      a.name.localeCompare(b.name) ||
      a.id.localeCompare(b.id)));
  const items = sortedTeams.map(
      (team) => <TeamItem key={team.id} team={team} />);
  return <TeamItemFlow>{items}</TeamItemFlow>;
};

const TeamListWithPrefecture = ({ teams }) => {
  const teamsByPrefecture = {};
  for (let i = 1; i <= 48; ++i) {
    teamsByPrefecture[i] = [];
  }
  teams.forEach((team) => {
    teamsByPrefecture[team.prefecture || 48].push(team);
  });
  const children = [];
  for (let i = 1; i <= 48; ++i) {
    const teamsInPrefecture = teamsByPrefecture[i];
    teamsInPrefecture.sort((a, b) => (
      a.university.localeCompare(b.university) ||
      a.name.localeCompare(b.name) ||
      a.id.localeCompare(b.id)));
    const count = teamsInPrefecture.length;
    if (count > 0) {
      const items = teamsInPrefecture.map(
        (team) => <TeamItem key={team.id} team={team} />);
      const name = constants.PREFECTURES[i];
      children.push(<h3 id={`pref${i}`} className="my-3">{`${name} (${count})`}</h3>);
      children.push(<TeamItemFlow>{items}</TeamItemFlow>);
    }
  }
  return <div>{children}</div>;
};

const TeamList =
  siteconfig.features.prefecture ? TeamListWithPrefecture : TeamListSimple;

export default TeamList;