define([
    'common/base/base_view',
    'marionette',
    'text!module/detailsDescription/templates/detailsDescription.html',
    'msgbox',
    'module/detailsDescription/model/detailsDescriptionModel'
], function(BaseView, mn, tpl, MsgBox, detailsDescriptionModel) {
    return BaseView.extend({
        id: "detailsDescriptionPage",
        template: _.template(tpl),
        forever: false,
        descriptionData : null,

        ui: {
            back: "#top-title-left",
            detailsDescriptionRuleName1: ".details-description-rule-name1",
            detailsDescriptionRuleName2: ".details-description-rule-name2",
            detailsDescriptionRuleContent: "#details-description-rule-content"
        },

        events: {
            "tap @ui.back": "clickBackHandler",
            "tap @ui.detailsDescriptionRuleName1": "clickDetailsDescriptionRuleName1Handler",
            "tap @ui.detailsDescriptionRuleName2": "clickDetailsDescriptionRuleName2Handler"
        },

        clickBackHandler: function(event){
            event.stopPropagation();
            event.preventDefault();

            app.goBack();
        },
        clickDetailsDescriptionRuleName1Handler: function(event){
            event.stopPropagation();
            event.preventDefault();

            this.ui.detailsDescriptionRuleName1.attr("class","details-description-rule-name1 details-description-rule-name-selected");
            this.ui.detailsDescriptionRuleName2.attr("class","details-description-rule-name2");
            this.ui.detailsDescriptionRuleContent.html(self.descriptionData.itemDescproductUnderwritingRule);
        },
        clickDetailsDescriptionRuleName2Handler: function(event){
            event.stopPropagation();
            event.preventDefault();

            this.ui.detailsDescriptionRuleName2.attr("class","details-description-rule-name2 details-description-rule-name-selected");
            this.ui.detailsDescriptionRuleName1.attr("class","details-description-rule-name1");
            this.ui.detailsDescriptionRuleContent.html(self.descriptionData.companyUnderwritingRule);

        },
        initialize: function(){
            console.log("initialize!!!");
            //console.log(this.getOption("detailsDescriptionId"));
        },

        onBeforeRender: function(){
            console.log("onBeforeRender!!!");
        },

        onRender: function(){
            console.log("render!!!ww");
            var self = this;
            var productId = self.getOption("detailsDescriptionId");
            var organId = self.getOption("organId");
            detailsDescriptionModel.getRuleInfo(productId, organId, function(data){
                self.descriptionData = data;
                self.ui.detailsDescriptionRuleContent.html(self.descriptionData.itemDescproductUnderwritingRule);
            }, function(){

            });
        },

        show: function(){
            this.ui.detailsDescriptionRuleName1.attr("class","details-description-rule-name1 details-description-rule-name-selected");
            this.ui.detailsDescriptionRuleName2.attr("class","details-description-rule-name2");
        },

        pageIn: function(){
            console.log("pageIn!!!");
        },

        close: function(){
            console.log("close!!!");
        },

        onDestroy: function(){
            console.log("destroy!!!");
        }
    });
});