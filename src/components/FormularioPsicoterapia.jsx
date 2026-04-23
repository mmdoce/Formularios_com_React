import React, { useState } from "react";
import jsPDF from "jspdf";

export default function FormularioPsicoterapia({ onBack }) {
  const [formData, setFormData] = useState({
    nome: "",
    prontuario: "",
    sexo: "",
    idade: "",
    nomeMae: "",
    idadeMae: "",
    nomePai: "",
    idadePai: "",
    sessao: "",
    data: "",
    diaSemana: "",
    horario: "",
    sala: "",
    queixa: "",
    descricao: "",
    analise: "",
    psicologo: "",
    crp: ""
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

  // 🔥 PDF REAL (igual o outro que te passei)
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
    pdf.text("RELATÓRIO DE PSICOTERAPIA", 105, y, { align: "center" });

    y += 10;

    // LINHA DUPLA (igual documento)
    const linha = (l1, v1, l2, v2) => {
      checkPageBreak();

      pdf.setFont("Times", "bold");
      pdf.text(l1, 20, y);
      pdf.setFont("Times", "normal");
      pdf.text(v1 || "", 50, y);

      if (l2) {
        pdf.setFont("Times", "bold");
        pdf.text(l2, 110, y);
        pdf.setFont("Times", "normal");
        pdf.text(v2 || "", 140, y);
      }

      y += 7;
    };

    // DADOS
    linha("Nome:", formData.nome, "Prontuário:", formData.prontuario);
    linha("Sexo:", formData.sexo, "Idade:", formData.idade);
    linha("Nome da Mãe:", formData.nomeMae, "Idade:", formData.idadeMae);
    linha("Nome do Pai:", formData.nomePai, "Idade:", formData.idadePai);

    y += 5;

    linha("Sessão:", formData.sessao, "Data:", formData.data);
    linha("Dia:", formData.diaSemana, "Horário:", formData.horario);
    linha("Sala:", formData.sala);

    y += 10;

    // REGISTRO
    pdf.setFont("Times", "bold");
    pdf.text("REGISTRO DOCUMENTAL", 105, y, { align: "center" });

    y += 10;

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

    bloco("1. Queixa Inicial:", formData.queixa);
    bloco("2. Descrição da Sessão:", formData.descricao);
    bloco("3. Análise da Sessão:", formData.analise);

    // ASSINATURA
    checkPageBreak(30);

    y += 10;
    pdf.line(60, y, 150, y);
    y += 6;

    pdf.text(formData.psicologo || "Nome do Psicólogo", 105, y, {
      align: "center",
    });

    y += 6;
    pdf.text(`CRP: ${formData.crp || "__________"}`, 105, y, {
      align: "center",
    });

    pdf.save(`psicoterapia-${formData.nome || "relatorio"}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl">

        <button onClick={onBack} className="mb-4 text-sm text-gray-600">
          ← Voltar
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow">
            <h1 className="text-2xl font-semibold text-gray-800">
              Psicoterapia Individual e em Grupo
            </h1>

            <div className="grid grid-cols-2 gap-4">
              <input name="nome" placeholder="Nome" onChange={handleChange} className="p-2 border rounded-lg" />
              <input name="prontuario" placeholder="Prontuário" onChange={handleChange} className="p-2 border rounded-lg" />
              <input name="sexo" placeholder="Sexo" onChange={handleChange} className="p-2 border rounded-lg" />
              <input name="idade" placeholder="Idade" onChange={handleChange} className="p-2 border rounded-lg" />
              <input name="nomeMae" placeholder="Nome da Mãe" onChange={handleChange} className="p-2 border rounded-lg" />
              <input name="idadeMae" placeholder="Idade da Mãe" onChange={handleChange} className="p-2 border rounded-lg" />
              <input name="nomePai" placeholder="Nome do Pai" onChange={handleChange} className="p-2 border rounded-lg" />
              <input name="idadePai" placeholder="Idade do Pai" onChange={handleChange} className="p-2 border rounded-lg" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <input name="sessao" placeholder="Sessão" onChange={handleChange} className="p-2 border rounded-lg" />
              <input type="date" name="data" onChange={handleChange} className="p-2 border rounded-lg" />
              <input name="diaSemana" placeholder="Dia da Semana" onChange={handleChange} className="p-2 border rounded-lg" />
              <input name="horario" placeholder="Horário" onChange={handleChange} className="p-2 border rounded-lg" />
              <input name="sala" placeholder="Sala" onChange={handleChange} className="p-2 border rounded-lg" />
            </div>

            <textarea name="queixa" placeholder="Queixa Inicial" onChange={handleChange} className="w-full p-2 border rounded-lg" />
            <textarea name="descricao" placeholder="Descrição da Sessão" onChange={handleChange} className="w-full p-2 border rounded-lg" />
            <textarea name="analise" placeholder="Análise da Sessão" onChange={handleChange} className="w-full p-2 border rounded-lg" />

            <div className="grid grid-cols-2 gap-4">
              <input name="psicologo" placeholder="Nome do Psicólogo" onChange={handleChange} className="p-2 border rounded-lg" />
              <input name="crp" placeholder="CRP" onChange={handleChange} className="p-2 border rounded-lg" />
            </div>

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