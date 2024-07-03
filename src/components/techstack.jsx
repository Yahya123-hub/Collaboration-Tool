import { CheckCircle2, DotIcon } from "lucide-react";
import { pricingOptions } from "../constants";

const Techstack = () => {
  return (
    <div className="mt-20">
      <h2 className="text-3xl sm:text-5xl lg:text-6xl text-center my-8 tracking-wide">
        <p className="bg-gradient-to-r from-blue-500 to-blue-800 text-white p-1 rounded-lg shadow-lg">
          Tech-Stack
        </p>
      </h2>
      <div className="flex flex-wrap justify-center">
        {pricingOptions.map((option, index) => (
          <div key={index} className="flex-shrink-0 p-2 m-2 w-full sm:w-auto">
            <div className="p-10 border border-blue-700 rounded-xl">
              <p className="text-4xl mb-8 text-center">
                {option.title}
              </p>
              <p className="mb-8 text-center">
                <span className="text-5xl mt-6 mr-2">
                  <p className="bg-gradient-to-r from-blue-500 to-blue-800 text-white p-1 rounded-lg shadow-lg">
                    {option.price}
                  </p>
                </span>
              </p>
              <ul>
                {option.features.map((feature, index) => (
                  <li key={index} className="mt-8 flex items-center">
                    <DotIcon />
                    <span className="ml-2">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Techstack;
