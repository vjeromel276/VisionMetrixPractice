import { LightningElement, api, track, wire } from 'lwc';

import ACCT_ID_CASE from '@salesforce/schema/Case.AccountId';
import ACCT_NAME_CASE from '@salesforce/schema/Case.Account_Name_Text__c';
import CASE_NUMBER from '@salesforce/schema/Case.CaseNumber';
import HAS_VM_TKT from '@salesforce/schema/Case.hasVisionMetrixTicket__c';
import addVMTicket from '@salesforce/apex/VisionMetrixCallOut.addVMTicket';
import { getRecord } from 'lightning/uiRecordApi';

export default class VisionMetrixTab extends LightningElement {
    @api recordId;
    @api caseNumber;
    @track caseData;
    @track acctId;
    @track acctName;
    
    hasCase;
    hasVMAcct;
    hasVMTkt;
    vmAccts = [ "ATT Wireless", "T-Mobile" ];
    fields = [ CASE_NUMBER, ACCT_ID_CASE, HAS_VM_TKT, ACCT_NAME_CASE ];
    
    @wire( getRecord, { recordId: '$recordId', fields: '$fields' } )
    wiredRecord( { error, data } ) {
        if ( error ) {
            console.log( error );
        } else if ( data ) {
            console.log( data );
            this.hasCase = true;
            this.caseData = data;
            this.acctId = data.fields.AccountId.value;
            this.acctName = data.fields.Account_Name_Text__c.value;
            this.caseNumber = data.fields.CaseNumber.value;
            this.hasVMTkt = data.fields.hasVisionMetrixTicket__c.value;
        }
        console.log( 'acctId: ' + this.acctId );
        console.log( 'acctName: ' + this.acctName );
        console.log( 'caseNumber: ' + this.caseNumber );
        console.log( 'hasVMTkt: ' + this.hasVMTkt );
        const ticketNumber = this.caseNumber;
        if( this.vmAccts.includes( this.acctName ) ) {
            this.hasVMAcct = true;
            if ( this.hasVMTkt ) {
               // pull vm ticket data
            } else {
                // create vm ticket
                addVMTicket( { ticketId: ticketNumber, isExclusion: true } )
                .then( result => {
                    console.log( 'result: ', 'Success' );
                    this.hasVisionMetrixTicket = true;
                    const evt = new ShowToastEvent( {
                        title: 'Success!! You DID IT!!',
                        message: 'Vision Metrix Ticket Created',
                        variant: 'success',
                    } );
                    this.dispatchEvent( evt );
                } )
                .catch( error => {
                    console.log( 'error: ', error );
                    const evt = new ShowToastEvent( {
                        title: 'Vision Metrix Ticket Creation Failed',
                        message: 'If the error persists, please contact your system administrator.',
                        variant: 'error',
                    } );
                    this.dispatchEvent( evt );
                } );
            }
        }
    }
    
    
}