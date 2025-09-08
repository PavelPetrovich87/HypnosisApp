# Self-Hypnosis App - Offline Download & Availability Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant HomeScreen
    participant ReviewScreen
    participant HomeViewModel
    participant AudioGenerationViewModel
    participant SessionService
    participant AudioService
    participant PermissionService
    participant StorageService
    participant NavigationService
    participant GlobalState
    participant NetworkService

    Note over User, NetworkService: Offline Download & Availability Flow - Proper MVVM Pattern
    note right: **Precondition: Registration is Online-Only**<br/>- User registration requires network connectivity<br/>- Email verification must be completed online<br/>- Token creation and storage happens during registration<br/>- Offline mode available only after successful registration

    %% User Opens Session
    User->>HomeScreen: Open recent/suggested session
    HomeScreen->>HomeViewModel: getSessionDetails(sessionId)
    HomeViewModel->>SessionService: getSession(sessionId)
    SessionService-->>HomeViewModel: session(details, audioFile)
    HomeViewModel->>GlobalState: updateCurrentSession(session)
    HomeViewModel-->>HomeScreen: sessionLoaded(details, audioFile)

    %% Check Download Status via ViewModel
    HomeViewModel->>AudioService: checkOfflineAvailability(sessionId)
    AudioService->>StorageService: getLocalAudioStatus(sessionId)
    StorageService-->>AudioService: offlineStatus(isDownloaded, localPath)
    AudioService-->>HomeViewModel: offlineStatus(isDownloaded, localPath)
    HomeViewModel->>GlobalState: updateSessionState(offlineStatus)
    HomeViewModel-->>HomeScreen: offlineStatusUpdated(isDownloaded)

    alt Already Downloaded
        HomeScreen-->>User: Show "Downloaded" badge
        HomeScreen-->>User: Enable offline playback controls
        Note over HomeScreen: Display offline indicator and local playback options
    else Not Downloaded
        HomeScreen-->>User: Show "Download" button
        User->>HomeScreen: Tap "Download"
        
        %% Permission Check (First Time)
        HomeScreen->>HomeViewModel: initiateDownload(sessionId)
        HomeViewModel->>PermissionService: checkStoragePermission()
        
        alt First Download (No Permission)
            PermissionService-->>HomeViewModel: permissionRequired
            HomeViewModel-->>HomeScreen: showPermissionPrompt
            HomeScreen-->>User: Show storage permission prompt
            Note over HomeScreen: Display onboarding info about offline downloads
            User->>HomeScreen: Grant permission
            HomeScreen->>HomeViewModel: permissionGranted
            HomeViewModel->>PermissionService: updatePermissionStatus(granted)
            PermissionService-->>HomeViewModel: permissionGranted
        else Permission Already Granted
            PermissionService-->>HomeViewModel: permissionGranted
        end
        
        %% Download Process via ViewModel
        HomeViewModel->>AudioService: downloadForOffline(sessionId, audioFile)
        AudioService->>StorageService: downloadAndStore(audioUrl, sessionId)
        StorageService-->>AudioService: downloadProgress(percentage)
        AudioService-->>HomeViewModel: downloadProgress(percentage)
        HomeViewModel-->>HomeScreen: updateDownloadProgress(percentage)
        
        StorageService-->>AudioService: downloadComplete(localPath)
        AudioService->>AudioService: updateOfflineStatus(sessionId, localPath)
        AudioService-->>HomeViewModel: downloadComplete(sessionId, localPath)
        HomeViewModel->>GlobalState: updateSessionState(offlineAvailable: true, localPath)
        HomeViewModel-->>HomeScreen: downloadComplete
        
        %% UI Update
        HomeScreen-->>User: Show "Downloaded" badge
        HomeScreen-->>User: Enable offline playback controls
        Note over HomeScreen: Update session list with offline indicator
    end

    %% Navigate to Review
    User->>HomeScreen: Tap session to open Review
    HomeScreen->>NavigationService: navigate("ReviewScreen", {sessionId})
    NavigationService->>ReviewScreen: Open Review with session details
    
    %% Review Screen Initialization
    ReviewScreen->>AudioGenerationViewModel: initializeReview(sessionId)
    AudioGenerationViewModel->>GlobalState: getCurrentSession()
    GlobalState-->>AudioGenerationViewModel: session(details, offlineStatus)
    AudioGenerationViewModel->>NetworkService: checkConnectivity()
    NetworkService-->>AudioGenerationViewModel: networkStatus(isOnline)
    AudioGenerationViewModel-->>ReviewScreen: reviewDataReady(session, networkStatus)

    %% Review Screen Offline Handling
    alt Device Online
        ReviewScreen-->>User: Show full functionality (Generate, Play, etc.)
        Note over ReviewScreen: All features available when online
    else Device Offline
        AudioGenerationViewModel->>AudioGenerationViewModel: evaluateOfflineCapabilities(sessionId)
        
        alt Session Downloaded
            AudioGenerationViewModel-->>ReviewScreen: offlinePlaybackAvailable
            ReviewScreen-->>User: Show offline playback available
            ReviewScreen-->>User: Disable Generate button (grayed out)
            Note over ReviewScreen: Display "Offline Mode" indicator
        else Session Not Downloaded
            AudioGenerationViewModel-->>ReviewScreen: noOfflineAccess
            ReviewScreen-->>User: Show "No Offline Access" message
            ReviewScreen-->>User: Disable all features except basic info
            Note over ReviewScreen: Display offline limitation message
        end
    end

    Note over User, NetworkService: Offline availability properly reflected across all screens with MVVM compliance

    %% =================================
    %% AC REFERENCES
    %% =================================
    %% AC-1: Online-only precondition for registration documented
    %% AC-2: Email verification online requirement noted
    %% AC-3: Token creation during registration mentioned
    %% AC-4: Offline mode available post-registration
