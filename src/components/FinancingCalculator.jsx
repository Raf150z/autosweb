import { useMemo, useState } from 'react';
import { formatPrice } from '../utils/formatPrice';

const PLANS = [
  { id: 'basico', name: 'Plan Básico', rate: 16.9, desc: 'Aprobación más rápida' },
  { id: 'plus', name: 'Plan Plus', rate: 13.9, desc: 'El más elegido' },
  { id: 'preferente', name: 'Plan Preferente', rate: 10.9, desc: 'Requiere buen historial' },
];

const TERMS = [12, 24, 36, 48, 60];

export default function FinancingCalculator({ price }) {
  const [downPct, setDownPct] = useState(20);
  const [months, setMonths] = useState(36);
  const [planId, setPlanId] = useState('plus');

  const plan = PLANS.find((p) => p.id === planId) ?? PLANS[0];

  const result = useMemo(() => {
    const downPayment = price * (downPct / 100);
    const principal = Math.max(price - downPayment, 0);
    const monthlyRate = plan.rate / 100 / 12;
    const n = months;

    const monthlyPayment =
      monthlyRate === 0
        ? principal / n
        : (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) /
          (Math.pow(1 + monthlyRate, n) - 1);

    const totalToPay = monthlyPayment * n;
    const totalInterest = totalToPay - principal;

    return { downPayment, principal, monthlyPayment, totalToPay, totalInterest };
  }, [price, downPct, months, plan]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 grid md:grid-cols-2 gap-6 sm:gap-8">
      {/* FORMULARIO */}
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-navy mb-2">
            Enganche: {downPct}% ({formatPrice(price * (downPct / 100))})
          </label>
          <input
            type="range"
            min="0"
            max="60"
            step="5"
            value={downPct}
            onChange={(e) => setDownPct(Number(e.target.value))}
            className="w-full accent-cyan"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-navy mb-2">Plazo</label>
          <div className="flex flex-wrap gap-2">
            {TERMS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setMonths(t)}
                className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition ${
                  months === t
                    ? 'bg-navy text-white'
                    : 'bg-graylight text-navy hover:bg-graylight/70'
                }`}
              >
                {t} meses
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-navy mb-2">Plan de crédito</label>
          <div className="space-y-2">
            {PLANS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlanId(p.id)}
                className={`w-full text-left px-3 sm:px-4 py-3 rounded-xl border transition ${
                  planId === p.id
                    ? 'border-cyan bg-cyan/10'
                    : 'border-graylight hover:border-teal/50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-navy text-sm sm:text-base">{p.name}</span>
                  <span className="text-xs sm:text-sm text-teal whitespace-nowrap">
                    {p.rate}% anual
                  </span>
                </div>
                <p className="text-xs text-teal mt-1">{p.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RESULTADO */}
      <div className="bg-navy text-white rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
        <div>
          <p className="text-graylight text-sm">Pago mensual estimado</p>
          <p className="text-3xl sm:text-4xl font-bold text-cyanbright mt-1 break-words">
            {formatPrice(result.monthlyPayment)}
          </p>
          <p className="text-graylight text-xs mt-1">durante {months} meses</p>
        </div>

        <dl className="mt-6 sm:mt-8 space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-graylight">Enganche</dt>
            <dd className="text-right">{formatPrice(result.downPayment)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-graylight">Monto a financiar</dt>
            <dd className="text-right">{formatPrice(result.principal)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-graylight">Intereses totales</dt>
            <dd className="text-right">{formatPrice(result.totalInterest)}</dd>
          </div>
          <div className="flex justify-between gap-3 font-semibold border-t border-white/20 pt-2">
            <dt>Total a pagar</dt>
            <dd className="text-right">{formatPrice(result.totalToPay)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}