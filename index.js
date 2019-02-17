const mesg = require('mesg-js').service()
var FormData = require('form-data');
var fetch = require('node-fetch');
var fs = require('fs');

const SAT_API = "https://satellite.blockstream.com/api"

const createFormData = async (message, bid) => {
  let form = new FormData();
  const timeStamp = new Date().toString();
  const uniqueFileName = "tempMessage"+timeStamp +".txt";
  fs.writeFile(uniqueFileName, message, function (err) {
    if (err) {
      return console.log(err);
    }
    // console.log("The file was saved!");
  });
  form.append('bid', bid);
  form.append('file', fs.createReadStream(uniqueFileName))
  return form;
}

const fetchInvoiceHandler = async (inputs, outputs) => {
  if (!inputs) return;
  console.log('Sending message to satillite')
  try {
    const formData = await createFormData(inputs.message,8888888);
console.log('submitting formdata: ' + JSON.stringify(formData));
    fetch(SAT_API + "/order", { method: 'POST', body: formData })
      .then(res => res.json())
      .then(json => {
        if (json.errors) throw (json.errors)
        console.log("Invoice from blockstream:" + json.lightning_invoice.payreq);
        mesg.emitEvent('invoice-generated', {
          authtoken: json.auth_token,
          uuid: json.uuid,
          invoice: json.lightning_invoice.payreq,
          invoiceid: json.lightning_invoice.id
        })
        console.log('Event Emitted: invoice-generated succesfully');
        // return outputs.success({ status: "invoice-generated - Success" })
      });
  } catch (error) {
    // If an error occurs, return the failure output
    return outputs.failure({
      message: error.toString()
    })
  }
}


mesg.listenTask({
  fetchInvoice: fetchInvoiceHandler
})
console.log('Listening tasks...')

