
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
        
        doc.setTextColor(98, 166, 10);
        doc.setFontSize(22);
        doc.text("Your action plan checklist", 95, 20, { align: 'center', maxWidth: 180 });

        const d = new Date();
        const dateToday = '' + d.getDate() + (d.getMonth() + 1) + d.getFullYear() + '';
        const dateToShow = '' + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + '';

        doc.setDrawColor(0);
        doc.setFillColor(98, 166, 10);
        doc.rect(10, 32, 180, 1, "F");

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(13);
        const pdfBody = this.$('.actionplan__pdf-content').html();
        doc.text(pdfBody, 95, 50, { align: 'center', maxWidth: 180 });

        let yPos = 75;
        for( var intItem in this.model.get( '_items' ) ) {
          doc.setTextColor(98, 166, 10);
          doc.setFont("helvetica", "bold");
          let textTitle = this.$('.actionplan__item-title').eq(intItem).html();
          doc.text(textTitle, 10, yPos, { align: 'left', maxWidth: 180 });
          yPos += 10;

          doc.setTextColor(0, 0, 0);
          doc.setFont("helvetica", "normal");
          let textAction = this.$('.actionplan__item-textbox').eq(intItem).val();
          doc.text(textAction, 10, yPos, { align: 'left', maxWidth: 180 });
          yPos += 25;
        };

        doc.setFont("helvetica", "italic");
        doc.text(dateToShow, 95, 290, { align: 'center', maxWidth: 180 });

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
