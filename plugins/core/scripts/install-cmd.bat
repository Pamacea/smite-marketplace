@echo off
REM Claude Code Aliases Installer for cmd.exe
REM This script creates cc.bat and ccc.bat in a directory on your PATH

setlocal enabledelayedexpansion

echo.
echo Installing Claude Code Aliases for cmd.exe
echo ============================================
echo.

REM Find a suitable directory in PATH
set "TARGET_DIR="
for %%p in (%PATH%) do (
    if exist "%%~p\" (
        if "%%~p"=="%USERPROFILE%\AppData\Local\Microsoft\WindowsApps" (
            REM Skip WindowsApps (read-only)
        ) else (
            set "TARGET_DIR=%%~p"
            goto :found
        )
    )
)

:found
if "%TARGET_DIR%"=="" (
    echo ERROR: Could not find writable directory in PATH
    echo Please add a directory to your PATH manually
    pause
    exit /b 1
)

echo Found target directory: %TARGET_DIR%
echo.

REM Create cc.bat
echo @echo off> "%TARGET_DIR%cc.bat"
echo claude %%*>> "%TARGET_DIR%cc.bat"
echo Created cc.bat

REM Create ccc.bat
echo @echo off> "%TARGET_DIR%ccc.bat"
echo claude --permission-mode bypassPermissions %%*>> "%TARGET_DIR%ccc.bat"
echo Created ccc.bat

echo.
echo SUCCESS! Aliases installed for cmd.exe
echo.
echo Aliases created:
echo    cc    -^> claude
echo    ccc   -^> claude --permission-mode bypassPermissions
echo.
echo You can now use: cc and ccc in cmd.exe
echo.

endlocal
