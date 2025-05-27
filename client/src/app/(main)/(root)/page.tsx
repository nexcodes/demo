"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  ArrowRight,
  Camera,
  Heart,
  Phone,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const { loading, isLoggedIn } = useCurrentUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">LoveConnect</span>
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link href="/profile">
                <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white">
                  Go to Profile
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/sign-in">
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-pink-600"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/sign-in">
                  <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Find Your Perfect Match
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Connect with
              <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                {" "}
                Meaningful{" "}
              </span>
              Relationships
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Create your authentic profile, discover compatible matches, and
              build lasting connections. Join thousands who have found love
              through our platform.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {isLoggedIn ? (
              <Link href="/profile">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-8 py-4 text-lg h-14"
                >
                  View Your Profile
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/sign-in">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-8 py-4 text-lg h-14"
                  >
                    Start Your Journey
                    <Heart className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/auth/sign-in">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-pink-200 text-pink-600 hover:bg-pink-50 px-8 py-4 text-lg h-14"
                  >
                    Learn More
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Verified Profiles
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Phone verification ensures authentic connections with real
                  people looking for genuine relationships.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Camera className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Rich Profiles
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {`Upload photos, share your interests, and describe what you're
                  looking for in detail.`}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Smart Matching
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Discover compatible profiles based on your preferences,
                  interests, and relationship goals.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* How It Works */}
          <div className="bg-white/60 backdrop-blur rounded-3xl p-8 md:p-12 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Sign Up & Verify
                </h3>
                <p className="text-gray-600">
                  Create your account and verify your phone number for security.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Build Your Profile
                </h3>
                <p className="text-gray-600">
                  Add photos, share your story, and describe your ideal match.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Connect & Chat
                </h3>
                <p className="text-gray-600">
                  Browse profiles, find your matches, and start meaningful
                  conversations.
                </p>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          {!isLoggedIn && (
            <div className="mt-16 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Find Love?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join thousands of singles who have found their perfect match.
              </p>
              <Link href="/auth/sign-in">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-12 py-4 text-lg h-16"
                >
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t border-gray-200">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
              <Heart className="h-4 w-4 text-white" />
            </div>
            <span className="text-gray-600">
              © 2024 LoveConnect. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-pink-600 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-pink-600 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-pink-600 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
