// Load location on page load
async function loadLocation() {
    const locationInfo = document.getElementById("locationInfo");
    try {
        const response = await fetch("/api/location");
        const data = await response.json();
        if (data.success && data.location) {
            const loc = data.location;
            locationInfo.innerHTML = `<div style="display: grid; gap: 12px; text-align: left;"><div style="font-weight: 600; font-size: 15px; text-align: center; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb;">📍 Your Location</div><div style="display: flex; align-items: center; gap: 8px;"><span style="font-size: 18px;">🌍</span><span><strong>Location:</strong> ${loc.city || "Unknown"}, ${loc.region || ""} ${loc.country || ""}</span></div><div style="display: flex; align-items: center; gap: 8px;"><span style="font-size: 18px;">📶</span><span><strong>ISP:</strong> ${loc.isp || "Unknown"}</span></div><div style="display: flex; align-items: center; gap: 8px;"><span style="font-size: 18px;">🕐</span><span><strong>Timezone:</strong> ${loc.timezone || "Unknown"}</span></div><div style="display: flex; align-items: center; gap: 8px;"><span style="font-size: 18px;">🌐</span><span><strong>IP:</strong> ${loc.ip || "Unknown"}</span></div></div>`;
        } else {
            locationInfo.innerHTML = "<div>📍 Location unavailable</div>";
        }
    } catch (error) {
        locationInfo.innerHTML = "<div>📍 Could not load location</div>";
    }
}
window.addEventListener("DOMContentLoaded", loadLocation);

// Chart drawing functions
let chartData = [];
let uploadChartData = [];
let chart = null;
let isUploadTest = false;

function initChart() {
    const canvas = document.getElementById("speedChart");
    const container = document.getElementById("chartContainer");
    container.classList.add("active");
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = 150 * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    chart = { canvas, ctx, width: canvas.offsetWidth, height: 150 };
    chartData = [];
    uploadChartData = [];
}

