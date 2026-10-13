$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$configPath = Join-Path $PSScriptRoot '.local\development\database.json'
if (-not (Test-Path -LiteralPath $configPath)) { throw 'Start Travelwise eerst lokaal met Start-Travelwise.ps1.' }
$config = Get-Content -LiteralPath $configPath -Raw | ConvertFrom-Json
$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
$travelwiseNode = if ($nodeCommand) { $nodeCommand.Source } else { Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' }
$originalDatabase = $env:DATABASE_URL
$originalEmail = $env:ADMIN_EMAIL
$originalPassword = $env:ADMIN_PASSWORD
$adminExitCode = 1
try {
    $env:DATABASE_URL = 'postgresql://' + $config.user + ':' + $config.password + '@127.0.0.1:' + $config.port + '/travelwise_local'
    $env:ADMIN_EMAIL = Read-Host 'E-mailadres voor je Travelwise-account'
    $securePassword = Read-Host 'Kies een wachtwoord van minimaal 12 tekens' -AsSecureString
    $env:ADMIN_PASSWORD = [System.Net.NetworkCredential]::new('', $securePassword).Password
    & $travelwiseNode 'apps/web/scripts/init-admin.ts'
    $adminExitCode = $LASTEXITCODE
} finally {
    $env:DATABASE_URL = $originalDatabase
    $env:ADMIN_EMAIL = $originalEmail
    $env:ADMIN_PASSWORD = $originalPassword
    if ($securePassword) { $securePassword.Dispose() }
}
exit $adminExitCode
