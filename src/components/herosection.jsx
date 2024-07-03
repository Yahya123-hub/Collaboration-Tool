import video1 from "../assets/video1.mp4";
import video2 from "../assets/video2.mp4";

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center mt-6 lg:mt-20 ">
      <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide ">
        Smooth Project Management 
        <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-transparent bg-clip-text">
          {" "}
          for Every Team
        </span>
      </h1>
      <div className="mt-8 "> 
        <div className="relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-700"></div>
          <p className="bg-gradient-to-r from-blue-500 to-blue-800 text-white p-6 rounded-lg shadow-lg">
            Empower your team with a seamless project management experience, ensuring smooth collaboration and efficient delivery.
          </p>
          <div className="flex justify-center my-10">
        <a
          href="#"
          className="bg-gradient-to-r from-blue-500 to-blue-800 py-3 px-4 mx-3 rounded-md border border-white"
          >
          Get Started 
        </a>
      </div>
            <div className="flex mt-10 justify-center">
        <video
          autoPlay
          loop
          muted
          className="rounded-lg w-1/2 border border-blue-500 shadow-sm shadow-blue-800 mx-2 my-4"
        >
          <source src={video1} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <video
          autoPlay
          loop
          muted
          className="rounded-lg w-1/2 border border-blue-500 shadow-sm shadow-blue-800 mx-2 my-4"
        >
          <source src={video2} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

        </div>
      </div>
    </div>
  );
};

export default HeroSection;
