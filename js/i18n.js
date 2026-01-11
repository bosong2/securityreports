// Internationalization (i18n) Module

const translations = {
  ko: {
    // Header
    siteTitle: 'Security Reports',
    siteSubtitle: 'AI 기반 보안 스캔 리포트',

    // Navigation
    navHome: '홈',
    navReports: '리포트',

    // Buttons
    btnLanguage: '언어',
    btnTheme: '테마',
    btnDark: '다크',
    btnLight: '라이트',

    // Welcome Section
    welcomeTitle: 'AI 보안 스캔 리포트에 오신 것을 환영합니다',
    welcomeSubtitle: '프로젝트의 보안 취약점을 AI로 분석하고, 상세한 리포트를 확인하세요',

    // Instructions Section
    instructionsTitle: '시작하기',
    instructionsSubtitle: 'AI 보안 스캔을 시작하려면 아래 단계를 따라주세요',

    step1Title: '1. AI 프롬프트 다운로드',
    step1Desc: '사용할 AI(Claude, Gemini 등)를 선택하고 보안 스캔 프롬프트를 다운로드하세요',

    step2Title: '2. 프로젝트 스캔',
    step2Desc: '다운로드한 프롬프트를 AI에 적용하여 프로젝트를 스캔하세요',

    step3Title: '3. 리포트 확인',
    step3Desc: 'AI가 생성한 JSON 결과를 리포트 탭에서 업로드하여 확인하세요',

    // Filter Section
    filterLabel: 'AI 선택:',
    filterAll: '전체',
    filterClaude: 'Claude',
    filterGemini: 'Gemini',

    // Footer
    footerText: '© 2026 Security Reports. 오픈소스 프로젝트',
    footerGithub: 'GitHub에서 보기',

    // Coming Soon
    comingSoon: '곧 출시 예정',

    // Sprint 4: Upload & Reports
    uploadTitle: 'JSON 리포트 업로드',
    uploadDesc: '스캔 결과 JSON 파일을 업로드하여 상세 리포트를 확인하세요',
    uploadButton: '파일 선택',
    uploadDragDrop: '또는 파일을 여기로 드래그하세요',

    reportsLinkTitle: 'REPORTS 페이지로 이동',
    reportsLinkDesc: '리포트 페이지에서 더 많은 기능을 사용하실 수 있습니다',
    reportsLinkButton: 'REPORTS 열기',

    infoBoxTitle: '향후 기능',
    infoBoxContent: '다음 업데이트에서 추가될 예정입니다:',
    infoFeature1: 'JSON 업로드 시 자동 리포트 팝업',
    infoFeature2: '드래그 앤 드롭 파일 업로드',
    infoFeature3: '리포트 미리보기',

    // Footer links
    footerPrivacy: '개인정보 처리방침',
    footerAbout: 'About',
    footerContact: 'Contact',

    // Privacy Policy Page
    privacyTitle: '개인정보 처리방침',
    privacyLastUpdated: '최종 업데이트: 2026년 1월',
    privacyIntroTitle: '소개',
    privacyIntro: 'Security Reports("당사", "우리")는 사용자의 개인정보를 보호하고 존중합니다. 본 개인정보 처리방침은 당사의 웹사이트를 방문하고 사용할 때 귀하의 정보가 어떻게 수집, 사용 및 보호되는지 설명합니다.',
    privacyCollectionTitle: '1. 수집하는 정보',
    privacyCollection: '당사는 다음과 같은 정보를 수집할 수 있습니다:',
    privacyCollection1: '브라우저 유형 및 버전',
    privacyCollection2: '운영 체제',
    privacyCollection3: '참조 URL',
    privacyCollection4: '방문 날짜 및 시간',
    privacyCollection5: '페이지 조회수 및 사이트 탐색 패턴',
    privacyAdsenseTitle: '2. Google AdSense 및 쿠키',
    privacyAdsense1: '본 웹사이트는 Google AdSense를 사용하여 광고를 게재합니다. Google AdSense는 쿠키를 사용하여 이 사이트 및 기타 사이트 방문 기록을 기반으로 사용자에게 관련성 높은 광고를 표시합니다.',
    privacyAdsense2: 'Google의 광고 쿠키 사용을 통해 Google과 파트너는 사용자의 사이트 방문 및/또는 웹의 다른 사이트 방문을 기반으로 사용자에게 광고를 게재할 수 있습니다.',
    privacyAdsense3: '사용자는 Google 광고 설정에서 맞춤 광고를 선택 해제할 수 있습니다.',
    privacyCookiesTitle: '3. 쿠키 및 추적 기술',
    privacyCookies: '쿠키는 사용자의 장치에 저장되는 작은 텍스트 파일입니다. 당사는 다음 목적으로 쿠키를 사용합니다:',
    privacyCookies1: '사용자 환경설정 저장 (언어, 테마)',
    privacyCookies2: '사이트 사용 분석',
    privacyCookies3: '맞춤 광고 제공',
    privacyDataUseTitle: '4. 정보 사용 방법',
    privacyDataUse: '수집된 정보는 다음 목적으로 사용됩니다:',
    privacyDataUse1: '웹사이트 기능 개선',
    privacyDataUse2: '사용자 경험 향상',
    privacyDataUse3: '사이트 사용 통계 분석',
    privacyDataUse4: '관련성 높은 광고 표시',
    privacyThirdPartyTitle: '5. 제3자 서비스',
    privacyThirdParty: '당사는 다음 제3자 서비스를 사용합니다:',
    privacyThirdParty2: '이러한 제3자는 자체 개인정보 처리방침을 가지고 있으며, 당사는 이들의 관행에 대해 책임지지 않습니다.',
    privacyDataProtectionTitle: '6. 데이터 보호',
    privacyDataProtection: '당사는 귀하의 정보를 보호하기 위해 업계 표준 보안 조치를 사용합니다. 그러나 인터넷을 통한 전송 방법이나 전자 저장 방법이 100% 안전하다고 보장할 수 없습니다.',
    privacyRightsTitle: '7. 귀하의 권리',
    privacyRights: '귀하는 다음과 같은 권리를 가집니다:',
    privacyRights1: '개인정보 액세스 및 업데이트 요청',
    privacyRights2: '개인정보 삭제 요청',
    privacyRights3: '데이터 처리 제한 요청',
    privacyRights4: '쿠키 설정 변경',
    privacyChildrenTitle: '8. 아동의 개인정보',
    privacyChildren: '당사의 서비스는 13세 미만의 아동을 대상으로 하지 않습니다. 당사는 의도적으로 13세 미만 아동으로부터 개인정보를 수집하지 않습니다.',
    privacyChangesTitle: '9. 개인정보 처리방침 변경',
    privacyChanges: '당사는 본 개인정보 처리방침을 수시로 업데이트할 수 있습니다. 변경 사항은 이 페이지에 게시되며 "최종 업데이트" 날짜가 수정됩니다.',
    privacyContactTitle: '10. 문의',
    privacyContact: '개인정보 처리방침에 대한 질문이 있으시면 Contact 페이지를 통해 문의해 주시기 바랍니다.',
    privacyFooterNote: '본 개인정보 처리방침은 GDPR 및 CCPA와 같은 국제 데이터 보호 규정을 준수하기 위해 작성되었습니다.',

    // About Page
    aboutTitle: 'About Us',
    aboutMissionTitle: 'Our Mission',
    aboutMission: 'Security Reports는 AI 기술을 활용하여 소프트웨어 보안을 민주화하는 것을 목표로 합니다. 우리는 개발자들이 쉽고 빠르게 프로젝트의 보안 취약점을 발견하고 해결할 수 있도록 돕습니다.',
    aboutWhatWeDoTitle: 'What We Do',
    aboutWhatWeDo: 'Security Reports는 AI 기반 보안 스캔을 위한 프롬프트 템플릿과 도구를 제공하는 오픈소스 플랫폼입니다. 다음과 같은 서비스를 제공합니다:',
    aboutService1: '보안 스캔 프롬프트: Claude, Gemini 등 주요 AI 플랫폼을 위한 검증된 보안 스캔 프롬프트 템플릿',
    aboutService2: '사용 가이드: AI를 활용한 보안 스캔 방법에 대한 상세한 매뉴얼',
    aboutService3: '리포트 뷰어: AI가 생성한 보안 스캔 결과를 시각화하는 도구',
    aboutService4: '커뮤니티: 보안 전문가와 개발자들이 함께 성장하는 공간',
    aboutWhyTitle: 'Why Security Reports?',
    aboutWhy: '전통적인 보안 스캔 도구는 비용이 높고 설정이 복잡합니다. Security Reports는:',
    aboutWhy1: '✅ 무료: 모든 리소스가 오픈소스로 제공됩니다',
    aboutWhy2: '✅ 간편: AI와 대화하듯 보안 스캔을 수행합니다',
    aboutWhy3: '✅ 강력: 최신 AI 기술을 활용한 심층 분석',
    aboutWhy4: '✅ 커스터마이징: 프로젝트 특성에 맞게 프롬프트 수정 가능',
    aboutTechTitle: 'Technology',
    aboutTech: 'Security Reports는 다음 기술을 기반으로 구축되었습니다:',
    aboutOpenSourceTitle: 'Open Source',
    aboutOpenSource: 'Security Reports는 MIT 라이선스 하의 오픈소스 프로젝트입니다. 누구나 코드를 자유롭게 사용, 수정, 배포할 수 있습니다.',
    aboutContribute: 'GitHub에서 프로젝트에 기여하실 수 있습니다:',
    aboutGithubBtn: 'GitHub에서 보기',
    aboutFutureTitle: 'Future Plans',
    aboutFuture: '우리는 지속적으로 플랫폼을 개선하고 있습니다. 향후 계획:',
    aboutFuture1: '더 많은 AI 프롬프트 템플릿 추가 (GPT, Bard 등)',
    aboutFuture2: '자동화된 보안 스캔 파이프라인',
    aboutFuture3: '취약점 우선순위 분석 기능',
    aboutFuture4: '커뮤니티 기반 프롬프트 라이브러리',
    aboutClosing: '함께 더 안전한 소프트웨어를 만들어갑시다! 🛡️',

    // Contact Page
    contactTitle: 'Contact Us',
    contactSubtitle: '질문이나 피드백이 있으시면 언제든지 연락주세요',
    contactGithubTitle: 'GitHub Issues',
    contactGithubDesc: '버그 리포트, 기능 요청, 질문 등을 GitHub Issues를 통해 제출해주세요',
    contactGithubBtn: 'Issues 열기',
    contactDiscussionsTitle: 'GitHub Discussions',
    contactDiscussionsDesc: '커뮤니티와 아이디어를 공유하고 토론에 참여하세요',
    contactDiscussionsBtn: 'Discussions 참여',
    contactHowTitle: '문의 방법',
    contactHow: '다음과 같은 방법으로 연락하실 수 있습니다:',
    contactBugTitle: '🐛 버그 리포트',
    contactBug: '버그를 발견하셨나요? GitHub Issues에 다음 정보와 함께 제출해주세요:',
    contactBug1: '버그 설명',
    contactBug2: '재현 단계',
    contactBug3: '기대되는 동작',
    contactBug4: '실제 동작',
    contactBug5: '브라우저 및 OS 정보',
    contactFeatureTitle: '✨ 기능 요청',
    contactFeature: '새로운 기능을 제안하고 싶으신가요? GitHub Issues에서 "[Feature Request]" 태그와 함께 다음을 포함해주세요:',
    contactFeature1: '기능 설명',
    contactFeature2: '사용 사례',
    contactFeature3: '기대되는 효과',
    contactQuestionTitle: '❓ 일반 질문',
    contactQuestion: '프로젝트 사용법이나 일반적인 질문은 GitHub Discussions를 이용해주세요.',
    contactContributeTitle: '🤝 기여하기',
    contactContribute: '코드나 문서로 프로젝트에 기여하고 싶으신가요?',
    contactContribute1: '저장소를 Fork하세요',
    contactContribute2: '새 브랜치를 만드세요',
    contactContribute3: '변경사항을 커밋하세요',
    contactContribute4: 'Pull Request를 제출하세요',
    contactResponseTitle: '응답 시간',
    contactResponse: '이 프로젝트는 오픈소스 커뮤니티에 의해 운영됩니다. 응답 시간은 다를 수 있으며, 긴급한 보안 문제는 우선적으로 처리됩니다.',

    // Cookie Consent
    cookieConsentText: '이 웹사이트는 사용자 경험 개선 및 맞춤 광고 제공을 위해 쿠키를 사용합니다. 계속 사용하시면 쿠키 정책에 동의하는 것으로 간주됩니다. 자세한 내용은',
    cookieConsentLink: '개인정보 처리방침',
    cookieAccept: '동의함',
    cookieDecline: '거부함',

    // Upload Handler
    uploadErrorInvalidFormat: 'JSON 파일만 업로드 가능합니다',
    uploadErrorFileSize: '파일 크기는 10MB 이하여야 합니다',
    uploadErrorEmptyFile: '빈 파일입니다',
    uploadErrorInvalidJSON: '유효하지 않은 JSON 형식입니다',
    uploadErrorStorageFull: '저장 공간이 부족합니다. 이전 리포트를 삭제해주세요',
    uploadProcessing: '처리 중...',
    uploadSuccess: '업로드 성공',

    // Blog
    tabBlog: '블로그',
    blogTitle: '커뮤니티 보안 리포트',
    blogSubtitle: '커뮤니티에서 공유된 보안 취약점을 발견하고 공유하세요',
    filterBy: '필터:',
    filterAll: '전체',
    viewReport: '리포트 보기',
    noPosts: '포스트가 없습니다',
    loading: '로딩 중...',
    latestReports: '최신 리포트',
    newReport: '새로운 리포트',
    searchPlaceholder: '포스트 검색...',
    createPost: '✍️ 포스트 작성',

    // Blog Submit
    submitTitle: '보안 리포트 공유하기',
    submitSubtitle: '커뮤니티에 보안 스캔 결과를 공유해주세요',
    howItWorks: '작동 방식',
    howItWorksStep1: '아래 양식을 작성하세요',
    howItWorksStep2: 'JSON 보안 스캔 리포트를 업로드하세요',
    howItWorksStep3: '생성된 파일(ZIP)을 다운로드하세요',
    howItWorksStep4: 'GitHub Pull Request로 제출하세요',
    formTitle: '제목',
    formTitlePlaceholder: '예: React 애플리케이션 보안 감사',
    formTitleHelp: '보안 리포트를 명확하게 설명하는 제목',
    formDescription: '설명',
    formDescriptionPlaceholder: '발견된 내용에 대한 간략한 요약...',
    formDescriptionHelp: '짧은 요약 (1-2문장)',
    formAuthor: '작성자',
    formAuthorPlaceholder: '예: 보안 연구팀',
    formTags: '태그',
    formTagPlaceholder: '태그를 입력하고 Enter를 누르세요',
    formTagHelp: '태그 추가 예: security, react, critical, sql-injection (Enter로 추가)',
    formContent: '상세 리포트',
    formContentPlaceholder: '# 상세 분석\n\n## 주요 발견사항\n\n### 1. 심각한 취약점\n\n...',
    formContentHelp: 'Markdown 지원 - 상세 분석, 발견사항, 권장사항',
    formJsonFile: 'JSON 보안 리포트',
    formJsonFileUpload: '클릭하여 업로드',
    formJsonFileDragDrop: '또는 드래그 앤 드롭',
    formJsonFileHelp: '보안 스캔에서 생성된 JSON 파일',
    btnCancel: '취소',
    btnGenerate: '파일 생성',
    btnGenerating: '생성 중...',
    alertNoTags: '최소 하나의 태그를 추가해주세요',
    alertNoFile: 'JSON 파일을 업로드해주세요',
    alertSuccess: '파일이 성공적으로 생성되었습니다!',
    alertNextSteps: '다음 단계',
    alertError: '파일 생성 중 오류가 발생했습니다. 다시 시도해주세요.',
  },

  en: {
    // Header
    siteTitle: 'Security Reports',
    siteSubtitle: 'AI-Powered Security Scan Reports',

    // Navigation
    navHome: 'Home',
    navReports: 'Reports',

    // Buttons
    btnLanguage: 'Language',
    btnTheme: 'Theme',
    btnDark: 'Dark',
    btnLight: 'Light',

    // Welcome Section
    welcomeTitle: 'Welcome to AI Security Scan Reports',
    welcomeSubtitle: 'Analyze your project\'s security vulnerabilities with AI and view detailed reports',

    // Instructions Section
    instructionsTitle: 'Getting Started',
    instructionsSubtitle: 'Follow these steps to begin your AI security scan',

    step1Title: '1. Download AI Prompt',
    step1Desc: 'Select your AI (Claude, Gemini, etc.) and download the security scan prompt',

    step2Title: '2. Scan Your Project',
    step2Desc: 'Apply the downloaded prompt to your AI and scan your project',

    step3Title: '3. View Report',
    step3Desc: 'Upload the JSON result generated by AI in the Reports tab',

    // Filter Section
    filterLabel: 'Select AI:',
    filterAll: 'All',
    filterClaude: 'Claude',
    filterGemini: 'Gemini',

    // Footer
    footerText: '© 2026 Security Reports. Open Source Project',
    footerGithub: 'View on GitHub',

    // Coming Soon
    comingSoon: 'Coming Soon',

    // Sprint 4: Upload & Reports
    uploadTitle: 'Upload JSON Report',
    uploadDesc: 'Upload your scan result JSON file to view detailed reports',
    uploadButton: 'Choose File',
    uploadDragDrop: 'or drag and drop file here',

    reportsLinkTitle: 'Go to REPORTS Page',
    reportsLinkDesc: 'Access more features on the Reports page',
    reportsLinkButton: 'Open REPORTS',

    infoBoxTitle: 'Upcoming Features',
    infoBoxContent: 'Coming in the next update:',
    infoFeature1: 'Auto-popup report on JSON upload',
    infoFeature2: 'Drag and drop file upload',
    infoFeature3: 'Report preview',

    // Footer links
    footerPrivacy: 'Privacy Policy',
    footerAbout: 'About',
    footerContact: 'Contact',

    // Privacy Policy Page
    privacyTitle: 'Privacy Policy',
    privacyLastUpdated: 'Last Updated: January 2026',
    privacyIntroTitle: 'Introduction',
    privacyIntro: 'Security Reports ("we", "us", or "our") respects and protects the privacy of users. This Privacy Policy explains how your information is collected, used, and protected when you visit and use our website.',
    privacyCollectionTitle: '1. Information We Collect',
    privacyCollection: 'We may collect the following information:',
    privacyCollection1: 'Browser type and version',
    privacyCollection2: 'Operating system',
    privacyCollection3: 'Referral URLs',
    privacyCollection4: 'Date and time of visit',
    privacyCollection5: 'Page views and site navigation patterns',
    privacyAdsenseTitle: '2. Google AdSense and Cookies',
    privacyAdsense1: 'This website uses Google AdSense to display advertisements. Google AdSense uses cookies to show you relevant ads based on your visit history to this and other sites.',
    privacyAdsense2: 'Google\'s use of advertising cookies enables Google and its partners to serve ads to you based on your visit to our sites and/or other sites on the Internet.',
    privacyAdsense3: 'You may opt out of personalized advertising by visiting Google Ad Settings.',
    privacyCookiesTitle: '3. Cookies and Tracking Technologies',
    privacyCookies: 'Cookies are small text files stored on your device. We use cookies for the following purposes:',
    privacyCookies1: 'Storing user preferences (language, theme)',
    privacyCookies2: 'Analyzing site usage',
    privacyCookies3: 'Providing personalized advertising',
    privacyDataUseTitle: '4. How We Use Your Information',
    privacyDataUse: 'Collected information is used for the following purposes:',
    privacyDataUse1: 'Improving website functionality',
    privacyDataUse2: 'Enhancing user experience',
    privacyDataUse3: 'Analyzing site usage statistics',
    privacyDataUse4: 'Displaying relevant advertisements',
    privacyThirdPartyTitle: '5. Third-Party Services',
    privacyThirdParty: 'We use the following third-party services:',
    privacyThirdParty2: 'These third parties have their own privacy policies, and we are not responsible for their practices.',
    privacyDataProtectionTitle: '6. Data Protection',
    privacyDataProtection: 'We use industry-standard security measures to protect your information. However, no method of transmission over the Internet or electronic storage is 100% secure.',
    privacyRightsTitle: '7. Your Rights',
    privacyRights: 'You have the following rights:',
    privacyRights1: 'Request access to and update of personal information',
    privacyRights2: 'Request deletion of personal information',
    privacyRights3: 'Request restriction of data processing',
    privacyRights4: 'Modify cookie settings',
    privacyChildrenTitle: '8. Children\'s Privacy',
    privacyChildren: 'Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.',
    privacyChangesTitle: '9. Changes to Privacy Policy',
    privacyChanges: 'We may update this Privacy Policy from time to time. Changes will be posted on this page and the "Last Updated" date will be revised.',
    privacyContactTitle: '10. Contact',
    privacyContact: 'If you have any questions about this Privacy Policy, please contact us through the Contact page.',
    privacyFooterNote: 'This Privacy Policy has been prepared to comply with international data protection regulations such as GDPR and CCPA.',

    // About Page
    aboutTitle: 'About Us',
    aboutMissionTitle: 'Our Mission',
    aboutMission: 'Security Reports aims to democratize software security using AI technology. We help developers quickly and easily find and fix security vulnerabilities in their projects.',
    aboutWhatWeDoTitle: 'What We Do',
    aboutWhatWeDo: 'Security Reports is an open-source platform that provides prompt templates and tools for AI-based security scanning. We offer the following services:',
    aboutService1: 'Security Scan Prompts: Validated security scan prompt templates for major AI platforms like Claude and Gemini',
    aboutService2: 'Usage Guides: Detailed manuals on how to perform security scans using AI',
    aboutService3: 'Report Viewer: Tools to visualize AI-generated security scan results',
    aboutService4: 'Community: A space where security experts and developers grow together',
    aboutWhyTitle: 'Why Security Reports?',
    aboutWhy: 'Traditional security scanning tools are expensive and complex to set up. Security Reports is:',
    aboutWhy1: '✅ Free: All resources are provided as open source',
    aboutWhy2: '✅ Easy: Perform security scans as easily as talking to an AI',
    aboutWhy3: '✅ Powerful: In-depth analysis using the latest AI technology',
    aboutWhy4: '✅ Customizable: Modify prompts to suit your project needs',
    aboutTechTitle: 'Technology',
    aboutTech: 'Security Reports is built on the following technologies:',
    aboutOpenSourceTitle: 'Open Source',
    aboutOpenSource: 'Security Reports is an open-source project under the MIT license. Anyone can freely use, modify, and distribute the code.',
    aboutContribute: 'You can contribute to the project on GitHub:',
    aboutGithubBtn: 'View on GitHub',
    aboutFutureTitle: 'Future Plans',
    aboutFuture: 'We are continuously improving the platform. Future plans include:',
    aboutFuture1: 'Add more AI prompt templates (GPT, Bard, etc.)',
    aboutFuture2: 'Automated security scan pipeline',
    aboutFuture3: 'Vulnerability priority analysis features',
    aboutFuture4: 'Community-driven prompt library',
    aboutClosing: 'Let\'s build safer software together! 🛡️',

    // Contact Page
    contactTitle: 'Contact Us',
    contactSubtitle: 'Feel free to reach out with questions or feedback',
    contactGithubTitle: 'GitHub Issues',
    contactGithubDesc: 'Submit bug reports, feature requests, and questions through GitHub Issues',
    contactGithubBtn: 'Open Issues',
    contactDiscussionsTitle: 'GitHub Discussions',
    contactDiscussionsDesc: 'Share ideas and join discussions with the community',
    contactDiscussionsBtn: 'Join Discussions',
    contactHowTitle: 'How to Contact',
    contactHow: 'You can contact us in the following ways:',
    contactBugTitle: '🐛 Bug Reports',
    contactBug: 'Found a bug? Please submit to GitHub Issues with the following information:',
    contactBug1: 'Bug description',
    contactBug2: 'Steps to reproduce',
    contactBug3: 'Expected behavior',
    contactBug4: 'Actual behavior',
    contactBug5: 'Browser and OS information',
    contactFeatureTitle: '✨ Feature Requests',
    contactFeature: 'Want to suggest a new feature? Include the following in GitHub Issues with "[Feature Request]" tag:',
    contactFeature1: 'Feature description',
    contactFeature2: 'Use cases',
    contactFeature3: 'Expected benefits',
    contactQuestionTitle: '❓ General Questions',
    contactQuestion: 'For project usage or general questions, please use GitHub Discussions.',
    contactContributeTitle: '🤝 Contributing',
    contactContribute: 'Want to contribute code or documentation to the project?',
    contactContribute1: 'Fork the repository',
    contactContribute2: 'Create a new branch',
    contactContribute3: 'Commit your changes',
    contactContribute4: 'Submit a Pull Request',
    contactResponseTitle: 'Response Time',
    contactResponse: 'This project is run by the open-source community. Response times may vary, and urgent security issues will be prioritized.',

    // Cookie Consent
    cookieConsentText: 'This website uses cookies to improve user experience and provide personalized advertising. By continuing to use this site, you consent to our cookie policy. For more information, see our',
    cookieConsentLink: 'Privacy Policy',
    cookieAccept: 'Accept',
    cookieDecline: 'Decline',

    // Upload Handler
    uploadErrorInvalidFormat: 'Only JSON files are allowed',
    uploadErrorFileSize: 'File size must be less than 10MB',
    uploadErrorEmptyFile: 'File is empty',
    uploadErrorInvalidJSON: 'Invalid JSON format',
    uploadErrorStorageFull: 'Storage quota exceeded. Please clear old reports',
    uploadProcessing: 'Processing...',
    uploadSuccess: 'Upload successful',

    // Blog
    tabBlog: 'BLOG',
    blogTitle: 'Community Security Reports',
    blogSubtitle: 'Discover and share security vulnerabilities from the community',
    filterBy: 'Filter by:',
    filterAll: 'All',
    viewReport: 'View Report',
    noPosts: 'No posts found',
    loading: 'Loading posts...',
    latestReports: 'Latest Reports',
    newReport: 'New Report',
    searchPlaceholder: 'Search posts...',
    createPost: '✍️ Create Post',

    // Blog Submit
    submitTitle: 'Share Your Security Report',
    submitSubtitle: 'Help the community by sharing your security scan findings',
    howItWorks: 'How it works',
    howItWorksStep1: 'Fill out the form below with your report details',
    howItWorksStep2: 'Upload your JSON security scan report',
    howItWorksStep3: 'Download the generated files (ZIP)',
    howItWorksStep4: 'Submit via GitHub Pull Request',
    formTitle: 'Title',
    formTitlePlaceholder: 'e.g., React Application Security Audit',
    formTitleHelp: 'A clear, descriptive title for your security report',
    formDescription: 'Description',
    formDescriptionPlaceholder: 'Brief summary of your findings...',
    formDescriptionHelp: 'Short summary (1-2 sentences)',
    formAuthor: 'Your Name',
    formAuthorPlaceholder: 'e.g., Security Research Team',
    formTags: 'Tags',
    formTagPlaceholder: 'Type tag and press Enter',
    formTagHelp: 'Add tags like: security, react, critical, sql-injection (press Enter to add)',
    formContent: 'Detailed Report',
    formContentPlaceholder: '# Your Detailed Analysis\n\n## Key Findings\n\n### 1. Critical Vulnerability\n\n...',
    formContentHelp: 'Markdown supported - detailed analysis, findings, recommendations',
    formJsonFile: 'JSON Security Report',
    formJsonFileUpload: 'Click to upload',
    formJsonFileDragDrop: 'or drag and drop',
    formJsonFileHelp: 'JSON file from your security scan',
    btnCancel: 'Cancel',
    btnGenerate: 'Generate Files',
    btnGenerating: 'Generating...',
    alertNoTags: 'Please add at least one tag',
    alertNoFile: 'Please upload a JSON file',
    alertSuccess: 'Files generated successfully!',
    alertNextSteps: 'Next steps',
    alertError: 'Error generating files. Please try again.',
  }
};

