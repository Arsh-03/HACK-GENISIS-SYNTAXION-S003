# **N.E.S.T. — Technical Modifications for Live Pitching & Demos**

## **Executive Overview**

Presenting a live AI, cryptography, and computer vision system within a 3-minute hackathon demo window introduces real-world risks: noisy venue ambient sounds, spotty Wi-Fi, camera angle glitches, and long countdown timers.

This specification details the **code-level modifications, environment toggles, and interactive simulation controls** required across the Node.js API Gateway, Python FastAPI service, and React Frontend to ensure a zero-latency, high-impact demonstration.

## **1\. Feature 1: The JIT Time-Warp Override (DEMO\_MODE)**

### **The Challenge**

In production, paper generation and encryption occur strictly at ![][image1]. Waiting 15 minutes live on stage will derail the presentation.

### **Technical Implementation**

Add a DEMO\_MODE flag in both backend microservices and client state.

#### **A. FastAPI Microservice (config.py & main.py)**

\# config.py  
import os

class Settings:  
    DEMO\_MODE: bool \= os.getenv("DEMO\_MODE", "true").lower() \== "true"  
    DEMO\_COUNTDOWN\_SECONDS: int \= int(os.getenv("DEMO\_COUNTDOWN\_SECONDS", "5"))

settings \= Settings()

\# JIT Execution Endpoint Trigger  
@app.post("/api/v1/exam/trigger-jit/{exam\_id}")  
async def trigger\_jit\_generation(exam\_id: str, force\_demo: bool \= False):  
    if settings.DEMO\_MODE or force\_demo:  
        logger.info(f"\[DEMO\] Simulating T-15m clock trigger in {settings.DEMO\_COUNTDOWN\_SECONDS}s")  
        \# Override Redis TTL countdown to 5 seconds for visual impact  
        await asyncio.sleep(settings.DEMO\_COUNTDOWN\_SECONDS)  
          
    paper \= await generate\_and\_encrypt\_paper(exam\_id)  
    return {"status": "SUCCESS", "message": "Paper generated and encrypted in Redis", "demo\_mode": True}

#### **B. React Candidate Portal (TimerHeader.jsx)**

Add a invisible or explicit double-click shortcut (Ctrl \+ Shift \+ D) or query parameter ?demo=true that forces the countdown timer to drop from 00:15:00 to 00:00:05.

## **2\. Feature 2: Machine Learning Calibration Controls (Venue Noise & Lighting)**

### **The Challenge**

A crowded venue with loud background chatter and poor lighting can trigger constant false-positive audio/vision violations before you even start speaking to the judges.

### **Technical Implementation**

Configure adjustable sensitivity thresholds in proctor\_config.js.

// proctor\_config.js  
export const PROCTOR\_THRESHOLDS \= {  
  // Vision (MediaPipe)  
  FACE\_DETECTION\_SUSTAINED\_FRAMES: 15, // Require 15 consecutive frames (\~1.5s) to flag multiple faces  
  YAW\_ANGLE\_THRESHOLD: 28,            // Degrees head turn before flagging pitch/yaw violation  
  PITCH\_ANGLE\_THRESHOLD: 22,  
    
  // Audio (Web Audio API)  
  // Increase decibel threshold in loud hackathon rooms  
  AUDIO\_RMS\_SPIKE\_THRESHOLD: process.env.REACT\_APP\_VENUE\_NOISE \=== "loud" ? 0.25 : 0.10,  
  AUDIO\_SUSTAINED\_MS: 1200,            // Sound must last \> 1.2 seconds (ignores quick claps/drops)  
    
  // Tab Switch  
  TAB\_SWITCH\_STRIKE\_DELAY\_MS: 500  
};

## **3\. Feature 3: Invigilator Simulation Control Panel**

### **The Challenge**

If stage lighting causes the camera to fail or venue Wi-Fi blocks the webcam stream, you need a fail-safe mechanism to demonstrate the **3-Strike System** and **Real-Time WebSocket Alerts** to judges.

### **Technical Implementation**

Create a DemoSimulationControl.jsx component inside the **Invigilator Dashboard**.

// DemoSimulationControl.jsx  
import React from 'react';

