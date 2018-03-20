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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvb2ZPZldvcmtCb3guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcHJvb2ZPZldvcmtCb3gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBFQUF1RTtBQUN2RSw0RUFBeUU7QUFDekUsNEVBQXlFO0FBQ3pFLDRFQUF5RTtBQUV6RSwwRUFBdUU7QUFFdkUseURBQXNEO0FBQ3RELDZEQUEwRDtBQUsxRDs7R0FFRztBQUNIO0lBUUk7Ozs7O09BS0c7SUFDSCxZQUFZLGFBQTZCLEVBQUUsTUFBYyxFQUFFLGlCQUF5QixJQUFJO1FBQ3BGLEVBQUUsQ0FBQyxDQUFDLDJCQUFZLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QyxNQUFNLElBQUkseUJBQVcsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1FBQy9ELENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQywyQkFBWSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0IsTUFBTSxJQUFJLHlCQUFXLENBQUMsOEJBQThCLENBQUMsQ0FBQztRQUMxRCxDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsQ0FBQywyQkFBWSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxjQUFjLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqRSxNQUFNLElBQUkseUJBQVcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1FBQzVELENBQUM7UUFDRCxJQUFJLENBQUMsY0FBYyxHQUFHLGFBQWEsQ0FBQztRQUNwQyxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsZUFBZSxHQUFHLGNBQWMsQ0FBQztJQUMxQyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksS0FBSyxDQUFDLFVBQVU7UUFDbkIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNJLEtBQUss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