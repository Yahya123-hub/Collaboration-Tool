import { testimonials } from "../constants";

const Testimonials = () => {
  return (
    <div className="mt-20 tracking-wide">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl text-center my-10 lg:my-20">
        Ben<span className="bg-gradient-to-r from-blue-500 to-blue-800 text-transparent bg-clip-text">efits</span>
        </h2>
      <div className="flex flex-wrap justify-center">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="w-full sm:w-1/2 lg:w-1/3 px-4 py-2">
            <div className="bg-dark rounded-md p-6 text-md border border-blue-600 font-thin">
              <div className="flex mt-8 items-start">
                <img
                  className="w-20 h-20 mr-6 rounded-full "
                  src={testimonial.image}
                  alt=""
                />
                <div className="p-6">
                  <h6>{testimonial.user}</h6>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;