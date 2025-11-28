import { useState, useMemo, useEffect, memo } from 'react';
import * as XLSX from 'xlsx';
import { PDFViewer, pdf } from '@react-pdf/renderer'; // Importamos a função 'pdf'
import { CertificateDocument } from './CertificateDocument';
import type { Student, SignatureConfig, CourseInfo } from './types';
import { FileSpreadsheet, Trash2, Download, Eye, Settings, FileText, Loader2 } from 'lucide-react';

// --- Hook de Debounce Mantido (Para o Preview) ---
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// --- Componente de Preview (Memoizado) ---
const CertificatePreview = memo(({ students, signatures, courseInfo }: { students: Student[], signatures: SignatureConfig[], courseInfo: CourseInfo }) => {
  return (
    <PDFViewer className="w-full h-full border-none">
      <CertificateDocument students={students} signatures={signatures} courseInfo={courseInfo} />
    </PDFViewer>
  );
});

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [signatures, setSignatures] = useState<SignatureConfig[]>([]);
  const [fileName, setFileName] = useState('');

  // Novo estado para controlar o loading do botão manual
  const [isGenerating, setIsGenerating] = useState(false);

  const [courseInfo, setCourseInfo] = useState<CourseInfo>({
    nomeCurso: 'Capacitação em Saúde',
    periodo: '01/01/2024 a 05/01/2024',
    cargaHoraria: '20 horas'
  });

  // Preview usa dados debounced para não piscar
  const debouncedCourseInfo = useDebounce(courseInfo, 800);
  const debouncedSignatures = useDebounce(signatures, 800);

  const previewData: Student[] = useMemo(() => {
    if (students.length > 0) return [students[0]];
    return [{ Nome: "ADRIANA DA SILVA DUARTE", Funcao: "Apoiadora da linha Materno" }];
  }, [students]);

  // ... (Funções handleExcelUpload, addSignature, updateSignature, handleImageUpload permanecem iguais)
  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rawData = XLSX.utils.sheet_to_json<any>(ws);
      const cleanData: Student[] = rawData.map(row => {
        const findValue = (keywords: string[]) => {
          const key = Object.keys(row).find(k => keywords.some(w => k.toLowerCase().includes(w.toLowerCase())));
          return key ? String(row[key]).trim() : "";
        };
        return { Nome: findValue(['nome completo', 'nome']), Funcao: findValue(['cargo', 'função', 'funcao']) || "Participante" };
      }).filter(s => s.Nome !== "");
      setStudents(cleanData);
    };
    reader.readAsBinaryString(file);
  };

  const addSignature = () => { if (signatures.length >= 4) return; setSignatures([...signatures, { id: crypto.randomUUID(), name: '', role: '', imagePreview: '' }]); };
  const updateSignature = (id: string, field: keyof SignatureConfig, value: string) => { setSignatures(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s)); };
  const handleImageUpload = (id: string, file: File) => { updateSignature(id, 'imagePreview', URL.createObjectURL(file)); };

  // --- NOVA FUNÇÃO DE DOWNLOAD MANUAL ---
  const handleDownloadPDF = async () => {
    if (!fileName) return;
    setIsGenerating(true);

    try {
      // 1. Gera o Blob do PDF manualmente usando os dados ATUAIS
      const blob = await pdf(
        <CertificateDocument
          students={students}
          signatures={signatures}
          courseInfo={courseInfo}
        />
      ).toBlob();

      // 2. Cria uma URL temporária e força o download via HTML
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.pdf`;
      document.body.appendChild(link);
      link.click();

      // 3. Limpeza
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Houve um erro ao gerar o PDF. Verifique o console.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans flex flex-col lg:flex-row gap-6">


      {/* COLUNA ESQUERDA */}
      <div className="w-full lg:w-1/3 space-y-6 overflow-y-auto max-h-screen pb-20">
        <div className='flex items-center justify-between'>
          <h1 className="text-2xl font-bold text-gray-800">Gerador de Certificados</h1>
          <div className="flex justify-between items-center">
            <button onClick={onLogout} className="text-sm text-red-500 hover:text-red-700 font-bold underline">
              Sair do Sistema
            </button>
          </div>
        </div>

        {/* ... Blocos 1, 2 e 3 (CourseInfo, Excel, Signatures) permanecem iguais ... */}
        {/* Vou omiti-los aqui para economizar espaço, mantenha seu código anterior nesses blocos */}

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          {/* Seus inputs de curso aqui (use courseInfo direto) */}
          <h2 className="text-sm font-bold flex items-center gap-2 mb-4 text-gray-700">
            <Settings className="w-4 h-4 text-blue-600" /> 1. Informações do Curso
          </h2>
          {/* ... Inputs ... */}
          <div className="space-y-3">
            <input className="w-full p-2 border rounded text-sm" value={courseInfo.nomeCurso} onChange={e => setCourseInfo({ ...courseInfo, nomeCurso: e.target.value })} placeholder="Nome do curso" />
            <input className="w-full p-2 border rounded text-sm" value={courseInfo.periodo} onChange={e => setCourseInfo({ ...courseInfo, periodo: e.target.value })} placeholder="Período" />
            <input className="w-full p-2 border rounded text-sm" value={courseInfo.cargaHoraria} onChange={e => setCourseInfo({ ...courseInfo, cargaHoraria: e.target.value })} placeholder="Carga horária" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold flex items-center gap-2 mb-3 text-gray-700">
            <FileSpreadsheet className="w-4 h-4 text-green-600" /> 2. Lista de Alunos
          </h2>
          <input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          {students.length > 0 && <div className="mt-3 text-xs text-green-700">{students.length} alunos carregados.</div>}
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          {/* Seus inputs de assinatura aqui */}
          <h2 className="text-sm font-bold flex items-center gap-2 mb-3 text-gray-700">3. Assinaturas</h2>
          <div className="space-y-4">
            {signatures.map((sig) => (
              <div key={sig.id} className="border border-gray-200 rounded p-3 relative bg-gray-50">
                <button onClick={() => setSignatures(s => s.filter(x => x.id !== sig.id))} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                <div className="space-y-2">
                  <input placeholder="Nome" className="w-full px-2 py-1 border rounded text-xs" value={sig.name} onChange={e => updateSignature(sig.id, 'name', e.target.value)} />
                  <input placeholder="Cargo" className="w-full px-2 py-1 border rounded text-xs" value={sig.role} onChange={e => updateSignature(sig.id, 'role', e.target.value)} />
                  <input type="file" accept="image/*" className="text-xs w-full" onChange={e => e.target.files && handleImageUpload(sig.id, e.target.files[0])} />
                </div>
              </div>
            ))}
            <button onClick={addSignature} className="w-full py-2 border border-dashed border-blue-300 text-blue-600 rounded text-xs hover:bg-blue-50">+ Adicionar Assinatura</button>
          </div>
        </div>


        {/* 4. Finalização (MANUAL) */}
        {students.length > 0 && (
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-blue-600">
            <h2 className="text-sm font-bold flex items-center gap-2 mb-3 text-gray-700">
              <FileText className="w-4 h-4 text-blue-600" /> 4. Finalização
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Nome do Arquivo</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Ex: Certificados_Turma_A"
                    className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                  />
                  <span className="text-sm text-gray-500 font-medium">.pdf</span>
                </div>
              </div>

              {/* Botão Manual com Lógica de Loading */}
              <button
                onClick={handleDownloadPDF}
                disabled={fileName.trim().length === 0 || isGenerating}
                className={`w-full py-3 rounded-lg font-bold shadow-lg flex items-center justify-center gap-2 transition-all 
                  ${fileName.trim().length > 0 && !isGenerating
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`
                }
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Gerando PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    {fileName.trim().length === 0 ? 'Aguardando Nome...' : 'Gerar e Baixar PDF'}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* COLUNA DIREITA (Preview) */}
      <div className="flex-1 bg-gray-200 rounded-xl overflow-hidden shadow-inner flex flex-col h-[80vh] lg:h-auto">
        <div className="bg-gray-800 text-white p-2 text-xs flex justify-between px-4">
          <span className="flex items-center gap-2"><Eye className="w-3 h-3" /> Preview (Apenas 1º aluno)</span>
        </div>

        {/* O Preview continua usando debounce para não pesar, mas o download agora é sob demanda */}
        <CertificatePreview
          students={previewData}
          signatures={debouncedSignatures}
          courseInfo={debouncedCourseInfo}
        />
      </div>
    </div>
  );
}

export default Dashboard;