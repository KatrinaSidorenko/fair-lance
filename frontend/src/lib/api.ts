const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8085";

export interface ApiError {
  error: string;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  role_id: number;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  role_id: number;
}

export type JobStatus = "draft" | "published" | "assigned" | "approved" | "closed";

export interface Job {
  id: number;
  title: string;
  description: string;
  status: JobStatus;
  due_date: string;
  employer_id: number;
  currency: string;
  budget: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface CreateJobRequest {
  title: string;
  description: string;
  due_date: string; // ISO8601 format (YYYY-MM-DD)
  budget: number;
  currency: string; // "ETH" or "wei"
  status?: "draft" | "published";
}

export interface CreateJobResponse {
  job_id: number;
}

export interface UpdateJobRequest {
  id: number;
  title?: string;
  description?: string;
  due_date?: string;
  budget?: number;
  currency?: string;
  status?: JobStatus;
}

export type ApplicationStatus = "pending" | "accepted" | "submitted" | "approved" | "rejected" | "closed";

export interface JobApplication {
  id: number;
  job_id: number;
  freelancer_id: number;
  freelancer_address: string;
  cover_letter: string;
  status: ApplicationStatus;
}

export interface CreateJobApplicationRequest {
  job_id: number;
  freelancer_address: string;
  cover_letter: string;
}

export interface JobSubmit {
  id: number;
  application_id: number;
  description: string;
  status: string;
  created_at: string;
}

export interface CreateJobSubmitRequest {
  application_id: number;
  description: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options?.headers,
    };

    if (token) {
      (headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        error: "Unknown Error",
        message: "An unexpected error occurred",
      }));
      throw new Error(error.message || error.error || "Request failed");
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // ============ User endpoints ============
  async login(data: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>("/users/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async signup(data: SignupRequest): Promise<UserResponse> {
    return this.request<UserResponse>("/users/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getMe(): Promise<UserResponse> {
    return this.request<UserResponse>("/users/me", {
      method: "GET",
    });
  }

  async getAllUsers(): Promise<UserResponse[]> {
    return this.request<UserResponse[]>("/users/all", {
      method: "GET",
    });
  }

  // ============ Job endpoints ============
  async getPublishedJobs(): Promise<Job[]> {
    return this.request<Job[]>("/jobs/published", {
      method: "GET",
    });
  }

  async getUserJobs(): Promise<Job[]> {
    return this.request<Job[]>("/jobs", {
      method: "GET",
    });
  }

  async getJob(jobId: number): Promise<Job> {
    return this.request<Job>(`/jobs/${jobId}`, {
      method: "GET",
    });
  }

  async createJob(data: CreateJobRequest): Promise<CreateJobResponse> {
    return this.request<CreateJobResponse>("/jobs", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateJob(data: UpdateJobRequest): Promise<{ message: string }> {
    return this.request<{ message: string }>("/jobs", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteJob(jobId: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/jobs/${jobId}`, {
      method: "DELETE",
    });
  }

  // ============ Job Application endpoints ============
  // Note: Backend uses /jobapplications (no underscore)
  async createJobApplication(
    data: CreateJobApplicationRequest,
  ): Promise<JobApplication> {
    return this.request<JobApplication>("/jobapplications", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getJobApplication(id: number): Promise<JobApplication> {
    return this.request<JobApplication>(`/jobapplications/${id}`, {
      method: "GET",
    });
  }

  async getMyApplications(): Promise<JobApplication[]> {
    return this.request<JobApplication[]>("/jobapplications", {
      method: "GET",
    });
  }

  async getJobApplicationsByJob(jobId: number): Promise<JobApplication[]> {
    return this.request<JobApplication[]>(`/jobapplications/job/${jobId}`, {
      method: "GET",
    });
  }

  // ============ Job Submit endpoints ============
  async createJobSubmit(data: CreateJobSubmitRequest): Promise<JobSubmit> {
    return this.request<JobSubmit>("/jobsubmits", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getJobSubmit(id: number): Promise<JobSubmit> {
    return this.request<JobSubmit>(`/jobsubmits/${id}`, {
      method: "GET",
    });
  }

  async getSubmitsByApplication(applicationId: number): Promise<JobSubmit[]> {
    return this.request<JobSubmit[]>(`/jobsubmits/application/${applicationId}`, {
      method: "GET",
    });
  }

  async getSubmitsByJob(jobId: number): Promise<JobSubmit[]> {
    return this.request<JobSubmit[]>(`/jobsubmits/job/${jobId}`, {
      method: "GET",
    });
  }

  // Accept a job application (employer only)
//   async acceptApplication(applicationId: number): Promise<{ message: string }> {
//     return this.request<{ message: string }>(`/jobapplications/${applicationId}/accept`, {
//       method: "PUT",
//     });
//   }

  // Reject a job application (employer only)
  async rejectApplication(applicationId: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/jobapplications/${applicationId}/reject`, {
      method: "PUT",
    });
  }

  // Approve a job submission (employer only)
  async approveSubmission(submitId: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/jobsubmits/${submitId}/approve`, {
      method: "PUT",
    });
  }
}

export const api = new ApiClient(API_BASE_URL);
