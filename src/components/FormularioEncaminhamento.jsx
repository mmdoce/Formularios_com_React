import { useState } from "react";
import jsPDF from "jspdf";

const destinations = [
  ["ubs", "Unidade Básica de Saúde — UBS"],
  ["caps", "Centro de Atenção Psicossocial — CAPS"],
  ["capsAd", "CAPS AD"],
  ["psiquiatrico", "Atendimento psiquiátrico"],
  ["psicologico", "Atendimento psicológico externo"],
  ["urgencia", "Serviço de urgência e emergência"],
  ["outro", "Outro"],
];

const continuityOptions = [
  ["instituicao", "O acolhido continuará recebendo acompanhamento psicológico na instituição"],
  ["rede", "O acompanhamento será articulado com a rede de saúde"],
  ["reavaliacao", "A necessidade de continuidade será reavaliada"],
  ["outra", "Outra situação"],
];

const initialData = {
  nome: "",
  dataNascimento: "",
  dataEncaminhamento: "",
  motivo: "",
  destinos: [],
  outroDestino: "",
  providencias: "",
  continuidade: [],
  outraSituacao: "",
  psicologa: "",
  crp: "",
};

const inputClass = "w-full rounded-lg border border-gray-300 p-3";
const labelClass = "mb-1 block text-sm font-medium text-gray-700";
const headingClass = "text-sm font-semibold text-gray-500 uppercase tracking-wide border-b pb-1";
const buttonClass = "no-print w-full rounded-lg bg-teal-700 py-3 font-medium text-white hover:bg-teal-800";

function selectedLabels(options, selected, otherKey, detail) {
  return options
    .filter(([key]) => selected.includes(key))
    .map(([key, label]) => key === otherKey ? `${label}: ${detail}` : label)
    .join("\n");
}

function downloadPdf(data) {
  const pdf = new jsPDF();
  const formatDate = (date) => new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR");
  let y = 20;

  const ensureSpace = (height) => {
    if (y + height > 280) {
      pdf.addPage();
      y = 20;
    }
  };

  const addBlock = (title, value) => {
    ensureSpace(13);
    pdf.setFont("helvetica", "bold");
    pdf.text(title, 20, y);
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
  const title = pdf.splitTextToSize(
    "Registro de Encaminhamento e Encerramento do Acompanhamento Psicológico",
    170,
  );
  pdf.text(title, 105, y, { align: "center" });
  y += title.length * 7;
  pdf.setFontSize(10);
  pdf.text(" REGISTRO DE ENCAMINHAMENTO", 105, y, { align: "center" });
  y += 14;

  addBlock("Identificação do acolhido", [
    `Nome: ${data.nome}`,
    `Data de nascimento: ${formatDate(data.dataNascimento)}`,
    `Data do encaminhamento: ${formatDate(data.dataEncaminhamento)}`,
  ].join("\n"));
  addBlock("Motivo do encaminhamento", data.motivo);
  addBlock("Serviço ou profissional de destino",
    selectedLabels(destinations, data.destinos, "outro", data.outroDestino));
  addBlock("Providências realizadas", data.providencias);
  addBlock("Continuidade do acompanhamento",
    selectedLabels(continuityOptions, data.continuidade, "outra", data.outraSituacao));
  addBlock("Identificação da psicóloga", `Nome: ${data.psicologa}\nCRP: ${data.crp}`);

  ensureSpace(14);
  pdf.line(55, y + 8, 155, y + 8);
  pdf.text("Assinatura da psicóloga", 105, y + 14, { align: "center" });
  pdf.save("registro-de-encaminhamento.pdf");
}

export default function FormularioEncaminhamento({ onBack }) {
  const [data, setData] = useState(initialData);
  const [ready, setReady] = useState(false);

  const update = ({ target: { name, value } }) => {
    setData((current) => ({ ...current, [name]: value }));
  };

  const updateSelection = ({ target: { name, value, checked } }) => {
    setData((current) => ({
      ...current,
      [name]: checked ? [...current[name], value] : current[name].filter((key) => key !== value),
    }));
  };

  const textField = (name, label, type = "text", enabled = true) => (
    <div>
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

  const checkboxes = (name, options) => options.map(([key, label]) => (
    <label key={key} className="flex items-center gap-2 text-sm font-medium text-gray-700">
      <input
        className="h-4 w-4 shrink-0"
        name={name}
        type="checkbox"
        value={key}
        checked={data[name].includes(key)}
        onChange={updateSelection}
      />
      {label}
    </label>
  ));

  const narrative = (name, label, hint) => (
    <div className="space-y-3">
      <label className={`block ${headingClass}`} htmlFor={name}>{label}</label>
      <p id={`${name}-orientacao`} className="text-sm text-gray-600">{hint}</p>
      <textarea
        className={`${inputClass} resize-y`}
        id={name}
        name={name}
        value={data[name]}
        onChange={update}
        aria-describedby={`${name}-orientacao`}
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
            <h1 className="text-2xl font-bold text-gray-800">Registro de Encaminhamento</h1>

          </header>

          <section className="space-y-4">
            <h2 className={headingClass}>Identificação do acolhido</h2>
            {textField("nome", "Nome")}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {textField("dataNascimento", "Data de nascimento", "date")}
              {textField("dataEncaminhamento", "Data do encaminhamento", "date")}
            </div>
          </section>

          {narrative("motivo", "Motivo do encaminhamento",
            "Descrever a demanda identificada e a justificativa técnica para o encaminhamento.")}

          <fieldset className="min-w-0 space-y-3">
            <legend className={`w-full ${headingClass}`}>Serviço ou profissional de destino</legend>
            {checkboxes("destinos", destinations)}
            {textField("outroDestino", "Especifique o outro destino", "text", data.destinos.includes("outro"))}
          </fieldset>

          {narrative("providencias", "Providências realizadas",
            "Descrever as orientações fornecidas e as providências efetivamente adotadas.")}

          <fieldset className="min-w-0 space-y-3">
            <legend className={`w-full ${headingClass}`}>Continuidade do acompanhamento</legend>
            {checkboxes("continuidade", continuityOptions)}
            {textField("outraSituacao", "Especifique a outra situação", "text", data.continuidade.includes("outra"))}
          </fieldset>

          <section className="space-y-4">
            <h2 className={headingClass}>Identificação da psicóloga</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {textField("psicologa", "Nome da psicóloga")}
              {textField("crp", "Número de registro profissional (CRP)")}
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
