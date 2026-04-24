import { useState } from 'react';

interface FloatingCharacterProps {
  image: string;
  message: string;
  onDismiss?: () => void;
}

export function FloatingCharacter({ image, message, onDismiss }: FloatingCharacterProps) {
  const [minimized, setMinimized] = useState(false);

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full overflow-hidden shadow-xl border-2 border-white hover:scale-110 transition-transform"
        title="鹏娜'yı göster"
      >
        <img src={image} alt="" className="w-full h-full object-cover object-top" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2 max-w-xs">
      {/* Mesaj balonu */}
      <div className="bg-white rounded-2xl rounded-br-sm shadow-xl border border-gray-200 px-4 py-3 relative">
        <p className="text-sm text-gray-800 leading-relaxed">{message}</p>
        <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white border-r border-b border-gray-200 rotate-45" />
      </div>
      {/* Karakter + butonlar */}
      <div className="flex items-end gap-2">
        <div className="flex flex-col gap-1">
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-xs bg-white border border-gray-200 text-gray-400 rounded-full px-2 py-0.5 hover:text-gray-600 shadow"
            >
              Tamam ✓
            </button>
          )}
          <button
            onClick={() => setMinimized(true)}
            className="text-xs bg-white border border-gray-200 text-gray-400 rounded-full px-2 py-0.5 hover:text-gray-600 shadow"
          >
            Küçült
          </button>
        </div>
        <img
          src={image}
          alt="鹏娜"
          className="w-20 h-20 object-cover object-top rounded-full border-2 border-white shadow-xl"
        />
      </div>
    </div>
  );
}
