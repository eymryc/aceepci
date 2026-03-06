"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { heroImages } from "@/config/heroImages";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Church,
  Upload,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  FileText,
  Check,
  BookOpen,
} from "lucide-react";

interface FormData {
  // Informations personnelles
  lastName: string;
  firstName: string;
  birthDate: string;
  birthPlace: string;
  gender: string;
  nationality: string;
  photo: File | null;

  // Informations de contact
  phone: string;
  email: string;
  address: string;
  city: string;
  emergencyContact: string;
  emergencyPhone: string;
  emergencyRelation: string;

  // Informations scolaires
  highSchool: string;
  grade: string; // Seconde, Première, Terminale
  series: string; // A, C, D, etc.
  preferredDepartment: string;

  // Informations spirituelles
  localChurch: string;
  pastor: string;
  pastorPhone: string;
  bornAgain: string;
  baptized: string;
  churchService: string;
  serviceAreas: string[];
  howDidYouKnow: string;
  motivation: string;

  // Documents
  idCard: File | null;
  studentCard: File | null;
  pastorLetter: File | null;

  // Engagement
  acceptCharter: boolean;
  acceptPayment: boolean;
  parentalConsent: boolean;
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
    highSchool: "",
    grade: "",
    series: "",
    preferredDepartment: "",
    localChurch: "",
    pastor: "",
    pastorPhone: "",
    bornAgain: "",
    baptized: "",
    churchService: "",
    serviceAreas: [],
    howDidYouKnow: "",
    motivation: "",
    idCard: null,
    studentCard: null,
    pastorLetter: null,
    acceptCharter: false,
    acceptPayment: false,
    parentalConsent: false,
  });

  const totalSteps = 6;

  const departments = [
    "Abidjan - Cocody",
    "Abidjan - Yopougon",
    "Abidjan - Abobo",
    "Abidjan - Plateau",
    "Bouaké",
    "Yamoussoukro",
    "San-Pedro",
    "Daloa",
    "Korhogo",
    "Man",
    "Abengourou",
    "Grand-Bassam",
  ];

  const serviceAreas = [
    "Louange et adoration",
    "Intercession",
    "Évangélisation",
    "Enseignement biblique",
    "Accueil et hospitalité",
    "Communication et médias",
    "Organisation d'événements",
    "Conseil des pairs",
    "Arts et créativité",
    "Sport et loisirs",
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
    console.log("Student membership form submitted:", formData);
    alert("Votre demande d'adhésion a été soumise avec succès ! Vous recevrez une confirmation par email dans les 5-7 jours ouvrables.");
    router.push("/members");
  };

  return (
    <div className="min-h-screen bg-brand-subtle">
      <PageHero
        title="Formulaire d'adhésion Lycéen"
        subtitle="Rejoignez la communauté ACEEPCI en tant qu'élève du secondaire"
        background={heroImages.membershipStudent}
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
              <span className="hidden sm:inline">Scolarité</span>
            </div>
            <div className={`flex items-center gap-1 ${currentStep >= 4 ? "text-brand-primary" : "text-muted-foreground"}`}>
              {currentStep > 4 ? <CheckCircle className="w-4 h-4" /> : <div className="w-4 h-4 border-2 border-current rounded-full" />}
              <span className="hidden sm:inline">Spirituel</span>
            </div>
            <div className={`flex items-center gap-1 ${currentStep >= 5 ? "text-brand-primary" : "text-muted-foreground"}`}>
              {currentStep > 5 ? <CheckCircle className="w-4 h-4" /> : <div className="w-4 h-4 border-2 border-current rounded-full" />}
              <span className="hidden sm:inline">Documents</span>
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

          {/* Step 2: Informations de contact */}
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
                    >
                      <option value="">Sélectionner un département</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-brand-subtle border border-brand-primary/20 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-brand-primary" />
                    Contact d'urgence (Parent/Tuteur)
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
                        placeholder="Nom du parent/tuteur"
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
                        <option value="Tuteur">Tuteur</option>
                        <option value="Autre">Autre</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Informations scolaires */}
          {currentStep === 3 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Informations scolaires
                  </h2>
                  <p className="text-muted-foreground">Votre parcours au lycée</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nom du lycée <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="highSchool"
                    value={formData.highSchool}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    placeholder="Ex: Lycée Classique d'Abidjan"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Classe <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="grade"
                      value={formData.grade}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    >
                      <option value="">Sélectionner votre classe</option>
                      <option value="Seconde">Seconde</option>
                      <option value="Première">Première</option>
                      <option value="Terminale">Terminale</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Série <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="series"
                      value={formData.series}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    >
                      <option value="">Sélectionner votre série</option>
                      <option value="A1">A1 (Lettres)</option>
                      <option value="A2">A2 (Langues)</option>
                      <option value="C">C (Maths-Sciences Physiques)</option>
                      <option value="D">D (Maths-Sciences Naturelles)</option>
                      <option value="E">E (Économie)</option>
                      <option value="G">G (Gestion)</option>
                    </select>
                  </div>
                </div>

                <div className="bg-brand-subtle border border-brand-primary/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-foreground">
                      <p className="font-semibold mb-1">Important pour les élèves :</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>L'accord parental est obligatoire pour les moins de 18 ans</li>
                        <li>Vous devrez présenter votre carnet de correspondance ou certificat de scolarité</li>
                        <li>La cotisation annuelle pour les élèves est de 5 000 FCFA</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Informations spirituelles - Similar to main form but adapted */}
          {currentStep === 4 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
                  <Church className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Informations spirituelles</h2>
                  <p className="text-muted-foreground">Votre parcours de foi</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Église locale <span className="text-red-500">*</span>
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

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Êtes-vous né(e) de nouveau ? <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="bornAgain"
                      value={formData.bornAgain}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    >
                      <option value="">Sélectionner</option>
                      <option value="Oui">Oui</option>
                      <option value="Non">Non</option>
                      <option value="En réflexion">En réflexion</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Avez-vous été baptisé(e) d'eau ? <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="baptized"
                      value={formData.baptized}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    >
                      <option value="">Sélectionner</option>
                      <option value="Oui">Oui</option>
                      <option value="Non">Non</option>
                      <option value="Prévu prochainement">Prévu prochainement</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Expérience de service dans l'église
                  </label>
                  <textarea
                    name="churchService"
                    value={formData.churchService}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    placeholder="Décrivez vos expériences de service (école du dimanche, chorale, etc.)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Domaines de service souhaités à l'ACEEPCI
                  </label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {serviceAreas.map((area) => (
                      <label
                        key={area}
                        className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.serviceAreas.includes(area)
                            ? "border-brand-primary bg-brand-subtle"
                            : "border-border hover:border-brand-primary/40"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.serviceAreas.includes(area)}
                          onChange={() => handleServiceAreaToggle(area)}
                          className="w-4 h-4 text-brand-primary border-border rounded focus:ring-brand-primary"
                        />
                        <span className="text-sm text-foreground">{area}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Comment avez-vous connu l'ACEEPCI ? <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="howDidYouKnow"
                    value={formData.howDidYouKnow}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Ami/Camarade">Ami/Camarade de classe</option>
                    <option value="Église locale">Église locale</option>
                    <option value="Réseaux sociaux">Réseaux sociaux</option>
                    <option value="Événement">Événement ACEEPCI</option>
                    <option value="Site web">Site web</option>
                    <option value="Au lycée">Au lycée</option>
                    <option value="Famille">Famille</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Pourquoi souhaitez-vous rejoindre l'ACEEPCI ? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    placeholder="Partagez vos motivations et vos attentes..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Documents */}
          {currentStep === 5 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Documents justificatifs</h2>
                  <p className="text-muted-foreground">Téléchargez les pièces nécessaires</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-brand-subtle border border-brand-primary/20 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-foreground">
                      <p className="font-semibold mb-1">Documents requis pour les élèves :</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Copie de votre carte d'identité ou extrait de naissance</li>
                        <li>Carnet de correspondance ou certificat de scolarité</li>
                        <li>Attestation du pasteur (recommandée)</li>
                      </ul>
                      <p className="mt-2">Format acceptés : PDF, JPG, PNG (max 5MB par fichier)</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Pièce d'identité <span className="text-red-500">*</span>
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
                    Carnet de correspondance / Certificat de scolarité <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-brand-primary transition-colors">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, "studentCard")}
                      className="hidden"
                      id="student-upload"
                      required
                    />
                    <label htmlFor="student-upload" className="cursor-pointer">
                      <span className="text-brand-primary hover:opacity-90 font-medium">
                        Choisir un fichier
                      </span>
                      <span className="text-muted-foreground"> ou glisser-déposer</span>
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG jusqu'à 5MB</p>
                    {formData.studentCard && (
                      <p className="text-sm text-brand-primary mt-2 flex items-center justify-center gap-1">
                        <Check className="w-4 h-4" />
                        {formData.studentCard.name}
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
                    />
                    <label htmlFor="pastor-upload" className="cursor-pointer">
                      <span className="text-brand-primary hover:opacity-90 font-medium">
                        Choisir un fichier
                      </span>
                      <span className="text-muted-foreground"> ou glisser-déposer</span>
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, JPG, PNG jusqu'à 5MB (Recommandé pour validation rapide)
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
                  <p className="text-muted-foreground">Dernière étape</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Récapitulatif */}
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
                      <p className="font-medium text-foreground">Élève (Lycéen)</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Lycée :</span>
                      <p className="font-medium text-foreground">{formData.highSchool || "Non spécifié"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Classe - Série :</span>
                      <p className="font-medium text-foreground">
                        {formData.grade && formData.series ? `${formData.grade} ${formData.series}` : "Non spécifié"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email :</span>
                      <p className="font-medium text-foreground">{formData.email || "Non spécifié"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Département :</span>
                      <p className="font-medium text-foreground">
                        {formData.preferredDepartment || "Non spécifié"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cotisation */}
                <div className="bg-gradient-to-br from-brand-subtle to-brand-primary/10 rounded-lg p-6">
                  <h3 className="font-bold text-foreground mb-2">Cotisation annuelle</h3>
                  <div className="text-3xl font-bold text-brand-primary mb-2">
                    5 000 FCFA
                  </div>
                  <p className="text-sm text-foreground">
                    Cotisation élève pour l'année académique. Comprend l'accès à toutes les activités, 
                    formations et le camp biblique national.
                  </p>
                </div>

                {/* Engagement checkboxes */}
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
                      J'ai lu et j'accepte la charte des membres de l'ACEEPCI. Je m'engage à respecter
                      tous les principes et valeurs de l'association. <span className="text-red-500">*</span>
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
                      Je m'engage à payer ma cotisation annuelle de 5 000 FCFA dans un délai de
                      30 jours après validation. <span className="text-red-500">*</span>
                    </span>
                  </label>

                  <label className="flex items-start gap-3 p-4 border-2 border-brand-primary/30 bg-brand-subtle rounded-lg cursor-pointer hover:border-brand-primary transition-colors">
                    <input
                      type="checkbox"
                      name="parentalConsent"
                      checked={formData.parentalConsent}
                      onChange={handleInputChange}
                      required
                      className="mt-1 w-5 h-5 text-brand-primary border-border rounded focus:ring-brand-primary"
                    />
                    <span className="text-sm text-foreground">
                      Je confirme que mes parents/tuteurs sont informés et consentent à mon adhésion 
                      à l'ACEEPCI. <span className="text-red-500">*</span>
                    </span>
                  </label>
                </div>

                <div className="bg-brand-subtle border border-brand-primary/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-foreground">
                      <p className="font-semibold mb-1">Prochaines étapes :</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Examen de votre dossier sous 5-7 jours</li>
                        <li>Email de confirmation avec détails de paiement</li>
                        <li>Accueil dans votre département local</li>
                        <li>Remise de votre carte de membre</li>
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
                disabled={!formData.acceptCharter || !formData.acceptPayment || !formData.parentalConsent}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white font-semibold rounded-lg hover:opacity-95 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-5 h-5" />
                Soumettre ma demande
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
