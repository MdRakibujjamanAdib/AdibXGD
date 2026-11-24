import type { Blog } from '../blogs.ts';

const blog: Blog = {
  id: "iot-edge-sensing-carbon-modeling-green-d",
  slug: "iot-edge-sensing-carbon-modeling-green-d",
  title: "Engineering Green D: Real-Time IoT Power Telemetry, Receipt OCR Parsing, and Predictive Carbon Modeling",
  subtitle: "How we merged physical hardware sensors, computer vision OCR, and predictive carbon analytics into a full-stack SaaS.",
  summary: "A technical architectural review of Green D, an end-to-end carbon management platform. Learn how IoT smart plug telemetry, computer vision document parsing, and grid-specific CO2e algorithms transform abstract emissions into actionable conservation metrics.",
  category: "Sustainable Tech",
  tags: ["Sustainability", "IoT Telemetry", "Computer Vision OCR", "Full-Stack Development", "Green D", "React", "TypeScript", "Node.js"],
  date: "December 05, 2025",
  isoDate: "2025-12-05T00:00:00Z",
  readTime: "8 min read",
  author: {
    name: "Md Rakibujjaman Adib",
    role: "Co-Founder & Lead Architect",
    avatar: "/MdRakibujamanAdib.jpg",
    bio: "Co-Founder and Full-Stack Architect of Green D, developing carbon footprint intelligence through edge IoT and computer vision.",
    url: "https://adibx.me/about"
  },
  coverImage: "/images/projects/greend-dashboard.png",
  coverImageAlt: "Green D real-time telemetry dashboard",
  featured: false,
  tableOfContents: [
    { id: "the-intangibility-of-carbon-accounting", title: "The Intangibility Dilemma in Personal Carbon Accounting", level: 2 },
    { id: "iot-telemetry-pipeline", title: "Edge Telemetry Architecture: Streaming Plug Wattage to Cloud", level: 2 },
    { id: "computer-vision-receipt-ocr", title: "Computer Vision OCR: Extracting Energy Consumption from Utility Invoices", level: 2 },
    { id: "carbon-emission-factors-mathematics", title: "Mathematical Modeling of Grid Emission Factors and CO2e", level: 2 },
    { id: "behavioral-ux-gamification", title: "Behavioral Engineering: Designing Actionable Sustainability UX", level: 2 }
  ],
  content: `
<p class="lead">
  Combating climate change begins with quantification. Yet for the average individual or small enterprise, greenhouse gas emissions are completely invisible. You flip a light switch, run a compute cluster, or purchase fuel, and the corresponding carbon cost evaporates into the atmosphere without a trace.
</p>

<p>
  When my team and I set out to engineer <strong>Green D</strong>, we envisioned an intelligent SaaS platform capable of turning abstract ecological debt into concrete, real-time data streams. By unifying edge IoT power metering, optical character recognition (OCR) of utility receipts, and dynamic emission factor calculations, we transformed static carbon estimates into an actionable engineering feedback loop.
</p>

<h2 id="the-intangibility-of-carbon-accounting">The Intangibility Dilemma in Personal Carbon Accounting</h2>
<p>
  Most carbon calculators rely on retroactive, static survey questions: <em>"How many miles do you drive a week?"</em> or <em>"What is your approximate electric bill?"</em>. The resulting figures are inaccurate, disconnected from real behavior, and unable to guide immediate decisions.
</p>
<p>
  To induce real behavioral shift, carbon metrics must satisfy three core conditions:
</p>
<ol>
  <li><strong>Immediacy:</strong> The telemetry feedback must arrive within seconds of power consumption.</li>
  <li><strong>Granularity:</strong> Users must be able to isolate emissions down to individual appliances or routes.</li>
  <li><strong>Effortless Ingestion:</strong> Data capture must be automated &mdash; either via passive IoT sensors or one-click camera scanning of existing physical receipts.</li>
</ol>

<h2 id="iot-telemetry-pipeline">Edge Telemetry Architecture: Streaming Plug Wattage to Cloud</h2>
<p>
  At the edge layer, Green D interfaces with ESP32-based smart plugs and Zigbee current clamps measuring true root-mean-square (RMS) current, AC voltage, and real power factor:
</p>

<div class="my-6 rounded-[22px] overflow-hidden border border-[var(--vb-border)] bg-[var(--vb-panel)] p-2">
  <img
    src="/images/projects/greend-smart-home.webp"
    alt="Green D Smart Home IoT Sensor Integration Overview"
    class="w-full object-cover rounded-[18px] max-h-[440px]"
  />
  <p class="py-2.5 px-3 text-xs text-[var(--vb-text-muted)] italic text-center">
    Figure 1: Smart Home appliance telemetry mapping and edge current distribution.
  </p>
</div>

<p>
  The edge firmware runs an embedded FreeRTOS loop sampling instantaneous power (<code>P = V<sub>rms</sub> &times; I<sub>rms</sub> &times; cos(&theta;)</code>) at 10 Hz, calculating 5-second energy integrals in Watt-hours (Wh), and publishing encrypted payloads over lightweight MQTT to our broker:
</p>

<pre><code class="language-typescript">// TypeScript Telemetry Ingestion Worker Sample
export interface EnergyTelemetryPayload {
  deviceId: string;
  timestamp: number;
  voltageRms: number;
  currentAmps: number;
  powerWatts: number;
  accumulatedWattHours: number;
}

export class TelemetryAggregator {
  public static calculateCO2e(
    wattHours: number,
    regionalGridFactorKgPerKWh: number
  ): number {
    const kilowattHours = wattHours / 1000.0;
    // Formula: kg CO2e = kWh * Grid Emission Factor
    return Number((kilowattHours * regionalGridFactorKgPerKWh).toFixed(4));
  }
}
</code></pre>

<p>
  Incoming MQTT packets hit our time-series ingestion worker, which writes directly to an in-memory Redis stream before batch-flushing to persistent storage. This architecture maintains sub-200ms latency from plug click to browser visualization on the dashboard.
</p>

<h2 id="computer-vision-receipt-ocr">Computer Vision OCR: Extracting Energy Consumption from Utility Invoices</h2>
<p>
  IoT meters address active home appliances, but what about transport fuel, heating gas, and historical electric utility bills? Users are not going to manually type 20 line-items from a printed invoice.
</p>

<div class="my-6 rounded-[22px] overflow-hidden border border-[var(--vb-border)] bg-[var(--vb-panel)] p-2">
  <img
    src="/images/projects/greend-receipt.webp"
    alt="Computer Vision OCR Receipt Extraction in Green D"
    class="w-full object-cover rounded-[18px] max-h-[440px]"
  />
  <p class="py-2.5 px-3 text-xs text-[var(--vb-text-muted)] italic text-center">
    Figure 2: Computer vision receipt processing pipeline parsing fuel liters and utility billing values.
  </p>
</div>

<p>
  We implemented an automated document parsing pipeline:
</p>
<ul>
  <li><strong>Bilateral Filtering &amp; Perspective Correction:</strong> The user snaps a smartphone photo of a paper receipt. The canvas worker detects receipt quadrilaterals, performs homography warping to flatten wrinkles, and enhances contrast via adaptive thresholding.</li>
  <li><strong>Tesseract &amp; Regex Entity Extraction:</strong> Our vision model identifies key alphanumeric patterns: fuel volumes in liters, electricity units in kilowatt-hours (kWh), natural gas in cubic meters (m&sup3;), and total billing amounts.</li>
  <li><strong>Fuzzy Match Verification:</strong> Extracted merchant names and dates are cross-referenced with regional fuel price APIs to catch OCR hallucination errors before committing to the carbon ledger.</li>
</ul>

<h2 id="carbon-emission-factors-mathematics">Mathematical Modeling of Grid Emission Factors and CO2e</h2>
<p>
  Translating raw kilowatt-hours into carbon dioxide equivalent (CO<sub>2</sub>e) is not a static scalar multiplication. Electricity generation mixes fluctuate hour-by-hour based on solar irradiation, wind speeds, and coal peaker plant activations.
</p>
<p>
  Green D connects with regional electricity grid APIs (such as Entso-E and National Grid ESO) to pull marginal carbon intensity factors:
</p>

<div class="my-5 p-4 rounded-xl bg-[var(--vb-subpanel)] border border-[var(--vb-border)] text-center font-mono text-sm sm:text-base text-[var(--vb-text)]">
  Total Emissions (E<sub>total</sub>) = &sum; [ Power(t) &times; &Delta;t &times; CarbonIntensity<sub>grid</sub>(t) ]
</div>

<p>
  If a user runs their laundry during a midday solar peak, their footprint is quantified at 80g CO<sub>2</sub>e/kWh. If run during an evening fossil surge, the exact same cycle is accurately tracked at 420g CO<sub>2</sub>e/kWh.
</p>

<h2 id="behavioral-ux-gamification">Behavioral Engineering: Designing Actionable Sustainability UX</h2>
<p>
  Raw statistics can induce climate doomism rather than productive action. Our frontend was engineered with clean clarity: pure dark aesthetic, vibrant emerald and vermilion accents, and predictive progress rings.
</p>
<p>
  Instead of generic warnings, Green D delivers micro-nudges: <em>"Delaying your electric vehicle charge by 2 hours will save 3.4kg CO2e based on tonight's wind forecast."</em> By gamifying conservation through streaks, community milestones, and verifiable impact badges, we observed a 22% average reduction in peak household energy usage during our closed beta cohorts.
</p>

<blockquote class="border-l-4 border-[#e62e05] pl-4 italic my-6 text-[var(--vb-text-muted)]">
  "When you make carbon measurable in milliseconds, sustainability transitions from a passive moral ideal into an exciting engineering optimization problem."
</blockquote>

<p>
  Green D represents what full-stack engineering can achieve when cutting-edge hardware telemetry, computer vision algorithms, and human-centered design converge on the planet's most critical challenge.
</p>
`,
  image: "/images/projects/greend-dashboard.png",
  link: "/blogs/iot-edge-sensing-carbon-modeling-green-d",
  seo: {
    keywords: ["Green D", "Carbon Accounting", "IoT Telemetry", "Sustainability Tech", "Computer Vision OCR", "Smart Energy", "React", "TypeScript", "Node.js", "Md Rakibujjaman Adib"],
    meta: [
      { name: "description", content: "Inside Green D: How we combined real-time IoT smart plug telemetry, computer vision receipt OCR, and grid carbon algorithms into a full-stack sustainability SaaS." },
      { property: "og:title", content: "Engineering Green D: Real-Time IoT Power Telemetry, Receipt OCR Parsing, and Predictive Carbon Modeling" },
      { property: "og:image", content: "https://adibx.me/images/projects/greend-dashboard.png" }
    ]
  }
};

export default blog;
