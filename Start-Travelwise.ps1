$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCommand) { $travelwiseNode = $nodeCommand.Source } else { $travelwiseNode = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' }
if (-not (Test-Path -LiteralPath $travelwiseNode)) { throw 'Node.js 24 ontbreekt. Installeer Node.js en probeer opnieuw.' }
& $travelwiseNode 'scripts/local-development.mjs'
exit $LASTEXITCODE
