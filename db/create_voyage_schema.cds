using {
    Country,
    Currency,
    managed,
    cuid,
    temporal,
    sap.common.CodeList as CodeList
} from '@sap/cds/common';

//Create Voyage Database
namespace create_voyage;

// Voyage header date  Table

entity NAVOYGH {

        VOYNO      : Integer64  ; // Voyage Number
        VOYNM      : String(40); // Voyage Name
        VNOMTK     : String(20); // Nomination Number
        REFDOC     : String(10); //   Document Ref
        DOCIND     : Int16; // Ref Doc. ind  --> /Ingenx/REF_DOC
        VESSN      : String(20); // Vessel Name
        VIMO       : String(20); // Vessel IMO Number --> TWS Vehicle Master
        CHTYP      : String(5); // Charter Type
        CHPNO      : String(10); // Freight Contract -> SAP Freight Contract
        CURRKEYS   : String(5); // Currency Key
        FRTCO      : Decimal; //   Freight Cost for the Voyage
        VSTAT      : String(20); // Voyage Status
        VOYTY      : String(4); // Voyage Type   -> VOYTYP
        CARTY      : String(4); // Vessel Type -> CARTYP
        CURR       : String(3); // Currency  --> NAVOYGUR
        FREGHT     : Decimal; // 11   Historical Freight Cost
        PARTY      : String(10); // CHarter Party Agreement
        BIDTYPE    : String(2); // Bid type --> BIDTYPE
        FRCOST     : Decimal; // Plan Freight cost
        FRTU       : String(10); // Freight Unit
        FRCOST_ACT : Decimal; // Actual Freight cost
        ZDELETE    : String(1); //  Genral flag
        REF_VOYNO  : String(20); //  REF VOYAGE No.

}


// Voyage Item level data 
entity NAVOYGIP  {

        key VOYNO : Association to NAVOYGH;   //>  NAVOYGH-VOYNM
        VOYNM  : Association to NAVOYGH; // Voyage  Number  -
        key   VLEGN  : Int64; // Numeric( 10)
        PORTC  : String(10); // Internation Unified Port code - unique
        PORTN  : String(10); // commnon used port name
        LOCNAM : String(10); // ref for Oil TSW   --> OIJNOMI-LOCNAM
        PDIST  : Decimal; // distnce betwenn two port from API
        VSPEED : Decimal; // (The speed of the vessel from Vessel Master/Manual Input)
        PPDAYS : Decimal; // Port days (Proposed from Historic Data/or Manual Input)
        VSDAYS : Decimal; // Sea Dys( Proposed from Historic Data/or Manual Input)
        VETAD  : Date; // ETA
        VETAT  : Time; // Time+A14:L25
        VETDD  : Date; // Manual entry (ETD)
        VETDT  : Time; //   Time ( manual)
        VWEAD  : Decimal; // Weather Delay Sea
        PSTAT  : String(5); // Status (In Planning, Vetting in Progress, Vetting Completed, Voyage Commenced)
        MATNR  : String(40); // Material Number
        MAKTX  : String(40); // Material Description
        CARGS  : Decimal(12); // Cargo Size
        CARGU  : String(10); // unit of measure ment
        OTHCO  : Decimal; //  additional charge for voyage
        FRCOST : Decimal; // total freight cost
        TOTCO  : Decimal; // totDecimal
        

}
//Bid details for voyage
entity ITEM_BID  {

         VOYNO     : Association to NAVOYGH {VOYNO}; // unique voyage no.
     key   ZCODE     : String(10); // This field is a text field allowing users to enter Data.
        VALUE     : String(50); // head data of biding details
        CVALUE    : Currency; //  Revaluation amount on back-posting to a previous period
        CUNIT     : String(5); // currency key unit   --> NAVOYGCUR
        CODE_DESC : String(50); // code description
        REV_BID   : String(1); // relevant for Biding
        GOOD      : String(1); // Good to have
        MAND      : String(1); // Active/ Inactive
        MUST      : String(1); // Must Not have
        ZMIN      : Decimal(3); // minimum score
        ZMAX      : Decimal(3); // MAximum Score

}

// Cost code Item details saved in  Table NAVOYGCIT
entity NAVOYGCIT  {
        VOYNO      : Association to NAVOYGH {VOYNO}; // unique voyage no.
       key VLEGN      : Int64; // NUMERIC(10)   Unique leg Number
        COSTCODE   : String(4); //Unique cost code --> NAVOTGC
        COSTU      : String(10);
        PRCUNIT    : String(3); //
        PROCOST    : Currency; // projection Cost
        COSTCURR   : String(5); //CUKY
        CSTCODES   : String(35); // Cost code description  --> NAVOTGC
        COST_CHECK : String(1); // Relevant for biding
}