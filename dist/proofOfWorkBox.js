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
        const attachToTangleResponse = await this._networkClient.json(attachToTangleRequest, "POST", "commands", additionalHeaders);
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
                    const jobResponse = await this._networkClient.json(undefined, "GET", `jobs/${jobId}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvb2ZPZldvcmtCb3guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcHJvb2ZPZldvcmtCb3gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBFQUF1RTtBQUN2RSw0RUFBeUU7QUFDekUsNEVBQXlFO0FBQ3pFLDRFQUF5RTtBQUV6RSwwRUFBdUU7QUFFdkUseURBQXNEO0FBQ3RELDZEQUEwRDtBQUsxRDs7R0FFRztBQUNILE1BQWEsY0FBYztJQVF2Qjs7Ozs7T0FLRztJQUNILFlBQVksYUFBNkIsRUFBRSxNQUFjLEVBQUUsaUJBQXlCLElBQUk7UUFDcEYsSUFBSSwyQkFBWSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsRUFBRTtZQUNyQyxNQUFNLElBQUkseUJBQVcsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1NBQzlEO1FBQ0QsSUFBSSwyQkFBWSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUM5QixNQUFNLElBQUkseUJBQVcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1NBQ3pEO1FBQ0QsSUFBSSxDQUFDLDJCQUFZLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLGNBQWMsSUFBSSxDQUFDLEVBQUU7WUFDaEUsTUFBTSxJQUFJLHlCQUFXLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztTQUMzRDtRQUNELElBQUksQ0FBQyxjQUFjLEdBQUcsYUFBYSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxlQUFlLEdBQUcsY0FBYyxDQUFDO0lBQzFDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksS0FBSyxDQUFDLFVBQVU7UUFDbkIsT0FBTyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSSxLQUFLLENBQUMsR0FBRyxDQUFDLGdCQUFzQixFQUFFLGlCQUF1QixFQUFFLE1BQWdCLEVBQUUsa0JBQTBCO1FBQzFHLElBQUks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