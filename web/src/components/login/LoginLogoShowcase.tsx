import { cn } from "@/lib/utils";

type LoginLogoShowcaseProps = {
  compact?: boolean;
  className?: string;
};

export function LoginLogoShowcase({ compact = false, className }: LoginLogoShowcaseProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        compact ? "h-[5rem] w-[5rem]" : "h-[8rem] w-[8rem]",
        className,
      )}
      aria-label="MSA logo"
    >
      {/* Glow effect */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-blue-500/20 blur-2xl animate-pulse",
        )}
      />
      
      {/* Logo container */}
      <div className={cn(
        "relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 shadow-2xl",
        compact ? "h-[4rem] w-[4rem]" : "h-[6.5rem] w-[6.5rem]",
      )}>
        {/* MSA Text */}
        <span className={cn(
          "font-bold text-white tracking-tight",
          compact ? "text-xl" : "text-3xl",
        )}>
          MSA
        </span>
        
        {/* Decorative corner accents */}
        <div className="absolute top-1.5 left-1.5 h-2 w-2 border-t-2 border-l-2 border-white/40 rounded-tl-sm" />
        <div className="absolute top-1.5 right-1.5 h-2 w-2 border-t-2 border-r-2 border-white/40 rounded-tr-sm" />
        <div className="absolute bottom-1.5 left-1.5 h-2 w-2 border-b-2 border-l-2 border-white/40 rounded-bl-sm" />
        <div className="absolute bottom-1.5 right-1.5 h-2 w-2 border-b-2 border-r-2 border-white/40 rounded-br-sm" />
      </div>
      
      {/* Orbiting dots */}
      <div className="absolute inset-0 animate-rotate-slow">
        <div className={cn(
          "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary",
          compact ? "h-1.5 w-1.5" : "h-2 w-2",
        )} />
      </div>
      <div className="absolute inset-0 animate-rotate-slow" style={{ animationDirection: 'reverse', animationDuration: '8s' }}>
        <div className={cn(
          "absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rounded-full bg-blue-400",
          compact ? "h-1.5 w-1.5" : "h-2 w-2",
        )} />
      </div>
    </div>
  );
}
