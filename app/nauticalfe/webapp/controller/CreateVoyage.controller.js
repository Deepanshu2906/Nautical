

sap.ui.define(
  ["sap/ui/core/mvc/Controller",
  "sap/m/MessageBox",
  "sap/m/MessageToast",
  "sap/ui/model/json/JSONModel"
],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, MessageBox, MessageToast, JSONModel) {
    "use strict";
    let isLogicDone = false;
    let itemDetails = {};
    let data ={};
    
    let count =0;
    let createdVoyNo, portData1, portData2;

    return Controller.extend("nauticalfe.controller.CreateVoyage", {
      onInit: function () {
      console.log("on it  1");
        let allPortData = {
          VLEGN: 0,
          PORTC: '',
          PORTN: '',
          LOCNAM: '',
          PDIST: 0,
          VSPEED: 0.0,
          PPDAYS: 0.0,
          VSDAYS: 0.0,
          VETAD: null, 
          VETAT: null, 
          VETDD: null, 
          VETDT: null, 
          VWEAD: 0.0,
          PSTAT: '',
          MATNR: '',
          MAKTX: '',
          CARGS: 0,
          CARGU: '',
          OTHCO: 0.0,
          FRCOST: 0.0,
          TOTCO: 0.0,
          VOYNO_VOYNO: 0
        };
        let jsonModel = new sap.ui.model.json.JSONModel(allPortData )
      // console.log("on it  2");
      this.getOwnerComponent().setModel(jsonModel,"portdata")
      let x = this.getOwnerComponent().getModel("portdata").getData();
      // console.log(x);
    },
    showData:function(){
       let that = this.getView();
      const url = "/odata/v4/nautical/NAVOYGH"; 
      let oRouter = this.getOwnerComponent().getRouter();

      fetch(url) 

          .then(response => { 

              if (!response.ok) { 

                  throw new Error('Network response was not ok'); 

              } 

              return response.json(); 

          }) 

          .then(odata => { 

              console.log("show Entity Data",odata); 
              // return odata;
              let dataLength = odata.value;

              createdVoyNo =  dataLength[dataLength.length-1]
              console.log("last-Obj",createdVoyNo.VOYNO);
              // POST request for obj1

              
              portData1.VOYNO_VOYNO = createdVoyNo.VOYNO;
              portData2.VOYNO_VOYNO = createdVoyNo.VOYNO;
              const voyageModel1 = new JSONModel(portData1);
              const voyageModel2 = new JSONModel(portData2);
              
              console.log(portData1, portData2);
             that.setModel(voyageModel1, "voyageModel1");
             let oModel = this.getView().getModel();
             let oBindListSP = oModel.bindList("/NAVOYGIP");
 
           oBindListSP.attachEventOnce("dataReceived", function () {
            let existingEntries = oBindListSP.getContexts().map(function (context) {
              // console.log("context : ", context);
                return context.getProperty("PORTC");
            });
            console.log("existing Entries : *** ", existingEntries);
            if (existingEntries.includes(existingEntries)) {
              MessageToast.show("Duplicate Voyage Code is not allowed");
           } else {
     
                try {
                    oBindListSP.create(portData1);
                    // that.getModel().refresh();
                    
                    // MessageToast.show("Data created Successfully for port 1");
                  console.log("Data created Successfully for port 1");

   
                
   
                } catch (error) {
                    MessageToast.show("Error while saving data");
                }
              }
            
           });
           // request for port 2
           oBindListSP.attachEventOnce("dataReceived", function () {
             let existingEntries = oBindListSP.getContexts().map(function (context) {
            // console.log("context : ", context);
              return [context.getProperty("VLEGN"),context.getProperty("VOYNO_VOYNO")];
           });
             console.log("existing Entries : *** ", existingEntries);
             if (existingEntries.includes(portData1[0]) && existingEntries.includes(portData1[1])) {
               MessageToast.show("Duplicate Voyage Code is not allowed");
            }  else {
   
              try {
                  oBindListSP.create(portData2);
                  
                  // MessageToast.show("Data created Successfully for port 2");
                  console.log("Data created Successfully for port 2");
                  that.getModel().refresh();
 
              
 
              } catch (error) {
                  MessageToast.show("Error while saving data");
              }
            }
          
                });
        
      
             console.log(oBindListSP.getContexts());

             MessageBox.success(`Successfully created Voyage no. ${createdVoyNo.VOYNO}`,);
              

          }).then(x=>{
            setTimeout(()=>{

              console.log("navigated")
              let router =  oRouter.navTo("RouteTrChangeVoyage",{
                "VOYAGE_NO":createdVoyNo.VOYNO
              });
            }, 1500);
          })

          .catch(error => { 

              console.error('There was a problem with the fetch operation:', error); 

          }); 


    },

      onFreightSimulator: function () {

        var OriginData=this.getView().byId("portfromorigin").getValue();
        var destinationData=this.getView().byId("portdestination").getValue();
        var distanceData=this.getView().byId("distancedestination").getValue();
        var cargo_sizedestination=this.getView().byId("cargo_sizedestination").getValue();
        console.log(cargo_sizedestination)
        var cargo_sizeorigin=this.getView().byId("cargo_sizeorigin").getValue();
        console.log(cargo_sizeorigin)
 
        if(OriginData==""||destinationData==""){
          MessageBox.error("Please enter the ports")
          return
        }
 
        if(!this.checkCargoLoaded(cargo_sizeorigin,cargo_sizedestination)){
          MessageBox.error("Enter the cargo size")
        }
       
      //  console.log(!this.checkUnit(cargo_sizeorigin,cargo_sizedestination))
      //  if(this.checkDestCargo(cargo_sizeorigin,cargo_sizedestination)==false){
      //   MessageBox.error("Wrong")
      //   return
      //  }
 
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteFreightSimulator",{
          "OriginData":OriginData,
          "destinationData":destinationData,
          "distanceData":distanceData,
          "cargo_sizedestination":cargo_sizedestination,
          "cargo_sizeorigin":cargo_sizeorigin
        });
       
      },
     
      populateInputField: function (inputField, selectedValue) {
        inputField.setValue(selectedValue);
      },
      //updating speed dynamically in origin and destination
      speedUpdate: function (oEvent) {
        console.log("live speed changed");
        var speed = parseFloat(oEvent.getParameter("value"));
        if (isNaN(speed)) {
          this.getView().byId("speedorigin").setValue("");
          this.getView().byId("speeddestination").setValue("");
        } else {
          this.getView().byId("speedorigin").setValue(speed);
          this.getView().byId("speeddestination").setValue(speed);
        }
      },
      onCreateVoyage: function () {
             let headerData = {
              "VOYNO":-1 + count,
               "VOYNM":"",
               "VOYTY":"",
               "BIDTYPE":"",
               "CARTY":"",
               "CURR":"",
               "VSTAT":"created"
             };
             // validation for value help
             const _voyage_Name = this.byId("_voyage_Name").getValue();
             const _voyage_type = this.byId("_voyage_type").getValue();
             const _bidding_Type = this.byId("_bidding_Type").getValue();
             const _cargo_type = this.byId("_cargo_type").getValue();
             const _currency_type = this.byId("_currency_type").getValue();
             headerData.VOYNM = _voyage_Name;
             headerData.VOYTY = _voyage_type;
             headerData.BIDTYPE=_bidding_Type;
             headerData.CARTY= _cargo_type;
             headerData.CURR = _currency_type;
             
             // console.log("Selected values : ", _voyage_Name,_voyage_type, _cargo_type, _bidding_Type, _currency_type);
      
             if(_voyage_Name == "" ){
               MessageBox.error("Please enter Voyage Name");
             return false;
      
             }
             if(_voyage_type == ""){
               MessageBox.error("Please enter Voyage Type");
             return false;
             }
             if( _bidding_Type == "" ){
               MessageBox.error("Please enter bidding Type");
             return false;
      
      
             }
             if(_cargo_type == ""){
               MessageBox.error("Please enter cargo Type");
             return false;
      
      
             }if(_currency_type == ""){
               MessageBox.error("Please enter currency Type");
             return false;
      
      
             }
             let flag = false;
             
             // Calling  Calculate logic fn
             
             let result = this.calculateVoyage(flag);
             console.log(result);
             
             if( result  =="Complete Calculate logic first" ){
               MessageBox.error("please Calculate logic first")
               
              }else if( result =="proceed" ){

               console.log("header data : ",headerData);
               // fn  on press create

               let oModelport = this.getOwnerComponent().getModel("portdata");
               // creating entries in json model
              //  oModelport.create()


               this.onSaveVoyage(headerData, itemDetails);
               
              //  console.log("ItemLevel Details : ", itemDetails);

              //  const oRouter = this.getOwnerComponent().getRouter();
              //  oRouter.navTo("RouteTrChangeVoyage", {
                
              //  });

             }
      },
      onSaveVoyage : function (payloadHeader, itemData){

      console.log("ItemLevel Details ;",itemData);
      portData1 = {
        "VOYNO_VOYNO":-1,
        "VLEGN": 1,
        "PORTC": itemData.portfromorigin,
        "PORTN": "",
        "LOCNAM": "",
        "PDIST": 0.000,
        "VSPEED": 0.000,
        "PPDAYS": itemData.portdaysorigin,
        "VSDAYS": itemData.sea_daysorigin,
        "VETAD": itemData.arrivaldateorigin,
        "VETAT":itemData.arrivaltimeorigin,
        "VETDD":itemData.departuredateorigin ,
        "VETDT": itemData.departuretimeorigin,
        "VWEAD": 0.000,
        "PSTAT": "",
        "MATNR": "",
        "MAKTX": "",
        "CARGS": itemData.cargo_sizeorigin,
        "CARGU": itemData.unitorigin,
        "OTHCO": 0.000,
        "FRCOST": 0.000,
        "TOTCO": 0.000
        
    };
    portData2 = {
      "VOYNO_VOYNO":-1,
      "VLEGN": 2,
      "PORTC": itemData.portdestination,
      "PORTN": "",
      "LOCNAM": "",
      "PDIST": 0.000,
      "VSPEED": 0.000,
      "PPDAYS": itemData.portdaysdestination,
      "VSDAYS": itemData.sea_daysdestination,
      "VETAD": itemData.arrivaldatedestination,
      "VETAT":itemData.arrivaltimedestination,
      "VETDD":itemData.departuredatedestination ,
      "VETDT": itemData.departuretimedestination,
      "VWEAD": 0.000,
      "PSTAT": "",
      "MATNR": "",
      "MAKTX": "",
      "CARGS": itemData.cargo_sizedestination,
      "CARGU": itemData.unitdestination,
      "OTHCO": 0.000,
      "FRCOST": 0.000,
      "TOTCO": 0.000
      
  }
    // console.log(portData1, portData2);
     
      let JsonData = JSON.stringify(payloadHeader)
       let that = this;
      let EndPoint = "/odata/v4/nautical/NAVOYGH";
        fetch(EndPoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JsonData
        })
          .then(function (res) {
 
            if (res.ok) {
              // console.log("fdgnm",res);
              console.log("Entity created successfully");
               that.showData();
              // MessageBox.success(`Successfully created Voyage no. ${createdVoyNo.VOYNO}`);
 
            }
            else {
              res.json().then((data) => {
                if (data && data.error && data.error.message) {
                  // Show the error message from the backend
                  MessageBox.error(data.error.message);
                  return
                }
              });
            }
          })
          .catch(function (err) {
            console.log("error", err);
          })
       
 
      }, 
      showValueHelpDialog1: function () {
        // Create a dialog
        console.log("clicked voyage");
        var oDialog = new sap.m.Dialog({
          title: "Select: Voyage Types",
          contentWidth: "60%",
          contentHeight: "60%",
          content: new sap.m.Table({
            mode: sap.m.ListMode.SingleSelectMaster,

            columns: [
              new sap.m.Column({
                header: new sap.m.Text({ text: "Voyage Type" }),
              }),
              new sap.m.Column({
                header: new sap.m.Text({ text: "Description" }),
              }),
            ],

            selectionChange: function (oEvent) {
              var oSelectedItem = oEvent.getParameter("listItem");
              var oSelectedValue = oSelectedItem.getCells()[0].getText();
              var inputVoyageType = this.getView().byId("_voyage_type"); // Input field for Voyage Type
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
          path: "/VOYTYP", // Replace with your entity set
          template: new sap.m.ColumnListItem({
            cells: [
              new sap.m.Text({ text: "{VOYCD}" }),
              new sap.m.Text({ text: "{VOYDES}" }),
            ],
          }),
        });
        // Bind the dialog to the view
        this.getView().addDependent(oDialog);

        // Open the dialog
        oDialog.open();
      },
      showValueHelpDialog2: function () {
        // Create a dialog
        console.log("clicked Bidding type");
        var oDialog = new sap.m.Dialog({
          title: "Select: Bidding Types",
          contentWidth: "60%",
          contentHeight: "60%",
          content: new sap.m.Table({
            mode: sap.m.ListMode.SingleSelectMaster,

            columns: [
              new sap.m.Column({
                header: new sap.m.Text({ text: "Bidding Type" }),
              }),
              new sap.m.Column({
                header: new sap.m.Text({ text: "Description" }),
              }),
            ],
            items: [
              new sap.m.ColumnListItem({
                cells: [
                  new sap.m.Text({ text: "TB" }),
                  new sap.m.Text({ text: "2 Bid System" }),
                ],
              }),
              new sap.m.ColumnListItem({
                cells: [
                  new sap.m.Text({ text: "SB" }),
                  new sap.m.Text({ text: "1 Bid System" }),
                ],
              }),

              // Add more ColumnListItems as needed
            ],

            selectionChange: function (oEvent) {
              var oSelectedItem = oEvent.getParameter("listItem");
              var oSelectedValue = oSelectedItem.getCells()[0].getText();
              var inputVoyageType = this.getView().byId("_bidding_Type"); // Input field for Voyage Type
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

        // Bind the dialog to the view
        this.getView().addDependent(oDialog);

        // Open the dialog
        oDialog.open();
      },
      showValueHelpDialog3: function () {
        // Create a dialog
        console.log("clicked Cargo type");
        var oDialog = new sap.m.Dialog({
          title: "Select: Vessel Types",
          contentWidth: "60%",
          contentHeight: "60%",
          content: new sap.m.Table({
            mode: sap.m.ListMode.SingleSelectMaster,

            columns: [
              new sap.m.Column({
                header: new sap.m.Text({ text: "Vessel Type" }),
              }),
              new sap.m.Column({
                header: new sap.m.Text({ text: "Description" }),
              }),
            ],

            selectionChange: function (oEvent) {
              var oSelectedItem = oEvent.getParameter("listItem");
              var oSelectedValue = oSelectedItem.getCells()[0].getText();
              var inputVoyageType = this.getView().byId("_cargo_type"); // Input field for Voyage Type
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
          path: "/CARTYP", // Replace with your entity set
          template: new sap.m.ColumnListItem({
            cells: [
              new sap.m.Text({ text: "{CARCD}" }),
              new sap.m.Text({ text: "{CARDES}" }),
            ],
          }),
        });
        // Bind the dialog to the view
        this.getView().addDependent(oDialog);

        // Open the dialog
        oDialog.open();
      },
      showValueHelpDialog4: function () {
        // Create a dialog
        console.log("clicked Currency type");
        var oDialog = new sap.m.Dialog({
          title: "Select: Vessel Types",
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
              var inputVoyageType = this.getView().byId("_currency_type");
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

      onValueHelpPort: function () {
        // Create a dialog

        var oDialog = new sap.m.Dialog({
          title: "Select: Route Between Ports ",
          contentWidth: "60%",
          contentHeight: "60%",
          content: new sap.m.Table({
            mode: sap.m.ListMode.SingleSelectMaster,

            columns: [
              new sap.m.Column({
                header: new sap.m.Text({ text: "To Port" }),
              }),
              new sap.m.Column({
                header: new sap.m.Text({ text: "From Port" }),
              }),
              new sap.m.Column({
                header: new sap.m.Text({ text: "distance" }),
              }),
            ],

            selectionChange: function (oEvent) {
              var oSelectedItem = oEvent.getParameter("listItem");
              console.log(oSelectedItem);

              // Assuming "to_port", "from_port", and "distance" are the properties in your entity set
              var toPort = oSelectedItem.getCells()[0].getText();
              var fromPort = oSelectedItem.getCells()[1].getText();
              var distance = oSelectedItem.getCells()[2].getText();

              // Assign values to the respective fields
              var inputToPort = this.getView().byId("portfromorigin");
              var inputFromPort = this.getView().byId("portdestination");
              var inputDistance = this.getView().byId("distancedestination");

              this.populateInputField(inputToPort, toPort);
              this.populateInputField(inputFromPort, fromPort);
              this.populateInputField(inputDistance, distance);

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
          path: "/ZBTP_NAUTICAL_MariDistance", // Replace with your entity set
          template: new sap.m.ColumnListItem({
            cells: [
              new sap.m.Text({ text: "{from_port}" }),
              new sap.m.Text({ text: "{to_port}" }),
              new sap.m.Text({ text: "{distance}" }),
            ],
          }),
        });
        // Bind the dialog to the view
        this.getView().addDependent(oDialog);

        // Open the dialog
        oDialog.open();
      },

      onValueHelpUOM: function () {
        // Create a dialog

        var oDialog = new sap.m.Dialog({
          title: "Select: Unit Of Measurement",
          contentWidth: "60%",
          contentHeight: "60%",
          content: new sap.m.Table({
            mode: sap.m.ListMode.SingleSelectMaster,

            columns: [
              new sap.m.Column({
                header: new sap.m.Text({ text: "UOM" }),
              }),
              new sap.m.Column({
                header: new sap.m.Text({ text: "UOMDES" }),
              }),
            ],

            selectionChange: function (oEvent) {
              var oSelectedItem = oEvent.getParameter("listItem");
              var oSelectedValue = oSelectedItem.getCells()[0].getText();
              var inputVoyageType = this.getView().byId("unitorigin");
              var inputVoyageType1 = this.getView().byId("unitdestination");
              this.populateInputField(inputVoyageType, oSelectedValue);
              this.populateInputField(inputVoyageType1, oSelectedValue);

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
          path: "/NAVOYGUOM", // Replace with your entity set
          template: new sap.m.ColumnListItem({
            cells: [
              new sap.m.Text({ text: "{UOM}" }),
              new sap.m.Text({ text: "{UOMDES}" }),
            ],
          }),
        });
        // Bind the dialog to the view
        this.getView().addDependent(oDialog);

        // Open the dialog
        oDialog.open();
      },
      checkCargoLoaded:function(cargo_sizeorigin,cargo_sizedestination){
        if(cargo_sizeorigin==="" || cargo_sizedestination==="" || cargo_sizeorigin<=0 || cargo_sizedestination<=0 ){
          return false
        }
        return true
      },
        //Checking whether destination cargo is less or equal to than origin cargo size
    checkDestCargo:function(cargo_sizeorigin,cargo_sizedestination){
      // return(cargo_sizeorigin<cargo_sizedestination)
      if(cargo_sizedestination !== cargo_sizeorigin){
        return false
      }
      return true
  },

   //Checking units are entered or not
  checkUnit:function(unitdestination,unitorigin){
    if(unitdestination=="" || unitorigin=="" ){
      return false
    }
    return true
  },

  //Checking speed is entered or not
  checkSpeed:function(journeyspeed){
      if(journeyspeed==="" || journeyspeed<=0 || journeyspeed===null ){
        return false
      }
      return true
  },
 
  //checking Port days are entered or not
  checkPortDays:function(portdaysdestination,portdaysorigin){
      if(portdaysdestination===""|| portdaysdestination<=0 || portdaysorigin==="" || portdaysorigin<=0){
        return false
      }
      return true
  },

  //checking departure dates for org and dest are entered or not
  checkDepDates:function(departuredateorigin){
      if(departuredateorigin==="" ){
        return false
      }
      return true
  },
  checkDepTime:function(departuretimeorigin){
    if(departuretimeorigin==="" ){
      return false
    }
    return true
},
  //Checking ports are registered
  checkPorts:function(portfromorigin,portdestination){
    if(portfromorigin==""||portdestination==""){
      return false
    }
    return true
  },

  calculateVoyage: function (oEvent) {

          var portfromorigin = this.getView().byId("portfromorigin").getValue();
          var distanceorigin = this.getView().byId("distanceorigin").getValue();
          var weatherorigin = this.getView().byId("weatherorigin").getValue();
          var cargo_sizeorigin = this.getView()
            .byId("cargo_sizeorigin")
            .getValue();
          var unitorigin = this.getView().byId("unitorigin").getValue();
          var speedorigin = this.getView().byId("speedorigin").getValue();
          var sea_daysorigin = this.getView().byId("sea_daysorigin").getValue();
          var portdaysorigin = this.getView().byId("portdaysorigin").getValue();
   
          var arrivaldateorigin = this.getView()
            .byId("arrivaldateorigin")
            .getValue();
          var arrivaltimeorigin = this.getView()
            .byId("arrivaltimeorigin")
            .getValue();
          var departuredateorigin = this.getView()
            .byId("departuredateorigin")
            .getValue();
          var departuretimeorigin = this.getView()
            .byId("departuretimeorigin")
            .getValue();
   
          var portdestination = this.getView().byId("portdestination").getValue();
          var distancedestination = this.getView()
            .byId("distancedestination")
            .getValue();
          var weatherdestination = this.getView()
            .byId("weatherdestination")
            .getValue();
          var cargo_sizedestination = this.getView()
            .byId("cargo_sizedestination")
            .getValue();
          var unitdestination = this.getView().byId("unitdestination").getValue();
          var speeddestination = this.getView()
            .byId("speeddestination")
            .getValue();
          var sea_daysdestination;
          var portdaysdestination = this.getView()
            .byId("portdaysdestination")
            .getValue();
          var arrivaldatedestination = this.getView()
            .byId("arrivaldatedestination")
            .getValue();
          var arrivaltimedestination = this.getView()
            .byId("arrivaltimedestination")
            .getValue();
          var departuredatedestination = this.getView()
            .byId("departuredatedestination")
            .getValue();
          var departuretimedestination = this.getView()
            .byId("departuretimedestination")
            .getValue();
            var journeyspeed=this.getView().byId("speed").getValue();
          console.log(
            portdaysorigin,
            portdaysdestination,
            distanceorigin,
            distancedestination
          );
   
           data = {
            portfromorigin: portfromorigin,
            portdestination: portdestination,
            distanceorigin: distanceorigin,
            distancedestination: distancedestination,
            weatherorigin: weatherorigin,
            weatherdestination: weatherdestination,
            cargo_sizeorigin: cargo_sizeorigin,
            cargo_sizedestination: cargo_sizedestination,
            unitorigin: unitorigin,
            unitdestination: unitdestination,
            speedorigin: speedorigin,
            speeddestination: speeddestination,
            sea_daysorigin: sea_daysorigin,
            sea_daysdestination: sea_daysdestination,
            portdaysorigin: portdaysorigin,
            portdaysdestination: portdaysdestination,
            arrivaldateorigin: arrivaldateorigin,
            arrivaldatedestination: arrivaldatedestination,
            arrivaltimeorigin: arrivaltimeorigin,
            arrivaltimedestination: arrivaltimedestination,
            departuredateorigin: departuredateorigin,
            departuredatedestination: departuredatedestination,
            departuretimeorigin: departuretimeorigin,
            departuretimedestination: departuretimedestination,
            journeyspeed:journeyspeed
          };
           //Ensuring ports are registered
   
           if(!this.checkPorts(data.portfromorigin,data.portdestination)){
            MessageBox.error("Please enter ports")
            return false
          }
          //Ensuring cargo is loaded
          if (!this.checkCargoLoaded(data.cargo_sizeorigin, data.cargo_sizedestination)) {
            MessageBox.error("Please enter Cargo size");
            return false;
          }
          //Ensuring cargo is loaded
          if (!this.checkCargoLoaded(data.cargo_sizeorigin, data.cargo_sizedestination)) {
            MessageBox.error("Please enter Cargo size");
            return false;
          }
   
          //Ensuring destination cargo is lesser than origin cargo
          if(!this.checkDestCargo(data.cargo_sizeorigin,data.cargo_sizedestination)){
            MessageBox.error("The sum of Leg 2 (and onwards) Cargo Size must be less than Leg One Cargo Size");
            return false;
          }
   
           //Ensuring units are entered
           if(!this.checkUnit(data.unitorigin,data.unitdestination)){
            MessageBox.error("Please enter units");
            return false;
          }
   
          //Ensuring Speed is entered
          if(!this.checkSpeed(data.journeyspeed)){
            MessageBox.error("Please enter speed")
            return false
          }
   
          //Ensuring port days are entered
          if(!this.checkPortDays(data.portdaysdestination,portdaysorigin)){
           MessageBox.error("Please enter port days")
            return false
          }
   
          //Checking departure dates are entered or not
          if(!this.checkDepDates(data.departuredateorigin,data.departuredatedestination)){
            MessageBox.error("Please enter Dpearture date and time")
            return false
          }
          if(!this.checkDepTime(data.departuretimeorigin)){
            MessageBox.error("Please enter departure  time")
            return false
          }
            //Checking cargo is loaded or not
           
          // console.log(data);
           let flagStatus = oEvent;
   
           console.log( "status flag : ",flagStatus);
           if ( flagStatus ){
   
             // Calculate Arrival Date and Time at Origin Port
             var arrivaldateorigin = this.calculatearrivaldateorigin(
            data.departuredateorigin,
            data.portdaysorigin
            );
           
            // Calculate Overall Total Number of Days
            let updatedvalueSea = this.calculateOverallTotalDays(
              data.distanceorigin,
            data.distancedestination,
            data.portdaysorigin,
            data.portdaysdestination,
            data.speedorigin
            );
            sea_daysdestination = updatedvalueSea;
            data.sea_daysdestination = sea_daysdestination;
            // console.log(sea_daysdestination, data.sea_daysdestination);
           
            // Calculate Arrival Date and Time at Destination Port(s)
           
            this.getView().byId("arrivaltimeorigin").setValue(departuretimeorigin);
           
            let { hours, minutes } = this.extractTimeFromDay(sea_daysdestination);
            // console.log("departure time--", departuretimeorigin);
           
            let arrTimeArr = this.addTimeTo12HourFormat(
              departuretimeorigin,
              hours,
              minutes
              );
              if( arrTimeArr == false){
                return false
              }
              console.log(arrTimeArr , hours, minutes);
             
              this.getView().byId("arrivaltimedestination").setValue(arrTimeArr[0]);
              this.getView().byId("departuretimedestination").setValue(arrTimeArr[0]);
              

             
              let carryDay = arrTimeArr[1];
   
             
           var arrivaldatedestination = this.calculatearrivaldatedestination(
            data.departuredateorigin,
            data.sea_daysdestination,
            carryDay
            );


            this.performAsyncOperations().then(() => {
              departuredatedestination = this.calculatedeparturedatedestination(arrivaldatedestination, data.portdaysdestination);
              console.log("dept Date Dest----: ", departuredatedestination);
              // Continue with any further logic or UI updates
            });
            
           
            isLogicDone = true;
            MessageToast.show("calculate done")
            itemDetails = data;
            return data
           
          }
   
          else {
            console.log("come in else");
            if( isLogicDone) {
              console.log(isLogicDone);
              return "proceed"
            }else {
              return "Complete Calculate logic first"
            }
           
           }
          },
          performAsyncOperations: function() {
            return new Promise((resolve) => {
                resolve();
            });
          },   

        
      //  function for time format logic that return arrival time along with carry  days

      addTimeTo12HourFormat: function (
        time,
        additionalHours,
        additionalMinutes
        ) {
          console.log(
            time,
            typeof time,
            typeof additionalHours,
            typeof additionalMinutes
            );
            // Split the time into hours, minutes, seconds, and AM/PM   '5:20:00 PM'
            const [timeStr, x] = time.split(" ");
        let [hoursStr, minutesStr, secondsStr] = timeStr.split(":");
        if( secondsStr ==""){
          MessageBox.error("please Select Valid Time")
          return

        }
        secondsStr = secondsStr.substr(0,2);
        
        console.log(hoursStr, minutesStr, secondsStr);
        
        let hours = parseInt(hoursStr, 10);
        let minutes = parseInt(minutesStr, 10);
        // console.log("hhhh : ", time.substr(-2));
        //  ampm =  time.substr(-2);


        let ampm = time.substr(-2);
        // console.log(ampm, typeof ampm);
        
        // Convert AM/PM to uppercase for consistency
        const isPM = ampm.toUpperCase() === "PM";

        // Adjust the hours based on AM/PM
        if (isPM && hours !== 12) {
          hours += 12;
        } else if (!isPM && hours === 12) {
          hours = 0;
        }

        // Add the additional hours and minutes
        hours += additionalHours;
        minutes += additionalMinutes;

        // Adjust hours and minutes if minutes overflow to hours
        hours += Math.floor(minutes / 60);
        minutes %= 60;

        // Calculate days carried over
        const daysCarriedOver = Math.floor(hours / 24);
        hours %= 24;

        // Convert hours back to 12-hour format
        const formattedHours = hours % 12 || 12;
        const formattedAMPM = hours < 12 ? "AM" : "PM";

        // Format the new time
        const newTime = `${formattedHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secondsStr} ${formattedAMPM}`;
        console.log(newTime, daysCarriedOver);
        return [newTime, daysCarriedOver];
      },

      // Example usage:
      // const initialTime = '04:30:45 PM';
      // const newTime = addTimeTo12HourFormat(initialTime, 2, 15); // Add 2 hours and 15 minutes

      extractTimeFromDay: function (day) {
        // Extract the fractional part from the day
        const fractionalPart = day % 1;

        // Convert fractional part to hours and minutes
        const totalHours = Math.floor(fractionalPart * 24);
        const remainingMinutes = Math.round(
          (fractionalPart * 24 - totalHours) * 60
        );

        // Split hours and minutes
        const hours = Math.floor(totalHours);
        const minutes = remainingMinutes;

        return {
          hours,
          minutes,
        };
      },

   
      calculatearrivaldateorigin: function (departuredateorigin, portdaysorigin) {
        // Convert departure date string to a Date object
        var departureDate = new Date(departuredateorigin);
        console.log(departuredateorigin);
        
        // Calculate arrival date by subtracting port days
        var arrivaldateorigin = new Date(
          departureDate.getTime() - portdaysorigin * 24 * 60 * 60 * 1000
          );
          console.log(arrivaldateorigin);
          
          // Format departure date
          var departureYear = departureDate.getFullYear();
          var departureMonth = ('0' + (departureDate.getMonth() + 1)).slice(-2); // Adding 1 to month because it's zero-indexed
          var departureDay = ('0' + departureDate.getDate()).slice(-2);
          var formattedDepartureDate = departureYear + '-' + departureMonth + '-' + departureDay;
          
          // Format arrival date
          var arrivalYear = arrivaldateorigin.getFullYear();
          var arrivalMonth = ('0' + (arrivaldateorigin.getMonth() + 1)).slice(-2); // Adding 1 to month because it's zero-indexed
          var arrivalDay = ('0' + arrivaldateorigin.getDate()).slice(-2);
          var formattedArrivalDate = arrivalYear + '-' + arrivalMonth + '-' + arrivalDay;
          
          // console.log(formattedDepartureDate);
          // console.log(formattedArrivalDate);
          data.departuredateorigin = formattedDepartureDate
          data.arrivaldateorigin = formattedArrivalDate
          
          
          this.getView()
            .byId("arrivaldateorigin")
            .setValue(formattedArrivalDate);
    
        return formattedArrivalDate;
    },
  

      calculateOverallTotalDays: function (
        distanceorigin,
        distancedestination,
        portdaysorigin,
        portdaysdestination,
        speedorigin
      ) {
        console.log(
          distanceorigin,
          portdaysorigin,
          portdaysdestination,
          speedorigin
        );
        let sea_daysdestination =
          (distancedestination - distanceorigin) / (speedorigin * 24);

        let overallTotalDays1 =
          parseFloat(portdaysorigin) +
          parseFloat(portdaysdestination) +
          parseFloat(sea_daysdestination);
        console.log(
          "helloo",
          sea_daysdestination,
          portdaysorigin,
          portdaysdestination
        );
        this.getView().byId("totaldays").setValue(overallTotalDays1.toFixed(1));
        this.getView()
          .byId("sea_daysdestination")
          .setValue(sea_daysdestination);

        return sea_daysdestination;
      },
      // arrival Date destination
      
      calculatearrivaldatedestination: function (  departuredateorigin,   sea_daysdestination,   carryDays ) {
        var departuredate = new Date(departuredateorigin);
        // console.log(sea_daysdestination, parseInt(sea_daysdestination));
        var arrivaldatedestination = new Date(
          departuredate.getTime() + (parseInt(sea_daysdestination) +carryDays) * 24 * 60 * 60 * 1000
        );
        console.log("arrDatedest ", arrivaldatedestination);

        this.getView().byId("arrivaldatedestination").setValue(arrivaldatedestination.toString().slice(0, 15));
        data.arrivaldatedestination = arrivaldatedestination.toString().slice(0, 15);
        return arrivaldatedestination;
      },

      calculatedeparturedatedestination: function (arrivaldatedestination, portdaysdestination) {
        // Parse the arrival date to ensure it's a valid date
        var arrivaldate = new Date(arrivaldatedestination);
        if (isNaN(arrivaldate.getTime())) {
          console.error("Invalid arrival date");
          return null;
        }
      
        // Ensure portdaysdestination and carryDay are valid numbers
        portdaysdestination = parseFloat(portdaysdestination);
      
        if (isNaN(portdaysdestination) ) {
          console.error("Invalid port days or carry day");
          return null;
        }
      
        // Calculate the departure date at the destination
        var departuredatedestination = new Date(
          arrivaldate.getTime() + (portdaysdestination ) * 24 * 60 * 60 * 1000
        );
      
        // Check if the result is a valid date
        if (isNaN(departuredatedestination.getTime())) {
          console.error("Invalid departure date");
          return null;
        }
      
        // Set the calculated departure date in the UI or wherever needed
        console.log("departure Date Destination : ", departuredatedestination.toString().slice(0,15));
        this.getView().byId("departuredatedestination").setValue(departuredatedestination.toString().slice(0, 15));
      
        return departuredatedestination;
      },
  

      onBackPress: function () {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteHome");
      }
    });
  }
);