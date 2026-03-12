"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle,
  Church,
  CreditCard,
  FileText,
  GraduationCap,
  Heart,
  Phone,
  Upload,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { DatePicker } from "@/components/ui/date-picker";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  publicOptionsApi,
  type PublicOptionItem,
  type AdminMemberCreateBody,
  type AdminMemberCreateFiles,
  createPublicMember,
} from "@/lib/api";
import { getMembershipFeeFromName, memberCharterItems } from "@/lib/memberFormConfig";
import { toast } from "sonner";

type SelectOption = {
  id: number;
  name: string;
  city_id?: number | null;
};

export type PublicFormState = {
  firstname: string;
  lastname: string;
  birth_date: string;
  birth_place: string;
  sex: "" | "homme" | "femme";
  nationality: string;
  phone: string;
  email: string;
  address: string;
  city_id: string;
  district_id: string;
  desired_service_department_id: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  member_type_id: string;
  institution: string;
  level: string;
  field: string;
  profession: string;
  company: string;
  local_church: string;
  pastor: string;
  born_again: string;
  baptized: string;
  church_service: string;
  how_did_you_know: string;
  motivation: string;
  service_areas: string[];
  accept_charter: boolean;
  accept_payment: boolean;
};

const publicFormSchema = z.object({
  firstname: z.string().min(1, "Le prénom est requis."),
  lastname: z.string().min(1, "Le nom est requis."),
  birth_date: z.string().optional(),
  birth_place: z.string().optional(),
  sex: z.enum(["homme", "femme"], "Le sexe est requis.").or(z.literal("")),
  nationality: z.string().optional(),
  phone: z.string().min(1, "Le téléphone est requis."),
  email: z.string().email("Email invalide.").optional().or(z.literal("")),
  address: z.string().optional(),
  city_id: z.string().optional(),
  district_id: z.string().optional(),
  desired_service_department_id: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  member_type_id: z.string().min(1, "Le type de membre est requis."),
  institution: z.string().optional(),
  level: z.string().optional(),
  field: z.string().optional(),
  profession: z.string().optional(),
  company: z.string().optional(),
  local_church: z.string().optional(),
  pastor: z.string().optional(),
  born_again: z.string().optional(),
  baptized: z.string().optional(),
  church_service: z.string().optional(),
  how_did_you_know: z.string().optional(),
  motivation: z.string().optional(),
  service_areas: z.array(z.string()).optional().default([]),
  accept_charter: z.boolean().refine((val) => val, {
    message: "Vous devez accepter la charte.",
  }),
  accept_payment: z.boolean().refine((val) => val, {
    message: "Vous devez accepter l'engagement de paiement.",
  }),
});

const defaultPublicForm: PublicFormState = {
  firstname: "",
  lastname: "",
  birth_date: "",
  birth_place: "",
  sex: "",
  nationality: "",
  phone: "",
  email: "",
  address: "",
  city_id: "",
  district_id: "",
  desired_service_department_id: "",
  emergency_contact_name: "",
  emergency_contact_phone: "",
  member_type_id: "",
  institution: "",
  level: "",
  field: "",
  profession: "",
  company: "",
  local_church: "",
  pastor: "",
  born_again: "",
  baptized: "",
  church_service: "",
  how_did_you_know: "",
  motivation: "",
  service_areas: [],
  accept_charter: false,
  accept_payment: false,
};

const inputClassName =
  "w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary";

