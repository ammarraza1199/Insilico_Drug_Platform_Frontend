import React from 'react';
import { Link } from 'react-router-dom';
import { TestTube2, Database, Cpu, ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-slate-900 py-24 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
            In-Silico Biological <span className="text-scientific-blue">Simulation</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            WallahGPT leverages multi-omics AI models to replace wet laboratory experimentation with digital simulation — reducing time, cost, and ethical constraints.
          </p>
          <div className="mt-10 flex justify-center space-x-4">
            <Link 
              to="/login" 
              className="rounded-md bg-scientific-blue px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-600"
            >
              Get Started
            </Link>
            <a 
              href="#features" 
              className="rounded-md border border-slate-700 px-8 py-3 text-base font-semibold text-slate-300 hover:bg-slate-800"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Systems Section */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Three AI Systems, One Platform</h2>
            <p className="mt-4 text-slate-600">State-of-the-art computational biology at your fingertips.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: 'WallahGPT1',
                desc: 'Epigenetic aging clock for biological age prediction.',
                icon: TestTube2,
                color: 'bg-blue-500',
                path: '/experiment/p1/new'
              },
              {
                title: 'WallahGPT2',
                desc: 'Synthetic multi-omics data generation engine.',
                icon: Database,
                color: 'bg-teal-500',
                path: '/experiment/p2/new'
              },
              {
                title: 'WallahGPT3',
                desc: 'In-silico drug screening & perturbation mapping.',
                icon: Cpu,
                color: 'bg-purple-500',
                path: '/experiment/p3/new'
              }
            ].map((feature, i) => (
              <div key={i} className="rounded-2xl border p-8 hover:shadow-lg transition-shadow bg-slate-50">
                <feature.icon className={feature.color} size={40} />
                <h3 className="mt-6 text-xl font-bold text-slate-900">{feature.title}</h3>
                <p className="mt-4 text-slate-600 leading-relaxed">{feature.desc}</p>
                <div className="mt-6 flex items-center text-scientific-blue font-medium cursor-pointer">
                  Explore <ArrowRight size={16} className="ml-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="rounded-3xl bg-scientific-blue p-12 text-white shadow-xl">
            <h2 className="text-3xl font-bold">Ready to accelerate your research?</h2>
            <p className="mt-4 text-blue-100">Join leading institutions using WallahGPT for computational biology.</p>
            <Link 
              to="/register" 
              className="mt-8 inline-block rounded-md bg-white px-8 py-3 text-base font-semibold text-scientific-blue shadow-sm hover:bg-slate-100"
            >
              Create Researcher Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
