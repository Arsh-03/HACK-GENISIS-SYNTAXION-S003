# NEST CBT - Examination Portal
# NEST CBT - Examination Portal

## Project Purpose

This application is the Examination Portal of the National AI Examination Platform.

It serves two different user roles:
# Role Behaviour

Candidate users should only have access to:

- Dashboard
- Instructions
- Verification
- System Check
- Waiting Room
- Examination
- Review
- Results

Invigilator users should only have access to:

- Dashboard
- Live Monitoring
- Candidate Grid
- Seat Map
- Alerts
- Incident Timeline
- Messaging
- Session Controls

Role permissions must be enforced by routing.

Candidate users must never access Invigilator pages.

Invigilator users must never access Candidate examination pages.

### Candidate

The Candidate Portal is responsible for the complete examination journey.

Workflow:

Login

↓

Instructions

↓

Identity Verification

↓

System Readiness Check

↓

Waiting Room

↓

Live Examination

↓

Review Answers

↓

Submit

↓

Result

---

### Invigilator

The Invigilator Portal is responsible for monitoring and managing live examination sessions.

Workflow:

Login

↓

Invigilator Dashboard

↓

Live Candidate Monitoring

↓

Interactive Seat Map

↓

Alert Center

↓

Incident Management

↓

Messaging

↓

Session Control

---

After authentication, users should automatically be redirected according to their role.

Candidate → Candidate Dashboard

Invigilator → Invigilator Dashboard

The user should never manually choose a role after login.

## Project Purpose

This application is used by:

Candidates

Invigilators

This application must remain distraction-free.

The interface must prioritize examination experience over administration.

---

# Design Language

Minimal

Focused

Clean

Professional

High readability

Low cognitive load

---

# UI Inspiration

NTA CBT

Pearson VUE

Prometric

Microsoft Certification Exams

PSI Exams

---

# Principles

No unnecessary UI.

No visual clutter.

Large readable typography.

Simple navigation.

Fast interactions.

---

# Candidate Journey

Login

↓

Instructions

↓

Identity Verification

↓

System Check

↓

Waiting Room

↓

Exam

↓

Review

↓

Submit

↓

Result

Never skip steps.

---

# Invigilator Journey

Login

↓

Dashboard

↓

Live Monitoring

↓

Seat Map

↓

Alerts

↓

Incidents

↓

Session Control

---

# White Spacing

Large spacing.

Cards

24px

Sections

32px

Forms

20px

Buttons

16px

---

# Candidate Interface

Keep distractions minimal.

Always show:

Timer

Question

Question Palette

Navigation

Progress

Nothing else.

---

# Question Layout

Question

↓

Image (optional)

↓

Options

↓

Navigation

Maintain consistent spacing.

---

# Question Palette

Use standard colors:

Answered

Green

Marked

Purple

Current

Blue

Unanswered

Gray

Never invent new colors.

---

# Invigilator Dashboard

Should resemble a monitoring center.

Display:

Candidate Grid

Seat Map

Alerts

Incident Timeline

Quick Actions

System Status

---

# Colors

Primary

Blue

Success

Green

Warning

Orange

Critical

Red

Background

White

Cards

White

---

# Forms

Minimal

Simple

Accessible

Readable

---

# Animations

Very subtle.

Fade

Slide

No flashy effects.

---

# Mock Data

Always use realistic candidate information.

Never use generic placeholders.

---

# Component Rules

Reuse:

Buttons

Cards

Dialogs

Question Cards

Status Badges

Progress Bars

Tables

Never duplicate components.

---

# AI Agent Rules

Before implementing any feature:

1. Analyze the project.

2. Never redesign.

3. Reuse components.

4. Maintain examination-focused UI.

5. Follow this SKILLS.md.

6. Prioritize usability.

7. Keep the examination flow smooth.

# Design Philosophy

Although this portal serves two different user roles, both interfaces must share the same design language.

Candidate Interface

- Minimal
- Calm
- Distraction-free
- Focus on readability
- Large whitespace
- Simple navigation

Invigilator Interface

- Information-rich
- Monitoring-focused
- Real-time status indicators
- Quick actions
- Professional control room appearance

Both interfaces must:

- Use the same color palette
- Use the same typography
- Reuse shared UI components
- Maintain consistent spacing