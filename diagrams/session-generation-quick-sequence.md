# Self-Hypnosis App - Quick Session Generation Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant GenerateScreen
    participant SessionCreationViewModel
    participant AudioGenerationViewModel
    participant SessionService
    participant QuotaService
    participant AudioService
    participant TTSService
    participant SessionRepository
    participant SuccessScreen
    participant ErrorScreen
    participant NavigationService
    participant GlobalState

    Note over User, GlobalState: Quick Session Generation Flow - Proper MVVM Pattern
    note right: **Registration Context: Token Creation & Storage**<br/>- User must complete registration before session generation<br/>- JWT token created during AuthService.register()<br/>- Token stored in GlobalState via AuthStore<br/>- Token used for authenticated API calls during generation<br/>- Token refresh handled automatically if expired

    %% User Initiates Quick Generation
    User->>GenerateScreen: Tap "Generate New Session" (Quick)
    GenerateScreen->>SessionCreationViewModel: createQuickSession(goals, duration, voice, ending, background)
    
    %% Quota Check via ViewModel
    SessionCreationViewModel->>QuotaService: checkRemaining(userId)
    QuotaService->>GlobalState: getUserQuota()
    GlobalState-->>QuotaService: Current quota info
    
    alt Quota Exhausted
        QuotaService-->>SessionCreationViewModel: quotaExhausted(remaining: 0)
        SessionCreationViewModel->>GlobalState: updateQuotaState(exhausted: true)
        SessionCreationViewModel-->>GenerateScreen: quotaExhausted
        GenerateScreen->>NavigationService: navigate("ErrorScreen", {type: "quota"})
        NavigationService->>ErrorScreen: Navigate to Error Screen
        ErrorScreen-->>User: Show upgrade CTA (outside beta) or "Quota Exhausted"
        Note over ErrorScreen: Display upgrade options, beta waitlist, or quota reset info
    else Quota Available
        QuotaService-->>SessionCreationViewModel: quotaAvailable(remaining > 0)
        
        %% Create Session Draft
        SessionCreationViewModel->>SessionService: createSessionDraft(parameters)
        SessionService->>SessionRepository: saveDraft(sessionDraft)
        SessionRepository-->>SessionService: draftSaved(sessionId)
        SessionService-->>SessionCreationViewModel: sessionDraftReady(sessionId)
        
        %% Transition to Audio Generation
        SessionCreationViewModel->>AudioGenerationViewModel: generateAudio(sessionId)
        AudioGenerationViewModel->>GlobalState: updateSessionState(status: "GENERATING_SCRIPT")
        
        %% Script Generation
        AudioGenerationViewModel->>AudioService: generateScript(sessionDraft)
        AudioService-->>AudioGenerationViewModel: scriptGenerated(script)
        AudioGenerationViewModel->>GlobalState: updateSessionState(status: "GENERATING_AUDIO")
        
        %% Audio Synthesis
        AudioGenerationViewModel->>AudioService: synthesizeAudio(script, voicePreference)
        AudioService->>TTSService: synthesize(script, voicePreference)
        
        alt Network/API Error
            TTSService-->>AudioService: error (network/API failure)
            AudioService-->>AudioGenerationViewModel: generationFailed(error)
            AudioGenerationViewModel->>GlobalState: updateSessionState(status: "FAILED", error)
            AudioGenerationViewModel-->>GenerateScreen: generationError(error)
            GenerateScreen->>NavigationService: navigate("ErrorScreen", {error, retry: true})
            NavigationService->>ErrorScreen: Navigate to Error Screen
            ErrorScreen-->>User: Show error message with Retry/Back options
            Note over ErrorScreen: Offer retry button and back navigation
        else Success
            TTSService-->>AudioService: audioFile(url, duration, metadata)
            AudioService->>AudioService: processAndStoreAudio(audioFile)
            AudioService-->>AudioGenerationViewModel: audioReady(audioFile)
            
            %% Session Completion
            AudioGenerationViewModel->>SessionService: completeSession(sessionId, audioFile)
            SessionService->>SessionRepository: updateSession(sessionId, audioFile, status: "READY")
            SessionRepository-->>SessionService: sessionUpdated(sessionId)
            
            %% Quota Consumption
            SessionService->>QuotaService: consumeOne(userId)
            QuotaService->>GlobalState: updateUserQuota(remaining - 1)
            QuotaService-->>SessionService: quotaUpdated(newRemaining)
            
            %% Update Global State
            SessionService->>GlobalState: updateSessionState(status: "READY", audioFile)
            SessionService-->>AudioGenerationViewModel: sessionComplete(sessionId, audioFile)
            AudioGenerationViewModel-->>GenerateScreen: generationComplete(sessionId, audioFile)
            
            %% Navigate to Success
            GenerateScreen->>NavigationService: navigate("SuccessScreen", {sessionId})
            NavigationService->>SuccessScreen: Navigate to Success Screen
            
            %% Success Screen Options
            SuccessScreen-->>User: Show session details and action buttons
            Note over SuccessScreen: Display Play, Save, Share, Download options
        end
    end

    Note over User, GlobalState: Session generation complete or failed with appropriate user feedback

    %% =================================
    %% AC REFERENCES
    %% =================================
    %% AC-1: Registration prerequisite for session generation documented
    %% AC-2: Token creation during registration mentioned
    %% AC-3: Token storage in GlobalState via AuthStore noted
    %% AC-4: Token usage for authenticated API calls described
    %% AC-5: Automatic token refresh capability mentioned
