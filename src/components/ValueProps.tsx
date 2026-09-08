import React from 'react';
import { Truck, TestTube2, RotateCcw, ShieldCheck } from 'lucide-react';

export const ValueProps: React.FC = () => {
  const props = [
    {
      id: 'val-shipping',
      icon: Truck,
      title: 'Free Shipping',
      subtitle: 'On orders over ₹75'
    },
    {
      id: 'val-samples',
      icon: TestTube2,
      title: 'Complimentary Samples',
      subtitle: 'With every order'
    },
    {
      id: 'val-returns',
      icon: RotateCcw,
      title: 'Easy Returns',
      subtitle: '30-day return policy'
    },
    {
      id: 'val-secure',
      icon: ShieldCheck,
      title: 'Cash on Delivery',
      subtitle: 'Pay upon doorstep delivery'
    }
  ];

  return (
    <section id="aura-value-propositions" className="w-full bg-[#FAF8F5] py-8 sm:py-10 border-b border-[#EAE3D6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {props.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.id} className="flex items-center space-x-3.5 group">
                <div className="w-10 h-10 rounded-full bg-[#F2ECE1] flex items-center justify-center text-[#4A443B] shrink-0 group-hover:bg-[#141312] group-hover:text-white transition-colors duration-300">
                  <Icon className="w-4 h-4 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-[12px] uppercase tracking-[0.16em] font-semibold text-[#141312]">
                    {p.title}
                  </h4>
                  <p className="text-[11px] text-[#736C61] font-light mt-0.5">
                    {p.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
