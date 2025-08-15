[![Release & Deploy to Production](https://github.com/shahdeys/website/actions/workflows/deploy.yml/badge.svg?branch=master)](https://github.com/shahdeys/website/actions/workflows/deploy.yml)
# website
Bespoke portfolio software developed since 2014

## Software used
* Elixir 1.16.1
* Erlang OTP 26.2.2
* Phoenix LiveView 0.18
* Docker
* Bootstrap 4

## Local dev
#### ASDF troubleshooting/upgrading Elixir/Erlang
- Make sure that:
    - uninstall old versions
    - install new versions
    - reshim tools
    - update tools in `/Users/<name>/.tool-versions`
#### Run unit tests locally
- `mix test`
#### Docker specific commands
- `docker build --no-cache -f Dockerfile -t website:latest .`
    - this will build the local dev file with the latest tag
- `docker run -it -p 4000:4000 -e SECRET_KEY_BASE="<secret_val_here>" website`
    - this will run the docker image locally with the secret env var
#### Elixir specific commands
- `mix phx.server`
    - this will run the elixir mix task to compile, then run the Phoenix LiveView web app on the configured endpoint

## Todo
* Public upload directory so I can hotlink the hottest memes to my frands
* Add minimal footer
    * Add section for music production/hobbies
    * Add reddit social link
* Add mailer functionality to submit form based email on Contact Page
* Update/Fix items in static code analysis report with  `mix credo`
* Redesign front-end using TailwindCSS vs. Bootstrap
* ~~Update to Elixir 1.14~~
* ~~Update to Erlang/OTP 25~~
* ~~Update to Phoenix 1.7~~
* ~~* Add more comprehensive unit tests~~
* ~~Update styling sheets to use Bootstrap 5.2~~
* ~~Add blogging system using Nimble Publisher~~
* ~~Add CI/CD pipeline with GHAW + Fly.io~~
* ~~Add trivial unit tests~~
* ~~Add robots.txt~~
* ~~Fix bug where clicking projects nav menu and then not selecting anything will still have the button highlighted on projects (even though that page isn't selected)~~
* ~~Fix bug where hotlinking a page should highlight nav menu~~
* ~~Convert to Elixir~~
* ~~Fix common issues using Google Lighthouse: https://lighthouse-dot-webdotdevsite.appspot.com//lh/html?url=http://www.shahsyed.com~~
* ~~Add SEO to site~~
* ~~Update proj. dependencies and remove security vulns~~
* ~~* Automatic SSL Certification creation and allocation~~
* ~~Add SoundCloud link to bottom of navbar~~
* ~~Clean up classes~~
* ~~Reorganize file structure and TypeScript classes~~
* ~~Add Spotify profile to footer~~
* ~~Fix bug where you scroll down and footer is not responsive and there are spacing issues around it~~
* ~~remove DS store from repo~~
* ~~Add HTTPS to not make website throw errors when visiting~~
* ~~Dockerize NodeJS application~~
* ~~Update to NG 8~~
* ~~Update site from AngularJS 2.0 Beta 7 to Angular (AngularJS 4.0)~~
* ~~Create build scripts for production~~
* ~~Add Contact section/form to create a draft, add form validation/sanitation~~
* ~~Validate HTML~~
* ~~Deploy site (go live!)~~
* ~~Add page analytics~~
* ~~Add resume as a pdf or use Mozilla/Google PDF viewer/Resume viewer respectively~~
* ~~Add animate.css class~~
* ~~Add intro animation for page~~
* ~~Make footer static/sticky at bottom of screen~~
* ~~Add CSS for nav sidebar, add padding for sidebar and content sections~~
* ~~Add images/logo.svg on navigation section~~
* ~~Add social media links on front page~~
* ~~Fix style sheets~~
* ~~Design Projects display system to either use bootstrap modal or make interactive thumbnails~~  
