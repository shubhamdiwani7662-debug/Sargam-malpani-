import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';

interface CategoriesViewProps {
  navigate: (route: string, param?: string) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({ navigate }) => {
  const { categories, products } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      
      {/* Title */}
      <div className="max-w-2xl space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#272321] tracking-tight">
          Supermarket Departments
        </h1>
        <p className="text-sm text-[#6D6661]">
          Browse our extensive catalog organized by aisle. Select any category to view available products and live branch stock.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => {
          const categoryProducts = products.filter((p) => p.categoryId === category.id);

          return (
            <div
              key={category.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FFF9F4] border border-slate-100 flex items-center justify-center text-[#C92520]">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-[#6D6661] bg-slate-100 px-2.5 py-1 rounded-full">
                    {categoryProducts.length} Items Available
                  </span>
                </div>

                <h2 className="text-xl font-bold text-[#272321]">
                  {category.name}
                </h2>
                <p className="text-xs text-[#6D6661] mt-1.5 leading-relaxed">
                  {category.description}
                </p>

                {/* Subcategories list */}
                <div className="mt-5 space-y-2">
                  <h4 className="text-[11px] font-bold text-[#641E24] uppercase tracking-wider">
                    Key Subcategories
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {category.subcategories.map((sub, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-[#FFF9F4] text-[#272321] border border-slate-200/80 px-2.5 py-1 rounded-md"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <button
                  onClick={() => navigate('shop', category.id)}
                  className="w-full py-2.5 px-4 bg-[#C92520] hover:bg-[#B01E1A] text-white font-bold text-xs rounded-xl shadow-xs hover:shadow transition-all flex items-center justify-center gap-2"
                >
                  <span>Explore {category.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