```

## Session Generation & Registration Integration Notes

### 🔐 **Registration Prerequisites for Session Generation**

#### **Authentication Requirements**
- **Token Dependency**: Session generation requires valid JWT token from registration
- **Auth State**: GlobalState.isAuthenticated must be true before generation
- **Token Validation**: AuthService validates token before API calls
- **Error Handling**: Token expiration handled through AuthViewModel.refreshAuthToken()

#### **Registration Flow Integration**
- **Onboarding Completion**: User must complete full registration + verification flow
- **Profile Setup**: User profile with goals/preferences required for generation
- **Quota Assignment**: User quota initialized during registration process
- **Voice Preferences**: Selected voice preference used in session generation

#### **State Management Integration**
- **AuthStore**: Maintains token and authentication state from registration
- **UserStore**: Stores user profile and preferences from registration
- **GlobalState**: Coordinates between auth and session state
- **Persistence**: Auth state persists across app sessions

## Quick Session Generation Flow Notes

### 🎯 **Key Features**
- **Quick Path**: Minimal parameters with pre-filled goals from onboarding
- **Quota Management**: Pre-generation check through proper ViewModel layer
- **Error Recovery**: Retry options with NavigationService integration
- **Success Actions**: Multiple post-generation options (Play/Save/Share/Download)

### 🔄 **MVVM Flow States**

#### **Pre-Generation (MVVM Compliant)**
- **Quota Check**: GenerateScreen → SessionCreationViewModel → QuotaService → GlobalState
- **Parameter Assembly**: ViewModels handle data preparation and validation
- **Quick Mode**: Streamlined through proper service orchestration

#### **Generation Process (Proper Separation)**
- **Script Creation**: AudioGenerationViewModel → AudioService → AI integration
- **Audio Synthesis**: AudioService → TTSService with proper error boundaries
- **State Updates**: Real-time GlobalState updates for UI responsiveness

#### **Post-Generation (Clean Navigation)**
- **Success Path**: NavigationService handles screen transitions
- **Error Path**: Centralized error handling through NavigationService

### 🏗️ **MVVM Architecture Integration**

#### **ViewModel Layer**
- **SessionCreationViewModel**: Orchestrates session creation and quota validation
- **AudioGenerationViewModel**: Manages script creation and audio synthesis
- **Proper Separation**: Each ViewModel has specific responsibilities

#### **Service Layer**
- **SessionService**: Session lifecycle management and persistence
- **QuotaService**: Quota checking, consumption, and state management
- **AudioService**: Consolidated script generation, synthesis, and audio processing

#### **Data Layer**
- **SessionRepository**: Session persistence with proper service abstraction
- **GlobalState**: Centralized state management with real-time updates

#### **UI Layer**
- **GenerateScreen**: Pure UI that only interacts with ViewModels
- **SuccessScreen**: Post-generation UI with ViewModel-driven data
- **ErrorScreen**: Error handling UI with NavigationService integration

### ✅ **MVVM Compliance Improvements**
- **No Direct Service Calls**: Screens only call ViewModels
- **State Management**: GlobalState provides consistent app-wide state
- **Navigation**: NavigationService handles all screen transitions
- **Error Handling**: Proper error propagation through ViewModel layer
- **Service Orchestration**: ViewModels coordinate multiple services properly

### 📱 **User Experience Features**

#### **Quick Mode Benefits**
- **Pre-filled Goals**: Uses onboarding selections automatically
- **Minimal Input**: Duration, voice, ending, background only
- **Fast Generation**: Streamlined workflow for quick sessions

#### **Quota Management**
- **Beta Badge**: Unlimited sessions for beta users
- **Quota Display**: "3 free" vs unlimited indicators
- **Exhaustion Handling**: Clear upgrade paths and alternatives

#### **Error Recovery**
- **Retry Options**: Automatic retry for transient failures
- **Back Navigation**: Return to generation screen
- **User Feedback**: Clear error messages and next steps

#### **Success Actions**
- **Immediate Play**: Start session playback
- **Save Options**: Local storage and cloud backup
- **Sharing**: Social sharing and export options
- **Download**: Offline availability

### 🔧 **Technical Considerations**

#### **Error Scenarios**
- **Network Failures**: Retry with exponential backoff
- **API Limits**: Graceful degradation and user notification
- **TTS Failures**: Fallback to text-only or retry synthesis

#### **Performance Optimizations**
- **Async Processing**: Non-blocking generation workflow
- **Progress Indicators**: Real-time generation status updates
- **Caching**: Reuse successful generations where possible

#### **Offline Support**
- **Download Options**: Local storage for offline playback
- **Sync Management**: Background synchronization when online
- **Storage Quotas**: Local storage management and cleanup
```
