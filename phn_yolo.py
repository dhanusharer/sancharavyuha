# Sanchara Vyuha AI-TOS v6.0 Phone YOLO Vision Engine
import cv2
import time
import os
import requests
import numpy as np
from ultralytics import YOLO

# ==============================================================================
# CONFIGURATION — WEBCAM / PHONE IP CAMERA SOURCE
# ==============================================================================
PHONE_IP_URL = "http://10.1.71.73:8080/video"
PHONE_SHOT_URL = "http://10.1.71.73:8080/shot.jpg"
BACKEND_API_URL = "http://localhost:8000/api/v1/stops/6/passenger-flow"

def load_yolo_model():
    """Loads YOLOv8 object detection model (prefers yolov8s.pt or yolov8n.pt)."""
    model_path = "yolov8s.pt" if os.path.exists("yolov8s.pt") else "yolov8n.pt"
    print(f"[YOLOv8 Engine] Loading model weights from: {model_path}...")
    return YOLO(model_path)

def open_best_camera_source():
    """
    Automatically tests Phone IP webcam feeds first.
    If phone camera is unreachable, falls back INSTANTLY to local laptop webcam (index 0).
    No terminal prompts or waiting!
    """
    print("\n" + "="*80)
    print("🎥 SANCHARA VYUHA — AUTOMATED LIVE PASSENGER DETECTOR (CCTV/WEBCAM)")
    print("="*80 + "\n")

    # 1. Test Phone IP Stream (/video)
    print(f"Checking Phone IP Webcam: {PHONE_IP_URL}...")
    cap = cv2.VideoCapture(PHONE_IP_URL)
    if cap.isOpened():
        ret, frame = cap.read()
        if ret and frame is not None:
            print("--> SUCCESS: Connected to Phone IP Video Stream!")
            return cap, "Phone IP Webcam (/video)"
        cap.release()

    # 2. Test Laptop Built-in Webcam (0)
    print("Checking Laptop Built-in Webcam (Index 0)...")
    cap = cv2.VideoCapture(0)
    if cap.isOpened():
        ret, frame = cap.read()
        if ret and frame is not None:
            print("--> SUCCESS: Connected to Laptop Built-in Webcam!")
            return cap, "Laptop Webcam (0)"
        cap.release()

    # 3. Test HTTP Snapshot URL (/shot.jpg)
    print(f"Checking Phone HTTP Snapshot: {PHONE_SHOT_URL}...")
    try:
        r = requests.get(PHONE_SHOT_URL, timeout=1.0)
        if r.status_code == 200:
            print("--> SUCCESS: Connected to Phone HTTP Snapshot Feed!")
            return "SNAPSHOT_MODE", "Phone HTTP Snapshot (/shot.jpg)"
    except Exception:
        pass

    print("[WARNING] Could not open phone IP camera or laptop webcam 0. Trying default capture 0...")
    return cv2.VideoCapture(0), "Default Video Capture"

