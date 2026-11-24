import type { Blog } from '../blogs.ts';

const blog: Blog = {
  id: "physically-based-rendering-vray-light-transport",
  slug: "physically-based-rendering-vray-light-transport",
  title: "Demystifying Physically Based Light Transport: Volumetric Fog, Gobo Projections, and Optical Bokeh in V-Ray",
  subtitle: "A mathematical and aesthetic breakdown of participating media, photometric inverse square decay, and aperture optics.",
  summary: "An in-depth technical exploration into simulating physical light transport using Chaos V-Ray and Autodesk Maya. Dive into participating media equations, Rayleigh phase functions, photometric IES profiles, and optical circle of confusion.",
  category: "3D & Computer Graphics",
  tags: ["Chaos V-Ray", "Autodesk Maya", "Physically Based Rendering", "Volumetric Lighting", "Optics", "CGI", "3D Rendering"],
  date: "September 20, 2025",
  isoDate: "2025-09-20T00:00:00Z",
  readTime: "8 min read",
  author: {
    name: "Md Rakibujjaman Adib",
    role: "3D CGI Artist & Technical Director",
    avatar: "/MdRakibujamanAdib.jpg",
    bio: "Technical Artist and 3D Visualizer specializing in Chaos V-Ray light transport algorithms, Maya production pipelines, and cinematic lighting.",
    url: "https://adibx.me/about"
  },
  coverImage: "/images/projects/vray-god-rays.jpg",
  coverImageAlt: "Chaos V-Ray volumetric lighting and atmospheric god rays render",
  featured: false,
  tableOfContents: [
    { id: "radiometry-vs-photometry", title: "Radiometry vs. Photometry in Physically Based Rendering", level: 2 },
    { id: "participating-media-rayleigh-scattering", title: "Participating Media & Rayleigh Scattering in V-Ray Fog", level: 2 },
    { id: "inverse-square-decay-and-ies-profiles", title: "Inverse Square Decay & Photometric IES Luminaire Profiles", level: 2 },
    { id: "camera-optics-circle-of-confusion", title: "Camera Optics: Circle of Confusion and Optical Bokeh", level: 2 },
    { id: "subsurface-scattering-marble-study", title: "Subsurface Scattering Case Study: Translucent Marble Physics", level: 2 }
  ],
  content: `
<p class="lead">
  In modern computer graphics, rendering photorealistic imagery is no longer about arbitrary color tweaks or trick lighting. It is an exercise in applied physics. Using <strong>Chaos V-Ray in Autodesk Maya</strong>, artists can simulate the exact electrodynamic transport of photons across participating media, dielectric interfaces, and complex optical glass elements.
</p>

<p>
  During my research into physically based rendering (PBR) &mdash; culminating in extensive volumetric lighting studies and procedural material simulations &mdash; I set out to dissect the core physics behind light transport and translate academic optics into repeatable production workflows.
</p>

<h2 id="radiometry-vs-photometry">Radiometry vs. Photometry in Physically Based Rendering</h2>
<p>
  To achieve cinematic realism, an artist must understand the distinction between <em>radiometry</em> (the physical measurement of electromagnetic radiation) and <em>photometry</em> (light measured through the spectral sensitivity curve of human ocular cone cells, the CIE V(&lambda;) luminosity function).
</p>
<p>
  In V-Ray, light emitters should never be calibrated with arbitrary unitless intensity multipliers. By switching emitter units to <strong>Lumens</strong> (for total luminous flux) or <strong>Candela / Lux</strong> (for directional luminous intensity and illuminance), we anchor the rendering equation directly to real-world illumination standards. When an outdoor sun emitter delivers 100,000 Lux and an indoor desk lamp yields 500 Lumens, exposure values (EV) across virtual camera apertures behave with 100% optical fidelity.
</p>

<h2 id="participating-media-rayleigh-scattering">Participating Media &amp; Rayleigh Scattering in V-Ray Fog</h2>
<p>
  In a vacuum or clear air, light travels in straight lines until it strikes an opaque surface. But when air contains microscopic particulates &mdash; dust, moisture droplets, or smoke &mdash; it becomes a <strong>participating medium</strong>. Photons undergo absorption, in-scattering, and out-scattering along the ray path.
</p>
<p>
  The radiative transfer equation governs this phenomenon:
</p>

<div class="my-5 p-4 rounded-xl bg-[var(--vb-subpanel)] border border-[var(--vb-border)] text-center font-mono text-xs sm:text-sm text-[var(--vb-text)] leading-relaxed overflow-x-auto">
  dL(x, &omega;) / ds = &minus;&sigma;<sub>t</sub>(x) &middot; L(x, &omega;) + &sigma;<sub>s</sub>(x) &int;<sub>4&pi;</sub> p(x, &omega;', &omega;) &middot; L(x, &omega;') d&omega;'
</div>

<p>
  Where total extinction <code>&sigma;<sub>t</sub> = &sigma;<sub>a</sub> + &sigma;<sub>s</sub></code> represents combined absorption plus scattering, and <code>p(x, &omega;', &omega;)</code> is the scattering phase function (such as Henyey-Greenstein).
</p>

<div class="my-6 rounded-[22px] overflow-hidden border border-[var(--vb-border)] bg-[var(--vb-panel)] p-2">
  <img
    src="/images/projects/vray-light-projection.png"
    alt="V-Ray Textured Gobo Light Projection and Fog Interaction"
    class="w-full object-cover rounded-[18px] max-h-[440px]"
  />
  <p class="py-2.5 px-3 text-xs text-[var(--vb-text-muted)] italic text-center">
    Figure 1: High-frequency textured Gobo projection through participating media in Chaos V-Ray.
  </p>
</div>

<p>
  By configuring <code>VRayEnvironmentFog</code> with an anisotropy coefficient of <code>g &approx; 0.7</code>, we produce realistic forward-peaked Mie scattering (god rays breaking through window blinds). The light beams maintain sharp volumetric edge definition without excessive noise, allowing subtle shadow casters to slice through the atmospheric volume.
</p>

<h2 id="inverse-square-decay-and-ies-profiles">Inverse Square Decay &amp; Photometric IES Luminaire Profiles</h2>
<p>
  A hallmark of amateur 3D rendering is linear or non-decaying light falloff. Point light sources in reality obey the <strong>inverse square law</strong>:
</p>

<div class="my-5 p-4 rounded-xl bg-[var(--vb-subpanel)] border border-[var(--vb-border)] text-center font-mono text-sm sm:text-base text-[var(--vb-text)]">
  Illuminance (E) = Intensity (I) / Distance&sup2; (d&sup2;)
</div>

<p>
  Where illuminance <code>E</code> falls off exponentially with the square of distance <code>d</code>. In V-Ray, enforcing strict inverse-square falloff prevents unnatural hot spots while naturally deepening ambient shadows.
</p>
<p>
  Furthermore, physical luminaires do not emit uniform spherical light due to bulb filaments, reflective housings, and plastic lens caps. By importing manufacturer <strong>IES (Illuminating Engineering Society) photometric profiles</strong>, our V-Ray lights accurately reproduce the complex photometric web, candela curves, and asymmetric spill patterns of architectural fixtures.
</p>

<h2 id="camera-optics-circle-of-confusion">Camera Optics: Circle of Confusion and Optical Bokeh</h2>
<p>
  Depth of field is frequently applied as a cheap post-processing 2D Gaussian blur in compositing. However, optical depth of field in a real camera is a physical consequence of ray convergence through curved lens elements onto a camera sensor plane.
</p>

<div class="my-6 rounded-[22px] overflow-hidden border border-[var(--vb-border)] bg-[var(--vb-panel)] p-2">
  <img
    src="/images/projects/vray-dof-final.png"
    alt="V-Ray Physical Camera Bokeh and Circle of Confusion Study"
    class="w-full object-cover rounded-[18px] max-h-[440px]"
  />
  <p class="py-2.5 px-3 text-xs text-[var(--vb-text-muted)] italic text-center">
    Figure 2: Physical camera optical bokeh showing circle of confusion and polygonal aperture blade characteristics.
  </p>
</div>

<p>
  When an object sits outside the focal plane, light rays converge either before or behind the sensor, producing a disc of illumination termed the <strong>Circle of Confusion (CoC)</strong>.
</p>
<p>
  In V-Ray's Physical Camera, we simulate true optical ray tracing:
</p>
<ul>
  <li><strong>Aperture Blades:</strong> Configuring 7 or 9 polygonal blades produces authentic polygonal bokeh discs rather than sterile circular blurs.</li>
  <li><strong>Optical Vignetting (Cat-Eye Effect):</strong> Outer lens barrel blockage clips off-axis rays, causing peripheral bokeh discs to stretch into elegant elliptical cat-eye shapes.</li>
  <li><strong>Chromatic Aberration:</strong> Simulating slight index-of-refraction differences between red, green, and blue wavelengths around out-of-focus highlights reproduces subtle fringing found on cinema glass.</li>
</ul>

<h2 id="subsurface-scattering-marble-study">Subsurface Scattering Case Study: Translucent Marble Physics</h2>
<p>
  Nowhere is light transport more captivating than inside translucent materials. In our 3D Chess Board study in Maya, the white chess pieces were modeled as polished Carrara marble.
</p>
<p>
  Marble is not purely opaque; photons enter the surface, undergo thousands of internal scattering collisions against mineral micro-crystals, and exit at adjacent coordinates. Using the <code>VRayFastSSS2</code> shader with a phase-function driven Random Walk subsurface model, we achieved the soft, lifelike translucency of authentic hand-carved stone, complete with deep specular reflections governed by the Fresnel dielectric equation (Index of Refraction <code>IOR &approx; 1.54</code>).
</p>

<blockquote class="border-l-4 border-[#e62e05] pl-4 italic my-6 text-[var(--vb-text-muted)]">
  "Mastery of CGI begins when the artist ceases to paint pixels and begins to architect the physical laws that give birth to photons."
</blockquote>

<p>
  By grounding our 3D pipelines in the immutable physics of light transport, we transform rendered scenes from synthetic computer graphics into tangible, cinematic reality.
</p>
`,
  image: "/images/projects/vray-god-rays.jpg",
  link: "/blogs/physically-based-rendering-vray-light-transport",
  seo: {
    keywords: ["Chaos V-Ray", "Autodesk Maya", "Physically Based Rendering", "Volumetric Lighting", "God Rays", "Optics", "Bokeh", "IES Profiles", "Subsurface Scattering", "CGI Artist Bangladesh", "Md Rakibujjaman Adib"],
    meta: [
      { name: "description", content: "A deep dive into physically based light transport in Chaos V-Ray: Participating media, volumetric fog, IES photometric profiles, and optical camera bokeh." },
      { property: "og:title", content: "Demystifying Physically Based Light Transport: Volumetric Fog, Gobo Projections, and Optical Bokeh in V-Ray" },
      { property: "og:image", content: "https://adibx.me/images/projects/vray-god-rays.jpg" }
    ]
  }
};

export default blog;
