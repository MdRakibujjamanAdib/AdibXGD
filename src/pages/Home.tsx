import HomeHero from '../components/HomeHero';
import SEO from '../components/SEO';

export default function Home() {
  return <>
    <SEO
      title="Home"
      description="International creative developer specializing in web development, graphic design, branding and AI automation. Serving clients in Bangladesh, the Netherlands and worldwide."
    />
    <HomeHero />
  </>;
}