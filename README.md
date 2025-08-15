# InterFit - 인터벌 타이머

React Native와 Expo를 사용하여 개발된 인터벌 운동 타이머 앱입니다. 직관적인 UI와 강력한 기능으로 효율적인 운동 관리를 제공합니다.

## 🚀 기술 스택

- **Frontend**: React Native, Expo
- **Navigation**: Expo Router
- **Styling**: NativeWind (TailwindCSS)
- **State Management**: Zustand
- **Storage**: AsyncStorage
- **Audio**: Expo AV, Expo Speech
- **Animations**: React Native Reanimated
- **UI Components**: React Native Paper

## 📱 주요 기능

### 🏠 홈 화면

- **운동 제목 설정**: 사용자 맞춤형 운동 이름 입력
- **인터렉티브 타이머 설정**: 중앙 원형 디스플레이에서 시간 직관적 설정
- **플로팅 버튼**: 운동시간, 휴식시간, 세트 수 설정을 위한 부드러운 애니메이션 버튼
- **템플릿 시스템**:
  - Beginner (40s work, 30s rest, 6 sets)
  - HIIT Beast (45s work, 15s rest, 10 sets)
  - Tabata (20s work, 10s rest, 8 sets)
  - Custom (사용자 설정)
- **실시간 운동 예상 시간 계산**

### ⏱️ 타이머 화면

- **원형 프로그레스 바**: SVG 기반 시각적 진행률 표시
- **다이나믹 그라디언트**: 운동/휴식 상태에 따른 색상 변화
- **펄스 애니메이션**: 마지막 3초 시각적 효과
- **한국어 TTS 음성 안내**:
  - 운동 시작: "[운동명] 시작"
  - 휴식 시작: "휴식 시간"
  - 카운트다운: "삼", "이", "일"
- **컨트롤 버튼**:
  - 일시정지/재생
  - 초기화 (확인 팝업)
  - 스킵 (다음 단계로 이동)
- **세트 진행 표시**: 점 형태의 시각적 진행률

### ⚙️ 설정 화면

- **오디오 설정**:
  - 사운드 마스터 토글
  - 음성 안내 활성화/비활성화
  - 볼륨 조절 (0-100%)
  - 실시간 볼륨 테스트
- **진동 설정**: 햅틱 피드백 제어
- **테마 설정**: Purple, Blue, Green 컬러 스킴
- **권한 관리**: 앱 최초 실행 시 통합 권한 요청

### 📊 기록 화면

- **운동 통계**: 총 운동 시간, 완료된 운동 수
- **운동 히스토리**: 날짜별 운동 기록 조회
- **상세 정보**: 운동 제목, 시간, 세트 수, 설정값 저장

## 🔧 기술적 특징

### 아키텍처

- **Component-based**: 재사용 가능한 컴포넌트 구조
- **Hook-based**: 커스텀 훅으로 로직 분리
- **Service Layer**: 오디오, 권한, 타이머 서비스 모듈화
- **Store Pattern**: Zustand로 전역 상태 관리

### 성능 최적화

- **React Native Reanimated**: 부드러운 애니메이션
- **Memoization**: 불필요한 리렌더링 방지
- **Efficient Storage**: AsyncStorage 최적화
- **Memory Management**: 오디오 리소스 관리

### 사용자 경험

- **권한 시스템**: 비침습적 권한 관리
- **실시간 동기화**: 설정 변경 즉시 반영
- **오디오 관리**: 페이지 이동 시 자동 중단
- **에러 처리**: 안전한 예외 처리

## 📁 프로젝트 구조

```
app/
├── index.tsx          # 홈 화면
├── counter.tsx        # 타이머 화면
├── settings.tsx       # 설정 화면
├── records.tsx        # 기록 화면
└── _layout.tsx        # 레이아웃 설정

components/
├── timer/             # 타이머 관련 컴포넌트
├── common/            # 공통 컴포넌트
└── ui/                # UI 컴포넌트

hooks/
├── useTimer.ts        # 타이머 로직
├── useTimerSettings.ts # 설정 관리
└── useTimePicker.ts   # 시간 선택

services/
├── audioService.ts    # 오디오 관리
├── permissionService.ts # 권한 관리
└── timerService.ts    # 타이머 로직

store/
└── settingsStore.ts   # 전역 상태 관리

utils/
├── workoutStorage.ts  # 운동 기록 저장
├── themeColors.ts     # 테마 색상
├── timeFormatter.ts   # 시간 포맷팅
└── timerCalculator.ts # 타이머 계산
```

## 🎨 디자인 시스템

### 색상 테마

- **Purple**: 기본 테마 (#EC4899, #8B5CF6)
- **Blue**: 블루 테마 (#3B82F6, #1E40AF)
- **Green**: 그린 테마 (#10B981, #059669)

### 애니메이션

- **Float Animation**: 플로팅 버튼 부드러운 이동
- **Pulse Effect**: 타이머 마지막 3초 펄스
- **Gradient Animation**: 회전하는 그라디언트 링
- **Haptic Feedback**: 터치 상호작용 진동

## 📱 지원 플랫폼

- **iOS**: iPhone, iPad
- **Android**: Android 6.0+
- **Web**: 웹 브라우저 (Expo Web)

## 🔒 권한 관리

### 요청 권한

- **오디오**: 음성 안내 및 알림음
- **진동**: 햅틱 피드백
- **음성 합성**: TTS 음성 안내

### 권한 정책

- 앱 최초 실행 시 한 번만 요청
- 권한 거부 시 관련 기능 비활성화
- 타이머 실행 중 권한 팝업 없음

## 🔄 상태 관리

### Zustand Store

```typescript
interface SettingsStore {
  audio: AudioSettings;
  timer: TimerSettings;
  theme: ThemeSettings;
  actions: SettingsActions;
}
```

### 실시간 동기화

- 홈 ↔ 설정 페이지 양방향 동기화
- 타이머 실행 중 설정 변경 즉시 적용
- AsyncStorage 자동 저장

## 🎵 오디오 시스템

### 음성 안내

- **운동 시작**: "[운동명] 시작"
- **휴식 시작**: "휴식 시간"
- **카운트다운**: "삼", "이", "일"

### 오디오 관리

- 페이지 이동 시 자동 중단
- 앱 백그라운드 시 오디오 중단
- 볼륨 테스트 3초 후 자동 중단

## 🎯 사용자 경험

### 핵심 가치

1. **직관성**: 복잡한 설정 없이 바로 사용 가능
2. **안정성**: 예외 상황 안전한 처리
3. **연속성**: 타이머 중단 없는 설정 변경
4. **개인화**: 사용자 맞춤형 운동 설정

### 접근성

- 시각적 피드백으로 상태 명확 표시
- 햅틱 피드백으로 촉각 정보 제공
- 음성 안내로 청각 정보 제공

## 🚀 개발 및 배포

### 설치 및 실행

```bash
npm install
npx expo start
```

### 플랫폼별 실행

```bash
npx expo start --ios
npx expo start --android
npx expo start --web
```

### 테스트

```bash
npm test
```

### 린트

```bash
npm run lint
```
