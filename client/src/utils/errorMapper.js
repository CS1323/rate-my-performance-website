/**
 * Maps known backend API error strings to i18n translation keys.
 * Falls back to the original message if no mapping exists.
 */

const errorMap = {
  'Content cannot be empty': 'apiErrors.contentEmpty',
  'Content required': 'apiErrors.contentRequired',
  'Parent comment not found': 'apiErrors.parentNotFound',
  'Failed to create comment': 'apiErrors.createCommentFailed',
  'Failed to create reply': 'apiErrors.createReplyFailed',
  'Failed to fetch comments': 'apiErrors.fetchCommentsFailed',
  'Post not found': 'apiErrors.postNotFound',
  'Failed to fetch post': 'apiErrors.fetchPostFailed',
  'Failed to cast vote': 'apiErrors.voteFailed',
  'Failed to report comment': 'apiErrors.reportFailed',
  'Failed to fetch ads': 'apiErrors.fetchAdsFailed',
  'ipHash required': 'apiErrors.identifierRequired',
  'Failed to fetch user votes': 'apiErrors.fetchVotesFailed',
};

export function mapApiError(errorMessage, t) {
  if (!errorMessage) return t('apiErrors.unknown');
  const key = errorMap[errorMessage];
  return key ? t(key) : errorMessage;
}
