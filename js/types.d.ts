export interface Participant {
    id?: number;
    name?: string;
    vote: string | null;
    is_spectator: boolean;
    is_stale?: boolean;
}
export type VoteCount = [string, number];

export type LogEntry = { time: string } & (
    | { event: 'reveal'; data: { round: number; deck: string; votes: Array<string | null> } }
    | { event: 'set_deck'; data: { deck: string } }
    | { event: 'add_user'; data: { name: string; is_spectator: boolean } }
    | { event: 'clear'; data: Record<string, never> }
);
export type RevealLogEntry = Extract<LogEntry, { event: 'reveal' }>;

export interface Statistics {
    basic: Array<[string, number | string]>;
    decks: Array<Array<VoteCount>>;
}

export interface VotingStats {
    mean: number;
    stdDev: number;
    closest: string;
    isUnanimous: boolean;
}
