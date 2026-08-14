export declare class PriorityQueue<T> {
    private heap;
    enqueue(item: T, priority: number): void;
    dequeue(): T | undefined;
    isEmpty(): boolean;
    private bubbleUp;
    private sinkDown;
}
//# sourceMappingURL=PriorityQueue.d.ts.map