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
      let lastAssignedVoyNo;
      try {
        srv.before('CREATE', 'NAVOYGH', async (req) => {
            console.log("my data : ", req.data);
          //   let {maxID}  = await SELECT.one`max(VOYNO) as maxID`.from(NAVOYGH);
          //  console.log(res, maxID);
           
          //   if(maxID==null){
          //       maxID = 1000000;
                
          //       req.data.VOYNO = maxID;
          //   }else {

          //       id = maxID;
          //       req.data.VOYNO = id + 1;
          //   }
          //   // console.log(id);

          if (!lastAssignedVoyNo) {
            // If lastAssignedVoyNo is not set, fetch the maximum from the database
        let { maxID } = await SELECT.one`max(VOYNO) as maxID`.from(NAVOYGH);
        lastAssignedVoyNo = maxID || 1000000;
      }
      
      // Increment the last assigned VOYNO
      lastAssignedVoyNo++;
      
      // Assign the new VOYNO to the request data
      req.data.VOYNO = lastAssignedVoyNo;
      const voydata = req.data

            console.log("updated data: ", voydata);

            // const result = await cds.tx(req).run(INSERT.into(NAVOYGH).entries(voydata))
            // console.log(result.results);
           
           
        });
        srv.on('CREATE', 'NAVOYGH', async ( req) => {
          
          console.log("Created entity data: ", req.data );
          const keys = ['VOYNO', 'VOYNM', 'VNOMTK', 'REFDOC', 'DOCIND', 'VESSN', 'VIMO', 'CHTYP', 'CHPNO', 'CURRKEYS', 'FRTCO', 'VSTAT', 'VOYTY', 'CARTY', 'CURR', 'FREGHT', 'PARTY', 'BIDTYPE', 'FRCOST', 'FRTU', 'FRCOST_ACT', 'ZDELETE', 'REF_VOYNO'];
          const values = [req.data.VOYNO, req.data.VOYNM, req.data.VNOMTK, req.data.REFDOC, req.data.DOCIND, req.data.VESSN, req.data.VIMO, req.data.CHTYP, req.data.CHPNO, req.data.CURRKEYS, req.data.FRTCO, req.data.VSTAT, req.data.VOYTY, req.data.CARTY, req.data.CURR, req.data.FREGHT, req.data.PARTY, req.data.BIDTYPE, req.data.FRCOST, req.data.FRTU, req.data.FRCOST_ACT, req.data.ZDELETE, req.data.REF_VOYNO];
  
          const result = await cds.tx(req).run(
              INSERT.into(NAVOYGH).columns(...keys).values(...values)
          );
          console.log("result from srv.on : ", result.results);
          return req.data
          // {
          //     success: true,
          //     message: "Record created successfully",
          //     result: result.results
          // }
        
          
        });
        srv.after('CREATE', 'NAVOYGH', async (data, req) => {
          // Your logic for 'srv.after' hook
          console.log("final : ", data, req.data);
          
          // return {
          //   success: true,
          //   message: "Record created successfully",
          //   result: req.data
          // };
          
          return req.data;
          
        });
      
      
    }
     catch (error) {
        console.log("error is :" + error);
        // If an error occurs, you might want to return an error response to the client
         return {
        success: false,
        error: error.message // Provide a meaningful error message to the client
         };
    }
    
});
