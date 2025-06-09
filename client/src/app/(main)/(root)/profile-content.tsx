"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  Weight,
  Brain,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Profile } from "@/schemas/dating-profile.schema";

export function ProfileContent({ profile }: { profile: Profile }) {
  const [showPersonality, setShowPersonality] = useState(false);

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
    const educationMap: Record<string, string> = {
      doctorate: "Doctorate",
      masters: "Master's Degree",
      bachelors: "Bachelor's Degree",
      hnd: "Higher National Diploma",
      college: "College",
      leaver: "School Leaver",
    };
    return (
      educationMap[education] ||
      education.charAt(0).toUpperCase() + education.slice(1)
    );
  };

  const formatZodiac = (zodiac: string) => {
    return zodiac.charAt(0).toUpperCase() + zodiac.slice(1);
  };

  const formatDatingPurpose = (purpose: string) => {
    const purposeMap: Record<string, string> = {
      fun: "Just for Fun",
      serious: "Serious Relationship",
      marriage: "Marriage",
    };
    return purposeMap[purpose] || purpose;
  };

  const formatSubstances = (substances: string) => {
    const substanceMap: Record<string, string> = {
      smoker: "Smoker",
      drinker: "Drinker",
      both: "Both",
      other_stuff: "Other Substances",
    };
    return substanceMap[substances] || substances;
  };

  const formatFrequency = (frequency: string) => {
    const frequencyMap: Record<string, string> = {
      none: "None",
      lightly: "Lightly",
      medium: "Medium",
      heavily: "Heavily",
    };
    return frequencyMap[frequency] || frequency;
  };

  const getPersonalityChoiceLabel = (category: string, choice: string) => {
    // This would ideally come from a configuration file
    const categoryChoices: Record<
      string,
      { optionA: string; optionB: string }
    > = {
      "Too Fat vs. Too Short": { optionA: "Too Fat", optionB: "Too Short" },
      "Hates Pets vs. Loves Pets Too Much": {
        optionA: "Hates Pets",
        optionB: "Loves Pets Too Much",
      },
      "No Sense of Humor vs. Laughs at Everything": {
        optionA: "No Sense of Humor",
        optionB: "Laughs at Everything",
      },
      "Talks Only About Themselves vs. Never Shares Anything Personal": {
        optionA: "Talks Only About Themselves",
        optionB: "Never Shares Anything Personal",
      },
      "Average looking and loyal vs. Good looking but disloyal": {
        optionA: "Average looking and loyal",
        optionB: "Good looking but disloyal",
      },
      "Addicted to Social Media vs. Has No Online Presence": {
        optionA: "Addicted to Social Media",
        optionB: "Has No Online Presence",
      },
      "Always Wants to Stay Home vs. Never Wants to Stay Home": {
        optionA: "Always Wants to Stay Home",
        optionB: "Never Wants to Stay Home",
      },
      "Terrible Taste in Music vs. Judges Your Taste in Music": {
        optionA: "Terrible Taste in Music",
        optionB: "Judges Your Taste in Music",
      },
      "Mommy Issues vs. Daddy Issues": {
        optionA: "Mommy Issues",
        optionB: "Daddy Issues",
      },
      "No Ambition vs. Workaholic": {
        optionA: "No Ambition",
        optionB: "Workaholic",
      },
      'Believes in Every Conspiracy Theory vs. Dismisses Everything as "Fake News"':
        {
          optionA: "Believes in Every Conspiracy Theory",
          optionB: 'Dismisses Everything as "Fake News"',
        },
      "Know-It-All vs. Knows-Nothing": {
        optionA: "Know-It-All",
        optionB: "Knows-Nothing",
      },
      "Spends Too Much Money vs. Excessively Frugal": {
        optionA: "Spends Too Much Money",
        optionB: "Excessively Frugal",
      },
      "Smart, highly motivated, and poor vs. Not smart, highly unmotivated, but well-off":
        {
          optionA: "Smart, highly motivated, and poor",
          optionB: "Not smart, highly unmotivated, but well-off",
        },
      "Rich but very unethical and immoral vs. Poor but very ethical and moral":
        {
          optionA: "Rich but very unethical and immoral",
          optionB: "Poor but very ethical and moral",
        },
    };

    const choices = categoryChoices[category];
    if (!choices) return choice === "optionA" ? "Option A" : "Option B";
    return choice === "optionA" ? choices.optionA : choices.optionB;
  };

  const age = calculateAge(profile.dateOfBirth);
  const height = `${profile.height.feet}'${profile.height.inches}"`;
  const weight = `${profile.weight.value} ${profile.weight.unit}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Hero Section */}
        <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
          <div className="relative h-96">
            {profile.gallery && profile.gallery[0] && (
              <Image
                src={
                  typeof profile.gallery[0] === "string"
                    ? profile.gallery[0]
                    : (profile.gallery[0] as any)?.url ||
                      "/placeholder.svg?height=400&width=400"
                }
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
                <p className="text-gray-700 leading-relaxed">
                  {profile.aboutMe?.trim() || "No description provided yet."}
                </p>
              </CardContent>
            </Card>

            {/* What I'm Looking For */}
            <Card className="shadow-lg border-0">
              <CardHeader>
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
                    {formatDatingPurpose(profile.datingPurpose)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Interests */}
            {profile.interests && profile.interests.length > 0 && (
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Star className="w-6 h-6 text-yellow-500" />
                    Interests
                  </CardTitle>
                </CardHeader>
                <CardContent>
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

            {/* Personality Choices */}
            {profile.personalityChoices &&
              profile.personalityChoices.length > 0 && (
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Brain className="w-6 h-6 text-indigo-500" />
                      Personality Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Collapsible
                      open={showPersonality}
                      onOpenChange={setShowPersonality}
                    >
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          <span>
                            View Personality Choices (
                            {profile.personalityChoices.length})
                          </span>
                          {showPersonality ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-3 mt-4">
                        {profile.personalityChoices.map((choice, index) => (
                          <div
                            key={index}
                            className="p-3 bg-gray-50 rounded-lg"
                          >
                            <p className="text-sm font-medium text-gray-600 mb-1">
                              {choice.category}
                            </p>
                            <Badge
                              variant="secondary"
                              className="bg-indigo-100 text-indigo-700"
                            >
                              {getPersonalityChoiceLabel(
                                choice.category,
                                choice.choice
                              )}
                            </Badge>
                          </div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                </Card>
              )}

            {/* Gallery */}
            {profile.gallery && profile.gallery.length > 1 && (
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Camera className="w-6 h-6 text-blue-500" />
                    Gallery
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {profile.gallery
                      .slice(1)
                      .map((image: any, index: number) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-lg overflow-hidden"
                        >
                          <Image
                            src={
                              typeof image === "string"
                                ? image
                                : image?.url ||
                                  `/placeholder.svg?height=300&width=300`
                            }
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
                  <Weight className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Weight</p>
                    <p className="text-gray-600">{weight}</p>
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

                {profile.zodiac && (
                  <>
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
                  </>
                )}
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
                      {formatSubstances(profile.poisonsOfChoice.substances)}
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
                      {formatFrequency(profile.poisonsOfChoice.frequency)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            {((profile.dealBreakers && profile.dealBreakers.length > 0) ||
              (profile.dontShowMe && profile.dontShowMe.length > 0)) && (
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-xl">Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.dealBreakers && profile.dealBreakers.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <X className="w-4 h-4 text-red-500" />
                        <p className="font-medium text-sm">Deal Breakers</p>
                      </div>
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

                  {profile.dontShowMe && profile.dontShowMe.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Eye className="w-4 h-4 text-gray-500" />
                        <p className="font-medium text-sm">
                          Don&apos;t Show Me
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {profile.dontShowMe.map(
                          (item: string, index: number) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {item}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
