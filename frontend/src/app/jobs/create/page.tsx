"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LandingNavbar } from "@/components/landing/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Sparkles, AlertCircle } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { usePublishJob } from "@/lib/web3/hooks";
import { CreateJobRequest } from "@/lib/api";

export default function CreateJobPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, userRole } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    payment: "",
  });
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);

  const {
    publishJob: publishJobToChain,
    isPending: isPublishPending,
    isConfirming: isPublishConfirming,
    isConfirmed: isPublishConfirmed,
    error: publishError,
    reset: resetPublish,
  } = usePublishJob();

  // Redirect if not authenticated or not an employer
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
    if (!isLoading && isAuthenticated && userRole !== "employer" && userRole !== "admin") {
      router.push("/dashboard");
    }
  }, [isLoading, isAuthenticated, userRole, router]);

  const handleSubmit = async (e: React.FormEvent, publishImmediately: boolean = false) => {
    e.preventDefault();

    if (!deadline) {
      setError("Please select a deadline");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {

      const newJob = {
        title: formData.title,
        description: formData.description,
        due_date: deadline.toISOString(), // ISO8601 format with time
        budget: parseFloat(formData.payment),
        currency: "ETH",
        status: publishImmediately ? "published" : "draft",
      }
      const response = await api.createJob(newJob as CreateJobRequest);

      console.log("Job created with ID:", response.job_id);

      if (publishImmediately) {
        await publishJobToChain(response.job_id, formData.payment);
      }
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create job");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Don't render if not authorized
  if (!isAuthenticated || (userRole !== "employer" && userRole !== "admin")) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              Create a Job
            </h1>
            <p className="text-muted-foreground">
              Post your job to the decentralized marketplace. Payment will be
              locked in escrow when a freelancer is assigned.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <p className="font-medium text-destructive">Error creating job</p>
                <p className="text-sm text-destructive/80">{error}</p>
              </div>
            </div>
          )}

          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Job Details
              </CardTitle>
              <CardDescription>
                Fill in the information below. Be as specific as possible to
                attract the right talent.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., Build a DeFi Dashboard"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe what you need done, including any technical requirements, acceptance criteria, and deliverables..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    required
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-muted-foreground">
                    Be specific about what constitutes completed work - this will be used to verify deliverables.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-primary font-semibold">
                      Deadline *
                    </Label>
                    <DateTimePicker
                      value={deadline}
                      onChange={setDeadline}
                      minDate={new Date()}
                      disabled={isSubmitting}
                      placeholder="Select deadline date & time"
                      className="border-primary/50 focus-visible:ring-primary"
                    />
                    <p className="text-xs text-muted-foreground">
                      Select both date and time for the deadline
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="payment"
                      className="text-primary font-semibold"
                    >
                      Payment Amount (ETH) *
                    </Label>
                    <Input
                      id="payment"
                      name="payment"
                      type="number"
                      step="0.001"
                      min="0.001"
                      placeholder="e.g., 2.5"
                      value={formData.payment}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="border-primary/50 focus-visible:ring-primary"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Payment will be locked in smart contract when job is assigned
                  </p>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="outline"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save as Draft"}
                    </Button>
                    <Button
                      type="button"
                      disabled={isSubmitting}
                      className="min-w-32"
                      onClick={(e) => handleSubmit(e as any, true)}
                    >
                      {isSubmitting ? "Publishing..." : "Publish Job"}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
