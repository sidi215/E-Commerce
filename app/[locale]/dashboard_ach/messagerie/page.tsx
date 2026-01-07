'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Modal from '@/components/Modal';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'farmer' | 'buyer';
  recipientId: string;
  recipientName: string;
  recipientType: 'farmer' | 'buyer';
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  relatedSaleId?: string;
  relatedProductId?: string;
}

interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    type: 'farmer' | 'buyer';
    avatar?: string;
  };
  lastMessage: {
    content: string;
    timestamp: string;
    isRead: boolean;
  };
  relatedSaleId?: string;
  relatedProduct?: string;
  unreadCount: number;
}

export default function MessagerieAcheteurPage() {
  const locale = useLocale();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [messageSubject, setMessageSubject] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API URL - sera configuré pour le back-end
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Fetch conversations from API
  useEffect(() => {
    let mounted = true;
    async function loadConversations() {
      try {
        const response = await fetch(`${API_URL}/api/buyer/conversations/`);
        if (!mounted) return;
        
        if (response.ok) {
          const data = await response.json();
          setConversations(data);
        } else {
          setError('Failed to fetch conversations');
        }
      } catch (err) {
        if (mounted) setError('Error loading conversations');
        console.error('Failed to fetch conversations', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadConversations();
    return () => { mounted = false; };
  }, [API_URL]);

  // Fetch messages for selected conversation
  useEffect(() => {
    if (!selectedConversation) return;
    
    let mounted = true;
    async function loadMessages() {
      try {
        const response = await fetch(`${API_URL}/api/buyer/conversations/${selectedConversation.id}/messages/`);
        if (!mounted) return;
        
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        }
      } catch (err) {
        console.error('Failed to fetch messages', err);
      }
    }
    loadMessages();
    return () => { mounted = false; };
  }, [API_URL, selectedConversation]);

  const handleSendMessage = async () => {
    if (!messageContent.trim() || !selectedConversation) return;

    try {
      const response = await fetch(`${API_URL}/api/buyer/conversations/${selectedConversation.id}/messages/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: messageContent,
          subject: messageSubject || 'Nouveau message',
        }),
      });

      if (response.ok) {
        const newMessage = await response.json();
        setMessages([...messages, newMessage]);
        setMessageContent('');
        setMessageSubject('');
      } else {
        console.error('Failed to send message');
      }
    } catch (err) {
      console.error('Error sending message', err);
    }
  };

  const handleCreateNewConversation = async () => {
    if (!messageSubject.trim() || !messageContent.trim() || !selectedRecipient) return;

    try {
      const response = await fetch(`${API_URL}/api/buyer/conversations/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientId: selectedRecipient,
          subject: messageSubject,
          content: messageContent,
        }),
      });

      if (response.ok) {
        const newConversation = await response.json();
        setConversations([newConversation, ...conversations]);
        setShowNewMessageModal(false);
        setMessageContent('');
        setMessageSubject('');
        setSelectedRecipient('');
        setSelectedConversation(newConversation);
      } else {
        console.error('Failed to create conversation');
      }
    } catch (err) {
      console.error('Error creating conversation', err);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⏳</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Chargement...</h3>
            <p className="text-gray-600">Chargement des conversations depuis le serveur</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-8 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">❌</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Erreur</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Link href={`/${locale}/dashboard_ach`} className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
                <span className="mr-2">←</span>
                Retour au dashboard
              </Link>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">💬 Messagerie</h1>
              <p className="text-gray-600">Communiquez directement avec les agriculteurs</p>
            </div>
            <Button 
              variant="primary" 
              onClick={() => setShowNewMessageModal(true)}
            >
              ✉️ Nouveau message
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card>
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Conversations</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <div className="text-2xl mb-2">💬</div>
                    <p>Aucune conversation</p>
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                        selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 flex items-center justify-center">
                          👨‍🌾
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{conversation.participant.name}</h4>
                          <p className="text-sm text-gray-500">{conversation.participant.type}</p>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                            {conversation.unreadCount}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage.content}</p>
                      <p className="text-xs text-gray-400">{formatTimestamp(conversation.lastMessage.timestamp)}</p>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Messages */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <Card>
                <div className="p-4 border-b">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 flex items-center justify-center">
                      👨‍🌾
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedConversation.participant.name}</h3>
                      <p className="text-sm text-gray-500">{selectedConversation.participant.type}</p>
                    </div>
                  </div>
                </div>
                <div className="h-96 overflow-y-auto p-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <p>Aucun message dans cette conversation</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`mb-4 ${
                          message.senderType === 'buyer' ? 'text-right' : 'text-left'
                        }`}
                      >
                        <div
                          className={`inline-block max-w-xs px-4 py-2 rounded-lg ${
                            message.senderType === 'buyer'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs mt-1 opacity-75">
                            {formatTimestamp(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      placeholder="Tapez votre message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} disabled={!messageContent.trim()}>
                      Envoyer
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card>
                <div className="p-8 text-center text-gray-500">
                  <div className="text-4xl mb-4">💬</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Sélectionnez une conversation</h3>
                  <p>Choisissez une conversation dans la liste pour commencer à discuter</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* New Message Modal */}
        <Modal 
          isOpen={showNewMessageModal} 
          onClose={() => setShowNewMessageModal(false)} 
          title="Nouveau message"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destinataire</label>
              <select
                value={selectedRecipient}
                onChange={(e) => setSelectedRecipient(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner un agriculteur...</option>
                {/* Options will be populated from API */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
              <input
                type="text"
                value={messageSubject}
                onChange={(e) => setMessageSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Sujet du message"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Votre message..."
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleCreateNewConversation} disabled={!messageSubject.trim() || !messageContent.trim() || !selectedRecipient}>
                Envoyer
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowNewMessageModal(false)}
              >
                Annuler
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
                
     
                                       
                                                                                                          
                              
                                                                                                                                                                                                            
