// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {PureComponent} from 'react';
import {Keyboard, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {CalendarList} from 'react-native-calendars';

import {DATE_MENTION_SEARCH_REGEX, ALL_SEARCH_FLAGS_REGEX} from 'app/constants/autocomplete';

export default class DateSuggestion extends PureComponent {
    static propTypes = {
        cursorPosition: PropTypes.number.isRequired,
        listHeight: PropTypes.number,
        matchTerm: PropTypes.string,
        onChangeText: PropTypes.func.isRequired,
        onResultCountChange: PropTypes.func.isRequired,
        theme: PropTypes.object.isRequired,
        value: PropTypes.string,
        enableDateSuggestion: PropTypes.bool.isRequired,
    };

    static defaultProps = {
        value: '',
    };

    constructor(props) {
        super(props);

        this.state = {
            mentionComplete: false,
            sections: [],
        };
    }

    componentWillReceiveProps(nextProps) {
        const {matchTerm} = nextProps;

        if ((matchTerm !== this.props.matchTerm && matchTerm === null) || this.state.mentionComplete) {
            // if the term changes but is null or the mention has been completed we render this component as null
            this.setState({
                mentionComplete: false,
                sections: [],
            });

            this.props.onResultCountChange(0);
        }
    }

    completeMention = (day) => {
        const mention = day.dateString;
        const {cursorPosition, onChangeText, value} = this.props;
        const mentionPart = value.substring(0, cursorPosition);
        const flags = mentionPart.match(ALL_SEARCH_FLAGS_REGEX);
        const currentFlag = flags[flags.length - 1];
        let completedDraft = mentionPart.replace(DATE_MENTION_SEARCH_REGEX, `${currentFlag} ${mention} `);

        if (value.length > cursorPosition) {
            completedDraft += value.substring(cursorPosition);
        }

        onChangeText(completedDraft, true);
        this.props.onResultCountChange(1);
        this.setState({mentionComplete: true});
    };

    render() {
        const {mentionComplete} = this.state;
        const {matchTerm, enableDateSuggestion} = this.props;

        if (matchTerm === null || mentionComplete || !enableDateSuggestion) {
            // If we are not in an active state or the mention has been completed return null so nothing is rendered
            // other components are not blocked.
            return null;
        }

        const currentDate = (new Date()).toDateString();

        Keyboard.dismiss();

        return (
            <CalendarList
                style={styles.calList}
                current={currentDate}
                pastScrollRange={24}
                futureScrollRange={0}
                scrollingEnabled={true}
                pagingEnabled={true}
                hideArrows={true}
                horizontal={true}
                showScrollIndicator={true}
                onDayPress={this.completeMention}
                showWeekNumbers={true}
            />
        );
    }
}

const styles = StyleSheet.create({
    calList: {
        height: 1700,
    },
});
