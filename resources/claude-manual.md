# How to Use Claude for Security Scanning

## Overview

Claude AI를 사용하여 프로젝트의 보안 취약점을 스캔하는 방법을 안내합니다.

## Prerequisites

- Claude Pro 또는 API 구독
- 분석할 프로젝트 코드베이스
- Security Reports 프롬프트 템플릿

## Step-by-Step Guide

### 1. 프롬프트 다운로드

Security Reports 웹사이트에서 Claude용 보안 스캔 프롬프트를 다운로드합니다.

### 2. Claude Projects 설정

1. Claude 웹 인터페이스 또는 API 접속
2. 새 Project 생성 (또는 기존 프로젝트 선택)
3. Project Knowledge에 다운로드한 프롬프트 파일 업로드

### 3. 프로젝트 코드 업로드

분석할 프로젝트의 소스 코드를 Claude에 업로드합니다:

```
- 주요 소스 파일 (.js, .py, .java 등)
- 설정 파일 (package.json, requirements.txt 등)
- 환경 설정 (.env.example, config 파일 등)
```

### 4. 스캔 실행

프롬프트 지침에 따라 Claude에게 보안 스캔을 요청합니다:

```
"첨부된 프로젝트 파일들을 프롬프트 지침에 따라 보안 스캔해주세요. 
결과를 JSON 형식으로 제공해주세요."
```

### 5. 결과 저장

Claude가 생성한 JSON 결과를 복사하여 로컬 파일로 저장합니다:

```
scan-result-YYYY-MM-DD.json
```

### 6. 결과 확인

Security Reports 웹사이트의 **REPORTS** 탭에서:

1. "Upload Report" 버튼 클릭
2. 저장한 JSON 파일 업로드
3. 분석 결과를 시각화된 리포트로 확인

## Tips

- **프로젝트 크기**: 대규모 프로젝트는 여러 세션으로 나누어 스캔
- **우선순위**: 핵심 비즈니스 로직과 인증/인가 관련 코드 우선 분석
- **정기 스캔**: 주요 업데이트 전후로 정기적인 보안 스캔 권장

## Common Issues

### Issue: 파일이 너무 커서 업로드 안됨
**Solution**: 필수 파일만 선별하거나, 파일을 여러 세션으로 분할

### Issue: JSON 결과가 형식에 맞지 않음
**Solution**: Claude에게 "Please reformat the output as valid JSON" 요청

## Support

문제가 발생하면 GitHub Issues에 문의해주세요:  
https://github.com/bosong2/securityreports/issues