export function MemberFormWithStepsPublic() {
  const [currentStep, setCurrentStep] = useState(1);
  const formMethods = useForm<PublicFormState>({
    resolver: zodResolver(publicFormSchema),
    mode: "onBlur",
    defaultValues: defaultPublicForm,
  });
  const {
    control,
    handleSubmit: rhfHandleSubmit,
    watch,
    reset,
    setValue,
  } = formMethods;
  const form = watch();
  const [identityPhoto, setIdentityPhoto] = useState<File | null>(null);
  const [idCard, setIdCard] = useState<File | null>(null);
  const [studentCard, setStudentCard] = useState<File | null>(null);
  const [pastorLetter, setPastorLetter] = useState<File | null>(null);

  const [cities, setCities] = useState<SelectOption[]>([]);
  const [districts, setDistricts] = useState<SelectOption[]>([]);
  const [departments, setDepartments] = useState<SelectOption[]>([]);
  const [memberTypes, setMemberTypes] = useState<SelectOption[]>([]);
  const [trainingDomains, setTrainingDomains] = useState<SelectOption[]>([]);
  const [serviceDomains, setServiceDomains] = useState<SelectOption[]>([]);
  const [academicLevels, setAcademicLevels] = useState<PublicOptionItem[]>([]);
  const [knowledgeSources, setKnowledgeSources] = useState<PublicOptionItem[]>([]);
  const [nationalities, setNationalities] = useState<PublicOptionItem[]>([]);
  const [memberLevels, setMemberLevels] = useState<PublicOptionItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const totalSteps = 6;

  const setField = <K extends keyof PublicFormState>(field: K, value: PublicFormState[K]) => {
    setValue(field, value, { shouldValidate: true, shouldDirty: true });
  };

  const selectedMemberTypeName = useMemo(
    () => memberTypes.find((item) => String(item.id) === form.member_type_id)?.name.toLowerCase() ?? "",
    [memberTypes, form.member_type_id]
  );

  const serviceAreaOptions = useMemo(
    () => serviceDomains.map((item) => item.name),
    [serviceDomains]
  );

  const filteredDistricts = useMemo(() => {
    if (!form.city_id) return [];
    return districts.filter((district) => String(district.city_id ?? "") === form.city_id);
  }, [districts, form.city_id]);

  const filteredAcademicLevels = useMemo(
    () => academicLevels.filter((item) => String(item.member_type_id ?? "") === form.member_type_id),
    [academicLevels, form.member_type_id]
  );

  const filteredMemberLevels = useMemo(
    () => memberLevels.filter((item) => String(item.member_type_id ?? "") === form.member_type_id),
    [memberLevels, form.member_type_id]
  );

  const isStudentMember =
    selectedMemberTypeName.includes("élève") ||
    selectedMemberTypeName.includes("eleve") ||
    selectedMemberTypeName.includes("étudiant") ||
    selectedMemberTypeName.includes("etudiant");

  const isWorkerMember =
    selectedMemberTypeName.includes("travailleur") ||
    selectedMemberTypeName.includes("alumni") ||
    selectedMemberTypeName.includes("worker");

  useEffect(() => {
    publicOptionsApi
      .cities({ per_page: 500 })
      .then(setCities)
      .catch(() => setCities([]));

    publicOptionsApi
      .districts({ per_page: 500 })
      .then(setDistricts)
      .catch(() => setDistricts([]));

    publicOptionsApi
      .departments({ per_page: 500 })
      .then(setDepartments)
      .catch(() => setDepartments([]));

    publicOptionsApi
      .memberTypes({ per_page: 500 })
      .then(setMemberTypes)
      .catch(() => setMemberTypes([]));

    publicOptionsApi
      .trainingDomains({ per_page: 500 })
      .then(setTrainingDomains)
      .catch(() => setTrainingDomains([]));

    publicOptionsApi
      .serviceDomains({ per_page: 500 })
      .then(setServiceDomains)
      .catch(() => setServiceDomains([]));

    publicOptionsApi
      .academicLevels({ per_page: 500 })
      .then(setAcademicLevels)
      .catch(() => setAcademicLevels([]));

    publicOptionsApi
      .knowledgeSources({ per_page: 500 })
      .then(setKnowledgeSources)
      .catch(() => setKnowledgeSources([]));

    publicOptionsApi
      .nationalities({ per_page: 500 })
      .then(setNationalities)
      .catch(() => setNationalities([]));

    publicOptionsApi
      .memberLevels({ per_page: 500 })
      .then(setMemberLevels)
      .catch(() => setMemberLevels([]));
  }, []);

  useEffect(() => {
    if (form.district_id && !filteredDistricts.some((district) => String(district.id) === form.district_id)) {
      setField("district_id", "");
    }
  }, [filteredDistricts, form.district_id]);

  useEffect(() => {
    if (!isStudentMember) {
      if (form.institution) setField("institution", "");
      if (form.level) setField("level", "");
      if (form.field) setField("field", "");
      return;
    }

    if (filteredAcademicLevels.length > 0 && form.level && !filteredAcademicLevels.some((option) => String(option.id) === form.level)) {
      setField("level", "");
    }
  }, [filteredAcademicLevels, form.field, form.institution, form.level, isStudentMember]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (file: File | null) => void) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    setter(file);
    e.target.value = "";
  };

  const handleServiceAreaToggle = (area: string) => {
    const next = form.service_areas.includes(area)
      ? form.service_areas.filter((item) => item !== area)
      : [...form.service_areas, area];
    setField("service_areas", next);
  };

  const getMembershipFee = () => getMembershipFeeFromName(selectedMemberTypeName);

  const requiredFieldsByStep: Record<number, (keyof PublicFormState)[]> = {
    1: ["lastname", "firstname", "sex"],
    2: ["phone"],
    3: ["member_type_id"],
    4: [],
    5: [],
    6: [],
  };

  const nextStep = async () => {
    const fields = requiredFieldsByStep[currentStep] ?? [];
    if (fields.length > 0) {
      // Typage générique de RHF un peu strict, on caste pour cibler seulement ces champs
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ok = await formMethods.trigger(fields as any);
      if (!ok) {
        toast.error("Veuillez remplir les champs obligatoires de cette étape.");
        return;
      }
    }
    setCurrentStep((step) => Math.min(totalSteps, step + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevStep = () => {
    setCurrentStep((step) => Math.max(1, step - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const isValid = await formMethods.trigger();
    if (!isValid) {
      toast.error("Veuillez corriger les erreurs du formulaire.");
      return;
    }

    const memberTypeId = Number(form.member_type_id) || 0;

    const defaultMemberLevel = filteredMemberLevels.length > 0 ? filteredMemberLevels[0] : undefined;
    const memberLevelId = defaultMemberLevel ? defaultMemberLevel.id : 0;

    if (!memberLevelId) {
      toast.error("Aucun niveau de membre n'est configuré pour ce type. Veuillez contacter l'administrateur.");
      return;
    }

    const fieldOfStudyName =
      form.field && trainingDomains.length > 0
        ? trainingDomains.find((d) => String(d.id) === form.field)?.name ?? ""
        : "";

    const serviceDomainIds =
      form.service_areas.length > 0
        ? form.service_areas
            .map((name) => serviceDomains.find((d) => d.name === name)?.id)
            .filter((id): id is number => id != null)
        : [];

    const payload: AdminMemberCreateBody = {
      firstname: form.firstname.trim(),
      lastname: form.lastname.trim(),
      sex: form.sex || "homme",
      phone: form.phone.trim(),
      member_type_id: memberTypeId,
      member_level_id: memberLevelId,
      birth_date: form.birth_date || null,
      birth_place: form.birth_place.trim() || null,
      nationality_id: form.nationality ? Number(form.nationality) : null,
      email: form.email.trim() || null,
      address: form.address.trim() || null,
      city_id: form.city_id ? Number(form.city_id) : null,
      district_id: form.district_id ? Number(form.district_id) : null,
      desired_service_department_id: form.desired_service_department_id ? Number(form.desired_service_department_id) : null,
      emergency_contact_name: form.emergency_contact_name.trim() || null,
      emergency_contact_phone: form.emergency_contact_phone.trim() || null,
      academic_level_id: form.level ? Number(form.level) : null,
      institution: form.institution.trim() || null,
      field_of_study: fieldOfStudyName || null,
      profession: form.profession.trim() || null,
      company: form.company.trim() || null,
      local_church: form.local_church.trim() || null,
      pastor_name: form.pastor.trim() || null,
      is_born_again: form.born_again === "Oui" ? true : form.born_again === "Non" ? false : null,
      is_baptized: form.baptized === "Oui" ? true : form.baptized === "Non" ? false : null,
      church_service_experience: form.church_service.trim() || null,
      heard_about_source_id: form.how_did_you_know ? Number(form.how_did_you_know) : null,
      motivation: form.motivation.trim() || null,
      accept_charter: form.accept_charter,
      accept_payment: form.accept_payment,
      service_domain_ids: serviceDomainIds.length > 0 ? serviceDomainIds : null,
    };

    const files: AdminMemberCreateFiles = {
      identityPhoto,
      identityDocument: idCard,
      pastorAttestation: pastorLetter,
      studentCertificate: studentCard,
    };

    try {
      setSubmitting(true);
      const res = await createPublicMember(payload, files);
      toast.success(res.message || "Votre demande d'adhésion a été soumise. Merci !");
      reset(defaultPublicForm);
      setIdentityPhoto(null);
      setIdCard(null);
      setStudentCard(null);
      setPastorLetter(null);
      setCurrentStep(1);
    } catch (err) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Une erreur est survenue lors de l'envoi du formulaire.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedMemberTypeLabel =
    memberTypes.find((t) => String(t.id) === form.member_type_id)?.name || "ACEEPCI";

  return (
    <Form {...formMethods}>
      <form onSubmit={handleSubmit} className="mx-auto max-w-5xl rounded-xl border border-border bg-white shadow-sm">
      <div className="border-b border-border px-4 py-4 sm:px-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            Étape {currentStep} sur {totalSteps}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round((currentStep / totalSteps) * 100)}% complété
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-border">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-brand-primary to-brand-accent transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <div className="mt-4 flex justify-between text-xs">
          <div className={`flex items-center gap-1 ${currentStep >= 1 ? "text-brand-primary" : "text-muted-foreground"}`}>
            {currentStep > 1 ? <CheckCircle className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border-2 border-current" />}
            <span className="hidden sm:inline">Personnel</span>
          </div>
          <div className={`flex items-center gap-1 ${currentStep >= 2 ? "text-brand-primary" : "text-muted-foreground"}`}>
            {currentStep > 2 ? <CheckCircle className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border-2 border-current" />}
            <span className="hidden sm:inline">Contact</span>
          </div>
          <div className={`flex items-center gap-1 ${currentStep >= 3 ? "text-brand-primary" : "text-muted-foreground"}`}>
            {currentStep > 3 ? <CheckCircle className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border-2 border-current" />}
            <span className="hidden sm:inline">Académique</span>
          </div>
          <div className={`flex items-center gap-1 ${currentStep >= 4 ? "text-brand-primary" : "text-muted-foreground"}`}>
            {currentStep > 4 ? <CheckCircle className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border-2 border-current" />}
            <span className="hidden sm:inline">Spirituel</span>
          </div>
          <div className={`flex items-center gap-1 ${currentStep >= 5 ? "text-brand-primary" : "text-muted-foreground"}`}>
            {currentStep > 5 ? <CheckCircle className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border-2 border-current" />}
            <span className="hidden sm:inline">Documents</span>
          </div>
          <div className={`flex items-center gap-1 ${currentStep >= 6 ? "text-brand-primary" : "text-muted-foreground"}`}>
            <div className="h-4 w-4 rounded-full border-2 border-current" />
            <span className="hidden sm:inline">Validation</span>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {currentStep === 1 && (
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/10">
                <User className="h-6 w-6 text-brand-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Informations personnelles</h2>
                <p className="text-muted-foreground">Vos données personnelles de base</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  control={control as any}
                  name="lastname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nom <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <input
                          {...field}
                          className={inputClassName}
                          placeholder="Votre nom de famille"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  control={control as any}
                  name="firstname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Prénom(s) <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <input
                          {...field}
                          className={inputClassName}
                          placeholder="Vos prénom(s)"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Date de naissance
                  </label>
                  <DatePicker
                    value={form.birth_date || undefined}
                    onChange={(v) => setField("birth_date", v)}
                    placeholder="jj / mm / aaaa"
                    aria-label="Date de naissance"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Lieu de naissance
                  </label>
                  <input
                    type="text"
                    value={form.birth_place}
                    onChange={(e) => setField("birth_place", e.target.value)}
                    className={inputClassName}
                    placeholder="Ville, Pays"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  control={control as any}
                  name="sex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Sexe <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className={inputClassName}
                          aria-label="Sexe"
                        >
                          <option value="">Sélectionner</option>
                          <option value="homme">Homme</option>
                          <option value="femme">Femme</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nationalité
                  </label>
                  <select
                    value={form.nationality}
                    onChange={(e) => setField("nationality", e.target.value)}
                    className={inputClassName}
                    aria-label="Nationalité"
                  >
                    <option value="">Sélectionner</option>
                    {nationalities.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Photo d&apos;identité
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-brand-primary transition-colors">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setIdentityPhoto)}
                    className="hidden"
                    id="identity-photo-public"
                    aria-label="Photo d'identité"
                  />
                  <label htmlFor="identity-photo-public" className="cursor-pointer font-medium text-brand-primary hover:opacity-90">
                    Choisir une photo
                  </label>
                  <span className="text-muted-foreground"> ou glisser-déposer</span>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WebP jusqu&apos;à 5MB</p>
                  {identityPhoto && (
                    <p className="text-sm text-brand-primary mt-2 flex items-center justify-center gap-1">
                      <Check className="w-4 h-4" />
                      {identityPhoto.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6 text-brand-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Informations de contact</h2>
                <p className="text-muted-foreground">Comment vous joindre et votre localisation</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  control={control as any}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Téléphone <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <input
                          {...field}
                          type="tel"
                          className={inputClassName}
                          placeholder="+225 XX XX XX XX XX"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  control={control as any}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <input
                          {...field}
                          type="email"
                          className={inputClassName}
                          placeholder="votre.email@exemple.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse complète</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        className={inputClassName}
                        placeholder="Rue, résidence, repère"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-3 gap-6">
                <FormField
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  control={control as any}
                  name="city_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ville</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className={inputClassName}
                          aria-label="Ville"
                        >
                          <option value="">Sélectionner une ville</option>
                          {cities.map((city) => (
                            <option key={city.id} value={city.id}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Commune / Quartier
                  </label>
                  <select
                    value={form.district_id}
                    onChange={(e) => setField("district_id", e.target.value)}
                    className={inputClassName}
                    aria-label="Commune ou quartier"
                    disabled={!form.city_id}
                  >
                    <option value="">
                      {form.city_id ? "Sélectionner une commune / un quartier" : "Choisissez d'abord une ville"}
                    </option>
                    {filteredDistricts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Département ACEEPCI souhaité
                  </label>
                  <select
                    value={form.desired_service_department_id}
                    onChange={(e) => setField("desired_service_department_id", e.target.value)}
                    className={inputClassName}
                    aria-label="Département ACEEPCI souhaité"
                  >
                    <option value="">Sélectionner un département</option>
                    {departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-brand-subtle border border-brand-primary/20 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-brand-primary" />
                  Contact d&apos;urgence
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      value={form.emergency_contact_name}
                      onChange={(e) => setField("emergency_contact_name", e.target.value)}
                      className={inputClassName}
                      placeholder="Nom du contact d'urgence"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={form.emergency_contact_phone}
                      onChange={(e) => setField("emergency_contact_phone", e.target.value)}
                      className={inputClassName}
                      placeholder="+225 XX XX XX XX XX"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-brand-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Informations académiques / professionnelles</h2>
                <p className="text-muted-foreground">Votre statut et parcours</p>
              </div>
            </div>

            <div className="space-y-6">
                <FormField
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  control={control as any}
                  name="member_type_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Type de membre <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className={inputClassName}
                          aria-label="Type de membre"
                        >
                          <option value="">Sélectionner</option>
                          {memberTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              {isStudentMember && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Établissement
                    </label>
                    <input
                      type="text"
                      value={form.institution}
                      onChange={(e) => setField("institution", e.target.value)}
                      className={inputClassName}
                      placeholder="Nom de l'école ou université"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Niveau / Classe
                      </label>
                      <select
                        value={form.level}
                        onChange={(e) => setField("level", e.target.value)}
                        className={inputClassName}
                        aria-label="Niveau ou classe"
                      >
                        <option value="">Sélectionner</option>
                        {filteredAcademicLevels.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Filière / Domaine
                      </label>
                      <select
                        value={form.field}
                        onChange={(e) => setField("field", e.target.value)}
                        className={inputClassName}
                        aria-label="Filière ou domaine"
                      >
                        <option value="">Sélectionner</option>
                        {trainingDomains.map((domain) => (
                          <option key={domain.id} value={domain.id}>
                            {domain.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}

              {isWorkerMember && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Profession
                    </label>
                    <input
                      type="text"
                      value={form.profession}
                      onChange={(e) => setField("profession", e.target.value)}
                      className={inputClassName}
                      placeholder="Votre profession"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Entreprise / Organisation
                    </label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setField("company", e.target.value)}
                      className={inputClassName}
                      placeholder="Nom de l'entreprise"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
                <Church className="w-6 h-6 text-brand-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Informations spirituelles</h2>
                <p className="text-muted-foreground">Votre parcours de foi et engagement</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Église locale
                  </label>
                  <input
                    type="text"
                    value={form.local_church}
                    onChange={(e) => setField("local_church", e.target.value)}
                    className={inputClassName}
                    placeholder="Nom de l'église"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Pasteur / Responsable
                  </label>
                  <input
                    type="text"
                    value={form.pastor}
                    onChange={(e) => setField("pastor", e.target.value)}
                    className={inputClassName}
                    placeholder="Nom du pasteur"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Êtes-vous né(e) de nouveau ?
                  </label>
                  <select
                    value={form.born_again}
                    onChange={(e) => setField("born_again", e.target.value)}
                    className={inputClassName}
                    aria-label="Êtes-vous né(e) de nouveau"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Oui">Oui</option>
                    <option value="Non">Non</option>
                    <option value="En réflexion">En réflexion</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Avez-vous été baptisé(e) d'eau ?
                  </label>
                  <select
                    value={form.baptized}
                    onChange={(e) => setField("baptized", e.target.value)}
                    className={inputClassName}
                    aria-label="Avez-vous été baptisé(e) d'eau"
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
                  value={form.church_service}
                  onChange={(e) => setField("church_service", e.target.value)}
                  rows={4}
                  className={inputClassName}
                  placeholder="Décrivez vos expériences de service dans votre église locale"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Domaines de service souhaités à l&apos;ACEEPCI
                </label>
                <p className="text-sm text-muted-foreground mb-3">
                  Sélectionnez un ou plusieurs domaines où vous aimeriez servir.
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  {serviceAreaOptions.map((area) => (
                    <label
                      key={area}
                      className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        form.service_areas.includes(area)
                          ? "border-brand-primary bg-brand-subtle"
                          : "border-border hover:border-brand-primary/40"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={form.service_areas.includes(area)}
                        onChange={() => handleServiceAreaToggle(area)}
                        className="w-5 h-5 text-brand-primary border-border rounded focus:ring-brand-primary"
                      />
                      <span className="text-sm font-medium text-foreground">{area}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Comment avez-vous connu l&apos;ACEEPCI ?
                </label>
                <select
                  value={form.how_did_you_know}
                  onChange={(e) => setField("how_did_you_know", e.target.value)}
                  className={inputClassName}
                  aria-label="Comment avez-vous connu l'ACEEPCI"
                >
                  <option value="">Sélectionner</option>
                  {knowledgeSources.map((source) => (
                    <option key={source.id} value={source.id}>
                      {source.name}
                    </option>
                  ))}
                </select>
              </div>

              <FormField
                control={control}
                name="motivation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pourquoi souhaitez-vous rejoindre l&apos;ACEEPCI ?</FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        rows={4}
                        className={inputClassName}
                        placeholder="Partagez vos motivations et ce que vous espérez trouver/apporter à l'ACEEPCI..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

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
              <div className="bg-brand-subtle border border-brand-primary/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-foreground">
                    <p className="font-semibold mb-1">Documents requis :</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Copie de la carte d'identité nationale ou attestation</li>
                      <li>Certificat de scolarité ou carte d'étudiant (pour élèves/étudiants)</li>
                      <li>Attestation du pasteur (optionnel mais recommandé)</li>
                    </ul>
                    <p className="mt-2">Formats acceptés : PDF, JPG, PNG (max 5MB par fichier)</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Carte d&apos;identité / Attestation
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-brand-primary transition-colors">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, setIdCard)}
                    className="hidden"
                    id="idcard-upload-public"
                    aria-label="Carte d'identité ou attestation"
                  />
                  <label htmlFor="idcard-upload-public" className="cursor-pointer font-medium text-brand-primary hover:opacity-90">
                    Choisir un fichier
                  </label>
                  <span className="text-muted-foreground"> ou glisser-déposer</span>
                  <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG jusqu&apos;à 5MB</p>
                  {idCard && (
                    <p className="text-sm text-brand-primary mt-2 flex items-center justify-center gap-1">
                      <Check className="w-4 h-4" />
                      {idCard.name}
                    </p>
                  )}
                </div>
              </div>

              {isStudentMember && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Certificat de scolarité / Carte d&apos;étudiant
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-brand-primary transition-colors">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, setStudentCard)}
                      className="hidden"
                      id="student-upload-public"
                      aria-label="Certificat de scolarité ou carte d'étudiant"
                    />
                    <label htmlFor="student-upload-public" className="cursor-pointer font-medium text-brand-primary hover:opacity-90">
                      Choisir un fichier
                    </label>
                    <span className="text-muted-foreground"> ou glisser-déposer</span>
                    <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG jusqu&apos;à 5MB</p>
                    {studentCard && (
                      <p className="text-sm text-brand-primary mt-2 flex items-center justify-center gap-1">
                        <Check className="w-4 h-4" />
                        {studentCard.name}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Attestation du pasteur <span className="text-muted-foreground">(Optionnel)</span>
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-brand-primary transition-colors">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, setPastorLetter)}
                    className="hidden"
                    id="pastor-upload-public"
                    aria-label="Attestation du pasteur"
                  />
                  <label htmlFor="pastor-upload-public" className="cursor-pointer font-medium text-brand-primary hover:opacity-90">
                    Choisir un fichier
                  </label>
                  <span className="text-muted-foreground"> ou glisser-déposer</span>
                  <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG jusqu&apos;à 5MB</p>
                  {pastorLetter && (
                    <p className="text-sm text-brand-primary mt-2 flex items-center justify-center gap-1">
                      <Check className="w-4 h-4" />
                      {pastorLetter.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-brand-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Validation et engagement</h2>
                <p className="text-muted-foreground">Dernière étape avant de rejoindre la famille</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-brand-subtle rounded-lg p-6">
                <h3 className="font-bold text-foreground mb-4">Récapitulatif de votre demande</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Nom complet :</span>
                    <p className="font-medium text-foreground">
                      {form.firstname} {form.lastname}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Type de membre :</span>
                    <p className="font-medium text-foreground">
                      {selectedMemberTypeLabel || "Non spécifié"}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email :</span>
                    <p className="font-medium text-foreground">{form.email || "Non spécifié"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Téléphone :</span>
                    <p className="font-medium text-foreground">{form.phone || "Non spécifié"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Église locale :</span>
                    <p className="font-medium text-foreground">{form.local_church || "Non spécifié"}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-brand-subtle to-brand-primary/10 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground mb-2">Cotisation annuelle</h3>
                    <p className="text-sm text-foreground mb-3">
                      En tant que membre {selectedMemberTypeLabel}, la cotisation annuelle est de :
                    </p>
                    <div className="text-3xl font-bold text-brand-primary mb-3">
                      {getMembershipFee()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-2 border-border rounded-lg p-6">
                <h3 className="font-bold text-foreground mb-3">Charte des membres ACEEPCI</h3>
                <div className="bg-brand-subtle rounded-lg p-4 max-h-64 overflow-y-auto text-sm text-foreground space-y-2">
                  <p className="font-semibold">En tant que membre de l&apos;ACEEPCI, je m&apos;engage à :</p>
                  <ul className="list-disc list-inside space-y-1">
                    {memberCharterItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <FormField
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  control={control as any}
                  name="accept_charter"
                  render={({ field }) => (
                    <FormItem>
                      <label className="flex items-start gap-3 p-4 border-2 border-border rounded-lg cursor-pointer hover:border-brand-primary transition-colors">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            className="mt-1 w-5 h-5 text-brand-primary border-border rounded focus:ring-brand-primary"
                          />
                        </FormControl>
                        <span className="text-sm text-foreground">
                          J&apos;ai lu et j&apos;accepte la charte des membres de l&apos;ACEEPCI.
                          <span className="text-red-500"> *</span>
                        </span>
                      </label>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  control={control as any}
                  name="accept_payment"
                  render={({ field }) => (
                    <FormItem>
                      <label className="flex items-start gap-3 p-4 border-2 border-border rounded-lg cursor-pointer hover:border-brand-primary transition-colors">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            className="mt-1 w-5 h-5 text-brand-primary border-border rounded focus:ring-brand-primary"
                          />
                        </FormControl>
                        <span className="text-sm text-foreground">
                          Je m&apos;engage à payer la cotisation annuelle de {getMembershipFee()} dans les délais.
                          <span className="text-red-500"> *</span>
                        </span>
                      </label>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="bg-brand-subtle border border-brand-primary/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-foreground">
                    <p className="font-semibold mb-1">Que se passe-t-il après la soumission ?</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Votre dossier sera examiné par un responsable ACEEPCI</li>
                      <li>Vous recevrez une réponse par email ou téléphone</li>
                      <li>Vous serez contacté(e) pour votre intégration dans un département</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
            <span />
          )}

          {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={() => {
                  void nextStep();
                }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white font-semibold rounded-lg hover:opacity-95 transition-colors"
            >
              Suivant
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!form.accept_charter || !form.accept_payment || submitting}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white font-semibold rounded-lg hover:opacity-95 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-5 h-5" />
              {submitting ? "Envoi..." : "Soumettre ma demande"}
            </button>
          )}
        </div>
      </div>
      </form>
    </Form>
  );
}

