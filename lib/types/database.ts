export interface Credits {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface Research {
  id: string;
  user_id: string;
  prospect_name: string;
  prospect_company: string;
  prospect_title: string;
  linkedin_url: string | null;
  ai_output: AIOutput;
  created_at: string;
}

export interface AIOutput {
  insights: string[];
  pain_points: string[];
  personalization_angles: string[];
  cold_email: string;
}

export interface ProspectInput {
  name: string;
  company: string;
  title: string;
  linkedin_url?: string;
}
