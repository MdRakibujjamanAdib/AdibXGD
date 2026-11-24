import HomeHero from '../components/HomeHero';
import SEO from '../components/SEO';

export default function Home() {
  return <>
    <SEO
      title="Home"
      description="Freelance web developer and designer building business websites, web apps, and brand identities for clients in Bangladesh, the Netherlands, and worldwide."
    />
    <HomeHero />
  </>;
}
