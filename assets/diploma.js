/* Shared by the browser download flow and the PDF layout checks. */
(function (root) {
    'use strict';

    function createDiploma(jsPDF, name, degree, date) {
        const doc = new jsPDF({ unit: 'mm', format: [240, 210], orientation: 'landscape' });
        const triangle = () => {
            doc.moveTo(120, 8);
            doc.lineTo(232, 202);
            doc.lineTo(8, 202);
            doc.close();
        };
        doc.saveGraphicsState();
        triangle();
        doc.clip();
        doc.discardPath();
        doc.setFillColor(248, 241, 220);
        doc.rect(0, 0, 240, 210, 'F');
        doc.setDrawColor(110, 38, 57);
        doc.setLineWidth(2);
        triangle();
        doc.stroke();
        doc.setDrawColor(195, 145, 55);
        doc.setLineWidth(0.6);
        doc.moveTo(120, 18);
        doc.lineTo(223, 197);
        doc.lineTo(17, 197);
        doc.close();
        doc.stroke();

        function centered(text, y, width, size, style = 'normal', maxLines = 2) {
            doc.setFont('times', style);
            let lines;
            do {
                doc.setFontSize(size);
                lines = doc.splitTextToSize(text, width);
                if (lines.length <= maxLines) break;
                size -= 0.5;
            } while (size > 7);
            doc.text(lines, 120, y, { align: 'center', lineHeightFactor: 1.15 });
        }
        doc.setTextColor(23, 45, 67);
        centered('UWC', 48, 32, 23, 'bold', 1);
        centered('UWC.EDU.BI', 57, 40, 9, 'bold', 1);
        centered('University of Wild Chicken', 73, 64, 14, 'bold', 2);
        centered('By the authority of The Banana Tree,', 88, 78, 11, 'italic');
        centered('the flock hereby declares', 95, 85, 11);
        centered(name, 108, 100, 21, 'bold');
        centered('spectacularly overqualified in', 124, 118, 11, 'italic');
        centered(degree, 138, 136, 19, 'bold');
        centered('No lectures attended. No cyber-roaches left unpecked.', 158, 157, 11);
        centered('Of the Slop, By the Slop, For the Slop.', 166, 167, 11, 'italic');
        centered('Gallinae Blattas Edunt', 177, 178, 14, 'bold');
        centered(`Conferred ${date} | Signed: Prof. Cluck, Dean of Dubious Distinction`, 186, 190, 9);
        centered('SATIRICAL SOUVENIR ONLY - Zero accreditation. Three excellent corners.', 193, 196, 8);
        doc.restoreGraphicsState();
        doc.setProperties({ title: `${degree} - University of Wild Chicken`, subject: 'Satirical triangular diploma', author: 'University of Wild Chicken' });
        return doc;
    }

    root.createDiploma = createDiploma;
    if (typeof module !== 'undefined' && module.exports) module.exports = { createDiploma };

    if (typeof document !== 'undefined') {
        const form = document.getElementById('applicationForm');
        const status = document.getElementById('status');
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const name = form.elements.name.value.trim();
            const custom = form.elements.customDegree.value.trim();
            const degree = custom || form.elements.degree.value;
            if (!name) {
                status.textContent = 'Even an imaginary university needs a name. Who gets the glory?';
                form.elements.name.focus();
                return;
            }
            try {
                const doc = createDiploma(root.jspdf.jsPDF, name, degree, new Date().toLocaleDateString());
                const filename = name.replace(/[^a-z0-9_-]/gi, '_').slice(0, 80) || 'wild_chicken';
                doc.save(`${filename}_triangular_diploma.pdf`);
                status.textContent = 'Degree freshly plucked! Your triangular diploma has been downloaded.';
            } catch (error) {
                status.textContent = 'The diploma coop jammed. Reload the page and try again.';
                console.error(error);
            }
        });
    }
}(typeof window !== 'undefined' ? window : globalThis));
