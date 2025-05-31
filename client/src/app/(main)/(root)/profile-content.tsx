/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  MapPin,
  Calendar,
  Ruler,
  GraduationCap,
  Briefcase,
  Star,
  X,
  Eye,
  User,
  Camera,
  Edit,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function ProfileContent({ profile }: { profile: any }) {
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const formatEducation = (education: string) => {
    return education.charAt(0).toUpperCase() + education.slice(1);
  };

  const formatZodiac = (zodiac: string) => {
    return zodiac.charAt(0).toUpperCase() + zodiac.slice(1);
  };

  const age = calculateAge(profile.dateOfBirth);
  const height = `${profile.height.feet}'${profile.height.inches}"`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Hero Section */}        <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
          <div className="relative h-96">
            {profile.gallery[0] && (
              <Image
                src={profile.gallery[0].url || "/placeholder.svg"}
                alt="Profile"
                fill
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <Link href="/profile/edit">
              <Button 
                className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm border border-white/30 text-white hover:bg-black/30 transition-all"
                size="sm"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-4xl font-bold mb-2">
                {profile.firstName} {profile.lastName}
              </h1>
              <div className="flex items-center gap-4 text-lg">
                <div className="flex items-center gap-1">
                  <Calendar className="w-5 h-5" />
                  <span>{age} years old</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-5 h-5" />
                  <span>{profile.postcode}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Me */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <User className="w-6 h-6 text-purple-500" />
                  About Me
                </CardTitle>
              </CardHeader>
              <CardContent>
                {" "}
                <p className="text-gray-700 leading-relaxed">
                  {profile.aboutMe.trim() || "No description provided yet."}
                </p>
              </CardContent>
            </Card>

            {/* What I'm Looking For */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                {" "}
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Heart className="w-6 h-6 text-pink-500" />
                  What I&apos;m Looking For
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {profile.aboutYou || "No preferences specified yet."}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">
                    Dating Purpose:
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-pink-100 text-pink-700"
                  >
                    {profile.datingPurpose}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Interests */}
            {profile.interests.length > 0 && (
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Star className="w-6 h-6 text-yellow-500" />
                    Interests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {" "}
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map(
                      (interest: string, index: number) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200"
                        >
                          {interest}
                        </Badge>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Gallery */}
            {profile.gallery.length > 1 && (
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Camera className="w-6 h-6 text-blue-500" />
                    Gallery
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {" "}
                  <div className="grid grid-cols-2 gap-4">
                    {profile.gallery
                      .slice(1)
                      .map((image: any, index: number) => (
                        <div
                          key={image._key}
                          className="relative aspect-square rounded-lg overflow-hidden"
                        >
                          <Image
                            src={image.url || "/placeholder.svg"}
                            alt={`Gallery image ${index + 1}`}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Basic Info */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl">Basic Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Ruler className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Height</p>
                    <p className="text-gray-600">{height}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Education</p>
                    <p className="text-gray-600">
                      {formatEducation(profile.education)}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Work</p>
                    <p className="text-gray-600">{profile.work}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Zodiac</p>
                    <p className="text-gray-600">
                      {formatZodiac(profile.zodiac)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lifestyle */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl">Lifestyle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-sm text-gray-600 mb-1">
                      Substances
                    </p>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      {profile.poisonsOfChoice.substances}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-600 mb-1">
                      Frequency
                    </p>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      {profile.poisonsOfChoice.frequency}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl">Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.dealBreakers.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <X className="w-4 h-4 text-red-500" />
                      <p className="font-medium text-sm">Deal Breakers</p>
                    </div>{" "}
                    <div className="flex flex-wrap gap-1">
                      {profile.dealBreakers.map(
                        (item: string, index: number) => (
                          <Badge
                            key={index}
                            variant="destructive"
                            className="text-xs"
                          >
                            {item}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )}

                {profile.dontShowMe.length > 0 && (
                  <div>
                    {" "}
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-4 h-4 text-gray-500" />
                      <p className="font-medium text-sm">Don&apos;t Show Me</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {profile.dontShowMe.map((item: string, index: number) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
