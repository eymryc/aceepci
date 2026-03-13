"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Church,
  CreditCard,
  FileText,
  GraduationCap,
  Heart,
  Phone,
  Upload,
  User,
} from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";
import { AdminButton, AdminPageHeader } from "@/components/admin";
import { useAuth } from "@/contexts/AuthContext";
import {
  academicLevelsApi,
  adminMembersApi,
  citiesApi,
  departmentsApi,
  districtsApi,
  knowledgeSourcesApi,
  memberLevelsApi,
  memberTypesApi,
  nationalitiesApi,
  resolveMemberImageUrl,
  serviceDomainsApi,
  trainingDomainsApi,
  type AdminMemberCreateBody,
  type AdminMemberListItem,
  type LabeledSettingItem,
} from "@/lib/api";
import { getMembershipFeeFromName, memberCharterItems } from "@/lib/memberFormConfig";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const inputClassName =
  "w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary";

export type FormState = {
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
  member_level: string;
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

type SelectOption = {
  id: number;
  name: string;
  city_id?: number;
};

export const defaultForm: FormState = {
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
  member_level: "",
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

/** Récupère une valeur depuis le membre ou form_data (plusieurs clés possibles) */
function getMemberVal(
  m: Record<string, unknown>,
  keys: string[],
  def: string | number = ""
): string {
  const fd = (m.form_data ?? m.formData) as Record<string, unknown> | undefined;
  for (const key of keys) {
    const v = m[key] ?? fd?.[key];
    if (v !== undefined && v !== null && v !== "") return String(v);
  }
  return String(def);
}

function memberToFormState(m: AdminMemberListItem & { name?: string; form_data?: Record<string, unknown>; formData?: Record<string, unknown> }): FormState {
  const city = m.city as { id?: number; name?: string } | undefined;
  const district = m.district as { id?: number; name?: string } | undefined;
  const nationality = m.nationality as { id?: number; name?: string } | undefined;
  const dep = m.desired_service_department as { id?: number } | undefined;
  const mt = m.member_type as { id?: number } | undefined;
  const ml = m.member_level as { id?: number } | undefined;
  const al = m.academic_level as { id?: number } | undefined;
  const fs = m.field_of_study as { id?: number } | undefined;
  const hs = m.heard_about_source as { id?: number } | undefined;

  const fd = (m.form_data ?? m.formData) as Record<string, unknown> | undefined;
  const raw = { ...m, ...fd } as Record<string, unknown>;

  const saRaw = raw.service_areas ?? raw.service_domains ?? raw.desired_service_domains ?? m.service_areas;
  const sa = Array.isArray(saRaw) ? saRaw : [];
  const serviceAreas = sa.map((x) => (typeof x === "string" ? x : (x as { name?: string })?.name ?? String(x)));

  const birthDate = (raw.birth_date ?? m.birth_date) as string | undefined;
  const bd = birthDate ? (String(birthDate).includes("T") ? String(birthDate).split("T")[0] : String(birthDate)) : "";

  return {
    firstname: getMemberVal(raw, ["firstname", "firstName"]),
    lastname: getMemberVal(raw, ["lastname", "lastName"]),
    birth_date: bd,
    birth_place: getMemberVal(raw, ["birth_place", "birthPlace"]),
    sex: (getMemberVal(raw, ["sex", "gender"]) as "" | "homme" | "femme") || "",
    nationality: String((nationality?.id ?? raw.nationality_id ?? raw.nationality ?? "")),
    phone: getMemberVal(raw, ["phone"]),
    email: getMemberVal(raw, ["email"]),
    address: getMemberVal(raw, ["address"]),
    city_id: String(
      city?.id ??
      raw.city_id ??
      (typeof raw.city === "object" && raw.city !== null && "id" in raw.city ? (raw.city as { id: number }).id : raw.city) ??
      ""
    ),
    district_id: String(
      district?.id ??
      raw.district_id ??
      (typeof raw.district === "object" && raw.district !== null && "id" in raw.district ? (raw.district as { id: number }).id : raw.district) ??
      ""
    ),
    desired_service_department_id: String((dep?.id ?? raw.desired_service_department_id ?? "")),
    emergency_contact_name: getMemberVal(raw, ["emergency_contact_name", "emergencyContactName"]),
    emergency_contact_phone: getMemberVal(raw, ["emergency_contact_phone", "emergencyContactPhone"]),
    member_type_id: String((mt?.id ?? raw.member_type_id ?? "")),
    member_level: String((ml?.id ?? raw.member_level_id ?? raw.member_level ?? "")),
    institution: getMemberVal(raw, ["institution", "school", "establishment", "university"]),
    level: String((al?.id ?? raw.academic_level_id ?? raw.level ?? "")),
    field: String((fs?.id ?? raw.field_of_study_id ?? raw.field ?? raw.field_of_study ?? "")),
    profession: getMemberVal(raw, ["profession"]),
    company: getMemberVal(raw, ["company"]),
    local_church: getMemberVal(raw, ["local_church", "localChurch", "church_name"]),
    pastor: getMemberVal(raw, ["pastor", "pastor_name"]),
    born_again: (() => {
      const v = raw.is_born_again ?? raw.born_again ?? raw.bornAgain;
      if (v === true || v === "1" || v === 1) return "Oui";
      if (v === false || v === "0" || v === 0) return "Non";
      return getMemberVal(raw, ["born_again", "bornAgain"]) || "";
    })(),
    baptized: (() => {
      const v = raw.is_baptized ?? raw.baptized;
      if (v === true || v === "1" || v === 1) return "Oui";
      if (v === false || v === "0" || v === 0) return "Non";
      return getMemberVal(raw, ["baptized"]) || "";
    })(),
    church_service: getMemberVal(raw, ["church_service_experience", "church_service", "churchService"]),
    how_did_you_know: String((hs?.id ?? raw.heard_about_source_id ?? raw.how_did_you_know ?? "")),
    motivation: getMemberVal(raw, ["motivation"]),
    service_areas: serviceAreas,
    accept_charter: raw.accept_charter === "1" || raw.accept_charter === true || raw.accept_charter === 1,
    accept_payment: raw.accept_payment === "1" || raw.accept_payment === true || raw.accept_payment === 1,
  };
}

interface MemberFormWithStepsProps {
  memberId?: number;
}

export function MemberFormWithSteps({ memberId }: MemberFormWithStepsProps) {
  const router = useRouter();
  const { token } = useAuth();
  const identityPhotoInputRef = useRef<HTMLInputElement | null>(null);
  const idCardInputRef = useRef<HTMLInputElement | null>(null);
  const studentCardInputRef = useRef<HTMLInputElement | null>(null);
  const pastorLetterInputRef = useRef<HTMLInputElement | null>(null);

  const isEdit = Boolean(memberId);

  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [identityPhoto, setIdentityPhoto] = useState<File | null>(null);
  const [idCard, setIdCard] = useState<File | null>(null);
  const [studentCard, setStudentCard] = useState<File | null>(null);
  const [pastorLetter, setPastorLetter] = useState<File | null>(null);
  const [existingImageUrls, setExistingImageUrls] = useState<{
    identityPhoto?: string;
    idCard?: string;
    studentCard?: string;
    pastorLetter?: string;
  }>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMember, setLoadingMember] = useState(isEdit);
  const [formError, setFormError] = useState<string | null>(null);
  const [cities, setCities] = useState<SelectOption[]>([]);
  const [districts, setDistricts] = useState<SelectOption[]>([]);
  const [departments, setDepartments] = useState<SelectOption[]>([]);
  const [memberTypes, setMemberTypes] = useState<SelectOption[]>([]);
  const [trainingDomains, setTrainingDomains] = useState<SelectOption[]>([]);
  const [serviceDomains, setServiceDomains] = useState<SelectOption[]>([]);
  const [memberLevels, setMemberLevels] = useState<LabeledSettingItem[]>([]);
  const [academicLevels, setAcademicLevels] = useState<LabeledSettingItem[]>([]);
  const [knowledgeSources, setKnowledgeSources] = useState<LabeledSettingItem[]>([]);
  const [nationalities, setNationalities] = useState<{ id: number; name: string }[]>([]);

  const totalSteps = 6;

  const setField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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

  const filteredMemberLevels = useMemo(
    () => memberLevels.filter((item) => String(item.member_type_id ?? "") === form.member_type_id),
    [memberLevels, form.member_type_id]
  );

  const filteredAcademicLevels = useMemo(
    () => academicLevels.filter((item) => String(item.member_type_id ?? "") === form.member_type_id),
    [academicLevels, form.member_type_id]
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

  const fetchOptions = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [
        citiesRes,
        districtsRes,
        departmentsRes,
        memberTypesRes,
        trainingDomainsRes,
        serviceDomainsRes,
        memberLevelsRes,
        academicLevelsRes,
        knowledgeSourcesRes,
        nationalitiesRes,
      ] = await Promise.all([
        citiesApi.list(token, { per_page: 500 }),
        districtsApi.list(token, { per_page: 500 }),
        departmentsApi.list(token, { per_page: 500 }),
        memberTypesApi.list(token, { per_page: 500 }),
        trainingDomainsApi.list(token, { per_page: 500 }),
        serviceDomainsApi.list(token, { per_page: 500 }),
        memberLevelsApi.list(token, { per_page: 500 }),
        academicLevelsApi.list(token, { per_page: 500 }),
        knowledgeSourcesApi.list(token, { per_page: 500 }),
        nationalitiesApi.list(token, { per_page: 500 }),
      ]);

      setCities(Array.isArray(citiesRes.data) ? citiesRes.data : []);
      setDistricts(Array.isArray(districtsRes.data) ? districtsRes.data : []);
      setDepartments(Array.isArray(departmentsRes.data) ? departmentsRes.data : []);
      setMemberTypes(Array.isArray(memberTypesRes.data) ? memberTypesRes.data : []);
      setTrainingDomains(Array.isArray(trainingDomainsRes.data) ? trainingDomainsRes.data : []);
      setServiceDomains(Array.isArray(serviceDomainsRes.data) ? serviceDomainsRes.data : []);
      setMemberLevels(Array.isArray(memberLevelsRes.data) ? memberLevelsRes.data : []);
      setAcademicLevels(Array.isArray(academicLevelsRes.data) ? academicLevelsRes.data : []);
      setKnowledgeSources(Array.isArray(knowledgeSourcesRes.data) ? knowledgeSourcesRes.data : []);
      setNationalities(Array.isArray(nationalitiesRes.data) ? nationalitiesRes.data : []);
    } catch {
      toast.error("Erreur lors du chargement des listes nécessaires.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  useEffect(() => {
    if (isEdit && memberId && token) {
      setLoadingMember(true);
      adminMembersApi
        .get(token, memberId)
        .then((member) => {
          const m = member as AdminMemberListItem & Record<string, unknown>;
          setForm(memberToFormState(m));
          const fd = (m.form_data ?? m.formData) as Record<string, unknown> | undefined;
          const raw = { ...m, ...fd } as Record<string, unknown>;
          const sources: Record<string, unknown>[] = [raw];
          if (fd && typeof fd === "object") sources.push(fd);
          const nested = (raw.form_data ?? raw.formData ?? raw.data) as Record<string, unknown> | undefined;
          if (nested && typeof nested === "object") sources.push(nested);
          const getImg = (keys: string[]) => {
            for (const src of sources) {
              for (const k of keys) {
                const v = src[k];
                if (v && typeof v === "string" && v.trim().length > 0) return resolveMemberImageUrl(v);
              }
            }
            return undefined;
          };
          const getFromMedia = (collectionNames: string[]) => {
            const media = (raw.media ?? raw.documents ?? raw.files ?? raw.attachments) as Array<{ collection_name?: string; type?: string; key?: string; url?: string }> | undefined;
            if (!Array.isArray(media)) return undefined;
            const item = media.find((x) => {
              const name = (x.collection_name ?? x.type ?? x.key ?? "").toString().toLowerCase();
              return collectionNames.some((n) => name.includes(n.replace(/_/g, "")));
            });
            const url = item?.url;
            if (url && typeof url === "string") return resolveMemberImageUrl(url);
            return undefined;
          };
          setExistingImageUrls({
            identityPhoto: getImg(["identity_photo_url", "identity_photo", "image_url", "photo_url", "image", "photo"]) ?? getFromMedia(["identityphoto", "identity_photo", "photo"]),
            idCard: getImg(["identity_document_url", "identity_document", "id_card_url", "id_card", "identity_card_url"]) ?? getFromMedia(["identitydocument", "identity_document", "idcard"]),
            studentCard: getImg(["student_certificate_url", "student_certificate", "student_card_url", "student_card", "certificate_url", "school_certificate_url"]) ?? getFromMedia(["studentcertificate", "student_certificate", "studentcard"]),
            pastorLetter: getImg(["pastor_attestation_url", "pastor_attestation", "pastor_letter_url", "pastor_letter", "attestation_url"]) ?? getFromMedia(["pastorattestation", "pastor_attestation", "pastorletter"]),
          });
        })
        .catch(() => {
          toast.error("Erreur lors du chargement du membre.");
          router.push("/admin/members");
        })
        .finally(() => setLoadingMember(false));
    }
  }, [isEdit, memberId, token, router]);

  useEffect(() => {
    if (form.district_id && !filteredDistricts.some((district) => String(district.id) === form.district_id)) {
      setField("district_id", "");
    }
  }, [filteredDistricts, form.district_id]);

  useEffect(() => {
    if (!form.member_type_id) {
      if (form.member_level) {
        setField("member_level", "");
      }
      return;
    }

    if (filteredMemberLevels.length > 0 && !filteredMemberLevels.some((option) => String(option.id) === form.member_level)) {
      setField("member_level", String(filteredMemberLevels[0].id));
      return;
    }

    if (memberLevels.length > 0 && filteredMemberLevels.length === 0 && form.member_level) {
      setField("member_level", "");
    }
  }, [filteredMemberLevels, form.member_level, form.member_type_id, memberLevels.length]);

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

  useEffect(() => {
    if (!form.how_did_you_know || knowledgeSources.length === 0) return;
    const byId = knowledgeSources.find((item) => String(item.id) === form.how_did_you_know);
    if (byId) return;
    const byName = knowledgeSources.find((item) => item.label === form.how_did_you_know || item.value === form.how_did_you_know);
    if (byName) setField("how_did_you_know", String(byName.id));
    else setField("how_did_you_know", "");
  }, [form.how_did_you_know, knowledgeSources]);

  useEffect(() => {
    if (!form.field || trainingDomains.length === 0) return;
    const byId = trainingDomains.find((d) => String(d.id) === form.field);
    if (byId) return;
    const byName = trainingDomains.find((d) => d.name === form.field);
    if (byName) setField("field", String(byName.id));
  }, [form.field, trainingDomains]);

  useEffect(() => {
    if (!form.level || academicLevels.length === 0) return;
    const byId = academicLevels.find((a) => String(a.id) === form.level);
    if (byId) return;
    const byLabel = academicLevels.find((a) => a.label === form.level || a.value === form.level);
    if (byLabel) setField("level", String(byLabel.id));
  }, [form.level, academicLevels]);

  useEffect(() => {
    if (!isWorkerMember) {
      if (form.profession) setField("profession", "");
      if (form.company) setField("company", "");
    }
  }, [form.company, form.profession, isWorkerMember]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void
  ) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isDocument = ["application/pdf", "image/jpeg", "image/png", "image/jpg"].includes(file.type);

    if (!isImage && !isDocument) {
      toast.error("Veuillez sélectionner un fichier valide.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Le fichier ne doit pas dépasser 5 Mo.");
      e.target.value = "";
      return;
    }

    setter(file);
    setFormError(null);
    e.target.value = "";
  };

  const handleServiceAreaToggle = (area: string) => {
    setForm((prev) => ({
      ...prev,
      service_areas: prev.service_areas.includes(area)
        ? prev.service_areas.filter((item) => item !== area)
        : [...prev.service_areas, area],
    }));
  };

  const openPicker = (ref: React.RefObject<HTMLInputElement | null>) => {
    ref.current?.click();
  };

  const getMembershipFee = () => getMembershipFeeFromName(selectedMemberTypeName);

  const validateStep = (step: number): string | null => {
    if (step === 1) {
      if (!form.lastname.trim()) return "Le nom est requis.";
      if (!form.firstname.trim()) return "Le prénom est requis.";
      if (!form.sex) return "Le sexe est requis.";
    }

    if (step === 2) {
      if (!form.phone.trim()) return "Le téléphone est requis.";
    }

    if (step === 3) {
      if (!form.member_type_id) return "Le type de membre est requis.";
    }

    return null;
  };

  const validateForm = (): string | null => {
    for (let step = 1; step <= totalSteps; step += 1) {
      const error = validateStep(step);
      if (error) return error;
    }
    return null;
  };

  const nextStep = () => {
    const error = validateStep(currentStep);
    if (error) {
      setFormError(error);
      toast.error(error);
      return;
    }
    setFormError(null);
    setCurrentStep((step) => Math.min(totalSteps, step + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevStep = () => {
    setFormError(null);
    setCurrentStep((step) => Math.max(1, step - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!token) {
      toast.error("Vous devez être connecté.");
      return;
    }

    const error = validateForm();
    if (error) {
      setFormError(error);
      toast.error(error);
      return;
    }

    const memberLevelId = form.member_level ? Number(form.member_level) : 0;
    if (!memberLevelId || !filteredMemberLevels.some((l) => String(l.id) === form.member_level)) {
      const msg =
        filteredMemberLevels.length === 0
          ? "Aucun niveau de membre n'est configuré pour ce type. Veuillez configurer les niveaux dans Paramètres → Niveaux de membre."
          : "Le niveau de membre sélectionné n'existe pas.";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    setSaving(true);
    setFormError(null);

    const fieldOfStudyName = form.field
      ? (trainingDomains.find((d) => String(d.id) === form.field)?.name ?? (Number.isNaN(Number(form.field)) ? form.field : ""))
      : null;

    const serviceDomainIds = form.service_areas
      .map((name) => serviceDomains.find((d) => d.name === name)?.id)
      .filter((id): id is number => id != null);

    try {
      const payload: AdminMemberCreateBody = {
        firstname: form.firstname.trim(),
        lastname: form.lastname.trim(),
        sex: form.sex as "homme" | "femme",
        phone: form.phone.trim(),
        member_type_id: Number(form.member_type_id),
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

      const files = {
        identityPhoto,
        identityDocument: idCard,
        pastorAttestation: pastorLetter,
        studentCertificate: studentCard,
      };

      if (isEdit && memberId) {
        const res = await adminMembersApi.update(token, memberId, payload, files);
        toast.success(res.message || "Modifications enregistrées.");
      } else {
        const res = await adminMembersApi.create(token, payload, files);
        toast.success(res.message || "Membre créé avec succès.");
      }
      router.push("/admin/members");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : isEdit ? "Erreur lors de l'enregistrement." : "Erreur lors de la création du membre.";
      setFormError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const isLoading = loading || (isEdit && loadingMember);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={isEdit ? "Modifier le membre" : "Ajouter un membre"}
        description={isEdit ? "Modifiez les informations du membre" : "Créez un membre depuis l'administration en vous appuyant sur le formulaire public."}
        action={
          <AdminButton href="/admin/members" variant="outline" icon={<ArrowLeft className="w-4 h-4" />}>
            Retour à la liste
          </AdminButton>
        }
      />

      {(loading || (isEdit && loadingMember)) && (
        <div className="mx-auto max-w-5xl rounded-xl border border-border bg-white px-4 py-3 text-sm text-muted-foreground shadow-sm">
          {isEdit && loadingMember ? "Chargement des données du membre..." : "Chargement des référentiels..."}
        </div>
      )}

      <div className="mx-auto max-w-5xl rounded-xl border border-border bg-white shadow-sm">
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
              className="progress-step-fill"
              style={{ "--progress-width": `${(currentStep / totalSteps) * 100}%` } as React.CSSProperties}
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
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input type="text" value={form.lastname} onChange={(e) => setField("lastname", e.target.value)} className={inputClassName} placeholder="Votre nom de famille" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Prénom(s) <span className="text-red-500">*</span>
                    </label>
                    <input type="text" value={form.firstname} onChange={(e) => setField("firstname", e.target.value)} className={inputClassName} placeholder="Vos prénom(s)" />
                  </div>
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
                    <input type="text" value={form.birth_place} onChange={(e) => setField("birth_place", e.target.value)} className={inputClassName} placeholder="Ville, Pays" />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Sexe <span className="text-red-500">*</span>
                    </label>
                    <select value={form.sex} onChange={(e) => setField("sex", e.target.value as FormState["sex"])} className={inputClassName} aria-label="Sexe">
                      <option value="">Sélectionner</option>
                      <option value="homme">Homme</option>
                      <option value="femme">Femme</option>
                    </select>
                  </div>
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
                    {nationalities.length === 0 && (
                      <p className="text-xs text-amber-600 mt-1">Configurez les nationalités dans Paramètres → Nationalités</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Photo d&apos;identité
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-brand-primary transition-colors">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <input ref={identityPhotoInputRef} type="file" accept="image/*" onChange={(e) => handleFileChange(e, setIdentityPhoto)} className="hidden" aria-label="Photo d'identité" />
                    <button type="button" onClick={() => openPicker(identityPhotoInputRef)} className="font-medium text-brand-primary hover:opacity-90">
                      Choisir une photo
                    </button>
                    <span className="text-muted-foreground"> ou glisser-déposer</span>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WebP jusqu&apos;à 5MB</p>
                    {identityPhoto && (
                      <p className="text-sm text-brand-primary mt-2 flex items-center justify-center gap-1">
                        <Check className="w-4 h-4" />
                        {identityPhoto.name}
                      </p>
                    )}
                    {isEdit && existingImageUrls.identityPhoto && !identityPhoto && (
                      <div className="mt-2">
                        <img src={existingImageUrls.identityPhoto} alt="Photo actuelle" className="mx-auto max-h-24 rounded object-cover" />
                        <p className="text-xs text-muted-foreground mt-1">Photo actuelle (laisser vide pour conserver)</p>
                      </div>
                    )}
                    {isEdit && !identityPhoto && !existingImageUrls.identityPhoto && (
                      <p className="text-xs text-muted-foreground mt-2">Laisser vide pour conserver la photo actuelle</p>
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
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Téléphone <span className="text-red-500">*</span>
                    </label>
                    <input type="tel" value={form.phone} onChange={(e) => setField("phone", e.target.value)} className={inputClassName} placeholder="+225 XX XX XX XX XX" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <input type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} className={inputClassName} placeholder="votre.email@exemple.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Adresse complète
                  </label>
                  <input type="text" value={form.address} onChange={(e) => setField("address", e.target.value)} className={inputClassName} placeholder="Rue, résidence, repère" />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Ville
                    </label>
                    <select value={form.city_id} onChange={(e) => setField("city_id", e.target.value)} className={inputClassName} aria-label="Ville">
                      <option value="">Sélectionner une ville</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
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
                      <option value="">{form.city_id ? "Sélectionner une commune / un quartier" : "Choisissez d'abord une ville"}</option>
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
                    <select value={form.desired_service_department_id} onChange={(e) => setField("desired_service_department_id", e.target.value)} className={inputClassName} aria-label="Département ACEEPCI souhaité">
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
                      <input type="text" value={form.emergency_contact_name} onChange={(e) => setField("emergency_contact_name", e.target.value)} className={inputClassName} placeholder="Nom du contact d'urgence" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Téléphone
                      </label>
                      <input type="tel" value={form.emergency_contact_phone} onChange={(e) => setField("emergency_contact_phone", e.target.value)} className={inputClassName} placeholder="+225 XX XX XX XX XX" />
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
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Type de membre <span className="text-red-500">*</span>
                  </label>
                  <select value={form.member_type_id} onChange={(e) => setField("member_type_id", e.target.value)} className={inputClassName} aria-label="Type de membre">
                    <option value="">Sélectionner</option>
                    {memberTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Liste chargée depuis les paramètres des types de membre.
                  </p>
                </div>

                {isStudentMember && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Établissement
                      </label>
                      <input type="text" value={form.institution} onChange={(e) => setField("institution", e.target.value)} className={inputClassName} placeholder="Nom de l'école ou université" />
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
                              {option.label}
                            </option>
                          ))}
                        </select>
                        {filteredAcademicLevels.length === 0 && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            Aucun niveau n'est disponible pour ce type de membre.
                          </p>
                        )}
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
                        <p className="mt-2 text-xs text-muted-foreground">
                          Liste chargée depuis les paramètres des domaines de formation.
                        </p>
                        {trainingDomains.length === 0 && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            Aucun domaine de formation n'est encore configuré dans les paramètres.
                          </p>
                        )}
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
                      <input type="text" value={form.profession} onChange={(e) => setField("profession", e.target.value)} className={inputClassName} placeholder="Votre profession" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Entreprise / Organisation</label>
                      <input type="text" value={form.company} onChange={(e) => setField("company", e.target.value)} className={inputClassName} placeholder="Nom de l'entreprise" />
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
                    <input type="text" value={form.local_church} onChange={(e) => setField("local_church", e.target.value)} className={inputClassName} placeholder="Nom de l'église" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Pasteur / Responsable
                    </label>
                    <input type="text" value={form.pastor} onChange={(e) => setField("pastor", e.target.value)} className={inputClassName} placeholder="Nom du pasteur" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Êtes-vous né(e) de nouveau ?
                    </label>
                    <select value={form.born_again} onChange={(e) => setField("born_again", e.target.value)} className={inputClassName} aria-label="Êtes-vous né(e) de nouveau">
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
                    <select value={form.baptized} onChange={(e) => setField("baptized", e.target.value)} className={inputClassName} aria-label="Avez-vous été baptisé(e) d'eau">
                      <option value="">Sélectionner</option>
                      <option value="Oui">Oui</option>
                      <option value="Non">Non</option>
                      <option value="Prévu prochainement">Prévu prochainement</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Expérience de service dans l'église</label>
                  <textarea value={form.church_service} onChange={(e) => setField("church_service", e.target.value)} rows={4} className={inputClassName} placeholder="Décrivez vos expériences de service dans votre église locale" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Domaines de service souhaités à l&apos;ACEEPCI
                  </label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Sélectionnez un ou plusieurs domaines à partir des domaines de service configurés dans les paramètres.
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
                  {serviceAreaOptions.length === 0 && (
                    <p className="mt-3 text-sm text-muted-foreground">
                      Aucun département de service n'est encore configuré dans les paramètres.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Comment a-t-il/elle connu l&apos;ACEEPCI ?
                  </label>
                  <select value={form.how_did_you_know} onChange={(e) => setField("how_did_you_know", e.target.value)} className={inputClassName} aria-label="Comment a-t-il ou elle connu l'ACEEPCI">
                    <option value="">Sélectionner</option>
                    {knowledgeSources.map((source) => (
                      <option key={source.id} value={source.id}>
                        {source.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Motivation
                  </label>
                  <textarea value={form.motivation} onChange={(e) => setField("motivation", e.target.value)} rows={4} className={inputClassName} placeholder="Partagez les motivations du membre..." />
                </div>
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
                    <input ref={idCardInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileChange(e, setIdCard)} className="hidden" aria-label="Carte d'identité ou attestation" />
                    <button type="button" onClick={() => openPicker(idCardInputRef)} className="font-medium text-brand-primary hover:opacity-90">
                      Choisir un fichier
                    </button>
                    <span className="text-muted-foreground"> ou glisser-déposer</span>
                    <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG jusqu&apos;à 5MB</p>
                    {idCard && (
                      <p className="text-sm text-brand-primary mt-2 flex items-center justify-center gap-1">
                        <Check className="w-4 h-4" />
                        {idCard.name}
                      </p>
                    )}
                    {isEdit && existingImageUrls.idCard && !idCard && (
                      <div className="mt-2 space-y-1">
                        {/\.(jpe?g|png|webp|gif)$/i.test(existingImageUrls.idCard) ? (
                          <img src={existingImageUrls.idCard} alt="Document actuel" className="mx-auto max-h-24 rounded object-cover" />
                        ) : null}
                        <a href={existingImageUrls.idCard} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-primary hover:underline block">
                          Voir le document actuel
                        </a>
                      </div>
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
                      <input ref={studentCardInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileChange(e, setStudentCard)} className="hidden" aria-label="Certificat de scolarité ou carte d'étudiant" />
                      <button type="button" onClick={() => openPicker(studentCardInputRef)} className="font-medium text-brand-primary hover:opacity-90">
                        Choisir un fichier
                      </button>
                      <span className="text-muted-foreground"> ou glisser-déposer</span>
                      <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG jusqu&apos;à 5MB</p>
                      {studentCard && (
                        <p className="text-sm text-brand-primary mt-2 flex items-center justify-center gap-1">
                          <Check className="w-4 h-4" />
                          {studentCard.name}
                        </p>
                      )}
                      {isEdit && existingImageUrls.studentCard && !studentCard && (
                        <div className="mt-2 space-y-1">
                          {/\.(jpe?g|png|webp|gif)$/i.test(existingImageUrls.studentCard) ? (
                            <img src={existingImageUrls.studentCard} alt="Document actuel" className="mx-auto max-h-24 rounded object-cover" />
                          ) : null}
                          <a href={existingImageUrls.studentCard} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-primary hover:underline block">
                            Voir le document actuel
                          </a>
                        </div>
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
                    <input ref={pastorLetterInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileChange(e, setPastorLetter)} className="hidden" aria-label="Attestation du pasteur" />
                    <button type="button" onClick={() => openPicker(pastorLetterInputRef)} className="font-medium text-brand-primary hover:opacity-90">
                      Choisir un fichier
                    </button>
                    <span className="text-muted-foreground"> ou glisser-déposer</span>
                    <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG jusqu&apos;à 5MB</p>
                    {pastorLetter && (
                      <p className="text-sm text-brand-primary mt-2 flex items-center justify-center gap-1">
                        <Check className="w-4 h-4" />
                        {pastorLetter.name}
                      </p>
                    )}
                    {isEdit && existingImageUrls.pastorLetter && !pastorLetter && (
                      <div className="mt-2 space-y-1">
                        {/\.(jpe?g|png|webp|gif)$/i.test(existingImageUrls.pastorLetter) ? (
                          <img src={existingImageUrls.pastorLetter} alt="Document actuel" className="mx-auto max-h-24 rounded object-cover" />
                        ) : null}
                        <a href={existingImageUrls.pastorLetter} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-primary hover:underline block">
                          Voir le document actuel
                        </a>
                      </div>
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
                  <p className="text-muted-foreground">{isEdit ? "Dernière étape avant d'enregistrer les modifications" : "Dernière étape avant de créer le membre"}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-brand-subtle rounded-lg p-6">
                  <h3 className="font-bold text-foreground mb-4">Récapitulatif de la demande</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Nom complet :</span>
                      <p className="font-medium text-foreground">{form.firstname} {form.lastname}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Type de membre :</span>
                      <p className="font-medium text-foreground">{memberTypes.find((m) => String(m.id) === form.member_type_id)?.name || "Non spécifié"}</p>
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
                      <span className="text-muted-foreground">Département :</span>
                      <p className="font-medium text-foreground">{departments.find((d) => String(d.id) === form.desired_service_department_id)?.name || "Non spécifié"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Commune / Quartier :</span>
                      <p className="font-medium text-foreground">
                        {districts.find((district) => String(district.id) === form.district_id)?.name || "Non spécifié"}
                      </p>
                    </div>
                    {isStudentMember && (
                      <>
                        <div>
                          <span className="text-muted-foreground">Établissement :</span>
                          <p className="font-medium text-foreground">{form.institution || "Non spécifié"}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Niveau / Classe :</span>
                          <p className="font-medium text-foreground">
                            {academicLevels.find((level) => String(level.id) === form.level)?.label || "Non spécifié"}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Filière / Domaine :</span>
                          <p className="font-medium text-foreground">
                            {trainingDomains.find((domain) => String(domain.id) === form.field)?.name || "Non spécifié"}
                          </p>
                        </div>
                      </>
                    )}
                    {isWorkerMember && (
                      <>
                        <div>
                          <span className="text-muted-foreground">Profession :</span>
                          <p className="font-medium text-foreground">{form.profession || "Non spécifié"}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Entreprise / Organisation :</span>
                          <p className="font-medium text-foreground">{form.company || "Non spécifié"}</p>
                        </div>
                      </>
                    )}
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
                        En tant que membre, la cotisation annuelle est de :
                      </p>
                      <div className="text-3xl font-bold text-brand-primary mb-3">{getMembershipFee()}</div>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-border rounded-lg p-6">
                  <h3 className="font-bold text-foreground mb-3">Charte des membres ACEEPCI</h3>
                  <div className="bg-brand-subtle rounded-lg p-4 max-h-64 overflow-y-auto text-sm text-foreground space-y-2">
                    <p className="font-semibold">En tant que membre de l'ACEEPCI, je m'engage à :</p>
                    <ul className="list-disc list-inside space-y-1">
                      {memberCharterItems.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="flex items-start gap-3 p-4 border-2 border-border rounded-lg cursor-pointer hover:border-brand-primary transition-colors">
                    <input
                      type="checkbox"
                      checked={form.accept_charter}
                      onChange={(e) => setField("accept_charter", e.target.checked)}
                      className="mt-1 w-5 h-5 text-brand-primary border-border rounded focus:ring-brand-primary"
                    />
                    <span className="text-sm text-foreground">
                      J&apos;ai lu et j&apos;accepte la charte des membres de l&apos;ACEEPCI.
                    </span>
                  </label>

                  <label className="flex items-start gap-3 p-4 border-2 border-border rounded-lg cursor-pointer hover:border-brand-primary transition-colors">
                    <input
                      type="checkbox"
                      checked={form.accept_payment}
                      onChange={(e) => setField("accept_payment", e.target.checked)}
                      className="mt-1 w-5 h-5 text-brand-primary border-border rounded focus:ring-brand-primary"
                    />
                    <span className="text-sm text-foreground">
                      Je m&apos;engage à payer la cotisation annuelle de {getMembershipFee()} dans les délais.
                    </span>
                  </label>
                </div>

                <div className="bg-brand-subtle border border-brand-primary/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-foreground">
                      <p className="font-semibold mb-1">{isEdit ? "Après modification" : "Après création"}</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Le dossier sera enregistré dans l&apos;administration</li>
                        <li>Le membre pourra ensuite être suivi depuis la liste des adhésions</li>
                        <li>Les validations complémentaires pourront être ajoutées plus tard</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {formError && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
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
              <button
                type="button"
                onClick={() => router.push("/admin/members")}
                className="flex items-center gap-2 px-6 py-3 border-2 border-border text-foreground font-semibold rounded-lg hover:bg-brand-subtle transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Annuler
              </button>
            )}

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white font-semibold rounded-lg hover:opacity-95 transition-colors disabled:opacity-50"
              >
                Suivant
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving || isLoading}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white font-semibold rounded-lg hover:opacity-95 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-5 h-5" />
                {saving ? (isEdit ? "Enregistrement..." : "Création...") : (isEdit ? "Enregistrer les modifications" : "Créer le membre")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
