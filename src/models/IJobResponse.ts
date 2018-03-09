/**
 * Represents the response for pow box job command.
 * @interface
 */
export interface IJobResponse {
    /**
     * The id of the job.
     */
    jobId: string;

    /**
     * The date/time for job was updated.
     */
    updatedAt: string;

    /**
     * The date/time for job was created.
     */
    createdAt: string;

    /**
     * Was there an error for the job.
     */
    error: boolean;

    /**
     * The error message for the job.
     */
    errorMessage: string;

    /**
     * The progress for the job.
     */
    progress: string;

    /**
     * The response trytes that have has pow performed on them.
     */
    response: {
        trytes: string[];
    };
}
