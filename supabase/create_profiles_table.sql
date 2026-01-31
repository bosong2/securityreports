-- Supabase profiles 테이블 생성 스크립트
-- Supabase Dashboard > SQL Editor에서 실행하세요

-- 1. profiles 테이블 생성
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    display_name TEXT,
    privacy_agreed BOOLEAN DEFAULT FALSE,
    privacy_agreed_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RLS (Row Level Security) 활성화
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. RLS 정책: 사용자는 자신의 프로필만 조회 가능
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- 4. RLS 정책: 사용자는 자신의 프로필만 수정 가능
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 5. RLS 정책: 인증된 사용자는 프로필 생성 가능
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 6. 새 사용자 등록 시 자동으로 profiles 레코드 생성하는 트리거 (선택사항)
-- 주석 처리: 우리는 동의 후에만 생성하기를 원하므로 사용하지 않음
/*
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
*/

-- 완료 메시지
SELECT 'profiles 테이블이 성공적으로 생성되었습니다!' AS message;
