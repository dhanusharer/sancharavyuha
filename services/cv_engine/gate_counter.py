class VirtualGateCounter:
    """Virtual Polyline Gate for counting passenger boarding vs. alighting crossing vectors"""
    def __init__(self, line_y=200):
        self.line_y = line_y
        self.previous_positions = {}  # tid: cy
        self.boarded_count = 0
        self.alighted_count = 0

    def process_frame_tracks(self, tracked_objects):
        """
        tracked_objects: list of (tid, x1, y1, x2, y2)
        """
        current_boarded = 0
        current_alighted = 0

        for tid, x1, y1, x2, y2 in tracked_objects:
            cy = (y1 + y2) // 2

            if tid in self.previous_positions:
                prev_y = self.previous_positions[tid]

                # Crossing line downwards (e.g. entering bus / boarding)
                if prev_y < self.line_y and cy >= self.line_y:
                    self.boarded_count += 1
                    current_boarded += 1

                # Crossing line upwards (e.g. leaving bus / alighting)
                elif prev_y >= self.line_y and cy < self.line_y:
                    self.alighted_count += 1
                    current_alighted += 1

            self.previous_positions[tid] = cy

        return {
            "total_boarded": self.boarded_count,
            "total_alighted": self.alighted_count,
            "frame_boarded": current_boarded,
            "frame_alighted": current_alighted
        }
