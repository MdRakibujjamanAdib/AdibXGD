import type { Blog } from '../blogs.ts';

const blog: Blog = {
  id: "physically-based-rendering-vray-light-transport",
  slug: "physically-based-rendering-vray-light-transport",
  title: "Simulating Volumetric Fog & Atmospheric Light Scattering in Chaos V-Ray",
  subtitle: "A physics-based exploration into participating media, Mie forward scattering, and crepuscular god ray rendering.",
  summary: "An in-depth technical exploration of simulating volumetric atmosphere and participating media in Chaos V-Ray and Autodesk Maya. Learn the Radiative Transfer Equation, Mie scattering phase functions, VRayEnvironmentFog height falloff, and noise optimization for cinematic god rays.",
  category: "3D & Computer Graphics",
  tags: ["Chaos V-Ray", "Autodesk Maya", "Volumetric Lighting", "Atmospheric Fog", "God Rays", "CGI", "3D Rendering"],
  date: "September 20, 2025",
  isoDate: "2025-09-20T00:00:00Z",
  readTime: "9 min read",
  author: {
    name: "Md Rakibujjaman Adib",
    role: "3D CGI Artist & Lighting Specialist",
    avatar: "/MdRakibujamanAdib.jpg",
    bio: "Technical Artist and 3D Visualizer specializing in Chaos V-Ray light transport algorithms, volumetric lighting pipelines, and photorealistic CGI.",
    url: "https://adibx.me/about"
  },
  coverImage: "/images/projects/vray-god-rays.jpg",
  coverImageAlt: "Chaos V-Ray volumetric lighting and atmospheric god rays render",
  featured: false,
  tableOfContents: [
    { id: "physics-of-participating-media", title: "The Physics of Participating Media in Computer Graphics", level: 2 },
    { id: "radiative-transfer-and-phase-functions", title: "The Radiative Transfer Equation & Mie Scattering", level: 2 },
    { id: "vray-environment-fog-architecture", title: "Calibrating VRayEnvironmentFog: Density, Height & Attenuation", level: 2 },
    { id: "interior-volumetric-sunbeams", title: "Interior Volumetric Sunbeams & Crepuscular Ray Shaping", level: 2 },
    { id: "sampling-noise-optimization", title: "Volumetric Sampling Optimization: Noise vs. Render Time", level: 2 }
  ],
  content: `
<p class="lead">
  In physical reality, air is never completely empty. Photons emitted by the sun or artificial fixtures travel through a sea of suspended microscopic aerosols, moisture vapor, and dust particulates. When simulated accurately in <strong>Chaos V-Ray and Autodesk Maya</strong>, this participating medium transforms flat computer graphics into rich, living worlds layered with depth and aerial perspective.
</p>

<p>
  During my research into physically based lighting pipelines, I conducted extensive production studies focused on simulating natural atmospheric haze, forest mist, and dramatic interior crepuscular rays. This article breaks down the mathematical foundations and production workflows required to master volumetric illumination without runaway render times.
</p>

<div class="my-6 rounded-[22px] overflow-hidden border border-[var(--vb-border)] bg-[var(--vb-panel)] p-2">
  <img
    src="/images/projects/vray-god-rays.jpg"
    alt="Chaos V-Ray Volumetric Lighting and Crepuscular Rays Study"
    class="w-full object-cover rounded-[18px] max-h-[460px]"
  />
  <p class="py-2.5 px-3 text-xs text-[var(--vb-text-muted)] italic text-center">
    Figure 1: Directional volumetric god rays piercing a dark interior, casting sharp crepuscular light beams through participating media.
  </p>
</div>

<h2 id="physics-of-participating-media">The Physics of Participating Media in Computer Graphics</h2>
<p>
  In a vacuum or clear air, light transport obeys standard ray-surface intersection: photons travel unimpeded in straight vectors until striking an opaque or refractive dielectric boundary. But when the transmission medium contains particulate matter, three simultaneous interactions occur along every infinitesimal segment <code>ds</code> of the ray:
</p>
<ul>
  <li><strong>Absorption:</strong> Particulates absorb a fraction of photon energy, converting electromagnetic energy into thermal energy and attenuating radiance along the path.</li>
  <li><strong>Out-Scattering:</strong> Photons colliding with particles are deflected away from the camera's sightline into arbitrary directions.</li>
  <li><strong>In-Scattering:</strong> Photons arriving from external light sources strike particles along the sightline and scatter directly into the camera lens, producing the luminous glow we perceive as volumetric beams.</li>
</ul>

<h2 id="radiative-transfer-and-phase-functions">The Radiative Transfer Equation &amp; Mie Scattering</h2>
<p>
  The governing differential equation for light traveling through participating media is the <strong>Radiative Transfer Equation (RTE)</strong>:
</p>

<div class="my-5 p-4 rounded-xl bg-[var(--vb-subpanel)] border border-[var(--vb-border)] text-center font-mono text-xs sm:text-sm text-[var(--vb-text)] leading-relaxed overflow-x-auto">
  dL(x, &omega;) / ds = &minus;&sigma;<sub>t</sub>(x) &middot; L(x, &omega;) + &sigma;<sub>s</sub>(x) &int;<sub>4&pi;</sub> p(x, &omega;', &omega;) &middot; L(x, &omega;') d&omega;'
</div>

<p>
  Where <code>&sigma;<sub>t</sub> = &sigma;<sub>a</sub> + &sigma;<sub>s</sub></code> represents total extinction (absorption plus scattering), and <code>p(x, &omega;', &omega;)</code> is the scattering phase function. In atmospheric rendering, particles are substantially larger than light wavelengths (dust grains, water droplets), requiring <strong>Mie scattering</strong> rather than molecular Rayleigh scattering.
</p>
<p>
  V-Ray simulates Mie scattering using the <strong>Henyey-Greenstein phase function</strong> parameterized by an anisotropy factor <code>g</code>:
</p>

<div class="my-5 p-4 rounded-xl bg-[var(--vb-subpanel)] border border-[var(--vb-border)] text-center font-mono text-xs sm:text-sm text-[var(--vb-text)]">
  p(&theta;) = (1 &minus; g&sup2;) / [ 4&pi; &middot; (1 + g&sup2; &minus; 2g &middot; cos(&theta;))<sup>3/2</sup> ]
</div>

<p>
  Setting <code>g &approx; 0.65 &ndash; 0.8</code> produces strong forward-peaked scattering. When looking toward a light source through mist, forward scattering concentrates intense luminance into sharp, dramatic rays, while peripheral angles fade into soft, moody ambient haze.
</p>

<h2 id="vray-environment-fog-architecture">Calibrating VRayEnvironmentFog: Density, Height &amp; Attenuation</h2>
<p>
  In Chaos V-Ray, atmospheric volumes are configured through <code>VRayEnvironmentFog</code>. Rather than filling the entire infinite scene bounding box, realistic outdoor environments require vertical stratification:
</p>

<div class="my-6 rounded-[22px] overflow-hidden border border-[var(--vb-border)] bg-[var(--vb-panel)] p-2">
  <img
    src="/images/projects/vray-environment-fog.webp"
    alt="V-Ray Atmospheric Environment Fog & Forest Well Study"
    class="w-full object-cover rounded-[18px] max-h-[460px]"
  />
  <p class="py-2.5 px-3 text-xs text-[var(--vb-text-muted)] italic text-center">
    Figure 2: Outdoor forest well environment: calibrating VRayEnvironmentFog with exponential height falloff to cluster ground mist while keeping canopies clear.
  </p>
</div>

<p>
  Key calibration parameters for production atmospheric scenes:
</p>
<ul>
  <li><strong>Fog Distance:</strong> Defines transparency attenuation. Lower values increase optical density, while higher values (e.g., 2,500cm) allow light to penetrate deep across multi-layered forest canopies.</li>
  <li><strong>Fog Height:</strong> Establishes the upper atmospheric cap. By matching height to the tree line or ground elevation, moisture clusters realistically in low valleys without submerging the entire sky.</li>
  <li><strong>Noise Density Shading:</strong> Connecting a procedural 3D Simplex or Perlin noise texture into the fog density slot introduces organic wisps, breaks, and turbulence into otherwise uniform air.</li>
</ul>

<div class="my-6 rounded-[22px] overflow-hidden border border-[var(--vb-border)] bg-[var(--vb-panel)] p-2">
  <img
    src="/images/projects/vray-lakeside-gazebo-architectural-environment.webp"
    alt="V-Ray Lakeside Gazebo Architectural Atmospheric Environment"
    class="w-full object-cover rounded-[18px] max-h-[460px]"
  />
  <p class="py-2.5 px-3 text-xs text-[var(--vb-text-muted)] italic text-center">
    Figure 3: Lakeside architectural environment: combining low-altitude moisture fog with directional twilight illumination.
  </p>
</div>

<h2 id="interior-volumetric-sunbeams">Interior Volumetric Sunbeams &amp; Crepuscular Ray Shaping</h2>
<p>
  To create breathtaking god rays in still-life interior compositions, volumetric fog must be illuminated by high-contrast directional sources. In our glass flower vase studies, a narrow directional V-Ray key light was aimed through an architectural aperture:
</p>

<div class="my-6 rounded-[22px] overflow-hidden border border-[var(--vb-border)] bg-[var(--vb-panel)] p-2">
  <img
    src="/images/projects/vray-volumetric-godray-flower-vase-01.webp"
    alt="Volumetric Sunbeams Illuminating Glass Flower Vase in Chaos V-Ray"
    class="w-full object-cover rounded-[18px] max-h-[460px]"
  />
  <p class="py-2.5 px-3 text-xs text-[var(--vb-text-muted)] italic text-center">
    Figure 4: Crepuscular sunbeams slicing through a darkened interior, illuminating an intricate flower vase with translucent rim caustics.
  </p>
</div>

<p>
  As the concentrated directional beam pierces the VRayEnvironmentFog volume, particulates along the light path forward-scatter photons into the camera lens. The solid boundaries of the aperture cast deep volumetric shadows through the mist, creating high-contrast light shafts that draw immediate viewer focus to the focal subject.
</p>

<h2 id="sampling-noise-optimization">Volumetric Sampling Optimization: Noise vs. Render Time</h2>
<p>
  Volumetric rendering is computationally demanding because rays must be ray-marched through 3D space rather than evaluated at single surface intersections. To achieve noise-free results without prohibitive render times:
</p>
<ul>
  <li><strong>Step Size Tuning:</strong> In VRayEnvironmentFog, step size determines ray-marching resolution. Setting step size equal to the smallest shadow caster feature (e.g., 5cm &ndash; 10cm) prevents stepping over thin details while avoiding over-sampling empty space.</li>
  <li><strong>Subdivs Decoupling:</strong> Use dedicated light subdivs (or V-Ray Adaptive bucket sampling) rather than maxing out global fog subdivs. Clean shadows from key lights eliminate the majority of volumetric grain.</li>
  <li><strong>Volumetric Light Pass Isolation:</strong> Render <code>VRayAtmosphere</code> as a separate render element to allow independent grading, noise reduction, and contrast balancing in post-production.</li>
</ul>

<blockquote class="border-l-4 border-[#e62e05] pl-4 italic my-6 text-[var(--vb-text-muted)]">
  "Volumetric lighting is the visual breath of a 3D scene. When physics dictates how photons scatter through mist, the viewer ceases to see polygons and begins to feel the temperature of the air."
</blockquote>
`,
  image: "/images/projects/vray-god-rays.jpg",
  link: "/blogs/physically-based-rendering-vray-light-transport",
  seo: {
    keywords: ["Chaos V-Ray", "Volumetric Fog", "Atmospheric Scattering", "God Rays", "Autodesk Maya", "Participating Media", "Henyey-Greenstein", "Physically Based Rendering", "Md Rakibujjaman Adib"],
    meta: [
      { name: "description", content: "Simulating volumetric fog and atmospheric scattering in Chaos V-Ray: Participating media physics, Mie phase functions, and crepuscular god rays." },
      { property: "og:title", content: "Simulating Volumetric Fog & Atmospheric Light Scattering in Chaos V-Ray" },
      { property: "og:image", content: "https://adibx.me/images/projects/vray-god-rays.jpg" }
    ]
  }
};

export default blog;
