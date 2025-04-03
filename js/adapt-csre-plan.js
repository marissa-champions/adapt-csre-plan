
define([
  'core/js/adapt',
  'core/js/views/componentView',
  'core/js/models/componentModel'
], function (Adapt, ComponentView, ComponentModel) {

  var csreplanView = ComponentView.extend({

    events: {
      'click .js-csreplan-export-click': 'onExportPDF'
    },

    preRender: function () {

      this.checkIfResetOnRevisit();
    },

    postRender: function () {
      this.setReadyStatus();

      this.setupInview();
    },

    setupInview: function () {
      var selector = this.getInviewElementSelector();
      if (!selector) {
        // this.setCompletionStatus();
        return;
      }

      this.setupInviewCompletion(selector);
    },
    cleanText: function (text) {
      return text
        .replace(/&nbsp;/g, ' ')        // Replace non-breaking spaces
        .replace(/[\r\n]+/g, ' ')       // Replace line breaks with spaces
        .replace(/[‘’]/g, "'")          // Normalize smart single quotes
        .replace(/[“”]/g, '"')          // Normalize smart double quotes
        .trim()                         // Remove leading/trailing spaces
        .replace(/\s\s+/g, ' ');        // Replace multiple spaces with a single space
    },
    onExportPDF: function () {
      require(['https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.0.0/jspdf.umd.js'], ({ jsPDF }) => {
        const doc = new jsPDF({
          orientation: "vertical",
          unit: "in",
          format: [8.5, 11]
        });

        let yPos = 0.5;
        const leftPos = 0.5;
        const centerPos = 4.25;
        const maxWidth = 7.5;
        const bottomPos = 10.5;

        const d = new Date();
        const dateToday = '' + (d.getMonth() + 1) + d.getDate() + d.getFullYear() + '';

        // Handle the image dynamically
        const pdfImageElement = this.$('.csreplan__pdf-image');
        if (pdfImageElement.length && pdfImageElement.html()) {
          const pdfImage = pdfImageElement.html();
          doc.addImage(pdfImage, 'png', leftPos, yPos, maxWidth, 1, '', 'none', 0);
          yPos += 1.2;
        }

        // Render title first
        if (this.model.attributes.pdf[0].title) {
          doc.setTextColor(4, 73, 144);
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          const pdfTitle = this.$('.csreplan__pdf-title').html();
          const lines = doc.splitTextToSize(pdfTitle, maxWidth);
          doc.text(lines, centerPos, yPos, { align: 'center' });
          yPos += lines.length * 0.2;
        }

        // Render subtitle next
        if (this.model.attributes.pdf[0].subTitle) {
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(14);
          doc.setFont("helvetica", "normal");
          const pdfSubTitle = this.$('.csreplan__pdf-subtitle').html();
          const lines = doc.splitTextToSize(pdfSubTitle, maxWidth);
          doc.text(lines, centerPos, yPos, { align: 'center' });
          yPos += lines.length * 0.2;
        }

        // Render content title next
        if (this.model.attributes.pdf[0].contentTitle) {
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(12);
          doc.setFont("helvetica", "normal");
          const pdfContentTitle = this.$('.csreplan__pdf-contenttitle').html();
          const lines = doc.splitTextToSize(pdfContentTitle, maxWidth);
          doc.text(lines, centerPos, yPos, { align: 'center' });
          yPos += lines.length * 0.2;
        }

        // Render content body 
        if (this.model.attributes.pdf[0].content) {
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(12);
          doc.setFont("helvetica", "normal");

          const rawPdfBody = this.$('.csreplan__pdf-content').html();
          const pdfBody = rawPdfBody ? this.cleanText(rawPdfBody) : ''; // Use 'this.cleanText'

          const lines = doc.splitTextToSize(pdfBody, maxWidth);

          doc.text(lines, leftPos, yPos, { align: 'left' });
          yPos += lines.length * 0.2;
        }

        // Divider line
        doc.setDrawColor(0);
        doc.setFillColor(4, 73, 144);
        doc.rect(leftPos, yPos, maxWidth, 0.01, "F");
        yPos += 0.2;

        // Render items  
        for (let intItem in this.model.get('_items')) {
          const textTitle = this.$('.csreplan__item-title').eq(intItem).html();
          if (textTitle) {
            doc.setTextColor(0, 0, 0);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            const titleLines = doc.splitTextToSize(textTitle, maxWidth);
            doc.text(titleLines, leftPos, yPos, { align: 'left' });
            yPos += titleLines.length * 0.3;
          }

          const textAction = this.$('.csreplan__item-textbox').eq(intItem).val();
          if (textAction) {
            doc.setTextColor(102, 102, 102);
            doc.setFont("helvetica", "normal");
            const actionLines = doc.splitTextToSize(textAction, maxWidth);
            doc.text(actionLines, leftPos, yPos, { align: 'left' });
            yPos += actionLines.length * 0.2;
          }
        }

        // Footer
        doc.setFont("helvetica", "italic");
        const footerText = this.model.get('footerText') || '';
        doc.text(footerText, centerPos, bottomPos, { align: 'center', maxWidth: maxWidth });
        // Save the PDF
        doc.save('championsplan' + dateToday + ".pdf");
      });

      this.$('.csreplan__exporttitle').addClass('is-visible');
      this.$('.csreplan__buttons').removeClass('is-visible');

      this.setCompletionStatus();
    },
    /**
     * determines which element should be used for inview logic - body, instruction or title - and returns the selector for that element
     */
    getInviewElementSelector: function () {
      return 'csreplan__main';
    },

    checkIfResetOnRevisit: function () {
      var isResetOnRevisit = this.model.get('_isResetOnRevisit');

      // If reset is enabled set defaults
      if (isResetOnRevisit) {
        this.model.reset(isResetOnRevisit);
      }
    }
  },
    {
      template: 'csreplan'
    });

  return Adapt.register('csreplan', {
    model: ComponentModel.extend({}),// create a new class in the inheritance chain so it can be extended per component type if necessary later
    view: csreplanView
  });
});
