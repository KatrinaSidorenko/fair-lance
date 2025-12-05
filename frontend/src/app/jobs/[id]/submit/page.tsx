"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { LandingNavbar } from "@/components/landing/navbar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle,
  Upload,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { api, Job, JobApplication, JobSubmit } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function SubmitWorkPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = Number(params.id);

  const { isAuthenticated, userRole } = useAuth();

  const [job, setJob] = useState<Job | null>(null);
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [submissions, setSubmissions] = useState<JobSubmit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || userRole !== "freelancer") {
      router.push("/login");
    }
  }, [isAuthenticated, userRole, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch job details
        const jobData = await api.getJob(jobId);
        setJob(jobData);

        // Get user's application for this job
        const applications = await api.getMyApplications();
        const myApp = applications.find(app => app.job_id === jobId && app.status === "accepted");

        if (!myApp) {
          setError("You don't have an accepted application for this job");
          return;
        }
        setApplication(myApp);

        // Fetch existing submissions
        const subs = await api.getSubmitsByApplication(myApp.id);
        setSubmissions(subs || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchData();
    }
  }, [jobId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!application) {
      setSubmitError("No application found");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const newSubmission = await api.createJobSubmit({
        application_id: application.id,
        description,
      });
      setSubmissions([...submissions, newSubmission]);
      setDescription("");
      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to submit work");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <LandingNavbar />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !job || !application) {
    return (
      <div className="min-h-screen bg-background">
        <LandingNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
            <Card className="border-destructive/50">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <h3 className="text-lg font-semibold mb-2">Error</h3>
                <p className="text-muted-foreground">{error || "Unable to submit work for this job"}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>

          {/* Job Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Submit Work
            </h1>
            <p className="text-muted-foreground">
              Job: <span className="font-medium text-foreground">{job.title}</span>
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="text-green-600 font-semibold">{job.budget} {job.currency}</span>
              <Badge className="bg-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Assigned to You
              </Badge>
            </div>
          </div>

          {/* Success Message */}
          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-600">Work submitted successfully!</p>
                <p className="text-sm text-muted-foreground">
                  The employer will review your submission.
                </p>
              </div>
            </div>
          )}

          {/* Submit Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                New Submission
              </CardTitle>
              <CardDescription>
                Describe the work you've completed. Be specific about what you've delivered.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {submitError && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
                    {submitError}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="description">Work Description *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what you've completed, include links to deliverables, repositories, or any relevant documentation..."
                    rows={6}
                    required
                    disabled={submitting}
                  />
                  <p className="text-xs text-muted-foreground">
                    Include all relevant details that the employer needs to review your work.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Submit Work
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href={`/jobs/${jobId}`}>View Job Details</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Previous Submissions */}
          {submissions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Your Submissions ({submissions.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {submissions.map((sub) => (
                  <div key={sub.id} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant="outline"
                        className={
                          sub.status === "approved"
                            ? "bg-green-500/10 text-green-600"
                            : sub.status === "rejected"
                            ? "bg-red-500/10 text-red-600"
                            : "bg-yellow-500/10 text-yellow-600"
                        }
                      >
                        {sub.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(sub.created_at)}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{sub.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
