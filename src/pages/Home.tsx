import HomeHero from '../components/HomeHero';
import SEO from '../components/SEO';

export default function Home() {
  return <>
    <SEO
      title="Home"
      description="Md Rakibujjaman Adib builds business websites, custom web applications, and AI automations for clients in Bangladesh, the Netherlands, and worldwide."
    />
    <HomeHero />
  </>;
}