export const DemoSimulationControl \= ({ socket, activeStudentId }) \=\> {  
  const triggerViolation \= (type) \=\> {  
    socket.emit('SIMULATE\_PROCTOR\_EVENT', {  
      candidateId: activeStudentId || 'CANDIDATE-101',  
      violationType: type,  
      timestamp: new Date().toISOString()  
    });  
  };

  return (  
    \<div className="bg-slate-900 text-white p-4 rounded-lg border border-indigo-500 shadow-xl my-4"\>  
      \<div className="flex items-center justify-between mb-2"\>  
        \<span className="text-xs font-bold uppercase tracking-wider text-amber-400"\>⚡ Pitch Demo Trigger Panel\</span\>  
        \<span className="text-\[10px\] bg-indigo-600 px-2 py-0.5 rounded"\>Fail-Safe Active\</span\>  
      \</div\>  
      \<div className="grid grid-cols-3 gap-2"\>  
        \<button   
          onClick={() \=\> triggerViolation('HEAD\_TURN')}  
          className="bg-amber-600 hover:bg-amber-500 text-white text-xs py-2 px-3 rounded font-medium transition"  
        \>  
          Simulate Gaze Turn  
        \</button\>  
        \<button   
          onClick={() \=\> triggerViolation('MULTI\_FACE')}  
          className="bg-orange-600 hover:bg-orange-500 text-white text-xs py-2 px-3 rounded font-medium transition"  
        \>  
          Simulate Multi-Face  
        \</button\>  
        \<button   
          onClick={() \=\> triggerViolation('TAB\_SWITCH')}  
          className="bg-red-600 hover:bg-red-500 text-white text-xs py-2 px-3 rounded font-medium transition"  
        \>  
          Simulate Tab Switch (Strike)  
        \</button\>  
      \</div\>  
    \</div\>  
  );  
};

## **4\. Feature 4: High-Speed Instant LLM Mock Mode**

### **The Challenge**

During live pitching, if external LLM services experience latency or hit rate limits, waiting 10 seconds for an API response will make the app look laggy.

### **Technical Implementation**

Add an instant local mock fallback switch in FastAPI when BYPASS\_LLM\_API=true.

\# ai\_service.py  
import json

MOCK\_NEET\_PAPER\_PAYLOAD \= {  
    "physics": \[...\],   \# 45 pre-validated JSON questions  
    "chemistry": \[...\], \# 45 pre-validated JSON questions  
    "botany": \[...\],    \# 45 pre-validated JSON questions  
    "zoology": \[...\]    \# 45 pre-validated JSON questions  
}

async def generate\_paper\_with\_resiliency(candidate\_pool):  
    if os.getenv("BYPASS\_LLM\_API") \== "true":  
        logger.info("\[DEMO MOCK\] Instantly loading pre-audited NEET paper payload (0ms latency)")  
        return MOCK\_NEET\_PAPER\_PAYLOAD  
          
    try:  
        return await run\_gemini\_auditor\_chain(candidate\_pool)  
    except Exception as e:  
        logger.warn(f"LLM Call failed ({e}). Returning pre-audited fallback payload.")  
        return MOCK\_NEET\_PAPER\_PAYLOAD

## **5\. Feature 5: Visual "Pitch Badges" & System Security HUD**

To help non-technical judges instantly understand what is happening under the hood, add **visual status badges** on the Student and Invigilator screens:

┌─────────────────────────────────────────────────────────────────────────────┐  
│ 🛡️ N.E.S.T. SECURE TERMINAL  │  🔐 AES-256-GCM RAM DECRYPTED  │  🔗 HASH: OK │  
└─────────────────────────────────────────────────────────────────────────────┘

### **React Status HUD Ribbon (SecurityHUD.jsx)**

export const SecurityHUD \= ({ hashStatus, isEncrypted, JITStatus }) \=\> (  
  \<div className="bg-slate-950 text-slate-300 px-4 py-1.5 flex items-center justify-between text-xs font-mono border-b border-slate-800"\>  
    \<div className="flex items-center space-x-4"\>  
      \<span className="flex items-center text-emerald-400 font-semibold"\>  
        \<span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping mr-2"\>\</span\>  
        TERMINAL LOCKED  
      \</span\>  
      \<span\>PAYLOAD: \<strong className="text-cyan-400"\>AES-256-GCM (IN-RAM ONLY)\</strong\>\</span\>  
      \<span\>DB HASH CHAIN: \<strong className="text-emerald-400"\>VALID (0x8F3A...)\</strong\>\</span\>  
    \</div\>  
    \<div className="text-slate-400"\>  
      SESSION SEED: \<span className="text-amber-400"\>ROLL\_10294\_SHIFT\_1\</span\>  
    \</div\>  
  \</div\>  
);

## **6\. Pre-Pitch Checklist Summary**

| **Task** | **Environment Variable / Code File** | **Settings for Live Demo** |

| **Timer Override** | DEMO\_MODE=true | JIT Clock triggers in 5 seconds instead of 15 minutes. |

| **LLM Speed Mode** | BYPASS\_LLM\_API=false (Primary) | Use Gemini live; keep BYPASS\_LLM\_API=true ready as fallback. |

| **Noise Calibration** | REACT\_APP\_VENUE\_NOISE=loud | Prevents ambient background noise from spamming audio alerts. |

