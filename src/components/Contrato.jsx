import React, { useState } from "react";
import jsPDF from "jspdf";

export default function Contrato({ onBack }) {
  const [formData, setFormData] = useState({
    // Dados do contrato
    numeroContrato: "",
    diaContrato: "",
    mesContrato: "",
    anoContrato: "",

    // Contratante (familiar ou responsável)
    contratanteNome: "",
    contratanteRG: "",
    contratanteCPF: "",
    contratanteTel: "",
    contratanteEnd: "",
    contratanteCep: "",
    contratanteBairro: "",
    contratanteCidade: "",
    contratanteEstado: "",

    // Dados do acolhido (aluno)
    acolhidoNome: "",
    acolhidoDataNasc: "",
    acolhidoRG: "",
    acolhidoCPF: "",
    acolhidoEnd: "",
    acolhidoCep: "",
    acolhidoBairro: "",
    acolhidoCidade: "",
    acolhidoTel: "",

    // Valor do contrato
    valorMensal: "",
    valorMensalExtenso: "",
    valorMatricula: "",
    valorMatriculaExtenso: "",
    tipoVaga: "",

    // Termo de compromisso (assinatura)
    diaTermo: "",
    mesTermo: "",
    anoTermo: "",

   
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

    const renderParagrafo = (texto, opts = {}) => {
      const { bold = false, size = 9, color = [0, 0, 0], indent = 2 } = opts;
      pdf.setFont("helvetica", bold ? "bold" : "normal");
      pdf.setFontSize(size);
      pdf.setTextColor(...color);
      pdf.splitTextToSize(texto, contentWidth - indent * 2).forEach((linha) => {
        checkPageBreak(6);
        pdf.text(linha, marginLeft + indent, y);
        y += 5.5;
      });
      y += 3;
    };

    const renderLinha = (label, valor, width = contentWidth) => {
      checkPageBreak(7);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.setTextColor(50, 50, 50);
      pdf.text(`${label}:`, marginLeft + 2, y);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);
      const labelWidth = pdf.getTextWidth(`${label}: `) + 1;
      const linhas = pdf.splitTextToSize(valor || "___________________________", width - labelWidth - 2);
      pdf.text(linhas[0] || "", marginLeft + 2 + labelWidth, y);
      y += 6;
      for (let i = 1; i < linhas.length; i++) {
        checkPageBreak(6);
        pdf.text(linhas[i], marginLeft + 2 + labelWidth, y);
        y += 6;
      }
    };

    // ── CABEÇALHO ──────────────────────────────────────────────
    pdf.setFillColor(240, 240, 240);
    pdf.rect(0, 0, pageWidth, 22, "F");

    pdf.setTextColor(30, 30, 30);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);
    pdf.text("ÁTRIO", pageWidth / 2, 9, { align: "center" });

    pdf.setFontSize(9);
    pdf.text("CENTRO DE RECUPERAÇÃO", pageWidth / 2, 15, { align: "center" });

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7);
    pdf.setTextColor(100, 100, 100);
    pdf.text("CNPJ 03.768.337/0002-12", pageWidth / 2, 20, { align: "center" });

    y = 30;

    // ── LOCAL, DATA E Nº DE CONTRATO ───────────────────────────
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);
    pdf.text(
      `Mogi das Cruzes, ${formData.diaContrato || "____"} de ${formData.mesContrato || "______________"} de 20${formData.anoContrato || "__"}`,
      marginLeft,
      y
    );
    pdf.text(`Nº DE CONTRATO: ${formData.numeroContrato || "_________"}`, pageWidth - marginRight, y, { align: "right" });
    y += 10;

    // ── TÍTULO ──────────────────────────────────────────────────
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text("CONTRATO DE PRESTAÇÃO DE SERVIÇO", pageWidth / 2, y, { align: "center" });
    y += 10;

    // ── 1. DO OBJETO ────────────────────────────────────────────
    renderSecao("1 — DO OBJETO");
    renderParagrafo(
      "Contrato de prestação de serviço objetivando o acolhimento e atendimento psicossocial e espiritual por internação voluntária, consentida e sem motivo de força maior ou coação ao acolhido (abaixo citado) nos moldes legais de COMUNIDADE TERAPÊUTICA, o qual aceita participar do programa de recuperação proposto por esta instituição."
    );

    // ── 2. DAS PARTES ───────────────────────────────────────────
    renderSecao("2 — DAS PARTES");
    renderParagrafo(
      "A CONTRATADA, doravante denominada CENTRO DE RECUPERAÇÃO ÁTRIO, localizada e identificada pelo endereço e dados supracitados, firma contrato com:"
    );

    checkPageBreak(7);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(30, 30, 30);
    pdf.text("CONTRATANTE (familiar ou responsável)", marginLeft + 2, y);
    y += 6;
    renderLinha("Nome", formData.contratanteNome);
    renderLinha("RG", formData.contratanteRG, contentWidth / 2);
    renderLinha("CPF", formData.contratanteCPF, contentWidth / 2);
    renderLinha("Telefone", formData.contratanteTel);
    renderLinha("Endereço", formData.contratanteEnd);
    renderLinha("CEP", formData.contratanteCep, contentWidth / 2);
    renderLinha("Bairro", formData.contratanteBairro);
    renderLinha("Cidade", formData.contratanteCidade, contentWidth / 2);
    renderLinha("Estado", formData.contratanteEstado, contentWidth / 2);
    y += 3;

    checkPageBreak(7);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(30, 30, 30);
    pdf.text("DADOS DO ACOLHIDO (aluno)", marginLeft + 2, y);
    y += 6;
    renderLinha("Nome", formData.acolhidoNome);
    renderLinha("Data de nascimento", formatDate(formData.acolhidoDataNasc), contentWidth / 2);
    renderLinha("RG", formData.acolhidoRG, contentWidth / 2);
    renderLinha("CPF", formData.acolhidoCPF);
    renderLinha("Endereço", formData.acolhidoEnd);
    renderLinha("CEP", formData.acolhidoCep, contentWidth / 2);
    renderLinha("Bairro", formData.acolhidoBairro);
    renderLinha("Cidade", formData.acolhidoCidade, contentWidth / 2);
    renderLinha("Telefone", formData.acolhidoTel, contentWidth / 2);
    y += 3;

    // ── CLÁUSULA 1ª — TRATAMENTO ───────────────────────────────
    renderSecao("CLÁUSULA 1ª — DO TRATAMENTO");
    renderParagrafo(
      "1.1 O tratamento do acolhido será realizado dentro da instituição com sessões de atendimento psicológico individual e em grupo, atividades laboterapêuticas, recreativas, lazer, organização do meio em que vive, aprendizagem, reinserção social e reuniões espirituais."
    );
    renderParagrafo(
      "1.2 O programa de internação tem cronograma estimado em 9 meses, este período poderá ser estendido ou abreviado, de acordo com critérios e discussões da equipe técnica da instituição, familiares e o próprio interno, e a ALTA TERAPÊUTICA se dará por avaliação da equipe técnica (Psicólogo, Coordenador Espiritual e Técnico de Desenvolvimento Humano)."
    );
    renderParagrafo(
      "1.3 Os familiares, por sua vez, poderão fazer visitas ao acolhido nos fins de semana, onde serão orientados por membros da equipe técnica a serem inseridos no contexto terapêutico como coparticipantes da recuperação e da reconstrução do vínculo familiar."
    );
    renderParagrafo(
      "1.4 A alta por ABANDONO se dará por manifestação do próprio acolhido, e o mesmo registrará o motivo, se assim o quiser, do seu desligamento. A CONTRATADA tem um período de até 24h para contatar o responsável ou familiares via telefone ou e-mail."
    );
    renderParagrafo(
      "1.5 A alta ADMINISTRATIVA ocorrerá por desrespeito às normas do PROGRAMA DE RECUPERAÇÃO, REGIMENTO INTERNO e ao TERMO DE COMPROMISSO, dos quais o acolhido e o responsável tomaram ciência no ato da internação."
    );
    renderParagrafo(
      "1.6 A alta por FUGA será comunicada à família ou responsável e será registrada no prontuário do interno com data e hora da descoberta da evasão."
    );

    // ── DA CONTRIBUIÇÃO ─────────────────────────────────────────
    renderSecao("DA CONTRIBUIÇÃO");
    renderParagrafo(
      "2.1 A contratação somente será efetiva, salvo nos casos de VAGA SOCIAL, com pagamento da TAXA DE MATRÍCULA da instituição, e após 30 (trinta) dias, conforme a data deste contrato, o CONTRATANTE assume o compromisso do pagamento da 1ª parcela."
    );
    renderParagrafo(
      "2.2 O não pagamento acarretará no desligamento do acolhido do programa terapêutico no prazo improrrogável de 5 dias do vencimento da contribuição. O não cumprimento desta cláusula poderá dar margem às medidas legais cabíveis.",
      { bold: true }
    );
    renderParagrafo(
      "2.3 As vagas sociais seguirão os critérios de ofertas da direção, sendo estas disponibilizadas de acordo com o perfil socio familiar do acolhido e a oferta de vagas."
    );

    // ── DO VALOR DO CONTRATO ────────────────────────────────────
    renderSecao("DO VALOR DO CONTRATO");
    checkPageBreak(7);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);
    pdf.text(
      "3.1 A CONTRATADA cobrará pelos serviços prestados, objeto do presente contrato, o valor mensal de:",
      marginLeft + 2,
      y
    );
    y += 6;
    renderLinha("Valor mensal (R$)", formData.valorMensal, contentWidth / 2);
    renderLinha("Valor por extenso", formData.valorMensalExtenso);
    renderLinha("Valor da matrícula (R$)", formData.valorMatricula, contentWidth / 2);
    renderLinha("Valor por extenso", formData.valorMatriculaExtenso);
    renderLinha("Tipo da vaga", formData.tipoVaga || "Não informado");
    y += 3;

    // ── DOS DEVERES DO CONTRATANTE ──────────────────────────────
    renderSecao("DOS DEVERES DO CONTRATANTE");
    renderParagrafo("3.1 Tomar ciência do REGIMENTO INTERNO e das NORMAS DE CONVÍVIO da instituição antes de firmar este contrato.");
    renderParagrafo("3.2 É dever do responsável pela internação honrar com o pagamento mensal firmado neste contrato.");
    renderParagrafo("3.3 Participar da recuperação do acolhido e das reuniões familiares mensais sempre que convocado.");
    renderParagrafo("3.4 Fazer o acompanhamento do acolhido nos tratamentos clínicos, exames e consultas hospitalares que por ventura sejam necessários ao acolhido.");
    renderParagrafo("3.5 Trazer hemograma sanguíneo completo do acolhido, produtos de higiene pessoal, roupas, botas, cadeados para armário e, quando necessário e após consulta médica, os medicamentos com receita médica prescrita por um profissional da área de saúde.");

    // ── DOS DEVERES DA INSTITUIÇÃO ───────────────────────────────
    renderSecao("DOS DEVERES DA INSTITUIÇÃO");
    renderParagrafo("4.1 Possuir um responsável técnico disponível para as mais diversas informações e que tenha a responsabilidade por ministrar os medicamentos, com receituário médico, nos devidos horários e dosagens.");
    renderParagrafo("4.2 Ter sempre pessoas capacitadas para o atendimento de eventuais crises emocionais do acolhido.");
    renderParagrafo("4.3 Manter informados os responsáveis ou familiares do acolhido, via telefone ou pessoalmente, sobre a participação, resultados e satisfação do interno no programa de recuperação.");
    renderParagrafo("4.4 Zelar pela segurança, saúde, alimentação e bem-estar do acolhido no que tange ao universo da comunidade terapêutica.");
    renderParagrafo("4.5 Honrar com o programa terapêutico proposto (atendimento psicológico, laboterapêutico, espiritual, social e familiar) no que trata o universo da dependência química.");
    renderParagrafo("4.6 Fica eleito o foro da comarca de Mogi das Cruzes, estado de São Paulo, para dirimir quaisquer questões atinentes ao presente instrumento.");

    // ── DECLARAÇÃO DE COMPROMISSO E ADESÃO ÀS NORMAS ────────────
    checkPageBreak(20);
    renderSecao("DECLARAÇÃO DE COMPROMISSO E ADESÃO ÀS NORMAS");
    renderParagrafo(
      `Eu, ${formData.acolhidoNome || "___________________________________________"}, inscrito(a) no CPF sob o nº ${formData.acolhidoCPF || "________________________"}, declaro para os devidos fins que estou ciente e de acordo com todas as normas e diretrizes estabelecidas pelo Centro de Recuperação Átrio, comunidade terapêutica voltada à recuperação de dependentes químicos.`
    );
    renderParagrafo(
      "Declaro, ainda, que minha permanência nesta instituição é totalmente voluntária e consciente, e que me comprometo a cumprir integralmente todas as atividades propostas e delegadas pela equipe técnica, incluindo, mas não se limitando a:"
    );
    [
      "Laborterapias;",
      "Atividades de espiritualidade;",
      "Atividades terapêuticas;",
      "Atividades inclusivas;",
      "Atividades recreativas e lúdicas;",
      "Atividades de socialização;",
      "Atividades de organização e manutenção do ambiente em que resido.",
    ].forEach((item) => {
      checkPageBreak(6);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`•  ${item}`, marginLeft + 4, y);
      y += 5.5;
    });
    y += 2;
    renderParagrafo(
      "Estou ciente de que o descumprimento das normas e compromissos estabelecidos poderá acarretar em meu desligamento da instituição, de acordo com avaliação da equipe responsável."
    );
    renderParagrafo("Por ser expressão da minha livre e espontânea vontade, firmo a presente declaração.");

    // ── TERMO DE COMPROMISSO ────────────────────────────────────
    checkPageBreak(60);
    renderSecao("TERMO DE COMPROMISSO");
    renderParagrafo(
      "E por estarem juntas e contratadas, as partes assinam o presente termo, juntamente com a testemunha abaixo identificada."
    );
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);
    pdf.text(
      `Mogi das Cruzes, ${formData.diaTermo || "____"} de ${formData.mesTermo || "______________"} de 20${formData.anoTermo || "__"}`,
      marginLeft + 2,
      y
    );
    y += 12;

    const colA = marginLeft;
    const lineW = 70;

    // Contratante
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(30, 30, 30);
    pdf.text("CONTRATANTE", colA, y);
    y += 6;
    pdf.setFont("helvetica", "normal");
    pdf.text(`Nome: ${formData.contratanteNome || "______________________________"}`, colA, y);
    y += 6;
    pdf.text(`RG: ${formData.contratanteRG || "________________________________"}`, colA, y);
    y += 10;
    pdf.setDrawColor(100, 100, 100);
    pdf.setLineWidth(0.4);
    pdf.line(colA, y, colA + lineW, y);
    y += 5;
    pdf.setFontSize(8);
    pdf.setTextColor(80, 80, 80);
    pdf.text("Assinatura", colA, y);
    y += 12;

    // Contratada
    checkPageBreak(40);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(30, 30, 30);
    pdf.text("CONTRATADA — CENTRO DE RECUPERAÇÃO ÁTRIO", colA, y);
    y += 6;
    pdf.setFont("helvetica", "normal");
    pdf.text("CNPJ: 03.768.337/0002-12", colA, y);
    y += 6;
    pdf.text("Aldico Sousa Santos (Presidente)", colA, y);
    y += 10;
    pdf.line(colA, y, colA + lineW, y);
    y += 5;
    pdf.setFontSize(8);
    pdf.setTextColor(80, 80, 80);
    pdf.text("Assinatura", colA, y);
    y += 12;

    // Interno / Co-responsável técnico
    checkPageBreak(40);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(30, 30, 30);
    pdf.text("INTERNO", colA, y);
    y += 6;
    pdf.setFont("helvetica", "normal");
    pdf.text(`Nome: ${formData.acolhidoNome || "______________________________"}`, colA, y);
    y += 10;
    pdf.line(colA, y, colA + lineW, y);
    y += 5;
    pdf.setFontSize(8);
    pdf.setTextColor(80, 80, 80);
    pdf.text("Assinatura", colA, y);
    y += 12;

    checkPageBreak(30);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(30, 30, 30);
    pdf.text("Norval do Carmo (Co-responsável técnico)", colA, y);
    y += 10;
    pdf.setDrawColor(100, 100, 100);
    pdf.line(colA, y, colA + lineW, y);
    y += 5;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(80, 80, 80);
    pdf.text("Assinatura", colA, y);

    y += 16;

    checkPageBreak(25);
    const lineW2 = 75;
    pdf.setDrawColor(100, 100, 100);
    pdf.setLineWidth(0.4);
    pdf.line(colA, y, colA + lineW2, y);
    pdf.line(pageWidth / 2 + 5, y, pageWidth / 2 + 5 + lineW2, y);
    y += 5;
    pdf.setFontSize(8);
    pdf.setTextColor(80, 80, 80);
    pdf.text("Interno", colA, y);
    pdf.text("Responsável", pageWidth / 2 + 5, y);

    // ── RODAPÉ ──────────────────────────────────────────────────
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7);
      pdf.setTextColor(150, 150, 150);
      pdf.text(
        "Estrada MN do Rio Grande, 20 – Pq. São Martinho – Mogi das Cruzes – SP  |  (11) 94329-7875  |  atrio.prbob@gmail.com",
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );
      pdf.text(`Página ${i} de ${totalPages}`, pageWidth / 2, pageHeight - 6, { align: "center" });
    }

    pdf.save(`contrato-atrio-${formData.acolhidoNome || "acolhido"}.pdf`);
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
              <h1 className="text-2xl font-bold text-gray-800">Contrato de Prestação de Serviço</h1>
              <p className="text-sm text-gray-500 mt-1">Centro de Recuperação Átrio</p>
            </div>

            {/* Dados do contrato */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide border-b pb-1">Dados do Contrato</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Nº do contrato</label>
                  <input name="numeroContrato" onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Dia</label>
                  <input name="diaContrato" placeholder="Ex: 15" onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Mês</label>
                  <input name="mesContrato" placeholder="Ex: junho" onChange={handleChange} className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Ano (2 dígitos)</label>
                  <input name="anoContrato" placeholder="Ex: 26" onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </div>

            {/* Contratante */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide border-b pb-1">Contratante (familiar ou responsável)</h2>
              <div>
                <label className={labelClass}>Nome completo</label>
                <input name="contratanteNome" onChange={handleChange} className={inputClass} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>RG</label>
                  <input name="contratanteRG" onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>CPF</label>
                  <input name="contratanteCPF" onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Telefone</label>
                  <input name="contratanteTel" onChange={handleChange} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Endereço</label>
                <input name="contratanteEnd" onChange={handleChange} className={inputClass} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className={labelClass}>CEP</label>
                  <input name="contratanteCep" onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Bairro</label>
                  <input name="contratanteBairro" onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Cidade</label>
                  <input name="contratanteCidade" onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Estado</label>
                  <input name="contratanteEstado" onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </div>

            {/* Dados do acolhido */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide border-b pb-1">Dados do Acolhido (aluno)</h2>
              <div>
                <label className={labelClass}>Nome completo</label>
                <input name="acolhidoNome" onChange={handleChange} className={inputClass} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Data de nascimento</label>
                  <input type="date" name="acolhidoDataNasc" onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>RG</label>
                  <input name="acolhidoRG" onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>CPF</label>
                  <input name="acolhidoCPF" onChange={handleChange} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Endereço</label>
                <input name="acolhidoEnd" onChange={handleChange} className={inputClass} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className={labelClass}>CEP</label>
                  <input name="acolhidoCep" onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Bairro</label>
                  <input name="acolhidoBairro" onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Cidade</label>
                  <input name="acolhidoCidade" onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Telefone</label>
                  <input name="acolhidoTel" onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </div>

            {/* Valor do contrato */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide border-b pb-1">Valor do Contrato</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Valor mensal (R$)</label>
                  <input name="valorMensal" placeholder="Ex: 2.500,00" onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Valor mensal por extenso</label>
                  <input name="valorMensalExtenso" placeholder="Ex: dois mil e quinhentos reais" onChange={handleChange} className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Valor da matrícula (R$)</label>
                  <input name="valorMatricula" onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Valor por extenso</label>
                  <input name="valorMatriculaExtenso" onChange={handleChange} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Tipo da vaga</label>
                <select name="tipoVaga" onChange={handleChange} className={inputClass}>
                  <option value="">Selecione</option>
                  <option value="Social">Social</option>
                  <option value="Mensal">Mensal</option>
                </select>
              </div>
            </div>

            {/* Termo de compromisso */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide border-b pb-1">Termo de Compromisso (data de assinatura)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Dia</label>
                  <input name="diaTermo" onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Mês</label>
                  <input name="mesTermo" onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Ano (2 dígitos)</label>
                  <input name="anoTermo" onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </div>

            {/* Ficha de saída */}
           
            <button
              onClick={handleSubmit}
              className="w-full bg-gray-900 hover:bg-gray-700 text-white py-3 rounded-lg text-base font-medium transition"
            >
              Finalizar Contrato
            </button>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-2xl p-8 space-y-4 text-center">
            <div className="text-4xl">✅</div>
            <h2 className="text-xl font-semibold text-gray-800">Contrato pronto para download</h2>
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
              Editar contrato
            </button>
          </div>
        )}
      </div>
    </div>
  );
}