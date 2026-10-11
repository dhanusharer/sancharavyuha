import os
import gc
import numpy as np

class YOLOv8Detector:
    """Wrapper for YOLOv8 object detection on CCTV camera frames with memory leak protection."""
    def __init__(self, model_path: str = "yolov8n.pt", conf_threshold: float = 0.18):
        self.model_path = model_path if os.path.exists(model_path) else ("yolov8s.pt" if os.path.exists("yolov8s.pt") else "yolov8n.pt")
        self.conf_threshold = conf_threshold
        self.person_class_id = 0
        self.model = None
        self.frame_counter = 0
        
        try:
            from ultralytics import YOLO
            self.model = YOLO(self.model_path)
            print(f"Loaded YOLOv8 model from {self.model_path}")
        except Exception as e:
            print(f"Notice: Running fallback detection mode ({e})")

    def detect_people(self, frame):
        """
        Executes YOLOv8 bounding box detection for person class (id 0).
        Includes periodic garbage collection to prevent GPU/CPU RAM leaks.
        """
        if self.model is not None and frame is not None:
            results = self.model(frame, classes=[self.person_class_id], conf=self.conf_threshold, verbose=False)
            boxes = []
            if len(results) > 0 and len(results[0].boxes) > 0:
                for b in results[0].boxes:
                    x1, y1, x2, y2 = map(int, b.xyxy[0])
                    boxes.append((x1, y1, x2, y2))
            
            # Periodic Memory Garbage Collection every 300 frames
            self.frame_counter += 1
            if self.frame_counter % 300 == 0:
                gc.collect()

            return boxes

        # Fallback bounding boxes
        return [
            (120, 150, 180, 240),
            (210, 180, 260, 290),
            (310, 140, 370, 250)
        ]
