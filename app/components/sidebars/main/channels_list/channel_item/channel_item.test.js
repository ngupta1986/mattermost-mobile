// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {shallow} from 'enzyme';

import Preferences from 'mattermost-redux/constants/preferences';

import ChannelItem from './channel_item.js';

jest.mock('react-intl');

describe('ChannelItem', () => {
    const baseProps = {
        channelId: 'channel_id',
        currentChannelId: 'current_channel_id',
        displayName: 'display_name',
        fake: false,
        isChannelMuted: false,
        isMyUser: true,
        isUnread: true,
        hasDraft: false,
        mentions: 0,
        navigator: {push: () => {}}, // eslint-disable-line no-empty-function
        onSelectChannel: () => {}, // eslint-disable-line no-empty-function
        shouldHideChannel: false,
        showUnreadForMsgs: true,
        status: 'online',
        teammateDeletedAt: 0,
        type: 'O',
        theme: Preferences.THEMES.default,
        unreadMsgs: 1,
        isArchived: false,
    };

    test('should match snapshot', () => {
        const wrapper = shallow(
            <ChannelItem {...baseProps}/>,
            {context: {intl: {formatMessage: jest.fn()}}},
        );

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('should match snapshot for deactivated user', () => {
        const newProps = {
            ...baseProps,
            teammateDeletedAt: 100,
            type: 'D',
        };
        const wrapper = shallow(
            <ChannelItem {...newProps}/>,
            {context: {intl: {formatMessage: jest.fn()}}},
        );
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('should match snapshot with draft', () => {
        const wrapper = shallow(
            <ChannelItem
                {...baseProps}
                hasDraft={true}
            />,
            {context: {intl: {formatMessage: jest.fn()}}},
        );

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
