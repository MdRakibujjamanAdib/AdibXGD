import { Blog } from '../blogs';

const blog: Blog = {
  id: "unity-serious-games-architecture-windesheim",
  slug: "unity-serious-games-architecture-windesheim",
  title: "Architecting Serious Games in Unity: Clean Systems, Heuristic Feedback, and Applied C#",
  subtitle: "Lessons from 038GAMES at Windesheim UAS on building decoupled game architecture for real-world client simulations.",
  summary: "A deep architectural breakdown of engineering serious games at 038GAMES in Zwolle, Netherlands. Learn how ScriptableObject event channels, decoupled state machines, and real-time telemetry bridge clinical heuristics with engaging gameplay in Unity.",
  category: "Game Development",
  tags: ["Unity 3D", "C#", "Serious Games", "Game Architecture", "Windesheim UAS", "Erasmus+"],
  date: "January 18, 2026",
  isoDate: "2026-01-18T00:00:00Z",
  readTime: "8 min read",
  author: {
    name: "Md Rakibujjaman Adib",
    role: "Erasmus+ Game Developer",
    avatar: "/MdRakibujamanAdib.jpg",
    bio: "Erasmus+ Scholar at Windesheim UAS (Zwolle, Netherlands) and Game Developer at 038GAMES, engineering serious games and simulation systems.",
    url: "https://adibx.me/about"
  },
  coverImage: "/images/hero-canal.jpg",
  coverImageAlt: "Zwolle canal and Windesheim campus setting",
  featured: true,
  tableOfContents: [
    { id: "the-paradox-of-serious-games", title: "The Paradox of Serious Games: Utility vs. Immersion", level: 2 },
    { id: "decoupling-systems-with-scriptableobjects", title: "Decoupling Systems with ScriptableObject Event Channels", level: 2 },
    { id: "hierarchical-state-machines", title: "Hierarchical State Machines for Simulation States", level: 2 },
    { id: "telemetry-and-heuristic-feedback", title: "Telemetry and Heuristic Feedback Loops", level: 2 },
    { id: "interdisciplinary-synthesis", title: "Cross-Disciplinary Engineering: From Therapists to Code", level: 2 }
  ],
  content: `
<p class="lead">
  When people imagine game development, they picture expansive fantasy worlds, weapon tuning, and combat loops. But at <strong>038GAMES</strong>—the serious games development studio embedded within <strong>Windesheim University of Applied Sciences</strong> in Zwolle, Netherlands—our primary design constraints are not combat mechanics or monetized engagement. Instead, our goal is behavioral change, cognitive rehabilitation, and tangible pedagogical feedback.
</p>

<p>
  Working as an Erasmus+ game developer in the Netherlands transformed how I write C# and structure Unity projects. In entertainment titles, a minor timing glitch or non-deterministic state transition might be an annoying bug. In a medical or vocational training simulation, an inaccurate feedback loop can invalidate therapeutic data or reinforce improper motor habits.
</p>

<h2 id="the-paradox-of-serious-games">The Paradox of Serious Games: Utility vs. Immersion</h2>
<p>
  The fundamental challenge of serious gaming lies in a persistent tension: if the application feels like homework or a clinic test, user compliance plummets and immersion dissolves. Conversely, if gameplay mechanics overpower the scientific objectives, the simulation fails its clinical or educational mandate.
</p>
<p>
  Solving this balance requires an architecture where <em>game mechanics</em> and <em>measurement heuristics</em> are strictly decoupled. Game loops should operate on standard game-feel principles (responsive physics, visual juice, spatial audio), while a dedicated heuristic layer intercepts telemetry asynchronously, evaluates player behavior, and modulates difficulty without breaking immersion.
</p>

<h2 id="decoupling-systems-with-scriptableobjects">Decoupling Systems with ScriptableObject Event Channels</h2>
<p>
  In many legacy Unity projects, systems become hopelessly intertwined through static singletons (<code>GameManager.Instance.DoSomething()</code>) or direct inspector references that break whenever scenes change. For serious games requiring modular testability, scene independence is paramount.
</p>
<p>
  We adopted an event-driven architecture powered by <strong>ScriptableObject Event Channels</strong>. By treating event channels as project assets in the asset database rather than scene-bound MonoBehaviours, any component can raise or listen to an event without knowing who else is listening or what scene is loaded.
</p>

<pre><code class="language-csharp">// ScriptableObject Event Channel definition
using System;
using UnityEngine;

[CreateAssetMenu(fileName = "New IntEventChannel", menuName = "Events/Int Event Channel")]
public class IntEventChannelSO : ScriptableObject
{
    private Action&lt;int&gt; onEventRaised;

    public void RegisterListener(Action&lt;int&gt; listener) =&gt; onEventRaised += listener;
    public void UnregisterListener(Action&lt;int&gt; listener) =&gt; onEventRaised -= listener;

    public void RaiseEvent(int value)
    {
        if (onEventRaised != null)
        {
            onEventRaised.Invoke(value);
        }
    }
}
</code></pre>

<p>
  A therapy tracking module can subscribe to a <code>MovementScoreChannel</code> asset, analyze kinematic efficiency, and stream logs to a JSON telemetry pipeline. Meanwhile, the player avatar controller merely fires the event and remains completely oblivious to medical metrics, reducing coupling to zero.
</p>

<h2 id="hierarchical-state-machines">Hierarchical State Machines for Simulation States</h2>
<p>
  Simulation games require strict state management: patient calibration, guided training, unguided testing, pause/triage, and session debriefing. Using monolithic switch statements inside <code>Update()</code> quickly creates unmaintainable spaghetti code.
</p>
<p>
  To solve this, we implemented an explicit, typed <strong>Hierarchical State Machine (HSM)</strong> in clean C#. Each state encapsulates its own enter, update, fixed update, and exit lifecycles:
</p>

<pre><code class="language-csharp">public interface IState
{
    void Enter();
    void Tick(float deltaTime);
    void FixedTick(float fixedDeltaTime);
    void Exit();
}

public class SimulationStateMachine
{
    private IState currentState;
    public IState CurrentState =&gt; currentState;

    public void TransitionTo(IState nextState)
    {
        if (currentState == nextState) return;

        currentState?.Exit();
        currentState = nextState;
        currentState?.Enter();
    }

    public void Update(float deltaTime) =&gt; currentState?.Tick(deltaTime);
}
</code></pre>

<p>
  Because every state is an isolated C# class, we can write unit tests for state transition conditions in the Unity Test Runner without needing to instantiate the entire scene hierarchy or simulate 3D physics.
</p>

<h2 id="telemetry-and-heuristic-feedback">Telemetry and Heuristic Feedback Loops</h2>
<p>
  One of the most rewarding components of our work at 038GAMES was designing real-time heuristic evaluation systems. In our simulations, user gestures (tracked via VR controllers or motion sensors) are sampled at 60 Hz.
</p>
<p>
  Instead of sending raw positional arrays over the network, our local C# worker computes running kinematic metrics:
</p>
<ul>
  <li><strong>Smoothness Index:</strong> The derivative of acceleration (jerk) over the movement trajectory. High jerk indicates motor hesitation or spasticity.</li>
  <li><strong>Path Efficiency:</strong> Ratio between the Euclidean distance and the actual traversed arc length.</li>
  <li><strong>Reaction Latency:</strong> Delta between the stimulus trigger timestamp and initial motor displacement exceeding a noise threshold.</li>
</ul>

<p>
  These three metrics are compiled into an in-memory frame buffer and evaluated against dynamic baseline thresholds. When performance drifts outside therapeutic limits, the game dynamically adjusts its subtle affordances—widening collision bounds, easing friction, or intensifying audio-visual cues—without the user ever feeling penalized.
</p>

<h2 id="interdisciplinary-synthesis">Cross-Disciplinary Engineering: From Therapists to Code</h2>
<p>
  Perhaps the most formative takeaway from my time in Zwolle was bridging the communication gap between non-technical stakeholders (physiotherapists, educators, psychologists) and software engineers.
</p>
<p>
  Clinicians do not speak in terms of quaternions, delta time, or raycast hitmasks; they speak in terms of range of motion, cognitive fatigue, and recovery milestones. As engineers, our responsibility is to translate qualitative clinical observations into deterministic mathematical parameters.
</p>
<p>
  By providing custom Unity Editor inspectors and ScriptableObject parameter sheets, we enabled domain specialists to tweak exercise thresholds, repetition counts, and tolerance windows live in the Unity Editor during playtests without requiring a single line of recompilation.
</p>

<blockquote class="border-l-4 border-[#e62e05] pl-4 italic my-6 text-[var(--vb-text-muted)]">
  "Clean architecture is not merely an engineering aesthetic—in serious games, it is the bridge that allows medical intent to be executed with software reliability."
</blockquote>

<p>
  The lessons learned at Windesheim continue to influence everything I build today: prioritizing modular event pipelines, respecting separation of concerns, and always building empathetic, user-centered feedback loops into complex software systems.
</p>
`,
  image: "/images/hero-canal.jpg",
  link: "/blogs/unity-serious-games-architecture-windesheim",
  seo: {
    keywords: ["Unity 3D", "C# Architecture", "Serious Games", "038GAMES", "Windesheim UAS", "Erasmus+ Netherland", "ScriptableObjects", "State Machine"],
    meta: [
      { name: "description", content: "Architecting serious games in Unity at Windesheim UAS: ScriptableObject event channels, clean state machines, and heuristic telemetry." },
      { property: "og:title", content: "Architecting Serious Games in Unity: Clean Systems, Heuristic Feedback, and Applied C#" },
      { property: "og:image", content: "https://adibx.me/images/hero-canal.jpg" }
    ]
  }
};

export default blog;
