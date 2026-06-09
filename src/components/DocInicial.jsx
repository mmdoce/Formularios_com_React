import React, { useState } from "react";
import jsPDF from "jspdf";

export default function DocInicial({ onBack }) {
  const [formData, setFormData] = useState({
    // Instituição
    instituicao: "",
    endereco: "",
    telefone: "",
    prontuario: "",
    // Identificação
    nome: "",
    dataNascimento: "",
    idade: "",
    sexo: "",
    estadoCivil: "",
    escolaridade: "",
    profissao: "",
    dataAvaliacao: "",
    // Seções narrativas
    historicoUso: "",
    historicoFamiliar: "",
    condicoesSaude: "",
    aspectosPsicologicos: "",
    fatoresRiscoProtecao: "",
    impressaoPsicologica: "",
    recomendacoes: "",
    // Assinaturas
    nomePsicologo: "",
    crp: "",
    nomeTerapeuta: "",
    funcaoTerapeuta: "",
    registroTerapeuta: "",
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
        pdf.setDrawColor(180, 180, 180);
        pdf.setLineWidth(0.3);
        pdf.line(marginLeft, y - 4, pageWidth - marginRight, y - 4);
      }
    };

    // ── CABEÇALHO ──────────────────────────────────────────────
    pdf.setFillColor(240, 240, 240);
    pdf.rect(0, 0, pageWidth, 20, "F");

    pdf.setTextColor(30, 30, 30);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text(
      (formData.instituicao || "CENTRO DE RECUPERAÇÃO").toUpperCase(),
      pageWidth / 2, 8, { align: "center" }
    );

    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.text(
      "AVALIAÇÃO PSICOLÓGICA INICIAL — DEPENDÊNCIA QUÍMICA",
      pageWidth / 2, 14, { align: "center" }
    );

    if (formData.endereco || formData.telefone) {
      pdf.setFontSize(7);
      pdf.setTextColor(100, 100, 100);
      const subHeader = [formData.endereco, formData.telefone].filter(Boolean).join("  |  ");
      pdf.text(subHeader, pageWidth / 2, 19, { align: "center" });
    }

    y = 30;

    // ── HELPER: seção com título ───────────────────────────────
    const renderSecao = (titulo) => {
      checkPageBreak(14);
      pdf.setFillColor(240, 240, 240);
      pdf.rect(marginLeft, y - 4, contentWidth, 8, "F");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.setTextColor(30, 30, 30);
      pdf.text(titulo, marginLeft + 2, y + 0.5);
      y += 9;
    };

    const renderCampo = (label, valor, inline = false) => {
      checkPageBreak(7);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.setTextColor(50, 50, 50);
      if (inline) {
        pdf.text(`${label}:`, marginLeft, y);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(0, 0, 0);
        pdf.text(valor || "___________________________", marginLeft + pdf.getTextWidth(`${label}: `) + 1, y);
        y += 6;
      } else {
        pdf.text(`${label}:`, marginLeft, y);
        y += 5.5;
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(0, 0, 0);
        const linhas = pdf.splitTextToSize(valor || "Não informado.", contentWidth - 4);
        linhas.forEach((linha) => {
          checkPageBreak(6);
          pdf.text(linha, marginLeft + 2, y);
          y += 5.5;
        });
        y += 3;
      }
    };

    // ── I. IDENTIFICAÇÃO ───────────────────────────────────────
    renderSecao("I — IDENTIFICAÇÃO");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(50, 50, 50);
    pdf.text("Prontuário nº:", marginLeft, y);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(0, 0, 0);
    pdf.text(formData.prontuario || "___________", marginLeft + 28, y);
    y += 7;

    renderCampo("Nome do avaliado", formData.nome, true);

    // Linha: Data de nascimento | Idade | Sexo
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(50, 50, 50);
    pdf.text("Data de nascimento:", marginLeft, y);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(0, 0, 0);
    pdf.text(formatDate(formData.dataNascimento), marginLeft + 38, y);

    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(50, 50, 50);
    pdf.text("Idade:", pageWidth / 2 - 20, y);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(0, 0, 0);
    pdf.text(formData.idade || "____", pageWidth / 2 - 5, y);

    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(50, 50, 50);
    pdf.text("Sexo:", pageWidth / 2 + 20, y);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(0, 0, 0);
    pdf.text(formData.sexo || "___________", pageWidth / 2 + 32, y);
    y += 7;

    // Linha: Estado civil | Escolaridade | Profissão
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(50, 50, 50);
    pdf.text("Estado civil:", marginLeft, y);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(0, 0, 0);
    pdf.text(formData.estadoCivil || "_____________", marginLeft + 24, y);

    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(50, 50, 50);
    pdf.text("Escolaridade:", pageWidth / 2 - 20, y);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(0, 0, 0);
    pdf.text(formData.escolaridade || "_____________", pageWidth / 2 + 6, y);
    y += 7;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(50, 50, 50);
    pdf.text("Profissão:", marginLeft, y);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(0, 0, 0);
    pdf.text(formData.profissao || "___________________________", marginLeft + 20, y);

    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(50, 50, 50);
    pdf.text("Data da avaliação:", pageWidth / 2 + 10, y);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(0, 0, 0);
    pdf.text(formatDate(formData.dataAvaliacao), pageWidth / 2 + 42, y);
    y += 10;

    // ── II. FINALIDADE ─────────────────────────────────────────
    renderSecao("II — FINALIDADE DA AVALIAÇÃO");
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8.5);
    pdf.setTextColor(60, 60, 60);
    const finalidade =
      "Compreender aspectos emocionais, cognitivos, comportamentais, sociais e motivacionais relacionados ao uso de substâncias psicoativas, subsidiando o planejamento terapêutico e o acompanhamento interdisciplinar.";
    pdf.splitTextToSize(finalidade, contentWidth - 4).forEach((l) => {
      checkPageBreak(6);
      pdf.text(l, marginLeft + 2, y);
      y += 5.5;
    });
    y += 5;

    // ── III. PROCEDIMENTOS ─────────────────────────────────────
    renderSecao("III — PROCEDIMENTOS UTILIZADOS");
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8.5);
    pdf.setTextColor(60, 60, 60);
    pdf.splitTextToSize(
      "Entrevista psicológica, observação clínica, anamnese, análise documental e outros procedimentos pertinentes.",
      contentWidth - 4
    ).forEach((l) => {
      checkPageBreak(6);
      pdf.text(l, marginLeft + 2, y);
      y += 5.5;
    });
    y += 5;

    // ── SEÇÕES NARRATIVAS ──────────────────────────────────────
    const secoes = [
      { titulo: "IV — HISTÓRICO DO USO DE SUBSTÂNCIAS", campo: formData.historicoUso },
      { titulo: "V — HISTÓRICO FAMILIAR E SOCIAL", campo: formData.historicoFamiliar },
      { titulo: "VI — CONDIÇÕES DE SAÚDE", campo: formData.condicoesSaude },
      {
        titulo: "VII — ASPECTOS PSICOLÓGICOS OBSERVADOS",
        campo:
          formData.aspectosPsicologicos,
        subtitulo:
          "Estado emocional, humor, cognição, atenção, memória, juízo crítico, insight e motivação para tratamento.",
      },
      { titulo: "VIII — FATORES DE RISCO E PROTEÇÃO", campo: formData.fatoresRiscoProtecao },
      { titulo: "IX — IMPRESSÃO PSICOLÓGICA", campo: formData.impressaoPsicologica },
      { titulo: "X — RECOMENDAÇÕES", campo: formData.recomendacoes },
    ];

    secoes.forEach(({ titulo, campo, subtitulo }) => {
      renderSecao(titulo);
      if (subtitulo) {
        pdf.setFont("helvetica", "italic");
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.splitTextToSize(subtitulo, contentWidth - 4).forEach((l) => {
          checkPageBreak(5);
          pdf.text(l, marginLeft + 2, y);
          y += 5;
        });
        y += 2;
      }
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);
      pdf.splitTextToSize(campo || "Não informado.", contentWidth - 4).forEach((l) => {
        checkPageBreak(6);
        pdf.text(l, marginLeft + 2, y);
        y += 5.5;
      });
      y += 5;
    });

    // ── XI. DECLARAÇÃO ÉTICA ───────────────────────────────────
    renderSecao("XI — DECLARAÇÃO ÉTICA E LEGAL");
    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(8);
    pdf.setTextColor(80, 80, 80);
    pdf.splitTextToSize(
      "Documento elaborado em conformidade com a Lei nº 4.119/1962, Código de Ética Profissional do Psicólogo e Resolução CFP nº 31/2022. As informações possuem caráter sigiloso.",
      contentWidth - 4
    ).forEach((l) => {
      checkPageBreak(6);
      pdf.text(l, marginLeft + 2, y);
      y += 5.5;
    });
    y += 8;

    // ── ASSINATURAS ────────────────────────────────────────────
    checkPageBreak(55);
    renderSecao("ASSINATURAS");

    const colA = marginLeft;
    const colB = pageWidth / 2 + 5;
    const lineW = 70;

    // Psicólogo
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(30, 30, 30);
    pdf.text("Psicólogo(a) Responsável", colA, y);
    pdf.setFont("helvetica", "normal");
    y += 6;
    pdf.text(`Nome: ${formData.nomePsicologo || "______________________________"}`, colA, y);
    y += 6;
    pdf.text(`CRP: ${formData.crp || "________________________________"}`, colA, y);
    y += 10;
    pdf.setDrawColor(100, 100, 100);
    pdf.setLineWidth(0.4);
    pdf.line(colA, y, colA + lineW, y);
    y += 5;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(80, 80, 80);
    pdf.text("Assinatura", colA, y);
    y += 10;

    // Terapeuta / Equipe
    checkPageBreak(35);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(30, 30, 30);
    pdf.text("Terapeuta / Membro da Equipe Técnica", colA, y);
    pdf.setFont("helvetica", "normal");
    y += 6;
    pdf.text(`Nome: ${formData.nomeTerapeuta || "______________________________"}`, colA, y);
    y += 6;
    pdf.text(`Função: ${formData.funcaoTerapeuta || "____________________________"}`, colA, y);
    y += 6;
    pdf.text(`Registro: ${formData.registroTerapeuta || "__________________________"}`, colA, y);
    y += 10;
    pdf.setDrawColor(100, 100, 100);
    pdf.setLineWidth(0.4);
    pdf.line(colA, y, colA + lineW, y);
    y += 5;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(80, 80, 80);
    pdf.text("Assinatura", colA, y);

    y += 10;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Gerado em ${new Date().toLocaleDateString("pt-BR")}`, pageWidth / 2, y, { align: "center" });

    // ── RODAPÉ ──────────────────────────────────────────────────
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7);
      pdf.setTextColor(150, 150, 150);
      pdf.text(
        `${formData.instituicao || "Centro de Recuperação"}  •  Avaliação Psicológica Inicial  •  Página ${i} de ${totalPages}`,
        pageWidth / 2,
        pageHeight - 8,
        { align: "center" }
      );
    }

    pdf.save(`avaliacao-psicologica-${formData.nome || "avaliado"}.pdf`);
  };

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
              <h1 className="text-2xl font-bold text-gray-800">Avaliação Psicológica Inicial</h1>
              <p className="text-sm text-gray-500 mt-1">Dependência Química</p>
            </div>

            {/* Dados da Instituição */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide border-b pb-1">Dados da Instituição</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Instituição</label>
                  <input name="instituicao" placeholder="Nome da instituição" onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Prontuário nº</label>
                  <input name="prontuario" placeholder="Número do prontuário" onChange={handleChange} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Endereço</label>
                <input name="endereco" placeholder="Endereço completo" onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Telefone</label>
                <input name="telefone" placeholder="(00) 00000-0000" onChange={handleChange} className={inputClass} />
              </div>
            </div>

            {/* I – Identificação */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide border-b pb-1">I – Identificação</h2>
              <div>
                <label className={labelClass}>Nome do avaliado</label>
                <input name="nome" placeholder="Nome completo" onChange={handleChange} className={inputClass} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Data de nascimento</label>
                  <input type="date" name="dataNascimento" onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Idade</label>
                  <input name="idade" placeholder="Ex: 34" onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Sexo</label>
                  <select name="sexo" onChange={handleChange} className={inputClass}>
                    <option value="">Selecione</option>
                    <option>Masculino</option>
                    <option>Feminino</option>
                    <option>Outro</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Estado civil</label>
                  <select name="estadoCivil" onChange={handleChange} className={inputClass}>
                    <option value="">Selecione</option>
                    <option>Solteiro(a)</option>
                    <option>Casado(a)</option>
                    <option>Divorciado(a)</option>
                    <option>Viúvo(a)</option>
                    <option>União estável</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Escolaridade</label>
                  <select name="escolaridade" onChange={handleChange} className={inputClass}>
                    <option value="">Selecione</option>
                    <option>Ensino fundamental incompleto</option>
                    <option>Ensino fundamental completo</option>
                    <option>Ensino médio incompleto</option>
                    <option>Ensino médio completo</option>
                    <option>Ensino superior incompleto</option>
                    <option>Ensino superior completo</option>
                    <option>Pós-graduação</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Profissão</label>
                  <input name="profissao" placeholder="Profissão atual" onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Data da avaliação</label>
                  <input type="date" name="dataAvaliacao" onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </div>

            {/* Seções narrativas */}
            {[
              { label: "IV – Histórico do Uso de Substâncias", name: "historicoUso", hint: "Substâncias utilizadas, frequência, tempo de uso, padrão de consumo..." },
              { label: "V – Histórico Familiar e Social", name: "historicoFamiliar", hint: "Dinâmica familiar, suporte social, vínculos significativos..." },
              { label: "VI – Condições de Saúde", name: "condicoesSaude", hint: "Diagnósticos, medicações em uso, internações anteriores..." },
              { label: "VII – Aspectos Psicológicos Observados", name: "aspectosPsicologicos", hint: "Estado emocional, humor, cognição, atenção, memória, juízo crítico, insight e motivação para tratamento..." },
              { label: "VIII – Fatores de Risco e Proteção", name: "fatoresRiscoProtecao", hint: "Fatores que aumentam ou diminuem o risco de recaída..." },
              { label: "IX – Impressão Psicológica", name: "impressaoPsicologica", hint: "Síntese clínica e hipóteses diagnósticas..." },
              { label: "X – Recomendações", name: "recomendacoes", hint: "Encaminhamentos, intervenções sugeridas, metas terapêuticas..." },
            ].map((field) => (
              <div key={field.name}>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide border-b pb-1 mb-3">{field.label}</h2>
                <textarea
                  name={field.name}
                  placeholder={field.hint}
                  onChange={handleChange}
                  rows={5}
                  className={`${inputClass} resize-y`}
                />
              </div>
            ))}

            {/* Assinaturas */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide border-b pb-1">Assinaturas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Nome do(a) Psicólogo(a)</label>
                  <input name="nomePsicologo" placeholder="Nome completo" onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>CRP</label>
                  <input name="crp" placeholder="00/000000" onChange={handleChange} className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Nome do Terapeuta / Técnico</label>
                  <input name="nomeTerapeuta" placeholder="Nome completo" onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Função</label>
                  <input name="funcaoTerapeuta" placeholder="Ex: Assistente social" onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Registro (se houver)</label>
                  <input name="registroTerapeuta" placeholder="Nº do registro" onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-gray-900 hover:bg-gray-700 text-white py-3 rounded-lg text-base font-medium transition"
            >
              Finalizar Avaliação
            </button>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-2xl p-8 space-y-4 text-center">
            <div className="text-4xl">✅</div>
            <h2 className="text-xl font-semibold text-gray-800">Avaliação pronta para download</h2>
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
              Editar avaliação
            </button>
          </div>
        )}
      </div>
    </div>
  );
}