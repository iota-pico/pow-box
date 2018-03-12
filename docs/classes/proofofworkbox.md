[@iota-pico/pow-box](../README.md) > [ProofOfWorkBox](../classes/proofofworkbox.md)



# Class: ProofOfWorkBox


ProofOfWork implementation using Remote PowBox.

## Implements

* `IProofOfWork`

## Index

### Constructors

* [constructor](proofofworkbox.md#constructor)


### Methods

* [initialize](proofofworkbox.md#initialize)
* [performsSingle](proofofworkbox.md#performssingle)
* [pow](proofofworkbox.md#pow)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new ProofOfWorkBox**(networkClient: *`INetworkClient`*, apiKey: *`string`*, pollIntervalMs?: *`number`*): [ProofOfWorkBox](proofofworkbox.md)


*Defined in proofOfWorkBox.ts:23*



Create an instance of ProofOfWork.


**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| networkClient | `INetworkClient`  | - |   The network client to communicate through. |
| apiKey | `string`  | - |   The API key to access the pow box. |
| pollIntervalMs | `number`  | 1000 |   - |





**Returns:** [ProofOfWorkBox](proofofworkbox.md)

---


## Methods
<a id="initialize"></a>

###  initialize

► **initialize**(): `Promise`.<`void`>



*Defined in proofOfWorkBox.ts:49*



Allow the proof of work to perform any initialization. Will throw an exception if the implementation is not supported.




**Returns:** `Promise`.<`void`>





___

<a id="performssingle"></a>

###  performsSingle

► **performsSingle**(): `boolean`



*Defined in proofOfWorkBox.ts:57*



Performs single conversion per pow call.




**Returns:** `boolean`
True if pow only does one conversion.






___

<a id="pow"></a>

###  pow

► **pow**(trunkTransaction: *`Hash`*, branchTransaction: *`Hash`*, trytes: *`Trytes`[]*, minWeightMagnitude: *`number`*): `Promise`.<`Trytes`[]>



*Defined in proofOfWorkBox.ts:69*



Perform a proof of work on the data.


**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| trunkTransaction | `Hash`   |  The trunkTransaction to use for the pow. |
| branchTransaction | `Hash`   |  The branchTransaction to use for the pow. |
| trytes | `Trytes`[]   |  The trytes to perform the pow on. |
| minWeightMagnitude | `number`   |  The minimum weight magnitude. |





**Returns:** `Promise`.<`Trytes`[]>
The trytes produced by the proof of work.






___


