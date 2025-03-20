export const PLANS = {
  FREE: 'free',
  PRO: 'pro',
  TEAM: 'team',
} as const;

export type PlanType = typeof PLANS[keyof typeof PLANS];

export interface Plan {
  id: PlanType;
  name: string;
  description: string;
  features: string[];
  price: number;
  stripePriceId: string;
  limits: {
    lessonPlans: number;
    rubrics: number;
    activities: number;
  };
}

export const SUBSCRIPTION_PLANS: Plan[] = [
  {
    id: PLANS.FREE,
    name: 'Plan Básico',
    description: 'Ideal para comenzar tu experiencia con ProfeChat',
    price: 0,
    stripePriceId: '',
    features: [
      'Hasta 3 planificaciones por mes',
      'Hasta 3 rúbricas por mes',
      'Hasta 3 actividades por mes',
      'Alineado con el Currículo Nacional de Perú',
      'Plantillas básicas de evaluación',
      'Soporte por correo',
    ],
    limits: {
      lessonPlans: 3,
      rubrics: 3,
      activities: 3,
    },
  },
  {
    id: PLANS.PRO,
    name: 'Plan Profesional',
    description: 'Para docentes que buscan optimizar su trabajo',
    price: 39.90,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || '',
    features: [
      'Planificaciones ilimitadas',
      'Rúbricas ilimitadas',
      'Actividades ilimitadas',
      'Adaptaciones para educación inclusiva',
      'Alineado con el CNEB',
      'Exportación a PDF y Word',
      'Recursos descargables',
      'Soporte prioritario',
      'Acceso a comunidad docente',
      'Plantillas personalizables',
    ],
    limits: {
      lessonPlans: Infinity,
      rubrics: Infinity,
      activities: Infinity,
    },
  },
  {
    id: PLANS.TEAM,
    name: 'Plan Institucional',
    description: 'Perfecto para colegios y equipos docentes',
    price: 119.90,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_TEAM_PRICE_ID || '',
    features: [
      'Todo lo incluido en Plan Profesional',
      'Hasta 10 usuarios',
      'Panel de administración',
      'Colaboración en tiempo real',
      'Análisis y reportes institucionales',
      'Capacitación personalizada',
      'Soporte técnico dedicado',
      'Integración con SIAGIE',
      'Personalización de plantillas institucionales',
      'Herramientas para monitoreo y acompañamiento',
    ],
    limits: {
      lessonPlans: Infinity,
      rubrics: Infinity,
      activities: Infinity,
    },
  },
]; 