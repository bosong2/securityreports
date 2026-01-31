# 클라이언트 사이드 인증 구조 보안 분석 리포트

**분석 일시**: 2026-01-31  
**대상**: Security Reports 웹 애플리케이션

---

## 1. 현재 아키텍처 개요

```
[Browser] ←→ [Supabase (BaaS)]
   ↓
JavaScript (auth.js)
   - 인증 로직 전체가 클라이언트에서 실행
   - Supabase anon key가 클라이언트에 노출
   - profiles 테이블 직접 접근
```

---

## 2. 🔴 심각한 보안 취약점

### 2-1. Row Level Security (RLS) 의존성
| 위험도 | 높음 |
|--------|------|

**현황**: 클라이언트가 `profiles` 테이블에 직접 접근하여 `is_active`, `privacy_agreed` 등을 수정

**취약점**:
- RLS 정책이 잘못 설정되면, 악의적 사용자가 **다른 사용자의 프로필을 수정** 가능
- 예: `is_active = true`로 직접 변경하여 탈퇴 후 재활성화 우회

**확인 필요**:
```sql
-- Supabase SQL Editor에서 RLS 정책 확인
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

**권장 조치**:
```sql
-- profiles 테이블 RLS 예시
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can only view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
```

---

### 2-2. Anon Key 노출
| 위험도 | 중간 |
|--------|------|

**현황**: `supabase-config.js`에 anon key가 하드코딩되어 있음

**취약점**:
- anon key는 **공개되어도 괜찮은 키**로 설계되었으나
- RLS가 없으면 **무제한 데이터 접근** 가능
- API 요청 남발로 **비용 폭탄** 가능성

**권장 조치**:
- ✅ Supabase Dashboard에서 RLS 필수 활성화
- ✅ API Rate Limiting 설정
- ⚠️ service_role key는 절대 클라이언트에 노출 금지

---

### 2-3. 비활성화 로직 우회 가능성
| 위험도 | 중간 |
|--------|------|

**현황**: 탈퇴 처리가 프로필의 `is_active = false`만 설정

**취약점**:
- `auth.users` 테이블의 사용자는 삭제되지 않음
- 클라이언트에서 직접 `profiles.is_active = true` 호출 가능 (RLS 없으면)
- 탈퇴 사용자가 스스로 재활성화 가능

**권장 조치**:
- RLS 정책: `UPDATE` 시 `is_active` false→true 변경 금지
- 또는 서버 사이드에서만 재활성화 허용

---

## 3. 🟡 중간 위험 이슈

### 3-1. 세션 하이재킹
**현황**: Supabase는 JWT를 localStorage에 저장

**취약점**: XSS 공격 시 토큰 탈취 가능

**권장 조치**:
- CSP(Content Security Policy) 헤더 설정
- XSS 방지를 위한 입력값 검증

### 3-2. 이메일 열거 공격 (Email Enumeration)
**현황**: 로그인 실패 시 일관된 에러 메시지 사용 (✅ 양호)

**확인 결과**: `authErrorInvalidCredentials` 사용 중 - 이메일 존재 여부 노출 안 함

---

## 4. 🟢 긍정적 보안 요소

| 항목 | 상태 |
|------|------|
| 비밀번호 해싱 | ✅ Supabase 자동 처리 (bcrypt) |
| HTTPS | ✅ Supabase 강제 |
| 이메일 인증 | ✅ 구현됨 |
| OAuth (Google) | ✅ 안전한 구현 |
| 에러 메시지 일반화 | ✅ 계정 열거 방지 |

---

## 5. 권장 개선 사항

### 즉시 조치 (서버 사이드 없이 가능)
1. **RLS 정책 강화** - Supabase Dashboard에서 설정
2. **CSP 헤더 추가** - Cloudflare Pages에서 설정 가능

### 중기 조치 (서버 사이드 필요)
1. **Edge Functions 도입** - 민감한 로직 서버로 이동
   - 계정 탈퇴 (soft delete)
   - 계정 재활성화
   - 관리자 기능

2. **완전한 계정 삭제** - service_role key 사용
   ```javascript
   // Edge Function 예시
   await supabaseAdmin.auth.admin.deleteUser(userId);
   ```

---

## 6. Supabase RLS 정책 예시

```sql
-- profiles 테이블 RLS 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 자신의 프로필만 조회 가능
CREATE POLICY "select_own_profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- 자신의 프로필만 생성 가능 (회원가입 시)
CREATE POLICY "insert_own_profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 자신의 프로필만 수정 가능 (is_active 재활성화 금지)
CREATE POLICY "update_own_profile" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    -- is_active를 false에서 true로 변경 금지 (서버에서만 허용)
    (is_active = OLD.is_active) OR (is_active = false)
  );
```

---

## 결론

현재 구조는 **Supabase의 RLS 정책에 전적으로 의존**합니다.

> ⚠️ **RLS가 올바르게 설정되지 않으면 심각한 보안 문제 발생 가능**

**다음 단계**:
1. Supabase Dashboard에서 RLS 정책 확인 및 강화
2. 민감한 로직(탈퇴, 재활성화)은 Edge Functions로 이전 검토
