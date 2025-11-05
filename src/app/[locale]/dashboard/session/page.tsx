'use client';

import SessionRoom from '@/components/dashboard/SessionRoom';
import WaitingRoom from '@/components/dashboard/WaitingRoom';
import { groupExercises } from '@/lib/mockData';
import { Clock, Pin, Users } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

export default function SessionPage() {
  const locale = useLocale();
  const tPage = useTranslations('GroupExercise.page');
  const tCommon = useTranslations('GroupExercise.common');
  const tTime = useTranslations('GroupExercise.time');
  const [inSession, setInSession] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [showWaitingRoom, setShowWaitingRoom] = useState(false);

  const sortedGroups = [...groupExercises].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });

  const handleJoinGroup = (groupId: string) => {
    setSelectedGroup(groupId);
    setShowWaitingRoom(true);
  };

  const handleJoinSession = () => {
    setInSession(true);
  };

  const handleLeave = () => {
    setInSession(false);
    setShowWaitingRoom(false);
    setSelectedGroup(null);
  };

  const getSelectedGroupData = () => {
    return groupExercises.find((group) => group.id === selectedGroup);
  };

  const formatStartTime = (startTime: string) => {
    const target = new Date(startTime);
    const diffMs = target.getTime() - Date.now();
    const diffMinutes = Math.round(diffMs / 60000);

    if (diffMinutes <= 0) {
      return tTime('startingNow');
    }

    const relativeTime = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    if (diffMinutes < 60) {
      return tTime('startingAt', { time: relativeTime.format(Math.max(diffMinutes, 1), 'minute') });
    }

    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) {
      return tTime('startingAt', { time: relativeTime.format(Math.max(diffHours, 1), 'hour') });
    }

    const diffDays = Math.round(diffHours / 24);
    return tTime('startingAt', { time: relativeTime.format(Math.max(diffDays, 1), 'day') });
  };

  // Show session room if in active session
  if (inSession) {
    const groupData = getSelectedGroupData();
    return (
      <SessionRoom
        sessionTitle={groupData?.title || tCommon('defaultTitle')}
        onLeave={handleLeave}
        participantCount={groupData?.participantCount || 6}
      />
    );
  }

  // Show waiting room if a group is selected
  if (showWaitingRoom && selectedGroup) {
    const groupData = getSelectedGroupData();
    return (
      <div className="p-6">
        <WaitingRoom
          sessionTitle={groupData?.title || tCommon('defaultTitle')}
          startTime={formatStartTime(groupData?.startTime || new Date().toISOString())}
          onJoinSession={handleJoinSession}
          onLeave={handleLeave}
          participantCount={groupData?.participantCount || 6}
        />
      </div>
    );
  }

  // Show group list (default view)
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{tPage('title')}</h1>
        <p className="text-gray-600">{tPage('subtitle')}</p>
      </div>

      {/* Pinned Exercises Section */}
      {sortedGroups.some(g => g.isPinned) && (
        <div>
          <div className="flex items-center mb-4">
            <Pin className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">{tPage('recommended.title')}</h2>
            <span className="ml-2 text-sm text-gray-500">{tPage('recommended.tagline')}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedGroups
              .filter(g => g.isPinned)
              .map((group) => (
                <div
                  key={group.id}
                  className="bg-white rounded-xl shadow-sm border-2 border-blue-200 p-5 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleJoinGroup(group.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <Pin className="w-4 h-4 text-blue-600 mr-1" />
                        <h3 className="font-semibold text-gray-900">{group.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{group.exerciseType}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>{formatStartTime(group.startTime)}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          <span>{group.participantCount}/{group.maxParticipants}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                    {tCommon('joinExercise')}
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* All Exercises Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{tPage('all.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedGroups.map((group) => (
            <div
              key={group.id}
              className={group.isPinned
                ? "hidden"
                : "bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer"
              }
              onClick={() => handleJoinGroup(group.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{group.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{group.exerciseType} · {group.category}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{formatStartTime(group.startTime)}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      <span>{group.participantCount}/{group.maxParticipants}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button className="w-full mt-3 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm">
                {tCommon('joinExercise')}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
