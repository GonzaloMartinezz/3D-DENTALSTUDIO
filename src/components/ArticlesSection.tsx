import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

export function ArticlesSection() {
  return (
    <section className="w-full bg-white py-20 px-4 sm:px-10 lg:px-20 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Article categories</h2>
        <Button variant="outline" className="rounded-full px-6 font-medium border-gray-200 text-gray-700 hover:bg-gray-50">
          Browse all articles
        </Button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        
        {/* Category Card 1 */}
        <div className="relative h-[400px] rounded-[2rem] overflow-hidden group cursor-pointer shadow-md">
          <img src="https://images.unsplash.com/photo-1522881451255-f59ad836fdfb?q=80&w=1000" alt="Travel" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white hover:text-black transition-colors duration-300">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          
          <div className="absolute bottom-6 left-6 right-6">
            <h3 className="text-2xl font-bold text-white mb-2">Travel</h3>
            <p className="text-gray-200 text-sm line-clamp-3 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>

        {/* Category Card 2 */}
        <div className="relative h-[400px] rounded-[2rem] overflow-hidden group cursor-pointer shadow-md">
          <img src="https://images.unsplash.com/photo-1542359649-31e03cd4d909?q=80&w=1000" alt="Adventure" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white hover:text-black transition-colors duration-300">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          
          <div className="absolute bottom-6 left-6 right-6">
            <h3 className="text-2xl font-bold text-white mb-2">Adventure</h3>
            <p className="text-gray-200 text-sm line-clamp-3 leading-relaxed">
              Sit facilisi vitae varius amet posuere. Suspendisse turpis amet condimentum diam dolor aliquam sed etiam.
            </p>
          </div>
        </div>

        {/* Category Card 3 */}
        <div className="relative h-[400px] rounded-[2rem] overflow-hidden group cursor-pointer shadow-md">
          <img src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=1000" alt="Gear" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white hover:text-black transition-colors duration-300">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          
          <div className="absolute bottom-6 left-6 right-6">
            <h3 className="text-2xl font-bold text-white mb-2">Gear</h3>
            <p className="text-gray-200 text-sm line-clamp-3 leading-relaxed">
              Imperdiet tellus tempor bibendum accumsan commodo nunc rhoncus nec. Feugiat habitasse proin et, id.
            </p>
          </div>
        </div>

      </div>

      {/* Popular Now Section */}
      <div className="mt-8">
        <h3 className="text-sm font-bold text-gray-900 mb-6 tracking-wide">Popular now</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-gray-200">
          
          {/* Article 1 */}
          <div className="flex flex-col gap-2 cursor-pointer group">
            <span className="text-xs text-gray-500 font-bold">Travel • Sep 1, 2023</span>
            <h4 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors">
              Unveiling hidden gems: Exploring off-the-beaten-path destinations
            </h4>
          </div>

          {/* Article 2 */}
          <div className="flex flex-col gap-2 cursor-pointer group">
            <span className="text-xs text-gray-500 font-bold">Adventure • Sep 1, 2023</span>
            <h4 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors">
              Conquer the wild: Exploring terrains and conquering nature
            </h4>
          </div>

          {/* Article 3 */}
          <div className="flex flex-col gap-2 cursor-pointer group">
            <span className="text-xs text-gray-500 font-bold">Gear • Sep 1, 2023</span>
            <h4 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors">
              Gear up for adventure: Equipment for outdoor enthusiasts
            </h4>
          </div>

        </div>
      </div>

    </section>
  );
}