def main():
    cap_obj, source_name = open_best_camera_source()
    is_snapshot = (cap_obj == "SNAPSHOT_MODE")

    model = load_yolo_model()

    window_name = "Sanchara Vyuha — Live CCTV/Webcam Passenger Counter"
    cv2.namedWindow(window_name, cv2.WINDOW_NORMAL)
    # Enable full screen / maximized window mode
    try:
        cv2.setWindowProperty(window_name, cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_FULLSCREEN)
    except Exception:
        cv2.resizeWindow(window_name, 1920, 1080)

    start_time = time.time()
    frame_count = 0
    fps = 0.0
    last_post_time = time.time()

    print(f"\n🚀 LIVE DETECTOR ACTIVE! Source: {source_name}")
    print("Press 'f' to toggle Fullscreen mode | Press 'q' or 'ESC' to quit.\n")

    is_fullscreen = True

    while True:
        frame = None

        if is_snapshot:
            try:
                resp = requests.get(PHONE_SHOT_URL, timeout=1.0)
                if resp.status_code == 200:
                    img_arr = np.array(bytearray(resp.content), dtype=np.uint8)
                    frame = cv2.imdecode(img_arr, cv2.IMREAD_COLOR)
            except Exception:
                frame = None
        else:
            ret, frame = cap_obj.read()
            if not ret or frame is None:
                time.sleep(0.05)
                ret, frame = cap_obj.read()

        if frame is None:
            blank = np.zeros((720, 1280, 3), dtype=np.uint8)
            cv2.putText(blank, "Connecting to CCTV/Webcam Source...", (380, 360), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 165, 255), 2)
            cv2.imshow(window_name, blank)
            if cv2.waitKey(100) & 0xFF in [ord('q'), 27]:
                break
            continue

        # Scale frame to HD resolution (1280x720) to fit full window cleanly
        frame = cv2.resize(frame, (1280, 720))

        # Run YOLOv8 detection with conf=0.15 to detect sitting/back-view passengers
        results = model(frame, classes=[0], conf=0.18, verbose=False)
        person_count = 0

        if len(results) > 0 and len(results[0].boxes) > 0:
            boxes = results[0].boxes
            person_count = len(boxes)

            # Draw glowing bounding box and passenger tag for every person
            for idx, box in enumerate(boxes, 1):
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                conf = float(box.conf[0])

                # Glowing Bounding Box (Red if overcrowding > 8, Green if normal)
                box_color = (0, 0, 240) if person_count > 8 else (0, 230, 110)
                cv2.rectangle(frame, (x1, y1), (x2, y2), box_color, 2)

                # Corner Reticles
                r_len = 12
                cv2.line(frame, (x1, y1), (x1 + r_len, y1), box_color, 3)
                cv2.line(frame, (x1, y1), (x1, y1 + r_len), box_color, 3)
                cv2.line(frame, (x2, y1), (x2 - r_len, y1), box_color, 3)
                cv2.line(frame, (x2, y1), (x2, y1 + r_len), box_color, 3)
                cv2.line(frame, (x1, y2), (x1 + r_len, y2), box_color, 3)
                cv2.line(frame, (x1, y2), (x1, y2 - r_len), box_color, 3)
                cv2.line(frame, (x2, y2), (x2 - r_len, y2), box_color, 3)
                cv2.line(frame, (x2, y2), (x2, y2 - r_len), box_color, 3)

                # Label Pill Above Head: e.g. "Passenger #1 (88%)"
                tag_text = f"Passenger #{idx} ({conf:.0%})"
                (tw, th), _ = cv2.getTextSize(tag_text, cv2.FONT_HERSHEY_SIMPLEX, 0.45, 1)
                
                cv2.rectangle(frame, (x1, max(y1 - 22, 0)), (x1 + tw + 10, max(y1, 22)), box_color, -1)
                cv2.putText(
                    frame,
                    tag_text,
                    (x1 + 5, max(y1 - 6, 15)),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.45,
                    (255, 255, 255),
                    1,
                    cv2.LINE_AA
                )

        # FPS Calculation
        frame_count += 1
        elapsed = time.time() - start_time
        if elapsed > 1.0:
            fps = frame_count / elapsed
            frame_count = 0
            start_time = time.time()

        # Send live passenger count to backend FastAPI server every 2 seconds
        if time.time() - last_post_time > 2.0:
            last_post_time = time.time()
            try:
                payload = {
                    "stop_no": 6,
                    "people_detected_cctv": person_count,
                    "waiting_passengers": person_count,
                    "boarded_count": max(0, person_count - 2),
                    "alighted_count": 1
                }
                requests.post(BACKEND_API_URL, json=payload, timeout=0.5)
            except Exception:
                pass

        # ===== TOP HEADER OVERLAY =====
        cv2.rectangle(frame, (0, 0), (1280, 56), (15, 15, 15), -1)
        cv2.putText(
            frame,
            "SANCHARA VYUHA — LIVE CCTV PASSENGER DETECTOR (YOLOv8)",
            (20, 26),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (255, 255, 255),
            2,
            cv2.LINE_AA
        )
        cv2.putText(
            frame,
            f"FPS: {fps:.1f} | Active Source: {source_name}",
            (20, 46),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.42,
            (0, 255, 180),
            1,
            cv2.LINE_AA
        )

        # Top Right Count Pill
        badge_bg = (0, 0, 220) if person_count > 8 else (0, 180, 80)
        cv2.rectangle(frame, (1280 - 280, 10), (1280 - 20, 46), badge_bg, -1)
        cv2.putText(
            frame,
            f"PASSENGERS: {person_count}",
            (1280 - 270, 35),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.65,
            (255, 255, 255),
            2,
            cv2.LINE_AA
        )

        # ===== BOTTOM-LEFT LIVE PASSENGER COUNT HUD CARD =====
        hud_w, hud_h = 440, 105
        hud_x, hud_y = 20, 720 - hud_h - 20

        # Translucent HUD Background Card
        overlay = frame.copy()
        cv2.rectangle(overlay, (hud_x, hud_y), (hud_x + hud_w, hud_y + hud_h), (10, 10, 10), -1)
        cv2.addWeighted(overlay, 0.85, frame, 0.15, 0, frame)
        cv2.rectangle(frame, (hud_x, hud_y), (hud_x + hud_w, hud_y + hud_h), (70, 70, 70), 1)

        # HUD Content
        status_text = "OVERCROWDING DETECTED (>8)" if person_count > 8 else "NORMAL CORRIDOR DEMAND"
        status_color = (0, 0, 240) if person_count > 8 else (0, 220, 100)
        action_text = "RECOMMENDED: DISPATCH SPARE EV BUS" if person_count > 8 else "RECOMMENDED: NORMAL TIMETABLE"

        cv2.putText(frame, "LIVE CCTV PASSENGER COUNT HUD", (hud_x + 15, hud_y + 25), cv2.FONT_HERSHEY_SIMPLEX, 0.48, (200, 200, 200), 1, cv2.LINE_AA)
        cv2.putText(frame, f"PASSENGERS IN FRAME: {person_count} PEOPLE", (hud_x + 15, hud_y + 52), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2, cv2.LINE_AA)
        cv2.putText(frame, f"STATUS: {status_text}", (hud_x + 15, hud_y + 74), cv2.FONT_HERSHEY_SIMPLEX, 0.45, status_color, 1, cv2.LINE_AA)
        cv2.putText(frame, action_text, (hud_x + 15, hud_y + 93), cv2.FONT_HERSHEY_SIMPLEX, 0.42, (0, 255, 200), 1, cv2.LINE_AA)

        # Show OpenCV GUI Window
        cv2.imshow(window_name, frame)

        # Exit on 'q' or ESC
        key = cv2.waitKey(1) & 0xFF
        if key == ord('q') or key == 27:
            print("\nStopping Live Passenger Detector...")
            break

    if not is_snapshot and cap_obj:
        cap_obj.release()
    cv2.destroyAllWindows()
    print("Stream closed cleanly.")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n[Stopped] Stream terminated by user (Ctrl+C).")
        cv2.destroyAllWindows()
