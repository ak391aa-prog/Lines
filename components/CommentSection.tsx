import React, { useState, useMemo, useCallback } from 'react';
import { Comment } from '../types';
import { LikeIcon } from './icons/LikeIcon';
import { DislikeIcon } from './icons/DislikeIcon';
import { SortIcon } from './icons/SortIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { KebabMenuIcon } from './icons/KebabMenuIcon';
import { CommentActionsMenu } from './CommentActionsMenu';
import { DeleteCommentModal } from './DeleteCommentModal';
import { 
    CURRENT_USER_ID, 
    CURRENT_USER_AVATAR, 
    CURRENT_USER_NAME 
} from '../data/mockData';
import { formatTimeAgo } from '../utils/timeUtils';
import { formatCompactNumber } from '../utils/numberUtils';

const MAX_COMMENT_LENGTH = 280;

interface CommentSectionProps {
  initialComments: Comment[];
}

const getTotalCommentCount = (comments: Comment[]): number => {
    return comments.reduce((count, comment) => {
        return count + 1 + getTotalCommentCount(comment.replies || []);
    }, 0);
};

const findComment = (comments: Comment[], commentId: string): Comment | null => {
    for (const comment of comments) {
        if (comment.id === commentId) return comment;
        if (comment.replies) {
            const foundInReply = findComment(comment.replies, commentId);
            if (foundInReply) return foundInReply;
        }
    }
    return null;
}

const CommentItem: React.FC<{ 
    comment: Comment;
    onUpdate: (commentId: string, newText: string) => void;
    onDelete: (commentId: string) => void;
    onAddReply: (parentId: string, newReply: Comment) => void;
    isReply?: boolean; 
}> = ({ comment, onUpdate, onDelete, onAddReply, isReply = false }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const [likeCount, setLikeCount] = useState(comment.likes);
    const [showReplies, setShowReplies] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(comment.text);
    
    const [likeAnimation, setLikeAnimation] = useState(false);
    const [dislikeAnimation, setDislikeAnimation] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const isCurrentUserComment = comment.authorId === CURRENT_USER_ID;

    const handleLike = () => {
        const originalLikeCount = comment.likes;
        if (isLiked) {
            setIsLiked(false);
            setLikeCount(originalLikeCount);
        } else {
            setIsLiked(true);
            setLikeCount(originalLikeCount + 1);
            if (isDisliked) setIsDisliked(false);
            setLikeAnimation(true);
        }
    };

    const handleDislike = () => {
        if (isDisliked) {
            setIsDisliked(false);
        } else {
            setIsDisliked(true);
            if (isLiked) {
                setIsLiked(false);
                setLikeCount(comment.likes);
            }
            setDislikeAnimation(true);
        }
    };
    
    const handleEditSave = () => {
        if (editedText.trim()) {
            onUpdate(comment.id, editedText);
            setIsEditing(false);
        }
    };
    
    const handleDelete = () => {
        onDelete(comment.id);
        setIsDeleteModalOpen(false);
    };

    const handleReplySubmit = (text: string) => {
        const newReply: Comment = {
            id: `reply-${Date.now()}`,
            authorId: CURRENT_USER_ID,
            author: CURRENT_USER_NAME,
            avatarUrl: CURRENT_USER_AVATAR,
            text,
            timestamp: 'Just now',
            date: new Date().toISOString(),
            likes: 0,
            replies: [],
        };
        onAddReply(comment.id, newReply);
        setIsReplying(false);
        setShowReplies(true);
    };

    return (
        <div className={`flex items-start gap-4 ${isReply ? 'mt-4' : ''}`}>
            <img src={comment.avatarUrl} alt={comment.author} className="w-10 h-10 rounded-full" />
            <div className="flex-1">
                {!isEditing ? (
                    <>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-slate-800">{comment.author}</span>
                            <span className="text-xs text-slate-500">{formatTimeAgo(comment.date)}</span>
                        </div>
                        <p className="text-slate-700 mt-1 text-base whitespace-pre-wrap">{comment.text}</p>
                    </>
                ) : (
                    <CommentInput
                        initialText={editedText}
                        onCancel={() => setIsEditing(false)}
                        onSubmit={handleEditSave}
                        isEditing
                    />
                )}

                {!isEditing && (
                    <div className="flex items-center gap-1 mt-2">
                        <button onClick={handleLike} aria-pressed={isLiked} onAnimationEnd={() => setLikeAnimation(false)}
                            className={`flex items-center gap-1.5 p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors ${isLiked ? 'text-amber-500' : 'text-slate-600'}`}>
                            <LikeIcon active={isLiked} className={`w-5 h-5 ${likeAnimation ? 'animate-like-bounce' : ''}`} />
                        </button>
                        <span className="text-sm font-medium text-slate-600 min-w-[1rem]">{likeCount > 0 ? formatCompactNumber(likeCount) : ''}</span>
                        <button onClick={handleDislike} aria-pressed={isDisliked} onAnimationEnd={() => setDislikeAnimation(false)}
                            className={`p-2 rounded-full hover:bg-slate-100 transition-colors ${isDisliked ? 'text-amber-500' : 'text-slate-600'}`}>
                            <DislikeIcon active={isDisliked} className={`w-5 h-5 ${dislikeAnimation ? 'animate-dislike-jiggle' : ''}`} />
                        </button>
                        <button onClick={() => setIsReplying(prev => !prev)}
                            className="ml-2 px-3 py-1.5 text-sm font-semibold rounded-full hover:bg-slate-200 transition-colors text-slate-700">
                            Reply
                        </button>
                    </div>
                )}
                {isReplying && (
                    <div className="mt-3">
                        <CommentInput
                            onCancel={() => setIsReplying(false)}
                            onSubmit={handleReplySubmit}
                            placeholder="Add a reply..."
                        />
                    </div>
                )}
                {comment.replies && comment.replies.length > 0 && (
                     <button onClick={() => setShowReplies(!showReplies)} 
                        className="flex items-center gap-1 text-sm font-bold text-amber-600 hover:bg-amber-100 rounded-full p-2 mt-2 -ml-2 transition-colors">
                        <ChevronDownIcon className={`w-5 h-5 transition-transform ${showReplies ? '-rotate-180' : ''}`} />
                        {comment.replies.length} {comment.replies.length > 1 ? 'replies' : 'reply'}
                    </button>
                )}
                {showReplies && comment.replies && (
                    <div className="border-l-2 border-slate-200 pl-4">
                        {comment.replies.map(reply => (
                            <CommentItem key={reply.id} comment={reply} isReply onUpdate={onUpdate} onDelete={onDelete} onAddReply={onAddReply} />
                        ))}
                    </div>
                )}
            </div>
            {isCurrentUserComment && !isEditing && (
                <div className="relative">
                    <button onClick={() => setIsMenuOpen(p => !p)} className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800" aria-label="Comment actions">
                        <KebabMenuIcon className="w-5 h-5" />
                    </button>
                    <CommentActionsMenu
                        isOpen={isMenuOpen}
                        onClose={() => setIsMenuOpen(false)}
                        onEdit={() => { setIsEditing(true); setIsMenuOpen(false); }}
                        onDelete={() => { setIsDeleteModalOpen(true); setIsMenuOpen(false); }}
                    />
                </div>
            )}
             <DeleteCommentModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
            />
        </div>
    );
};

