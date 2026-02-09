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
