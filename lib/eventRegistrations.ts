/**
 * Gestion des inscriptions aux événements (localStorage en attendant une API)
 */

const STORAGE_KEY = "aceepci_event_registrations";

export interface EventRegistration {
  id: string;
  eventId: string;
  eventName: string;
  createdAt: string;

  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;

  memberStatus: string;
  member_level_id?: number | null;
  membershipNumber: string;
  department: string;
  department_id?: number | null;
  localChurch: string;

  needsAccommodation: string;
  accommodationType: string;
  needsTransport: string;
  transportDeparture: string;
  mealPreference: string;
  dietaryRestrictions: string;

  emergencyContact: string;
  emergencyPhone: string;
  emergencyRelation: string;

  medicalConditions: string;
  allergies: string;
  medication: string;

  workshopChoice: string[];
  workshop_ids?: number[];
  specialNeeds: string;
  motivation: string;

  acceptTerms: boolean;
  acceptRules: boolean;
  paymentConfirm: boolean;
}

export function getRegistrations(): EventRegistration[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveRegistration(reg: Omit<EventRegistration, "id" | "createdAt">): EventRegistration {
  const list = getRegistrations();
  const newReg: EventRegistration = {
    ...reg,
    id: `reg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  list.push(newReg);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return newReg;
}

export function getRegistrationsByEvent(eventId: string): EventRegistration[] {
  return getRegistrations().filter((r) => r.eventId === eventId);
}
