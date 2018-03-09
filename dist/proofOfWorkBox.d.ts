import { INetworkClient } from "@iota-pico/core/dist/interfaces/INetworkClient";
import { IProofOfWork } from "@iota-pico/crypto/dist/interfaces/IProofOfWork";
import { Hash } from "@iota-pico/data/dist/data/hash";
import { Trytes } from "@iota-pico/data/dist/data/trytes";
/**
 * ProofOfWork implementation using Remote PowBox.
 */
export declare class ProofOfWorkBox implements IProofOfWork {
    /**
     * Create an instance of ProofOfWork.
     * @param networkClient The network client to communicate through.
     * @param apiKey The API key to access the pow box.
     */
    constructor(networkClient: INetworkClient, apiKey: string, pollIntervalMs?: number);
    /**
     * Allow the proof of work to perform any initialization.
     * Will throw an exception if the implementation is not supported.
     */
    initialize(): Promise<void>;
    /**
     * Performs single conversion per pow call.
     * @returns True if pow only does one conversion.
     */
    performsSingle(): boolean;
    /**
     * Perform a proof of work on the data.
     * @param trunkTransaction The trunkTransaction to use for the pow.
     * @param branchTransaction The branchTransaction to use for the pow.
     * @param trytes The trytes to perform the pow on.
     * @param minWeightMagnitude The minimum weight magnitude.
     * @returns The trytes produced by the proof of work.
     */
    pow(trunkTransaction: Hash, branchTransaction: Hash, trytes: Trytes[], minWeightMagnitude: number): Promise<Trytes[]>;
}
