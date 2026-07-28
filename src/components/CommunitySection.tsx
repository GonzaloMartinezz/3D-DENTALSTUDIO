import { Button } from "@/components/ui/button";
import { Zap, User, Bell } from "lucide-react";

export function CommunitySection() {
  return (
    <section className="relative w-full bg-[#f8f9fa] overflow-hidden pt-24 pb-32">
      {/* Background Purple Shape */}
      <div className="absolute top-0 right-0 w-[120%] lg:w-3/5 h-[150%] bg-[#6452f1] origin-bottom-left -skew-x-12 transform lg:translate-x-32 -translate-y-20 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-10 lg:px-20">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          
          {/* Left Text */}
          <div className="w-full lg:w-5/12 mb-24 lg:mb-0 text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#1a1a1a] leading-[1.1] mb-6 tracking-tight">
              Build Your<br />Social<br />Community
            </h1>
            <p className="text-lg text-gray-500 mb-10 max-w-sm mx-auto lg:mx-0 leading-relaxed">
              Lorem ipsum dolor sit amet.<br />
              vorsmrodue mspecting elit sold done.
            </p>
            <Button className="bg-[#6452f1] hover:bg-[#5241d9] text-white text-lg font-semibold px-8 py-7 rounded-2xl shadow-xl shadow-[#6452f1]/40 transition-transform hover:scale-105">
              Get Started
            </Button>
          </div>

          {/* Right Phones Container */}
          <div className="w-full lg:w-7/12 relative h-[600px] flex justify-center lg:justify-end mt-10 lg:mt-0">
            
            {/* Phone 1 (Back/Top Right) */}
            <div className="absolute top-0 lg:top-[-40px] right-4 lg:right-10 w-[260px] h-[520px] bg-white rounded-[2.5rem] border-[10px] border-[#2d3436] shadow-2xl transform rotate-6 z-10 overflow-hidden flex flex-col">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#2d3436] rounded-b-2xl z-20" />
              
              {/* Fake App Content */}
              <div className="flex-1 bg-gray-50 pt-10 px-4 flex flex-col gap-4">
                <div className="flex items-center justify-between px-1 mb-2">
                  <span className="text-xs font-bold">Next</span>
                  <div className="w-4 h-4 border border-gray-400 rounded-sm" />
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-8 h-8 rounded-full overflow-hidden">
                     <img src="https://i.pravatar.cc/100?img=5" alt="user" className="w-full h-full object-cover" />
                   </div>
                   <div>
                     <div className="h-3 w-20 bg-gray-300 rounded mb-1" />
                     <div className="h-2 w-12 bg-gray-200 rounded" />
                   </div>
                </div>

                <div className="w-full h-40 bg-gray-200 rounded-2xl overflow-hidden relative shadow-sm">
                   <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=500" alt="sea" className="object-cover w-full h-full" />
                </div>

                <div className="bg-white p-3 rounded-2xl shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <img src="https://i.pravatar.cc/100?img=1" alt="user" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-2 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded-2xl shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <img src="https://i.pravatar.cc/100?img=2" alt="user" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                    <div className="h-2 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
              </div>
            </div>

            {/* Phone 2 (Front/Bottom Left) */}
            <div className="absolute bottom-0 lg:bottom-10 left-4 lg:left-10 w-[280px] h-[560px] bg-white rounded-[3rem] border-[12px] border-[#2d3436] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] transform -rotate-12 z-20 overflow-hidden flex flex-col">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#2d3436] rounded-b-2xl z-20" />
              
              {/* Fake App Content */}
              <div className="flex-1 bg-white pt-12 px-5 flex flex-col">
                <h3 className="font-bold text-3xl text-gray-900 mb-6 tracking-tight">Messages</h3>
                
                <div className="flex flex-col gap-5">
                  {[4, 5, 6, 7].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 shadow-sm">
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 border-b border-gray-100 pb-3">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                        <div className="h-3 bg-gray-100 rounded w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Fake Bottom Navigation */}
                <div className="mt-auto pt-4 pb-2 border-t border-gray-100 flex justify-between px-4">
                   <div className="w-6 h-6 rounded-full bg-[#6452f1]" />
                   <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                   <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                   <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Features Section */}
        <div className="mt-40 lg:mt-32">
          
          <div className="text-center lg:text-right lg:absolute lg:right-20 lg:bottom-[340px] z-30 mb-10 lg:mb-0">
             <h2 className="text-4xl lg:text-5xl font-extrabold text-[#1a1a1a] tracking-tight">Key Features</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-30 lg:mt-32">
            
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-xl hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 text-[#1a1a1a] shadow-sm transform rotate-45">
                <Zap className="w-6 h-6 -rotate-45" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-bold text-[#1a1a1a] mb-3">Share Your Moments</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-[200px] lg:max-w-none">
                Locor unsctinng adqiunduissent,<br className="hidden lg:block" />onin iduseidul cinemida
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-xl hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 text-[#1a1a1a] shadow-sm transform rotate-45">
                <User className="w-6 h-6 -rotate-45" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-bold text-[#1a1a1a] mb-3">Connect with Friends</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-[200px] lg:max-w-none">
                Lorer ipsniam adip auweow,<br className="hidden lg:block" />onin iduseidul cinemida
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-xl hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 text-[#1a1a1a] shadow-sm transform rotate-45">
                <Bell className="w-6 h-6 -rotate-45" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-bold text-[#1a1a1a] mb-3">Stay Up to Date</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-[200px] lg:max-w-none">
                Loran apuiiroueyd acaduisont,<br className="hidden lg:block" />onin iduseidul cinemida
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
