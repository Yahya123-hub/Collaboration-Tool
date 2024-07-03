import Herosection from './herosection';
import FeatureSection from './features';
import Workflow from './workflow';
import Techstack from './techstack';
import Benefits from './benefits';
import Footer from './footer';

const Home = () => {
  return (
    <>
      <Herosection />
      <FeatureSection />
      <Workflow />
      <Techstack />
      <Benefits />
      <Footer />
    </>
  );
};

export default Home;
