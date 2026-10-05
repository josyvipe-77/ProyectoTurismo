import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { journeys } from '../data';
import { createPlan, validateSelection } from '../lib/plan';
import type { RoutePlan, RouteSelection } from '../lib/plan';
import { useTravel } from './useTravel';

export function useBuilder() {
  const [params] = useSearchParams();
  const { savedPlan, savePlan, deletePlan } = useTravel();
  const example = params.get('ejemplo') === 'chanka';
  const [selection, setSelection] = useState<RouteSelection>(
    () =>
      (!example ? savedPlan : null) ?? {
        days: 4,
        destinations: example ? journeys[0].stops : [],
        interests: example ? journeys[0].interests : [],
      },
  );
  const [plan, setPlan] = useState<RoutePlan | null>(example ? null : savedPlan);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(
    savedPlan && !example ? 'Tu cuaderno guardado está listo para continuar.' : '',
  );
  function update(next: RouteSelection) {
    setSelection(next);
    setPlan(null);
    setError('');
    setNotice('');
  }
  function toggle(field: 'destinations' | 'interests', value: string) {
    const list = selection[field];
    update({
      ...selection,
      [field]: list.includes(value) ? list.filter((item) => item !== value) : [...list, value],
    });
  }
  function generate() {
    const issue = validateSelection(selection);
    if (issue) {
      setError(issue);
      return false;
    }
    setPlan(createPlan(selection));
    setError('');
    setNotice('Tu borrador está listo. Revísalo antes de guardar.');
    return true;
  }
  function save() {
    if (plan)
      setNotice(
        savePlan(plan)
          ? 'Ruta guardada en este navegador. Puedes volver a ella cuando quieras.'
          : 'Ruta guardada solo durante esta sesión; el navegador bloqueó el almacenamiento.',
      );
  }
  function load() {
    if (savedPlan) {
      setSelection(savedPlan);
      setPlan(savedPlan);
      setError('');
      setNotice('Has recuperado tu cuaderno guardado.');
    }
  }
  function remove() {
    deletePlan();
    setNotice(
      'Se eliminó el cuaderno guardado de este navegador. El borrador actual sigue disponible.',
    );
  }
  return {
    selection,
    plan,
    error,
    notice,
    savedPlan,
    update,
    toggle,
    generate,
    save,
    load,
    remove,
  };
}
