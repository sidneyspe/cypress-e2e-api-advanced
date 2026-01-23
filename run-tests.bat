@echo off
REM ============================================
REM Script de Execucao de Testes Cypress
REM ============================================

echo.
echo ============================================
echo    CYPRESS TEST RUNNER
echo ============================================
echo.

REM Limpa resultados anteriores
echo [1/4] Limpando resultados anteriores...
if exist "cypress\screenshots" rd /s /q "cypress\screenshots"
if exist "cypress\results" rd /s /q "cypress\results"
mkdir "cypress\results\json" 2>nul
mkdir "cypress\results\mochawesome" 2>nul
echo       Concluido!
echo.

REM Executa os testes
echo [2/4] Executando testes Cypress...
echo.
call npx cypress run --browser electron
set TEST_EXIT_CODE=%ERRORLEVEL%
echo.

REM Mescla os relatorios JSON
echo [3/4] Mesclando relatorios...
call npx mochawesome-merge cypress/results/json/*.json -o cypress/results/output.json
echo       Concluido!
echo.

REM Gera o relatorio HTML
echo [4/4] Gerando relatorio HTML...
call npx marge cypress/results/output.json --reportDir cypress/results/mochawesome --inline --charts true
echo       Concluido!
echo.

REM Exibe resumo
echo ============================================
echo    RESUMO DA EXECUCAO
echo ============================================
if %TEST_EXIT_CODE%==0 (
    echo    Status: TODOS OS TESTES PASSARAM
) else (
    echo    Status: ALGUNS TESTES FALHARAM
)
echo    Relatorio: cypress\results\mochawesome\cypress\results\output.html
echo ============================================
echo.

REM Abre o relatorio
echo Abrindo relatorio...
start "" "cypress\results\mochawesome\cypress\results\output.html"

exit /b %TEST_EXIT_CODE%
