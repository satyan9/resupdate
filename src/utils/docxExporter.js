// ATS-Compliant DOCX Generator using docx and file-saver
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

/**
 * Generates and downloads an ATS-compliant Word document (.docx)
 * Strictly follows single-column standard margins, clean standard headings, no tables.
 * @param {object} resume 
 */
export async function exportResumeToDocx(resume) {
  const children = [];

  // 1. Name & Header (Centered)
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: resume.fullName || "Candidate Name",
          bold: true,
          size: 32, // 16pt
          font: "Calibri",
          color: "111827"
        })
      ]
    })
  );

  // Target Role
  if (resume.targetRole) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [
          new TextRun({
            text: resume.targetRole,
            bold: true,
            size: 24, // 12pt
            font: "Calibri",
            color: "4F46E5"
          })
        ]
      })
    );
  }

  // Contact Info
  const contactParts = [
    resume.email,
    resume.phone,
    resume.location,
    resume.linkedin,
    resume.github
  ].filter(Boolean);

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: contactParts.join("  |  "),
          size: 19, // 9.5pt
          font: "Calibri",
          color: "4B5563"
        })
      ]
    })
  );

  // Helper for Section Heading
  const addSectionHeader = (title) => {
    children.push(
      new Paragraph({
        spacing: { before: 200, after: 100 },
        border: {
          bottom: {
            color: "9CA3AF",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6
          }
        },
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 22, // 11pt
            font: "Calibri",
            color: "111827"
          })
        ]
      })
    );
  };

  // 2. Summary
  if (resume.summary) {
    addSectionHeader("Professional Summary");
    children.push(
      new Paragraph({
        spacing: { after: 160 },
        children: [
          new TextRun({
            text: resume.summary,
            size: 20, // 10pt
            font: "Calibri",
            color: "374151"
          })
        ]
      })
    );
  }

  // 3. Technical Skills
  if (resume.skills && Object.keys(resume.skills).length > 0) {
    addSectionHeader("Core Competencies & Technical Skills");
    for (const [category, items] of Object.entries(resume.skills)) {
      const skillsList = Array.isArray(items) ? items.join(", ") : String(items);
      children.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: `${category}: `,
              bold: true,
              size: 20,
              font: "Calibri",
              color: "1F2937"
            }),
            new TextRun({
              text: skillsList,
              size: 20,
              font: "Calibri",
              color: "374151"
            })
          ]
        })
      );
    }
  }

  // 4. Experience
  if (resume.experience && resume.experience.length > 0) {
    addSectionHeader("Professional Experience");
    resume.experience.forEach(job => {
      // Role & Dates
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 40 },
          children: [
            new TextRun({
              text: `${job.role} `,
              bold: true,
              size: 21,
              font: "Calibri",
              color: "111827"
            }),
            new TextRun({
              text: `– ${job.company} (${job.period || ''})`,
              bold: true,
              size: 20,
              font: "Calibri",
              color: "4B5563"
            })
          ]
        })
      );

      // Bullets
      if (job.bullets) {
        job.bullets.forEach(bullet => {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 40 },
              children: [
                new TextRun({
                  text: bullet,
                  size: 20,
                  font: "Calibri",
                  color: "374151"
                })
              ]
            })
          );
        });
      }
    });
  }

  // 5. Education
  if (resume.education && resume.education.length > 0) {
    addSectionHeader("Education");
    resume.education.forEach(edu => {
      children.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: `${edu.degree} `,
              bold: true,
              size: 20,
              font: "Calibri",
              color: "111827"
            }),
            new TextRun({
              text: `– ${edu.institution} (${edu.year || ''})`,
              size: 20,
              font: "Calibri",
              color: "4B5563"
            })
          ]
        })
      );
    });
  }

  // 6. Certifications
  if (resume.certifications && resume.certifications.length > 0) {
    addSectionHeader("Certifications");
    resume.certifications.forEach(cert => {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: cert,
              size: 20,
              font: "Calibri",
              color: "374151"
            })
          ]
        })
      );
    });
  }

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,    // 0.5 in
              right: 720,
              bottom: 720,
              left: 720
            }
          }
        },
        children: children
      }
    ]
  });

  // Pack & Save
  const blob = await Packer.toBlob(doc);
  const cleanName = (resume.fullName || "Candidate").toLowerCase().replace(/\s+/g, '_');
  saveAs(blob, `${cleanName}_ATS_Tailored_Resume.docx`);
}
