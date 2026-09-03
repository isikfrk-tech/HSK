import { useState } from 'react';
import type { HSKLevel } from '../types';
import { useCustomWords } from '../hooks/useCustomWords';

interface AddWordModalProps {
  open: boolean;
  onClose: () => void;
}

type Category = 5 | 6 | 7;

const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: 5, label: 'HSK 5' },
  { value: 6, label: 'HSK 6' },
  { value: 7, label: 'Kendi Kelimelerim' },
];

const emptyForm = {
  chinese: '',
  pinyin: '',
  turkish: '',
  category: 7 as Category,
  exChinese: '',
  exPinyin: '',
  exTurkish: '',
};

export function AddWordModal({ open, onClose }: AddWordModalProps) {
  const { customWords, addCustomWord, removeCustomWord } = useCustomWords();
  const [form, setForm] = useState(emptyForm);
  const [savedMsg, setSavedMsg] = useState(false);

  if (!open) return null;

  const exampleMismatch =
    form.exChinese.trim().length > 0 &&
    form.chinese.trim().length > 0 &&
    !form.exChinese.includes(form.chinese.trim());

  const canSubmit =
    form.chinese.trim().length > 0 &&
    form.pinyin.trim().length > 0 &&
    form.turkish.trim().length > 0 &&
    !exampleMismatch &&
    (form.exChinese.trim().length === 0 || form.exTurkish.trim().length > 0);

  const handleSubmit = () => {
    if (!canSubmit) return;
    addCustomWord({
      chinese: form.chinese.trim(),
      pinyin: form.pinyin.trim(),
      turkish: form.turkish.trim(),
      level: form.category as HSKLevel,
      category: form.category === 7 ? 'Kendi Kelimelerim' : undefined,
      examples: form.exChinese.trim()
        ? [{
            chinese: form.exChinese.trim(),
            pinyin: form.exPinyin.trim(),
            turkish: form.exTurkish.trim(),
          }]
        : undefined,
    });
    setForm(emptyForm);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  const close = () => {
    setForm(emptyForm);
    setSavedMsg(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-start sm:items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">➕ Kelime Ekle</h2>
          <button
            onClick={close}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="Kapat"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Çince Karakter *</label>
              <input
                type="text"
                value={form.chinese}
                onChange={e => setForm(f => ({ ...f, chinese: e.target.value }))}
                placeholder="例如：加油"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Pinyin *</label>
              <input
                type="text"
                value={form.pinyin}
                onChange={e => setForm(f => ({ ...f, pinyin: e.target.value }))}
                placeholder="jiāyóu"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Türkçe Anlamı *</label>
            <input
              type="text"
              value={form.turkish}
              onChange={e => setForm(f => ({ ...f, turkish: e.target.value }))}
              placeholder="hadi, kolay gelsin"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-2">Kategori *</label>
            <div className="flex gap-2">
              {CATEGORY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, category: opt.value }))}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    form.category === opt.value
                      ? 'bg-red-600 text-white'
                      : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <label className="text-xs font-semibold text-gray-500 block mb-1">
              Örnek Cümle <span className="font-normal text-gray-400">(opsiyonel — Boşluk Doldurma alıştırmasında kullanılabilmesi için önerilir)</span>
            </label>
            <input
              type="text"
              value={form.exChinese}
              onChange={e => setForm(f => ({ ...f, exChinese: e.target.value }))}
              placeholder="Çince cümle (kelimeyi içermeli)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            {exampleMismatch && (
              <p className="text-xs text-red-500 mb-2">Örnek cümle, yukarıdaki Çince kelimeyi içermeli.</p>
            )}
            <input
              type="text"
              value={form.exPinyin}
              onChange={e => setForm(f => ({ ...f, exPinyin: e.target.value }))}
              placeholder="Cümlenin pinyini (opsiyonel)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <input
              type="text"
              value={form.exTurkish}
              onChange={e => setForm(f => ({ ...f, exTurkish: e.target.value }))}
              placeholder="Cümlenin Türkçe çevirisi"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          {savedMsg && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-3 py-2">
              ✓ Kelime eklendi!
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full bg-red-600 text-white font-semibold py-2.5 rounded-xl hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Kaydet
          </button>

          {customWords.length > 0 && (
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-semibold text-gray-500 mb-2">
                Eklediğim Kelimeler ({customWords.length})
              </p>
              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                {customWords.map(w => (
                  <div
                    key={w.id}
                    className="flex items-center justify-between gap-2 bg-gray-50 rounded-lg px-3 py-1.5"
                  >
                    <div className="min-w-0 text-sm">
                      <span className="font-medium text-gray-800">{w.chinese}</span>
                      <span className="text-gray-400 mx-1.5">·</span>
                      <span className="text-gray-500 truncate">{w.turkish}</span>
                    </div>
                    <button
                      onClick={() => removeCustomWord(w.id)}
                      className="shrink-0 text-gray-300 hover:text-red-500 transition-colors px-1"
                      aria-label={`${w.chinese} kelimesini sil`}
                    >
                      🗑
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