function drawChart() {
    if (!chart) return;
    const ctx = chart.ctx;
    const width = chart.width;
    const height = chart.height;
    const data = isUploadTest ? uploadChartData : chartData;
    ctx.clearRect(0, 0, width, height);
    if (data.length < 2) return;
    const maxValue = Math.max(...data, 10);
    const padding = { left: 40, right: 20, top: 10, bottom: 10 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(padding.left + chartWidth, y);
        ctx.stroke();
    }
    ctx.fillStyle = "#9ca3af";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "right";
    for (let i = 0; i <= 4; i++) {
        const value = maxValue * (1 - i / 4);
        ctx.fillText(value.toFixed(1), padding.left - 5, padding.top + (chartHeight / 4) * i + 3);
    }
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    if (isUploadTest) {
        gradient.addColorStop(0, "#10b981");
        gradient.addColorStop(1, "#059669");
    } else {
        gradient.addColorStop(0, "#3b82f6");
        gradient.addColorStop(1, "#2563eb");
    }
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.beginPath();
    data.forEach((value, index) => {
        const x = padding.left + (index / (data.length - 1)) * chartWidth;
        const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();
    const fillGradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
    if (isUploadTest) {
        fillGradient.addColorStop(0, "rgba(16, 185, 129, 0.2)");
        fillGradient.addColorStop(1, "rgba(16, 185, 129, 0.02)");
    } else {
        fillGradient.addColorStop(0, "rgba(59, 130, 246, 0.3)");
        fillGradient.addColorStop(1, "rgba(37, 99, 235, 0.05)");
    }
    ctx.fillStyle = fillGradient;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top + chartHeight);
    data.forEach((value, index) => {
        const x = padding.left + (index / (data.length - 1)) * chartWidth;
        const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
        ctx.lineTo(x, y);
    });
    ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
    ctx.closePath();
    ctx.fill();
}

function updateStats(upload = false) {
    const data = upload ? uploadChartData : chartData;
    if (data.length === 0) return;
    const min = Math.min(...data);
    const avg = data.reduce((a, b) => a + b, 0) / data.length;
    const max = Math.max(...data);
    if (upload) {
        document.getElementById("minUploadSpeed").textContent = min.toFixed(1);
        document.getElementById("avgUploadSpeed").textContent = avg.toFixed(1);
        document.getElementById("maxUploadSpeed").textContent = max.toFixed(1);
        document.getElementById("uploadStats").style.display = "block";
    } else {
        document.getElementById("minSpeed").textContent = min.toFixed(1);
        document.getElementById("avgSpeed").textContent = avg.toFixed(1);
        document.getElementById("maxSpeed").textContent = max.toFixed(1);
    }
}

function calculateQualityScore(downloadSpeed, uploadSpeed) {
    // Quality score based on typical internet usage patterns
    let score = 0;
    let rating = "";
    let color = "";
    
    // Download score (60% weight)
    if (downloadSpeed >= 100) score += 60;
    else if (downloadSpeed >= 50) score += 50;
    else if (downloadSpeed >= 25) score += 40;
    else if (downloadSpeed >= 10) score += 25;
    else if (downloadSpeed >= 5) score += 15;
    else score += Math.max(0, downloadSpeed * 2);
    
    // Upload score (40% weight)
    if (uploadSpeed >= 50) score += 40;
    else if (uploadSpeed >= 20) score += 35;
    else if (uploadSpeed >= 10) score += 25;
    else if (uploadSpeed >= 5) score += 15;
    else if (uploadSpeed >= 2) score += 10;
    else score += Math.max(0, uploadSpeed * 3);
    
    // Rating based on score
    if (score >= 90) { rating = "Excellent"; color = "#10b981"; }
    else if (score >= 70) { rating = "Good"; color = "#3b82f6"; }
    else if (score >= 50) { rating = "Fair"; color = "#f59e0b"; }
    else if (score >= 30) { rating = "Poor"; color = "#f97316"; }
    else { rating = "Very Poor"; color = "#dc2626"; }
    
    return { score: Math.round(score), rating, color };
}

function showQualityScore(downloadSpeed, uploadSpeed) {
    const quality = calculateQualityScore(downloadSpeed, uploadSpeed);
    const qualityDiv = document.getElementById("qualityScore");
    qualityDiv.innerHTML = `
        <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #f6f8fb 0%, #ffffff 100%); border-radius: 16px; border: 2px solid ${quality.color}; margin-top: 20px;">
            <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px; font-weight: 600;">CONNECTION QUALITY</div>
            <div style="font-size: 48px; font-weight: 800; color: ${quality.color}; line-height: 1;">${quality.score}</div>
            <div style="font-size: 18px; font-weight: 700; color: ${quality.color}; margin-top: 8px;">${quality.rating}</div>
            <div style="font-size: 12px; color: #9ca3af; margin-top: 12px;">
                ${quality.score >= 90 ? "Perfect for 4K streaming, gaming, and video calls!" : 
                  quality.score >= 70 ? "Great for HD streaming and online gaming!" :
                  quality.score >= 50 ? "Suitable for browsing and SD video streaming." :
                  quality.score >= 30 ? "Basic browsing only. Streaming may buffer." :
                  "Very slow connection. Consider upgrading your plan."}
            </div>
        </div>
    `;
    qualityDiv.style.display = "block";
}

async function shareResults() {
    const downloadSpeed = document.getElementById("downloadSpeed").textContent;
    const uploadSpeed = document.getElementById("uploadSpeed").textContent;
    const quality = calculateQualityScore(parseFloat(downloadSpeed), parseFloat(uploadSpeed));
    
    // Create a canvas for the share image
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    
    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, 800);
    bgGradient.addColorStop(0, '#3b82f6');
    bgGradient.addColorStop(1, '#2563eb');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 600, 800);
    
    // Title
    ctx.fillStyle = 'white';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Internet Speed Test', 300, 60);
    
    // Results box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(40, 100, 520, 600);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 100, 520, 600);
    
    // Download speed
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('⬇ DOWNLOAD SPEED', 300, 180);
    ctx.font = 'bold 64px Arial';
    const downloadGradient = ctx.createLinearGradient(0, 200, 0, 260);
    downloadGradient.addColorStop(0, '#3b82f6');
    downloadGradient.addColorStop(1, '#2563eb');
    ctx.fillStyle = downloadGradient;
    ctx.fillText(downloadSpeed, 300, 250);
    ctx.font = '24px Arial';
    ctx.fillStyle = '#64748b';
    ctx.fillText('Mb/s', 300, 285);
    
    // Upload speed
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('⬆ UPLOAD SPEED', 300, 370);
    ctx.font = 'bold 64px Arial';
    const uploadGradient = ctx.createLinearGradient(0, 390, 0, 450);
    uploadGradient.addColorStop(0, '#10b981');
    uploadGradient.addColorStop(1, '#059669');
    ctx.fillStyle = uploadGradient;
    ctx.fillText(uploadSpeed, 300, 440);
    ctx.font = '24px Arial';
    ctx.fillStyle = '#64748b';
    ctx.fillText('Mb/s', 300, 475);
    
    // Quality score
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('CONNECTION QUALITY', 300, 550);
    ctx.font = 'bold 72px Arial';
    ctx.fillStyle = quality.color;
    ctx.fillText(quality.score.toString(), 300, 620);
    ctx.font = 'bold 28px Arial';
    ctx.fillText(quality.rating, 300, 660);
    
    // Footer
    ctx.fillStyle = 'white';
    ctx.font = '18px Arial';
    ctx.fillText('testingnetspeed.vercel.app', 300, 750);
    
    // Convert canvas to blob and share
    canvas.toBlob(async (blob) => {
        const file = new File([blob], 'speed-test-results.png', { type: 'image/png' });
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    title: 'My Internet Speed Test Results',
                    text: `Download: ${downloadSpeed} Mb/s, Upload: ${uploadSpeed} Mb/s - Quality Score: ${quality.score}/100 (${quality.rating})`,
                    files: [file]
                });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Share failed:', err);
                    downloadImage(blob);
                }
            }
        } else {
            downloadImage(blob);
        }
    });
}

