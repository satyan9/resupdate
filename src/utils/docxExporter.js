// ATS-Compliant DOCX Generator using docx and file-saver
import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, ExternalHyperlink } from 'docx';
import { saveAs } from 'file-saver';

/**
 * Generates and downloads an ATS-compliant Word document (.docx)
 * Strictly preserves candidate truth with clickable hyperlinks and 1-page compact layout.
 * @param {object} resume 
 * @param {object} options 
 */
export async function exportResumeToDocx(resume, options = { showSummary: false }) {
  const children = [];

  // 1. Name (Centered)
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 20 },
      children: [
        new TextRun({
          text: (resume.fullName || "SATYANARAYANA REDDY KOLAGATLA").toUpperCase(),
          bold: true,
          size: 26, // 13pt
          font: "Calibri",
          color: "111827"
        })
      ]
    })
  );

  // Headline
  const headline = resume.headline || resume.targetRole || "Data Engineer | ETL/ELT Pipeline Development | Bigquery | Airflow";
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: headline,
          bold: true,
          size: 19, // 9.5pt
          font: "Calibri",
          color: "374151"
        })
      ]
    })
  );

  // Contact Info (With clickable hyperlinks)
  const contactRuns = [];
  
  if (resume.phone) {
    contactRuns.push(new TextRun({ text: resume.phone, size: 17, font: "Calibri", color: "4B5563" }));
  }

  if (resume.email) {
    if (contactRuns.length > 0) contactRuns.push(new TextRun({ text: "  |  ", size: 17, font: "Calibri", color: "9CA3AF" }));
    contactRuns.push(
      new ExternalHyperlink({
        children: [
          new TextRun({
            text: resume.email,
            size: 17,
            font: "Calibri",
            color: "2563EB",
            underline: {}
          })
        ],
        link: `mailto:${resume.email}`
      })
    );
  }

  if (resume.location) {
    if (contactRuns.length > 0) contactRuns.push(new TextRun({ text: "  |  ", size: 17, font: "Calibri", color: "9CA3AF" }));
    contactRuns.push(new TextRun({ text: resume.location, size: 17, font: "Calibri", color: "4B5563" }));
  }

  if (resume.linkedin) {
    if (contactRuns.length > 0) contactRuns.push(new TextRun({ text: "  |  ", size: 17, font: "Calibri", color: "9CA3AF" }));
    const lUrl = resume.linkedin.startsWith("http") ? resume.linkedin : `https://${resume.linkedin}`;
    contactRuns.push(
      new ExternalHyperlink({
        children: [
          new TextRun({
            text: "LinkedIn",
            size: 17,
            font: "Calibri",
            color: "2563EB",
            underline: {}
          })
        ],
        link: lUrl
      })
    );
  }

  if (resume.github) {
    if (contactRuns.length > 0) contactRuns.push(new TextRun({ text: "  |  ", size: 17, font: "Calibri", color: "9CA3AF" }));
    const gUrl = resume.github.startsWith("http") ? resume.github : `https://${resume.github}`;
    contactRuns.push(
      new ExternalHyperlink({
        children: [
          new TextRun({
            text: "GitHub",
            size: 17,
            font: "Calibri",
            color: "2563EB",
            underline: {}
          })
        ],
        link: gUrl
      })
    );
  }

  if (resume.portfolio && !resume.portfolio.includes("gmail.com")) {
    if (contactRuns.length > 0) contactRuns.push(new TextRun({ text: "  |  ", size: 17, font: "Calibri", color: "9CA3AF" }));
    const pUrl = resume.portfolio.startsWith("http") ? resume.portfolio : `https://${resume.portfolio}`;
    contactRuns.push(
      new ExternalHyperlink({
        children: [
          new TextRun({
            text: "Portfolio",
            size: 17,
            font: "Calibri",
            color: "2563EB",
            underline: {}
          })
        ],
        link: pUrl
      })
    );
  }

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: contactRuns
    })
  );

  // Helper for Section Heading
  const addSectionHeader = (title) => {
    children.push(
      new Paragraph({
        spacing: { before: 100, after: 40 },
        border: {
          bottom: {
            color: "111827",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 4
          }
        },
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 19, // 9.5pt
            font: "Calibri",
            color: "111827"
          })
        ]
      })
    );
  };

  // 2. Summary (Optional)
  if (options.showSummary && resume.summary && resume.summary.trim().length > 0) {
    addSectionHeader("Professional Summary");
    children.push(
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: resume.summary,
            size: 18,
            font: "Calibri",
            color: "374151"
          })
        ]
      })
    );
  }

  // 3. Technical Skills
  if (resume.skills && Object.keys(resume.skills).length > 0) {
    addSectionHeader("Technical Skills");
    for (const [category, items] of Object.entries(resume.skills)) {
      const skillsList = Array.isArray(items) ? items.join(", ") : String(items);
      children.push(
        new Paragraph({
          spacing: { after: 25 },
          children: [
            new TextRun({
              text: `${category}: `,
              bold: true,
              size: 18,
              font: "Calibri",
              color: "111827"
            }),
            new TextRun({
              text: skillsList,
              size: 18,
              font: "Calibri",
              color: "374151"
            })
          ]
        })
      );
    }
  }

  // 4. Experience & Projects
  if (resume.experience && resume.experience.length > 0) {
    addSectionHeader("Work Experience");
    resume.experience.forEach(job => {
      children.push(
        new Paragraph({
          spacing: { before: 60, after: 20 },
          children: [
            new TextRun({
              text: `${job.role} `,
              bold: true,
              size: 18.5,
              font: "Calibri",
              color: "111827"
            }),
            new TextRun({
              text: job.company ? `| ${job.company} ` : '',
              bold: true,
              size: 18.5,
              font: "Calibri",
              color: "374151"
            }),
            new TextRun({
              text: job.period ? `(${job.period})` : '',
              size: 17,
              font: "Calibri",
              color: "6B7280"
            })
          ]
        })
      );

      if (job.bullets && job.bullets.length > 0) {
        job.bullets.forEach(bullet => {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 20 },
              children: [
                new TextRun({
                  text: bullet,
                  size: 17.5,
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

  // 5. Certifications & Achievements
  if (resume.certifications && resume.certifications.length > 0) {
    addSectionHeader("Certifications & Achievements");
    resume.certifications.forEach(cert => {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 20 },
          children: [
            new TextRun({
              text: cert,
              size: 17.5,
              font: "Calibri",
              color: "374151"
            })
          ]
        })
      );
    });
  }

  // 6. Education
  if (resume.education && resume.education.length > 0) {
    addSectionHeader("Education");
    resume.education.forEach(edu => {
      children.push(
        new Paragraph({
          spacing: { after: 25 },
          children: [
            new TextRun({
              text: `${edu.degree} `,
              bold: true,
              size: 18,
              font: "Calibri",
              color: "111827"
            }),
            new TextRun({
              text: edu.institution ? `\n${edu.institution} ` : '',
              size: 17,
              font: "Calibri",
              color: "4B5563"
            }),
            new TextRun({
              text: edu.year ? `(${edu.year})` : '',
              size: 17,
              font: "Calibri",
              color: "6B7280"
            })
          ]
        })
      );
    });
  }

  // Create document with standard 0.35 inch margins for exact 1-page fit
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 504,    // 0.35 in
              right: 504,
              bottom: 504,
              left: 504
            }
          }
        },
        children: children
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const cleanName = (resume.fullName || "Candidate").toLowerCase().replace(/\s+/g, '_');
  saveAs(blob, `${cleanName}_ATS_Resume.docx`);
}
