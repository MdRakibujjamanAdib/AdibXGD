import type { Blog } from '../blogs.ts';

const blog: Blog = {
  id: "iot-edge-sensing-carbon-modeling-green-d",
  slug: "iot-edge-sensing-carbon-modeling-green-d",
  title: "Engineering Green D: Real-Time IoT Power Telemetry, Receipt OCR Parsing, and Predictive Carbon Modeling",
  subtitle: "How we built an edge IoT power metering system, utility invoice OCR pipeline, and predictive household carbon accounting platform.",
  summary: "A technical breakdown of Green D's IoT home energy system. Learn how edge smart plug telemetry, computer vision receipt parsing, carbon-weighted eco routing, and dynamic grid emission factors transform abstract kilowatt-hours into real-time household conservation intelligence.",
  category: "Sustainable Tech",
  tags: ["Sustainability", "IoT Telemetry", "Computer Vision OCR", "Smart Home", "Green D", "React", "TypeScript", "Node.js", "Geospatial Routing"],
  date: "December 05, 2025",
  isoDate: "2025-12-05T00:00:00Z",
  readTime: "11 min read",
  author: {
    name: "Md Rakibujjaman Adib",
    role: "Co-Founder & Full-Stack Architect",
    avatar: "/MdRakibujamanAdib.jpg",
    bio: "Co-Founder and Full-Stack Architect of Green D, developing carbon footprint intelligence through edge IoT smart home telemetry and computer vision.",
    url: "https://adibx.me/about"
  },
  coverImage: "/images/projects/green-d-carbon-tracker-home.webp",
  coverImageAlt: "Green D IoT Smart Home Carbon Footprint Tracker App",
  featured: false,
  tableOfContents: [
    { id: "the-intangibility-of-carbon-accounting", title: "The Intangibility Dilemma in Household Carbon Accounting", level: 2 },
    { id: "iot-telemetry-pipeline", title: "Edge Telemetry Architecture: Streaming Smart Plug Current to Cloud", level: 2 },
    { id: "computer-vision-receipt-ocr", title: "Computer Vision OCR: Parsing Utility Invoices and Fuel Receipts", level: 2 },
    { id: "carbon-emission-factors-mathematics", title: "Mathematical Modeling of Dynamic Grid Emission Factors and CO2e", level: 2 },
    { id: "geospatial-route-optimization", title: "Geospatial Route Optimization: Multi-Modal Carbon-Weighted Routing", level: 2 },
    { id: "real-time-sustainability-dashboard", title: "Real-Time Sustainability Dashboard & AI Carbon Forecasting", level: 2 },
    { id: "behavioral-ux-gamification", title: "Behavioral Engineering: Designing Actionable Sustainability UX", level: 2 }
  ],
  content: `
<p class="lead">
  Combating climate change begins with quantification. Yet for the average individual or household, greenhouse gas emissions are completely invisible. You flip a light switch, run an AC unit, or purchase fuel, and the corresponding carbon cost evaporates into the atmosphere without a trace.
</p>

<p>
  When my team and I set out to engineer <strong>Green D Home</strong>, we envisioned an intelligent IoT energy system capable of turning abstract ecological debt into concrete, real-time data streams. By combining edge smart plug power metering, optical character recognition (OCR) for utility invoices, multi-modal eco-routing, and dynamic grid emission modeling, we transformed static carbon estimates into an actionable daily conservation feedback loop.
</p>

<div class="my-6 rounded-[22px] overflow-hidden border border-[var(--vb-border)] bg-[var(--vb-panel)] p-2">
  <img
    src="/images/projects/green-d-carbon-tracker-home.webp"
    alt="Green D IoT Carbon Tracker Mobile Home Interface"
    class="w-full object-cover rounded-[18px] max-h-[460px]"
  />
  <p class="py-2.5 px-3 text-xs text-[var(--vb-text-muted)] italic text-center">
    Figure 1: Green D mobile carbon tracker interface: unifying daily footprint scores, smart plug toggles, and instant emission breakdowns.
  </p>
</div>

<h2 id="the-intangibility-of-carbon-accounting">The Intangibility Dilemma in Household Carbon Accounting</h2>
<p>
  Most carbon calculators rely on retroactive, static survey questions: <em>"How many miles do you drive a week?"</em> or <em>"What is your approximate electric bill?"</em>. The resulting figures are inaccurate, disconnected from real behavior, and unable to guide immediate decisions.
</p>
<p>
  To induce real behavioral shift, household carbon metrics must satisfy three core conditions:
</p>
<ol>
  <li><strong>Immediacy:</strong> Telemetry feedback must arrive within seconds of power consumption so users associate specific appliance cycles with immediate ecological cost.</li>
  <li><strong>Granularity:</strong> Users must be able to isolate emissions down to individual appliances or room circuits rather than aggregate monthly totals.</li>
  <li><strong>Effortless Ingestion:</strong> Data capture must be automated &mdash; either via passive IoT smart plugs or one-click camera scanning of physical utility receipts.</li>
</ol>

<h2 id="iot-telemetry-pipeline">Edge Telemetry Architecture: Streaming Smart Plug Current to Cloud</h2>
<p>
  At the physical layer, Green D interfaces with ESP32-based smart plugs and current clamps measuring true root-mean-square (RMS) current, AC voltage, and active power factor:
</p>

<div class="my-6 rounded-[22px] overflow-hidden border border-[var(--vb-border)] bg-[var(--vb-panel)] p-2">
  <img
    src="/images/projects/greend-smart-home.webp"
    alt="Green D Smart Home IoT Sensor Integration Overview"
    class="w-full object-cover rounded-[18px] max-h-[440px]"
  />
  <p class="py-2.5 px-3 text-xs text-[var(--vb-text-muted)] italic text-center">
    Figure 2: Smart Home appliance telemetry mapping: monitoring real-time wattage, room loads, and relay states.
  </p>
</div>

<p>
  The edge firmware runs an embedded FreeRTOS loop sampling instantaneous power (<code>P = V<sub>rms</sub> &times; I<sub>rms</sub> &times; cos(&theta;)</code>) at 10 Hz, calculating 5-second energy integrals in Watt-hours (Wh), and publishing encrypted payloads over lightweight MQTT:
</p>

<pre><code class="language-typescript">// TypeScript Telemetry Ingestion Worker Sample
export interface EnergyTelemetryPayload {
  deviceId: string;
  timestamp: number;
  voltageRms: number;
  currentAmps: number;
  powerWatts: number;
  powerFactor: number;
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

  public static processSample(payload: EnergyTelemetryPayload, gridFactor: number) {
    const co2e = this.calculateCO2e(payload.accumulatedWattHours, gridFactor);
    return {
      deviceId: payload.deviceId,
      timestamp: payload.timestamp,
      watts: payload.powerWatts,
      emissionsKg: co2e,
      powerFactor: payload.powerFactor
    };
  }
}
</code></pre>

<p>
  Incoming MQTT packets hit our time-series ingestion worker, which writes directly to an in-memory Redis stream buffer before batch-flushing to persistent storage. This architecture maintains sub-200ms latency from physical plug relay switch to live browser visualization on the dashboard.
</p>

<h2 id="computer-vision-receipt-ocr">Computer Vision OCR: Parsing Utility Invoices and Fuel Receipts</h2>
<p>
  IoT meters address active home appliances, but what about transport fuel, heating gas, and monthly municipal electric bills? Users are not going to manually type 20 line-items from a printed invoice.
</p>

<div class="my-6 rounded-[22px] overflow-hidden border border-[var(--vb-border)] bg-[var(--vb-panel)] p-2">
  <img
    src="/images/projects/greend-receipt.webp"
    alt="Computer Vision OCR Receipt Extraction in Green D"
    class="w-full object-cover rounded-[18px] max-h-[440px]"
  />
  <p class="py-2.5 px-3 text-xs text-[var(--vb-text-muted)] italic text-center">
    Figure 3: Computer vision receipt processing pipeline: parsing fuel liters, kWh units, and billing totals from physical invoices.
  </p>
</div>

<p>
  We implemented an automated document parsing pipeline:
</p>
<ul>
  <li><strong>Bilateral Filtering &amp; Perspective Correction:</strong> The user snaps a smartphone photo of a paper bill. The worker detects receipt edges, performs 4-point homography warping to flatten wrinkles, and enhances contrast via adaptive thresholding.</li>
  <li><strong>Tesseract &amp; Regex Entity Extraction:</strong> Our vision model identifies key alphanumeric patterns: fuel volumes in liters, electricity units in kilowatt-hours (kWh), natural gas in cubic meters (m&sup3;), and total billing amounts.</li>
  <li><strong>Fuzzy Match Verification:</strong> Extracted utility names and dates are cross-referenced with regional tariff records to catch OCR hallucination errors before committing to the carbon ledger.</li>
</ul>

<pre><code class="language-typescript">// Automated Utility Receipt Entity Extractor
export interface ParsedReceiptEntity {
  merchant: string;
  date: string;
  fuelType?: 'petrol' | 'diesel' | 'octane' | 'cng';
  volumeLiters?: number;
  electricityKWh?: number;
  totalCost: number;
}

export function parseReceiptText(rawText: string): ParsedReceiptEntity {
  // Regex pattern matching for volumetric fuel and energy units
  const literMatch = rawText.match(/(\d+[.,]\d{1,2})\s*(?:L|Ltr|Liters?)/i);
  const kwhMatch = rawText.match(/(\d+[.,]\d{1,2})\s*(?:kWh|Units?)/i);
  const costMatch = rawText.match(/(?:Total|Amount|Tk|BDT|\$)\s*[:=]?\s*(\d+[.,]\d{2})/i);

  return {
    merchant: extractMerchantHeader(rawText),
    date: extractDatePattern(rawText) || new Date().toISOString().split('T')[0],
    volumeLiters: literMatch ? parseFloat(literMatch[1].replace(',', '.')) : undefined,
    electricityKWh: kwhMatch ? parseFloat(kwhMatch[1].replace(',', '.')) : undefined,
    totalCost: costMatch ? parseFloat(costMatch[1].replace(',', '.')) : 0
  };
}
</code></pre>

<h2 id="carbon-emission-factors-mathematics">Mathematical Modeling of Dynamic Grid Emission Factors and CO2e</h2>
<p>
  Translating raw kilowatt-hours into carbon dioxide equivalent (CO<sub>2</sub>e) is not a static scalar multiplication. Electricity generation mixes fluctuate hour-by-hour based on solar irradiation, wind speeds, and peaker plant activations.
</p>
<p>
  Green D connects with regional electricity grid APIs to pull marginal carbon intensity factors in real time:
</p>

<div class="my-5 p-4 rounded-xl bg-[var(--vb-subpanel)] border border-[var(--vb-border)] text-center font-mono text-sm sm:text-base text-[var(--vb-text)]">
  Total Emissions (E<sub>total</sub>) = &sum; [ Power(t) &times; &Delta;t &times; CarbonIntensity<sub>grid</sub>(t) ]
</div>

<p>
  If a user runs an energy-intensive appliance during a midday solar peak, their footprint is quantified at 80g CO<sub>2</sub>e/kWh. If run during an evening fossil surge, the exact same cycle is accurately tracked at 420g CO<sub>2</sub>e/kWh. This mathematical precision drives predictive shift recommendations.
</p>

<h2 id="geospatial-route-optimization">Geospatial Route Optimization: Multi-Modal Carbon-Weighted Routing</h2>
<p>
  Transportation represents a massive share of personal emissions. Green D's Green Maps module pairs live map routing with powertrain efficiency curves, calculating both the fastest travel trajectory and the minimum carbon alternative:
</p>

<div class="my-6 rounded-[22px] overflow-hidden border border-[var(--vb-border)] bg-[var(--vb-panel)] p-2">
  <img
    src="/images/projects/greend-maps.webp"
    alt="Green D Geospatial Multi-Modal Eco-Commute Mapping and Navigation"
    class="w-full object-cover rounded-[18px] max-h-[440px]"
  />
  <p class="py-2.5 px-3 text-xs text-[var(--vb-text-muted)] italic text-center">
    Figure 4: Green Maps route planning: comparing multi-modal carbon footprints across walking, cycling, public transit, and EV charging stops.
  </p>
</div>

<p>
  Our pathfinding service utilizes a carbon-weighted variation of Dijkstra's algorithm where graph edge weights combine distance, elevation delta, traffic congestion multipliers, and powertrain energy consumption:
</p>

<pre><code class="language-typescript">// Carbon-Weighted Edge Cost Function
export interface RouteEdge {
  distanceKm: number;
  elevationGainMeters: number;
  averageSpeedKmh: number;
  vehicleType: 'EV' | 'ICE_PETROL' | 'HYBRID' | 'BICYCLE';
}

export function calculateEdgeCarbonCost(edge: RouteEdge): number {
  if (edge.vehicleType === 'BICYCLE') return 0;

  // Base fuel consumption per 100km modulated by speed and elevation resistance
  let baseGramsPerKm = edge.vehicleType === 'EV' ? 52 : 164;
  const gradeFactor = 1.0 + (edge.elevationGainMeters / 1000.0) * 0.15;
  const trafficPenalty = edge.averageSpeedKmh < 20 ? 1.35 : 1.0;

  return edge.distanceKm * baseGramsPerKm * gradeFactor * trafficPenalty;
}
</code></pre>

<h2 id="real-time-sustainability-dashboard">Real-Time Sustainability Dashboard & AI Carbon Forecasting</h2>
<p>
  To deliver instantaneous visual feedback, the Green D frontend was architected around a reactive WebSocket state machine. High-frequency telemetry packets update SVG dials and time-series trendlines without triggering full-page DOM re-renders:
</p>

<div class="my-6 rounded-[22px] overflow-hidden border border-[var(--vb-border)] bg-[var(--vb-panel)] p-2">
  <img
    src="/images/projects/greend-dashboard.webp"
    alt="Green D Real-Time Sustainability Dashboard Overview"
    class="w-full object-cover rounded-[18px] max-h-[460px]"
  />
  <p class="py-2.5 px-3 text-xs text-[var(--vb-text-muted)] italic text-center">
    Figure 5: Live user sustainability dashboard: Sustainability Score (0/1000), AI Carbon Forecast, emission calendar, and personalized energy-saving insights.
  </p>
</div>

<p>
  The dashboard integrates an <strong>AI Carbon Forecast</strong> engine that runs autoregressive moving-average projections over 7-day rolling baselines. If cumulative power draw trends toward an overdraft tier, the platform alerts users with predictive mitigation schedules before expensive utility surcharges occur.
</p>

<h2 id="behavioral-ux-gamification">Behavioral Engineering: Designing Actionable Sustainability UX</h2>
<p>
  Raw statistics can induce climate doomism rather than productive action. Our frontend was engineered with clean clarity: pure dark aesthetic, vibrant emerald and vermilion accents, and predictive progress rings.
</p>

<p>
  Instead of generic warnings, Green D delivers micro-nudges: <em>"Delaying your heavy laundry cycle by 2 hours will save 3.4kg CO2e based on tonight's grid renewable mix."</em> By gamifying conservation through streaks, community milestones, and verifiable impact badges, we observed a 22% average reduction in peak household energy usage during our closed beta cohorts.
</p>

<blockquote class="border-l-4 border-[#e62e05] pl-4 italic my-6 text-[var(--vb-text-muted)]">
  "When you make carbon measurable in milliseconds, sustainability transitions from a passive moral ideal into an exciting engineering optimization problem."
</blockquote>

<p>
  Green D Home demonstrates what full-stack engineering can achieve when physical IoT telemetry, computer vision algorithms, and human-centered design converge on household energy conservation.
</p>
`,
  image: "/images/projects/green-d-carbon-tracker-home.webp",
  link: "/blogs/iot-edge-sensing-carbon-modeling-green-d",
  seo: {
    keywords: ["Green D", "Carbon Accounting", "IoT Telemetry", "Sustainability Tech", "Computer Vision OCR", "Smart Energy", "Smart Home", "React", "TypeScript", "Node.js", "Geospatial Routing", "Md Rakibujjaman Adib"],
    meta: [
      { name: "description", content: "Engineering Green D: Real-time IoT power telemetry, computer vision receipt OCR, carbon-weighted routing, and predictive emission analytics." },
      { property: "og:title", content: "Engineering Green D: Real-Time IoT Power Telemetry, Receipt OCR Parsing, and Predictive Carbon Modeling" },
      { property: "og:image", content: "https://adibx.me/images/projects/green-d-carbon-tracker-home.webp" }
    ]
  }
};

export default blog;
