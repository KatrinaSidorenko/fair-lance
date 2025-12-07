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
} from "lucide-react";
import Link from "next/link";
import { api, Job, JobApplication } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useAccount } from "wagmi";
import { useAssignFreelancer, useGetJobDetails } from "@/lib/web3/hooks";

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function JobApplicationsPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = Number(params.id);

  const { isAuthenticated, userRole } = useAuth();
  const { address, isConnected } = useAccount();

  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Blockchain hooks
  const { jobDetails: blockchainJob, refetch: refetchBlockchain } = useGetJobDetails(jobId);
  const {
    assignFreelancer,
    isPending: isAssigning,
    isConfirming: isConfirmingAssign,
    isConfirmed: isAssignConfirmed,
    error: assignError,
    reset: resetAssign,
  } = useAssignFreelancer();

  // Track which application is being processed for blockchain
  const [pendingBlockchainApp, setPendingBlockchainApp] = useState<JobApplication | null>(null);

  useEffect(() => {
    if (!isAuthenticated || (userRole !== "employer" && userRole !== "admin")) {
      router.push("/login");
    }
  }, [isAuthenticated, userRole, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [jobData, applicationsData] = await Promise.all([
          api.getJob(jobId),
          api.getJobApplicationsByJob(jobId),
        ]);
        setJob(jobData);
        setApplications(applicationsData || []);
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
    if (isAssignConfirmed && pendingBlockchainApp) {
      // Update backend after blockchain confirmation
      const completeAcceptance = async () => {
        try {
          //await api.acceptApplication(pendingBlockchainApp.id);
          setApplications(apps =>
            apps.map(a =>
              a.id === pendingBlockchainApp.id ? { ...a, status: "accepted" } : a
            )
          );
          // Refetch job to update status
          const updatedJob = await api.getJob(jobId);
          setJob(updatedJob);
          refetchBlockchain();
        } catch (err) {
          setActionError(err instanceof Error ? err.message : "Failed to update application status");
        } finally {
          setProcessingId(null);
          setPendingBlockchainApp(null);
          resetAssign();
        }
      };
      completeAcceptance();
    }
  }, [isAssignConfirmed, pendingBlockchainApp, jobId, refetchBlockchain, resetAssign]);

  const handleAccept = async (application: JobApplication) => {
    if (!isConnected) {
      setActionError("Please connect your wallet to accept applications");
      return;
    }

    if (!application.freelancer_address || !application.freelancer_address.startsWith("0x")) {
      setActionError("Invalid freelancer wallet address");
      return;
    }

    setProcessingId(application.id);
    setActionError(null);
    setPendingBlockchainApp(application);

    // Trigger blockchain transaction to assign freelancer
    assignFreelancer(jobId, application.freelancer_address as `0x${string}`);
  };

  const handleReject = async (applicationId: number) => {
    setProcessingId(applicationId);
    setActionError(null);

    try {
      await api.rejectApplication(applicationId);
      setApplications(apps =>
        apps.map(a =>
          a.id === applicationId ? { ...a, status: "rejected" } : a
        )
      );
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to reject application");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <LandingNavbar />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading applications...</span>
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

  const pendingApplications = applications.filter(a => a.status === "pending");
  const processedApplications = applications.filter(a => a.status !== "pending");

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
              Applications for: {job.title}
            </h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span className="text-green-600 font-semibold">{job.budget} {job.currency}</span>
              <span>•</span>
              <span>{applications.length} application{applications.length !== 1 ? "s" : ""}</span>
            </div>
          </div>

          {/* Wallet Connection Warning */}
          {!isConnected && (
            <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-3">
              <Wallet className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-600">Wallet not connected</p>
                <p className="text-sm text-muted-foreground">
                  Connect your wallet to accept applications. Accepting an application will assign the freelancer on the blockchain.
                </p>
              </div>
            </div>
          )}

          {/* Blockchain State */}
          {blockchainJob && blockchainJob.funded && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-600">Escrow Funded</p>
                <p className="text-sm text-muted-foreground">
                  This job has {blockchainJob.amount.toString()} wei locked in escrow.
                </p>
              </div>
            </div>
          )}

          {/* Action Error */}
          {(actionError || assignError) && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <p className="font-medium text-destructive">Error</p>
                <p className="text-sm text-destructive/80">
                  {actionError || (assignError instanceof Error ? assignError.message : "Transaction failed")}
                </p>
              </div>
            </div>
          )}

          {/* Blockchain Transaction Status */}
          {(isAssigning || isConfirmingAssign) && pendingBlockchainApp && (
            <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg flex items-start gap-3">
              <Loader2 className="h-5 w-5 text-primary mt-0.5 animate-spin" />
              <div>
                <p className="font-medium text-primary">
                  {isAssigning ? "Waiting for wallet confirmation..." : "Confirming transaction..."}
                </p>
                <p className="text-sm text-muted-foreground">
                  Assigning freelancer to job on the blockchain. Please confirm the transaction in your wallet.
                </p>
              </div>
            </div>
          )}

          {/* Pending Applications */}
          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              Pending Applications ({pendingApplications.length})
            </h2>

            {pendingApplications.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No pending applications
                </CardContent>
              </Card>
            ) : (
              pendingApplications.map((app) => (
                <Card key={app.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <User className="h-4 w-4" />
                          Freelancer #{app.freelancer_id}
                        </CardTitle>
                        <CardDescription className="mt-1 flex items-center gap-2">
                          <Wallet className="h-3 w-3" />
                          <code className="text-xs bg-muted px-2 py-0.5 rounded">
                            {app.freelancer_address}
                          </code>
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600">
                        Pending
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Cover Letter</p>
                      <p className="text-sm bg-muted/50 p-3 rounded-md whitespace-pre-wrap">
                        {app.cover_letter}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAccept(app)}
                        disabled={processingId === app.id || !isConnected || isAssigning || isConfirmingAssign}
                      >
                        {processingId === app.id && (isAssigning || isConfirmingAssign) ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            {isAssigning ? "Confirming..." : "Processing..."}
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Accept & Assign
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(app.id)}
                        disabled={processingId === app.id}
                      >
                        {processingId === app.id && !isAssigning && !isConfirmingAssign ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <XCircle className="h-4 w-4 mr-1" />
                        )}
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Processed Applications */}
          {processedApplications.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Processed Applications ({processedApplications.length})
              </h2>

              {processedApplications.map((app) => (
                <Card key={app.id} className="opacity-75">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <User className="h-4 w-4" />
                          Freelancer #{app.freelancer_id}
                        </CardTitle>
                        <CardDescription className="mt-1 flex items-center gap-2">
                          <Wallet className="h-3 w-3" />
                          <code className="text-xs bg-muted px-2 py-0.5 rounded">
                            {app.freelancer_address}
                          </code>
                        </CardDescription>
                      </div>
                      <Badge
                        className={
                          app.status === "accepted"
                            ? "bg-green-600"
                            : "bg-red-500"
                        }
                      >
                        {app.status === "accepted" ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Accepted
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Rejected
                          </>
                        )}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {app.cover_letter}
                    </p>
                    {app.status === "accepted" && (
                      <Button size="sm" asChild>
                        <Link href={`/jobs/${jobId}/submissions`}>
                          <FileText className="h-4 w-4 mr-1" />
                          Review Submissions
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
