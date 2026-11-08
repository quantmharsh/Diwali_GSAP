const petals = Array.from({ length: 18 }, (_, index) => ({
  left: `${(index * 47 + 9) % 100}%`,
  top: `${(index * 29 + 13) % 90}%`,
  size: 8 + (index % 5) * 3,
  delay: `${(index % 7) * -0.55}s`,
}));

export function MarigoldPetals({ className = "" }: { className?: string }) {
  return (
    <div className={`petal-field ${className}`} aria-hidden="true">
      {petals.map((petal, index) => (
        <i
          key={index}
          className="petal-field__petal"
          style={{ left: petal.left, top: petal.top, width: petal.size, height: petal.size * 1.7, animationDelay: petal.delay }}
        />
      ))}
    </div>
  );
}
