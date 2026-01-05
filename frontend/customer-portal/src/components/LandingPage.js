import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Navigation */}
      <nav className="border-b border-neutral-700 bg-neutral-900/50 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="text-2xl font-bold text-primary">IC Maintenance</div>
          <div className="flex gap-4">
            <Link to="/login" className="text-neutral-300 hover:text-white transition">
              Sign In
            </Link>
            <Link to="/register" className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold text-white mb-4">
          Building Maintenance Made Simple
        </h1>
        <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
          Streamline your maintenance operations from request to completion. Connect with trusted trade specialists and manage everything in one place.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/register" className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg text-lg font-semibold transition">
            Get Started Free
          </Link>
          <Link to="#features" className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition">
            Learn More
          </Link>
        </div>
      </section>

      {/* Services Preview */}
      <section id="features" className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Our Core Solutions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Request Management',
              description: 'Submit and track maintenance requests with photo uploads',
              icon: '📋',
            },
            {
              title: 'Quote Comparison',
              description: 'Get competitive quotes from vetted trade specialists',
              icon: '💰',
            },
            {
              title: 'Job Tracking',
              description: 'Real-time updates from submission to completion',
              icon: '📊',
            },
            {
              title: 'Reporting & Analytics',
              description: 'Comprehensive reports on costs and maintenance history',
              icon: '📈',
            },
          ].map((service, idx) => (
            <div
              key={idx}
              className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 hover:border-primary transition"
            >
              <div className="text-4xl mb-3">{service.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{service.title}</h3>
              <p className="text-neutral-300 text-sm">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Why Choose IC Maintenance?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: 'Trusted Network',
              description: 'Work with verified, licensed, and insured trade specialists who meet our quality standards.',
            },
            {
              title: 'Transparent Pricing',
              description: 'Get detailed quotes with itemized breakdowns and compare multiple options before deciding.',
            },
            {
              title: 'Complete Visibility',
              description: 'Track every job from request to completion with real-time status updates and notifications.',
            },
            {
              title: 'Comprehensive Records',
              description: 'Access complete maintenance history, invoices, and reports for compliance and budgeting.',
            },
          ].map((benefit, idx) => (
            <div key={idx} className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-white mb-3">{benefit.title}</h3>
              <p className="text-neutral-300">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Organization Types */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Built For Your Organization
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Residential',
              description: 'Perfect for homeowners and residential property managers',
              features: ['Single property management', 'Contractor coordination', 'Maintenance scheduling'],
            },
            {
              title: 'Property Management',
              description: 'Scale across multiple properties with ease',
              features: ['Multi-property tracking', 'Tenant coordination', 'Budget management'],
            },
            {
              title: 'Sporting Organizations',
              description: 'Specialized for facilities and equipment maintenance',
              features: ['Facility management', 'Equipment tracking', 'Safety compliance'],
            },
          ].map((org, idx) => (
            <div key={idx} className="bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-3">{org.title}</h3>
              <p className="text-neutral-300 mb-6">{org.description}</p>
              <ul className="space-y-2">
                {org.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-neutral-300">
                    <span className="text-primary mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Ready to Simplify Your Maintenance?
        </h2>
        <p className="text-primary-light mb-8 text-lg max-w-2xl mx-auto">
          Join organizations already using IC Maintenance to streamline their operations.
        </p>
        <Link to="/register" className="bg-white text-primary hover:bg-neutral-100 px-8 py-4 rounded-lg text-lg font-semibold transition inline-block">
          Get Started Free
        </Link>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            {
              q: 'How do I get started?',
              a: 'Simply register your organization, complete your profile, and start submitting maintenance requests. We\'ll connect you with qualified trade specialists.',
            },
            {
              q: 'How do quotes work?',
              a: 'Submit a request and receive competitive quotes from multiple trade specialists. Review, compare, and approve the best option for your needs.',
            },
            {
              q: 'Is my data secure?',
              a: 'Yes. We use enterprise-grade security with data encryption. Each organization has isolated data with no cross-access.',
            },
            {
              q: 'What types of maintenance are supported?',
              a: 'We support all building maintenance types including plumbing, electrical, HVAC, carpentry, painting, and more. Custom categories can be added.',
            },
            {
              q: 'How much does it cost?',
              a: 'IC Maintenance offers flexible pricing based on your organization size and needs. Contact us for a custom quote.',
            },
            {
              q: 'Can I track multiple properties?',
              a: 'Yes! Property management companies can manage multiple properties from a single account with location-specific tracking.',
            },
          ].map((item, idx) => (
            <div key={idx} className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-primary mb-3">{item.q}</h3>
              <p className="text-neutral-300">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-700 bg-neutral-900 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-primary mb-4">IC Maintenance</h3>
              <p className="text-neutral-400">Complete maintenance management platform for modern organizations.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><Link to="#features" className="hover:text-white transition">Features</Link></li>
                <li><Link to="#" className="hover:text-white transition">Pricing</Link></li>
                <li><Link to="#" className="hover:text-white transition">Use Cases</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><Link to="#" className="hover:text-white transition">About</Link></li>
                <li><Link to="#" className="hover:text-white transition">Contact</Link></li>
                <li><Link to="#" className="hover:text-white transition">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><Link to="#" className="hover:text-white transition">Privacy</Link></li>
                <li><Link to="#" className="hover:text-white transition">Terms</Link></li>
                <li><Link to="#" className="hover:text-white transition">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-700 pt-8 text-center text-neutral-400">
            <p>&copy; 2026 IC Maintenance. All rights reserved. Professional maintenance management solutions.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
