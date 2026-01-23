# ============================================
# Script de Execucao de Testes Cypress
# PowerShell Version
# ============================================

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   CYPRESS TEST RUNNER" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Limpa resultados anteriores
Write-Host "[1/4] Limpando resultados anteriores..." -ForegroundColor Yellow
$dirsToClean = @("cypress\screenshots", "cypress\results")
foreach ($dir in $dirsToClean) {
    if (Test-Path $dir) {
        Remove-Item -Recurse -Force $dir
    }
}
New-Item -ItemType Directory -Force -Path "cypress\results\json" | Out-Null
New-Item -ItemType Directory -Force -Path "cypress\results\mochawesome" | Out-Null
Write-Host "      Concluido!" -ForegroundColor Green
Write-Host ""

# Executa os testes
Write-Host "[2/4] Executando testes Cypress..." -ForegroundColor Yellow
Write-Host ""
& npx.cmd cypress run --browser electron
$testExitCode = $LASTEXITCODE
Write-Host ""

# Mescla os relatorios JSON
Write-Host "[3/4] Mesclando relatorios..." -ForegroundColor Yellow
& npx.cmd mochawesome-merge cypress/results/json/*.json -o cypress/results/output.json
Write-Host "      Concluido!" -ForegroundColor Green
Write-Host ""

# Gera o relatorio HTML
Write-Host "[4/4] Gerando relatorio HTML..." -ForegroundColor Yellow
& npx.cmd marge cypress/results/output.json --reportDir cypress/results/mochawesome --inline --charts true
Write-Host "      Concluido!" -ForegroundColor Green
Write-Host ""

# Exibe resumo
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   RESUMO DA EXECUCAO" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
if ($testExitCode -eq 0) {
    Write-Host "   Status: TODOS OS TESTES PASSARAM" -ForegroundColor Green
} else {
    Write-Host "   Status: ALGUNS TESTES FALHARAM" -ForegroundColor Red
}

$reportPath = "cypress\results\mochawesome\cypress\results\output.html"
Write-Host "   Relatorio: $reportPath" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Abre o relatorio
Write-Host "Abrindo relatorio..." -ForegroundColor Yellow
if (Test-Path $reportPath) {
    Invoke-Item $reportPath
}

exit $testExitCode
