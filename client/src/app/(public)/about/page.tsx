import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Shield, Target } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Authentic Connections",
      description:
        "We believe in fostering genuine relationships built on trust, compatibility, and shared values.",
    },
    {
      icon: Shield,
      title: "Safety First",
      description:
        "Your safety and privacy are our top priorities. We maintain a secure, verified community.",
    },
    {
      icon: Users,
      title: "Inclusive Community",
      description:
        "We welcome people from all backgrounds, orientations, and walks of life to find their perfect match.",
    },
    {
      icon: Target,
      title: "Meaningful Matches",
      description:
        "Our advanced matching system focuses on compatibility and long-term relationship potential.",
    },
  ];

  const stats = [
    { number: "50K+", label: "Active Users" },
    { number: "15K+", label: "Successful Matches" },
    { number: "98%", label: "Verified Profiles" },
    { number: "4.8★", label: "User Rating" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            About Us
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Connecting Hearts, Building Futures
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {`We're more than just a dating app. We're a community dedicated to
            helping people find meaningful, lasting relationships through
            authentic connections and smart matching technology.`}
          </p>
        </div>

        {/* Mission */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
            <CardContent className="p-8 md:p-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
                  {`To create a safe, inclusive platform where people can build
                  authentic connections based on compatibility, shared values,
                  and genuine interest. We believe everyone deserves to find
                  love and companionship, and we're here to make that journey
                  easier, safer, and more enjoyable.`}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-pink-600" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-16">
          <Card className="bg-gray-900 text-white">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl font-bold text-center mb-12">
                Our Impact
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-pink-400 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Story */}
        <div className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="mb-6">
                {`Founded in 2023, our platform was born from the belief that
                finding love shouldn't be left to chance. Our team of
                relationship experts, technologists, and designers came together
                with a shared vision: to create a dating experience that
                prioritizes quality connections over quantity.`}
              </p>
              <p className="mb-6">
                We noticed that many dating apps focused on superficial
                interactions and quick swipes, often leading to frustration and
                disappointment. We wanted to build something different – a
                platform that encourages users to share their authentic selves
                and connect based on deeper compatibility.
              </p>
              <p>
                {`Today, we're proud to have facilitated thousands of meaningful
                connections and continue to evolve our platform based on user
                feedback and the latest research in relationship psychology and
                technology.`}
              </p>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Join Our Community</h3>
              <p className="mb-6 opacity-90">
                Ready to start your journey toward meaningful connections? Join
                thousands of verified users who trust our platform to help them
                find love.
              </p>
              <div className="text-sm opacity-75">
                Questions? Reach out to our team at hello@yourapp.com
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
