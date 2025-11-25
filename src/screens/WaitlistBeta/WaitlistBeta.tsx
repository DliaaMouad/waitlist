import { ArrowRightIcon, CheckCircle2Icon, MailIcon } from "lucide-react";
import React, { useState } from "react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";

export const WaitlistBeta = (): JSX.Element => {
  const [email, setEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch('/api/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        // Handle non-JSON response (likely 404 or 500 HTML page)
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      if (response.ok) {
        // Successfully joined the waitlist
        setShowSuccess(true);
        setEmail("");
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
      } else if (response.status === 409) {
        // Already on the waitlist
        setErrorMessage("You're already on the waitlist! Check your email for confirmation.");
      } else {
        // Other errors
        setErrorMessage(data.error || `Error ${response.status}: Something went wrong.`);
      }
    } catch (error: any) {
      console.error('Error joining waitlist:', error);
      setErrorMessage(error.message || "Unable to connect. Please check your internet connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#101f1c] overflow-hidden w-full min-h-screen flex items-center justify-center relative">
      <div className="absolute top-0 left-0 w-full h-[72.33px] bg-[#fdf00e] rotate-[-18.70deg] blur-[200px] opacity-50" />

      <div className="z-10 flex items-center justify-center px-4">
        <Card className="w-full max-w-[672px] rounded-3xl bg-white overflow-hidden border-0 shadow-lg">
          <CardContent className="p-12 flex flex-col items-center">
            <div className="w-12 h-12 bg-[#d4dfd880] rounded-[10px] shadow-[2px_4px_4px_#00000040] flex items-center justify-center mb-6">
              <img
                className="w-8 h-[30px]"
                alt="Aurium Logo"
                src="/group-26981.png"
              />
            </div>

            <div className="flex items-center gap-2 mb-4">
              <h1 className="[font-family:'Lora',Helvetica] font-semibold text-[#101f1c] text-3xl tracking-[0] leading-[31px]">
                Aurium
              </h1>
              <Badge className="bg-[#09321f0d] text-[#09321f66] hover:bg-[#09321f0d] rounded-full shadow-[inset_-2px_-0.5px_4px_#d4dfd880] h-5 px-2 [font-family:'Segoe_UI_Symbol-Regular',Helvetica] font-normal text-[11.8px]">
                beta
              </Badge>
            </div>

            <div className="text-center mb-6">
              <p className="[font-family:'Inter',Helvetica] text-lg tracking-[0] leading-[18px]">
                <span className="font-semibold text-[#101f1c]">
                  Effortless{" "}
                </span>
                <span className="font-extrabold italic text-[#888115]">
                  Wealth
                </span>
                <span className="font-semibold text-[#101f1c]">
                  {" "}
                  Management Starts Here.
                </span>
              </p>
            </div>

            <p className="text-center [font-family:'Inter',Helvetica] font-normal text-[#101f1c80] text-xs tracking-[0] leading-5 mb-8 max-w-[463px]">
              The Next-generation Platform And App That Lets You Automate
              Investing And Savings Easily And Securely With Ai And Blockchain
              Technology.
            </p>

            <form onSubmit={handleSubmit} className="w-full max-w-[312px] space-y-2 mb-8">
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-[22px] h-[22px] text-[#101f1c66]" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  className="w-full h-10 pl-12 rounded-[10px] border-[0.5px] border-[#0000004c] bg-white [font-family:'Lora',Helvetica] font-normal text-[#101f1c66] text-[12.5px] placeholder:text-[#101f1c66] disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              {errorMessage && (
                <div className="text-red-600 text-xs [font-family:'Inter',Helvetica] font-normal p-2 bg-red-50 rounded-md border border-red-200">
                  {errorMessage}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 bg-[#101f1c] hover:bg-[#101f1c]/90 rounded-[10px] text-white [font-family:'Inter',Helvetica] font-normal text-[11px] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Joining...
                  </>
                ) : (
                  <>
                    <ArrowRightIcon className="w-[11.4px] h-[11.4px] mr-2" />
                    Join the waitlist
                  </>
                )}
              </Button>
            </form>

            <Separator className="w-full max-w-[313px] mb-6" />

            <div className="text-center">
              <p className="[font-family:'Inter',Helvetica] font-normal text-[#00000066] text-[11px] tracking-[0] leading-[normal]">
                Terms | Privacy Policy
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="absolute bottom-0 right-0 w-full h-[72.33px] bg-[#fdf00e] rotate-[-18.70deg] blur-[200px] opacity-50" />

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <Card className="w-full max-w-md mx-4 rounded-3xl bg-white border-0 shadow-2xl animate-in zoom-in duration-300">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#888115]/10 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500 delay-150">
                <CheckCircle2Icon className="w-10 h-10 text-[#888115]" />
              </div>

              <h2 className="[font-family:'Lora',Helvetica] font-semibold text-[#101f1c] text-2xl mb-3">
                Welcome to Aurium!
              </h2>

              <p className="[font-family:'Inter',Helvetica] font-normal text-[#101f1c] text-base mb-2">
                You're on the waitlist!
              </p>

              <p className="[font-family:'Inter',Helvetica] font-normal text-[#101f1c80] text-sm leading-6 max-w-sm">
                We'll notify you as soon as we launch. Get ready to experience effortless wealth management.
              </p>

              <Button
                onClick={() => setShowSuccess(false)}
                className="mt-6 h-10 px-6 bg-[#101f1c] hover:bg-[#101f1c]/90 rounded-[10px] text-white [font-family:'Inter',Helvetica] font-normal text-sm"
              >
                Got it!
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
