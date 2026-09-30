# Compila el CSS de Tailwind (src/css/input.css -> dist/css/style.css)
# Uso:
#   .\build.ps1          -> build una vez
#   .\build.ps1 -Watch   -> recompila automáticamente al guardar cambios

param(
  [switch]$Watch
)

$tailwind = Join-Path $PSScriptRoot "tools\tailwindcss.exe"
$input    = Join-Path $PSScriptRoot "src\css\input.css"
$output   = Join-Path $PSScriptRoot "dist\css\style.css"

if ($Watch) {
  & $tailwind -i $input -o $output --watch
} else {
  & $tailwind -i $input -o $output --minify
}
