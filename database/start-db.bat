@echo off
echo Starting MongoDB...
echo.
echo Option 1: Using Docker (recommended)
echo   docker compose -f "%~dp0docker-compose.yml" up -d
echo.
echo Option 2: Using locally installed MongoDB
echo   mongod --dbpath "%~dp0mongodb\data"
echo.
if exist "C:\Program Files\MongoDB\Server\*\bin\mongod.exe" (
    for /d %%i in ("C:\Program Files\MongoDB\Server\*") do (
        if exist "%%i\bin\mongod.exe" (
            echo Starting local MongoDB...
            start "MongoDB" "%%i\bin\mongod" --dbpath "%~dp0mongodb\data"
            echo MongoDB started on port 27017
            goto :end
        )
    )
) else (
    echo MongoDB not found locally.
    echo Install Docker or MongoDB manually.
    echo Download: https://www.mongodb.com/try/download/community
)
:end
pause
