const stars = Array.from({ length: 46 }, (_, index) => ({
  left: `${(index * 37 + 13) % 100}%`,
  top: `${(index * 61 + 7) % 75}%`,
  delay: `${(index % 9) * -0.37}s`,
  size: index % 8 === 0 ? "3px" : "2px",
}));

export function StarField() {
  return (
    <div className="star-field" aria-hidden="true">
      {stars.map((star, index) => (
        <i
          className={`star-field__star${index % 8 === 0 ? " star-field__star--bright" : ""}`}
          key={index}
          style={{ left: star.left, top: star.top, animationDelay: star.delay, width: star.size, height: star.size }}
        />
      ))}
    </div>
  );
}
