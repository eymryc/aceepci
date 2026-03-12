"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveRegistration } from "@/lib/eventRegistrations";
import { publicOptionsApi, type PublicOptionItem } from "@/lib/api";
import { PageHero } from "@/components/sections/PageHero";
import { heroImages } from "@/config/heroImages";
import {
  User,
  Phone,
  Calendar,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  MapPin,
  Users,
  Utensils,
  Bus,
  Home,
  Heart,
  CreditCard,
  Check,
} from "lucide-react";

interface FormData {
  // Informations personnelles
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;

  // Statut membre
  memberStatus: string;
  membershipNumber: string;
  department: string;
  localChurch: string;

  // Choix de l'événement
  eventId: string;
  eventName: string;
  
  // Options logistiques
  needsAccommodation: string;
  accommodationType: string;
  needsTransport: string;
  transportDeparture: string;
  mealPreference: string;
  dietaryRestrictions: string;

  // Contact d'urgence
  emergencyContact: string;
  emergencyPhone: string;
  emergencyRelation: string;

  // Informations médicales
  medicalConditions: string;
  allergies: string;
  medication: string;

  // Participation
  workshopChoice: string[];
  specialNeeds: string;
  motivation: string;

  // Engagement
  acceptTerms: boolean;
  acceptRules: boolean;
  paymentConfirm: boolean;
}

const availableEvents = [
  {
    id: "camp-2026",
    name: "Camp Biblique National 2026",
    date: "15-22 Juillet 2026",
    location: "Grand-Bassam",
    price: "25 000 FCFA",
    category: "Camp"
  },
  {
    id: "conference-jeunes",
    name: "Conférence Jeunesse - Vision 2030",
    date: "5-7 Avril 2026",
    location: "Yamoussoukro",
    price: "15 000 FCFA",
    category: "Conférence"
  },
  {
    id: "retraite-leaders",
    name: "Retraite des Leaders",
    date: "20-22 Mars 2026",
    location: "Abidjan - Bingerville",
    price: "20 000 FCFA",
    category: "Retraite"
  },
  {
    id: "journee-evangelisation",
    name: "Journée d'Évangélisation Massive",
    date: "28 Mars 2026",
    location: "Bouaké",
    price: "Gratuit",
    category: "Évangélisation"
  },
];

