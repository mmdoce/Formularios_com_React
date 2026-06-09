import React, { useState } from "react";
import jsPDF from "jspdf";

export default function FormularioPAS({ onBack }) {
  const [formData, setFormData] = useState({
    nome: "",
    data: "",
    dataDeEntrada: "",
    atendimento: "",
    vinculo: "",
    atividades: "",
    acompanhamentoMedico: "",
    acompanhamentoEspiritual: "",
    queixas: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "___/___/______";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleDownloadPDF = () => {
    const pdf = new jsPDF("p", "mm", "a4");

    // Margens
    const marginLeft = 20;
    const marginRight = 20;
    const pageWidth = 210;
    const contentWidth = pageWidth - marginLeft - marginRight;
    const marginTop = 25;
    const marginBottom = 25;
    const pageHeight = 297;

    let y = marginTop;

    const checkPageBreak = (space = 12) => {
      if (y + space > pageHeight - marginBottom) {
        pdf.addPage();
        y = marginTop;
        // Linha separadora no topo de cada página
        pdf.setDrawColor(180, 180, 180);
        pdf.setLineWidth(0.3);
        pdf.line(marginLeft, y - 4, pageWidth - marginRight, y - 4);
      }
    };

    // ── CABEÇALHO ──────────────────────────────────────────────
    pdf.setFillColor(240, 240, 240);  // cor do fundo do cabeçalho 
    pdf.rect(0, 0, pageWidth, 18, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);
    pdf.text("CENTRO DE RECUPERAÇÃO ÁTRIO", pageWidth / 2, 8, { align: "center" });

    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.text("RELATÓRIO PAS — PLANO DE ACOMPANHAMENTO SINGULAR", pageWidth / 2, 14, { align: "center" });

    y = 28;

    // ── DADOS DO INTERNO ───────────────────────────────────────
    pdf.setTextColor(0, 0, 0);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.text("IDENTIFICAÇÃO", marginLeft, y);

    pdf.setDrawColor(30, 30, 30);
    pdf.setLineWidth(0.5);
    pdf.line(marginLeft, y + 1.5, pageWidth - marginRight, y + 1.5);

    y += 7;

    // Nome do interno
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.text("Nome do Interno:", marginLeft, y);
    pdf.setFont("helvetica", "normal");
    pdf.text(formData.nome || "________________________________", marginLeft + 35, y);

    y += 7;

    // Datas lado a lado
    pdf.setFont("helvetica", "bold");
    pdf.text("Data da Sessão:", marginLeft, y);
    pdf.setFont("helvetica", "normal");
    pdf.text(formatDate(formData.data), marginLeft + 32, y);

    pdf.setFont("helvetica", "bold");
    pdf.text("Data de Matrícula na Casa:", pageWidth / 2 + 5, y);
    pdf.setFont("helvetica", "normal");
    pdf.text(formatDate(formData.dataDeEntrada), pageWidth / 2 + 5 + 52, y);

    y += 12;

    // ── BLOCOS DE CONTEÚDO ─────────────────────────────────────
    const blocos = [
      { numero: "1", titulo: "Atendimento Psicológico", campo: formData.atendimento },
      { numero: "2", titulo: "Evolução do Vínculo Familiar", campo: formData.vinculo },
      { numero: "3", titulo: "Atividades Laborterápicas", campo: formData.atividades },
      { numero: "4", titulo: "Acompanhamento Médico", campo: formData.acompanhamentoMedico },
      { numero: "5", titulo: "Acompanhamento Espiritual", campo: formData.acompanhamentoEspiritual },
      { numero: "6", titulo: "Possíveis Queixas", campo: formData.queixas },
    ];

    blocos.forEach(({ numero, titulo, campo }) => {
      checkPageBreak(28);

      // Título do bloco com fundo cinza claro
      pdf.setFillColor(240, 240, 240);
      pdf.rect(marginLeft, y - 4, contentWidth, 8, "F");

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.setTextColor(30, 30, 30);
      pdf.text(`${numero}. ${titulo}`, marginLeft + 2, y + 0.5);

      y += 8;

      // Conteúdo do bloco
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);

      const linhas = pdf.splitTextToSize(campo || "Não informado.", contentWidth);
      linhas.forEach((linha) => {
        checkPageBreak(6);
        pdf.text(linha, marginLeft + 2, y);
        y += 5.5;
      });

      y += 5;
    });

    // ── ASSINATURA ─────────────────────────────────────────────
    checkPageBreak(35);

    y += 8;
    pdf.setDrawColor(100, 100, 100);
    pdf.setLineWidth(0.4);
    pdf.line(pageWidth / 2 - 40, y, pageWidth / 2 + 40, y);

    y += 5;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);
    pdf.text("Assinatura do Psicólogo Responsável", pageWidth / 2, y, { align: "center" });

    y += 4;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Gerado em ${new Date().toLocaleDateString("pt-BR")}`, pageWidth / 2, y, { align: "center" });

    // ── RODAPÉ em todas as páginas ─────────────────────────────
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7);
      pdf.setTextColor(150, 150, 150);
      pdf.text(
        `Centro de Recuperação Átrio  •  Página ${i} de ${totalPages}`,
        pageWidth / 2,
        pageHeight - 8,
        { align: "center" }
      );
    }

    pdf.save(`relatorio-pas-${formData.nome || "interno"}.pdf`);
  };

  // Estilo reutilizável para inputs
  const inputClass =
    "w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white";

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">

        <button onClick={onBack} className="mb-4 text-sm text-gray-500 hover:text-gray-800 transition">
          ← Voltar
        </button>

        {!submitted ? (
          <div className="bg-white shadow-lg rounded-2xl p-8 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Relatório PAS</h1>
              <p className="text-sm text-gray-500 mt-1">Plano de Acompanhamento Singular</p>
            </div>

            {/* Nome */}
            <div>
              <label className={labelClass}>Nome do Interno</label>
              <input
                name="nome"
                placeholder="Nome completo"
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* Datas com labels explicativos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  Data da Sessão
                  <span className="ml-1 text-xs text-gray-400 font-normal">(dia do atendimento)</span>
                </label>
                <input
                  type="date"
                  name="data"
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>
                  Data de Matrícula na Casa
                  <span className="ml-1 text-xs text-gray-400 font-normal">(entrada na instituição)</span>
                </label>
                <input
                  type="date"
                  name="dataDeEntrada"
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Campos de texto */}
            {[
              { label: "1. Atendimento Psicológico", name: "atendimento" },
              { label: "2. Evolução do Vínculo Familiar", name: "vinculo" },
              { label: "3. Atividades Laborterápicas", name: "atividades" },
              { label: "4. Acompanhamento Médico", name: "acompanhamentoMedico" },
              { label: "5. Acompanhamento Espiritual", name: "acompanhamentoEspiritual" },
              { label: "6. Possíveis Queixas", name: "queixas" },
            ].map((field) => (
              <div key={field.name}>
                <label className={labelClass}>{field.label}</label>
                <textarea
                  name={field.name}
                  placeholder={`Descreva aqui ${field.label.replace(/^\d+\.\s/, "").toLowerCase()}...`}
                  onChange={handleChange}
                  rows={5}
                  className={`${inputClass} resize-y`}
                />
              </div>
            ))}

            <button
              onClick={handleSubmit}
              className="w-full bg-gray-900 hover:bg-gray-700 text-white py-3 rounded-lg text-base font-medium transition"
            >
              Finalizar Relatório
            </button>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-2xl p-8 space-y-4 text-center">
            <div className="text-4xl">✅</div>
            <h2 className="text-xl font-semibold text-gray-800">Relatório pronto para download</h2>
            <p className="text-sm text-gray-500">O PDF será gerado com formatação adequada para impressão em A4.</p>

            <button
              onClick={handleDownloadPDF}
              className="w-full bg-gray-900 hover:bg-gray-700 text-white py-3 rounded-lg text-base font-medium transition"
            >
              ⬇ Baixar PDF
            </button>

            <button
              onClick={() => setSubmitted(false)}
              className="w-full border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
            >
              Editar relatório
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
