import React from "react";
import { Shield, Zap, Database, Lock } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Zap className="w-7 h-7" />,
      title: "Automated Vulnerability Scanning",
      desc: "Integrated with OWASP ZAP to detect security issues in web applications automatically.",
      color: "red",
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: "Risk Scoring Engine",
      desc: "Categorizes vulnerabilities into High, Medium, and Low risk with clear insights.",
      color: "blue",
    },
    {
      icon: <Database className="w-7 h-7" />,
      title: "Scan History Tracking",
      desc: "Securely stores scan results with a complete audit trail using MongoDB.",
      color: "red",
    },
    {
      icon: <Lock className="w-7 h-7" />,
      title: "Secure Authentication",
      desc: "Google OAuth 2.0 with JWT-based authentication for secure access control.",
      color: "blue",
    },
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Powerful Security Features
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Everything you need to monitor and protect your web applications from vulnerabilities.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition duration-300"
            >
              {/* Icon */}
              <div
                className={`inline-flex p-3 rounded-xl mb-5 ${
                  feature.color === "red"
                    ? "bg-red-100 text-red-600"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
