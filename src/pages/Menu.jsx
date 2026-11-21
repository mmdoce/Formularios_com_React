import { useState } from "react";
import Contrato from "../components/Contrato";
import Mensalidades from "../components/Mensalidades";
import DocInicial from "../components/DocInicial";
import FormularioPAS from "../components/FormularioPAS";
import FormularioPsicoterapia from "../components/FormularioPsicoterapia";
import FormularioGrupal from "../components/FormularioGrupal";
import FormularioEncaminhamento from "../components/FormularioEncaminhamento";
import FormularioEvolucaoIndividual from "../components/FormularioEvolucaoIndividual";
import FormularioEncerramento from "../components/FormularioEncerramento";

const forms = [
  ["contrato", "Contrato"],
  ["docinicial", "Avaliação Psicológica Inicial / Sessão de Início"],
  ["pas", "Relatório PAS / Sessão inicial"],
  ["psicoterapia", "Psicoterapia Individual / Sessão Rotina"],
  ["mensalidades", "Controle de Mensalidades (em manutenção)"],
  ["grupal", "Registro de atividade psicológica grupal"],
  ["encaminhamento", "Registro de Encaminhamento"],
  ["encerramento", "Registro de Encerramento"],
  ["evolucaoIndividual", "Evolução Psicológica Individual"],
];

export default function Menu() {
  const [screen, setScreen] = useState("menu");
  const onBack = () => setScreen("menu");
  const activeForms = {
    contrato: <Contrato onBack={onBack} />,
    mensalidades: <Mensalidades onBack={onBack} />,
    docinicial: <DocInicial onBack={onBack} />,
    pas: <FormularioPAS onBack={onBack} />,
    psicoterapia: <FormularioPsicoterapia onBack={onBack} />,
    grupal: <FormularioGrupal onBack={onBack} />,
    encaminhamento: <FormularioEncaminhamento onBack={onBack} />,
    encerramento: <FormularioEncerramento onBack={onBack} />,
    evolucaoIndividual: <FormularioEvolucaoIndividual onBack={onBack} />,
  };

  return <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
    {screen === "menu" ? <main className="mx-auto mt-8 w-full max-w-3xl rounded-2xl bg-white p-5 shadow-lg sm:mt-16 sm:p-10">
      <header className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">Centro de Recuperação Átrio</h1>
        <p className="mt-1 text-sm text-gray-500">Formulários do Serviço de Psicologia</p>
      </header>
      <nav aria-label="Formulários" className="mt-8 flex flex-col gap-3">
        {forms.map(([id, label]) => <button key={id} type="button" onClick={() => setScreen(id)} className="rounded-xl bg-teal-700 px-4 py-3 text-left font-medium text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">{label}</button>)}
      </nav>
    </main> : activeForms[screen]}
  </div>;
}
