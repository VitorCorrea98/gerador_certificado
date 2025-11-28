import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import type { Student, SignatureConfig, CourseInfo } from './types';
import CertificadeBackground from "./assets/ModeloCertificado.jpg";

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    position: 'relative',
    paddingHorizontal: '60px'
  },
  backgroundImage: {
    position: 'absolute',
    minWidth: '100%',
    minHeight: '100%',
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 60,
    paddingTop: 0,
    paddingBottom: 40,
    flexDirection: 'column',
  },
  mainContent: {
    flexGrow: 1,
    justifyContent: 'center',
    marginTop: '-50px'
  },
  certificamosText: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  studentName: {
    fontSize: 38,
    fontFamily: 'Helvetica-Bold',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  bodyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 1.6,
    color: '#333',
    marginBottom: 10,
  },
  bold: {
    fontFamily: 'Helvetica-Bold',
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#444',
    marginTop: 10,
  },
  signaturesContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    left: 0,
    right: 0,
    gap: 40,
    flexWrap: 'wrap',
    top: '370px'
  },
  signatureBlock: {
    flexDirection: 'column',
    alignItems: 'center',
    width: 200,
  },
  // --- AQUI ESTÃO AS MUDANÇAS ---
  sigImageContainer: {
    display: 'flex',
    height: 70,          // Altura fixa da área da assinatura
    width: '100%',       // Largura total do bloco (200px)
    alignItems: 'center',      // Centraliza horizontalmente o conteúdo
    justifyContent: 'flex-end',// Alinha a imagem na parte de baixo do container (perto da linha)
    marginBottom: 5,     // Espaço entre a imagem e a linha
    // backgroundColor: 'black' // Removi o fundo preto
  },
  sigImage: {
    height: '100%',      // Tenta usar 100% da altura disponível
    width: '100%',       // Tenta usar 100% da largura disponível
    objectPosition: 'center bottom' // Opcional: força ficar centralizado e encostado embaixo
  },
  // ------------------------------
  sigLine: {
    width: '80%',
    height: 1,
    backgroundColor: '#000',
    marginBottom: 4,
  },
  sigName: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sigRole: {
    fontSize: 9,
    textAlign: 'center',
    color: '#555',
  }
});

interface Props {
  students: Student[];
  signatures: SignatureConfig[];
  courseInfo: CourseInfo;
}

export const CertificateDocument = ({ students, signatures, courseInfo }: Props) => {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.toLocaleString('pt-BR', { month: 'long' });
  const year = currentDate.getFullYear();
  const dateString = `Rio de Janeiro, ${day} de ${month} de ${year}.`;

  const formatName = (nome: string) => {
    const parts = nome.trim().split(/\s+/);
    if (parts.length === 1) return parts[0];
    const firstName = parts[0];
    const lastName = parts[parts.length - 1];
    return `${firstName} ${lastName}`;
  }

  return (
    <Document>
      {students.map((student, index) => (
        <Page key={index} size="A4" orientation="landscape" style={styles.page}>
          <Image src={CertificadeBackground} style={styles.backgroundImage} fixed />
          <View style={styles.contentContainer}>
            <View style={styles.mainContent}>
              <Text style={styles.certificamosText}>certificamos que</Text>
              <Text style={styles.studentName}>{formatName(student.Nome)}</Text>
              <Text style={styles.bodyText}>
                concluiu o <Text style={styles.bold}>{courseInfo.nomeCurso}</Text>,
                na função de <Text style={styles.bold}>{student.Funcao}</Text>, realizado pela
                Secretaria Municipal de Saúde do Rio de Janeiro, no período de {courseInfo.periodo},
                com carga horária de {courseInfo.cargaHoraria}.
              </Text>
              <Text style={styles.dateText}>{dateString}</Text>
            </View>

            <View style={styles.signaturesContainer}>
              {signatures.map((sig) => (
                <View key={sig.id} style={styles.signatureBlock}>
                  {/* Container da Imagem */}
                  <View style={styles.sigImageContainer}>
                    {sig.imagePreview && (
                      <Image src={sig.imagePreview} style={styles.sigImage} />
                    )}
                  </View>
                  {/* Linha e Textos */}
                  <View style={styles.sigLine} />
                  <Text style={styles.sigName}>{sig.name}</Text>
                  <Text style={styles.sigRole}>{sig.role}</Text>
                </View>
              ))}
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
};