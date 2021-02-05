
define([
  'core/js/adapt',
  'core/js/views/componentView',
  'core/js/models/componentModel'
], function(Adapt, ComponentView, ComponentModel) {
  
  var ActionPlanView = ComponentView.extend({

    events: {
      'click .js-actionplan-export-click': 'onExportPDF'
    },
    
    preRender: function() {

      this.checkIfResetOnRevisit();
    },

    postRender: function() {
      this.setReadyStatus();

      this.setupInview();
    },

    setupInview: function() {
      var selector = this.getInviewElementSelector();
      if (!selector) {
        // this.setCompletionStatus();
        return;
      }

      this.setupInviewCompletion(selector);
    },

    onExportPDF: function() {

      require(['https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.0.0/jspdf.umd.js'], ({ jsPDF }) => {
        const doc = new jsPDF();
        
        let yPos = 10;
        const leftPos = 10;
        const centerPos = 100;
        const maxWidth = 190;
        const bottomPos = 290;

        // doc.addFileToVFS("fonts/arial.ttf", FontModel.getDefault());
        // doc.addFont("fonts/arial.ttf", "Arial", "normal");

        // doc.setFont("Arial");

        // switch (Adapt.offlineStorage.get('lang')) {
        //   case 'zh-s':
        //   doc.addFileToVFS('fonts/MicrosoftYaHei-01-normal.ttf', FontModel.getChinese());
        //   doc.addFont('fonts/MicrosoftYaHei-01-normal.ttf', 'MicrosoftYaHei-01', 'normal');
        //   doc.setFont("fonts/MicrosoftYaHei-01");
        //   break;
        //   case 'ar':
        //   doc.addFileToVFS('fonts/PTSans-normal.ttf', FontModel.getArabic());
        //   doc.addFont('fonts/PTSans-normal.ttf', 'PTSans', 'normal');
        //   doc.setFont("fonts/PTSans");
        //   // doc.text('مرحبا', this.pdfWidth, 10);
        //   break;
        //   case 'ru':
        //   doc.addFileToVFS('fonts/Amiri-Regular-normal.ttf', FontModel.getRussian());
        //   doc.addFont('fonts/Amiri-Regular-normal.ttf', 'Amiri-Regular', 'normal');
        //   doc.setFont("fonts/Amiri-Regular");
        //   //doc.text("А ну чики брики и в дамки!", 10, 10);
        //   break;
        // }
        const d = new Date();
        const dateToday = '' + d.getDate() + (d.getMonth() + 1) + d.getFullYear() + '';
        const dateToShow = '' + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + '';

        const pdfImage = this.$('.actionplan__pdf-image').html();
        doc.addImage(pdfImage, 'png', leftPos, yPos, maxWidth, 53, '', 'none', 0);
        yPos += 73;
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        const pdfTitle = this.$('.actionplan__pdf-title').html();
        doc.text(pdfTitle, centerPos, yPos, { align: 'center', maxWidth: maxWidth });
        yPos += 20;

        doc.setTextColor(98, 166, 10);
        doc.setFontSize(22);
        doc.setFont("helvetica", "normal");
        const pdfSubTitle = this.$('.actionplan__pdf-subtitle').html();
        doc.text(pdfSubTitle, centerPos, yPos, { align: 'center', maxWidth: maxWidth });
        yPos += 20;
          
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        const pdfContentTitle = this.$('.actionplan__pdf-contenttitle').html();
        doc.text(pdfContentTitle, centerPos, yPos, { align: 'center', maxWidth: maxWidth });
        yPos += 10;

        doc.setDrawColor(0);
        doc.setFillColor(98, 166, 10);
        doc.rect(leftPos, yPos, maxWidth, 1, "F");
        yPos += 15;

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(13);
        doc.setFont("helvetica", "normal");
        const pdfBody = this.$('.actionplan__pdf-content').html();
        doc.text(pdfBody, centerPos, yPos, { align: 'center', maxWidth: maxWidth });
        yPos += 20;
        
        for( var intItem in this.model.get( '_items' ) ) {
          doc.setTextColor(98, 166, 10);
          doc.setFont("helvetica", "bold");
          let textTitle = this.$('.actionplan__item-title').eq(intItem).html();
          doc.text(textTitle, leftPos, yPos, { align: 'left', maxWidth: maxWidth });
          yPos += 10;

          doc.setTextColor(0, 0, 0);
          doc.setFont("helvetica", "normal");
          let textAction = this.$('.actionplan__item-textbox').eq(intItem).val();
          doc.text(textAction, leftPos, yPos, { align: 'left', maxWidth: maxWidth });
          yPos += 25;
        };

        doc.setFont("helvetica", "italic");
        doc.text(dateToShow, centerPos, bottomPos, { align: 'center', maxWidth: maxWidth });

        doc.save("your-action-plan-checklist-" + dateToday + ".pdf");
      });

      this.$('.actionplan__message').addClass('is-visible');
      this.$('.actionplan__buttons').removeClass('is-visible');

      this.setCompletionStatus();
    },

    /**
     * determines which element should be used for inview logic - body, instruction or title - and returns the selector for that element
     */
    getInviewElementSelector: function() {
     return 'actionplan__message';
    },

    checkIfResetOnRevisit: function() {
      var isResetOnRevisit = this.model.get('_isResetOnRevisit');

      // If reset is enabled set defaults
      if (isResetOnRevisit) {
        this.model.reset(isResetOnRevisit);
      }
    }
  },
  {
    template: 'actionplan'
  });

  return Adapt.register('actionplan', {
    model: ComponentModel.extend({}),// create a new class in the inheritance chain so it can be extended per component type if necessary later
    view: ActionPlanView
  });
});
