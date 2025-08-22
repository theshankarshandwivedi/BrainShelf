// src/components/FollowersModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ApiService from '../services/api';

const FollowersModal = ({ isOpen, onClose, userId, type, username }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    const fetchUsers = useCallback(async (pageNum = 1, reset = false) => {
        setLoading(true);
        setError('');

        try {
            let response;
            if (type === 'followers') {
                response = await ApiService.getFollowers(userId, pageNum);
            } else {
                response = await ApiService.getFollowing(userId, pageNum);
            }

            const newUsers = response.data[type] || [];
            
            if (reset) {
                setUsers(newUsers);
            } else {
                setUsers(prev => [...prev, ...newUsers]);
            }

            setTotalCount(type === 'followers' ? response.data.totalFollowers : response.data.totalFollowing);
            setHasMore(pageNum < response.data.totalPages);
            setPage(pageNum);

        } catch (error) {
            console.error(`Error fetching ${type}:`, error);
            setError(`Failed to load ${type}`);
        } finally {
            setLoading(false);
        }
    }, [userId, type]);

    useEffect(() => {
        if (isOpen && userId) {
            fetchUsers(1, true);
        }
    }, [isOpen, userId, type, fetchUsers]);

    const loadMore = () => {
        if (!loading && hasMore) {
            fetchUsers(page + 1, false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content followers-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{type === 'followers' ? 'Followers' : 'Following'} ({totalCount})</h3>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    {error && (
                        <div className="error-message">{error}</div>
                    )}

                    {users.length === 0 && !loading ? (
                        <div className="empty-state">
                            {username} {type === 'followers' ? 'has no followers' : 'is not following anyone'} yet.
                        </div>
                    ) : (
                        <div className="users-list">
                            {users.map((user) => (
                                <div key={user._id} className="user-item">
                                    <Link to={`/profile/${user.username}`} onClick={onClose} className="user-link">
                                        <div className="user-avatar">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt={user.name} />
                                            ) : (
                                                <div className="avatar-placeholder">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="user-info">
                                            <div className="user-name">{user.name}</div>
                                            <div className="user-username">@{user.username}</div>
                                            {user.bio && <div className="user-bio">{user.bio}</div>}
                                        </div>
                                    </Link>
                                </div>
                            ))}

                            {hasMore && (
                                <div className="load-more-container">
                                    <button 
                                        className="load-more-btn" 
                                        onClick={loadMore} 
                                        disabled={loading}
                                    >
                                        {loading ? 'Loading...' : 'Load More'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {loading && users.length === 0 && (
                        <div className="loading-state">Loading {type}...</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FollowersModal;
