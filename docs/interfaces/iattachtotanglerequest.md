[@iota-pico/pow-box](../README.md) > [IAttachToTangleRequest](../interfaces/iattachtotanglerequest.md)

# Interface: IAttachToTangleRequest

Represents the request for pow box attach to tangle command.
*__interface__*: 

## Hierarchy

**IAttachToTangleRequest**

## Index

### Properties

* [branchTransaction](iattachtotanglerequest.md#branchtransaction)
* [command](iattachtotanglerequest.md#command)
* [minWeightMagnitude](iattachtotanglerequest.md#minweightmagnitude)
* [trunkTransaction](iattachtotanglerequest.md#trunktransaction)
* [trytes](iattachtotanglerequest.md#trytes)

---

## Properties

<a id="branchtransaction"></a>

###  branchTransaction

**●  branchTransaction**:  *`string`* 

*Defined in [models/IAttachToTangleRequest.ts:15](https://github.com/iota-pico/pow-box/blob/8d78073/src/models/IAttachToTangleRequest.ts#L15)*

Branch transaction to approve.

___

<a id="command"></a>

###  command

**●  command**:  *`string`* 

*Defined in [models/IAttachToTangleRequest.ts:7](https://github.com/iota-pico/pow-box/blob/8d78073/src/models/IAttachToTangleRequest.ts#L7)*

The command to send

___

<a id="minweightmagnitude"></a>

###  minWeightMagnitude

**●  minWeightMagnitude**:  *`number`* 

*Defined in [models/IAttachToTangleRequest.ts:19](https://github.com/iota-pico/pow-box/blob/8d78073/src/models/IAttachToTangleRequest.ts#L19)*

Proof of Work intensity. Minimum value is 18

___

<a id="trunktransaction"></a>

###  trunkTransaction

**●  trunkTransaction**:  *`string`* 

*Defined in [models/IAttachToTangleRequest.ts:11](https://github.com/iota-pico/pow-box/blob/8d78073/src/models/IAttachToTangleRequest.ts#L11)*

Trunk transaction to approve.

___

<a id="trytes"></a>

###  trytes

**●  trytes**:  *`string`[]* 

*Defined in [models/IAttachToTangleRequest.ts:23](https://github.com/iota-pico/pow-box/blob/8d78073/src/models/IAttachToTangleRequest.ts#L23)*

List of trytes (raw transaction data) to attach to the tangle.

___

