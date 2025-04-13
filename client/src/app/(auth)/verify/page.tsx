"use client";

import { verifyPhoneOtp } from "@/actions/verify-otp";
import { CustomOTPInput } from "@/components/custom-input-otp";
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
import { useCurrentUser } from "@/hooks/use-current-user";
import { strapiClient } from "@/lib/strapi";
import { supabase } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Phone number validation schema
const phoneSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long")
    .regex(/^[+]?[\d\s()-]+$/, "Please enter a valid phone number"),
});

// OTP validation schema
const otpSchema = z.object({
  otp: z.string().length(6, "Please enter all 6 digits"),
});

export default function VerifyPage() {
  const [step, setStep] = useState<"phone" | "otp" | "success">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const { user } = useCurrentUser();

  // Phone form
  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: "",
    },
  });

  // OTP form
  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  // Format phone number for display
  const formatPhoneForDisplay = (phone: string) => {
    // Simple formatting - you can enhance this based on your needs
    if (phone.length <= 4) return phone;
    return `${phone.slice(0, -4)}****`;
  };

  // Handle phone submission
  async function onPhoneSubmit(values: z.infer<typeof phoneSchema>) {
    setIsSubmitting(true);

    if (!values.phone.startsWith("+")) {
      values.phone = "+" + values.phone;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: values.phone || phoneNumber,
        // options: {
        //   shouldCreateUser: false,
        // },
      });

      if (error) throw error;

      setPhoneNumber(values.phone);
      setStep("otp");
      // Start resend countdown
      setResendCountdown(30);

      // In a real app, you would call an API to send the OTP to the user's phone
      console.log(`Sending OTP to ${values.phone}`);
    } catch (error) {
      console.error("Error sending OTP:", error);
      phoneForm.setError("phone", {
        type: "manual",
        message: "Failed to send verification code. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle OTP submission
  async function onOTPSubmit(values: z.infer<typeof otpSchema>) {
    setIsSubmitting(true);

    try {
      const { success, message } = await verifyPhoneOtp(
        phoneNumber,
        values.otp
      );

      if (!success) throw new Error(message);

      const result = strapiClient.collection("phones");

      result.create({ userId: user?.id, phone_number: phoneNumber });

      setStep("success");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      otpForm.setError("otp", {
        type: "manual",
        message: "Invalid verification code. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle resend OTP
  async function handleResendOTP() {
    if (resendCountdown > 0) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.resend({
        phone: phoneNumber,
        type: "sms",
      });

      if (error) throw error;

      setResendCountdown(30);
    } catch (error) {
      console.error("Error resending OTP:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCountdown <= 0) return;

    const timer = setTimeout(() => {
      setResendCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendCountdown]);

  return (
    <div className="z-10 w-full max-w-lg px-6 sm:px-8 py-10 sm:py-12 rounded-2xl bg-black/30 backdrop-blur-md shadow-2xl border border-white/10 mx-4">
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <div className="w-36 h-20 relative">
          <Image src="/logo.png" alt="Coxee" fill className="object-contain" />
        </div>
      </div>

      {step === "phone" && (
        <>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              Phone Verification
            </h1>
          </div>

          <Form {...phoneForm}>
            <form
              onSubmit={phoneForm.handleSubmit(onPhoneSubmit)}
              className="space-y-6"
            >
              <FormField
                control={phoneForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white text-sm font-medium">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+1 (555) 123-4567"
                        {...field}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12 px-4"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-400 text-xs">
                      Enter your phone number including country code
                    </FormDescription>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-white hover:bg-gray-100 text-gray-800 font-medium h-12 rounded-xl transition-all duration-300 hover:shadow-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Verification Code"
                )}
              </Button>
            </form>
          </Form>
        </>
      )}

      {step === "otp" && (
        <>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              Verification Code
            </h1>
            <p className="text-gray-200 text-sm">
              Enter the 6-digit code sent to{" "}
              {formatPhoneForDisplay(phoneNumber)}
            </p>
          </div>

          <Form {...otpForm}>
            <form
              onSubmit={otpForm.handleSubmit(onOTPSubmit)}
              className="space-y-6"
            >
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormControl>
                      <CustomOTPInput
                        value={field.value}
                        onChange={field.onChange}
                        length={6}
                        className="mb-2"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-center" />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-4">
                <Button
                  type="submit"
                  className="w-full bg-white hover:bg-gray-100 text-gray-800 font-medium h-12 rounded-xl transition-all duration-300 hover:shadow-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Code"
                  )}
                </Button>

                <div className="flex justify-between items-center">
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-white hover:text-gray-200 hover:bg-white/10 flex items-center gap-1 text-sm"
                    onClick={() => setStep("phone")}
                    disabled={isSubmitting}
                  >
                    <ArrowLeft size={16} />
                    Change Number
                  </Button>

                  <Button
                    type="button"
                    variant="link"
                    className={`text-sm ${
                      resendCountdown > 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-white hover:text-gray-200"
                    }`}
                    onClick={handleResendOTP}
                    disabled={resendCountdown > 0 || isSubmitting}
                  >
                    {resendCountdown > 0
                      ? `Resend in ${resendCountdown}s`
                      : "Resend Code"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </>
      )}

      {step === "success" && (
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
            <CheckCircle2 size={48} className="text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Verification Successful
          </h1>
          <p className="text-gray-200 text-sm mb-8">
            Your phone number has been verified successfully
          </p>
          <Link href="/" className="w-full">
            <Button className="w-full bg-white hover:bg-gray-100 text-gray-800 font-medium h-12 rounded-xl transition-all duration-300 hover:shadow-lg">
              Continue to App
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
