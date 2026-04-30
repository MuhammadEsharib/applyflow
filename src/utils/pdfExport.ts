import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ExportData {
  title: string;
  content: string;
  metadata?: Record<string, string | number>;
  timestamp?: string;
}

export class PDFExporter {
  private static doc: jsPDF;

  static async exportToPDF(
    data: ExportData,
    filename?: string,
    options?: {
      fontSize?: number;
      margin?: number;
      lineHeight?: number;
      titleFontSize?: number;
    }
  ): Promise<void> {
    try {
      const {
        fontSize = 12,
        margin = 20,
        lineHeight = 7,
        titleFontSize = 20
      } = options || {};

      this.doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = this.doc.internal.pageSize.getWidth();
      const pageHeight = this.doc.internal.pageSize.getHeight();
      const contentWidth = pageWidth - (margin * 2);
      let currentY = margin;

      // Add title
      this.doc.setFontSize(titleFontSize);
      this.doc.setFont('helvetica', 'bold');
      const titleLines = this.doc.splitTextToSize(data.title, contentWidth);

      titleLines.forEach((line: string) => {
        if (currentY > pageHeight - margin) {
          this.doc.addPage();
          currentY = margin;
        }
        this.doc.text(line, margin, currentY);
        currentY += lineHeight * 2;
      });

      // Add metadata if provided
      if (data.metadata) {
        currentY += lineHeight;
        this.doc.setFontSize(10);
        this.doc.setFont('helvetica', 'normal');

        Object.entries(data.metadata).forEach(([key, value]) => {
          if (currentY > pageHeight - margin) {
            this.doc.addPage();
            currentY = margin;
          }
          const metaText = `${key}: ${value}`;
          this.doc.text(metaText, margin, currentY);
          currentY += lineHeight;
        });

        currentY += lineHeight;
      }

      // Add content
      this.doc.setFontSize(fontSize);
      this.doc.setFont('helvetica', 'normal');

      const paragraphs = data.content.split('\n\n');

      for (const paragraph of paragraphs) {
        if (paragraph.trim()) {
          const lines = this.doc.splitTextToSize(paragraph.trim(), contentWidth);

          for (const line of lines) {
            if (currentY > pageHeight - margin) {
              this.doc.addPage();
              currentY = margin;
            }
            this.doc.text(line, margin, currentY);
            currentY += lineHeight;
          }

          currentY += lineHeight; // Add space between paragraphs
        }
      }

      // Add timestamp
      if (data.timestamp) {
        currentY = pageHeight - margin - 10;
        this.doc.setFontSize(8);
        this.doc.setFont('helvetica', 'italic');
        this.doc.text(`Generated on: ${data.timestamp}`, margin, currentY);
      }

      // Save the PDF
      const finalFilename = filename || `${data.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      this.doc.save(finalFilename);

    } catch {
      throw new Error('Failed to generate PDF. Please try again.');
    }
  }

  static async exportElementToPDF(
    elementId: string,
    filename?: string
  ): Promise<void> {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Element not found');
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const finalFilename = filename || `${elementId}_export.pdf`;
      pdf.save(finalFilename);

    } catch {
      throw new Error('Failed to export element to PDF. Please try again.');
    }
  }

  static async exportApplicationToPDF(
    applicationData: Record<string, unknown>,
    filename?: string
  ): Promise<void> {
    try {
      const exportData: ExportData = {
        title: `Job Application: ${applicationData.title} at ${applicationData.company}`,
        content: this.formatApplicationContent(applicationData),
        metadata: {
          'Company': applicationData.company as string,
          'Location': applicationData.location as string,
          'Salary': applicationData.salary as string,
          'Status': applicationData.status as string,
          'Priority': applicationData.priority as string,
          'Applied Date': applicationData.createdAt ? new Date(applicationData.createdAt as string).toLocaleDateString() : 'N/A'
        },
        timestamp: new Date().toLocaleString()
      };

      await this.exportToPDF(exportData, filename);

    } catch {
      throw new Error('Failed to export application to PDF. Please try again.');
    }
  }

  static async exportDocumentationToPDF(
    docData: Record<string, unknown>,
    completedSections?: Set<string>,
    filename?: string
  ): Promise<void> {
    try {
      let content = '';

      // Add sections
      const sections = docData.sections as Array<{ title: string; content: string[]; codeSnippets?: Array<{ title?: string; code: string }>; examples?: Array<{ title: string; description: string; code?: string }>; tips?: string[]; warnings?: string[] }>;
      if (sections && sections.length > 0) {
        sections.forEach((section, index: number) => {
          content += `${index + 1}. ${section.title}\n\n`;

          // Add main content
          if (section.content && section.content.length > 0) {
            section.content.forEach((paragraph: string) => {
              content += `${paragraph}\n\n`;
            });
          }

          // Add code snippets
          if (section.codeSnippets && section.codeSnippets.length > 0) {
            content += 'Code Examples:\n';
            section.codeSnippets.forEach((snippet) => {
              if (snippet.title) {
                content += `${snippet.title}:\n`;
              }
              content += `${snippet.code}\n\n`;
            });
          }

          // Add examples
          if (section.examples && section.examples.length > 0) {
            content += 'Examples:\n';
            section.examples.forEach((example) => {
              content += `${example.title}:\n`;
              content += `Description: ${example.description as string}\n\n`;
              if (example.code) {
                content += `${example.code}\n`;
              }
              content += '\n';
            });
          }

          // Add tips
          if (section.tips && section.tips.length > 0) {
            content += 'Pro Tips:\n';
            section.tips.forEach((tip) => {
              content += `â¢ ${tip}\n`;
            });
            content += '\n';
          }

          // Add warnings
          if (section.warnings && section.warnings.length > 0) {
            content += 'Important Notes:\n';
            section.warnings.forEach((warning) => {
              content += `• ${warning}\n`;
            });
            content += '\n';
          }

          content += '\n---\n\n';
        });
      }

      const exportData: ExportData = {
        title: docData.title as string,
        content: content,
        metadata: {
          'Category': docData.category as string,
          'Difficulty': docData.difficulty as string,
          'Read Time': docData.readTime as string,
          'Completed Sections': completedSections ? completedSections.size : 0,
          'Total Sections': sections ? sections.length : 0
        },
        timestamp: new Date().toLocaleString()
      };

      await this.exportToPDF(exportData, filename);

    } catch {
      throw new Error('Failed to export documentation to PDF. Please try again.');
    }
  }

  private static formatApplicationContent(applicationData: Record<string, unknown>): string {
    let content = '';

    content += `Job Description:\n${(applicationData.description as string) || 'No description provided'}\n\n`;

    if (applicationData.url) {
      content += `Job Posting URL:\n${applicationData.url}\n\n`;
    }

    if (applicationData.notes) {
      content += `Notes:\n${applicationData.notes}\n\n`;
    }

    content += `Application Details:\n`;
    content += `â¢ Status: ${applicationData.status}\n`;
    content += `â¢ Priority: ${applicationData.priority}\n`;
    content += `â¢ Location: ${applicationData.location}\n`;
    content += `â¢ Salary Range: ${applicationData.salary || 'Not specified'}\n`;
    content += `Company Website: ${(applicationData.url as string) || 'Not provided'}\n\n`;

    if (applicationData.createdAt) {
      content += `â¢ Applied Date: ${new Date(applicationData.createdAt as string).toLocaleDateString()}\n`;
    }

    if (applicationData.updatedAt) {
      content += `â¢ Last Updated: ${new Date(applicationData.updatedAt as string).toLocaleDateString()}\n`;
    }

    return content;
  }

  static validateExportData(data: Record<string, unknown>): boolean {
    if (!data || typeof data !== 'object') {
      return false;
    }

    if (!data.title || typeof data.title !== 'string') {
      return false;
    }

    return true;
  }
}
