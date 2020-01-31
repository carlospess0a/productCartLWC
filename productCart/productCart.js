/* eslint-disable no-eval */
/* eslint-disable @lwc/lwc/no-inner-html */
/* eslint-disable @lwc/lwc/no-async-operation */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-console */

import { LightningElement, track, wire, api } from 'lwc';
import getProduct2 from '@salesforce/apex/productCartApex.getProduct2';
import saveProduct from '@salesforce/apex/productCartApex.saveProduct';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

var loaded = true;
export default class ProductCart extends LightningElement {
    @track queryTerm;
    @track showProduct = false;
    @api recordId;
    
    
    @wire(getProduct2, { param: '$queryTerm'}) products;

    handleKeyUp(evt) {
        this.queryTerm = evt.target.value;
        console.log(this.products.data);
    }

    handleInsert(evt){
        let selectedRow = this.template.querySelector('[data-id="' + evt.target.title + '"]');
        let selectedRowId = evt.target.title;
        let selectedRowName = selectedRow.children[0].firstChild.title;
        let selectedRowValue = selectedRow.children[1].firstChild.firstChild.value.replace(',', '.');
        let selectedRowQty = selectedRow.children[2].firstChild.firstChild.value;
        


        const recordInput = {fields:{
            Id: this.recordId
        }};
        saveProduct({
            id: selectedRowId,
            name: selectedRowName,
            value: selectedRowValue,
            qtd: selectedRowQty,
            oppId: this.recordId
        }).then(result => {
                if(result.split(';')[0] === 'true'){
                    selectedRow.children[3].firstChild.firstChild.classList.toggle('slds-hide');
                    selectedRow.children[3].firstChild.lastElementChild.classList.toggle('slds-hide');
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Sucesso!',
                            message: 'Produto adicionado!',
                            variant: 'success'
                        })
                    );
                    eval("$A.get('e.force:refreshView').fire();");
                }
            })
            .catch(error => {
                console.log('Error: ');
                console.log(error);
            });
    }

    renderedCallback() {
        if(loaded)
            this.queryTerm = 'allProducts';
        loaded = false;
        setTimeout(() => {
            this.showProduct = true;
        }, 1000);
    }
}