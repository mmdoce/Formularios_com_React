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

  // 🔥 FUNÇÃO PDF REAL (sem print)
  const handleDownloadPDF = () => {
    const pdf = new jsPDF("p", "mm", "a4");

    let y = 20;

    const checkPageBreak = (space = 10) => {
      if (y + space > 280) {
        pdf.addPage();
        y = 20;
      }
    };

    // TÍTULO
    pdf.setFont("Times", "bold");
    pdf.setFontSize(14);
    pdf.text("CENTRO DE RECUPERAÇÃO ÁTRIO", 105, y, { align: "center" });

    y += 6;
    pdf.setFontSize(12);
    pdf.text("RELATÓRIO PAS", 105, y, { align: "center" });

    y += 10;

    // DADOS
    pdf.setFont("Times", "normal");
    pdf.text(`Nome do Interno: ${formData.nome}`, 20, y);
    y += 7;

    pdf.text(`Data da Sessão: ${formData.data}`, 20, y);
    y += 7;

    pdf.text(`Data de Entrada: ${formData.dataDeEntrada}`, 20, y);
    y += 10;

    // FUNÇÃO DE BLOCO
    const bloco = (titulo, texto) => {
      checkPageBreak(20);

      pdf.setFont("Times", "bold");
      pdf.text(titulo, 20, y);
      y += 6;

      pdf.setFont("Times", "normal");

      const linhas = pdf.splitTextToSize(texto || "", 170);
      pdf.text(linhas, 20, y);

      y += linhas.length * 6 + 6;
    };

    bloco("1. Atendimento Psicológico:", formData.atendimento);
    bloco("2. Evolução do Vínculo Familiar:", formData.vinculo);
    bloco("3. Atividades Laborterápicas:", formData.atividades);
    bloco("4. Acompanhamento Médico:", formData.acompanhamentoMedico);
    bloco("5. Acompanhamento Espiritual:", formData.acompanhamentoEspiritual);
    bloco("6. Possíveis Queixas:", formData.queixas);

    // ASSINATURA
    checkPageBreak(30);

    y += 10;
    pdf.line(60, y, 150, y);
    y += 6;

    pdf.text("Assinatura do Psicólogo", 105, y, { align: "center" });

    pdf.save("relatorio-pas.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-2xl p-8">
        
        <button onClick={onBack} className="mb-4 text-sm text-gray-600">
          ← Voltar
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-800">Relatório PAS</h1>

            <input name="nome" placeholder="Nome" onChange={handleChange} className="w-full p-2 border rounded-lg" />
            <input type="date" name="data" onChange={handleChange} className="w-full p-2 border rounded-lg" />
            <input type="date" name="dataDeEntrada" onChange={handleChange} className="w-full p-2 border rounded-lg" />

            {[
              { label: "Atendimento Psicológico", name: "atendimento" },
              { label: "Evolução do Vínculo Familiar", name: "vinculo" },
              { label: "Atividades Laborterápicas", name: "atividades" },
              { label: "Acompanhamento Médico", name: "acompanhamentoMedico" },
              { label: "Acompanhamento Espiritual", name: "acompanhamentoEspiritual" },
              { label: "Possíveis Queixas", name: "queixas" }
            ].map((field) => (
              <textarea
                key={field.name}
                name={field.name}
                placeholder={field.label}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                rows={4}
              />
            ))}

            <button className="w-full bg-black text-white py-2 rounded-lg">
              Finalizar
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Relatório pronto</h2>

            <button
              onClick={handleDownloadPDF}
              className="w-full bg-black text-white py-3 rounded-lg"
            >
              Baixar PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}