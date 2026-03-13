"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { heroImages } from "@/config/heroImages";
import {
  User,
  Phone,
  Briefcase,
  Church,
  Upload,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  FileText,
  Check,
  Award,
  Calendar,
} from "lucide-react";
import { publicOptionsApi, type PublicOptionItem } from "@/lib/api";

interface FormData {
  lastName: string;
  firstName: string;
  birthDate: string;
  birthPlace: string;
  gender: string;
  nationality: string;
  photo: File | null;
  phone: string;
  email: string;
  address: string;
  city: string;
  emergencyContact: string;
  emergencyPhone: string;
  emergencyRelation: string;
  profession: string;
  company: string;
  companyAddress: string;
  position: string;
  preferredDepartment: string;
  yearsInACEEPCI: string;
  lastDepartment: string;
  graduationYear: string;
  degree: string;
  university: string;
  localChurch: string;
  pastor: string;
  pastorPhone: string;
  churchService: string;
  serviceAreas: string[];
  motivation: string;
  mentoringInterest: string;
  idCard: File | null;
  workProof: File | null;
  pastorLetter: File | null;
  acceptCharter: boolean;
  acceptPayment: boolean;
}

export default function Page() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    lastName: "",
    firstName: "",
    birthDate: "",
    birthPlace: "",
    gender: "",
    nationality: "Ivoirienne",
    photo: null,
    phone: "",
    email: "",
    address: "",
    city: "",
    emergencyContact: "",
    emergencyPhone: "",
    emergencyRelation: "",
    profession: "",
    company: "",
    companyAddress: "",
    position: "",
    preferredDepartment: "",
    yearsInACEEPCI: "",
    lastDepartment: "",
    graduationYear: "",
    degree: "",
    university: "",
    localChurch: "",
    pastor: "",
    pastorPhone: "",
    churchService: "",
    serviceAreas: [],
    motivation: "",
    mentoringInterest: "",
    idCard: null,
    workProof: null,
    pastorLetter: null,
    acceptCharter: false,
    acceptPayment: false,
  });
  const [departmentOptions, setDepartmentOptions] = useState<PublicOptionItem[]>([]);
  const [serviceAreaOptions, setServiceAreaOptions] = useState<PublicOptionItem[]>([]);

  const totalSteps = 6;

  useEffect(() => {
    Promise.all([publicOptionsApi.departments(), publicOptionsApi.serviceDomains()])
      .then(([departments, serviceDomains]) => {
        setDepartmentOptions(departments);
        setServiceAreaOptions(serviceDomains);
      })
      .catch(() => {
        setDepartmentOptions([]);
        setServiceAreaOptions([]);
      });
  }, []);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof FormData) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, [fieldName]: file });
  };

  const handleServiceAreaToggle = (area: string) => {
    const currentAreas = formData.serviceAreas;
    if (currentAreas.includes(area)) {
      setFormData({
        ...formData,
        serviceAreas: currentAreas.filter((a) => a !== area),
      });
    } else {
      setFormData({
        ...formData,
        serviceAreas: [...currentAreas, area],
      });
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
    console.log("Alumni membership form submitted:", formData);
    alert("Votre demande d'adhésion Alumni a été soumise avec succès ! Bienvenue dans le réseau des anciens. Vous recevrez une confirmation par email.");
    router.push("/members");
  };

  return (
    <div className="min-h-screen bg-brand-subtle">
      <PageHero
        title="Formulaire d'adhésion Anciens membres"
        subtitle="Rejoignez le réseau des Alumni de l'ACEEPCI"
        background={heroImages.membershipAlumni}
      />
      {/* Progress Bar */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
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
              <span className="hidden sm:inline">Contact</span>
            </div>
            <div className={`flex items-center gap-1 ${currentStep >= 3 ? "text-brand-primary" : "text-muted-foreground"}`}>
              {currentStep > 3 ? <CheckCircle className="w-4 h-4" /> : <div className="w-4 h-4 border-2 border-current rounded-full" />}
              <span className="hidden sm:inline">Professionnel</span>
            </div>
            <div className={`flex items-center gap-1 ${currentStep >= 4 ? "text-brand-primary" : "text-muted-foreground"}`}>
              {currentStep > 4 ? <CheckCircle className="w-4 h-4" /> : <div className="w-4 h-4 border-2 border-current rounded-full" />}
              <span className="hidden sm:inline">ACEEPCI</span>
            </div>
            <div className={`flex items-center gap-1 ${currentStep >= 5 ? "text-brand-primary" : "text-muted-foreground"}`}>
              {currentStep > 5 ? <CheckCircle className="w-4 h-4"/> : <div className="w-4 h-4 border-2 border-current rounded-full" />}
              <span className="hidden sm:inline">Spirituel</span>
            </div>
            <div className={`flex items-center gap-1 ${currentStep >= 6 ? "text-brand-primary" : "text-muted-foreground"}`}>
              <div className="w-4 h-4 border-2 border-current rounded-full" />
              <span className="hidden sm:inline">Validation</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-border p-8">
          {/* Step 1: Informations personnelles */}
          {currentStep === 1 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Informations personnelles</h2>
                  <p className="text-muted-foreground">Vos données d'identité</p>
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
                      Date de naissance <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                      aria-label="Date de naissance"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Lieu de naissance <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="birthPlace"
                      value={formData.birthPlace}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                      placeholder="Ville, Pays"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
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
                      aria-label="Sexe"
                    >
                      <option value="">Sélectionner</option>
                      <option value="Masculin">Masculin</option>
                      <option value="Féminin">Féminin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Nationalité <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                      placeholder="Votre nationalité"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Photo d'identité <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-brand-primary transition-colors">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "photo")}
                      className="hidden"
                      id="photo-upload"
                      aria-label="Photo d'identité"
                    />
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <span className="text-brand-primary hover:opacity-90 font-medium">
                        Choisir une photo
                      </span>
                      <span className="text-muted-foreground"> ou glisser-déposer</span>
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG jusqu'à 5MB</p>
                    {formData.photo && (
                      <p className="text-sm text-brand-primary mt-2 flex items-center justify-center gap-1">
                        <Check className="w-4 h-4" />
                        {formData.photo.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact */}
          {currentStep === 2 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Informations de contact</h2>
                  <p className="text-muted-foreground">Comment vous joindre</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Adresse complète <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    placeholder="Commune, quartier, rue"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Ville <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                      placeholder="Votre ville"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Département ACEEPCI souhaité <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="preferredDepartment"
                      value={formData.preferredDepartment}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                      aria-label="Département ACEEPCI souhaité"
                    >
                      <option value="">Sélectionner un département</option>
                      {departmentOptions.map((dept) => (
                        <option key={dept.id} value={dept.name}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

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
                        aria-label="Lien de parenté"
                      >
                        <option value="">Sélectionner</option>
                        <option value="Conjoint">Conjoint(e)</option>
                        <option value="Parent">Parent</option>
                        <option value="Frère/Sœur">Frère/Sœur</option>
                        <option value="Ami">Ami(e)</option>
                        <option value="Autre">Autre</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Professional info */}
          {currentStep === 3 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Informations professionnelles
                  </h2>
                  <p className="text-muted-foreground">Votre parcours professionnel</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Profession <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="profession"
                      value={formData.profession}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                      placeholder="Ex: Ingénieur, Médecin, Enseignant..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Poste actuel <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                      placeholder="Ex: Chef de projet, Directeur..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Entreprise/Organisation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    placeholder="Nom de votre entreprise"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Adresse de l'entreprise
                  </label>
                  <input
                    type="text"
                    name="companyAddress"
                    value={formData.companyAddress}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    placeholder="Adresse complète"
                  />
                </div>

                <div className="bg-brand-subtle border border-brand-primary/20 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-3">Parcours académique</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Dernier diplôme obtenu <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="degree"
                        value={formData.degree}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                        placeholder="Ex: Master, Licence..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Année d'obtention <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="graduationYear"
                        value={formData.graduationYear}
                        onChange={handleInputChange}
                        required
                        min="1961"
                        max="2026"
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                        placeholder="Ex: 2020"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Université
                      </label>
                      <input
                        type="text"
                        name="university"
                        value={formData.university}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                        placeholder="Nom de l'université"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-brand-subtle border border-brand-primary/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-foreground">
                      <p className="font-semibold mb-1">Avantages du réseau Alumni :</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Networking professionnel avec 1000+ anciens</li>
                        <li>Opportunités de mentorat des jeunes</li>
                        <li>Événements exclusifs alumni</li>
                        <li>Plateforme d'échange d'opportunités</li>
                        <li>Cotisation : 20 000 FCFA/an</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: ACEEPCI History */}
          {currentStep === 4 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Votre parcours à l'ACEEPCI</h2>
                  <p className="text-muted-foreground">Vos années au sein de l'association</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Nombre d'années à l'ACEEPCI <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="yearsInACEEPCI"
                      value={formData.yearsInACEEPCI}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                      aria-label="Nombre d'années à l'ACEEPCI"
                    >
                      <option value="">Sélectionner</option>
                      <option value="1-2 ans">1-2 ans</option>
                      <option value="3-4 ans">3-4 ans</option>
                      <option value="5-6 ans">5-6 ans</option>
                      <option value="7+ ans">7 ans et plus</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Dernier département fréquenté <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="lastDepartment"
                      value={formData.lastDepartment}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                      aria-label="Dernier département fréquenté"
                    >
                      <option value="">Sélectionner</option>
                      {departmentOptions.map((dept) => (
                        <option key={dept.id} value={dept.name}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Domaines de contribution souhaités <span className="text-red-500">*</span>
                  </label>
                  <p className="text-sm text-muted-foreground mb-3">
                    En tant qu'ancien, comment souhaitez-vous contribuer à l'ACEEPCI ?
                  </p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {serviceAreaOptions.map((area) => (
                      <label
                        key={area.id}
                        className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.serviceAreas.includes(area.name)
                            ? "border-brand-primary bg-brand-subtle"
                            : "border-border hover:border-brand-primary/40"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.serviceAreas.includes(area.name)}
                          onChange={() => handleServiceAreaToggle(area.name)}
                          className="w-4 h-4 text-brand-primary border-border rounded focus:ring-brand-primary"
                        />
                        <span className="text-sm text-foreground">{area.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Intérêt pour le mentorat <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="mentoringInterest"
                    value={formData.mentoringInterest}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    aria-label="Intérêt pour le mentorat"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Très intéressé">Très intéressé - Je veux mentorer activement</option>
                    <option value="Intéressé">Intéressé - Occasionnellement</option>
                    <option value="Peut-être plus tard">Peut-être plus tard</option>
                    <option value="Non">Non, pas pour le moment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Pourquoi souhaitez-vous rejoindre le réseau Alumni ? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    placeholder="Partagez votre vision et comment vous souhaitez contribuer au développement de l'ACEEPCI..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Spiritual info */}
          {currentStep === 5 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
                  <Church className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Informations spirituelles</h2>
                  <p className="text-muted-foreground">Votre engagement actuel</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Église locale actuelle <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="localChurch"
                      value={formData.localChurch}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                      placeholder="Nom de votre église"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Pasteur/Responsable <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pastor"
                      value={formData.pastor}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                      placeholder="Nom du pasteur"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Téléphone du pasteur
                  </label>
                  <input
                    type="tel"
                    name="pastorPhone"
                    value={formData.pastorPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    placeholder="+225 XX XX XX XX XX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Votre service actuel dans l'église
                  </label>
                  <textarea
                    name="churchService"
                    value={formData.churchService}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    placeholder="Décrivez votre engagement et service dans votre église locale..."
                  />
                </div>

                <div className="bg-brand-subtle border border-brand-primary/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-foreground">
                      <p className="font-semibold mb-2">Documents recommandés :</p>
                      <p>Une attestation du pasteur confirmant votre engagement spirituel facilitera le traitement de votre dossier.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Carte d'identité <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-brand-primary transition-colors">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, "idCard")}
                      className="hidden"
                      id="idcard-upload"
                      required
                      aria-label="Carte d'identité"
                    />
                    <label htmlFor="idcard-upload" className="cursor-pointer">
                      <span className="text-brand-primary hover:opacity-90 font-medium">
                        Choisir un fichier
                      </span>
                      <span className="text-muted-foreground"> ou glisser-déposer</span>
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG jusqu'à 5MB</p>
                    {formData.idCard && (
                      <p className="text-sm text-brand-primary mt-2 flex items-center justify-center gap-1">
                        <Check className="w-4 h-4" />
                        {formData.idCard.name}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Justificatif professionnel <span className="text-muted-foreground">(Optionnel)</span>
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-brand-primary transition-colors">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, "workProof")}
                      className="hidden"
                      id="work-upload"
                      aria-label="Justificatif professionnel"
                    />
                    <label htmlFor="work-upload" className="cursor-pointer">
                      <span className="text-brand-primary hover:opacity-90 font-medium">
                        Choisir un fichier
                      </span>
                      <span className="text-muted-foreground"> ou glisser-déposer</span>
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Attestation d'emploi, carte professionnelle (PDF, JPG, PNG jusqu'à 5MB)
                    </p>
                    {formData.workProof && (
                      <p className="text-sm text-brand-primary mt-2 flex items-center justify-center gap-1">
                        <Check className="w-4 h-4" />
                        {formData.workProof.name}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Attestation du pasteur <span className="text-muted-foreground">(Recommandée)</span>
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-brand-primary transition-colors">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, "pastorLetter")}
                      className="hidden"
                      id="pastor-upload"
                      aria-label="Attestation du pasteur"
                    />
                    <label htmlFor="pastor-upload" className="cursor-pointer">
                      <span className="text-brand-primary hover:opacity-90 font-medium">
                        Choisir un fichier
                      </span>
                      <span className="text-muted-foreground"> ou glisser-déposer</span>
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, JPG, PNG jusqu'à 5MB
                    </p>
                    {formData.pastorLetter && (
                      <p className="text-sm text-brand-primary mt-2 flex items-center justify-center gap-1">
                        <Check className="w-4 h-4" />
                        {formData.pastorLetter.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Validation */}
          {currentStep === 6 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Validation et engagement</h2>
                  <p className="text-muted-foreground">Bienvenue dans le réseau Alumni</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-brand-subtle rounded-lg p-6">
                  <h3 className="font-bold text-foreground mb-4">Récapitulatif</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Nom complet :</span>
                      <p className="font-medium text-foreground">
                        {formData.firstName} {formData.lastName}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Type de membre :</span>
                      <p className="font-medium text-foreground">Alumni (Ancien membre)</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Profession :</span>
                      <p className="font-medium text-foreground">{formData.profession || "Non spécifié"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Entreprise :</span>
                      <p className="font-medium text-foreground">
                        {formData.company || "Non spécifié"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Années à l'ACEEPCI :</span>
                      <p className="font-medium text-foreground">{formData.yearsInACEEPCI || "Non spécifié"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Dernier département :</span>
                      <p className="font-medium text-foreground">
                        {formData.lastDepartment || "Non spécifié"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-brand-subtle to-brand-primary/10 rounded-lg p-6">
                  <h3 className="font-bold text-foreground mb-2">Cotisation annuelle Alumni</h3>
                  <div className="text-3xl font-bold text-brand-primary mb-2">
                    20 000 FCFA
                  </div>
                  <p className="text-sm text-foreground">
                    Cotisation Alumni pour l'année. Comprend l'accès au réseau professionnel, 
                    événements exclusifs alumni, plateforme de mentorat et participation aux décisions stratégiques.
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="flex items-start gap-3 p-4 border-2 border-border rounded-lg cursor-pointer hover:border-brand-primary transition-colors">
                    <input
                      type="checkbox"
                      name="acceptCharter"
                      checked={formData.acceptCharter}
                      onChange={handleInputChange}
                      required
                      className="mt-1 w-5 h-5 text-brand-primary border-border rounded focus:ring-brand-primary"
                    />
                    <span className="text-sm text-foreground">
                      J'ai lu et j'accepte la charte des membres Alumni de l'ACEEPCI. Je m'engage à 
                      contribuer au développement et au rayonnement de l'association. <span className="text-red-500">*</span>
                    </span>
                  </label>

                  <label className="flex items-start gap-3 p-4 border-2 border-border rounded-lg cursor-pointer hover:border-brand-primary transition-colors">
                    <input
                      type="checkbox"
                      name="acceptPayment"
                      checked={formData.acceptPayment}
                      onChange={handleInputChange}
                      required
                      className="mt-1 w-5 h-5 text-brand-primary border-border rounded focus:ring-brand-primary"
                    />
                    <span className="text-sm text-foreground">
                      Je m'engage à payer ma cotisation annuelle Alumni de 20 000 FCFA dans un délai de
                      30 jours. <span className="text-red-500">*</span>
                    </span>
                  </label>
                </div>

                <div className="bg-brand-subtle border border-brand-primary/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-foreground">
                      <p className="font-semibold mb-1">Bienvenue dans le réseau Alumni !</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Validation de votre dossier sous 3-5 jours</li>
                        <li>Accès immédiat à la plateforme alumni après paiement</li>
                        <li>Invitation au prochain événement alumni</li>
                        <li>Mise en relation avec le réseau professionnel</li>
                        <li>Attribution d'un badge Alumni officiel</li>
                      </ul>
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
                href="/members"
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
                disabled={!formData.acceptCharter || !formData.acceptPayment}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white font-semibold rounded-lg hover:opacity-95 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-5 h-5" />
                Rejoindre le réseau Alumni
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
