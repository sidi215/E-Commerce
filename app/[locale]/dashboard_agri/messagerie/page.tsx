'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
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
  productImage?: string;
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

export default function MessagerieAgriPage() {
  const t = useTranslations('dashboard');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [messageSubject, setMessageSubject] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('');

  // Données de démonstration - conversations avec acheteurs uniquement
  const [conversations, setConversations] = useState<Conversation[]>([]);

  // Messages de la conversation sélectionnée
  const [messages, setMessages] = useState<Message[]>([]);

  // Liste des acheteurs disponibles (uniquement les acheteurs)
  const availableRecipients: Array<{id: string; name: string; type: 'buyer'}> = [];

  const sendMessage = () => {
    if (!messageContent.trim() || !selectedRecipient) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'farmer1',
      senderName: 'Agriculteur',
      senderType: 'farmer',
      recipientId: selectedRecipient,
      recipientName: availableRecipients.find(r => r.id === selectedRecipient)?.name || '',
      recipientType: 'buyer',
      subject: messageSubject,
      content: messageContent,
      timestamp: new Date().toLocaleString('fr-FR'),
      isRead: false
    };

    setMessages([...messages, newMessage]);
    setMessageContent('');
    setMessageSubject('');
    setSelectedRecipient('');
    setShowNewMessageModal(false);
  };

  const markAsRead = (conversationId: string) => {
    setConversations(conversations.map(conv => 
      conv.id === conversationId 
        ? { ...conv, unreadCount: 0, lastMessage: { ...conv.lastMessage, isRead: true } }
        : conv
    ));
  };

  const unreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard_agri">
              <Button variant="outline" size="sm">
                ← Retour au dashboard
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">💬 Messagerie</h1>
          <p className="text-gray-600">Communication avec les acheteurs</p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Règles de communication:</strong> Vous pouvez uniquement communiquer avec les acheteurs 
              pour répondre à leurs questions sur la qualité des produits et les modalités de transport.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des conversations */}
          <div className="lg:col-span-1">
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Conversations</h2>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount} non lus
                  </span>
                )}
              </div>
              
              <Button 
                variant="primary" 
                className="w-full mb-4"
                onClick={() => setShowNewMessageModal(true)}
              >
                ✉️ Nouveau message
              </Button>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {conversations.map(conversation => (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedConversation?.id === conversation.id 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    } ${conversation.unreadCount > 0 ? 'font-semibold' : ''}`}
                    onClick={() => {
                      setSelectedConversation(conversation);
                      markAsRead(conversation.id);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <img 
                        src={conversation.participant.avatar} 
                        alt={conversation.participant.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {conversation.participant.name}
                          </h3>
                          {conversation.unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mb-1">
                          🛒 {conversation.relatedProduct}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage.content}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {conversation.lastMessage.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Zone de conversation */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <Card className="h-full">
                <div className="border-b pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={selectedConversation.participant.avatar} 
                      alt={selectedConversation.participant.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {selectedConversation.participant.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        🛒 Produit: {selectedConversation.relatedProduct}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderType === 'farmer' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderType === 'farmer'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderType === 'farmer' ? 'text-green-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Zone de réponse */}
                <div className="border-t pt-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      placeholder="Tapez votre message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <Button variant="primary" onClick={sendMessage}>
                      Envoyer
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">
                    Sélectionnez une conversation
                  </h3>
                  <p className="text-gray-600">
                    Choisissez une conversation dans la liste pour afficher les messages
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Modal nouveau message */}
        {showNewMessageModal && (
          <Modal
            isOpen={showNewMessageModal}
            onClose={() => setShowNewMessageModal(false)}
            title="Nouveau message"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destinataire (Acheteurs uniquement)
                </label>
                <select
                  value={selectedRecipient}
                  onChange={(e) => setSelectedRecipient(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Sélectionnez un acheteur...</option>
                  {availableRecipients.map(recipient => (
                    <option key={recipient.id} value={recipient.id}>
                      {recipient.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sujet
                </label>
                <input
                  type="text"
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                  placeholder="Sujet du message..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Votre message..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div className="flex gap-2">
                <Button variant="primary" onClick={sendMessage}>
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
        )}
      </div>
    </div>
  );
}
