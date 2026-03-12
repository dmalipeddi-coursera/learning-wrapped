interface TapZonesProps {
  onNext: () => void;
  onPrev: () => void;
}

export default function TapZones({ onNext, onPrev }: TapZonesProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      <button
        onClick={onPrev}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onPrev();
          }
        }}
        className="pointer-events-auto absolute top-0 left-0 h-full w-[30%] cursor-pointer border-none bg-transparent outline-none focus-visible:bg-white/5"
        aria-label="Previous story"
        tabIndex={0}
      />
      <button
        onClick={onNext}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onNext();
          }
        }}
        className="pointer-events-auto absolute top-0 right-0 h-full w-[70%] cursor-pointer border-none bg-transparent outline-none focus-visible:bg-white/5"
        aria-label="Next story"
        tabIndex={0}
      />
    </div>
  );
}
