/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Baby,
  Calendar,
  Cannabis,
  ChevronLeft,
  ChevronRight,
  Cigarette,
  Edit,
  Heart,
  MapPin,
  Syringe,
  User,
  Wine,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Helper function to format preference values
const formatPreferenceValue = (key: string, value: string) => {
  const formatMap: Record<string, Record<string, string>> = {
    gender: {
      male: "Male",
      female: "Female",
      "non-binary": "Non-binary",
      other: "Other",
    },
    lookingFor: {
      relationship: "Relationship",
      casual: "Casual",
      friendship: "Friendship",
      "not-sure": "Not sure yet",
    },
    relationshipType: {
      monogamous: "Monogamous",
      "non-monogamous": "Non-monogamous",
      polyamorous: "Polyamorous",
      open: "Open to all",
    },
    interestedIn: {
      men: "Men",
      women: "Women",
      "non-binary": "Non-binary",
      everyone: "Everyone",
    },
    smoking: {
      never: "Never",
      sometimes: "Sometimes",
      often: "Often",
      "prefer-not-to-say": "Prefer not to say",
    },
    drinking: {
      never: "Never",
      sometimes: "Sometimes",
      often: "Often",
      "prefer-not-to-say": "Prefer not to say",
    },
    cannabis: {
      never: "Never",
      sometimes: "Sometimes",
      often: "Often",
      "prefer-not-to-say": "Prefer not to say",
    },
    lookingForKids: {
      want: "Want kids",
      "dont-want": "Don't want kids",
      "have-and-want-more": "Have and want more",
      "have-and-dont-want-more": "Have and don't want more",
      "not-sure": "Not sure yet",
    },
    vaccinationStatus: {
      vaccinated: "Vaccinated",
      "not-vaccinated": "Not vaccinated",
      "prefer-not-to-say": "Prefer not to say",
    },
  };

  return formatMap[key]?.[value] || value;
};

// Helper function to format interest labels
const formatInterestLabel = (interest: string) => {
  const interestMap: Record<string, string> = {
    hiking: "Hiking",
    music: "Music",
    photography: "Photography",
    art: "Art",
    cooking: "Cooking",
    reading: "Reading",
    travel: "Travel",
    dogs: "Dogs",
  };

  return interestMap[interest] || interest;
};

