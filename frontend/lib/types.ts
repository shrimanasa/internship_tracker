// lib/types.ts: Shared TypeScript interfaces for InternTrack API responses

export interface User {
  user_id: number;
  full_name: string;
  email: string;
  role: 'student' | 'admin';
  is_active: boolean;
  created_at: string;
  last_login_at: string | null;
}

export interface Department {
  department_id: number;
  department_name: string;
}

export interface Skill {
  skill_id: number;
  skill_name: string;
  skill_category: string;
}

export interface StudentSkill {
  student_skill_id: number;
  skill_id: number;
  proficiency_level: 'Beginner' | 'Intermediate' | 'Advanced';
  skill: Skill;
}

export interface StudentProfile {
  student_id: number;
  user_id: number;
  register_number: string;
  department_id: number;
  graduation_year: number;
  current_semester: number;
  cgpa: number;
  profile_completion_percentage: number;
  phone?: string;
  linkedin_url?: string;
  github_username?: string;
  portfolio_url?: string;
  bio?: string;
  skills: StudentSkill[];
  department?: Department;
}

export interface Company {
  company_id: number;
  company_name: string;
  industry: string;
  company_website?: string;
  company_size?: string;
  headquarters_location?: string;
  description?: string;
  logo_url?: string;
}

export interface Internship {
  internship_id: number;
  company_id: number;
  title: string;
  description: string;
  work_mode: 'Remote' | 'On-site' | 'Hybrid';
  internship_type: 'Summer' | 'Winter' | 'Semester-long' | 'Part-time';
  location?: string;
  stipend_min?: number;
  stipend_max?: number;
  application_deadline?: string;
  start_date?: string;
  duration_weeks?: number;
  min_cgpa_required: number;
  status: string;
  company?: Company;
}

export type ApplicationStatus =
  | 'Interested'
  | 'Applied'
  | 'Under Review'
  | 'OA Received'
  | 'OA Completed'
  | 'Interview Scheduled'
  | 'Interview Completed'
  | 'Offer Received'
  | 'Offer Accepted'
  | 'Offer Declined'
  | 'Rejected'
  | 'Withdrawn';

export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Application {
  application_id: number;
  student_id: number;
  internship_id?: number;
  company_id: number;
  external_company_name?: string;
  external_role_title?: string;
  application_source: string;
  applied_date: string;
  current_status: ApplicationStatus;
  priority: Priority;
  application_url?: string;
  expected_stipend?: number;
  notes?: string;
  next_action?: string;
  next_action_date?: string;
  company?: Company;
  internship?: Internship;
}

export interface Interview {
  interview_id: number;
  application_id: number;
  interview_round: number;
  interview_type: string;
  scheduled_start: string;
  scheduled_end: string;
  meeting_link?: string;
  location?: string;
  interviewer_name?: string;
  interview_status: 'Scheduled' | 'Completed' | 'Rescheduled' | 'Cancelled';
  preparation_notes?: string;
  feedback_notes?: string;
  result?: 'Passed' | 'Failed' | 'Pending';
}

export interface Offer {
  offer_id: number;
  application_id: number;
  offered_date: string;
  offer_status: 'Pending' | 'Accepted' | 'Declined' | 'Expired';
  stipend_amount?: number;
  work_mode?: string;
  joining_date?: string;
  offer_letter_url?: string;
  benefits?: string;
  response_deadline?: string;
}

export interface DashboardStats {
  total_applications: number;
  active_applications: number;
  interviews_scheduled: number;
  offers_received: number;
  profile_completion: number;
  upcoming_deadlines: Array<{
    application_id: number;
    company_name: string;
    deadline_date: string;
    deadline_type: string;
  }>;
}

export interface Notification {
  notification_id: number;
  message: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
}
