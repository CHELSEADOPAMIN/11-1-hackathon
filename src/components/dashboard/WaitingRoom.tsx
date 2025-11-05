'use client';

import { friends, currentUser } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { Clock, LogOut, Mic, MicOff, Users, Video, VideoOff, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface WaitingRoomProps {
  onJoinSession?: () => void;
  onLeave?: () => void;
  sessionTitle?: string;
  startTime?: string;
  participantCount?: number;
}

export default function WaitingRoom({
  onJoinSession,
  onLeave,
  sessionTitle,
  startTime,
  participantCount = 6
}: WaitingRoomProps) {
  const waitingT = useTranslations('GroupExercise.waitingRoom');
  const commonT = useTranslations('GroupExercise.common');
  const [micEnabled, setMicEnabled] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);

  const title = sessionTitle ?? commonT('defaultTitle');

  const actualParticipantCount = Math.min(Math.max(participantCount, 1), 6);
  const otherParticipantCount = Math.max(actualParticipantCount - 1, 0);

  const participants = [currentUser, ...friends.slice(0, otherParticipantCount)];

  const getIdleGif = (index: number) => {
    const idleGifs = [
      '/blue_idle.gif',
      '/pink_idle.gif',
      '/pink_idle.gif',
      '/white_idle.gif',
      '/blue_idle.gif',
      '/white_idle.gif'
    ];
    return idleGifs[index % idleGifs.length];
  };

  const handleJoinSession = () => {
    onJoinSession?.();
  };

  const handleLeave = () => {
    onLeave?.();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {startTime && (
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span>{startTime}</span>
            </div>
          )}
        </div>
        <button
          onClick={handleLeave}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label={waitingT('leave')}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <Clock className="w-5 h-5 text-blue-600 mr-3" />
          <div>
            <p className="text-blue-900 font-medium">{waitingT('waitingTitle')}</p>
            <p className="text-blue-700 text-sm mt-1">{waitingT('waitingHint')}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Users className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            {waitingT('participants', { count: participants.length })}
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {participants.map((participant, index) => (
            <div
              key={participant.id}
              className={cn(
                'p-4 rounded-lg border-2 transition-all',
                participant.id === currentUser.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
              )}
            >
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 mb-2 flex items-center justify-center">
                  <img
                    src={getIdleGif(index)}
                    alt={`${participant.name} avatar`}
                    className="w-full h-full object-contain"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>
                <p
                  className={cn(
                    'text-sm font-medium',
                    participant.id === currentUser.id ? 'text-blue-700' : 'text-gray-700'
                  )}
                >
                  {participant.id === currentUser.id ? waitingT('you') : participant.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">{participant.injuryType}</p>
                <div
                  className={cn(
                    'flex items-center mt-2 text-xs',
                    participant.isOnline ? 'text-green-600' : 'text-gray-400'
                  )}
                >
                  <div
                    className={cn(
                      'w-2 h-2 rounded-full mr-1',
                      participant.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    )}
                  />
                  {participant.isOnline ? waitingT('online') : waitingT('offline')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMicEnabled(!micEnabled)}
              className={cn(
                'flex items-center justify-center w-12 h-12 rounded-full transition-colors',
                micEnabled ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              )}
              aria-label="Toggle microphone"
            >
              {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setVideoEnabled(!videoEnabled)}
              className={cn(
                'flex items-center justify-center w-12 h-12 rounded-full transition-colors',
                videoEnabled
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              )}
              aria-label="Toggle camera"
            >
              {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleLeave}
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {waitingT('leave')}
            </button>

            {onJoinSession && (
              <button
                onClick={handleJoinSession}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {waitingT('join')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
