/**
 * Represents the request for pow box attach to tangle command.
 * @interface
 */
export interface IAttachToTangleRequest {
    /** The command to send */
    command: string;
    /**
     * Trunk transaction to approve.
     */
    trunkTransaction: string;
    /**
     * Branch transaction to approve.
     */
    branchTransaction: string;
    /**
     * Proof of Work intensity. Minimum value is 18
     */
    minWeightMagnitude: number;
    /**
     * List of trytes (raw transaction data) to attach to the tangle.
     */
    trytes: string[];
}
