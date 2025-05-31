import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Phone, User, Users, MessageCircle, Shield } from "lucide-react";
import Link from "next/link";

export default function HowItWorksPage() {
  const steps = [
    {
      icon: Phone,
      title: "Phone Verification",
      description:
        "Start by verifying your phone number to ensure a secure and authentic community.",
      badge: "Step 1",
    },
    {
      icon: User,
      title: "Create Your Profile",
      description:
        "Build a comprehensive profile with photos, personal details, preferences, and what you're looking for.",
      badge: "Step 2",
    },
    {
      icon: Users,
      title: "Discover Matches",
      description:
        "Browse through potential matches based on your preferences and compatibility.",
      badge: "Step 3",
    },
    {
      icon: MessageCircle,
      title: "Connect & Chat",
      description:
        "Start meaningful conversations with people who share your interests and goals.",
      badge: "Step 4",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Verified Profiles",
      description:
        "All users go through phone verification for a safer dating experience.",
    },
    {
      icon: Heart,
      title: "Detailed Matching",
      description:
        "Our algorithm considers your preferences, deal breakers, and lifestyle choices.",
    },
    {
      icon: User,
      title: "Comprehensive Profiles",
      description:
        "Share your interests, personality traits, education, work, and what you're seeking.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find meaningful connections in just a few simple steps. Our platform
            is designed to help you meet compatible people safely and
            authentically.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="text-center border-2 hover:border-pink-200 transition-colors"
            >
              <CardHeader>
                <div className="mx-auto mb-4">
                  <Badge variant="secondary" className="mb-4">
                    {step.badge}
                  </Badge>
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
                    <step.icon className="w-8 h-8 text-pink-600" />
                  </div>
                </div>
                <CardTitle className="text-xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {step.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Our Platform?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-pink-600" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Find Your Match?
              </h3>
              <p className="mb-6 opacity-90">
                Join thousands of verified users who have found meaningful
                connections on our platform.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/signup">Get Started Today</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