function downloadImage(blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'speed-test-results.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Speed test function with real-time upload graph
async function runTest() {
    const testBtn = document.getElementById("testBtn");
    const downloadSpeed = document.getElementById("downloadSpeed");
    const uploadSpeed = document.getElementById("uploadSpeed");
    const status = document.getElementById("status");
    const downloadBox = document.getElementById("downloadBox");
    const uploadBox = document.getElementById("uploadBox");
    const shareBtn = document.getElementById("shareBtn");
    const qualityDiv = document.getElementById("qualityScore");
    
    testBtn.disabled = true;
    shareBtn.style.display = "none";
    qualityDiv.style.display = "none";
    downloadSpeed.textContent = "0.00";
    uploadSpeed.textContent = "0.00";
    status.textContent = "Testing download...";
    status.className = "status";
    downloadBox.classList.add("active");
    uploadBox.classList.remove("active");
    isUploadTest = false;
    initChart();
    
    try {
        // Download test
        const downloadUrl = "https://speed.cloudflare.com/__down?bytes=25000000";
        let totalBytes = 0;
        const startTime = Date.now();
        let lastUpdate = startTime;
        let lastBytes = 0;
        
        for (let i = 0; i < 3; i++) {
            const response = await fetch(downloadUrl);
            const reader = response.body.getReader();
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                totalBytes += value.length;
                const now = Date.now();
                
                if (now - lastUpdate > 200) {
                    const timeDiff = (now - lastUpdate) / 1000;
                    const bytesDiff = totalBytes - lastBytes;
                    const speedMbps = (bytesDiff * 8) / (1000000 * timeDiff);
                    chartData.push(speedMbps);
                    downloadSpeed.textContent = speedMbps.toFixed(2);
                    drawChart();
                    updateStats(false);
                    lastUpdate = now;
                    lastBytes = totalBytes;
                }
            }
        }
        
        const avgDownload = chartData.reduce((a, b) => a + b, 0) / chartData.length;
        downloadSpeed.textContent = avgDownload.toFixed(2);
        drawChart();
        updateStats(false);
        downloadBox.classList.remove("active");
        
        // Upload test
        await testUpload();
        
    } catch (error) {
        downloadSpeed.textContent = "0.00";
        uploadSpeed.textContent = "0.00";
        status.textContent = "Error: " + error.message;
        status.className = "status error";
    } finally {
        testBtn.disabled = false;
    }
}

async function testUpload() {
    const uploadSpeed = document.getElementById("uploadSpeed");
    const status = document.getElementById("status");
    const uploadBox = document.getElementById("uploadBox");
    const shareBtn = document.getElementById("shareBtn");
    const downloadSpeed = document.getElementById("downloadSpeed");
    
    uploadBox.classList.add("active");
    status.textContent = "Testing upload...";
    isUploadTest = true;
    uploadChartData = [];
    
    try {
        const chunkSize = 1024 * 1024 * 2; // 2MB chunks for more frequent updates
        const testDuration = 10000; // 10 seconds max
        const startTime = Date.now();
        let lastUpdate = startTime;
        let totalUploaded = 0;
        
        while (Date.now() - startTime < testDuration) {
            const chunk = new ArrayBuffer(chunkSize);
            const uploadStart = Date.now();
            
            try {
                const response = await fetch("https://httpbin.org/post", {
                    method: "POST",
                    body: chunk,
                    headers: { "Content-Type": "application/octet-stream" }
                });
                await response.text();
                
                const uploadTime = Date.now() - uploadStart;
                totalUploaded += chunkSize;
                
                if (uploadTime > 0) {
                    const speedMbps = (chunkSize * 8) / (uploadTime / 1000) / 1000000;
                    uploadChartData.push(speedMbps);
                    uploadSpeed.textContent = speedMbps.toFixed(2);
                    drawChart();
                    updateStats(true);
                }
                
                // Break if we have enough data points
                if (uploadChartData.length >= 15) break;
                
            } catch (err) {
                console.error("Upload chunk failed:", err);
                break;
            }
        }
        
        if (uploadChartData.length > 0) {
            const avgUpload = uploadChartData.reduce((a, b) => a + b, 0) / uploadChartData.length;
            uploadSpeed.textContent = avgUpload.toFixed(2);
            drawChart();
            updateStats(true);
            
            // Show quality score
            const downloadSpeedValue = parseFloat(downloadSpeed.textContent);
            const uploadSpeedValue = parseFloat(uploadSpeed.textContent);
            showQualityScore(downloadSpeedValue, uploadSpeedValue);
        }
        
        status.textContent = "Test complete";
        uploadBox.classList.remove("active");
        shareBtn.style.display = "inline-block";
        
    } catch (error) {
        uploadSpeed.textContent = "0.00";
        status.textContent = "Upload test failed";
        console.error(error);
    }
}

// Service Worker registration
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/public/sw.js")
            .then(reg => console.log("SW registered"))
            .catch(err => console.log("SW registration failed"));
    });
}
