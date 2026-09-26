import React, { useState } from 'react';
import { Share2, Copy, Check, MessageSquare, X, ExternalLink } from 'lucide-react';
import { Customer } from '../types';


interface SharePortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer | null;
}

export const SharePortalModal: React.FC<SharePortalModalProps> = ({
  isOpen,
  onClose,
  customer,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Build the portal URL
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const portalUrl = customer 
    ? `${origin}/?portal=measure&cid=${customer.id}`
    : `${origin}/?portal=measure`;

  const handleCopy = () => {
    navigator.clipboard.writeText(portalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const recipientName = customer ? customer.name.split(' ')[0] : 'Valued Client';
  const whatsappText = `👑 *Larré Luxe Haute Couture Atelier*
---------------------------------------
Greetings ${recipientName},

We invite you to enter your bespoke garment measurements directly into our atelier records using your private self-service link below:

🔗 ${portalUrl}

Please follow the simple on-screen guidance. We look forward to crafting your bespoke garment with royal perfection.`;

  const whatsappHref = customer?.phone
    ? `https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappText)}`
    : `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg glass-panel border border-gold-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl relative text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-neutral-800/50 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-gold-400 to-amber-600 p-0.5 shadow-gold-glow flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-neutral-900 rounded-[14px] flex items-center justify-center">
              <Share2 className="w-5 h-5 text-gold-400" />
            </div>
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-50">
              Share Self-Measurement Portal
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {customer ? `Private link for ${customer.name}` : 'General self-measurement link for new clients'}
            </p>
          </div>
        </div>

        {/* Link Display Box */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
              Self-Measurement Portal URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={portalUrl}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-obsidian-850 border border-gold-500/25 text-neutral-800 dark:text-neutral-200 text-xs font-mono select-all focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gold-500 hover:bg-gold-400 text-neutral-950 font-bold shadow-sm'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* WhatsApp Action */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" />
                <span>Invite via WhatsApp</span>
              </span>
              {customer?.phone && (
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                  {customer.phone}
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-300">
              Sends an invitation with polite royal greetings and the direct self-measuring link.
            </p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-2 btn-press"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Send WhatsApp Invitation</span>
            </a>
          </div>

          {/* Test Link in New Tab */}
          <div className="pt-2 flex items-center justify-between border-t border-gold-500/15 text-xs text-neutral-500">
            <a
              href={portalUrl}
              target="_blank"
              rel="noreferrer"
              className="text-gold-600 dark:text-gold-400 hover:underline flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Portal in New Tab</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-obsidian-800"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
