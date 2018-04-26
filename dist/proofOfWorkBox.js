Object.defineProperty(exports, "__esModule", { value: true });
const arrayHelper_1 = require("@iota-pico/core/dist/helpers/arrayHelper");
const numberHelper_1 = require("@iota-pico/core/dist/helpers/numberHelper");
const objectHelper_1 = require("@iota-pico/core/dist/helpers/objectHelper");
const stringHelper_1 = require("@iota-pico/core/dist/helpers/stringHelper");
const cryptoError_1 = require("@iota-pico/crypto/dist/error/cryptoError");
const hash_1 = require("@iota-pico/data/dist/data/hash");
const trytes_1 = require("@iota-pico/data/dist/data/trytes");
/**
 * ProofOfWork implementation using Remote PowBox.
 */
class ProofOfWorkBox {
    /**
     * Create an instance of ProofOfWork.
     * @param networkClient The network client to communicate through.
     * @param apiKey The API key to access the pow box.
     * @param pollIntervalMs The polling time to check for completion.
     */
    constructor(networkClient, apiKey, pollIntervalMs = 1000) {
        if (objectHelper_1.ObjectHelper.isEmpty(networkClient)) {
            throw new cryptoError_1.CryptoError("The networkClient must be defined");
        }
        if (stringHelper_1.StringHelper.isEmpty(apiKey)) {
            throw new cryptoError_1.CryptoError("The apiKey must not be empty");
        }
        if (!numberHelper_1.NumberHelper.isInteger(pollIntervalMs) || pollIntervalMs <= 0) {
            throw new cryptoError_1.CryptoError("The pollIntervalMs must be > 0");
        }
        this._networkClient = networkClient;
        this._apiKey = apiKey;
        this._pollIntervalMs = pollIntervalMs;
    }
    /**
     * Allow the proof of work to perform any initialization.
     * Will throw an exception if the implementation is not supported.
     * @returns Promise.
     */
    async initialize() {
        return Promise.resolve();
    }
    /**
     * Perform a proof of work on the data.
     * @param trunkTransaction The trunkTransaction to use for the pow.
     * @param branchTransaction The branchTransaction to use for the pow.
     * @param trytes The trytes to perform the pow on.
     * @param minWeightMagnitude The minimum weight magnitude.
     * @returns The trytes produced by the proof of work.
     */
    async pow(trunkTransaction, branchTransaction, trytes, minWeightMagnitude) {
        if (!objectHelper_1.ObjectHelper.isType(trunkTransaction, hash_1.Hash)) {
            throw new cryptoError_1.CryptoError("The trunkTransaction must be an object of type Hash");
        }
        if (!objectHelper_1.ObjectHelper.isType(branchTransaction, hash_1.Hash)) {
            throw new cryptoError_1.CryptoError("The branchTransaction must be an object of type Hash");
        }
        if (!arrayHelper_1.ArrayHelper.isTyped(trytes, trytes_1.Trytes)) {
            throw new cryptoError_1.CryptoError("The trytes must be an array of type Trytes");
        }
        if (!numberHelper_1.NumberHelper.isInteger(minWeightMagnitude) || minWeightMagnitude <= 0) {
            throw new cryptoError_1.CryptoError("The minWeightMagnitude must be > 0");
        }
        const attachToTangleRequest = {
            command: "attachToTangle",
            trunkTransaction: trunkTransaction.toTrytes().toString(),
            branchTransaction: branchTransaction.toTrytes().toString(),
            minWeightMagnitude,
            trytes: trytes.map(t => t.toString())
        };
        const additionalHeaders = { Authorization: this._apiKey };
        const attachToTangleResponse = await this._networkClient.postJson(attachToTangleRequest, "commands", additionalHeaders);
        if (objectHelper_1.ObjectHelper.isEmpty(attachToTangleResponse) || stringHelper_1.StringHelper.isEmpty(attachToTangleResponse.jobId)) {
            throw new cryptoError_1.CryptoError("The attachToTangleRequest did not return a jobId");
        }
        else {
            return this.waitForJobCompletion(attachToTangleResponse.jobId, trytes);
        }
    }
    /* @internal */
    async waitForJobCompletion(jobId, sourceTrytes) {
        return new Promise((resolve, reject) => {
            const intervalId = setInterval(async () => {
                try {
                    const jobResponse = await this._networkClient.getJson(`jobs/${jobId}`);
                    if (jobResponse.error) {
                        clearInterval(intervalId);
                        reject(new cryptoError_1.CryptoError(jobResponse.errorMessage));
                    }
                    else if (jobResponse.progress === "100") {
                        clearInterval(intervalId);
                        if (jobResponse && jobResponse.response && jobResponse.response.trytes && jobResponse.response.trytes.length === sourceTrytes.length) {
                            resolve(jobResponse.response.trytes.map(t => trytes_1.Trytes.fromString(t)));
                        }
                        else {
                            reject(new cryptoError_1.CryptoError("The response did not contain enough trytes"));
                        }
                    }
                }
                catch (err) {
                    clearInterval(intervalId);
                    reject(err);
                }
            }, this._pollIntervalMs);
        });
    }
}
exports.ProofOfWorkBox = ProofOfWorkBox;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvb2ZPZldvcmtCb3guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcHJvb2ZPZldvcmtCb3gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBFQUF1RTtBQUN2RSw0RUFBeUU7QUFDekUsNEVBQXlFO0FBQ3pFLDRFQUF5RTtBQUV6RSwwRUFBdUU7QUFFdkUseURBQXNEO0FBQ3RELDZEQUEwRDtBQUsxRDs7R0FFRztBQUNIO0lBUUk7Ozs7O09BS0c7SUFDSCxZQUFZLGFBQTZCLEVBQUUsTUFBYyxFQUFFLGlCQUF5QixJQUFJO1FBQ3BGLElBQUksMkJBQVksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEVBQUU7WUFDckMsTUFBTSxJQUFJLHlCQUFXLENBQUMsbUNBQW1DLENBQUMsQ0FBQztTQUM5RDtRQUNELElBQUksMkJBQVksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDOUIsTUFBTSxJQUFJLHlCQUFXLENBQUMsOEJBQThCLENBQUMsQ0FBQztTQUN6RDtRQUNELElBQUksQ0FBQywyQkFBWSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxjQUFjLElBQUksQ0FBQyxFQUFFO1lBQ2hFLE1BQU0sSUFBSSx5QkFBVyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7U0FDM0Q7UUFDRCxJQUFJLENBQUMsY0FBYyxHQUFHLGFBQWEsQ0FBQztRQUNwQyxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsZUFBZSxHQUFHLGNBQWMsQ0FBQztJQUMxQyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLEtBQUssQ0FBQyxVQUFVO1FBQ25CLE9BQU8sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0ksS0FBSyxDQUFDLEdBQUcsQ0FBQyxnQkFBc0IsRUFBRSxpQkFBdUIsRUFBRSxNQUFnQixFQUFFLGtCQUEwQjtRQUMxRyxJQUFJLENBQUMsMkJBQVks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