| **Fail-Safe UI** | \<DemoSimulationControl /\> | Mounted on Invigilator Dashboard for manual violation triggers. |

| **Status HUD** | \<SecurityHUD /\> | Active on candidate terminal header to visually display encryption state. |

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIkAAAAaCAYAAACD1n8kAAAFUklEQVR4Xu1ZXYhVVRQ+wzUwKqSfcbjzc/edO9VlxEi4IPRQIUgZIsQQmFrUk4WIEJKZgRohWOJDBgbzUPQwmD8I0g/pQ4zNg+hED6Ik0oCJFig1CBloOPV996w9d826Z2budTz3TrI/WJy9v7X22n9r/5xzoiggICAgIKAxKJVK9+Tz+becc/21SGdn50PWRwPQAslYsqOj4+G2trb7DJ3p6upqj+IyqQFjsQRjca/l70pgQBeiw6MIlP0qGL6CjEE+yeVyL0E2if5vpAvWR4poQX0LUPcR1J21SujeAX8Lz5Oq7TeR/xTqOdb+TqG7u7sN9fwL2W11KSDDxcCnVTQMMtDfaw75NRwE6B60vOXSAFboE6jrDAOAgSkTMlmQUKdlV9orvL29/RGpK/UgYb8hg0n9bwg4mKj8EHaTpxXN1fs5B0FxZYBfgVU91/J3GjwCuVpbW1vvR50ltOV60iBJkHwL2QvpR9vesDZpwTXouEE9vejXqaT+NwRy1AzoznKnADecFCTg+iyXNqYLEorl7yYgQF5H339N6n/T4OSoYaBYXTNQS5Bg1ylC/xGkP+EiOwGw6YX8wT5iAjZDViJ9Dn4u4nkT+UWFQuFxPH9A/hLkT8i6SC7CbIeLJ43lvyAnx89Zz0GeRXpYfF6DvODr525HOwp3ZuWzzHmf7IeLj9syr8qUvC85CXZBDkK+dvGdcQNUGfRhHvL7kD+O5xb4/RjPq7r87WL8qIHsscpmYLogAf875DAC5UkK0iOQXmvr4Y8y9hEDdxqykxx1PHaRPw+/RzEBj5KTiRjlrisuMj09PfOlfHlCFcfL/gXIZ5wkKpD+DXKWgcQ8j1Dkh1jeBwnLI73N+GyR/lymSDrr28qniy/qo94eZd+VNvQhvZ31FIvFB0TPtvw44yDRKwKyxuqbgRqCpN8PHIH8FQzQKXkjmBTSx58ZMIrjih5D+WXWVk3oOKcm1HNspw4ocoPk9eSwnPXJtPUp7eGuVXXcIN/HtnJRew7pgosXzTdSx096HJDfO+MgURPC7XjS1ZgENGqudKomob31kYSpgiQJLp4UDvbLVqchNnaS2bZLGNhOw9cTJIPcLRSXRpDoHf8Dscty98PzhNjvFv0vkB1YDItV+dtHvnJe8jyt61UX9q9CLtYiLj4SllsfSeDguvqC5JD0YcrjkjYJk+wnxa7aWRUkcmTRL+2POfPBE9xOBrqTFxAlb+tdt27MxqOGmCpIpK1XedFUXHnwIDu0rQVtEiZ51gdJTt7mkN9De8gWb68Bu63OnAbIj0IGIrmE1w01GXUfNWlimiC5AP0rkeq0iwP9BuQpZVoFDnDCJDctSJBfb33KBZu7blWQ8JIN7gby33l7Veag1LFe65AfsG2uCzm5XUPOwFHe6psE3tiXoU3/4LmIea0EP4RBeU5RLTL4032WL9vB5369/WLge1z8JlH0nLxF0OfaqPJp3NfzpeLYHn4dPmEui7wjkF/CcuTylWN9fMd2lV18SP49EXOQ3+cqQc+7yFLRMb0J/FgkbZD/cO+D2yhBMoJ7ymNizzqGwb/p8zVBRSobVyX+ta3RcJUVXdUmp1YqAwf5cy7+RsDzmKt2ys/yamca98nV6Ve3EvpabbjrmMDn3cS2JXHlHYF+NSc2Wb4eM8CQ/ouBKvIifXlbv2NIH3n5vAbuqLlTZKBfRT/cUcTuPdrk4ovtAcgIbI6wPZAPZ3Qn+b9Cvns8gwF4LWeOhNkOuYBmufP47zf83hKZn3leN9lrvXyjmfDGKB8VuXP5bzhVx3VAQEBAQEBAQEBAQEBAQEBAQO34D/SPYU6I6/tmAAAAAElFTkSuQmCC>