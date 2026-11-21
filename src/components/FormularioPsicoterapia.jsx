import { useState } from "react";
import jsPDF from "jspdf";

const initialData = {
  nome: "", data: "", horario: "", modalidade: "presencial individual",
  outraModalidade: "", demanda: "", procedimentos: "", evolucao: "",
  conduta: "", psicologa: "", crp: "",
};

const sections = [
  ["demanda", "Demanda ou objetivo do encontro"],
  ["procedimentos", "Procedimentos e intervenções realizados"],
  ["evolucao", "Evolução e aspectos relevantes para a continuidade do cuidado"],
  ["conduta", "Conduta, planejamento e encaminhamentos"],
];

export default function FormularioPsicoterapia({ onBack }) {
  const [data, setData] = useState(initialData);
  const [ready, setReady] = useState(false);
  const update = ({ target: { name, value } }) => setData((current) => ({ ...current, [name]: value }));

  const downloadPdf = () => {
    const pdf = new jsPDF();
    let y = 20;
    const addBlock = (title, value) => {
      const lines = pdf.splitTextToSize(value || "", 170);
      if (y + 12 + lines.length * 6 > 280) { pdf.addPage(); y = 20; }
      pdf.setFont("helvetica", "bold"); pdf.text(title, 20, y); y += 7;
      pdf.setFont("helvetica", "normal");
      if (lines.length) { pdf.text(lines, 20, y); y += lines.length * 6; }
      y += 5;
    };
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(14);
    pdf.text("REGISTRO DE ATENDIMENTO PSICOLÓGICO INDIVIDUAL", 105, y, { align: "center" });
    y += 14; pdf.setFontSize(10);
    addBlock("Identificação da pessoa atendida", data.nome);
    addBlock("Data do atendimento", data.data ? new Date(`${data.data}T12:00:00`).toLocaleDateString("pt-BR") : "");
    addBlock("Horário", data.horario);
    addBlock("Modalidade", data.modalidade === "outra" ? data.outraModalidade : "Presencial individual");
    sections.forEach(([key, label]) => addBlock(label, data[key]));
    addBlock("Nome da psicóloga", data.psicologa);
    addBlock("CRP", data.crp);
    if (y > 265) { pdf.addPage(); y = 20; }
    y += 8; pdf.line(55, y, 155, y); y += 6;
    pdf.text("Assinatura da psicóloga", 105, y, { align: "center" });
    pdf.save("registro-atendimento-individual.pdf");
  };

  const inputClass = "w-full rounded-lg border border-gray-300 p-3";
  const labelClass = "mb-1 block text-sm font-medium text-gray-700";

  return <main className="mx-auto min-h-screen w-full max-w-3xl p-4 sm:p-8">
    <button type="button" onClick={onBack} className="no-print mb-4 text-sm text-gray-600">← Voltar</button>
    {!ready ? <form onSubmit={(event) => { event.preventDefault(); setReady(true); }} className="space-y-5 rounded-2xl bg-white p-5 shadow sm:p-8">
      <h1 className="text-2xl font-bold text-gray-800">Registro de atendimento psicológico individual</h1>
      <div><label className={labelClass} htmlFor="nome">Identificação da pessoa atendida</label><input className={inputClass} id="nome" name="nome" value={data.nome} onChange={update} required autoComplete="off" /></div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div><label className={labelClass} htmlFor="data">Data do atendimento</label><input className={inputClass} id="data" name="data" type="date" value={data.data} onChange={update} required /></div>
        <div><label className={labelClass} htmlFor="horario">Horário do atendimento</label><input className={inputClass} id="horario" name="horario" type="time" value={data.horario} onChange={update} required /></div>
      </div>
      <div><label className={labelClass} htmlFor="modalidade">Modalidade</label><select className={inputClass} id="modalidade" name="modalidade" value={data.modalidade} onChange={update}><option value="presencial individual">Presencial individual</option><option value="outra">Outra modalidade</option></select></div>
      {data.modalidade === "outra" && <div><label className={labelClass} htmlFor="outraModalidade">Especifique a modalidade</label><input className={inputClass} id="outraModalidade" name="outraModalidade" value={data.outraModalidade} onChange={update} required /></div>}
      {sections.map(([key, label]) => <div key={key}><label className={labelClass} htmlFor={key}>{label}</label><textarea className={inputClass} id={key} name={key} value={data[key]} onChange={update} rows={5} /></div>)}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><div><label className={labelClass} htmlFor="psicologa">Nome e assinatura da psicóloga</label><input className={inputClass} id="psicologa" name="psicologa" value={data.psicologa} onChange={update} required autoComplete="off" /></div><div><label className={labelClass} htmlFor="crp">Número de registro profissional (CRP)</label><input className={inputClass} id="crp" name="crp" value={data.crp} onChange={update} required autoComplete="off" /></div></div>
      <button className="no-print w-full rounded-lg bg-teal-700 py-3 font-medium text-white hover:bg-teal-800">Continuar para gerar PDF</button>
    </form> : <section className="space-y-4 rounded-2xl bg-white p-6 shadow"><h1 className="text-xl font-semibold">Registro preparado</h1><p>O PDF será gerado com os dados preenchidos nesta sessão.</p><button type="button" onClick={downloadPdf} className="no-print w-full rounded-lg bg-teal-700 py-3 text-white">Baixar PDF</button><button type="button" onClick={() => setReady(false)} className="no-print w-full rounded-lg border py-3">Voltar e revisar</button></section>}
  </main>;
}
