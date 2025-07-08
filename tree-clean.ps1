Write-Host "Gerando estrutura de arquivos..." -ForegroundColor Cyan

$basePath = (Get-Location).Path

Get-ChildItem -Recurse -Directory -Force |
Where-Object {
    $_.FullName -notmatch '\\(node_modules|dist|.git)(\\|$)'
} |
ForEach-Object {
    $depth = ($_.FullName -replace [regex]::Escape($basePath), '').Split('\').Where({$_ -ne ''}).Count
    (' ' * ($depth * 2)) + '📁 ' + $_.Name
}

Get-ChildItem -Recurse -File -Force |
Where-Object {
    $_.FullName -notmatch '\\(node_modules|dist|.git)(\\|$)'
} |
ForEach-Object {
    $depth = ($_.DirectoryName -replace [regex]::Escape($basePath), '').Split('\').Where({$_ -ne ''}).Count
    (' ' * ($depth * 2)) + '📄 ' + $_.Name
}