export default function Page() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
    birthDate: "",
    gender: "",
    memberStatus: "",
    membershipNumber: "",
    department: "",
    localChurch: "",
    eventId: "",
    eventName: "",
    needsAccommodation: "",
    accommodationType: "",
    needsTransport: "",
    transportDeparture: "",
    mealPreference: "Standard",
    dietaryRestrictions: "",
    emergencyContact: "",
    emergencyPhone: "",
    emergencyRelation: "",
    medicalConditions: "",
    allergies: "",
    medication: "",
    workshopChoice: [],
    specialNeeds: "",
    motivation: "",
    acceptTerms: false,
    acceptRules: false,
    paymentConfirm: false,
  });

  const totalSteps = 5;

  const [departments, setDepartments] = useState<PublicOptionItem[]>([]);
  const [memberLevels, setMemberLevels] = useState<PublicOptionItem[]>([]);
  const [serviceDomains, setServiceDomains] = useState<PublicOptionItem[]>([]);

  useEffect(() => {
    publicOptionsApi.departments({ per_page: 500 }).then(setDepartments).catch(() => setDepartments([]));
    publicOptionsApi.memberLevels({ per_page: 500 }).then(setMemberLevels).catch(() => setMemberLevels([]));
    publicOptionsApi.serviceDomains({ per_page: 500 }).then(setServiceDomains).catch(() => setServiceDomains([]));
  }, []);

  const workshops = serviceDomains.length > 0
    ? serviceDomains.map((d) => d.label ?? d.name)
    : [
        "Leadership spirituel",
        "Évangélisation et mission",
        "Vie de prière et intercession",
        "Étude biblique approfondie",
        "Louange et adoration",
        "Mentorat et discipulat",
        "Gestion des finances personnelles",
        "Relation et mariage chrétien",
      ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const eventId = e.target.value;
    const event = availableEvents.find(ev => ev.id === eventId);
    setFormData({
      ...formData,
      eventId: eventId,
      eventName: event ? event.name : ""
    });
  };

  const handleWorkshopToggle = (workshop: string) => {
    const currentWorkshops = formData.workshopChoice;
    if (currentWorkshops.includes(workshop)) {
      setFormData({
        ...formData,
        workshopChoice: currentWorkshops.filter((w) => w !== workshop),
      });
    } else {
      if (currentWorkshops.length < 3) {
        setFormData({
          ...formData,
          workshopChoice: [...currentWorkshops, workshop],
        });
      }
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveRegistration({
      eventId: formData.eventId,
      eventName: formData.eventName,
      lastName: formData.lastName,
      firstName: formData.firstName,
      email: formData.email,
      phone: formData.phone,
      birthDate: formData.birthDate,
      gender: formData.gender,
      memberStatus: memberLevels.find((m) => String(m.id) === formData.memberStatus)?.label ?? formData.memberStatus,
      member_level_id: formData.memberStatus ? Number(formData.memberStatus) : null,
      membershipNumber: formData.membershipNumber,
      department: departments.find((d) => String(d.id) === formData.department)?.label ?? formData.department,
      department_id: formData.department ? Number(formData.department) : null,
      localChurch: formData.localChurch,
      needsAccommodation: formData.needsAccommodation,
      accommodationType: formData.accommodationType,
      needsTransport: formData.needsTransport,
      transportDeparture: formData.transportDeparture,
      mealPreference: formData.mealPreference,
      dietaryRestrictions: formData.dietaryRestrictions,
      emergencyContact: formData.emergencyContact,
      emergencyPhone: formData.emergencyPhone,
      emergencyRelation: formData.emergencyRelation,
      medicalConditions: formData.medicalConditions,
      allergies: formData.allergies,
      medication: formData.medication,
      workshopChoice: formData.workshopChoice,
      workshop_ids: serviceDomains.length > 0
        ? formData.workshopChoice
            .map((label) => serviceDomains.find((d) => (d.label ?? d.name) === label)?.id)
            .filter((id): id is number => id != null)
        : undefined,
      specialNeeds: formData.specialNeeds,
      motivation: formData.motivation,
      acceptTerms: formData.acceptTerms,
      acceptRules: formData.acceptRules,
      paymentConfirm: formData.paymentConfirm,
    });
    alert(`Votre inscription à "${formData.eventName}" a été enregistrée avec succès ! Vous recevrez une confirmation par email avec les détails du paiement.`);
    router.push("/activities");
  };

  const selectedEvent = availableEvents.find(e => e.id === formData.eventId);

  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title="Formulaire d'inscription"
        subtitle="Inscrivez-vous aux événements de l'ACEEPCI"
        background={heroImages.eventRegistration}
      />
      {/* Progress Bar */}
      <div className="bg-white border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Étape {currentStep} sur {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round((currentStep / totalSteps) * 100)}% complété
            </span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <div
              className="bg-gradient-to-r from-brand-primary to-brand-accent h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-4 text-xs">
            <div className={`flex items-center gap-1 ${currentStep >= 1 ? "text-brand-primary" : "text-muted-foreground"}`}>
              {currentStep > 1 ? <CheckCircle className="w-4 h-4" /> : <div className="w-4 h-4 border-2 border-current rounded-full" />}
              <span className="hidden sm:inline">Identité</span>
            </div>
            <div className={`flex items-center gap-1 ${currentStep >= 2 ? "text-brand-primary" : "text-muted-foreground"}`}>
              {currentStep > 2 ? <CheckCircle className="w-4 h-4" /> : <div className="w-4 h-4 border-2 border-current rounded-full" />}
              <span className="hidden sm:inline">Événement</span>
            </div>
            <div className={`flex items-center gap-1 ${currentStep >= 3 ? "text-brand-primary" : "text-muted-foreground"}`}>
              {currentStep > 3 ? <CheckCircle className="w-4 h-4" /> : <div className="w-4 h-4 border-2 border-current rounded-full" />}
              <span className="hidden sm:inline">Logistique</span>
            </div>
            <div className={`flex items-center gap-1 ${currentStep >= 4 ? "text-brand-primary" : "text-muted-foreground"}`}>
              {currentStep > 4 ? <CheckCircle className="w-4 h-4" /> : <div className="w-4 h-4 border-2 border-current rounded-full" />}
              <span className="hidden sm:inline">Urgence</span>
            </div>
            <div className={`flex items-center gap-1 ${currentStep >= 5 ? "text-brand-primary" : "text-muted-foreground"}`}>
              <div className="w-4 h-4 border-2 border-current rounded-full" />
              <span className="hidden sm:inline">Confirmation</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-border p-8">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Informations personnelles</h2>
                  <p className="text-muted-foreground">Vos coordonnées</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                      placeholder="Votre nom de famille"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Prénom(s) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                      placeholder="Vos prénom(s)"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                      placeholder="votre.email@exemple.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Téléphone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                      placeholder="+225 XX XX XX XX XX"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Date de naissance <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Sexe <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    >
                      <option value="">Sélectionner</option>
                      <option value="Masculin">Masculin</option>
                      <option value="Féminin">Féminin</option>
                    </select>
                  </div>
                </div>

                <div className="bg-brand-subtle border border-brand-primary/20 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-brand-primary" />
                    Statut membre ACEEPCI
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Statut <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="memberStatus"
                        value={formData.memberStatus}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                      >
                        <option value="">Sélectionner</option>
                        {memberLevels.map((opt) => (
                          <option key={opt.id} value={String(opt.id)}>
                            {opt.label ?? opt.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Numéro de membre <span className="text-muted-foreground">(si applicable)</span>
                      </label>
                      <input
                        type="text"
                        name="membershipNumber"
                        value={formData.membershipNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                        placeholder="Ex: ACEE-AB-2024-001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Département ACEEPCI
                      </label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                      >
                        <option value="">Sélectionner</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={String(dept.id)}>
                            {dept.label ?? dept.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Église locale
                      </label>
                      <input
                        type="text"
                        name="localChurch"
                        value={formData.localChurch}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                        placeholder="Nom de votre église"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Event Selection */}
          {currentStep === 2 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Choix de l'événement</h2>
                  <p className="text-muted-foreground">Sélectionnez l'événement auquel vous souhaitez participer</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Événement <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    {availableEvents.map((event) => (
                      <label
                        key={event.id}
                        className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.eventId === event.id
                            ? "border-brand-primary bg-brand-subtle"
                            : "border-border hover:border-brand-primary/40"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="eventId"
                            value={event.id}
                            checked={formData.eventId === event.id}
                            onChange={handleEventChange}
                            required
                            className="mt-1 w-4 h-4 text-brand-primary border-border focus:ring-brand-primary"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-bold text-foreground">{event.name}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                event.category === "Camp" ? "bg-brand-primary/10 text-brand-primary" :
                                event.category === "Conférence" ? "bg-brand-primary/10 text-brand-primary" :
                                event.category === "Retraite" ? "bg-brand-primary/10 text-brand-primary" :
                                "bg-brand-primary/10 text-brand-primary"
                              }`}>
                                {event.category}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {event.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {event.location}
                              </span>
                              <span className="font-semibold text-brand-primary">{event.price}</span>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {formData.eventId && (
                  <div className="bg-brand-subtle border border-brand-primary/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-foreground">
                        <p className="font-semibold mb-1">Informations importantes :</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>L'inscription sera confirmée après réception du paiement</li>
                          <li>Les places sont limitées - premier arrivé, premier servi</li>
                          <li>Les mineurs doivent avoir une autorisation parentale</li>
                          <li>Annulation possible jusqu'à 7 jours avant l'événement</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {formData.eventId && (formData.eventId === "camp-2026" || formData.eventId === "conference-jeunes" || formData.eventId === "retraite-leaders") && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Ateliers souhaités <span className="text-muted-foreground">(Sélectionnez jusqu'à 3)</span>
                    </label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {workshops.map((workshop) => (
                        <label
                          key={workshop}
                          className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.workshopChoice.includes(workshop)
                              ? "border-brand-primary bg-brand-subtle"
                              : "border-border hover:border-brand-primary/40"
                          } ${formData.workshopChoice.length >= 3 && !formData.workshopChoice.includes(workshop) ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.workshopChoice.includes(workshop)}
                            onChange={() => handleWorkshopToggle(workshop)}
                            disabled={formData.workshopChoice.length >= 3 && !formData.workshopChoice.includes(workshop)}
                            className="w-4 h-4 text-brand-primary border-border rounded focus:ring-brand-primary"
                          />
                          <span className="text-sm text-foreground">{workshop}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formData.workshopChoice.length}/3 ateliers sélectionnés
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Logistics */}
          {currentStep === 3 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Options logistiques</h2>
                  <p className="text-muted-foreground">Transport, hébergement et restauration</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Accommodation */}
                <div className="bg-brand-subtle border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Home className="w-5 h-5 text-brand-primary" />
                    Hébergement
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Avez-vous besoin d'hébergement ? <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="needsAccommodation"
                        value={formData.needsAccommodation}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                      >
                        <option value="">Sélectionner</option>
                        <option value="Oui">Oui</option>
                        <option value="Non">Non, je me débrouille</option>
                      </select>
                    </div>

                    {formData.needsAccommodation === "Oui" && (
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Type d'hébergement souhaité <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="accommodationType"
                          value={formData.accommodationType}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                        >
                          <option value="">Sélectionner</option>
                          <option value="Dortoir mixte">Dortoir mixte (+0 FCFA)</option>
                          <option value="Dortoir hommes">Dortoir hommes (+0 FCFA)</option>
                          <option value="Dortoir femmes">Dortoir femmes (+0 FCFA)</option>
                          <option value="Chambre partagée">Chambre partagée (+5 000 FCFA)</option>
                          <option value="Chambre individuelle">Chambre individuelle (+15 000 FCFA)</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* Transport */}
                <div className="bg-brand-subtle border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Bus className="w-5 h-5 text-brand-primary" />
                    Transport
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Avez-vous besoin du transport organisé ? <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="needsTransport"
                        value={formData.needsTransport}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                      >
                        <option value="">Sélectionner</option>
                        <option value="Oui">Oui (+3 000 FCFA aller-retour)</option>
                        <option value="Non">Non, transport personnel</option>
                      </select>
                    </div>

                    {formData.needsTransport === "Oui" && (
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Point de départ <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="transportDeparture"
                          value={formData.transportDeparture}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                        >
                          <option value="">Sélectionner</option>
                          <option value="Abidjan - Cocody">Abidjan - Cocody</option>
                          <option value="Abidjan - Yopougon">Abidjan - Yopougon</option>
                          <option value="Abidjan - Plateau">Abidjan - Plateau</option>
                          <option value="Bouaké">Bouaké</option>
                          <option value="Yamoussoukro">Yamoussoukro</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* Meals */}
                <div className="bg-brand-subtle border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-brand-primary" />
                    Restauration
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Préférence de repas <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="mealPreference"
                        value={formData.mealPreference}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                      >
                        <option value="Standard">Standard (tous les repas)</option>
                        <option value="Végétarien">Végétarien</option>
                        <option value="Sans porc">Sans porc</option>
                        <option value="Halal">Halal</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Restrictions alimentaires ou allergies
                      </label>
                      <textarea
                        name="dietaryRestrictions"
                        value={formData.dietaryRestrictions}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                        placeholder="Ex: Allergie aux arachides, intolérance au lactose..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Emergency & Medical */}
          {currentStep === 4 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Contact d'urgence & Santé</h2>
                  <p className="text-muted-foreground">Informations importantes pour votre sécurité</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-brand-subtle border border-brand-primary/20 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-brand-primary" />
                    Contact d'urgence
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Nom complet <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                        placeholder="Nom du contact"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Téléphone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="emergencyPhone"
                        value={formData.emergencyPhone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                        placeholder="+225 XX XX XX XX XX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Lien de parenté <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="emergencyRelation"
                        value={formData.emergencyRelation}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                      >
                        <option value="">Sélectionner</option>
                        <option value="Père">Père</option>
                        <option value="Mère">Mère</option>
                        <option value="Conjoint">Conjoint(e)</option>
                        <option value="Frère/Sœur">Frère/Sœur</option>
                        <option value="Ami">Ami(e)</option>
                        <option value="Autre">Autre</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-brand-subtle border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-3">Informations médicales</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Conditions médicales importantes
                      </label>
                      <textarea
                        name="medicalConditions"
                        value={formData.medicalConditions}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                        placeholder="Ex: Asthme, diabète, épilepsie... (Laissez vide si aucune)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Allergies médicamenteuses ou autres
                      </label>
                      <textarea
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                        placeholder="Ex: Pénicilline, aspirine... (Laissez vide si aucune)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Médicaments pris régulièrement
                      </label>
                      <textarea
                        name="medication"
                        value={formData.medication}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                        placeholder="Listez vos médicaments réguliers (Laissez vide si aucun)"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Besoins spécifiques ou informations importantes
                  </label>
                  <textarea
                    name="specialNeeds"
                    value={formData.specialNeeds}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    placeholder="Ex: Mobilité réduite, besoin d'assistance, préférences particulières..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Pourquoi souhaitez-vous participer à cet événement ?
                  </label>
                  <textarea
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    placeholder="Partagez vos attentes et motivations..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Confirmation */}
          {currentStep === 5 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Confirmation et paiement</h2>
                  <p className="text-muted-foreground">Vérifiez vos informations</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Summary */}
                <div className="bg-brand-subtle rounded-lg p-6">
                  <h3 className="font-bold text-foreground mb-4">Récapitulatif de votre inscription</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Nom complet :</span>
                      <p className="font-medium text-foreground">
                        {formData.firstName} {formData.lastName}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Statut :</span>
                      <p className="font-medium text-foreground">
                        {(memberLevels.find((m) => String(m.id) === formData.memberStatus)?.label ?? formData.memberStatus) || "Non spécifié"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email :</span>
                      <p className="font-medium text-foreground">{formData.email}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Téléphone :</span>
                      <p className="font-medium text-foreground">{formData.phone}</p>
                    </div>
                    {selectedEvent && (
                      <>
                        <div className="md:col-span-2">
                          <span className="text-muted-foreground">Événement :</span>
                          <p className="font-medium text-foreground">{selectedEvent.name}</p>
                          <p className="text-sm text-muted-foreground">{selectedEvent.date} - {selectedEvent.location}</p>
                        </div>
                        {formData.workshopChoice.length > 0 && (
                          <div className="md:col-span-2">
                            <span className="text-muted-foreground">Ateliers choisis :</span>
                            <p className="font-medium text-foreground">{formData.workshopChoice.join(", ")}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Cost Breakdown */}
                {selectedEvent && (
                  <div className="bg-gradient-to-br from-brand-subtle to-brand-primary/10 rounded-lg p-6">
                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-brand-primary" />
                      Montant à payer
                    </h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground">Frais d'inscription</span>
                        <span className="font-medium text-foreground">{selectedEvent.price}</span>
                      </div>
                      {formData.needsTransport === "Oui" && (
                        <div className="flex justify-between text-sm">
                          <span className="text-foreground">Transport (aller-retour)</span>
                          <span className="font-medium text-foreground">3 000 FCFA</span>
                        </div>
                      )}
                      {formData.accommodationType === "Chambre partagée" && (
                        <div className="flex justify-between text-sm">
                          <span className="text-foreground">Hébergement (chambre partagée)</span>
                          <span className="font-medium text-foreground">5 000 FCFA</span>
                        </div>
                      )}
                      {formData.accommodationType === "Chambre individuelle" && (
                        <div className="flex justify-between text-sm">
                          <span className="text-foreground">Hébergement (chambre individuelle)</span>
                          <span className="font-medium text-foreground">15 000 FCFA</span>
                        </div>
                      )}
                    </div>
                    <div className="border-t-2 border-brand-primary/20 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-foreground">Total à payer :</span>
                        <span className="text-2xl font-bold text-brand-primary">
                          {(() => {
                            let total = selectedEvent.price === "Gratuit" ? 0 : parseInt(selectedEvent.price.replace(/[^0-9]/g, ''));
                            if (formData.needsTransport === "Oui") total += 3000;
                            if (formData.accommodationType === "Chambre partagée") total += 5000;
                            if (formData.accommodationType === "Chambre individuelle") total += 15000;
                            return total === 0 ? "Gratuit" : `${total.toLocaleString()} FCFA`;
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Terms */}
                <div className="space-y-4">
                  <label className="flex items-start gap-3 p-4 border-2 border-border rounded-lg cursor-pointer hover:border-brand-primary transition-colors">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                      required
                      className="mt-1 w-5 h-5 text-brand-primary border-border rounded focus:ring-brand-primary"
                    />
                    <span className="text-sm text-foreground">
                      J'ai lu et j'accepte les <span className="font-semibold text-brand-primary">conditions générales</span> de participation. 
                      Je comprends que mon inscription sera confirmée après réception du paiement. <span className="text-red-500">*</span>
                    </span>
                  </label>

                  <label className="flex items-start gap-3 p-4 border-2 border-border rounded-lg cursor-pointer hover:border-brand-primary transition-colors">
                    <input
                      type="checkbox"
                      name="acceptRules"
                      checked={formData.acceptRules}
                      onChange={handleInputChange}
                      required
                      className="mt-1 w-5 h-5 text-brand-primary border-border rounded focus:ring-brand-primary"
                    />
                    <span className="text-sm text-foreground">
                      Je m'engage à respecter le <span className="font-semibold text-brand-primary">règlement intérieur</span> de l'événement 
                      et les principes de l'ACEEPCI. <span className="text-red-500">*</span>
                    </span>
                  </label>

                  <label className="flex items-start gap-3 p-4 border-2 border-border rounded-lg cursor-pointer hover:border-brand-primary transition-colors">
                    <input
                      type="checkbox"
                      name="paymentConfirm"
                      checked={formData.paymentConfirm}
                      onChange={handleInputChange}
                      required
                      className="mt-1 w-5 h-5 text-brand-primary border-border rounded focus:ring-brand-primary"
                    />
                    <span className="text-sm text-foreground">
                      Je m'engage à effectuer le paiement dans les <span className="font-semibold">48 heures</span> suivant 
                      cette inscription pour confirmer ma place. <span className="text-red-500">*</span>
                    </span>
                  </label>
                </div>

                <div className="bg-brand-subtle border border-brand-primary/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-foreground">
                      <p className="font-semibold mb-1">Prochaines étapes :</p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Vous recevrez un email de confirmation avec les détails de paiement</li>
                        <li>Effectuez le paiement via Mobile Money ou virement bancaire</li>
                        <li>Envoyez la preuve de paiement à paiements@aceepci.org</li>
                        <li>Vous recevrez votre badge et le programme détaillé</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-8 border-t border-border">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-2 px-6 py-3 border-2 border-border text-foreground font-semibold rounded-lg hover:bg-brand-subtle transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Précédent
              </button>
            ) : (
              <Link
                href="/activities"
                className="flex items-center gap-2 px-6 py-3 border-2 border-border text-foreground font-semibold rounded-lg hover:bg-brand-subtle transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Annuler
              </Link>
            )}

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white font-semibold rounded-lg hover:opacity-95 transition-colors"
              >
                Suivant
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!formData.acceptTerms || !formData.acceptRules || !formData.paymentConfirm}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white font-semibold rounded-lg hover:opacity-95 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-5 h-5" />
                Confirmer mon inscription
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
