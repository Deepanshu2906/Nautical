

sap.ui.define(
  ["sap/ui/core/mvc/Controller",
  "sap/m/MessageBox",
  "sap/m/MessageToast"
],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, MessageBox, MessageToast) {
    "use strict";
    let isLogicDone = false;
    let itemDetails = {};

    return Controller.extend("nauticalfe.controller.CreateVoyage", {
      onInit: function () {
        var oView = this.getView();
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
              "VOYNO":-1,
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
               this.onSaveVoyage(headerData);
               
               console.log("ItemLevel Details : ", itemDetails);

              //  const oRouter = this.getOwnerComponent().getRouter();
              //  oRouter.navTo("RouteTrChangeVoyage", {
                
              //  });

             }
      },
      onSaveVoyage : function (payloadHeader){

      let JsonData = JSON.stringify(payloadHeader)

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
 
              console.log("Entity created successfully");
              console.log(res);
              res.json().then((data) => {
                if (data ) {
                  // Show the error message from the backend
                 
                  console.log(`successfully created ${data.VOYNO}`);
                  MessageBox.success(`successfully created Voyage no. ${data.VOYNO}`);
                  return
                }
              });
              // MessageToast.show(`Entity created successfully`)
 
 
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
          // .then(function (res) {
          //   if (res.ok) {
          //     return res.json();
          //   } else {
          //     throw new Error('Network response was not ok.');
          //   }
          // })
          // .then(function (data) {
          //   if (data.success) {
          //     // Handle success
          //     console.log(data.message);
          //     MessageBox.success(data.message);
          //   } else {
          //     // Handle error
          //     console.error('Error:', data.error);
          //     MessageBox.error(data.error);
          //   }
          // })
          // .catch(function (err) {
          //   console.error('Fetch error:', err);
          // });
 
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
   
          var data = {
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
              // console.log(arrTimeArr , hours, minutes);
             
              this.getView().byId("arrivaltimedestination").setValue(arrTimeArr[0]);
             
              let carryDay = arrTimeArr[1];
   
             
           var arrivaldatedestination = this.calculatearrivaldatedestination(
            data.departuredateorigin,
            data.sea_daysdestination,
            carryDay
            );
           
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

  calculateVoyage1: function (oEvent) {
    
       
        
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

        var data = {
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
            // console.log(arrTimeArr , hours, minutes);
            
            this.getView().byId("arrivaltimedestination").setValue(arrTimeArr[0]);
            
            let carryDay = arrTimeArr[1];

            
         var arrivaldatedestination = this.calculatearrivaldatedestination(
          data.departuredateorigin,
          data.sea_daysdestination,
          carryDay
          );
          
          isLogicDone = true;
          MessageToast.show("calculate done")
          return
          
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
        const newTime = `${formattedHours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${secondsStr} ${formattedAMPM}`;
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

      calculatearrivaldateorigin: function (
        departuredateorigin,
        portdaysorigin
      ) {
        var departureDate = new Date(departuredateorigin);
        var arrivalDateOrigin = new Date(
          departureDate.getTime() - portdaysorigin * 24 * 60 * 60 * 1000
        );
        this.getView()
          .byId("arrivaldateorigin")
          .setValue(arrivalDateOrigin.toString().slice(0, 15));
        return arrivalDateOrigin;
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
      calculatearrivaldatedestination: function (
        departuredateorigin,
        sea_daysdestination,
        carryDays
      ) {
        var departuredate = new Date(departuredateorigin);

        var arrivaldatedestination = new Date(
          departuredate.getTime() + (sea_daysdestination +carryDays) * 24 * 60 * 60 * 1000
        );
        console.log("arrDatedest ", arrivaldatedestination);
        this.getView()
          .byId("arrivaldatedestination")
          .setValue(arrivaldatedestination.toString().slice(0, 15));
        return arrivaldatedestination;
      },

      onBackPress: function () {
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("RouteHome");
      }
    });
  }
);