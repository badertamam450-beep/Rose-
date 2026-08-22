export interface DentalCase {
  id: string;
  patientName: string;
  patientAge: number;
  condition: string;
  treatmentPlan: string;
  status: "active" | "completed" | "scheduled";
  lastVisit: string;
  notes: string;
}

export interface DentalDocument {
  id: string;
  title: string;
  category: "PDF" | "MP4" | "PPT" | "DOCX";
  accentColor: string;
  description: string;
  size: string;
  dateAdded: string;
}

export interface DentalNewsItem {
  id: string;
  title: string;
  source: string;
  date: string;
  summary: string;
  category: "أبحاث" | "مؤتمرات" | "تقنيات";
}

export interface ChatMessage {
  id: string;
  sender: "doctor" | "ai";
  text: string;
  timestamp: string;
  isSimulated?: boolean;
}
