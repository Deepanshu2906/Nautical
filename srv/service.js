const cds = require('@sap/cds');
const { NAVOYGIP , NAVOYGH} = cds.entities("create_voyage")

module.exports = cds.service.impl(async function (srv) {
    const ZBTP_NAUTI_CREATEVOYAGE_CDS = await cds.connect.to("ZBTP_NAUTI_CREATEVOYAGE_CDS"); 
    srv.on('READ', 'ZBTP_NAUTI_CreateVoyage', req => ZBTP_NAUTI_CREATEVOYAGE_CDS.run(req.query));

    const ZBTP_NAUTI_MARINE_DM_CDS = await cds.connect.to("ZBTP_NAUTI_MARINE_DM_CDS"); 
    srv.on('READ', 'ZBTP_NAUTI_Marine_DM', req => ZBTP_NAUTI_MARINE_DM_CDS.run(req.query)); 

    const ZBTP_NAUTI_VOY_DOC_UPD_CDS = await cds.connect.to("ZBTP_NAUTI_VOY_DOC_UPD_CDS"); 
    srv.on('READ', 'ZBTP_Nauti_Voy_DOC_UPD', req => ZBTP_NAUTI_VOY_DOC_UPD_CDS.run(req.query)); 

    const ZBTP_NAUTICAL_MARIDISTANCE_CDS = await cds.connect.to("ZBTP_NAUTICAL_MARIDISTANCE_CDS"); 
      srv.on('READ', 'ZBTP_NAUTICAL_MariDistance', req => ZBTP_NAUTICAL_MARIDISTANCE_CDS.run(req.query)); 

    const NAUTINAUTICALCV_SRV = await cds.connect.to("NAUTINAUTICALCV_SRV"); 

      srv.on('READ', 'BidTypeSet', req => NAUTINAUTICALCV_SRV.run(req.query)); 

      try {
        srv.on('CREATE', 'NAVOYGH', async (req) => {
            console.log("my data : ", req.data);
            let {maxID}  = await SELECT.one`max(VOYNO) as maxID`.from(NAVOYGH);

            
            if(maxID==null){
                maxID = 1000000;
                
                req.data.VOYNO = maxID;
            }else {

                id = maxID;
                req.data.VOYNO = id + 1;
            }
            // console.log(id);

            const voydata = req.data
            console.log("updated data: ", voydata);

            const result = await cds.tx(req).run(INSERT.into(NAVOYGH).entries(voydata))
            console.log(result.results);
            return {
                success: true,
                message: "Record created successfully",
                result: result.results
            };
        })
    }
     catch (error) {
        console.log("error is :" + error);
        // If an error occurs, you might want to return an error response to the client
         return {
        success: false,
        error: error.message // Provide a meaningful error message to the client
         };
    }

    // Event handler before creating a new record in NAVOYGH
    // srv.after('CREATE', 'NAVOYGH', async (data, req) => {
    //      // Check if VOYNO is not provided
    //     console.log("reqest body ",req);
    //     console.log("data : ", data);
    
    //     // Check if VOYNO is not provided
    //     if (data.VOYNO === undefined || data.VOYNO === null) {
    //         // Check if there are existing records
    //         const hasExistingRecords = await cds.tx(req).run(
    //             SELECT.one('VOYNO').from(NAVOYGH)
    //         );

    //         // Calculate the next VOYNO based on whether there are existing records
    //         if (hasExistingRecords) {
    //             // Get the maximum existing VOYNM
    //             const maxVoyNm = await cds.tx(req).run(
    //                 SELECT.one('VOYNM').from(NAVOYGH).orderBy({ VOYNM: 'desc' })
    //             );

    //             // Generate VOYNO based on the maximum VOYNM
    //             data.VOYNO = maxVoyNm ? parseInt(maxVoyNm.VOYNM, 10) + 1 : 100000;
    //         } else {
    //             // If no existing records, start from 100000
    //             data.VOYNO = 100000;
    //         }

    //         // Ensure the generated VOYNO is within the specified range
    //         data.VOYNO = Math.min(Math.max(data.VOYNO, 100000), 199999);
    //     }
    // });
    // this.before('CREATE', 'NAVOYGIP', async (req, res) => {
    //     try {
    //         let table = await srv.read('create_voyage.NAVOYGIP');
    //         function findObjectByVOYNM(voynm) {
    //             return table.find((item) => item.VOYNM === voynm);
    //         }
    //         let generatedVoyageNo;
    //         let flag=true;
    //         for (let i = 1000000001; i < 1000000009; i++) {
    //             const voyNmToFind = i;
    //             const foundObject = findObjectByVOYNM(voyNmToFind);

    //             if (foundObject) {
    //                 generatedVoyageNo = i + 1;

    //                 console.log( generatedVoyageNo)
    //                 break;
    //             } else{
    //                 flag=false;
    //             }

    //         }
    //         if(flag===false){
    //             generatedVoyageNo = 1000000000;
    //         }
            
           
    //         let data = await req.data;
            
           
    //         const tx = cds.transaction(req); 
            
    //          try{
    //             await tx.run({
    //                 INSERT: {
    //                     into: { ref: ['create_voyage.NAVOYGIP'] },
    //                     columns: [
    //                         "VOYNM",
    //                         "VLEGN",
    //                         "PORTC",
    //                         "PORTN",
    //                         "LOCNAM",
    //                         "PDIST",
    //                         "VSPEED",
    //                         "PPDAYS",
    //                         "VSDAYS",
    //                         "VETAD",
    //                         "VETAT",
    //                         "VETDD",
    //                         "VETDT",
    //                         "VWEAD",
    //                         "PSTAT",
    //                         "MATNR",
    //                         "MAKTX",
    //                         "CARGS",
    //                         "CARGU",
    //                         "OTHCO_code",
    //                         "FRCOST_code",
    //                         "TOTCO_code"
    //                     ],
    //                     values: [
    //                         generatedVoyageNo,
    //                         data.VLEGN,
    //                         data.PORTC,
    //                         data.PORTN,
    //                         data.LOCNAM,
    //                         data.PDIST,
    //                         data.VSPEED,
    //                         data.PPDAYS,
    //                         data.VSDAYS,
    //                         data.VETAD,
    //                         data.VETAT,
    //                         data.VETDD,
    //                         data.VETDT,
    //                         data.VWEAD,
    //                         data.PSTAT,
    //                         data.MATNR,
    //                         data.MAKTX,
    //                         data.CARGS,
    //                         data.CARGU,
    //                         data.OTHCO,
    //                         data.FRCOST,
    //                         data.TOTCO
    //                     ]
    //                 }
    //             });

                
    //             console.log(data);
    //             console.log('Success');
    //         }
            

    //          catch (error) {

                

    //             console.error(error);

    //          }
    //     } catch (error) {

            
    //         console.log(error)



    //     }
    // }
   
    
    
    // );

    // try {
    //     srv.on('CREATE', 'NAVOYGIP', async (req) => {
    
    //       var { maxID } = await SELECT.one`max(VOYNO) as maxID`.from(NAVOYGIP);
    //       if (maxID == null) {
    //         maxID = 100000001;
    //       }
    
    //       else {

    //           req.data.maxID = maxID +1
    //     }
        
    //     console.log(maxID);
          
       
    //       const data = req.data
          
    
    //       const result = await cds.tx(req).run(INSERT.into(NAVOYGIP).entries(data))
    
    //       console.log(result);
    
    //       return result;
    
    //     })
    //   } catch (error) {
    
    //     console.log("error is :" + error);
    
    //   }
    
});
