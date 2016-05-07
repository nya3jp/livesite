import React from 'react';
import { Link, IndexLink } from 'react-router';

class NavLink extends React.Component {
  render() {
    const { router } = this.context;
    const { onlyActiveOnIndex = false, to, children, ...props } = this.props;
    const isActive = router.isActive(to, onlyActiveOnIndex);
    return (
      <li className={isActive ? 'active' : ''}>
        <Link to={to} {...props}>{children}</Link>
      </li>
    );
  }
};
NavLink.contextTypes = { router: () => React.PropTypes.func.isRequired };

const NavBar = ({ contest }) => (
  <nav className="navbar navbar-inverse">
    <div className="container">
      <div className="navbar-header">
        <Link className="navbar-brand" to="/">{ contest.title }</Link>
      </div>
      <div className="collapse navbar-collapse">
        <ul className="nav navbar-nav">
          <NavLink to="/standings/">順位表</NavLink>
          <NavLink to="/team/">チーム一覧</NavLink>
        </ul>
        <ul className="nav navbar-nav navbar-right">
          <li>
            <p className="navbar-text">00:00:00</p>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

export default NavBar;
