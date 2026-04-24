interface MotivationCardProps {
  image: string;
  title: string;
  sub: string;
  gradientClass?: string;
  compact?: boolean;
}

export function MotivationCard({ image, title, sub, gradientClass = 'from-red-500 to-rose-600', compact = false }: MotivationCardProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-4 bg-white rounded-2xl border border-gray-200 shadow-sm p-4 overflow-hidden">
        <img
          src={image}
          alt=""
          className="w-20 h-20 object-cover rounded-xl shrink-0"
        />
        <div>
          <div className="font-bold text-gray-900 text-sm leading-snug">{title}</div>
          <div className="text-gray-500 text-xs mt-1 leading-relaxed">{sub}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-lg">
      <img
        src={image}
        alt=""
        className="w-full h-64 object-cover object-top"
      />
      <div className={`absolute inset-0 bg-gradient-to-t ${gradientClass} opacity-60`} />
      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
        <div className="font-bold text-lg leading-tight drop-shadow">{title}</div>
        <div className="text-sm opacity-90 mt-1 drop-shadow leading-relaxed">{sub}</div>
      </div>
    </div>
  );
}
