// Minimal binary min-heap priority queue for numbers or objects with numeric key
export class MinHeap<T> {
  private heap: T[] = [];
  private getKey: (item: T) => number;

  constructor(getKey: (item: T) => number) {
    this.getKey = getKey;
  }

  size() { return this.heap.length; }

  push(item: T) {
    this.heap.push(item);
    this.bubbleUp(this.heap.length - 1);
  }

  pop(): T | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.bubbleDown(0);
    }
    return top;
  }

  private bubbleUp(idx: number) {
    while (idx > 0) {
      const parent = Math.floor((idx - 1) / 2);
      if (this.getKey(this.heap[idx]) < this.getKey(this.heap[parent])) {
        [this.heap[idx], this.heap[parent]] = [this.heap[parent], this.heap[idx]];
        idx = parent;
      } else break;
    }
  }

  private bubbleDown(idx: number) {
    const n = this.heap.length;
    while (true) {
      let left = idx * 2 + 1;
      let right = idx * 2 + 2;
      let smallest = idx;
      if (left < n && this.getKey(this.heap[left]) < this.getKey(this.heap[smallest])) smallest = left;
      if (right < n && this.getKey(this.heap[right]) < this.getKey(this.heap[smallest])) smallest = right;
      if (smallest !== idx) {
        [this.heap[idx], this.heap[smallest]] = [this.heap[smallest], this.heap[idx]];
        idx = smallest;
      } else break;
    }
  }
}
