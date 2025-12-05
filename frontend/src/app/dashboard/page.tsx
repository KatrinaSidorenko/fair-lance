"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Clock,
  CheckCircle2,
  Lock,
  Upload,
  DollarSign,
  Loader2,
  AlertCircle,
  FileText,
  Eye,
  Trash2,
  Send,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { api, Job, JobApplication } from "@/lib/api";
import { useAccount } from "wagmi";
import { usePublishJob, useWithdraw, useGetJobDetails } from "@/lib/web3/hooks";

function calculateDeadline(dueDate: string): string {
  const now = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Overdue";
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  return `${diffDays} days`;
}

function getStatusBadge(status: string) {
  switch (status) {
    case "draft":
      return <Badge variant="outline">Draft</Badge>;
    case "published":
      return <Badge className="bg-blue-500">Published</Badge>;
    case "assigned":
      return <Badge className="bg-yellow-500">In Progress</Badge>;
    case "approved":
      return <Badge className="bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />Completed</Badge>;
    case "closed":
      return <Badge variant="secondary">Closed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, userRole } = useAuth();
  const { address, isConnected } = useAccount();

  // Employer state
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState<string | null>(null);

  // Freelancer state
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [applicationsError, setApplicationsError] = useState<string | null>(null);

  // Jobs associated with applications (for freelancers)
  const [applicationJobs, setApplicationJobs] = useState<Map<number, Job>>(new Map());

  // Blockchain publishing state
  const [publishingJobId, setPublishingJobId] = useState<number | null>(null);
  const {
    publishJob: publishJobToChain,
    isPending: isPublishPending,
    isConfirming: isPublishConfirming,
    isConfirmed: isPublishConfirmed,
    error: publishError,
    reset: resetPublish,
  } = usePublishJob();

  // Freelancer withdraw state
  const [withdrawingJobId, setWithdrawingJobId] = useState<number | null>(null);
  const {
    withdraw: withdrawFromChain,
    isPending: isWithdrawPending,
    isConfirming: isWithdrawConfirming,
    isConfirmed: isWithdrawConfirmed,
    error: withdrawError,
    reset: resetWithdraw,
  } = useWithdraw();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Fetch data based on user role
  useEffect(() => {
    if (!isAuthenticated || !userRole) return;

    const fetchData = async () => {
      if (userRole === "employer" || userRole === "admin") {
        try {
          setJobsLoading(true);
          const data = await api.getUserJobs();
          setJobs(data || []);
        } catch (err) {
          setJobsError(err instanceof Error ? err.message : "Failed to fetch jobs");
        } finally {
          setJobsLoading(false);
        }
      }

      if (userRole === "freelancer" || userRole === "admin") {
        try {
          setApplicationsLoading(true);
          const data = await api.getMyApplications();
          setApplications(data || []);

          // Fetch job details for each application
          const jobsMap = new Map<number, Job>();
          for (const app of data || []) {
            if (!jobsMap.has(app.job_id)) {
              try {
                const job = await api.getJob(app.job_id);
                jobsMap.set(app.job_id, job);
              } catch (e) {
                console.error(`Failed to fetch job ${app.job_id}:`, e);
              }
            }
          }
          setApplicationJobs(jobsMap);
        } catch (err) {
          setApplicationsError(err instanceof Error ? err.message : "Failed to fetch applications");
        } finally {
          setApplicationsLoading(false);
        }
      }
    };

    fetchData();
  }, [isAuthenticated, userRole]);

  // Handle blockchain publish confirmation
  useEffect(() => {
    if (isPublishConfirmed && publishingJobId) {
      const completePublish = async () => {
        try {
          await api.updateJob({ id: publishingJobId, status: "published" });
          setJobs(jobs.map(j => j.id === publishingJobId ? { ...j, status: "published" } : j));
        } catch (err) {
          console.error("Failed to update job status:", err);
        } finally {
          setPublishingJobId(null);
          resetPublish();
        }
      };
      completePublish();
    }
  }, [isPublishConfirmed, publishingJobId, jobs, resetPublish]);

  // Handle withdraw confirmation
  useEffect(() => {
    if (isWithdrawConfirmed && withdrawingJobId) {
      setWithdrawingJobId(null);
      resetWithdraw();
      // Refresh applications to update UI
      const refreshApplications = async () => {
        try {
          const data = await api.getMyApplications();
          setApplications(data || []);
        } catch (err) {
          console.error("Failed to refresh applications:", err);
        }
      };
      refreshApplications();
    }
  }, [isWithdrawConfirmed, withdrawingJobId, resetWithdraw]);

  const handleDeleteJob = async (jobId: number) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      await api.deleteJob(jobId);
      setJobs(jobs.filter(j => j.id !== jobId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete job");
    }
  };

  const handlePublishJob = async (job: Job) => {
    if (!isConnected) {
      alert("Please connect your wallet to publish jobs with escrow funding");
      return;
    }

    setPublishingJobId(job.id);
    // Publish to blockchain with escrow amount
    publishJobToChain(job.id, job.budget.toString());
  };

  const handleWithdraw = async (jobId: number) => {
    if (!isConnected) {
      alert("Please connect your wallet to withdraw funds");
      return;
    }

    setWithdrawingJobId(jobId);
    withdrawFromChain(jobId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Filter jobs by status for employer view
  const draftJobs = jobs.filter(j => j.status === "draft");
  const activeJobs = jobs.filter(j => ["published", "assigned"].includes(j.status));
  const completedJobs = jobs.filter(j => ["approved", "closed"].includes(j.status));

  // Filter applications by status for freelancer view
  const pendingApplications = applications.filter(a => a.status === "pending");
  const acceptedApplications = applications.filter(a => a.status === "accepted");

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          {(userRole === "employer" || userRole === "admin") && (
            <div className="ml-auto mr-4">
              <Button asChild>
                <Link href="/jobs/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Job
                </Link>
              </Button>
            </div>
          )}
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground mb-6">
              {userRole === "employer" ? "Manage your posted jobs" :
               userRole === "freelancer" ? "Track your job applications" :
               "Manage jobs and applications"}
            </p>
          </div>

          {/* Employer View */}
          {(userRole === "employer" || userRole === "admin") && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Your Jobs</h2>

              {/* Wallet Connection Notice */}
              {!isConnected && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-3">
                  <Wallet className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-600">Wallet not connected</p>
                    <p className="text-sm text-muted-foreground">
                      Connect your wallet to publish jobs with escrow funding on the blockchain.
                    </p>
                  </div>
                </div>
              )}

              {/* Blockchain Transaction Status */}
              {(isPublishPending || isPublishConfirming) && publishingJobId && (
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg flex items-start gap-3">
                  <Loader2 className="h-5 w-5 text-primary mt-0.5 animate-spin" />
                  <div>
                    <p className="font-medium text-primary">
                      {isPublishPending ? "Waiting for wallet confirmation..." : "Confirming transaction..."}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Publishing job to blockchain and funding escrow. Please confirm the transaction in your wallet.
                    </p>
                  </div>
                </div>
              )}

              {/* Publish Error */}
              {publishError && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                  <div>
                    <p className="font-medium text-destructive">Failed to publish job</p>
                    <p className="text-sm text-destructive/80">
                      {publishError instanceof Error ? publishError.message : "Transaction failed"}
                    </p>
                  </div>
                </div>
              )}

              {jobsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Loading jobs...</span>
                </div>
              ) : jobsError ? (
                <div className="flex items-center gap-2 p-4 bg-destructive/10 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <p className="text-destructive">{jobsError}</p>
                </div>
              ) : jobs.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No jobs yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first job to get started</p>
                    <Button asChild>
                      <Link href="/jobs/create">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Job
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Tabs defaultValue="active" className="w-full">
                  <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="drafts">
                      Drafts ({draftJobs.length})
                    </TabsTrigger>
                    <TabsTrigger value="active">
                      Active ({activeJobs.length})
                    </TabsTrigger>
                    <TabsTrigger value="completed">
                      Completed ({completedJobs.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="drafts" className="space-y-4 mt-4">
                    {draftJobs.length === 0 ? (
                      <p className="text-center py-8 text-muted-foreground">No draft jobs</p>
                    ) : (
                      draftJobs.map((job) => (
                        <Card key={job.id}>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle>{job.title}</CardTitle>
                                <CardDescription className="mt-1">
                                  {getStatusBadge(job.status)}
                                </CardDescription>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-green-600">
                                  {job.budget} {job.currency}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  Due: {calculateDeadline(job.due_date)}
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {job.description}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handlePublishJob(job)}
                                disabled={!isConnected || publishingJobId === job.id || isPublishPending || isPublishConfirming}
                              >
                                {publishingJobId === job.id ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                    {isPublishPending ? "Confirm..." : "Publishing..."}
                                  </>
                                ) : (
                                  <>
                                    <Send className="h-4 w-4 mr-1" />
                                    Publish ({job.budget} ETH)
                                  </>
                                )}
                              </Button>
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/jobs/${job.id}/edit`}>Edit</Link>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteJob(job.id)}
                                disabled={publishingJobId === job.id}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="active" className="space-y-4 mt-4">
                    {activeJobs.length === 0 ? (
                      <p className="text-center py-8 text-muted-foreground">No active jobs</p>
                    ) : (
                      activeJobs.map((job) => (
                        <Card key={job.id}>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle>{job.title}</CardTitle>
                                <CardDescription className="mt-2 space-y-1">
                                  <div className="flex items-center gap-2">
                                    {getStatusBadge(job.status)}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-3 w-3" />
                                    <span className="text-xs">
                                      {calculateDeadline(job.due_date)} remaining
                                    </span>
                                  </div>
                                </CardDescription>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-green-600 mb-2">
                                  {job.budget} {job.currency}
                                </div>
                                {job.status === "assigned" && (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Lock className="h-3 w-3 text-primary" />
                                    <span>Funds Locked</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/jobs/${job.id}`}>
                                  <Eye className="h-4 w-4 mr-1" />
                                  View Details
                                </Link>
                              </Button>
                              {job.status === "published" && (
                                <Button size="sm" variant="outline" asChild>
                                  <Link href={`/jobs/${job.id}/applications`}>
                                    View Applications
                                  </Link>
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="completed" className="space-y-4 mt-4">
                    {completedJobs.length === 0 ? (
                      <p className="text-center py-8 text-muted-foreground">No completed jobs</p>
                    ) : (
                      completedJobs.map((job) => (
                        <Card key={job.id}>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle>{job.title}</CardTitle>
                                <CardDescription className="mt-1">
                                  {getStatusBadge(job.status)}
                                </CardDescription>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-green-600">
                                  {job.budget} {job.currency}
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/jobs/${job.id}`}>View Details</Link>
                            </Button>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </div>
          )}

          {/* Freelancer View */}
          {(userRole === "freelancer" || userRole === "admin") && (
            <div className="space-y-4 mt-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Your Applications</h2>
                <Button asChild variant="outline">
                  <Link href="/jobs">Browse Jobs</Link>
                </Button>
              </div>

              {applicationsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Loading applications...</span>
                </div>
              ) : applicationsError ? (
                <div className="flex items-center gap-2 p-4 bg-destructive/10 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <p className="text-destructive">{applicationsError}</p>
                </div>
              ) : applications.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
                    <p className="text-muted-foreground mb-4">Browse available jobs and apply!</p>
                    <Button asChild>
                      <Link href="/jobs">Browse Jobs</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Tabs defaultValue="pending" className="w-full">
                  <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="pending">
                      Pending ({pendingApplications.length})
                    </TabsTrigger>
                    <TabsTrigger value="accepted">
                      Accepted ({acceptedApplications.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="pending" className="space-y-4 mt-4">
                    {pendingApplications.length === 0 ? (
                      <p className="text-center py-8 text-muted-foreground">No pending applications</p>
                    ) : (
                      pendingApplications.map((app) => {
                        const job = applicationJobs.get(app.job_id);
                        return (
                          <Card key={app.id}>
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <CardTitle>{job?.title || `Job #${app.job_id}`}</CardTitle>
                                  <CardDescription className="mt-2 space-y-1">
                                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600">
                                      Pending Review
                                    </Badge>
                                    {job && (
                                      <div className="flex items-center gap-2 mt-2">
                                        <Clock className="h-3 w-3" />
                                        <span className="text-xs">
                                          {calculateDeadline(job.due_date)} until deadline
                                        </span>
                                      </div>
                                    )}
                                  </CardDescription>
                                </div>
                                {job && (
                                  <div className="text-right">
                                    <div className="flex items-center gap-1 font-semibold text-green-600">
                                      <DollarSign className="h-4 w-4" />
                                      <span>{job.budget} {job.currency}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                {app.cover_letter}
                              </p>
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/jobs/${app.job_id}`}>View Job</Link>
                              </Button>
                            </CardContent>
                          </Card>
                        );
                      })
                    )}
                  </TabsContent>

                  <TabsContent value="accepted" className="space-y-4 mt-4">
                    {acceptedApplications.length === 0 ? (
                      <p className="text-center py-8 text-muted-foreground">No accepted applications</p>
                    ) : (
                      acceptedApplications.map((app) => {
                        const job = applicationJobs.get(app.job_id);
                        return (
                          <Card key={app.id}>
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <CardTitle>{job?.title || `Job #${app.job_id}`}</CardTitle>
                                  <CardDescription className="mt-2 space-y-1">
                                    <Badge className="bg-green-600">Accepted</Badge>
                                    {job && (
                                      <div className="flex items-center gap-2 mt-2">
                                        <Clock className="h-3 w-3" />
                                        <span className="text-xs">
                                          {calculateDeadline(job.due_date)} remaining
                                        </span>
                                      </div>
                                    )}
                                  </CardDescription>
                                </div>
                                {job && (
                                  <div className="text-right">
                                    <div className="flex items-center gap-1 font-semibold text-green-600 mb-2">
                                      <DollarSign className="h-4 w-4" />
                                      <span>{job.budget} {job.currency}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <Lock className="h-3 w-3 text-primary" />
                                      <span>Funds Locked</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center gap-2">
                                <Button size="sm" className="gap-2" asChild>
                                  <Link href={`/jobs/${app.job_id}/submit`}>
                                    <Upload className="h-4 w-4" />
                                    Submit Work
                                  </Link>
                                </Button>
                                <Button size="sm" variant="outline" asChild>
                                  <Link href={`/jobs/${app.job_id}`}>View Details</Link>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })
                    )}
                  </TabsContent>
                </Tabs>
              )}

              {/* Withdraw Section */}
              {!isConnected && applications.some(a => a.status === "accepted") && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-3 mt-4">
                  <Wallet className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-600">Wallet not connected</p>
                    <p className="text-sm text-muted-foreground">
                      Connect your wallet to withdraw earnings from completed jobs.
                    </p>
                  </div>
                </div>
              )}

              {withdrawError && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3 mt-4">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                  <div>
                    <p className="font-medium text-destructive">Failed to withdraw</p>
                    <p className="text-sm text-destructive/80">
                      {withdrawError instanceof Error ? withdrawError.message : "Transaction failed"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