```

## Offline Download & Registration Integration Notes

### 🔗 **Registration & Offline Mode Integration**

#### **Online-Only Registration Flow**
- **Network Dependency**: Registration requires active internet connection
- **Email Verification**: Verification emails and token validation need connectivity
- **Token Storage**: JWT tokens created and stored during successful registration
- **GlobalState Update**: Authentication state managed through GlobalState post-registration

#### **Offline Availability Post-Registration**
- **Session Downloads**: Available only after user completes registration and verification
- **Token Persistence**: Stored tokens enable authenticated offline operations
- **State Synchronization**: GlobalState maintains offline capabilities after registration
- **Quota Management**: User quota tracking requires initial online registration

#### **Error Handling Integration**
- **Network Errors**: Registration failures handled through AuthViewModel error flows
- **Offline Detection**: NetworkService provides connectivity status for UI feedback
- **Fallback Behavior**: Clear messaging when offline registration is attempted

## Offline Download & Availability Flow Notes

### 🎯 **Key Features**
- **Smart Download Detection**: Automatic offline availability checking through ViewModels
- **Permission Management**: PermissionService handles storage permissions properly
- **Offline State Reflection**: Consistent offline indicators via GlobalState
- **Graceful Degradation**: Feature disabling when offline without downloads

### 🔄 **MVVM Flow States**

#### **Download Status Check (MVVM Compliant)**
- **Automatic Detection**: HomeViewModel → AudioService → StorageService
- **State Updates**: GlobalState manages offline status across app
- **Visual Indicators**: ViewModels provide UI state to screens

#### **Download Process (Proper Separation)**
- **File Management**: AudioService coordinates with StorageService
- **Progress Tracking**: Real-time progress updates through ViewModel
- **Permission Flow**: PermissionService handles authorization properly

#### **Offline Mode Handling (ViewModel-Driven)**
- **Connectivity Check**: NetworkService provides network status
- **Feature Availability**: AudioGenerationViewModel evaluates capabilities
- **State Consistency**: GlobalState ensures consistent offline behavior

### 🏗️ **MVVM Architecture Integration**

#### **ViewModel Layer**
- **HomeViewModel**: Coordinates session loading and download management
- **AudioGenerationViewModel**: Handles review screen logic and offline evaluation
- **Proper Coordination**: ViewModels orchestrate multiple services

#### **Service Layer**
- **SessionService**: Session details and metadata with proper abstraction
- **AudioService**: Offline file management, download coordination, and status tracking
- **PermissionService**: Storage permission requests and status management
- **StorageService**: Local file system operations with proper encapsulation

#### **Infrastructure Layer**
- **NetworkService**: Connectivity monitoring for offline detection
- **NavigationService**: Centralized navigation between screens
- **GlobalState**: Unified state management for offline status

#### **Data Layer**
- **Offline Status Tracking**: Persistent availability state through StorageService
- **Local File Management**: Organized structure via AudioService
- **State Persistence**: GlobalState maintains offline status across app lifecycle

#### **UI Layer**
- **HomeScreen**: Pure UI that only interacts with HomeViewModel
- **ReviewScreen**: Offline-aware UI driven by AudioGenerationViewModel
- **Consistent Experience**: ViewModels ensure unified offline behavior

### 📱 **User Experience Features**

#### **Download Management**
- **One-Tap Download**: Simple download button for sessions
- **Progress Indicators**: Download status and completion feedback
- **Storage Awareness**: Clear indication of local vs cloud availability

#### **Offline Mode**
- **Feature Disabling**: Generate button disabled when offline
- **Playback Continuity**: Downloaded sessions remain fully functional
- **Clear Indicators**: "Offline Mode" badges and status messages

#### **Permission Handling**
- **Onboarding Integration**: Storage permission explained during onboarding
- **First-Time Flow**: Permission prompt only on first download
- **User Education**: Clear explanation of offline benefits

### 🔧 **Technical Considerations**

#### **Storage Management**
- **File Organization**: Structured local storage by session ID
- **Space Management**: Local storage quota monitoring
- **Cleanup Strategies**: Automatic cleanup of old downloads

#### **Offline Detection**
- **Network Monitoring**: Real-time connectivity status
- **State Synchronization**: Consistent offline status across screens
- **Cache Invalidation**: Proper offline status updates

#### **Performance Optimizations**
- **Lazy Loading**: Download status checked on-demand
- **Background Sync**: Offline status updates in background
- **Memory Management**: Efficient local file handling

### 🎵 **Audio Playback Integration**

#### **Offline Playback**
- **Local File Access**: Direct local file playback
- **Quality Preservation**: Maintain audio quality for offline use
- **Seamless Transition**: Online/offline playback switching

#### **Download Management**
- **Resume Capability**: Resume interrupted downloads
- **Batch Operations**: Multiple session downloads
- **Storage Optimization**: Compressed local storage when possible

### 🔒 **Security & Privacy**

#### **Permission Management**
- **Minimal Permissions**: Only storage access required
- **User Control**: Permission can be revoked in settings
- **Clear Purpose**: Permission purpose explained in onboarding

#### **Data Protection**
- **Local Encryption**: Optional local file encryption
- **Access Control**: User-specific download isolation
- **Privacy Compliance**: GDPR and privacy regulation adherence
```
