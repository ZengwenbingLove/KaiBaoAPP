/**
 * Created by GYY on 2016/8/22.
 * 添加附加险页面
 */
define([
    'common/base/base_view',
    'text!module/additional/templates/additional.html'
],function(BaseView, AdditionalTpl){
    var AdditionalView = BaseView.extend({
        template: _.template(AdditionalTpl),
        id:"additional-container",
        ui:{
            "topCon":"#top-title",
            "btnBack":"#top-title-left" //点击返回
        },
        events:{
            "tap #top-title-left":"_clickBackHandler"
        },
        initialize:function(){

        },
        onRender:function(){
            var self = this;
            if(device.ios()){
                self.ui.topCon.css("padding-top",utils.toolHeight+"px");
            }
        },
        pageIn:function(){},
        //点击返回
        _clickBackHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            app.goBack();
        },
        close:function(){

        }
    });
    return AdditionalView;
});