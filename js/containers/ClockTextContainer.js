import { connect } from 'react-redux';

import ClockText from '../components/ClockText';

const mapStateToProps = ({ contest }) => ({ contest });

const ClockTextContainer =
    connect(mapStateToProps, undefined, undefined, { pure: false })(ClockText);

export default ClockTextContainer;