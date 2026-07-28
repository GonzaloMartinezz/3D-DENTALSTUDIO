import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterBanner() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-10 sm:py-20">
      <div className="bg-black rounded-[2rem] p-8 sm:p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative">
        
        {/* Left Content */}
        <div className="w-full md:w-1/2 flex flex-col z-10 text-left">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            Subscribe to our newsletter to receive our daily news
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mb-8 leading-relaxed max-w-md">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum minus.
          </p>
          
          <div className="relative w-full max-w-md flex items-center">
            <Input 
              type="email" 
              placeholder="Email address" 
              className="w-full h-14 pl-6 pr-32 rounded-full bg-white text-black border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
            />
            <Button 
              className="absolute right-1.5 h-11 rounded-full bg-black hover:bg-gray-800 text-white px-6 font-medium"
            >
              Subscribe
            </Button>
          </div>
        </div>

        {/* Right Image/Mockup */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end z-10">
          {/* Laptop Mockup Image */}
          <div className="relative w-full max-w-[400px] aspect-[4/3] rotate-[-12deg] md:rotate-[-5deg] hover:rotate-0 transition-all duration-500 origin-center drop-shadow-2xl">
             <img 
              src="https://images.unsplash.com/photo-1531297122534-8fa647c0e4f8?q=80&w=2070" 
              alt="Laptop mockup"
              className="w-full h-full object-cover rounded-xl border-[8px] border-gray-800 shadow-2xl"
             />
          </div>
        </div>

      </div>
    </div>
  );
}
