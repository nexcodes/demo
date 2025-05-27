"use client";

import type React from "react";
import { useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { X, Camera, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DatingProfileForm,
  datingProfileFormSchema,
} from "@/schemas/dating-profile.schema";
import { DatePicker } from "@/components/date-picker";

interface TagInputProps {
  value?: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags: number;
}

const interestOptions = [
  "Hiking",
  "Music",
  "Photography",
  "Art",
  "Cooking",
  "Reading",
  "Travel",
  "Dogs",
  "Fitness",
  "Movies",
  "Gaming",
  "Dancing",
  "Yoga",
  "Coffee",
  "Wine",
  "Books",
  "Sports",
  "Nature",
  "Technology",
  "Fashion",
  "Food",
  "Adventure",
  "Comedy",
  "Outdoors",
];

type ProfileFormProps = {
  initialData?: Partial<DatingProfileForm>;
  onSubmit: (values: DatingProfileForm) => void;
  isLoading?: boolean;
};

// Mock TagInput component
const TagInput = ({
  value = [],
  onChange,
  placeholder,
  maxTags,
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const addTag = (tag: string) => {
    if (tag.trim() && !value.includes(tag.trim()) && value.length < maxTags) {
      onChange([...value, tag.trim()]);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag: string) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {value.map((tag: string) => (
          <Badge key={tag} variant="secondary" className="px-3 py-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-2 hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTag(inputValue);
          }
        }}
        placeholder={placeholder}
      />
      <div className="flex flex-wrap gap-2">
        {interestOptions
          .filter((option) => !value.includes(option))
          .slice(0, 8)
          .map((option) => (
            <Button
              key={option}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addTag(option)}
              className="h-8 text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              {option}
            </Button>
          ))}
      </div>
    </div>
  );
};

export function ProfileForm({
  initialData,
  onSubmit,
  isLoading = false,
}: ProfileFormProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedPreviews, setSelectedPreviews] = useState<string[]>([]);
  const [deletePhotoIndex, setDeletePhotoIndex] = useState<number | null>(null);
  const [formProgress, setFormProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<DatingProfileForm>({
    resolver: zodResolver(datingProfileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: undefined,
      postcode: "",
      datingPurpose: undefined,
      aboutMe: "",
      aboutYou: "",
      height: { feet: 5, inches: 6 },
      education: undefined,
      work: "",
      zodiac: undefined,
      poisonsOfChoice: { substances: undefined, frequency: undefined },
      interests: [],
      personalityChoice: undefined,
      dontShowMe: [],
      dealBreakers: [],
      ...initialData,
      gallery: [],
    },
    mode: "onChange",
  });

  // Calculate form completion progress
  const calculateProgress = () => {
    const values = form.getValues();
    const requiredFields = [
      "firstName",
      "lastName",
      "dateOfBirth",
      "postcode",
      "datingPurpose",
      "gallery",
      "aboutMe",
      "aboutYou",
      "height",
      "education",
      "work",
      "poisonsOfChoice",
      "interests",
      "personalityChoice",
    ];

    let filledFields = 0;
    requiredFields.forEach((field) => {
      const value = values[field as keyof typeof values];
      if (field === "gallery" && selectedFiles.length > 0) {
        filledFields++;
      } else if (
        field === "height" &&
        typeof value === "object" &&
        value !== null &&
        "feet" in value &&
        "inches" in value
      ) {
        filledFields++;
      } else if (
        field === "poisonsOfChoice" &&
        typeof value === "object" &&
        value !== null &&
        "substances" in value &&
        "frequency" in value &&
        value.substances &&
        value.frequency
      ) {
        filledFields++;
      } else if (
        field === "interests" &&
        Array.isArray(value) &&
        value.length > 0
      ) {
        filledFields++;
      } else if (value && typeof value === "string" && value.trim() !== "") {
        filledFields++;
      } else if (value instanceof Date) {
        filledFields++;
      }
    });

    const progress = Math.round((filledFields / requiredFields.length) * 100);
    setFormProgress(progress);
    return progress;
  };

  // Update progress when form values change
  form.watch(() => {
    calculateProgress();
  });
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newFiles = [...selectedFiles, ...files].slice(0, 6);
      setSelectedFiles(newFiles);

      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setSelectedPreviews((prev) => [...prev, ...newPreviews].slice(0, 6));

      // Set gallery to files for form validation
      form.setValue("gallery", newFiles);
      form.trigger("gallery");
    }
  };
  const removePhoto = (index: number) => {
    setDeletePhotoIndex(null);
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedPreviews = selectedPreviews.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    setSelectedPreviews(updatedPreviews);

    // Set gallery to files for form validation
    form.setValue("gallery", updatedFiles);
    form.trigger("gallery");
  };

  const handleSubmit = async (values: DatingProfileForm) => {
    onSubmit(values);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Profile
          </h1>
          <div className="flex items-center justify-center gap-3">
            <span className="text-sm text-gray-600">
              {formProgress}% complete
            </span>
            <Progress value={formProgress} className="w-32 h-2" />
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Basic Information */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          First Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter first name"
                            className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Last Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter last name"
                            className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Date of Birth
                      </FormLabel>
                      <FormControl>
                        <DatePicker
                          value={
                            field.value instanceof Date
                              ? field.value
                              : field.value
                              ? new Date(field.value)
                              : undefined
                          }
                          onChange={(date) => field.onChange(date)}
                          placeholder="Select your date of birth"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Postcode
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your postcode"
                          className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Dating Purpose */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Dating Purpose
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="datingPurpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        What are you looking for?
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500">
                            <SelectValue placeholder="Select your dating purpose" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fun">Fun</SelectItem>
                          <SelectItem value="serious">
                            Serious relationship
                          </SelectItem>
                          <SelectItem value="marriage">Marriage</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Photos Section */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="gallery"
                  render={() => (
                    <FormItem>
                      <div className="space-y-4">
                        {/* Photo Grid */}
                        {selectedPreviews.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {/* Main photo - larger */}
                            <div className="col-span-2 sm:col-span-2 relative aspect-[3/4] rounded-xl overflow-hidden border-2 border-pink-200 bg-gray-100">
                              <Image
                                src={
                                  selectedPreviews[0] ||
                                  "/placeholder.svg?height=400&width=300" ||
                                  "/placeholder.svg"
                                }
                                alt="Main photo"
                                fill
                                className="object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => setDeletePhotoIndex(0)}
                                className="absolute top-2 right-2 bg-black/50 rounded-full p-1.5 hover:bg-black/70 transition-all"
                              >
                                <X className="h-4 w-4 text-white" />
                              </button>
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                                <span className="text-white text-sm font-medium">
                                  Main Photo
                                </span>
                              </div>
                            </div>

                            {/* Additional photos */}
                            {selectedPreviews.slice(1).map((photo, index) => {
                              const photoIndex = index + 1;
                              return (
                                <div
                                  key={photoIndex}
                                  className="aspect-[3/4] relative rounded-lg overflow-hidden border border-gray-200 bg-gray-100"
                                >
                                  <Image
                                    src={
                                      photo ||
                                      "/placeholder.svg?height=300&width=225" ||
                                      "/placeholder.svg"
                                    }
                                    alt={`Photo ${photoIndex + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setDeletePhotoIndex(photoIndex)
                                    }
                                    className="absolute top-1 right-1 bg-black/50 rounded-full p-1 hover:bg-black/70 transition-all"
                                  >
                                    <X className="h-3 w-3 text-white" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Add Photo Button */}
                        {selectedPreviews.length < 6 && (
                          <div className="flex flex-col items-center justify-center">
                            {selectedPreviews.length === 0 ? (
                              <div
                                className="w-full aspect-[3/2] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-pink-400 hover:bg-pink-50 transition-all bg-gray-50"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                <div className="text-center">
                                  <Camera className="h-12 w-12 text-gray-400 mb-3 mx-auto" />
                                  <h3 className="text-lg font-medium text-gray-700 mb-1">
                                    Add your photos
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    Upload 1-6 photos to get started
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 px-6 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-400 hover:bg-pink-50 transition-all bg-gray-50 text-gray-600 hover:text-pink-600"
                              >
                                <Plus className="h-5 w-5" />
                                <span className="font-medium">
                                  Add more photos ({selectedPreviews.length}/6)
                                </span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                        multiple
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* About Sections */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="aboutMe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        About Me
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell others about yourself..."
                          className="resize-none min-h-[120px] border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                          {...field}
                        />
                      </FormControl>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Describe yourself and your interests</span>
                        <span>{field.value?.length || 0}/1000</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="aboutYou"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        {"About You (What you're looking for)"}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what you're looking for in a partner..."
                          className="resize-none min-h-[120px] border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                          {...field}
                        />
                      </FormControl>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Describe your ideal partner</span>
                        <span>{field.value?.length || 0}/1000</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Physical Attributes */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Physical Attributes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Height
                      </FormLabel>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Feet"
                              min={3}
                              max={8}
                              value={field.value?.feet || ""}
                              onChange={(e) =>
                                field.onChange({
                                  ...field.value,
                                  feet: Number.parseInt(e.target.value) || 0,
                                })
                              }
                              className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                            />
                          </FormControl>
                        </div>
                        <div>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Inches"
                              min={0}
                              max={11}
                              value={field.value?.inches || ""}
                              onChange={(e) =>
                                field.onChange({
                                  ...field.value,
                                  inches: Number.parseInt(e.target.value) || 0,
                                })
                              }
                              className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                            />
                          </FormControl>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Background Information */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Background
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Education
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500">
                            <SelectValue placeholder="Select education level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="doctorate">Doctorate</SelectItem>
                          <SelectItem value="masters">Masters</SelectItem>
                          <SelectItem value="bachelors">Bachelors</SelectItem>
                          <SelectItem value="hnd">HND</SelectItem>
                          <SelectItem value="college">College</SelectItem>
                          <SelectItem value="leaver">School Leaver</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="work"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Work
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your work/profession"
                          className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zodiac"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Zodiac Sign (Optional)
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500">
                            <SelectValue placeholder="Select zodiac sign" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="aries">Aries</SelectItem>
                          <SelectItem value="taurus">Taurus</SelectItem>
                          <SelectItem value="gemini">Gemini</SelectItem>
                          <SelectItem value="cancer">Cancer</SelectItem>
                          <SelectItem value="leo">Leo</SelectItem>
                          <SelectItem value="virgo">Virgo</SelectItem>
                          <SelectItem value="libra">Libra</SelectItem>
                          <SelectItem value="scorpio">Scorpio</SelectItem>
                          <SelectItem value="sagittarius">
                            Sagittarius
                          </SelectItem>
                          <SelectItem value="capricorn">Capricorn</SelectItem>
                          <SelectItem value="aquarius">Aquarius</SelectItem>
                          <SelectItem value="pisces">Pisces</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Lifestyle Choices */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Lifestyle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="poisonsOfChoice.substances"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Substances
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500">
                            <SelectValue placeholder="Select substance preference" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="alcohol">Alcohol</SelectItem>
                          <SelectItem value="cigarettes_weed">
                            Cigarettes/Weed
                          </SelectItem>
                          <SelectItem value="more_stuff">More stuff</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="poisonsOfChoice.frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Frequency
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="lightly">Lightly</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="heavily">Heavily</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Interests */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Interests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="interests"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <TagInput
                          value={field.value || []}
                          onChange={field.onChange}
                          placeholder="Add your interests"
                          maxTags={20}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        Add 1-20 interests that represent you
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Personality Choice */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Personality
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="personalityChoice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Choose your personality preference
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500">
                            <SelectValue placeholder="Select personality choice" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fat_vs_short">
                            Fat vs Short
                          </SelectItem>
                          <SelectItem value="hates_pets_vs_loves_pets">
                            Hates Pets vs Loves Pets
                          </SelectItem>
                          <SelectItem value="no_humor_vs_laughs_everything">
                            No Humor vs Laughs at Everything
                          </SelectItem>
                          <SelectItem value="talks_self_vs_never_shares">
                            Talks About Self vs Never Shares
                          </SelectItem>
                          <SelectItem value="average_loyal_vs_good_disloyal">
                            Average & Loyal vs Good Looking & Disloyal
                          </SelectItem>
                          <SelectItem value="social_media_vs_no_presence">
                            Social Media vs No Online Presence
                          </SelectItem>
                          <SelectItem value="stay_home_vs_never_home">
                            Stay at Home vs Never Home
                          </SelectItem>
                          <SelectItem value="bad_taste_vs_judges_taste">
                            Bad Taste vs Judges Your Taste
                          </SelectItem>
                          <SelectItem value="mommy_vs_daddy_issues">
                            Mommy vs Daddy Issues
                          </SelectItem>
                          <SelectItem value="no_ambition_vs_workaholic">
                            No Ambition vs Workaholic
                          </SelectItem>
                          <SelectItem value="conspiracy_vs_fake_news">
                            Conspiracy Theorist vs Believes Fake News
                          </SelectItem>
                          <SelectItem value="know_all_vs_know_nothing">
                            Know-it-all vs Knows Nothing
                          </SelectItem>
                          <SelectItem value="spends_much_vs_frugal">
                            Spends Too Much vs Too Frugal
                          </SelectItem>
                          <SelectItem value="smart_poor_vs_dumb_rich">
                            Smart & Poor vs Dumb & Rich
                          </SelectItem>
                          <SelectItem value="rich_unethical_vs_poor_ethical">
                            Rich & Unethical vs Poor & Ethical
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Preferences & Deal Breakers */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Preferences & Deal Breakers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="dontShowMe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        {"Don't Show Me (Optional)"}
                      </FormLabel>
                      <FormControl>
                        <TagInput
                          value={field.value || []}
                          onChange={field.onChange}
                          placeholder="Add things you don't want to see"
                          maxTags={3}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        {"Add up to 3 things you don't want to see in profiles"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dealBreakers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Deal Breakers (Optional)
                      </FormLabel>
                      <FormControl>
                        <TagInput
                          value={field.value || []}
                          onChange={field.onChange}
                          placeholder="Add your deal breakers"
                          maxTags={3}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        Add up to 3 absolute deal breakers
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold text-lg rounded-xl shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Profile...
                  </>
                ) : (
                  "Create Profile"
                )}
              </Button>
            </div>
          </form>
        </Form>

        {/* Delete Photo Confirmation Dialog */}
        <Dialog
          open={deletePhotoIndex !== null}
          onOpenChange={() => setDeletePhotoIndex(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Remove Photo</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove this photo? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setDeletePhotoIndex(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() =>
                  deletePhotoIndex !== null && removePhoto(deletePhotoIndex)
                }
              >
                Remove
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default function App() {
  const handleSubmit = (values: DatingProfileForm) => {
    console.log("Form submitted:", values);
  };

  return (
    <div className="min-h-screen">
      <ProfileForm onSubmit={handleSubmit} />
    </div>
  );
}
