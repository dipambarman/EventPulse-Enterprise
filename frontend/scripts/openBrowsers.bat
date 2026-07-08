@echo off
REM Batch script to open the website in Edge and Firefox browsers

REM Set your local website URL here
set WEBSITE_URL=http://localhost:5000

REM Open Microsoft Edge
start msedge %WEBSITE_URL%

REM Open Mozilla Firefox
start firefox %WEBSITE_URL%

echo Opened website in Edge and Firefox.
