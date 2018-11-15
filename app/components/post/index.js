// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {createPost, removePost} from 'mattermost-redux/actions/posts';
import {Posts} from 'mattermost-redux/constants';
import {isCurrentChannelReadOnly} from 'mattermost-redux/selectors/entities/channels';
import {getPost, makeGetCommentCountForPost} from 'mattermost-redux/selectors/entities/posts';
import {getCurrentUserId} from 'mattermost-redux/selectors/entities/users';
import {getMyPreferences, getTheme} from 'mattermost-redux/selectors/entities/preferences';
import {isPostFlagged, isSystemMessage} from 'mattermost-redux/utils/post_utils';

import {insertToDraft, setPostTooltipVisible} from 'app/actions/views/channel';

import Post from './post';

function isConsecutivePost(state, ownProps) {
    const post = getPost(state, ownProps.postId);
    const previousPost = ownProps.previousPostId && getPost(state, ownProps.previousPostId);

    let consecutivePost = false;

    if (previousPost) {
        const postFromWebhook = Boolean(post.props && post.props.from_webhook);
        const prevPostFromWebhook = Boolean(previousPost.props && previousPost.props.from_webhook);
        if (previousPost && previousPost.user_id === post.user_id &&
            post.create_at - previousPost.create_at <= Posts.POST_COLLAPSE_TIMEOUT &&
            !postFromWebhook && !prevPostFromWebhook &&
            !isSystemMessage(post) && !isSystemMessage(previousPost) &&
            (previousPost.root_id === post.root_id || previousPost.id === post.root_id)) {
            // The last post and this post were made by the same user within some time
            consecutivePost = true;
        }
    }
    return consecutivePost;
}

function makeMapStateToProps() {
    const getCommentCountForPost = makeGetCommentCountForPost();
    return function mapStateToProps(state, ownProps) {
        const post = getPost(state, ownProps.postId);
        const myPreferences = getMyPreferences(state);
        const currentUserId = getCurrentUserId(state);

        let isFirstReply = true;
        let isLastReply = true;
        let commentedOnPost = null;

        if (ownProps.renderReplies && post && post.root_id) {
            if (ownProps.previousPostId) {
                const previousPost = getPost(state, ownProps.previousPostId);
                if (previousPost && (previousPost.id === post.root_id || previousPost.root_id === post.root_id)) {
                    // Previous post is root post or previous post is in same thread
                    isFirstReply = false;
                } else {
                    // Last post is not a comment on the same message
                    commentedOnPost = getPost(state, post.root_id);
                }
            }

            if (ownProps.nextPostId) {
                const nextPost = getPost(state, ownProps.nextPostId);

                if (nextPost && nextPost.root_id === post.root_id) {
                    isLastReply = false;
                }
            }
        }

        return {
            channelIsReadOnly: isCurrentChannelReadOnly(state),
            currentUserId,
            post,
            isFirstReply,
            isLastReply,
            consecutivePost: isConsecutivePost(state, ownProps),
            hasComments: getCommentCountForPost(state, {post}) > 0,
            commentedOnPost,
            theme: getTheme(state),
            isFlagged: isPostFlagged(post.id, myPreferences),
        };
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            createPost,
            removePost,
            setPostTooltipVisible,
            insertToDraft,
        }, dispatch),
    };
}

export default connect(makeMapStateToProps, mapDispatchToProps)(Post);
