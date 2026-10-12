export interface RouteSelection {
  days: number;
  destinations: string[];
  interests: string[];
}
export interface RoutePlan extends RouteSelection {
  cost: number;
  dailyCost: number;
  createdAt: string;
}
export interface BudgetLine {
  label: string;
  value: number;
}

export function validateSelection(selection: RouteSelection): string | null {
  if (!Number.isInteger(selection.days) || selection.days < 2 || selection.days > 10)
    return 'Elige una duración entre 2 y 10 días.';
  if (!selection.destinations.length) return 'Elige al menos un destino para comenzar tu ruta.';
  if (!selection.interests.length)
    return 'Selecciona al menos un interés para darle sentido a tu viaje.';
  if (selection.destinations.length > selection.days)
    return 'Elige como máximo un destino por día o añade más días a tu viaje.';
  return null;
}

export function createPlan(selection: RouteSelection): RoutePlan {
  const error = validateSelection(selection);
  if (error) throw new Error(error);
  return {
    ...selection,
    destinations: [...selection.destinations],
    interests: [...selection.interests],
    cost: selection.days * 170,
    dailyCost: 170,
    createdAt: new Date().toISOString(),
  };
}

export function budgetFor(days: number): BudgetLine[] {
  return [
    { label: 'Alojamiento', value: days * 60 },
    { label: 'Alimentación', value: days * 45 },
    { label: 'Traslados', value: days * 40 },
    { label: 'Experiencias y entradas', value: days * 25 },
  ];
}

export function stopsForDay(plan: RouteSelection): string[] {
  return Array.from(
    { length: plan.days },
    (_, index) => plan.destinations[Math.min(index, plan.destinations.length - 1)] ?? 'Por definir',
  );
}

export function isRoutePlan(value: unknown): value is RoutePlan {
  if (!value || typeof value !== 'object') return false;
  const plan = value as Record<string, unknown>;
  const isList = (list: unknown) =>
    Array.isArray(list) &&
    list.length <= 10 &&
    list.every((item) => typeof item === 'string' && item.length < 80);
  return (
    typeof plan.days === 'number' &&
    Number.isInteger(plan.days) &&
    plan.days >= 2 &&
    plan.days <= 10 &&
    isList(plan.destinations) &&
    isList(plan.interests) &&
    (plan.destinations as string[]).length > 0 &&
    (plan.interests as string[]).length > 0 &&
    (plan.destinations as string[]).length <= plan.days &&
    plan.cost === plan.days * 170 &&
    plan.dailyCost === 170 &&
    typeof plan.createdAt === 'string' &&
    Number.isFinite(Date.parse(plan.createdAt))
  );
}
