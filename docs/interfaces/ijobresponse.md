[@iota-pico/pow-box](../README.md) > [IJobResponse](../interfaces/ijobresponse.md)

# Interface: IJobResponse

Represents the response for pow box job command.
*__interface__*: 

## Hierarchy

**IJobResponse**

## Index

### Properties

* [createdAt](ijobresponse.md#createdat)
* [error](ijobresponse.md#error)
* [errorMessage](ijobresponse.md#errormessage)
* [jobId](ijobresponse.md#jobid)
* [progress](ijobresponse.md#progress)
* [response](ijobresponse.md#response)
* [updatedAt](ijobresponse.md#updatedat)

---

## Properties

<a id="createdat"></a>

###  createdAt

**● createdAt**: *`string`*

*Defined in [models/IJobResponse.ts:19](https://github.com/iota-pico/pow-box/blob/590e420/src/models/IJobResponse.ts#L19)*

The date/time for job was created.

___
<a id="error"></a>

###  error

**● error**: *`boolean`*

*Defined in [models/IJobResponse.ts:24](https://github.com/iota-pico/pow-box/blob/590e420/src/models/IJobResponse.ts#L24)*

Was there an error for the job.

___
<a id="errormessage"></a>

###  errorMessage

**● errorMessage**: *`string`*

*Defined in [models/IJobResponse.ts:29](https://github.com/iota-pico/pow-box/blob/590e420/src/models/IJobResponse.ts#L29)*

The error message for the job.

___
<a id="jobid"></a>

###  jobId

**● jobId**: *`string`*

*Defined in [models/IJobResponse.ts:9](https://github.com/iota-pico/pow-box/blob/590e420/src/models/IJobResponse.ts#L9)*

The id of the job.

___
<a id="progress"></a>

###  progress

**● progress**: *`string`*

*Defined in [models/IJobResponse.ts:34](https://github.com/iota-pico/pow-box/blob/590e420/src/models/IJobResponse.ts#L34)*

The progress for the job.

___
<a id="response"></a>

###  response

**● response**: *`object`*

*Defined in [models/IJobResponse.ts:39](https://github.com/iota-pico/pow-box/blob/590e420/src/models/IJobResponse.ts#L39)*

The response trytes that have has pow performed on them.

#### Type declaration

 trytes: `string`[]

___
<a id="updatedat"></a>

###  updatedAt

**● updatedAt**: *`string`*

*Defined in [models/IJobResponse.ts:14](https://github.com/iota-pico/pow-box/blob/590e420/src/models/IJobResponse.ts#L14)*

The date/time for job was updated.

___

