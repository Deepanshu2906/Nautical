
sap.ui.define(
  [
    "sap/ui/core/mvc/Controller"
  ],
  function (BaseController) {
    "use strict";

    return BaseController.extend("nauticalfe.controller.TrChangeVoyage", {
      onInit() {

        let oRouter = this.getOwnerComponent().getRouter();
        oRouter.getRoute("RouteTrChangeVoyage").attachPatternMatched(this.onObjectMatched, this);

      
        var hideButton = this.byId("Hide");
        var hideButton1 = this.byId("Hide1");
        if (hideButton) {
          hideButton.attachPress(this.toggleNavContainer.bind(this));
        }
        if (hideButton1) {
          hideButton1.attachPress(this.toggleBarAndNavContainer.bind(this));
        }
      },
      onObjectMatched(oEvent) {
        let myVOYNO = oEvent.getParameter("arguments");
        console.log(myVOYNO, parseInt(myVOYNO.VOYAGE_NO));
        var oInput1 = this.byId("Input1"); 
        var oInput2 = this.byId("Input2"); 

        // Update the bindings of the input controls
        oInput1.unbindElement(); // Unbind the existing binding
        oInput1.bindElement("/NAVOYGH/" + myVOYNO.VOYAGE_NO); // Rebind to the newly added entry

        // Similarly, update bindings for other input controls if needed
        oInput2.unbindElement();
        oInput2.bindElement("/NAVOYGH/" +myVOYNO.VOYAGE_NO);
      },
      onBackPress: function () {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteHome");
      },

      onAddRow1: function () {
        var oTable = this.byId("vesselRefDetails1");

        // Create a new row
        var oNewRow = new sap.m.ColumnListItem({
          cells: [
            new sap.m.Text({ text: "" }),
            new sap.m.CheckBox(),
            new sap.m.Input({ value: "" })
          ]
        });

        // Add the new row to the table
        oTable.addItem(oNewRow);
      },

      onDeleteRow1: function () {
        var oTable = this.byId("vesselRefDetails1");
        var aSelectedItems = oTable.getSelectedItems();

        // Remove selected rows
        aSelectedItems.forEach(function (oSelectedItem) {
          oTable.removeItem(oSelectedItem);
        });

        // Clear selection after deletion
        oTable.removeSelections();
      },

      onAddRow2: function () {
        var oTable = this.byId("commercialbiddingdetails");

        // Create a new row
        var oNewRow = new sap.m.ColumnListItem({
          cells: [
            new sap.m.Text({ text: "" }),
            new sap.m.CheckBox(),
            new sap.m.Input({ value: "" })
          ]
        });

        // Add the new row to the table
        oTable.addItem(oNewRow);
      },

      onDeleteRow2: function () {
        var oTable = this.byId("commercialbiddingdetails");
        var aSelectedItems = oTable.getSelectedItems();

        // Remove selected rows
        aSelectedItems.forEach(function (oSelectedItem) {
          oTable.removeItem(oSelectedItem);
        });

        // Clear selection after deletion
        oTable.removeSelections();
      },







      handleNav: function (evt) {
        var navCon = this.byId("navCon");
        var target = evt.getSource().data("target");
        if (target) {
          var animation = this.byId("animationSelect").getSelectedKey();
          navCon.to(this.byId(target), animation);
        } else {
          navCon.back();
        }
      },
      //  for navigation of nav container 2 
      handleNavToPanelA: function () {
        this.navigateToPanel("panelA");
      },

      handleNavToPanelB: function () {
        this.navigateToPanel("panelB");
      },

      navigateToPanel: function (panelId) {
        var navCon = this.byId("navCon2");
        navCon.to(this.byId(panelId));
      },


      // for visiblity of nav container 1
      toggleNavContainer: function () {
        var navCon = this.byId("navCon");
        var bar = this.byId("HBox10");
        // Get the current visibility state of the NavContainer
        var currentVisibility = navCon.getVisible();

        // Toggle the visibility state
        navCon.setVisible(!currentVisibility);
        bar.setVisible(!currentVisibility);


      },
      // for visiblity of nav container 2
      toggleBarAndNavContainer: function () {
        var navCon2 = this.byId("navCon2");
        var bar2 = this.byId("HBox20");
        var currentVisibility = navCon2.getVisible();

        navCon2.setVisible(!currentVisibility);
        bar2.setVisible(!currentVisibility);
      },
      populateInputField: function (inputField, selectedValue) {
        inputField.setValue(selectedValue);
      },
      // for dialog open
      showValueHelpDialogCurr: function (oEvent) {
        let oData = oEvent.getSource();
        console.log(oData);
        // Create a dialog
        console.log("clicked Currency type");
        var oDialog = new sap.m.Dialog({
          title: "Currency(1)",
          contentWidth: "60%",
          contentHeight: "60%",
          content: new sap.m.Table({
            mode: sap.m.ListMode.SingleSelectMaster,

            columns: [
              new sap.m.Column({
                header: new sap.m.Text({ text: "Currency Code" }),
              }),
              new sap.m.Column({
                header: new sap.m.Text({ text: "Currency Description" }),
              }),
            ],

            selectionChange: function (oEvent) {
              var oSelectedItem = oEvent.getParameter("listItem");
              var oSelectedValue = oSelectedItem.getCells()[0].getText();
              var inputVoyageType = this.getView().byId(oData.getId()); // Input field for Voyage Type
              this.populateInputField(inputVoyageType, oSelectedValue);
              oDialog.close();
            }.bind(this),
          }),
          beginButton: new sap.m.Button({
            text: "Cancel",
            type: "Reject",
            press: function () {
              oDialog.close();
            },
          }),

        });

        let oValueHelpTable = oDialog.getContent()[0]; // Assuming the table is the first content element

        oValueHelpTable.bindItems({
          path: "/CURR", // Replace with your entity set
          template: new sap.m.ColumnListItem({
            cells: [
              new sap.m.Text({ text: "{NAVOYCUR}" }),
              new sap.m.Text({ text: "{NAVOYGCURDES}" }),
            ],
          }),
        });
        // Bind the dialog to the view
        this.getView().addDependent(oDialog);

        // Open the dialog
        oDialog.open();
      },

      showValueHelpDialogCost: function (oEvent) {

        let oData = oEvent.getSource();
        console.log(oData);
        let vv = oEvent.getSource().oParent.getCells()[2];
        console.log("clicked Currency type");
        // Create a dialog

        var oDialog = new sap.m.Dialog({
          title: "Select: Cost Types",
          contentWidth: "60%",
          contentHeight: "60%",
          content: new sap.m.Table({
            mode: sap.m.ListMode.SingleSelectMaster,

            columns: [
              new sap.m.Column({
                header: new sap.m.Text({ text: "Cost Code" }),
              }),
              new sap.m.Column({
                header: new sap.m.Text({ text: "Cost Description" }),
              }),
            ],

            selectionChange: function (oEvent) {
              var oSelectedItem = oEvent.getParameter("listItem");
              var oSelectedValue1 = oSelectedItem.getCells()[0].getText();
              var oSelectedValue2 = oSelectedItem.getCells()[1].getText();
              console.log(oSelectedValue1, oSelectedValue2, vv);
              var inputVoyageType = this.getView().byId(oData.getId()); // Input field for Voyage Type
              this.populateInputField(inputVoyageType, oSelectedValue1);
              this.populateInputField(vv, oSelectedValue2);
              oDialog.close();
            }.bind(this),
          }),
          beginButton: new sap.m.Button({
            text: "Cancel",
            type: "Reject",
            press: function () {
              oDialog.close();
            },
          }),

        });

        let oValueHelpTable = oDialog.getContent()[0]; // Assuming the table is the first content element

        oValueHelpTable.bindItems({
          path: "/NAVOYGC", // Replace with your entity set
          template: new sap.m.ColumnListItem({
            cells: [
              new sap.m.Text({ text: "{COSTCODE}" }),
              new sap.m.Text({ text: "{CSTCODES}" }),
            ],
          }),
        });
        // Bind the dialog to the view
        this.getView().addDependent(oDialog);

        // Open the dialog
        oDialog.open();
      },

      showValueHelpDialogClassMaster: function (oEvent) {
        let oData = oEvent.getSource();

        // Create a dialog
        var oDialog = new sap.m.Dialog({
          title: "Value(1)",
          contentWidth: "60%",
          contentHeight: "60%",
          content: new sap.m.Table({
            mode: sap.m.ListMode.SingleSelectMaster,
            items: "/CLASS",
            columns: [
              new sap.m.Column({
                header: new sap.m.Text({ text: "Value" }),
                width: "150px"
              }),
              new sap.m.Column({
                header: new sap.m.Text({ text: "Good To Have" }),
              }),
              new sap.m.Column({
                header: new sap.m.Text({ text: "Mandatory" }),
              }),
              new sap.m.Column({
                header: new sap.m.Text({ text: "Must Not Have" }),
              }),
            ],
            items: [new sap.m.ColumnListItem({
              cells: [
                new sap.m.Select({
                  items: {
                    path: '/CLASS',
                    template: new sap.ui.core.Item({
                      key: "{ZF_VALUE}",
                      text: " {ZF_VALUE} - {ZF_DESC}"
                    }),

                  }

                }),
                new sap.m.RadioButton({
                  groupName: "Group1", // Unique group name for Good To Have
                  select: function () {
                    // Handle radio button selection
                  }
                }),
                new sap.m.RadioButton({
                  groupName: "Group1", // Unique group name for Mandatory
                  select: function () {
                    // Handle radio button selection
                  }
                }),
                new sap.m.RadioButton({
                  groupName: "Group1", // Unique group name for Must Not Have
                  select: function () {
                    // Handle radio button selection
                  }
                }),
              ],
            }),
            ],
            selectionChange: function (oEvent) {
              var oSelectedItem = oEvent.getParameter("listItem");
              var oSelectedValue = oSelectedItem.getCells()[0].getSelectedItem().getKey();
              // No need to close the dialog here as it's done in the "OK" button press event
            }.bind(this),
          }),
          beginButton: new sap.m.Button({
            text: "OK",
            type: "Accept",
            press: function () {
              var inputVoyageType = this.getView().byId(oData.getId()); // Input field for Voyage Type
              var selectedValue = oDialog.getContent()[0].getItems()[0].getCells()[0].getSelectedItem().getKey();
              this.populateInputField(inputVoyageType, selectedValue);
              oDialog.close();
            }.bind(this),
          }),
          endButton: new sap.m.Button({
            text: "Cancel",
            type: "Reject",
            press: function () {
              oDialog.close();
            },
          }),
        });

        // Bind the dialog to the view
        this.getView().addDependent(oDialog);

        // Open the dialog
        oDialog.open();
        console.log(oData);
      },










    });
  }
);