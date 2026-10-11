import math

class ByteTrackMonitor:
    """Persistent Multi-Object ID Tracker for CCTV crowd detection frames"""
    def __init__(self, max_dist=50, max_lost_frames=30):
        self.max_dist = max_dist
        self.max_lost_frames = max_lost_frames
        self.tracked_objects = {}  # id: (cx, cy)
        self.lost_frames = {}       # id: count
        self.next_id = 1

    def update(self, detections):
        """
        detections: list of bounding boxes [(x1, y1, x2, y2), ...]
        Returns: list of tracked objects [(id, x1, y1, x2, y2), ...]
        """
        centroids = []
        for det in detections:
            x1, y1, x2, y2 = det
            cx = (x1 + x2) // 2
            cy = (y1 + y2) // 2
            centroids.append((cx, cy, det))

        updated_tracked = {}
        result = []

        for cx, cy, det in centroids:
            min_dist = float('inf')
            matched_id = None

            for tid, (tcx, tcy) in self.tracked_objects.items():
                dist = math.hypot(cx - tcx, cy - tcy)
                if dist < min_dist and dist < self.max_dist:
                    min_dist = dist
                    matched_id = tid

            if matched_id is not None:
                updated_tracked[matched_id] = (cx, cy)
                self.lost_frames[matched_id] = 0
                result.append((matched_id, *det))
            else:
                new_id = self.next_id
                self.next_id += 1
                updated_tracked[new_id] = (cx, cy)
                self.lost_frames[new_id] = 0
                result.append((new_id, *det))

        # Handle lost objects
        for tid in list(self.tracked_objects.keys()):
            if tid not in updated_tracked:
                self.lost_frames[tid] = self.lost_frames.get(tid, 0) + 1
                if self.lost_frames[tid] <= self.max_lost_frames:
                    updated_tracked[tid] = self.tracked_objects[tid]

        self.tracked_objects = updated_tracked
        return result
