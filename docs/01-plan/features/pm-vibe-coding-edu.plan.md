# PM 바이브 코딩 교육자료 Planning Document

> **Summary**: PM이 AI를 활용하여 바이브 코딩하는 방법을 교육하는 목차 기반 HTML 교육자료
>
> **Project**: projectPmEdu
> **Author**: totom
> **Date**: 2026-04-09
> **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | PM/비개발자가 AI 도구를 활용한 바이브 코딩 방법을 체계적으로 학습할 수 있는 교육자료가 부재함 |
| **Solution** | 목차 네비게이션이 있는 HTML 기반 교육자료를 제작하여 AI 기초부터 실습까지 단계별 학습 경로 제공 |
| **Function/UX Effect** | 사이드바 목차로 빠른 탐색, 섹션별 독립 학습 가능, 시각적 도식과 예시로 이해도 향상 |
| **Core Value** | PM이 개발자 없이도 AI를 활용하여 프로토타입을 만들고 업무를 자동화할 수 있는 역량 확보 |

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | PM/비개발자의 AI 활용 바이브 코딩 교육자료 부재 |
| **WHO** | PM, 기획자, 비개발 직군 (AI 코딩 입문자) |
| **RISK** | 콘텐츠 범위가 넓어 깊이가 부족해질 수 있음 |
| **SUCCESS** | 5개 교육 모듈 완성, 목차 네비게이션 동작, 각 섹션 독립 학습 가능 |
| **SCOPE** | 단일 HTML(또는 멀티페이지) + CSS + JS 정적 사이트 |

---

## 1. Overview

### 1.1 Purpose

PM과 비개발자가 AI 도구(ChatGPT, Claude, Claude Code 등)를 활용하여 코딩 없이도 프로토타입을 만들고, 문서를 자동 생성하며, 도식화와 자료조사를 수행할 수 있도록 체계적인 교육자료를 제공한다.

### 1.2 Background

- **바이브 코딩(Vibe Coding)**: AI와 대화하며 코드를 생성하는 새로운 개발 패러다임
- PM이 직접 프로토타입을 만들 수 있으면 개발 사이클이 단축됨
- AI 도구의 급속한 발전으로 비개발자도 코딩 참여가 가능해짐
- 체계적인 교육자료 부재로 학습 진입장벽이 높은 상황

### 1.3 Related Documents

- References: AI 도구 공식 문서 (Claude, ChatGPT, Cursor 등)

---

## 2. Scope

### 2.1 In Scope

- [x] AI 기초 개념 교육 콘텐츠 (LLM, 프롬프트 엔지니어링)
- [x] AI 활용 문서 작성 방법 (PRD, 기획서, 요구사항 등)
- [x] AI 도식화 활용법 (다이어그램, 플로우차트, 아키텍처)
- [x] AI 자료 조사 활용법 (시장조사, 경쟁사 분석, 데이터 수집)
- [x] 바이브 코딩 실습 가이드 (Claude Code, Cursor 등)
- [x] 사이드바 목차 네비게이션
- [x] 반응형 디자인 (모바일/태블릿 지원)

### 2.2 Out of Scope

- 백엔드 서버 구현 (정적 HTML만)
- 사용자 인증/로그인 기능
- 데이터베이스 연동
- 실시간 AI 연동 (교육자료는 정적 콘텐츠)

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | 사이드바 목차 네비게이션으로 섹션 간 이동 | High | Pending |
| FR-02 | 5개 교육 모듈(AI 기초, 문서, 도식화, 자료조사, 바이브코딩) 콘텐츠 | High | Pending |
| FR-03 | 각 모듈 내 하위 섹션 구성 (개념 → 도구 → 예시 → 실습) | High | Pending |
| FR-04 | 코드 예시 블록 (syntax highlighting) | Medium | Pending |
| FR-05 | 이미지/다이어그램 삽입 영역 | Medium | Pending |
| FR-06 | 반응형 레이아웃 (모바일 메뉴 토글) | Medium | Pending |
| FR-07 | 현재 읽고 있는 섹션 하이라이트 (스크롤 연동) | Low | Pending |
| FR-08 | 다크모드/라이트모드 전환 | Low | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Performance | 페이지 로딩 < 2초 | 브라우저 DevTools |
| Accessibility | 키보드 네비게이션 지원 | 수동 테스트 |
| Compatibility | Chrome, Edge, Safari 최신 버전 | 크로스 브라우저 테스트 |
| UX | 가독성 우수한 타이포그래피, 충분한 여백 | 시각 검수 |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] 5개 교육 모듈 콘텐츠 작성 완료
- [ ] 사이드바 목차 네비게이션 정상 동작
- [ ] 반응형 디자인 적용 (모바일 대응)
- [ ] 코드 블록 syntax highlighting 적용
- [ ] 브라우저에서 정상 렌더링 확인

### 4.2 Quality Criteria

- [ ] HTML/CSS 유효성 검사 통과
- [ ] 주요 브라우저 호환성 확인
- [ ] 콘텐츠 오탈자 검수 완료

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| 콘텐츠 범위가 넓어 각 모듈 깊이 부족 | Medium | High | 핵심 개념 + 실습 예시 중심으로 구성, 심화 학습은 외부 링크 제공 |
| AI 도구 변화 속도가 빨라 콘텐츠 진부화 | Medium | Medium | 원리/개념 중심 서술, 도구별 업데이트 날짜 명시 |
| 단일 HTML 파일 크기 과도 | Low | Medium | 모듈별 섹션 분리, lazy loading 적용 |
| 비개발자 대상 기술 용어 이해 어려움 | High | Medium | 용어 사전 섹션 추가, 비유/도식 활용 |

