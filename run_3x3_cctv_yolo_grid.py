# Sanchara Vyuha AI-TOS v6.0 3x3 CCTV Grid Engine
import cv2
import numpy as np
import os
import time
from ultralytics import YOLO

# 1. Define Stop Names for 9 CCTV Cameras
STOP_NAMES = [
    "Stop 1: Majestic Bus Station",
    "Stop 2: K.R. Market Junction",
    "Stop 3: Corporation Circle",
    "Stop 4: Shanthinagar TTMC",
    "Stop 5: Nimhans Hospital",
    "Stop 6: Dairy Circle",
    "Stop 7: Gurappanapalya",
    "Stop 8: Silk Board Junction",
    "Stop 9: Electronic City Ph 1"
]

# 2. Locate 9 CCTV Video Paths
CCTV_DIR = "cctv"
VIDEO_FILES = [
    "busstop_1.MOV",
    "busstop_2.MOV",
    "busstop_3.MOV",
    "busstop_4.mp4",
    "busstop_5.mp4",
    "busstop_6.mp4",
    "busstop_7.mp4",
    "busstop_8.mp4",
    "busstop_9.mp4"
]

def load_yolo_model():
    """Load YOLOv8 model for person detection."""
    model_path = "yolov8n.pt" if os.path.exists("yolov8n.pt") else "yolov8s.pt"
    print(f"Loading YOLOv8 model weights from: {model_path}...")
    model = YOLO(model_path)
    return model

def main():
    model = load_yolo_model()

    # Open Video Captures for 9 Streams
    caps = []
    video_paths = []
    for f in VIDEO_FILES:
        path = os.path.join(CCTV_DIR, f)
        video_paths.append(path)
        cap = cv2.VideoCapture(path)
        if not cap.isOpened():
            print(f"Warning: Unable to open {path}")
        caps.append(cap)

    print("\n" + "="*80)
    print("🚀 SANCHARA VYUHA — 3x3 MULTI-CAMERA CCTV PASSENGER DETECTION GRID")
    print("Press 'q' or 'ESC' on the video window to quit.")
    print("="*80 + "\n")

    # Target Cell Size for 3x3 Grid (480x270 per video cell -> 1440x810 grid + header)
    CELL_W = 480
    CELL_H = 270
    HEADER_H = 60

    window_name = "Sanchara Vyuha — 3x3 CCTV Bus Stop Passenger Intelligence Grid"
    cv2.namedWindow(window_name, cv2.WINDOW_NORMAL)
    cv2.resizeWindow(window_name, CELL_W * 3, CELL_H * 3 + HEADER_H)

    start_time = time.time()
    frame_count = 0
    fps = 0.0

    while True:
        loop_start = time.time()
        cell_frames = []
        stop_counts = []

        for i, cap in enumerate(caps):
            ret, frame = cap.read()
            # If video ends, loop back to start
            if not ret or frame is None:
                cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                ret, frame = cap.read()

            if not ret or frame is None:
                # Black fallback frame if video fails
                frame = np.zeros((CELL_H, CELL_W, 3), dtype=np.uint8)
                count = 0
            else:
                # Run YOLOv8 detection for person class (class id 0)
                results = model(frame, classes=[0], conf=0.35, verbose=False)
                count = len(results[0].boxes) if len(results) > 0 else 0

                # Draw YOLO Bounding Boxes
                if len(results) > 0 and len(results[0].boxes) > 0:
                    for box in results[0].boxes:
                        x1, y1, x2, y2 = map(int, box.xyxy[0])
                        conf = float(box.conf[0])
                        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 120), 2)

                # Resize to uniform cell dimensions
                frame = cv2.resize(frame, (CELL_W, CELL_H))

            # Overlay Stop Label & Passenger Count Badge
            stop_name = STOP_NAMES[i]
            stop_counts.append(count)

            # Draw Translucent Banner at top of each cell
            overlay = frame.copy()
            cv2.rectangle(overlay, (0, 0), (CELL_W, 36), (15, 15, 15), -1)
            cv2.addWeighted(overlay, 0.75, frame, 0.25, 0, frame)

            # Stop Label Text
            cv2.putText(frame, stop_name, (10, 22), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1, cv2.LINE_AA)

            # Count Pill (Red if >15, Green otherwise)
            badge_color = (0, 0, 230) if count > 15 else (0, 180, 80)
            cv2.rectangle(frame, (CELL_W - 120, 4), (CELL_W - 8, 30), badge_color, -1)
            cv2.putText(frame, f"Pax: {count}", (CELL_W - 110, 22), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)

            cell_frames.append(frame)

        # Assemble 3x3 Grid
        row1 = np.hstack(cell_frames[0:3])
        row2 = np.hstack(cell_frames[3:6])
        row3 = np.hstack(cell_frames[6:9])
        grid_body = np.vstack([row1, row2, row3])

        # Top Header Banner
        header = np.zeros((HEADER_H, CELL_W * 3, 3), dtype=np.uint8)
        header[:] = (20, 20, 20)
        
        # Calculate Total Passenger Count across all 9 CCTV streams
        total_passengers = sum(stop_counts)

        # FPS calculation
        frame_count += 1
        elapsed = time.time() - start_time
        if elapsed > 1.0:
            fps = frame_count / elapsed
            frame_count = 0
            start_time = time.time()

        # Header Text
        cv2.putText(header, "SANCHARA VYUHA — 3x3 CCTV MULTI-CAMERA PASSENGER DETECTION GRID", (15, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (255, 255, 255), 2, cv2.LINE_AA)
        cv2.putText(header, f"Total Waiting Passengers: {total_passengers} pax | YOLOv8 FPS: {fps:.1f} | Active Cameras: 9/9", (15, 48), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 180), 1, cv2.LINE_AA)

        # Combine Header + 3x3 Grid Body
        full_display = np.vstack([header, grid_body])

        # Render OpenCV GUI Window
        cv2.imshow(window_name, full_display)

        # Exit on 'q' or ESC key press
        key = cv2.waitKey(1) & 0xFF
        if key == ord('q') or key == 27:
            print("\nStopping 3x3 CCTV Grid Stream...")
            break

    # Clean up
    for cap in caps:
        cap.release()
    cv2.destroyAllWindows()
    print("Done.")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n[Stopped] 3x3 CCTV Grid Stream terminated by user (Ctrl+C).")
        cv2.destroyAllWindows()