const CommentInput: React.FC<{
    initialText?: string;
    placeholder?: string;
    onSubmit: (text: string) => void;
    onCancel: () => void;
    isEditing?: boolean;
}> = ({ initialText = '', placeholder = "Add a comment...", onSubmit, onCancel, isEditing = false }) => {
    const [text, setText] = useState(initialText);
    const isSubmitDisabled = text.trim().length === 0;

    const handleSubmit = () => {
        if (!isSubmitDisabled) {
            onSubmit(text);
            setText('');
        }
    };
    
    return (
        <div className="flex items-start gap-3 w-full">
            {!isEditing && <img src={CURRENT_USER_AVATAR} alt="Your Avatar" className="w-10 h-10 rounded-full" />}
            <div className="flex-1">
                <textarea
                    placeholder={placeholder}
                    aria-label={placeholder}
                    className="w-full bg-transparent border-b border-slate-300 focus:border-slate-900 outline-none transition-colors text-slate-800 text-base pb-1 resize-none"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={1}
                    maxLength={MAX_COMMENT_LENGTH}
                    autoFocus
                />
                <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-slate-500">{text.length}/{MAX_COMMENT_LENGTH}</span>
                    <div className="flex gap-2">
                        <button onClick={onCancel} className="px-4 py-2 text-sm font-semibold rounded-full hover:bg-slate-200 transition-colors">Cancel</button>
                        <button onClick={handleSubmit} disabled={isSubmitDisabled} className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${isSubmitDisabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-800 text-white hover:bg-black'}`}>
                            {isEditing ? 'Save' : 'Comment'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


export const CommentSection: React.FC<CommentSectionProps> = ({ initialComments }) => {
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [sortBy, setSortBy] = useState<'top' | 'newest'>('top');
    const [isCommenting, setIsCommenting] = useState(false);

    const totalCommentCount = useMemo(() => getTotalCommentCount(comments), [comments]);

    const sortedComments = useMemo(() => {
        const commentCopy: Comment[] = JSON.parse(JSON.stringify(comments));
        const sortFn = (a: Comment, b: Comment) => {
          if (sortBy === 'top') return b.likes - a.likes;
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        };
        const recursiveSort = (commentList: Comment[]): Comment[] => {
            commentList.sort(sortFn);
            commentList.forEach(c => { if (c.replies) c.replies = recursiveSort(c.replies); });
            return commentList;
        };
        return recursiveSort(commentCopy);
    }, [comments, sortBy]);

    const handleAddComment = useCallback((text: string) => {
        const newComment: Comment = {
            id: `comment-${Date.now()}`,
            authorId: CURRENT_USER_ID,
            author: CURRENT_USER_NAME,
            avatarUrl: CURRENT_USER_AVATAR,
            text,
            timestamp: 'Just now',
            date: new Date().toISOString(),
            likes: 0,
            replies: [],
        };
        setComments(prev => [newComment, ...prev]);
        setIsCommenting(false);
    }, []);

    const updateCommentRecursively = (comments: Comment[], commentId: string, newText: string): Comment[] => {
        return comments.map(c => {
            if (c.id === commentId) return { ...c, text: newText };
            if (c.replies) return { ...c, replies: updateCommentRecursively(c.replies, commentId, newText) };
            return c;
        });
    };

    const handleUpdateComment = useCallback((commentId: string, newText: string) => {
        setComments(prev => updateCommentRecursively(prev, commentId, newText));
    }, []);

    const deleteCommentRecursively = (comments: Comment[], commentId: string): Comment[] => {
        return comments.filter(c => c.id !== commentId).map(c => {
            if (c.replies) return { ...c, replies: deleteCommentRecursively(c.replies, commentId) };
            return c;
        });
    };
    
    const handleDeleteComment = useCallback((commentId: string) => {
        setComments(prev => deleteCommentRecursively(prev, commentId));
    }, []);
    
    const addReplyRecursively = (comments: Comment[], parentId: string, newReply: Comment): Comment[] => {
        return comments.map(c => {
            if (c.id === parentId) return { ...c, replies: [newReply, ...(c.replies || [])] };
            if (c.replies) return { ...c, replies: addReplyRecursively(c.replies, parentId, newReply) };
            return c;
        });
    };

    const handleAddReply = useCallback((parentId: string, newReply: Comment) => {
        setComments(prev => addReplyRecursively(prev, parentId, newReply));
    }, []);

    return (
        <div className="mt-6">
            <div className="flex items-center gap-6 mb-5">
                <h2 className="text-xl font-bold text-slate-900">{totalCommentCount.toLocaleString()} Comments</h2>
                <div className="flex items-center gap-2">
                    <SortIcon className="w-5 h-5 text-slate-500" />
                    <button onClick={() => setSortBy('top')}
                        className={`text-sm font-semibold transition-colors ${sortBy === 'top' ? 'text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}>Top comments</button>
                    <span className="text-slate-300">|</span>
                    <button onClick={() => setSortBy('newest')}
                        className={`text-sm font-semibold transition-colors ${sortBy === 'newest' ? 'text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}>Newest first</button>
                </div>
            </div>

            <div className="mb-8">
                {isCommenting ? (
                    <CommentInput onSubmit={handleAddComment} onCancel={() => setIsCommenting(false)} />
                ) : (
                    <div className="flex items-start gap-4">
                        <img src={CURRENT_USER_AVATAR} alt="Your Avatar" className="w-10 h-10 rounded-full" />
                        <input onClick={() => setIsCommenting(true)}
                            type="text" placeholder="Add a comment..." readOnly
                            className="flex-1 bg-transparent border-b border-slate-300 focus:border-slate-900 outline-none transition-colors text-slate-500 text-base py-1 cursor-pointer" />
                    </div>
                )}
            </div>

            <div className="space-y-6">
                {sortedComments.map(comment => (
                    <CommentItem key={comment.id} comment={comment} onUpdate={handleUpdateComment} onDelete={handleDeleteComment} onAddReply={handleAddReply} />
                ))}
                {comments.length === 0 && <p className="text-slate-500">No comments yet. Be the first to comment!</p>}
            </div>
        </div>
    );
};