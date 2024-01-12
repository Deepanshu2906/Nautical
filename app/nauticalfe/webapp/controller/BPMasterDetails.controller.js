sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/Fragment",
        "sap/ui/core/routing/History"
    ],
    function(BaseController,Fragment,History) {
      "use strict";
  
      return BaseController.extend("nauticalfe.controller.BPMasterDetails", {
        onInit() {
        },
        onPress: function () {
          var oView = this.getView(),
            oButton = oView.byId("button");
          if (!this._oMenuFragment) {
            this._oMenuFragment = Fragment.load({
              name: "nauticalfe.fragments.MastOptionsDropDown",
                          id: oView.getId(),
              controller: this
            }).then(function(oMenu) {
              oMenu.openBy(oButton);
              this._oMenuFragment = oMenu;
              return this._oMenuFragment;
            }.bind(this));
          } else {
            this._oMenuFragment.openBy(oButton);
          }
        },
        onBackPressHome: function () {
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("Routedash");
        },
        onExit: function () {
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("RouteHome");
        },
        onBackPress: function () {
          const oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("MastView");
        },
       onSaveAs:function(){
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteSaveAsVariant");
      },
        
        
      });
    }
  );
  