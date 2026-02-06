---
id: post-002
title: "OpenClaw Vulnerability Check - ver20260205"
author: "펭귄볼따구"
date: "2026-02-06"
tags: ["security", "openclaw", "ai-agent", "critical", "sql-injeciton", "xss", "typescript"]
description: "OpenClaw는 WhatsApp 게이트웨이와 Pi RPC 에이전트를 지원하는 TypeScript 기반 개인 AI 비서 모노레포로, 4,997개 파일과 33개 플러그인 확장(Matrix, Discord, Telegram 등)을 포함합니다.

주요 보안 위협으로는 Critical 등급의 eval() 기반 임의 코드 실행 취약점(STATIC-001)과 여러 Medium 등급의 XSS, SQL 인젝션 패턴, 그리고 민감 파일(fly.private.toml, .secrets.baseline)이 탐지되었습니다."
jsonFile: "report.json"
---

Read [](file:///Users/bosung.hong/sec/20260206-OpenClaw/scanreport-20260205-143022.json#80-80), lines 80 to 250

Read [](file:///Users/bosung.hong/sec/20260206-OpenClaw/scanreport-20260205-143022.json#250-250), lines 250 to 400

## 🔍 OpenClaw 보안 스캔 주요 발견사항

### 📊 프로젝트 개요
| 항목 | 값 |
|------|-----|
| **Repository** | OpenClaw - Personal AI Assistant |
| **스캔 일시** | 2026-02-05 14:30:22 UTC |
| **전체 파일** | 4,997개 (코드 파일 3,246개) |
| **주요 기술** | TypeScript, 33개 플러그인, 55개 스킬 |

---

### 🔴 Critical (1건)

| ID | 파일 | 이슈 |
|----|------|------|
| **STATIC-001** | `src/browser/pw-tools-core.interactions.ts:237` | **eval()을 통한 임의 코드 실행** - `new Function()` + `eval()`로 사용자 제공 코드 직접 실행. 입력 검증/샌드박싱 없음. |

---

### 🟠 High (5건)

| ID | 카테고리 | 패키지/파일 | 이슈 |
|----|----------|-------------|------|
| **VULN-001** | 취약점 | `@whiskeysockets/baileys@7.0.0-rc.9` | RC 버전 - WhatsApp 게이트웨이 핵심 라이브러리, 패치 메커니즘 없음 |
| **VULN-002** | 취약점 | `sqlite-vec@0.1.7-alpha.2` | Alpha 버전 - 벡터 DB 확장, 프로덕션 보안 테스트 미완료 |
| **VER-001** | 버전 위험 | 5개 패키지 | 다수의 pre-release 버전 사용 중 |
| **LIC-001** | 라이선스 | 112개 패키지 | Unknown 라이선스 - 컴플라이언스 추적 불가 |
| **SUPPLY-001** | 공급망 | `node-pty` 외 6개 | 네이티브 빌드 의존성 - 바이너리 타협 시 RCE 가능 |

---

### 🟡 Medium (7건)

| ID | 카테고리 | 파일/패키지 | 이슈 | 상태 |
|----|----------|-------------|------|------|
| **STATIC-002** | 코드 | `src/canvas-host/server.ts:113` | innerHTML을 통한 XSS 위험 | Mitigated |
| **STATIC-003** | 코드 | `src/memory/manager.ts:1712` | 동적 SQL 구성 (테이블명 인터폴레이션) | Mitigated |
| **STATIC-004** | 코드 | `src/canvas-host/server.ts:152` | 경로 탐색 위험 | Mitigated |
| **VULN-003** | 취약점 | `pdfjs-dist@5.4.624` | PDF DoS 취약점 히스토리 (CVE-2022-45866 등) | Mitigated |
| **VULN-004** | 취약점 | `playwright-core@1.58.1` | Pre-release 브라우저 자동화 | Confirmed |
| **VULN-005** | 취약점 | `json5@2.2.3` | Prototype Pollution (CVE-2022-46175) | Mitigated |
| **SENS-001** | 민감정보 | `src/gateway/client.test.ts` | RSA 개인키 (테스트용) | False Positive |

---

### 🟢 Low/Info (8건)

| ID | 카테고리 | 이슈 요약 |
|----|----------|-----------|
| STATIC-005 | 코드 | 타이밍 안전 비교에서 길이 정보 누출 |
| STATIC-006 | 코드 | 파일명용 SHA1 사용 (보안 무관) |
| STATIC-007 | 코드 | 환경변수로 API 키 접근 (표준 방식) |
| STATIC-008 | 코드 | Base64 디코딩 크기 제한 없음 |
| SENS-002~006 | 민감정보 | .env.example, 테스트 자격증명 등 (모두 False Positive) |
| VULN-006 | 취약점 | TypeScript dev 빌드 (빌드 타임 전용) |

---

### 📦 SBOM 요약

| 항목 | 값 |
|------|-----|
| **직접 의존성** | 95개 |
| **개발 의존성** | 21개 |
| **전이 의존성** | 154개 |
| **에코시스템** | npm (150), go (4) |
| **SBOM 파일** | ❌ 없음 |

---

### ⚡ 우선 조치 권장

1. **🔴 즉시** - `pw-tools-core.interactions.ts`의 eval() 제거 또는 샌드박스 적용
2. **🟠 1주 내** - Alpha/RC 패키지를 안정 버전으로 마이그레이션 계획 수립
3. **🟠 2주 내** - CycloneDX SBOM 생성을 CI 파이프라인에 추가
4. **🟡 1개월 내** - 112개 Unknown 라이선스 패키지 감사
