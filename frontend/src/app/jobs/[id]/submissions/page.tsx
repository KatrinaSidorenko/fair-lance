"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { LandingNavbar } from "@/components/landing/navbar";
import { Button } from "@/components/ui/button";
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
  XCircle,
  User,
  Wallet,
  FileText,
  Clock,
  Coins,
} from "lucide-react";
import Link from "next/link";
import { api, Job, JobApplication, JobSubmit } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useAccount } from "wagmi";
import { useApproveJob, useGetJobDetails } from "@/lib/web3/hooks";

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function JobSubmissionsPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = Number(params.id);

  const { isAuthenticated, userRole } = useAuth();
  const { isConnected } = useAccount();

  const [job, setJob] = useState<Job | null>(null);
  const [submissions, setSubmissions] = useState<JobSubmit[]>([]);
  const [acceptedApplication, setAcceptedApplication] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Blockchain hooks
  const { jobDetails: blockchainJob, formattedAmount, refetch: refetchBlockchain } = useGetJobDetails(jobId);
  const {
    approveJob,
    isPending: isApproving,
    isConfirming: isConfirmingApprove,
    isConfirmed: isApproveConfirmed,
    error: approveError,
    reset: resetApprove,
  } = useApproveJob();

  // Track blockchain approval
  const [pendingApproval, setPendingApproval] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || (userRole !== "employer" && userRole !== "admin")) {
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

        // Fetch applications to find the accepted one
        const applications = await api.getJobApplicationsByJob(jobId);
        const accepted = applications?.find(app => app.status === "accepted");
        setAcceptedApplication(accepted || null);

        // Fetch submissions
        const subs = await api.getSubmitsByJob(jobId);
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

  // Handle blockchain confirmation
  useEffect(() => {
    if (isApproveConfirmed && pendingApproval) {
      const completeApproval = async () => {
        try {
          // Update backend status
          await api.updateJob({ id: jobId, status: "approved" });
          const updatedJob = await api.getJob(jobId);
          setJob(updatedJob);
          refetchBlockchain();
          setActionSuccess("Job approved successfully! Payment has been released to the freelancer.");
        } catch (err) {
          setActionError(err instanceof Error ? err.message : "Failed to update job status");
        } finally {
          setPendingApproval(false);
          resetApprove();
        }
      };
      completeApproval();
    }
  }, [isApproveConfirmed, pendingApproval, jobId, refetchBlockchain, resetApprove]);

  const handleApprove = async () => {
    if (!isConnected) {
      setActionError("Please connect your wallet to approve the job");
      return;
    }

    setActionError(null);
    setActionSuccess(null);
    setPendingApproval(true);

    // Trigger blockchain transaction
    approveJob(jobId);
  };

  const handleRequestRevision = async (_submissionId: number) => {
    setActionError(null);
    setActionSuccess(null);

    try {
      // For now, just show a message - in the future this could update submission status
      setActionSuccess("Revision requested. The freelancer will be notified to submit updated work.");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to request revision");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <LandingNavbar />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading submissions...</span>
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
                <p className="text-muted-foreground">{error || "Failed to load job"}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const isJobApproved = job.status === "approved" || blockchainJob?.approved;
  const canApprove = job.status === "assigned" && submissions.length > 0 && !isJobApproved;

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
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
              Review Submissions
            </h1>
            <p className="text-muted-foreground mb-2">
              Job: <Link href={`/jobs/${jobId}`} className="font-medium text-foreground hover:underline">{job.title}</Link>
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-green-600 font-semibold">{job.budget} {job.currency}</span>
              <Badge
                className={
                  job.status === "approved"
                    ? "bg-green-600"
                    : job.status === "assigned"
                    ? "bg-yellow-500"
                    : "bg-blue-500"
                }
              >
                {job.status === "approved" ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Approved
                  </>
                ) : job.status === "assigned" ? (
                  "In Progress"
                ) : (
                  job.status
                )}
              </Badge>
              <span className="text-muted-foreground">
                {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Wallet Connection Warning */}
          {!isConnected && !isJobApproved && (
            <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-3">
              <Wallet className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-600">Wallet not connected</p>
                <p className="text-sm text-muted-foreground">
                  Connect your wallet to approve the job and release payment to the freelancer.
                </p>
              </div>
            </div>
          )}

          {/* Blockchain State */}
          {blockchainJob && blockchainJob.funded && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
              <Coins className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-600">
                  {isJobApproved ? "Payment Released" : "Escrow Funded"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isJobApproved
                    ? `${formattedAmount} ETH has been released to the freelancer.`
                    : `${formattedAmount} ETH is locked in escrow. Approve to release payment.`
                  }
                </p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {actionSuccess && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-600">Success</p>
                <p className="text-sm text-muted-foreground">{actionSuccess}</p>
              </div>
            </div>
          )}

          {/* Action Error */}
          {(actionError || approveError) && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <p className="font-medium text-destructive">Error</p>
                <p className="text-sm text-destructive/80">
                  {actionError || (approveError instanceof Error ? approveError.message : "Transaction failed")}
                </p>
              </div>
            </div>
          )}

          {/* Blockchain Transaction Status */}
          {(isApproving || isConfirmingApprove) && (
            <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg flex items-start gap-3">
              <Loader2 className="h-5 w-5 text-primary mt-0.5 animate-spin" />
              <div>
                <p className="font-medium text-primary">
                  {isApproving ? "Waiting for wallet confirmation..." : "Confirming transaction..."}
                </p>
                <p className="text-sm text-muted-foreground">
                  Approving job and releasing payment. Please confirm the transaction in your wallet.
                </p>
              </div>
            </div>
          )}

          {/* Assigned Freelancer */}
          {acceptedApplication && (
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Assigned Freelancer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Freelancer #{acceptedApplication.freelancer_id}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Wallet className="h-3 w-3 text-muted-foreground" />
                      <code className="text-xs bg-muted px-2 py-0.5 rounded">
                        {acceptedApplication.freelancer_address}
                      </code>
                    </div>
                  </div>
                  <Badge className="bg-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Assigned
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submissions List */}
          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Submissions ({submissions.length})
            </h2>

            {submissions.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No submissions yet</p>
                  <p className="text-sm mt-1">The freelancer hasn&apos;t submitted any work yet.</p>
                </CardContent>
              </Card>
            ) : (
              submissions.map((sub, index) => (
                <Card key={sub.id} className={isJobApproved ? "opacity-75" : ""}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          Submission #{submissions.length - index}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(sub.created_at)}
                        </CardDescription>
                      </div>
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
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Work Description</p>
                      <div className="bg-muted/50 p-4 rounded-md">
                        <p className="text-sm whitespace-pre-wrap">{sub.description}</p>
                      </div>
                    </div>

                    {/* Action buttons - only show for pending submissions when job not approved */}
                    {!isJobApproved && sub.status === "pending" && (
                      <div className="flex gap-2 pt-2 border-t">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRequestRevision(sub.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Request Revision
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Approve Job Section */}
          {canApprove && (
            <Card className="border-green-500/50 bg-green-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  Approve Job & Release Payment
                </CardTitle>
                <CardDescription>
                  Once you approve, {formattedAmount} ETH will be released from escrow to the freelancer.
                  This action cannot be undone.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handleApprove}
                  disabled={!isConnected || isApproving || isConfirmingApprove}
                >
                  {isApproving || isConfirmingApprove ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      {isApproving ? "Confirm in Wallet..." : "Processing..."}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Approve & Release {formattedAmount} ETH
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Job Already Approved */}
          {isJobApproved && (
            <Card className="border-green-500/50 bg-green-500/5">
              <CardContent className="py-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-green-600 mb-1">Job Completed</h3>
                <p className="text-muted-foreground">
                  This job has been approved and payment has been released to the freelancer.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
