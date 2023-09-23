import { LightningElement, api, track, wire } from 'lwc';

import ACCT_ID_CASE from '@salesforce/schema/Case.AccountId';
import ACCT_NAME from '@salesforce/schema/Account.Name';
import CASE_NUMBER from '@salesforce/schema/Case.CaseNumber';
import { getRecord } from 'lightning/uiRecordApi';

export default class VisionMetrixTab extends LightningElement {
    @api recordId;
    @api caseNumber;
    @api hasCase
    @api hasAcct;
    @track caseData;
    @track acctId;
    @track acctName;

    fields = [ CASE_NUMBER, ACCT_ID_CASE ];
    fieldsAcct = [ ACCT_NAME ];
    
    @wire( getRecord, { recordId: '$recordId', fields: '$fields' } )
    wiredRecord( { error, data } ) {
        if ( error ) {
            console.log( error );
        } else if ( data ) {
            console.log( data );
            this.hasCase = true;
            this.caseData = data;
            this.caseNumber = data.fields.CaseNumber.value;
            
        }
    }
    
    @wire( getRecord, { recordId: '$acctId', fields: '$fieldsAcct' } )
    wiredAcct( { error, data } ) {
        if ( error ) {
            console.log( error );
        } else if ( data ) {
            console.log( data );
            this.hasAcct = true;
            this.acctName = data.fields.Name.value;
        }
    }
}