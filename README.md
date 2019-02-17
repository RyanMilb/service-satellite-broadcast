# blockstream-satillite-api

Takes a message, up to 10kb, and relays it from the blockstream satillite.

# Contents

- [Installation](#Installation)
- [Definitions](#Definitions)
  - [Events](#Events)
    - [invoice-generated](#invoice-generated)
  - [Tasks](#Tasks)
    - [fetchInvoice](#fetchinvoice)

# Installation

## MESG Core

This service requires [MESG Core](https://github.com/mesg-foundation/core) to be installed first.

You can install MESG Core by running the following command or [follow the installation guide](https://docs.mesg.com/guide/start-here/installation.html).

```bash
bash <(curl -fsSL https://mesg.com/install)
```

## Service

Download the source code of this service, and then in the service's folder, run the following command:
```bash
mesg-core service deploy
```

# Definitions

# Events

## invoice-generated

Event key: `invoice-generated`

Example of it being used below:
```
    MESG.executeTask({
        serviceID: 'satillite-mesg-service',
        taskKey: 'fetchInvoice',
        inputData: JSON.stringify({ // The input data that task needs
            message: "<YOUR MESSAGE>",
            senderid: "<YOUR MESSAGE ID>"
        })
    })
```
This will emit an 'invoice generated event' which will include a testnet lightning invoice that needs to be paid for the service to complete its broadcast
```
MESG.listenEvent({
    serviceID: 'satillite-mesg-service',
    eventFilter: 'invoice-generated' // The event we want to listen
}).on('data', event => {
    const invoiceData = JSON.parse(event.eventData)
    const data = JSON.stringify({ // The input data that task needs
        apikey: '<YOUR API KEY HERE>',//Leaving my API key here. Generate your own here https://dev.opennode.co/
        invoice: invoiceData.invoice || "EMPTY INVOICE",
        invoiceId: invoiceData.invoiceid || "0"
    });
    console.log('invoice generated detected, sending data: ' + data)
    MESG.executeTask({
        serviceID: 'lightning-service',
        taskKey: 'payInvoice',
        inputData: data
    }).catch((err) => console.log(err.message))
        .then((result) => console.log('Invoice Paid Successfully, Message sent from space!'))
}).on('error', (err) => console.log(err.message))

```
| **Name** | **Key** | **Type** | **Description** |
| --- | --- | --- | --- |
| **authtoken** | `authtoken` | `String` |  |
| **invoice** | `invoice` | `String` |  |
| **invoiceid** | `invoiceid` | `String` |  |
| **uuid** | `uuid` | `String` |  |

# Tasks

## fetchInvoice

Task key: `fetchInvoice`



### Inputs

| **Name** | **Key** | **Type** | **Description** |
| --- | --- | --- | --- |
| **message** | `message` | `String` |  |
| **senderid** | `senderid` | `String` |  |

### Outputs

#### failure

Output key: `failure`



| **Name** | **Key** | **Type** | **Description** |
| --- | --- | --- | --- |
| **message** | `message` | `String` |  |

#### success

Output key: `success`



| **Name** | **Key** | **Type** | **Description** |
| --- | --- | --- | --- |
| **status** | `status` | `String` |  |


