import React, { useState, useEffect } from 'react';
import { Customer } from '../types';
import { X, User, Phone, Mail, Tag, MapPin, Sparkles } from 'lucide-react';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customerData: Partial<Customer>) => void;
  initialData?: Customer | null;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setPhone(initialData.phone || '');
      setEmail(initialData.email || '');
      setAddress(initialData.address || '');
      setTags(initialData.tags || []);
    } else {
      setName('');
      setPhone('');
      setEmail('');
      setAddress('');
      setTags(['Bespoke']);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      tags,
    });
    onClose();
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-lg rounded-3xl bg-[#FCFBF7] dark:bg-obsidian-900 border border-gold-500/30 shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gold-500/20 flex items-center justify-between bg-gold-500/5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gold-400 to-amber-600 p-0.5 flex items-center justify-center shadow-gold-glow">
              <div className="w-full h-full bg-[#FCFBF7] dark:bg-obsidian-900 rounded-[14px] flex items-center justify-center">
                <User className="w-5 h-5 text-gold-500" />
              </div>
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-50">
                {initialData ? 'Edit Client Profile' : 'New Atelier Client'}
              </h3>
              <p className="font-script text-base text-gold-600 dark:text-gold-400 -mt-1">
                Larré Luxe Bespoke Records
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-gold-500/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-gold-500" />
              Customer Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Chief Adebayo Balogun"
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-obsidian-850 border border-gold-500/25 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 text-neutral-900 dark:text-neutral-100 text-sm placeholder:text-neutral-400 focus:outline-none transition-all"
            />
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-gold-500" />
                Phone Number (WhatsApp)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 803 000 0000"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-obsidian-850 border border-gold-500/25 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 text-neutral-900 dark:text-neutral-100 text-sm placeholder:text-neutral-400 focus:outline-none transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gold-500" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@luxury.com"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-obsidian-850 border border-gold-500/25 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 text-neutral-900 dark:text-neutral-100 text-sm placeholder:text-neutral-400 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Address / Delivery Details */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gold-500" />
              Location / Fitting Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Victoria Island, Lagos / Accra, Ghana"
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-obsidian-850 border border-gold-500/25 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 text-neutral-900 dark:text-neutral-100 text-sm placeholder:text-neutral-400 focus:outline-none transition-all"
            />
          </div>

          {/* Tags / Client Categories */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-gold-500" />
              Client Category Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Type tag (e.g. VIP, Senator, Wedding) and press Enter"
                className="flex-1 px-4 py-2 rounded-xl bg-white dark:bg-obsidian-850 border border-gold-500/25 focus:border-gold-500 text-neutral-900 dark:text-neutral-100 text-xs placeholder:text-neutral-400 focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-2 rounded-xl bg-gold-500/15 hover:bg-gold-500/25 text-gold-700 dark:text-gold-300 text-xs font-medium border border-gold-500/30 transition-colors"
              >
                Add
              </button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-gold-500/10 text-gold-700 dark:text-gold-300 border border-gold-500/20"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => removeTag(t)}
                      className="hover:text-red-500 ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-gold-500/20 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-obsidian-800 text-xs font-medium transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 via-gold-600 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-white text-xs font-medium shadow-gold-glow btn-press flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{initialData ? 'Update Profile' : 'Save & Register Client'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
