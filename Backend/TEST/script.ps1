$python_name = ""

try{
    python --version
    $python_name = "python"
}
catch {
    Write-Host "python is not installed"

    try {
        python3 --version
        $python_name = "python3"
    }
    catch {
        Write-Host "python3 is not installed"
    }

    try {
        py --version
        $python_name = "py"
    }
    catch {
        Write-Host "py is not installed"
    }
}

& $python_name -m venv .venv

Write-Host ((Split-Path $MyInvocation.InvocationName) + "\.venv\Scripts\Activate.ps1")

& powershell -file ((Split-Path $MyInvocation.InvocationName) + "\.venv\Scripts\Activate.ps1") 