class I18n {
  constructor() {
    this.currentLang = this.loadLanguage();
    this.translations = translations;
  }

  loadLanguage() {
    // Priority 1: Check localStorage (user preference saved from any page)
    const saved = localStorage.getItem('language');
    if (saved && (saved === 'ko' || saved === 'en')) {
      console.log('Language loaded from localStorage:', saved);
      return saved;
    }

    // Priority 2: Detect browser language (only if no saved preference)
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('ko')) {
      console.log('Language set from browser preference: ko');
      return 'ko';
    }

    console.log('Language set to default: en');
    return 'en'; // Default to English
  }

  setLanguage(lang) {
    if (lang !== 'ko' && lang !== 'en') {
      console.error('Unsupported language:', lang);
      return;
    }

    this.currentLang = lang;
    localStorage.setItem('language', lang);
    this.updatePageLanguage();
  }

  toggleLanguage() {
    const newLang = this.currentLang === 'ko' ? 'en' : 'ko';
    this.setLanguage(newLang);
  }

  t(key) {
    return this.translations[this.currentLang][key] || key;
  }

  updatePageLanguage() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);

      // Check if element has a placeholder
      if (element.hasAttribute('placeholder')) {
        element.setAttribute('placeholder', translation);
      } else {
        element.textContent = translation;
      }
    });

    // Update language button text (support both languageBtn and langToggle)
    const langBtn = document.getElementById('languageBtn') || document.getElementById('langToggle');
    if (langBtn) {
      const langText = langBtn.querySelector('.btn-text') || langBtn.querySelector('#currentLang');
      if (langText) {
        langText.textContent = this.currentLang === 'ko' ? 'EN' : 'KO';
      }
    }

    // Update HTML lang attribute
    document.documentElement.lang = this.currentLang;
  }
}

// Export for use in other scripts
window.i18n = new I18n();

// Setup langToggle button click listener (for pages other than index.html)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const langToggle = document.getElementById('langToggle');
    if (langToggle && !langToggle.hasAttribute('data-lang-listener')) {
      langToggle.addEventListener('click', () => window.i18n.toggleLanguage());
      langToggle.setAttribute('data-lang-listener', 'true');
    }
  });
} else {
  const langToggle = document.getElementById('langToggle');
  if (langToggle && !langToggle.hasAttribute('data-lang-listener')) {
    langToggle.addEventListener('click', () => window.i18n.toggleLanguage());
    langToggle.setAttribute('data-lang-listener', 'true');
  }
}
