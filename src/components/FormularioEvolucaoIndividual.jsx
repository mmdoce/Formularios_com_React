import { useState } from "react";
import jsPDF from "jspdf";

const title = "Registro de Evolução Psicológica Individual";
const identificationFields = [
  ["nome", "Nome do acolhido"],
  ["nascimento", "Data de nascimento", "date"],
  ["ingresso", "Data de ingresso na instituição", "date"],
  ["atendimento", "Data do atendimento", "date"],
  ["inicio", "Horário de início", "time"],
  ["termino", "Horário de término", "time"],
  ["psicologa", "Psicóloga responsável"],
];

const narratives = [
  ["demanda", "Demanda apresentada",
    "Registrar o motivo do atendimento, as questões trazidas pelo acolhido e as demandas identificadas durante a escuta."],
  ["intervencoes", "Intervenções realizadas",
    "Descrever os procedimentos e as intervenções psicológicas efetivamente realizados."],
  ["evolucao", "Evolução psicológica",
    "Registrar aspectos pertinentes ao acompanhamento, tais como manifestações emocionais, comunicação, percepção sobre o processo de recuperação, reconhecimento de situações de risco, autonomia, responsabilidade e relações interpessoais."],
];

const referralOptions = [
  ["nenhum", "Não houve necessidade de encaminhamento"],
  ["ubs", "UBS"],
  ["caps", "CAPS / CAPS AD"],
  ["medico", "Atendimento médico ou psiquiátrico"],
  ["outro", "Outro"],
];

const initialData = {
  nome: "",
  nascimento: "",
  ingresso: "",
  atendimento: "",
  inicio: "",
  termino: "",
  psicologa: "",
  demanda: "",
  intervencoes: "",
  evolucao: "",
  encaminhamentos: [],
  outro: "",
  providencias: "",
  proximosAtendimentos: "",
  local: "",
  data: "",
  crp: "",
};

const inputClass = "w-full rounded-lg border border-gray-300 p-3";
const labelClass = "mb-1 block text-sm font-medium text-gray-700";
const headingClass = "text-sm font-semibold text-gray-500 uppercase tracking-wide border-b pb-1";
const buttonClass = "no-print w-full rounded-lg bg-teal-700 py-3 font-medium text-white hover:bg-teal-800";

function formatDate(value) {
  return value.split("-").reverse().join("/");
}

function downloadPdf(data) {
  const pdf = new jsPDF();
  let y = 20;

  const ensureSpace = (height) => {
    if (y + height > 280) {
      pdf.addPage();
      y = 20;
    }
  };

  const addBlock = (label, value) => {
    ensureSpace(13);
    pdf.setFont("helvetica", "bold");
    pdf.text(label, 20, y);
    y += 7;
    pdf.setFont("helvetica", "normal");
    for (const line of pdf.splitTextToSize(value, 170)) {
      ensureSpace(6);
      pdf.text(line, 20, y);
      y += 6;
    }
    y += 5;
  };

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  const titleLines = pdf.splitTextToSize(`DOC.02 — ${title}`, 170);
  pdf.text(titleLines, 105, y, { align: "center" });
  y += titleLines.length * 7 + 7;
  pdf.setFontSize(10);

  const identification = identificationFields.map(([name, label, type]) => {
    const value = type === "date" ? formatDate(data[name]) : data[name];
    return `${label}: ${value}`;
  });
  addBlock("Identificação", identification.join("\n"));
  narratives.forEach(([name, label]) => addBlock(label, data[name]));

  const referrals = referralOptions
    .filter(([key]) => data.encaminhamentos.includes(key))
    .map(([key, label]) => key === "outro" ? `${label}: ${data.outro}` : label);
  addBlock("Encaminhamentos e providências", referrals.join("\n"));
  addBlock("Descrição das providências", data.providencias);
  addBlock("Pontos a serem trabalhados nos próximos atendimentos", data.proximosAtendimentos);

  ensureSpace(50);
  addBlock("Finalização", [
    `Local: ${data.local}`,
    `Data: ${formatDate(data.data)}`,
    `Psicóloga responsável: ${data.psicologa}`,
    `CRP: ${data.crp}`,
  ].join("\n"));
  ensureSpace(14);
  pdf.line(55, y + 8, 155, y + 8);
  pdf.text("Assinatura do profissional de Psicologia", 105, y + 14, { align: "center" });
  pdf.save("registro-de-evolucao-psicologica-individual.pdf");
}

