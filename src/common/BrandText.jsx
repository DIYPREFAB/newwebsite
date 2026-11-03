export default function BrandText({ text, className = "" }) {
  return String(text).split(/(DIYVA)/g).map((part, index) => {
    if (part === "DIYVA") {
      return (
        <span className={className} key={`${part}-${index}`}>
          <span className="brand-diy">DIY</span>
          <span className="brand-va">VA</span>
        </span>
      );
    }

    return <span className={className} key={`${part}-${index}`}>{part}</span>;
  });
}
