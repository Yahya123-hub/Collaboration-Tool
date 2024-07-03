import { resourcesLinks } from "../constants";

const Footer = () => {
  return (
    <div className="mt-20 tracking-wide">
    <h2 className="text-3xl sm:text-5xl lg:text-6xl text-center my-10 lg:my-20">
    Get<span className="bg-gradient-to-r from-blue-500 to-blue-800 text-transparent bg-clip-text"> In Touch</span>
    </h2>
  <div className="flex flex-wrap justify-center">
    {resourcesLinks.map((resourcesLink, index) => (
      <div key={index} className="w-full sm:w-1/2 lg:w-1/3 px-4 py-2">
        <div className="bg-dark rounded-md p-6 text-md border border-white font-thin">
          <div className="flex mt-8 items-start">
            <img
              className="w-20 h-20 mr-6 rounded-full "
              src={resourcesLink.image}
              alt=""
            />
            <div className="p-6">
            <a href={resourcesLink.href} 
               className="text-white hover:underline"
               target="_blank"
               rel="noopener noreferrer">
              <h6>{resourcesLink.text}</h6>
            </a>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
  );
};

export default Footer;