function PhotoCarousel({ photos }: { photos: { url: string }[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!photos || photos.length === 0) {
    return (
      <div className="w-full h-[70vh] bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">No photos available</p>
      </div>
    );
  }

  const nextPhoto = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + photos.length) % photos.length
    );
  };

  return (
    <div className="relative w-full h-[70vh]">
      {/* Main photo */}
      <div className="absolute inset-0">
        <Image
          src={photos[currentIndex].url || "/placeholder.svg"}
          alt={`Photo ${currentIndex + 1}`}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Navigation buttons */}
      {photos.length > 1 && (
        <>
          <button
            onClick={prevPhoto}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 text-gray-800 p-2 rounded-full transition-colors shadow-md"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextPhoto}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 text-gray-800 p-2 rounded-full transition-colors shadow-md"
            aria-label="Next photo"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Photo indicators */}
      {photos.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === currentIndex ? "bg-rose-500 w-4" : "bg-gray-300"
              )}
              aria-label={`Go to photo ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Thumbnail strip */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90%] pb-2">
        {photos.map((photo, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "relative w-16 h-16 rounded-md overflow-hidden border-2 transition-all shadow-sm",
              index === currentIndex
                ? "border-rose-500"
                : "border-white opacity-70"
            )}
          >
            <Image
              src={photo.url || "/placeholder.svg"}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ProfileContent({ profile }: any) {

  console.log(profile)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero section with photo carousel */}
      <div className="relative">
        <PhotoCarousel photos={profile.photos || []} />
      </div>

      {/* Profile header section */}
      <div className="max-w-3xl mx-auto px-4 pt-8 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
            <div className="flex items-center mt-1 text-gray-500">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{profile.location}</span>
              <span className="mx-2">•</span>
              <Calendar className="h-4 w-4 mr-1" />
              <span>{format(new Date(profile.birthday), "PP")}</span>
            </div>
            <Badge className="mt-3 bg-rose-500 hover:bg-rose-600">
              {formatPreferenceValue("gender", profile.gender)}
            </Badge>
          </div>
          <Button asChild>
            <Link href="/profile/edit">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Link>
          </Button>
        </div>
      </div>

      {/* Profile details */}
      <div className="max-w-3xl mx-auto px-4 py-4">
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="w-full bg-white border-b border-gray-200 rounded-none h-auto p-0 mb-6">
            <TabsTrigger
              value="about"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-rose-500 data-[state=active]:bg-transparent text-lg py-4"
            >
              About
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-rose-500 data-[state=active]:bg-transparent text-lg py-4"
            >
              Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="mt-0">
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-3 text-gray-900">
                  About Me
                </h2>
                <p className="text-gray-600">{profile.aboutMe}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3 text-gray-900">
                  Interests
                </h2>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest: string) => (
                    <Badge
                      key={interest}
                      variant="outline"
                      className="bg-gray-50 hover:bg-gray-100 py-1.5 px-3"
                    >
                      {formatInterestLabel(interest)}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3 text-gray-900">
                  Looking For
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border border-gray-100 shadow-sm">
                    <CardContent className="p-4 flex items-center">
                      <Heart className="h-5 w-5 mr-3 text-rose-500" />
                      <div>
                        <p className="text-gray-500 text-sm">Looking for</p>
                        <p className="font-medium text-gray-900">
                          {formatPreferenceValue(
                            "lookingFor",
                            profile.lookingFor
                          )}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border border-gray-100 shadow-sm">
                    <CardContent className="p-4 flex items-center">
                      <User className="h-5 w-5 mr-3 text-rose-500" />
                      <div>
                        <p className="text-gray-500 text-sm">Interested in</p>
                        <p className="font-medium text-gray-900">
                          {formatPreferenceValue(
                            "interestedIn",
                            profile.interestedIn
                          )}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details" className="mt-0">
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-3 text-gray-900">
                  Basics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border border-gray-100 shadow-sm">
                    <CardContent className="p-4 flex items-center">
                      <User className="h-5 w-5 mr-3 text-rose-500" />
                      <div>
                        <p className="text-gray-500 text-sm">Gender</p>
                        <p className="font-medium text-gray-900">
                          {formatPreferenceValue("gender", profile.gender)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border border-gray-100 shadow-sm">
                    <CardContent className="p-4 flex items-center">
                      <Calendar className="h-5 w-5 mr-3 text-rose-500" />
                      <div>
                        <p className="text-gray-500 text-sm">Birthday</p>
                        <p className="font-medium text-gray-900">
                          {format(new Date(profile.birthday), "PP")}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border border-gray-100 shadow-sm">
                    <CardContent className="p-4 flex items-center">
                      <MapPin className="h-5 w-5 mr-3 text-rose-500" />
                      <div>
                        <p className="text-gray-500 text-sm">Location</p>
                        <p className="font-medium text-gray-900">
                          {profile.location}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3 text-gray-900">
                  Lifestyle
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border border-gray-100 shadow-sm">
                    <CardContent className="p-4 flex items-center">
                      <Wine className="h-5 w-5 mr-3 text-rose-500" />
                      <div>
                        <p className="text-gray-500 text-sm">Drinking</p>
                        <p className="font-medium text-gray-900">
                          {formatPreferenceValue("drinking", profile.drinking)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border border-gray-100 shadow-sm">
                    <CardContent className="p-4 flex items-center">
                      <Cigarette className="h-5 w-5 mr-3 text-rose-500" />
                      <div>
                        <p className="text-gray-500 text-sm">Smoking</p>
                        <p className="font-medium text-gray-900">
                          {formatPreferenceValue("smoking", profile.smoking)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border border-gray-100 shadow-sm">
                    <CardContent className="p-4 flex items-center">
                      <Cannabis className="h-5 w-5 mr-3 text-rose-500" />
                      <div>
                        <p className="text-gray-500 text-sm">Cannabis</p>
                        <p className="font-medium text-gray-900">
                          {formatPreferenceValue("cannabis", profile.cannabis)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3 text-gray-900">
                  Dealbreakers
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border border-gray-100 shadow-sm">
                    <CardContent className="p-4 flex items-center">
                      <Baby className="h-5 w-5 mr-3 text-rose-500" />
                      <div>
                        <p className="text-gray-500 text-sm">Kids</p>
                        <p className="font-medium text-gray-900">
                          {formatPreferenceValue(
                            "lookingForKids",
                            profile.lookingForKids
                          )}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border border-gray-100 shadow-sm">
                    <CardContent className="p-4 flex items-center">
                      <Syringe className="h-5 w-5 mr-3 text-rose-500" />
                      <div>
                        <p className="text-gray-500 text-sm">Vaccination</p>
                        <p className="font-medium text-gray-900">
                          {formatPreferenceValue(
                            "vaccinationStatus",
                            profile.vaccinationStatus
                          )}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