export default function FormularioEvolucaoIndividual({ onBack }) {
  const [data, setData] = useState(initialData);
  const [ready, setReady] = useState(false);
  const minimums = {
    ingresso: data.nascimento,
    atendimento: data.ingresso,
    termino: data.inicio,
    data: data.atendimento,
  };

  const update = ({ target: { name, value } }) => {
    setData((current) => ({ ...current, [name]: value }));
  };

  const updateReferral = ({ target: { value, checked } }) => {
    setData((current) => {
      const remaining = current.encaminhamentos.filter((key) => key !== value);
      return {
        ...current,
        encaminhamentos: checked
          ? [value, ...remaining.filter((key) => value !== "nenhum" && key !== "nenhum")]
          : remaining,
      };
    });
  };

  const field = (name, label, type = "text", enabled = true) => (
    <div key={name} className="min-w-0">
      <label className={labelClass} htmlFor={name}>{label}</label>
      <input
        className={`${inputClass} disabled:bg-gray-100`}
        id={name}
        name={name}
        type={type}
        min={minimums[name] || undefined}
        value={data[name]}
        onChange={update}
        disabled={!enabled}
        required={enabled}
        autoComplete="off"
      />
    </div>
  );

  const textarea = (name, label, hint) => (
    <div key={name} className="space-y-3">
      <label className={hint ? `block ${headingClass}` : labelClass} htmlFor={name}>{label}</label>
      {hint && <p id={`${name}-orientacao`} className="text-sm text-gray-600">{hint}</p>}
      <textarea
        className={`${inputClass} resize-y`}
        id={name}
        name={name}
        value={data[name]}
        onChange={update}
        aria-describedby={hint ? `${name}-orientacao` : undefined}
        rows={5}
      />
    </div>
  );

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl p-4 sm:p-8">
      <button type="button" onClick={onBack} className="no-print mb-4 text-sm text-gray-600">
        ← Voltar
      </button>
      {!ready ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setReady(true);
          }}
          className="space-y-5 rounded-2xl bg-white p-5 shadow sm:p-8"
        >
          <header>
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          </header>

          <section className="space-y-4">
            <h2 className={headingClass}>Identificação</h2>
            {field(...identificationFields[0])}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {identificationFields.slice(1, 4).map((entry) => field(...entry))}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {identificationFields.slice(4, 6).map((entry) => field(...entry))}
            </div>
            {field(...identificationFields[6])}
          </section>

          {narratives.map(([name, label, hint]) => textarea(name, label, hint))}

          <fieldset className="min-w-0 space-y-3">
            <legend className={`w-full ${headingClass}`}>Encaminhamentos e providências</legend>
            {referralOptions.map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  className="h-4 w-4 shrink-0"
                  name="encaminhamentos"
                  type="checkbox"
                  value={key}
                  checked={data.encaminhamentos.includes(key)}
                  onChange={updateReferral}
                />
                {label}
              </label>
            ))}
            {field("outro", "Especifique o outro encaminhamento", "text", data.encaminhamentos.includes("outro"))}
            {textarea("providencias", "Descrição das providências")}
            {textarea("proximosAtendimentos", "Pontos a serem trabalhados nos próximos atendimentos")}
          </fieldset>

          <section className="space-y-4">
            <h2 className={headingClass}>Finalização</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {field("local", "Local")}
              {field("data", "Data", "date")}
            </div>
            {field("crp", "Número de registro profissional (CRP)")}
            <div className="pt-6 text-center text-sm text-gray-600">


            </div>
          </section>

          <button type="submit" className={buttonClass}>Continuar para gerar PDF</button>
        </form>
      ) : (
        <section className="space-y-4 rounded-2xl bg-white p-6 shadow">
          <h1 className="text-xl font-semibold">Registro preparado</h1>
          <p>O PDF será gerado com os dados preenchidos nesta sessão.</p>
          <button type="button" onClick={() => downloadPdf(data)} className={buttonClass}>Baixar PDF</button>
          <button type="button" onClick={() => setReady(false)} className="no-print w-full rounded-lg border py-3">
            Voltar e revisar
          </button>
        </section>
      )}
    </main>
  );
}
