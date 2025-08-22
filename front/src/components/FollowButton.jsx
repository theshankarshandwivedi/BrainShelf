// src/components/FollowButton.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import ApiService from '../services/api';

const FollowButton = ({ userId, initialFollowStatus = false, onFollowChange }) => {
    const { user: currentUser, isAuthenticated } = useAuth();
    const [isFollowing, setIsFollowing] = useState(initialFollowStatus);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const checkFollowStatus = useCallback(async () => {
        try {
            const response = await ApiService.getFollowStatus(userId);
            setIsFollowing(response.data.isFollowing);
        } catch (error) {
            console.error('Error checking follow status:', error);
        }
    }, [userId]);

    useEffect(() => {
        if (isAuthenticated && currentUser && userId && currentUser.id !== userId) {
            checkFollowStatus();
        }
    }, [userId, currentUser, isAuthenticated, checkFollowStatus]);

    const handleFollowClick = async () => {
        if (!isAuthenticated) {
            setError('Please login to follow users');
            return;
        }

        setLoading(true);
        setError('');

        try {
            let response;
            if (isFollowing) {
                response = await ApiService.unfollowUser(userId);
            } else {
                response = await ApiService.followUser(userId);
            }

            setIsFollowing(!isFollowing);
            
            // Notify parent component of follow status change
            if (onFollowChange) {
                onFollowChange({
                    isFollowing: !isFollowing,
                    followersCount: response.data.followersCount
                });
            }

        } catch (error) {
            console.error('Error following/unfollowing user:', error);
            setError(error.message || 'Failed to update follow status');
        } finally {
            setLoading(false);
        }
    };

    // Don't show follow button for current user or if not authenticated
    if (!isAuthenticated || !currentUser || currentUser.id === userId) {
        return null;
    }

    return (
        <div className="follow-button-container">
            <button
                className={`follow-button ${isFollowing ? 'following' : 'not-following'}`}
                onClick={handleFollowClick}
                disabled={loading}
            >
                {loading ? (
                    'Loading...'
                ) : isFollowing ? (
                    'Unfollow'
                ) : (
                    'Follow'
                )}
            </button>
            {error && <div className="follow-error">{error}</div>}
        </div>
    );
};

export default FollowButton;
