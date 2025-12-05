"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { LandingNavbar } from "@/components/landing/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Clock,
  DollarSign,
  User,
  Loader2,
  AlertCircle,
  CheckCircle,
  Calendar,
  Send,
  Lock,
  Wallet,
  ExternalLink,
  Coins,
} from "lucide-react";
import Link from "next/link";
import { api, Job, JobApplication, JobSubmit } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useAccount } from "wagmi";
import {
  useGetJobDetails,
  useGetPendingWithdrawal,
  useApproveJob,
  useWithdraw,
} from "@/lib/web3/hooks";
import { formatEther } from "viem";

function getStatusBadge(status: string) {
  switch (status) {
    case "draft":
      return <Badge variant="outline">Draft</Badge>;
    case "published":
      return <Badge className="bg-blue-500">Open for Applications</Badge>;
    case "assigned":
      return <Badge className="bg-yellow-500">In Progress</Badge>;
    case "approved":
      return <Badge className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
    case "closed":
      return <Badge variant="secondary">Closed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function calculateDeadline(dueDate: string): string {
  const now = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Overdue";
  if (diffDays === 0) return "Due Today";
  if (diffDays === 1) return "Due Tomorrow";
  return `${diffDays} days remaining`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = Number(params.id);

  const { isAuthenticated, userRole, user } = useAuth();
  const { address, isConnected } = useAccount();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Application form state
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Existing application (for freelancers)
  const [existingApplication, setExistingApplication] = useState<JobApplication | null>(null);

  // Job submissions
  const [submissions, setSubmissions] = useState<JobSubmit[]>([]);

  // Blockchain state
  const { jobDetails: blockchainJob, formattedAmount, isLoading: blockchainLoading, refetch: refetchBlockchain } = useGetJobDetails(jobId);
  const { formattedAmount: pendingAmount, refetch: refetchPending } = useGetPendingWithdrawal(jobId);

  // Approve job hook (for employers)
  const {
    approveJob: approveJobOnChain,
    isPending: isApprovePending,
    isConfirming: isApproveConfirming,
    isConfirmed: isApproveConfirmed,
    error: approveError,
    reset: resetApprove,
  } = useApproveJob();

  // Withdraw hook (for freelancers)
  const {
    withdraw: withdrawOnChain,
    isPending: isWithdrawPending,
    isConfirming: isWithdrawConfirming,
    isConfirmed: isWithdrawConfirmed,
    error: withdrawError,
    reset: resetWithdraw,
  } = useWithdraw();

  // Track if we're processing approval or withdrawal
  const [isProcessingApprove, setIsProcessingApprove] = useState(false);
  const [isProcessingWithdraw, setIsProcessingWithdraw] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const data = await api.getJob(jobId);
        setJob(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load job");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  // Check if user has already applied
  useEffect(() => {
    const checkExistingApplication = async () => {
      if (!isAuthenticated || userRole !== "freelancer") return;

      try {
        const applications = await api.getMyApplications();
        const existing = applications.find(app => app.job_id === jobId);
        if (existing) {
          setExistingApplication(existing);
        }
      } catch (err) {
        console.error("Failed to check existing applications:", err);
      }
    };

    checkExistingApplication();
  }, [isAuthenticated, userRole, jobId]);

  // Fetch job submissions (for employers to review or freelancers to see their submissions)
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!isAuthenticated || !job) return;

      try {
        const subs = await api.getSubmitsByJob(jobId);
        setSubmissions(subs || []);
      } catch (err) {
        console.error("Failed to fetch submissions:", err);
      }
    };

    fetchSubmissions();
  }, [isAuthenticated, job, jobId]);

  // Handle approve confirmation
  useEffect(() => {
    if (isApproveConfirmed && isProcessingApprove) {
      const completeApproval = async () => {
        try {
          // Update backend status
          await api.updateJob({ id: jobId, status: "approved" });
          const updatedJob = await api.getJob(jobId);
          setJob(updatedJob);
          refetchBlockchain();
          refetchPending();
        } catch (err) {
          console.error("Failed to update job status:", err);
        } finally {
          setIsProcessingApprove(false);
          resetApprove();
        }
      };
      completeApproval();
    }
  }, [isApproveConfirmed, isProcessingApprove, jobId, refetchBlockchain, refetchPending, resetApprove]);

  // Handle withdraw confirmation
  useEffect(() => {
    if (isWithdrawConfirmed && isProcessingWithdraw) {
      refetchBlockchain();
      refetchPending();
      setIsProcessingWithdraw(false);
      resetWithdraw();
    }
  }, [isWithdrawConfirmed, isProcessingWithdraw, refetchBlockchain, refetchPending, resetWithdraw]);

  const handleApproveJob = () => {
    if (!isConnected) {
      setSubmitError("Please connect your wallet to approve jobs");
      return;
    }
    setIsProcessingApprove(true);
    approveJobOnChain(jobId);
  };

  const handleWithdraw = () => {
    if (!isConnected) {
      setSubmitError("Please connect your wallet to withdraw funds");
      return;
    }
    setIsProcessingWithdraw(true);
    withdrawOnChain(jobId);
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !address) {
      setSubmitError("Please connect your wallet first");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      await api.createJobApplication({
        job_id: jobId,
        freelancer_address: address,
        cover_letter: coverLetter,
      });
      setSubmitSuccess(true);
      setShowApplicationForm(false);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to submit application");
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
          <span className="ml-2 text-muted-foreground">Loading job details...</span>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-background">
        <LandingNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/jobs"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Jobs
            </Link>
            <Card className="border-destructive/50">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <h3 className="text-lg font-semibold mb-2">Job Not Found</h3>
                <p className="text-muted-foreground">{error || "This job doesn't exist or has been removed."}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const canApply =
    isAuthenticated &&
    userRole === "freelancer" &&
    job.status === "published" &&
    !existingApplication &&
    !submitSuccess;

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/jobs"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Jobs
          </Link>

          {/* Job Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                  {job.title}
                </h1>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>Employer #{job.employer_id}</span>
                  </div>
                  {getStatusBadge(job.status)}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-2xl font-bold text-green-600">
                  <DollarSign className="h-6 w-6" />
                  {job.budget} {job.currency}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Due: {formatDateTime(job.due_date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className={job.status === "published" ? "text-yellow-600 font-medium" : ""}>
                  {calculateDeadline(job.due_date)}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-muted-foreground">
                    {job.description}
                  </p>
                </CardContent>
              </Card>

              {/* Application Form */}
              {showApplicationForm && (
                <Card className="border-primary/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="h-5 w-5 text-primary" />
                      Apply for this Job
                    </CardTitle>
                    <CardDescription>
                      Tell the employer why you&apos;re the right fit for this job.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleApply} className="space-y-4">
                      {submitError && (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
                          {submitError}
                        </div>
                      )}

                      {!isConnected && (
                        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md text-sm text-yellow-600">
                          Please connect your wallet to apply for this job.
                        </div>
                      )}

                      {isConnected && (
                        <div className="p-3 bg-muted rounded-md">
                          <Label className="text-xs text-muted-foreground">Your Wallet Address</Label>
                          <p className="font-mono text-sm">{address}</p>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="cover_letter">Cover Letter *</Label>
                        <Textarea
                          id="cover_letter"
                          value={coverLetter}
                          onChange={(e) => setCoverLetter(e.target.value)}
                          placeholder="Describe your relevant experience, why you're interested in this job, and how you plan to approach it..."
                          rows={6}
                          required
                          disabled={submitting || !isConnected}
                        />
                      </div>

                      <div className="flex gap-3">
                        <Button
                          type="submit"
                          disabled={submitting || !isConnected}
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            "Submit Application"
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowApplicationForm(false)}
                          disabled={submitting}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Action Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Take Action</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isAuthenticated ? (
                    <div className="text-center space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Sign in to apply for this job
                      </p>
                      <Button asChild className="w-full">
                        <Link href="/login">Sign In</Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/signup">Create Account</Link>
                      </Button>
                    </div>
                  ) : userRole === "employer" ? (
                    <p className="text-sm text-muted-foreground text-center">
                      You&apos;re viewing this as an employer. Switch to a freelancer account to apply.
                    </p>
                  ) : existingApplication ? (
                    <div className="text-center space-y-3">
                      <div className="p-3 bg-green-500/10 rounded-md">
                        <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-green-600">
                          Application Submitted
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Status: {existingApplication.status}
                        </p>
                      </div>
                    </div>
                  ) : submitSuccess ? (
                    <div className="text-center space-y-3">
                      <div className="p-3 bg-green-500/10 rounded-md">
                        <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-green-600">
                          Application Submitted Successfully!
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          The employer will review your application soon.
                        </p>
                      </div>
                    </div>
                  ) : job.status !== "published" ? (
                    <p className="text-sm text-muted-foreground text-center">
                      This job is not accepting applications.
                    </p>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => setShowApplicationForm(true)}
                      disabled={showApplicationForm}
                    >
                      Apply Now
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Job Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Budget</p>
                    <p className="font-semibold text-green-600">{job.budget} {job.currency}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Deadline</p>
                    <p className="font-medium">{formatDateTime(job.due_date)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    {getStatusBadge(job.status)}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Posted</p>
                    <p className="text-sm">{formatDate(job.created_at)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Blockchain Status Card */}
              {blockchainJob && (
                <Card className="border-primary/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Lock className="h-4 w-4 text-primary" />
                      Smart Contract
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Escrow</span>
                      {blockchainJob.funded ? (
                        <Badge className="bg-green-600">
                          <Coins className="h-3 w-3 mr-1" />
                          {formattedAmount} ETH
                        </Badge>
                      ) : (
                        <Badge variant="outline">Not Funded</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Approved</span>
                      {blockchainJob.approved ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <span className="text-xs text-muted-foreground">Pending</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Completed</span>
                      {blockchainJob.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <span className="text-xs text-muted-foreground">In Progress</span>
                      )}
                    </div>
                    {blockchainJob.freelancer !== "0x0000000000000000000000000000000000000000" && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Freelancer</p>
                        <code className="text-xs bg-muted px-2 py-0.5 rounded block truncate">
                          {blockchainJob.freelancer}
                        </code>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Employer Actions */}
              {isAuthenticated && userRole === "employer" && job.status === "assigned" && submissions.length > 0 && (
                <Card className="border-green-500/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Approve Work</CardTitle>
                    <CardDescription>
                      Review submissions and approve to release payment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {!isConnected && (
                      <div className="p-2 bg-yellow-500/10 rounded text-xs text-yellow-600 flex items-center gap-2">
                        <Wallet className="h-3 w-3" />
                        Connect wallet to approve
                      </div>
                    )}

                    {approveError && (
                      <div className="p-2 bg-destructive/10 rounded text-xs text-destructive">
                        {approveError instanceof Error ? approveError.message : "Approval failed"}
                      </div>
                    )}

                    <Button
                      className="w-full"
                      onClick={handleApproveJob}
                      disabled={!isConnected || isApprovePending || isApproveConfirming}
                    >
                      {isApprovePending || isApproveConfirming ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {isApprovePending ? "Confirm in Wallet..." : "Processing..."}
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve & Release Payment
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Freelancer Withdraw */}
              {isAuthenticated && userRole === "freelancer" && existingApplication?.status === "accepted" && blockchainJob?.approved && !blockchainJob?.completed && (
                <Card className="border-green-500/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Coins className="h-4 w-4 text-green-600" />
                      Withdraw Payment
                    </CardTitle>
                    <CardDescription>
                      Your work has been approved! Withdraw your earnings.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {!isConnected && (
                      <div className="p-2 bg-yellow-500/10 rounded text-xs text-yellow-600 flex items-center gap-2">
                        <Wallet className="h-3 w-3" />
                        Connect wallet to withdraw
                      </div>
                    )}

                    <div className="p-3 bg-green-500/10 rounded-md">
                      <p className="text-xs text-muted-foreground">Available to withdraw</p>
                      <p className="text-lg font-bold text-green-600">{pendingAmount} ETH</p>
                    </div>

                    {withdrawError && (
                      <div className="p-2 bg-destructive/10 rounded text-xs text-destructive">
                        {withdrawError instanceof Error ? withdrawError.message : "Withdrawal failed"}
                      </div>
                    )}

                    <Button
                      className="w-full"
                      onClick={handleWithdraw}
                      disabled={!isConnected || isWithdrawPending || isWithdrawConfirming}
                    >
                      {isWithdrawPending || isWithdrawConfirming ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {isWithdrawPending ? "Confirm in Wallet..." : "Processing..."}
                        </>
                      ) : (
                        <>
                          <Coins className="h-4 w-4 mr-2" />
                          Withdraw {pendingAmount} ETH
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Submissions Section */}
              {submissions.length > 0 && (isAuthenticated && (userRole === "employer" || (userRole === "freelancer" && existingApplication?.status === "accepted"))) && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Work Submissions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {submissions.map((sub) => (
                      <div key={sub.id} className="p-3 bg-muted/50 rounded-md">
                        <div className="flex items-center justify-between mb-1">
                          <Badge variant="outline" className="text-xs">
                            {sub.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(sub.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {sub.description}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
