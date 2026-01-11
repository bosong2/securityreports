# Claude Threat Scan 사용 매뉴얼

## 개요

Claude AI를 활용하여 소스코드의 보안 취약점을 정적 분석하는 방법을 안내합니다. 이 도구는 OWASP 기반 취약점, 하드코딩된 시크릿, 의존성 보안 문제 등을 다단계 재귀 분석으로 탐지합니다.

---

## 사전 준비

| 항목 | 설명 |
|------|------|
| Claude 구독 | Claude Pro 또는 Team 플랜 필요 |
| 프롬프트 파일 | `claude_threat_scan_prompt_xxx.md` |
| 스키마 파일 | `claude-threat-scan-json-schema-xxx.md` |
| 분석 대상 | 소스코드 (zip 압축 권장, 30MB 이하, .git 등 제외) |

---

## 방법 1: Claude Desktop (Projects 기능 활용)

### Step 1. 프로젝트 생성

1. Claude Desktop 또는 claude.ai 접속
2. 좌측 사이드바에서 **"+ New Project"** 클릭
3. 프로젝트 이름 입력 (예: `Security Scanner`)

<!-- [스크린샷: 프로젝트 생성 화면] -->

### Step 2. Project Knowledge 설정

1. 프로젝트 설정에서 **"Add content"** 클릭
2. 다음 2개 파일 업로드:
   - `claude_threat_scan_prompt_v_2.md`
   - `claude-threat-scan-json-schema-v1.2.md`

<!-- [스크린샷: 파일 업로드 화면] -->

### Step 3. 프로젝트 지침(Instructions) 설정

프로젝트 Instructions 영역에 다음 내용 입력:

```
claude_threat_scan_prompt md 파일의 지침에 따라 개발된 프로젝트 파일의 
보안취약점을 분석해야됨. 레포트 생성 시 반드시 
claude-threat-scan-json-schema md 파일의 스키마 정의를 참고해야됨.
```

<!-- [스크린샷: Instructions 설정 화면] -->

### Step 4. 보안 스캔 실행

1. 생성한 프로젝트 열기
2. 분석할 소스코드를 **zip 파일로 압축**
3. 대화창에 zip 파일 첨부
4. 다음과 같이 요청:

```
첨부한 개발소스는 [서비스명]을 위해 [기술스택] 기반으로 작성한 코드입니다.
지정된 지침에 따라 보안검사를 진행하고 레포트를 형식에 맞게 출력해주세요.
```

**예시:**
```
첨부한 개발소스는 OAuth 토큰 발급 서비스를 위해 Next.js/TypeScript 기반으로 
작성한 코드입니다. 지정된 지침에 따라 보안검사를 진행하고 레포트를 형식에 
맞게 출력해주세요.
```

### Step 5. 결과 저장

1. Claude가 생성한 JSON 결과를 복사
2. 파일명 형식: `scanreport-YYYYMMDDhhmmss.json`
3. 로컬에 저장

---

## 방법 2: Claude Code활용

### Claude Code로 검사 예시

```bash
$ cd /myproejct/sourcedir

$ claude

# 스캐닝 프롬프트 지시
현재 폴더의 프로젝트는 XXXX 프로젝트로 XXXX 플랫폼 환경에서 구동하는 XXXX 기반으로 개발한 거야. @claude_threat_scan_prompt_xxx.md 지침에 따라 현재 프로젝트의 취약점을 스캔해줘. 결과는 @claude-threat-scan-json-schema-xxx.md 파일에 정의된 스키마 기준을 참고하여 출력해야되.
```

---

## 결과 확인

### Security Reports 뷰어 사용

1. Security Reports 웹사이트 접속해서 직접 드래그엔 드롭으로 레포트 결과 json 파일 업로드
2. **REPORTS** 탭 클릭 해서 JSON 파일 업로드
3. 시각화된 보안 리포트 확인 및 원하는 형식으로 다운받기

<!-- [스크린샷: 리포트 뷰어 화면] -->

---

## 분석 범위

Claude Threat Scan은 다음 영역을 분석합니다:

| 분석 영역 | 설명 |
|-----------|------|
| 정적 코드 분석 | OS 명령 실행, eval, 하드코딩 자격증명 |
| 바이너리 분석 | .pyc, .so, .dll 내 의심 패턴 |
| 민감정보 탐지 | API 키, 비밀번호, 인증서 |
| 의존성 보안 (SBOM) | CVE 취약점, 라이선스 호환성, 공급망 리스크 |
| 에이전트 정책 | 도구 권한 정책 검증 |

---

## Tips

- **대용량 프로젝트**: 핵심 비즈니스 로직 우선 분석, 필요시 모듈별 분할
- **node_modules 제외**: 의존성 폴더는 제외 후 압축 권장
- **정기 스캔**: 릴리즈 전 또는 주요 변경사항 반영 시 스캔 권장

---

## 문제 해결

| 문제 | 해결 방법 |
|------|-----------|
| 파일 용량 초과 | 핵심 파일만 선별, node_modules 제외 |
| JSON 형식 오류 | "JSON 형식으로 다시 포맷해주세요" 요청 |
| 불완전한 분석 | "나머지 분석을 계속해주세요" 요청 |

---

## 지원

문의 및 이슈 리포트:  
https://github.com/bosong2/securityreports/issues
