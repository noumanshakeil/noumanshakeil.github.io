Public download host for **PocketMind** Windows packages, plus product privacy policies.

## Live site

https://noumanshakeil.github.io/

## Privacy policy (PocketMind: AI Receptionist Studio)

https://noumanshakeil.github.io/#privacy-policy

Source of truth is `store-listing/privacy.html` and in-app `#/privacy` on
`noumanshakeil/ai-receptionist-platform` (`main`). Use this URL in Microsoft
Partner Center for the Receptionist Studio Store listing.

## Privacy policy (Reviewer And Humanizer)

https://noumanshakeil.github.io/#privacy-reviewer-and-humanizer

## Store package URL (Hybrid AI x64 NSIS)

https://noumanshakeil.github.io/downloads/1.0.0/PocketMind-Hybrid-AI_1.0.0_x64-setup.exe

## Upload binaries (from your Windows PC)

```powershell
cd $HOME\noumanshakeil.github.io   # or wherever you cloned this repo
git pull

$payload = "D:\nexus-ai-deep-fixed\distribution\windows-desktop\payload"
$dest = ".\downloads\1.0.0"

Copy-Item "$payload\PocketMind Hybrid AI_1.0.0_x64-setup.exe" `
  "$dest\PocketMind-Hybrid-AI_1.0.0_x64-setup.exe" -Force
Copy-Item "$payload\PocketMind Hybrid AI_1.0.0_x64_en-US.msi" `
  "$dest\PocketMind-Hybrid-AI_1.0.0_x64_en-US.msi" -Force
Copy-Item "$payload\PocketMind Hybrid AI.exe" `
  "$dest\PocketMind-Hybrid-AI.exe" -Force

git add downloads/1.0.0
git commit -m "Add PocketMind Hybrid AI 1.0.0 Windows installers"
git push
```

Do **not** commit the full `bin\llama.cpp` tree to GitHub Pages (too large). Ship runtimes in the tester zip / separate release.
