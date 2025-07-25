import { NextResponse } from 'next/server';
import { exportData } from '@/lib/sheets-storage';
import { jsPDF } from 'jspdf';

export async function GET() {
  try {
    const data = await exportData();
    
    // Criar documento PDF
    const doc = new jsPDF();
    
    // Título do documento
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Lista de Convidados', 105, 20, { align: 'center' });
    
    // Cabeçalho da tabela
    let yPosition = 45;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    
    // Definir posições das colunas
    const col1X = 20;  // Nome
    const col2X = 90;  // RG
    const col3X = 140; // Placa
    
    doc.text('Nome', col1X, yPosition);
    doc.text('RG', col2X, yPosition);
    doc.text('Placa Veículo', col3X, yPosition);
    
    // Linha separadora
    yPosition += 5;
    doc.line(20, yPosition, 190, yPosition);
    
    // Dados dos convidados
    yPosition += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    data.guests.forEach((guest) => {
      // Verificar se precisa de nova página
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
        
        // Repetir cabeçalho na nova página
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('Nome', col1X, yPosition);
        doc.text('RG', col2X, yPosition);
        doc.text('Placa Veículo', col3X, yPosition);
        yPosition += 5;
        doc.line(20, yPosition, 190, yPosition);
        yPosition += 10;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
      }
      
      // Truncar texto se necessário
      const name = guest.name || '';
      const rg = guest.rg || '';
      const plate = guest.licensePlate || '';
      
      doc.text(name.length > 20 ? name.substring(0, 20) + '...' : name, col1X, yPosition);
      doc.text(rg, col2X, yPosition);
      doc.text(plate, col3X, yPosition);
      
      yPosition += 8;
    });
    
    // Gerar PDF como buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="lista-convidados-cha-bar.pdf"'
      }
    });
    
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
  }
}
