// One SVG stage with five building elevations stacked on the same ground line. GSAP (AppSections) builds one scene at a time while
// the page scrolls. Class hooks: s-r (rises from the ground), s-d (outline draws itself), s-w (glazing, fades in), s-a (accent / people, fades in).
// Style: refined architectural elevation. Hairline linework, restrained concrete / charcoal / glass palette, one matte green accent. No glow.
const f = (n) => Number(n.toFixed(1));
const vl = (x0, x1, step, y0, y1) => { let d = ""; for (let x = x0; x <= x1; x += step) d += `M${f(x)} ${y0}V${y1}`; return d; };
const hl = (y0, y1, step, x0, x1) => { let d = ""; for (let y = y0; y <= y1; y += step) d += `M${x0} ${f(y)}H${x1}`; return d; };

// Glazing: gradient glass, a soft diagonal reflection and thin mullions.
const Glass = ({ x, y, w, h, cols = 0, rows = 0 }) => {
  let d = "";
  for (let i = 1; i < cols; i++) d += `M${f(x + (w * i) / cols)} ${y}V${y + h}`;
  for (let i = 1; i < rows; i++) d += `M${x} ${f(y + (h * i) / rows)}H${x + w}`;
  return (
    <g className="s-w">
      <rect x={x} y={y} width={w} height={h} />
      <polygon className="s-refl" points={`${f(x + w * 0.55)},${y} ${f(x + w * 0.8)},${y} ${f(x + w * 0.3)},${y + h} ${f(x + w * 0.05)},${y + h}`} />
      {d && <path d={d} />}
    </g>
  );
};

// A small standing person, for scale.
const Fig = ({ x, h = 36, by = 400 }) => (
  <g className="s-a s-fig">
    <circle className="hd" cx={x} cy={by - h + 3.4} r="3.4" />
    <path className="bd" d={`M${f(x - 3.6)} ${by - h + 8}h7.2l1.2 ${f(h * 0.4)}h-9.6z`} />
    <path className="lg" d={`M${f(x - 1.8)} ${f(by - h * 0.48)}V${by}M${f(x + 1.8)} ${f(by - h * 0.48)}V${by}`} />
  </g>
);

// A slender tree: thin trunk, soft sage canopy.
const Tree = ({ x, h = 60, r = 22 }) => (
  <g className="s-r s-treeg">
    <path className="s-d" pathLength="1" d={`M${x} 400V${400 - h}`} />
    <ellipse className="s-leaf" cx={x} cy={f(400 - h - r * 0.6)} rx={f(r * 0.72)} ry={r} />
  </g>
);

