// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {injectIntl, intlShape} from 'react-intl';
import {TextInput} from 'react-native';

import QuickTextInput from 'app/components/quick_text_input';

class TextInputWithLocalizedPlaceholder extends PureComponent {
    static propTypes = {
        ...TextInput.propTypes,
        placeholder: PropTypes.object.isRequired,
        intl: intlShape.isRequired,
    };

    blur = () => {
        this.refs.input.blur();
    };

    focus = () => {
        this.refs.input.focus();
    };

    render() {
        const {intl, placeholder, ...otherProps} = this.props;
        let placeholderString = '';
        if (placeholder.id) {
            placeholderString = intl.formatMessage(placeholder);
        }

        return (
            <QuickTextInput
                ref='input'
                {...otherProps}
                placeholder={placeholderString}
                disableFullscreenUI={true}
            />
        );
    }
}

export default injectIntl(TextInputWithLocalizedPlaceholder, {withRef: true});
