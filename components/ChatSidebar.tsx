"use client";

import React from 'react';
import { User } from '../types/messaging';

interface Props {
  contacts: User[];
  currentUser: User;
  selectedId?: string | null;
  onSelect: (user: User) => void;
}

export default function ChatSidebar({ contacts, currentUser, selectedId, onSelect }: Props) {
  return (
    <aside className="w-80 border-r min-h-[60vh] bg-white">
      <div className="p-4 border-b">
        <div className="text-sm text-gray-600">Conversations</div>
        <div className="mt-2 text-sm text-gray-800">Connecté en tant que <strong>{currentUser.name}</strong></div>
      </div>

      <ul className="p-2">
        {contacts.length === 0 && (
          <li className="p-4 text-sm text-gray-500">Aucun contact disponible</li>
        )}

        {contacts.map((c) => {
          const isSelected = selectedId === c.id;
          return (
            <li
              key={c.id}
              className={`flex items-center gap-3 p-3 rounded cursor-pointer hover:bg-gray-50 ${
                isSelected ? 'bg-gray-100' : ''
              }`}
              onClick={() => onSelect(c)}
              aria-current={isSelected}
            >
              <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-sm">{c.name.charAt(0)}</div>
              <div className="flex-1">
                <div className="text-sm font-medium">{c.name}</div>
                <div className="text-xs text-gray-500">{c.role}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
