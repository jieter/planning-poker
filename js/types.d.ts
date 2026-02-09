export interface Participant {
    id?: number;
    name?: string;
    vote: string | null;
    is_spectator: boolean;
}
export type VoteCount = [string, number];

export interface LogEntry {
    time: string;
    event: string;
    data: any;
}

export interface VotingStats {
    mean: number;
    median: any;
    stdDev: number;
    closest: string;
    isUnanimous: boolean;
}
