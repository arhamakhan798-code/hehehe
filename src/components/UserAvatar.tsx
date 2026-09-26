'use client';

import React from 'react';

interface UserAvatarProps {
  avatar?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
}

export function isImageAvatar(avatar?: string): boolean {
  if (!avatar) return false;
  return (
    avatar.startsWith('data:image/') ||
    avatar.startsWith('http://') ||
    avatar.startsWith('https://') ||
    avatar.startsWith('blob:') ||
    avatar.startsWith('/')
  );
}

export default function UserAvatar({
  avatar = '👩‍💼',
  className = '',
  size = 'md',
}: UserAvatarProps) {
  const isImg = isImageAvatar(avatar);

  const sizeMap = {
    xs: 'w-5 h-5 text-xs',
    sm: 'w-7 h-7 text-sm',
    md: 'w-10 h-10 text-xl',
    lg: 'w-14 h-14 text-3xl',
    xl: 'w-20 h-20 text-4xl',
    custom: '',
  };

  const currentSizeClass = sizeMap[size];

  if (isImg) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatar}
        alt="User Profile"
        className={`rounded-2xl object-cover flex-shrink-0 ${currentSizeClass} ${className}`}
      />
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center flex-shrink-0 leading-none select-none ${currentSizeClass} ${className}`}
    >
      {avatar || '👩‍💼'}
    </span>
  );
}
