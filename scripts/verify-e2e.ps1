# ScamShield AI — quick end-to-end verification
$base = "http://localhost:3010"
Write-Host "ScamShield E2E check → $base" -ForegroundColor Cyan

function Test-Endpoint($path, $method = "GET", $body = $null) {
  try {
    $params = @{ Uri = "$base$path"; Method = $method; UseBasicParsing = $true }
    if ($body) {
      $params.ContentType = "application/json"
      $params.Body = ($body | ConvertTo-Json)
    }
    $r = Invoke-WebRequest @params
    Write-Host "[OK] $method $path → $($r.StatusCode)" -ForegroundColor Green
    return $r.Content
  } catch {
    Write-Host "[FAIL] $method $path → $($_.Exception.Message)" -ForegroundColor Red
    return $null
  }
}

Test-Endpoint "/api/health"
Test-Endpoint "/api/ai/status"
$scanBody = @{
  content = "URGENT: Your PayPal account limited. Click http://bit.ly/fake-paypal now!"
}
Test-Endpoint "/api/ai/analyze" "POST" $scanBody
Test-Endpoint "/api/ai/chat" "POST" @{ message = "How do I spot phishing?" }

Write-Host "`nOpen $base in your browser to test the UI." -ForegroundColor Yellow
