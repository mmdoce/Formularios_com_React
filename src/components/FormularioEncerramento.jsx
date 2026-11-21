import { useState } from "react";
import { jsPDF } from "jspdf";

const reasons = [
  ["conclusao", "Conclusão do acompanhamento psicológico planejado"],
  ["desligamento", "Desligamento institucional"],
  ["solicitacao", "Solicitação do acolhido"],
  ["encaminhamento", "Encaminhamento para continuidade externa"],
  ["transferencia", "Transferência para outra instituição"],
  ["outro", "Outro"],
];

const narratives = [
  ["sintese", "Síntese da evolução durante o acompanhamento",
    "Descrever os principais aspectos trabalhados, a evolução observada, as dificuldades persistentes e os recursos desenvolvidos."],
  ["orientacoes", "Orientações para continuidade",
    "Registrar orientações realizadas e recomendações para continuidade do cuidado, quando necessárias."],
  ["consideracoes", "Considerações técnicas finais"],
];

const initialData = {
  nome: "",
  dataEncerramento: "",
  motivos: [],
  outroMotivo: "",
  sintese: "",
  orientacoes: "",
  consideracoes: "",
  local: "",
  data: "",
  profissional: "",
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
  const titleLines = pdf.splitTextToSize(
    "Registro de Encaminhamento e Encerramento do Acompanhamento Psicológico",
    170,
  );
  pdf.text(titleLines, 105, y, { align: "center" });
  y += titleLines.length * 7;
  pdf.setFontSize(10);
  pdf.text("REGISTRO DE ENCERRAMENTO", 105, y, { align: "center" });
  y += 14;

  addBlock("Identificação", `Nome do acolhido: ${data.nome}\nData do encerramento: ${formatDate(data.dataEncerramento)}`);
  const selectedReasons = reasons
    .filter(([key]) => data.motivos.includes(key))
    .map(([key, label]) => key === "outro" ? `${label}: ${data.outroMotivo}` : label);
  addBlock("Motivo do encerramento", selectedReasons.join("\n"));
  narratives.forEach(([name, label]) => addBlock(label, data[name]));

  ensureSpace(50);
  addBlock("Finalização", [
    `Local: ${data.local}`,
    `Data: ${formatDate(data.data)}`,
    `Profissional responsável: ${data.profissional}`,
    `CRP: ${data.crp}`,
  ].join("\n"));
  ensureSpace(14);
  pdf.line(55, y + 8, 155, y + 8);
  pdf.text("Assinatura do profissional de Psicologia", 105, y + 14, { align: "center" });
  pdf.save("registro-de-encerramento.pdf");
}

export default function FormularioEncerramento({ onBack }) {
  const [data, setData] = useState(initialData);
  const [ready, setReady] = useState(false);

  const update = ({ target: { name, value } }) => {
    setData((current) => ({ ...current, [name]: value }));
  };

  const updateReason = ({ target: { value, checked } }) => {
    setData((current) => ({
      ...current,
      motivos: checked ? [...current.motivos, value] : current.motivos.filter((key) => key !== value),
    }));
  };

  const field = (name, label, type = "text", enabled = true) => (
    <div className="min-w-0">
      <label className={labelClass} htmlFor={name}>{label}</label>
      <input
        className={`${inputClass} disabled:bg-gray-100`}
        id={name}
        name={name}
        type={type}
        value={data[name]}
        onChange={update}
        disabled={!enabled}
        required={enabled}
        autoComplete="off"
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
            <h1 className="text-2xl font-bold text-gray-800">Registro de Encerramento</h1>
          </header>

          <section className="space-y-4">
            <h2 className={headingClass}>Identificação</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {field("nome", "Nome do acolhido")}
              {field("dataEncerramento", "Data do encerramento", "date")}
            </div>
          </section>

          <fieldset className="min-w-0 space-y-3">
            <legend className={`w-full ${headingClass}`}>Motivo do encerramento</legend>
            {reasons.map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  className="h-4 w-4 shrink-0"
                  name="motivos"
                  type="checkbox"
                  value={key}
                  checked={data.motivos.includes(key)}
                  onChange={updateReason}
                />
                {label}
              </label>
            ))}
            {field("outroMotivo", "Especifique o outro motivo", "text", data.motivos.includes("outro"))}
          </fieldset>

          {narratives.map(([name, label, hint]) => (
            <div key={name} className="space-y-3">
              <label className={`block ${headingClass}`} htmlFor={name}>{label}</label>
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
          ))}

          <section className="space-y-4">
            <h2 className={headingClass}>Finalização</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {field("local", "Local")}
              {field("data", "Data", "date")}
              {field("profissional", "Nome da psicóloga ou do psicólogo responsável")}
              {field("crp", "Número de registro profissional (CRP)")}
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
