# 기사의 여행 (데블스플랜2)

기사(♞)로 모든 칸을 한 번씩 방문하는 브라우저 보드게임입니다. React + Vite + Tailwind CSS로 구현되었으며, 5×5 \~ 13×13 보드 크기를 지원합니다.

---

## 주요 기능

* **보드 크기 선택**: 5×5 \~ 9x9
* **Knight 이동**: 체스 기사의 이동 규칙
* **방문 표시**: 방문한 칸은 진한 빨강 그라데이션과 그림자 효과(`.visited`)
* **실패 조건**:

  1. 이미 방문한 칸 클릭시
  2. 이동 가능한 칸이 없을 때
* **성공 조건**: 모든 칸 방문 완료
* **타이머**: Total Time(분:초) 실시간 표시
* **완료 기록**: 보드 크기별 성공 시간 목록

## 로컬 개발 환경

### 요구사항

* Node.js >= 18.x (LTS 20.x 권장)
* npm >= 10.x
* Ubuntu 22.04 (배포 시)

### 설치 및 실행

```bash
# 프로젝트 클론
git clone https://github.com/dgr009/knight_tour
cd knight-tour/app

# 의존성 설치
npm install

# 개발 모드로 실행
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 빌드

```bash
npm run build
# dist/ 폴더에 정적 파일 생성
```

## 배포 (Ubuntu 22.04 + Nginx)

1. **Node 설치** (LTS 20.x)

   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   ```
2. **프로젝트 복사**

   ```bash
   sudo cp -r /local/knight-tour/app /var/www/knight-tour
   cd /var/www/knight-tour/app
   ```
3. **의존성 설치 & 빌드**

   ```bash
   npm install
   npm run build
   ```
4. **Nginx 설정** (`/etc/nginx/conf.d/knighttour.conf`)

   ```nginx
   server {
     listen 80;
     server_name your.domain.or.ip;

     root /var/www/knight-tour/app/dist;
     index index.html;

     location / {
       try_files $uri /index.html;
     }

     location ~* \.(?:js|css|svg|ico|ttf|woff2?)$ {
       expires 30d;
       add_header Cache-Control "public";
       access_log off;
     }
   }
   ```

   ```bash
   sudo ln -s /etc/nginx/conf.d/knighttour.conf /etc/nginx/conf.d/default.conf
   sudo nginx -t
   sudo systemctl reload nginx
   ```
5. **HTTPS (Let’s Encrypt)**

   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d your.domain.or.ip
   ```

## custom CSS (`index.css`)

```css
.visited {
  background-image: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
  box-shadow: 0 0 6px rgba(239, 68, 68, 0.6);
  color: #fff;
}
@keyframes bounce-xs {0%,100%{transform:translateY(0)}50%{transform:translateY(-4%)}}
.animate-bounce-xs {animation: bounce-xs 0.6s infinite;}
```

## 기타

* `npm ci` 사용 전 반드시 `package-lock.json` 존재 필요
* `reset(size)` 로 보드 크기 변경 시 완전 초기화
* 문의: `issues`에 이슈 등록해주세요
