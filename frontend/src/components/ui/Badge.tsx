import { Category } from '@/types';
import { CATEGORY_CONFIG } from '@/utils/categoryConfig';

interface BadgeProps {
  category: Category;
  size?: 'sm' | 'md';
}

export default function Badge({ category, size = 'md' }: BadgeProps) {
  const config = CATEGORY_CONFIG[category];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full font-medium border',
        sizeClasses,
        config.bgClass,
        config.textClass,
        config.borderClass,
      ].join(' ')}
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-3 h-3 shrink-0"
        aria-hidden="true"
      >
        <path d={config.iconPath} />
      </svg>
      {config.label}
    </span>
  );
}