export default function SectorScenes() {
  return (
    <svg className="ap-svg" viewBox="0 0 640 460" role="img" aria-label="Elevations of a two-storey house, an office building, a warehouse, a school and a hospital built from the same prefab system">
      <defs>
        <linearGradient id="apWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f5f6f3" />
          <stop offset="1" stopColor="#dde0dc" />
        </linearGradient>
        <linearGradient id="apWall2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d3d8d4" />
          <stop offset="1" stopColor="#bcc4c0" />
        </linearGradient>
        <linearGradient id="apTimber" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c59a6e" />
          <stop offset="1" stopColor="#a67e55" />
        </linearGradient>
        <linearGradient id="apMetal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a3afb7" />
          <stop offset="1" stopColor="#83919b" />
        </linearGradient>
        <linearGradient id="apGlass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c3d8e0" />
          <stop offset="1" stopColor="#8aaaba" />
        </linearGradient>
        <pattern id="apHatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0V9" stroke="#18313f" strokeOpacity=".16" strokeWidth="1" />
        </pattern>
      </defs>

      <circle className="s-halo" cx="320" cy="250" r="190" />
      <rect className="s-hatch" x="20" y="400" width="600" height="40" fill="url(#apHatch)" />
      <path className="s-ground" pathLength="1" d="M20 400H620" />

      {/* 0 · Residential: a contemporary two-storey house with a timber entry, a glazed living room and an upper loggia */}
      <g className="sc-g" data-i="0">
        {/* ground floor */}
        <rect className="s-r" x="110" y="316" width="350" height="76" />
        <rect className="s-r s-timber" x="200" y="316" width="70" height="76" />
        <path className="s-d s-fine" pathLength="1" d={vl(208, 264, 8, 316, 392)} />
        <Glass x={124} y={340} w={62} h={34} cols={2} />
        <rect className="s-r s-door" x="218" y="332" width="28" height="60" />
        <rect className="s-r s-slab" x="196" y="324" width="78" height="5" />
        <Glass x={292} y={330} w={152} h={62} cols={4} />
        {/* shaded terrace under the overhang */}
        <rect className="s-r s-side" x="460" y="316" width="46" height="76" />
        <rect className="s-r s-dark" x="502" y="316" width="4" height="76" />
        {/* floor slab */}
        <rect className="s-r s-slab" x="100" y="308" width="410" height="8" />
        {/* upper floor */}
        <rect className="s-r" x="210" y="226" width="160" height="82" />
        <rect className="s-r s-timber" x="210" y="226" width="60" height="82" />
        <path className="s-d s-fine" pathLength="1" d={vl(218, 264, 8, 226, 308)} />
        <Glass x={284} y={242} w={72} h={50} cols={3} />
        {/* upper loggia */}
        <rect className="s-r s-side" x="370" y="226" width="130" height="82" />
        <Glass x={388} y={240} w={96} h={52} cols={3} />
        <Glass x={370} y={280} w={130} h={28} />
        <path className="s-d" pathLength="1" d="M370 280H500" />
        <rect className="s-r s-dark" x="496" y="226" width="4" height="82" />
        {/* roof slab + solar */}
        <rect className="s-r s-slab" x="200" y="218" width="310" height="8" />
        <path className="s-d s-pv" pathLength="1" d="M300 216L344 204M356 216L400 204M412 216L456 204" />
        <rect className="s-r s-plinth" x="100" y="392" width="410" height="8" />
        <rect className="s-r s-leaf" x="118" y="384" width="76" height="8" rx="4" />
        <Tree x={566} h={104} r={36} />
        <Tree x={76} h={60} r={24} />
        <Fig x={482} by={392} h={36} />
      </g>

      {/* 1 · Commercial: a glazed office tower with a concrete core, an annex and a retail podium */}
      <g className="sc-g" data-i="1">
        <rect className="s-r s-side" x="96" y="246" width="130" height="80" />
        <Glass x={108} y={258} w={106} h={16} cols={5} />
        <Glass x={108} y={292} w={106} h={16} cols={5} />
        <rect className="s-r s-slab" x="92" y="240" width="138" height="6" />
        <rect className="s-r s-side" x="356" y="130" width="44" height="196" />
        <Glass x={366} y={150} w={6} h={150} />
        <Glass x={384} y={150} w={6} h={150} />
        <Glass x={238} y={134} w={118} h={192} cols={6} rows={6} />
        <rect className="s-r s-slab" x="238" y="122" width="162" height="10" />
        <path className="s-d" pathLength="1" d="M319 122V94" />
        <circle className="s-a" cx="319" cy="91" r="3" />
        {/* retail podium */}
        <Glass x={110} y={342} w={410} h={58} cols={14} />
        <rect className="s-r s-slab" x="92" y="326" width="456" height="12" />
        <rect className="s-a" x="92" y="338" width="456" height="3" />
        <rect className="s-r s-door" x="306" y="352" width="28" height="48" />
        <path className="s-d" pathLength="1" d="M320 352V400" />
        <Tree x={580} h={72} r={26} />
        <Fig x={268} h={36} />
        <Fig x={280} h={32} />
        <Fig x={360} h={36} />
      </g>

      {/* 2 · Industrial: a pre-engineered steel warehouse with standing-seam cladding, a roller shutter, a dock and an office */}
      <g className="sc-g" data-i="2">
        <rect className="s-r s-metal" x="130" y="296" width="390" height="104" />
        <polygon className="s-r s-metal" points="130,296 325,250 520,296" />
        <path className="s-d s-fine" pathLength="1" d={vl(142, 508, 12, 298, 400)} />
        <path className="s-d s-edge" pathLength="1" d="M122 299L325 244L528 299" />
        <rect className="s-r s-dark" x="305" y="230" width="40" height="14" />
        <rect className="s-r s-slab" x="300" y="226" width="50" height="4" />
        <Glass x={150} y={316} w={96} h={14} cols={6} />
        <Glass x={404} y={316} w={96} h={14} cols={6} />
        <rect className="s-r s-door" x="268" y="338" width="114" height="62" />
        <path className="s-d s-slat" pathLength="1" d={hl(346, 394, 8, 270, 380)} />
        <rect className="s-a" x="290" y="318" width="70" height="9" rx="1" />
        <rect className="s-r s-door" x="168" y="352" width="26" height="48" />
        <rect className="s-r s-door" x="456" y="352" width="26" height="48" />
        {/* office block */}
        <rect className="s-r s-side" x="520" y="346" width="74" height="54" />
        <Glass x={530} y={356} w={52} h={36} cols={3} />
        <rect className="s-r s-slab" x="514" y="340" width="88" height="6" />
        {/* trailer at the dock */}
        <rect className="s-r" x="40" y="350" width="84" height="42" />
        <rect className="s-a" x="40" y="378" width="84" height="4" />
        <polygon className="s-r s-dark" points="18,392 18,376 26,364 40,364 40,392" />
        <circle className="s-r s-wheel" cx="30" cy="394" r="7" />
        <circle className="s-r s-wheel" cx="78" cy="394" r="7" />
        <circle className="s-r s-wheel" cx="104" cy="394" r="7" />
        <Fig x={236} h={36} />
        <Fig x={414} h={36} />
      </g>

      {/* 3 · Educational: a three-storey school with ribbon glazing and fins, a glazed entrance, a gym with a barrel roof and rooftop solar */}
      <g className="sc-g" data-i="3">
        <rect className="s-r" x="70" y="200" width="380" height="200" />
        <rect className="s-r s-slab" x="62" y="192" width="396" height="8" />
        <path className="s-d s-pv" pathLength="1" d="M96 190L142 178M154 190L200 178M212 190L258 178M270 190L316 178M328 190L374 178M386 190L432 178" />
        <path className="s-d s-fine" pathLength="1" d="M70 262H450M70 326H450" />
        <Glass x={82} y={214} w={356} h={30} cols={16} />
        <Glass x={82} y={278} w={130} h={30} cols={6} />
        <Glass x={308} y={278} w={130} h={30} cols={6} />
        <Glass x={82} y={342} w={130} h={30} cols={6} />
        <Glass x={308} y={342} w={130} h={30} cols={6} />
        {/* entrance */}
        <Glass x={232} y={270} w={56} h={130} cols={2} rows={4} />
        <path className="s-d" pathLength="1" d="M260 340V400" />
        <rect className="s-r s-acc" x="214" y="330" width="92" height="6" />
        <rect className="s-r s-side" x="222" y="394" width="76" height="6" />
        {/* gym */}
        <rect className="s-r s-side" x="450" y="300" width="140" height="100" />
        <path className="s-r s-slab" d="M444 302Q520 258 596 302Z" />
        <Glass x={462} y={312} w={116} h={16} cols={6} />
        <rect className="s-r s-door" x="506" y="352" width="28" height="48" />
        {/* flagpole */}
        <rect className="s-r s-side" x="28" y="394" width="14" height="6" />
        <path className="s-d" pathLength="1" d="M35 394V316" />
        <polygon className="s-a" points="35,318 58,324 35,330" />
        <Tree x={616} h={60} r={22} />
        <Fig x={206} h={34} />
        <Fig x={318} h={34} />
        <Fig x={330} h={28} />
      </g>

      {/* 4 · Healthcare: a glazed ward tower on a podium, a cantilevered canopy, an ambulance bay and an outpatient wing */}
      <g className="sc-g" data-i="4">
        <rect className="s-r s-side" x="120" y="330" width="400" height="70" />
        <rect className="s-r s-slab" x="112" y="322" width="416" height="8" />
        <rect className="s-r" x="206" y="150" width="224" height="172" />
        <rect className="s-r s-side" x="296" y="150" width="44" height="172" />
        <path className="s-a" d="M314 166h8v8h8v8h-8v8h-8v-8h-8v-8h8z" />
        <Glass x={314} y={206} w={8} h={100} />
        <Glass x={218} y={162} w={70} h={20} cols={3} />
        <Glass x={218} y={196} w={70} h={20} cols={3} />
        <Glass x={218} y={230} w={70} h={20} cols={3} />
        <Glass x={218} y={264} w={70} h={20} cols={3} />
        <Glass x={218} y={298} w={70} h={20} cols={3} />
        <Glass x={348} y={162} w={70} h={20} cols={3} />
        <Glass x={348} y={196} w={70} h={20} cols={3} />
        <Glass x={348} y={230} w={70} h={20} cols={3} />
        <Glass x={348} y={264} w={70} h={20} cols={3} />
        <Glass x={348} y={298} w={70} h={20} cols={3} />
        <rect className="s-r s-slab" x="200" y="142" width="236" height="8" />
        <rect className="s-r s-side" x="236" y="128" width="70" height="14" />
        {/* lobby + cantilevered canopy */}
        <Glass x={236} y={340} w={164} h={60} cols={8} />
        <rect className="s-r s-slab" x="214" y="334" width="208" height="6" />
        <rect className="s-a" x="214" y="340" width="208" height="3" />
        <rect className="s-r s-dark" x="216" y="343" width="4" height="57" />
        <rect className="s-r s-dark" x="416" y="343" width="4" height="57" />
        <path className="s-d" pathLength="1" d="M318 352V400" />
        {/* ambulance bay */}
        <rect className="s-r s-slab" x="24" y="346" width="96" height="6" />
        <rect className="s-r s-dark" x="28" y="352" width="4" height="48" />
        <rect className="s-r s-dark" x="112" y="352" width="4" height="48" />
        <rect className="s-r" x="40" y="364" width="50" height="28" />
        <polygon className="s-r" points="90,372 104,372 110,382 110,392 90,392" />
        <rect className="s-a" x="40" y="382" width="70" height="4" />
        <path className="s-a" d="M62 368h4v4h4v4h-4v4h-4v-4h-4v-4h4z" />
        <circle className="s-r s-wheel" cx="54" cy="394" r="6" />
        <circle className="s-r s-wheel" cx="98" cy="394" r="6" />
        {/* outpatient wing */}
        <rect className="s-r s-side" x="520" y="282" width="84" height="118" />
        <rect className="s-r s-slab" x="514" y="274" width="96" height="8" />
        <Glass x={532} y={296} w={60} h={16} cols={3} />
        <Glass x={532} y={330} w={60} h={16} cols={3} />
        <Glass x={532} y={364} w={60} h={16} cols={3} />
        <Fig x={362} h={34} />
        <Fig x={376} h={30} />
      </g>
    </svg>
  );
}
