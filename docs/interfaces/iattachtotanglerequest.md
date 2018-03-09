[@iota-pico/pow-box](../README.md) > [IAttachToTangleRequest](../interfaces/iattachtotanglerequest.md)



# Interface: IAttachToTangleRequest


Represents the request for pow box attach to tangle command.
*__interface__*: 



## Properties
<a id="branchtransaction"></a>

###  branchTransaction

**●  branchTransaction**:  *`string`* 

*Defined in models/IAttachToTangleRequest.ts:15*



Branch transaction to approve.




___

<a id="command"></a>

###  command

**●  command**:  *`string`* 

*Defined in models/IAttachToTangleRequest.ts:7*



The command to send




___

<a id="minweightmagnitude"></a>

###  minWeightMagnitude

**●  minWeightMagnitude**:  *`number`* 

*Defined in models/IAttachToTangleRequest.ts:19*



Proof of Work intensity. Minimum value is 18




___

<a id="trunktransaction"></a>

###  trunkTransaction

**●  trunkTransaction**:  *`string`* 

*Defined in models/IAttachToTangleRequest.ts:11*



Trunk transaction to approve.




___

<a id="trytes"></a>

###  trytes

**●  trytes**:  *`string`[]* 

*Defined in models/IAttachToTangleRequest.ts:23*



List of trytes (raw transaction data) to attach to the tangle.




___


