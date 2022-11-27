# SLACK
**Slack**은 협업과 소통에 꼭! 필요한 협업 메신저 입니다. 💬 

## Installation
```bash
npm run dev
```
</br>

## 프로젝트 개요

**프로젝트 기간**  :  2022.10 ~ 2022.11

**서비스 종류** : Website

**프로젝트 참여 인원** : Front-End 1명 (개인)

**Slack 주요 기능**

- 실시간 온라인 체크 및 대화 (채널단위 or DM)
- 채널 및 워크스페이스 생성
- 생성한 채널/워크스페이스에 사용자 초대

[기술 세부 설명](https://magenta-forest-566.notion.site/slack-c4fe244a9b1f474aa1fa86ca1e7a01b5)

</br>

## 사용한 기술 스택
- TypeScript
- Node.js
- React
- Soket.io
- SWR
- Axios
- Webpack

</br>


## Folder Structure

```bash                           
├── components    # 기타 컴포넌트
├── hooks         # 커스텀 훅 모음        
├── layouts       # 레이아웃 단위 컴포넌트  
├── pages         # 페이지 단위 컴포넌트   
├── typings       # 타입 정의
├── utils         # 함수 모음
├── README.md               
└── ...
```

</br>

## REST API
HTTP 요청 리스트(ajax)
### GET /workspaces
- 내 워크스페이스 목록을 가져옴
- return: IWorkspace[]
### POST /workspaces
- 워크스페이스를 생성함
- body: { workspace: string(이름), url: string(주소) }
- return: IWorkspace
### GET /workspaces/:workspace/channels
- :workspace 내부의 내가 속해있는 채널 리스트를 가져옴
- return: IChannel[]
### POST /workspaces/:workspace/channels
- :workspace 내부에 채널을 생성함
- body: { name: string(이름) }
- return: IChannel
### GET /workspaces/:workspace/channels/:channel
- :workspace 내부의 :channel 정보를 가져옴
- return: IChannel
### GET /workspaces/:workspace/channels/:channel/chats
- :workspace 내부의 :channel의 채팅을 가져옴
- query: { perPage: number(한 페이지 당 몇 개), page: number(페이지) }
- return: IChat[]
### GET /workspaces/:workspace/channels/:channel/unreads
- :workspace 내부의 :channel의 안 읽은 채팅 유무를 가져옴
- query: { after: Timestamp }
- return: number
### POST /workspaces/:workspace/channels/:channel/chats
- :workspace 내부의 :channel의 채팅을 저장
- body: { content: string(내용) }
- return: 'ok'
- message 소켓 이벤트가 emit됨
### POST /workspaces/:workspace/channels/:channel/images
- :workspace 내부의 :channel의 이미지를 저장
- body: { image: 이미지(multipart) }
- return: 'ok'
- message 소켓 이벤트가 emit됨
### GET /workspaces/:workspace/dms/:id/chats
- :workspace 내부의 :id와 나눈 dm을 가져옴
- query: { perPage: number(한 페이지 당 몇 개), page: number(페이지) }
- return: IDM[]
### GET /workspaces/:workspace/dms/:id/unreads
- :workspace 내부의 :id가 보낸 안 읽은 채팅 수를 가져옴.
- query: { after: Timestamp }
- return: number
### POST /workspaces/:workspace/dms/:id/chats
- :workspace 내부의 :id와 나눈 dm을 저장
- body: { content: string(내용) }
- return: 'ok'
- dm 소켓 이벤트가 emit 됨
### POST /workspaces/:workspace/dms/:id/images
- :workspace 내부의 :id에게 보낸 이미지 저장
- body: { image: 이미지(multipart) }
- return: 'ok'
- dm 소켓 이벤트가 emit 됨
### GET /workspaces/:workspace/members
- :workspace 내부의 멤버 목록을 가져옴
- return: IUser[]
### POST /workspaces/:workspace/members
- :workspace 로 멤버 초대
- body: { email: string(이메일) }
- return: 'ok'
### DELETE /workspaces/:workspace/members/:id
- :workspace 에서 :id 멤버 제거(또는 탈퇴)
- return 'ok'
### GET /workspaces/:workspace/channels/:channel/members
- :workspace 내부의 :channel 멤버 목록을 가져옴
- return: IUser[]
### POST /workspaces/:workspace/channels/:channel/members
- :workspace 내부의 :channel 로 멤버 초대
- body: { email: string(이메일) }
- return: 'ok'
### GET /users
- 내 로그인 정보를 가져옴, 로그인되어있지 않으면 false
- return: IUser | false
### GET /workspaces/:workspace/users/:id
- :workspace 의 멤버인 특정 :id 사용자 정보를 가져옴
- return: IUser
### POST /users
- 회원가입
- body: { email: string(이메일), nickname: string(닉네임), password: string(비밀번호) }
- return: 'ok'
### POST /users/login
- 로그인
- body: { email: string(이메일), password: string(비밀번호) }
- return: IUser
### POST /users/logout
- 로그아웃
- return: 'ok'

# WebSocket
웹소켓 API
## socket.on
서버에서 클라이언트로 보내는 이벤트(클라이언트에서는 on으로 받음)
### hello
- 소켓 연결 테스트용 API
- 서버 data: string(네임스페이스 이름)
### onlineList
- 현재 온라인인 사람들 아이디 목록
- 서버 data: number[](아이디 목록)
### message
- 새로운 채널 메시지가 올 때
- 서버 데이터: IChat(채팅 데이터)
### dm
- 새로운 dm 메시지가 올 때
- 서버 데이터: IDM(dm 데이터)

## socket.emit
클라이언트에서 서버로 보내는 이벤트(클라이언트에서는 emit으로 보냄)
### login
- 워크스페이스, 채널이 로딩 완료되었을 때 서버에 로그인했음을 알리는 이벤트
- 클라이언트 data: { id: number(유저 아이디), channels: number[](채널 아이디 리스트) }

## disconnect
- 클라이언트에서 소켓 연결을 종료하는 함수
