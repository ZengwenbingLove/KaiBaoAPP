/**
 * Created by FishYu on 2016/9/5
 * 我的收藏页面
 */
define([
    'common/base/base_view',
    'text!module/personalCollect/templates/personalCollect.html',
    'module/personalCollect/model/personalCollectModel',
    "msgbox",
    'common/views/circle'
], function (BaseView, Tpl, personalCollectModel, MsgBox, loadingCircle) {
    var collectItemTemp = '<div class="personal-collect-item">'+
        '<div class="personal-collect-item-title" >{insuranceName}</div>'+  //保险名称
        '<div class="personal-collect-item-content" >'+
            '<p>年龄：<span>{ageTerm}</span></p>'+         //年龄期间
            '<p>保障期间：<span>{safeguardTerm}</span></p>'+     //保障期间
            '{itemFeature}'+ //<div class="item-feature">被保豁免</div>
        '</div>'+
        '<div class="personal-collect-delect" data-id={objectId}></div>'+       //产品ID 
    '</div>';
    var PersonalCollectView = BaseView.extend({
        template: _.template(Tpl),
        id:"personal-collect-container",
        currentUserId: "",     //当前用户ID
        initListData : [],      //初始化数据
        currentListData : [],     //当前收藏数据的列表
        forever : true,
        isReLoading: true,
        ui:{
            topCon : ".top-title",
            backBtn : ".top-title-left", //点击返回
            clearBtn: ".top-title-right",              //清除按钮
            personalCollectMain: "#personal-collect-main"
        },
        events:{
            "tap @ui.backBtn":"onBackBtnHandler",
            "tap @ui.clearBtn": "onClearCollectHandler",      //清空所有收藏
            "tap @ui.personalCollectMain": "onDeleteCollectItemHandler"     //删除单条收藏
        },
        initialize:function(){

        },
        onRender:function(){
            var self = this;
            if(device.ios()){
                self.ui.topCon.css("padding-top",utils.toolHeight+"px");
            }
            setTimeout(function(){
                var height = self.ui.topCon.outerHeight(true);
                self.ui.personalCollectMain.css({height: "-webkit-calc(100% - " + height + "px)"});
            }, 0);

        },
        pageIn:function(){
            var self = this;
            app.on("personalCollect:exit",self._goBackHandler,this);
            if(self.isReLoading){
                self.loadData();
            }
            self.isReLoading = true;
        },

        loadData: function(){
            var self = this;
            var options = {
                "encryptedUserData": utils.userObj.id
            }
            // console.log(loadingCircle,"ssss");
            LoadingCircle && LoadingCircle.start();
            personalCollectModel.getCollectedProductList(options, function(data){
                console.log(data);
                if(data.status == "0"){
                    var insuranceProductCard = data.salesPackageCollectHistory;
                    var equityLabelWidth = (self.$el.width() - 100)/3;
                    var insuranceProductCardHtml = "";
                    for(var i=0; i<insuranceProductCard.length; i++) {
                        var bgImg = "";
                        
                        for(var j=0; insuranceProductCard[i].labels&&j<insuranceProductCard[i].labels.length; j++){
                               //推荐
                            if(insuranceProductCard[i].labels[j].listId == 1){
                                bgImg += '<div class="life-insurance-flag life-insurance-label-1"></div>';
                            }

                            //热销
                            if(insuranceProductCard[i].labels[j].listId == 2){
                                bgImg += '<div class="life-insurance-flag life-insurance-label-2"></div>';
                            }
                        }
                        //最新
                        if(insuranceProductCard[i].isNew){
                            bgImg += '<div class="life-insurance-flag life-insurance-label-3"></div>';
                        }
                        insuranceProductCardHtml += '<div class="insurance-product-card" data-id="'+insuranceProductCard[i].packageId+'">' + bgImg +
                                                        '<div class="insurance-product-card-up">' +
                                                            '<div class="insurance-product-card-name">' + insuranceProductCard[i].packageName + '</div>' +
                                                            '<div class="insurance-product-card-look-pv">' +
                                                                '<div class="insurance-product-card-pv">' + insuranceProductCard[i].visitNum + '</div>' +
                                                                '<div class="insurance-product-card-eye"></div>' +
                                                            '</div>' +
                                                        '</div>' +
                                                        '<div class="insurance-product-card-down">';

                        var equityLabelHtml = "";
                        for (var k = 0; insuranceProductCard[i].rights&&k<insuranceProductCard[i].rights.length; k++) {
                            var currentEquityLabelWidth = insuranceProductCard[i].rights[k].rightName.length * 26 + 55;
                            var n = Math.ceil(currentEquityLabelWidth / equityLabelWidth);
                            n = n > 3 ? 3 : n;
                            n = n * 33.3333333333333;
                                equityLabelHtml += '<div class="equity-label" style="width: '+ n +'%;">' +
                                                    '<div class="equity-label-select"></div>' +
                                                    '<div class="equity-label-name">' + insuranceProductCard[i].rights[k].rightName + '</div>' +
                                                '</div>';
                        }
                        insuranceProductCardHtml += equityLabelHtml;
                        insuranceProductCardHtml +=     '</div>' +
                                                        '<div class="insurance-product-delete button"> </div>' +
                                                    '</div>';
                    }
                    if(!insuranceProductCard.length){
                        insuranceProductCardHtml = '<div id="browse-records-noting">暂无收藏的产品</div>';
                    }
                    self.ui.personalCollectMain.html(insuranceProductCardHtml);
                } else{
                    var insuranceProductCardHtml = '<div id="browse-records-noting">暂无收藏的产品</div>';
                    self.ui.personalCollectMain.html(insuranceProductCardHtml);
                    MsgBox.alert("获取数据失败");
                    console.log("数据返回错误", data);
                }
                LoadingCircle && LoadingCircle.end();
            }, function(error){
                var insuranceProductCardHtml = '<div id="browse-records-noting">暂无收藏的产品</div>';
                self.ui.personalCollectMain.html(insuranceProductCardHtml);
                MsgBox.alert("获取数据失败");
                console.log("数据查询失败", error);
                LoadingCircle && LoadingCircle.end();
            });
        },
        /**
         * 点击返回
         * @param e
         */
        onBackBtnHandler:function(e){
            e.stopPropagation();
            e.preventDefault();
            if(utils.clickLock()){
                return;
            }
            //退出H5 add by guYY 9.20 13:25
            if(!utils.toFinish()){
                app.goBack();
            }
        },
        /**
         * 点击清空所有收藏
         * @param e
         */
        onClearCollectHandler:function(event){
            event.stopPropagation();
            event.preventDefault();
            if(utils.clickLock()){
                return;
            }
            var self = this;
            if(!(self.ui.personalCollectMain.find(".insurance-product-card").length)){
                MsgBox.alert("收藏记录为空");
                return;
            }

             MsgBox.ask("你确定删除所有收藏产品吗？","bbbbbbb",function(type){
                if(type == 2) { //确定  0=取消
                    var options = {
                        "encryptedUserData": utils.userObj.id,
                    };
                    LoadingCircle && LoadingCircle.start();
                    personalCollectModel.deleteCollectProduct(options, function(data){
                        console.log(data);
                        if(data.status == "0"){
                          self.ui.personalCollectMain.html('<div id="browse-records-noting">暂无收藏的产品</div>');
                        }else{
                            console.log("删除失败",data);
                            MsgBox.alert("删除失败");
                        }
                        LoadingCircle && LoadingCircle.end();
                    }, function(error){
                        MsgBox.alert("删除失败");
                        console.log("删除失败",error);
                        LoadingCircle && LoadingCircle.end();
                    });
                }
                if(type == 0) {
                    console.log("取消删除");
                }
            });  
        },
        /**
         * 点击删除单条收藏
         * @param e
         */
        onDeleteCollectItemHandler:function(event){
            event.stopPropagation();
            event.preventDefault();
            if(utils.clickLock()){
                return;
            }
            var self = this;
            var $target = $(event.target);
            if($target.attr("class") == "insurance-product-delete button"){
                MsgBox.ask("你确定删除该条收藏的产品吗？","bbbbbbb",function(type){
                    if(type == 2) { //确定  0=取消
                        // console.log("删除了");
                        var parent = $target.parent();
                        var  packageId = parseInt(parent.attr("data-id"));
                        var options = {
                            "encryptedUserData": utils.userObj.id,
                            "packageId": packageId,
                        };
                        LoadingCircle && LoadingCircle.start();
                        personalCollectModel.deleteCollectProduct(options, function(data){
                            console.log(data);
                            if(data.status == "0"){
                                var pparent = parent.parent();
                                parent.slideUp(function(){
                                    parent.remove();
                                    if(!(pparent.children().length)){
                                        self.ui.personalCollectMain.html('<div id="browse-records-noting">暂无收藏的产品</div>');
                                    }
                                });
                            }else{
                                MsgBox.alert("删除失败");
                                console.log("删除失败");
                            }
                            LoadingCircle && LoadingCircle.end();
                        }, function(error){
                            MsgBox.alert("删除失败");
                            console.log("删除失败");
                            LoadingCircle && LoadingCircle.end();
                        });
                  

                    }
                    if(type == 0) {
                        console.log("取消删除");
                    }
                });
                return;
            }
            var lifeInsuranceCard = $target.parents(".insurance-product-card")[0];
            if(lifeInsuranceCard){
                var lifeInsuranceCardId = lifeInsuranceCard.getAttribute("data-id");
                lifeInsuranceCardId = lifeInsuranceCardId || "null";
                self.isReLoading = false;
                app.navigate("in/productDetails/"+ lifeInsuranceCardId, {replace: true, trigger: true});
            }
        },
        //物理返回
        _goBackHandler:function(){
            //退出H5 add by guYY 9.20 13:25
            if(!utils.toFinish()){
                app.goBack();
            }
        },
        close:function(){
            // var self = this;
            // self.remove();
            // app.off("personalCollect:exit",self._goBackHandler,this);
            // if(MsgBox && MsgBox.isShow()) {
            //     MsgBox.clear();
            // }
        },
        onDestroy: function(){
            var self = this;
            self.remove();
            app.off("personalCollect:exit",self._goBackHandler,this);
            if(MsgBox && MsgBox.isShow()) {
                MsgBox.clear();
            }
        }
    });
    return PersonalCollectView;
});