---

## 6. Impact Analysis

### 6.1 Changed Resources

| Resource | Type | Change Description |
|----------|------|--------------------|
| 신규 프로젝트 | HTML/CSS/JS | 처음부터 새로 생성 (기존 코드 없음) |

### 6.2 Current Consumers

- 해당 없음 (신규 프로젝트)

### 6.3 Verification

- [x] 신규 프로젝트로 기존 영향 없음

---

## 7. Architecture Considerations

### 7.1 Project Level Selection

| Level | Characteristics | Recommended For | Selected |
|-------|-----------------|-----------------|:--------:|
| **Starter** | Simple structure (`components/`, `lib/`, `types/`) | Static sites, portfolios, landing pages | **v** |
| Dynamic | Feature-based modules, BaaS integration | Web apps with backend | |
| Enterprise | Strict layer separation, DI, microservices | High-traffic systems | |

### 7.2 Key Architectural Decisions

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| 구조 | 단일 HTML / 멀티 페이지 | 단일 HTML | 교육자료 특성상 하나의 페이지에서 목차로 탐색이 편리 |
| 스타일링 | Tailwind CDN / 순수 CSS / Bootstrap | 순수 CSS | 의존성 최소화, 교육 목적에 맞는 단순 구조 |
| Syntax Highlighting | Prism.js / highlight.js | Prism.js CDN | 가벼운 용량, 다양한 언어 지원 |
| 아이콘 | Font Awesome / Lucide / 없음 | Lucide CDN | 가볍고 모던한 아이콘 세트 |
| 다이어그램 | Mermaid.js / 이미지 | Mermaid.js CDN | 코드 기반 다이어그램으로 유지보수 용이 |

### 7.3 Clean Architecture Approach

```
Selected Level: Starter

Folder Structure Preview:
┌─────────────────────────────────────────────────┐
│ projectPmEdu/                                   │
│   index.html          ← 메인 교육자료 페이지     │
│   css/                                          │
│     style.css         ← 전체 스타일              │
│   js/                                           │
│     main.js           ← 목차 네비게이션, 다크모드  │
│   assets/                                       │
│     images/           ← 교육 이미지/스크린샷       │
│   docs/               ← PDCA 문서                │
└─────────────────────────────────────────────────┘
```

---

## 8. Convention Prerequisites

### 8.1 Existing Project Conventions

- [ ] `CLAUDE.md` has coding conventions section
- [ ] ESLint configuration
- [ ] Prettier configuration
- [x] 신규 프로젝트 — 컨벤션 새로 정의 필요

### 8.2 Conventions to Define/Verify

| Category | Current State | To Define | Priority |
|----------|---------------|-----------|:--------:|
| **HTML 구조** | missing | 시맨틱 HTML5 태그 사용 (section, nav, article) | High |
| **CSS 네이밍** | missing | BEM 또는 단순 클래스 네이밍 | Medium |
| **파일 인코딩** | missing | UTF-8, LF 줄바꿈 | High |

### 8.3 Environment Variables Needed

- 해당 없음 (정적 HTML 프로젝트)

### 8.4 Pipeline Integration

- Starter 레벨 — 9-phase Pipeline 중 필요한 부분만 선택 적용

---

## 9. 교육 콘텐츠 목차 구조

### 모듈 1: AI 기초 개념
1.1 AI와 LLM이란?
1.2 생성형 AI의 동작 원리
1.3 프롬프트 엔지니어링 기초
1.4 주요 AI 도구 소개 (ChatGPT, Claude, Gemini)
1.5 AI 활용의 한계와 주의사항

### 모듈 2: AI 활용 문서 작성
2.1 PRD(제품 요구사항 문서) 작성
2.2 기획서/제안서 자동 생성
2.3 요구사항 정의서 작성
2.4 회의록/보고서 자동 정리
2.5 프롬프트 템플릿 활용법

### 모듈 3: AI 도식화 활용
3.1 플로우차트 생성 (Mermaid.js)
3.2 시스템 아키텍처 다이어그램
3.3 ER 다이어그램 / 데이터 모델링
3.4 사용자 여정 맵 (User Journey Map)
3.5 AI 도구별 도식화 비교

### 모듈 4: AI 자료 조사 활용
4.1 시장 조사 및 트렌드 분석
4.2 경쟁사 분석 프레임워크
4.3 사용자 페르소나 생성
4.4 데이터 수집 및 정리
4.5 리서치 결과 보고서 작성

### 모듈 5: 바이브 코딩 실습
5.1 바이브 코딩이란?
5.2 Claude Code 시작하기
5.3 프롬프트로 웹페이지 만들기
5.4 반복 개선(Iteration)으로 완성도 높이기
5.5 실전 프로젝트: 랜딩페이지 만들기

---

## 10. Next Steps

1. [ ] Design 문서 작성 (`/pdca design pm-vibe-coding-edu`)
2. [ ] HTML/CSS 구현 시작
3. [ ] 교육 콘텐츠 작성

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-04-09 | Initial draft | totom |
