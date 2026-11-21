import { useState } from "react";
import jsPDF from "jspdf";

const initialData = {
  data: "", horario: "", duracao: "", tema: "", objetivo: "", metodologia: "",
  participantes: "", descricao: "", resultados: "", planejamento: "", responsavel: "", crp: "",
};
const sections = [
  ["tema", "Tema"], ["objetivo", "Objetivo"], ["metodologia", "Metodologia ou atividade realizada"],
  ["descricao", "Descrição objetiva da atividade e observações relevantes"],
  ["resultados", "Resultados e encaminhamentos"], ["planejamento", "Planejamento para continuidade (quando aplicável)"],
];

export default function FormularioGrupal({ onBack }) {
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
    pdf.text("REGISTRO DE ATIVIDADE PSICOLÓGICA GRUPAL", 105, y, { align: "center" });
    y += 14; pdf.setFontSize(10);
    addBlock("Data da atividade", data.data ? new Date(`${data.data}T12:00:00`).toLocaleDateString("pt-BR") : "");
    addBlock("Horário", data.horario); addBlock("Duração", data.duracao);
    addBlock("Número de participantes", data.participantes);
    sections.forEach(([key, label]) => addBlock(label, data[key]));
    addBlock("Pessoa responsável", data.responsavel); addBlock("CRP", data.crp);
    addBlock("Nota", "Este registro grupal não substitui a documentação individual pertinente de cada participante.");
    pdf.save("registro-atividade-psicologica-grupal.pdf");
  };

  const inputClass = "w-full rounded-lg border border-gray-300 p-3";
  const labelClass = "mb-1 block text-sm font-medium text-gray-700";

  return <main className="mx-auto min-h-screen w-full max-w-3xl p-4 sm:p-8">
    <button type="button" onClick={onBack} className="no-print mb-4 text-sm text-gray-600">← Voltar</button>
    {!ready ? <form onSubmit={(event) => { event.preventDefault(); setReady(true); }} className="space-y-5 rounded-2xl bg-white p-5 shadow sm:p-8">
      <h1 className="text-2xl font-bold text-gray-800">Registro de atividade psicológica grupal</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div><label className={labelClass} htmlFor="data">Data da atividade</label><input className={inputClass} id="data" name="data" type="date" value={data.data} onChange={update} required /></div>
        <div><label className={labelClass} htmlFor="horario">Horário</label><input className={inputClass} id="horario" name="horario" type="time" value={data.horario} onChange={update} required /></div>
        <div><label className={labelClass} htmlFor="duracao">Duração</label><input className={inputClass} id="duracao" name="duracao" value={data.duracao} onChange={update} placeholder="Ex.: 1h" required /></div>
        <div><label className={labelClass} htmlFor="participantes">Número de participantes</label><input className={inputClass} id="participantes" name="participantes" type="number" min="0" step="1" value={data.participantes} onChange={update} required /></div>
      </div>
      {sections.map(([key, label]) => <div key={key}><label className={labelClass} htmlFor={key}>{label}</label><textarea className={inputClass} id={key} name={key} value={data[key]} onChange={update} rows={5} /></div>)}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><div><label className={labelClass} htmlFor="responsavel">Nome da pessoa responsável</label><input className={inputClass} id="responsavel" name="responsavel" value={data.responsavel} onChange={update} required autoComplete="off" /></div><div><label className={labelClass} htmlFor="crp">Número de registro profissional (CRP)</label><input className={inputClass} id="crp" name="crp" value={data.crp} onChange={update} required autoComplete="off" /></div></div>
      <p className="text-sm text-gray-600">Registre apenas informações pertinentes à atividade. Este formulário não substitui a documentação individual de cada participante.</p>
      <button className="no-print w-full rounded-lg bg-teal-700 py-3 font-medium text-white hover:bg-teal-800">Continuar para gerar PDF</button>
    </form> : <section className="space-y-4 rounded-2xl bg-white p-6 shadow"><h1 className="text-xl font-semibold">Registro preparado</h1><p>O PDF será gerado com os dados preenchidos nesta sessão.</p><button type="button" onClick={downloadPdf} className="no-print w-full rounded-lg bg-teal-700 py-3 text-white">Baixar PDF</button><button type="button" onClick={() => setReady(false)} className="no-print w-full rounded-lg border py-3">Voltar e revisar</button></section>}
  </main>;
}
