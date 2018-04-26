import { ArrayHelper } from "@iota-pico/core/dist/helpers/arrayHelper";
import { NumberHelper } from "@iota-pico/core/dist/helpers/numberHelper";
import { ObjectHelper } from "@iota-pico/core/dist/helpers/objectHelper";
import { StringHelper } from "@iota-pico/core/dist/helpers/stringHelper";
import { INetworkClient } from "@iota-pico/core/dist/interfaces/INetworkClient";
import { CryptoError } from "@iota-pico/crypto/dist/error/cryptoError";
import { IProofOfWork } from "@iota-pico/crypto/dist/interfaces/IProofOfWork";
import { Hash } from "@iota-pico/data/dist/data/hash";
import { Trytes } from "@iota-pico/data/dist/data/trytes";
import { IAttachToTangleRequest } from "./models/IAttachToTangleRequest";
import { IAttachToTangleResponse } from "./models/IAttachToTangleResponse";
import { IJobResponse } from "./models/IJobResponse";

/**
 * ProofOfWork implementation using Remote PowBox.
 */
export class ProofOfWorkBox implements IProofOfWork {
    /* @internal */
    private readonly _networkClient: INetworkClient;
    /* @internal */
    private readonly _apiKey: string;
    /* @internal */
    private readonly _pollIntervalMs: number;

    /**
     * Create an instance of ProofOfWork.
     * @param networkClient The network client to communicate through.
     * @param apiKey The API key to access the pow box.
     * @param pollIntervalMs The polling time to check for completion.
     */
    constructor(networkClient: INetworkClient, apiKey: string, pollIntervalMs: number = 1000) {
        if (ObjectHelper.isEmpty(networkClient)) {
            throw new CryptoError("The networkClient must be defined");
        }
        if (StringHelper.isEmpty(apiKey)) {
            throw new CryptoError("The apiKey must not be empty");
        }
        if (!NumberHelper.isInteger(pollIntervalMs) || pollIntervalMs <= 0) {
            throw new CryptoError("The pollIntervalMs must be > 0");
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
    public async initialize(): Promise<void> {
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
    public async pow(trunkTransaction: Hash, branchTransaction: Hash, trytes: Trytes[], minWeightMagnitude: number): Promise<Trytes[]> {
        if (!ObjectHelper.isType(trunkTransaction, Hash)) {
            throw new CryptoError("The trunkTransaction must be an object of type Hash");
        }
        if (!ObjectHelper.isType(branchTransaction, Hash)) {
            throw new CryptoError("The branchTransaction must be an object of type Hash");
        }
        if (!ArrayHelper.isTyped(trytes, Trytes)) {
            throw new CryptoError("The trytes must be an array of type Trytes");
        }
        if (!NumberHelper.isInteger(minWeightMagnitude) || minWeightMagnitude <= 0) {
            throw new CryptoError("The minWeightMagnitude must be > 0");
        }

        const attachToTangleRequest: IAttachToTangleRequest = {
            command: "attachToTangle",
            trunkTransaction: trunkTransaction.toTrytes().toString(),
            branchTransaction: branchTransaction.toTrytes().toString(),
            minWeightMagnitude,
            trytes: trytes.map(t => t.toString())
        };

        const additionalHeaders = { Authorization: this._apiKey };

        const attachToTangleResponse = await this._networkClient.postJson<IAttachToTangleRequest, IAttachToTangleResponse>(attachToTangleRequest, "commands", additionalHeaders);

        if (ObjectHelper.isEmpty(attachToTangleResponse) || StringHelper.isEmpty(attachToTangleResponse.jobId)) {
            throw new CryptoError("The attachToTangleRequest did not return a jobId");
        } else {
            return this.waitForJobCompletion(attachToTangleResponse.jobId, trytes);
        }
    }

    /* @internal */
    private async waitForJobCompletion(jobId: string, sourceTrytes: Trytes[]): Promise<Trytes[]> {
        return new Promise<Trytes[]>((resolve, reject) => {
            const intervalId = setInterval(async () => {
                try {
                    const jobResponse = await this._networkClient.getJson<IJobResponse>(`jobs/${jobId}`);
                    if (jobResponse.error) {
                        clearInterval(intervalId);
                        reject(new CryptoError(jobResponse.errorMessage));
                    } else if (jobResponse.progress === "100") {
                        clearInterval(intervalId);
                        if (jobResponse && jobResponse.response && jobResponse.response.trytes && jobResponse.response.trytes.length === sourceTrytes.length) {
                            resolve(jobResponse.response.trytes.map(t => Trytes.fromString(t)));
                        } else {
                            reject(new CryptoError("The response did not contain enough trytes"));
                        }
                    }
                } catch (err) {
                    clearInterval(intervalId);
                    reject(err);
                }
            },
                                           this._pollIntervalMs);
        });
    }
}
