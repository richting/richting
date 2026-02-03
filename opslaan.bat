@echo off
echo ===========================================
echo   WIJZIGINGEN OPSLAAN NAAR GITHUB
echo ===========================================
echo.
echo 1. Bestanden worden klaargezet...
git add .

echo.
set /p msg="2. Wat heb je veranderd? (Typ een korte omschrijving en druk op Enter): "
if "%msg%"=="" set msg=Update vanuit script

echo.
echo 3. Bezig met versturen...
git commit -m "%msg%"
git push

echo.
echo ===========================================
echo   KLAAR! Alles staat veilig op GitHub.
echo ===========================================
pause
