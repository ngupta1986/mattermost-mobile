// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {getDataRetentionPolicy} from 'mattermost-redux/actions/general';
import {GeneralTypes} from 'mattermost-redux/action_types';
import {autoUpdateTimezone} from 'mattermost-redux/actions/timezone';
import {Client4} from 'mattermost-redux/client';
import {getConfig, getLicense} from 'mattermost-redux/selectors/entities/general';
import {getCurrentUserId} from 'mattermost-redux/selectors/entities/users';

import {ViewTypes} from 'app/constants';
import {app} from 'app/mattermost';
import {getDeviceTimezone, isTimezoneEnabled} from 'app/utils/timezone';

export function handleLoginIdChanged(loginId) {
    return async (dispatch, getState) => {
        dispatch({
            type: ViewTypes.LOGIN_ID_CHANGED,
            loginId,
        }, getState);
    };
}

export function handlePasswordChanged(password) {
    return async (dispatch, getState) => {
        dispatch({
            type: ViewTypes.PASSWORD_CHANGED,
            password,
        }, getState);
    };
}

export function handleSuccessfulLogin() {
    return async (dispatch, getState) => {
        const state = getState();
        const config = getConfig(state);
        const license = getLicense(state);
        const token = Client4.getToken();
        const url = Client4.getUrl();
        const deviceToken = state.entities.general.deviceToken;
        const currentUserId = getCurrentUserId(state);

        app.setAppCredentials(deviceToken, currentUserId, token, url);

        const enableTimezone = isTimezoneEnabled(state);
        if (enableTimezone) {
            dispatch(autoUpdateTimezone(getDeviceTimezone()));
        }

        dispatch({
            type: GeneralTypes.RECEIVED_APP_CREDENTIALS,
            data: {
                url,
                token,
            },
        }, getState);

        if (config.DataRetentionEnableMessageDeletion && config.DataRetentionEnableMessageDeletion === 'true' &&
            license.IsLicensed === 'true' && license.DataRetention === 'true') {
            getDataRetentionPolicy()(dispatch, getState);
        } else {
            dispatch({type: GeneralTypes.RECEIVED_DATA_RETENTION_POLICY, data: {}});
        }

        return true;
    };
}

export function getSession() {
    return async (dispatch, getState) => {
        const state = getState();
        const {currentUserId} = state.entities.users;
        const {credentials} = state.entities.general;
        const token = credentials && credentials.token;

        if (currentUserId && token) {
            const session = await Client4.getSessions(currentUserId, token);
            if (Array.isArray(session) && session[0]) {
                const s = session[0];
                return s.expires_at;
            }
        }

        return false;
    };
}

export default {
    handleLoginIdChanged,
    handlePasswordChanged,
    handleSuccessfulLogin,
    getSession,
};
